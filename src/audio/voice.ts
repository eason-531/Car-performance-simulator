import type { TransmissionType } from '../data/types';
import type { SoundProfile } from './profile';

export interface SoundFrame {
  rpm: number;
  throttle: number;
  boostBar: number;
  gear: number;
  /** Live runs provide the actual shift state. Playback can infer it from the gear. */
  shifting?: boolean;
  clutchOpen?: boolean;
  fuelCut?: boolean;
  powerKw?: number;
}

const SHIFT_GAIN: Record<TransmissionType, number> = {
  manual: 0.33,
  'automated-manual': 0.28,
  'dual-clutch': 0.63,
  'multi-clutch': 0.73,
  'torque-converter-automatic': 0.82,
  'direct-drive': 0.86,
  cvt: 1,
};

const clamp = (value: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.max(min, Math.min(value, max)) : min;

export function soundTargets(profile: SoundProfile, frame: SoundFrame, shifting: boolean, turboRelease: number) {
  const rpm = clamp(frame.rpm, profile.idleRpm * 0.7, profile.maxRpm * 1.08);
  const load = clamp(frame.throttle, 0, 1);
  const boost = clamp(frame.boostBar, 0, 2.5);
  const rev = clamp(rpm / profile.maxRpm, 0, 1);
  const shift = frame.clutchOpen ? 0.25 : shifting ? SHIFT_GAIN[profile.transmission] : 1;
  if (profile.cylinders === 0) {
    const power = clamp((frame.powerKw ?? 0) / profile.motorPowerKw, 0, 1);
    const moving = clamp(rpm / 1000, 0, 1);
    return {
      frequency: 68 + rpm / 24,
      bodyGain: (0.07 * moving + 0.16 * Math.sqrt(power) + 0.06 * load * moving) * shift,
      cutoff: 750 + 1700 * rev,
      airGain: 0.028 * rev * load,
      airFrequency: 1200 + 1100 * rev,
      whineGain: (0.025 + 0.008 * profile.motorCount) * moving * (0.2 + power) * shift,
      whineFrequency: 140 + rpm / 10.5,
    };
  }
  const turbo = profile.turboCount > 0;
  return {
    // One oscillator cycle represents two crank rotations. Its waveform contains every firing pulse.
    frequency: rpm / 120,
    bodyGain: (0.16 + 0.24 * load + 0.06 * rev) * shift * (frame.fuelCut ? 0.32 : 1),
    cutoff: turbo ? 370 + 660 * rev + 430 * load : 380 + 1150 * rev + 700 * load,
    airGain: (0.009 + 0.048 * load * rev) * shift + (turbo ? 0.033 * boost * load + turboRelease : 0),
    airFrequency: turbo ? 740 + 210 * profile.turboCount + 920 * boost : 590 + 900 * rev,
    whineGain: profile.supercharged ? (0.035 + 0.13 * load) * rev * shift : 0,
    whineFrequency: 95 + rpm / 5.3,
  };
}

/** Sum the exhaust pulses across a four-stroke cycle to make a band-limited waveform. */
function exhaustWave(context: AudioContext, profile: SoundProfile): PeriodicWave {
  const real = new Float32Array(61);
  const imag = new Float32Array(real.length);
  const count = profile.cylinders;
  for (let harmonic = 1; harmonic < real.length; harmonic++) {
    const decay = 1 / (1 + (harmonic / (count * 2.25)) ** 1.55);
    for (let firing = 0; firing < count; firing++) {
      const bank = Math.cos(firing * Math.PI / 2);
      const phase = 2 * Math.PI * harmonic * (firing + 0.23 * profile.unevenPulses * bank) / count;
      const weight = (1 + profile.unevenPulses * bank) * decay / count;
      real[harmonic] += weight * Math.cos(phase);
      imag[harmonic] -= weight * Math.sin(phase);
    }
  }
  return context.createPeriodicWave(real, imag);
}

function airflow(context: AudioContext): AudioBufferSourceNode {
  const buffer = context.createBuffer(1, Math.floor(context.sampleRate * 0.75), context.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let i = 0; i < samples.length; i++) samples[i] = 2 * Math.random() - 1;
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  return source;
}

const OUTPUT_LEVEL = 0.32;

export class PowertrainVoice {
  private readonly body: OscillatorNode;
  private readonly whine: OscillatorNode;
  private readonly air: AudioBufferSourceNode;
  private readonly cutoff: BiquadFilterNode;
  private readonly airBand: BiquadFilterNode;
  private readonly bodyGain: GainNode;
  private readonly whineGain: GainNode;
  private readonly airGain: GainNode;
  private readonly output: GainNode;
  private readonly stereo?: StereoPannerNode;
  private previous: SoundFrame | null = null;
  private shiftUntil = 0;
  private releaseTime = -Infinity;
  private releaseGain = 0;

  constructor(private readonly context: AudioContext, private readonly profile: SoundProfile, pan: number) {
    this.body = context.createOscillator();
    this.whine = context.createOscillator();
    this.air = airflow(context);
    this.cutoff = context.createBiquadFilter();
    this.airBand = context.createBiquadFilter();
    this.bodyGain = context.createGain();
    this.whineGain = context.createGain();
    this.airGain = context.createGain();
    this.output = context.createGain();

    if (profile.cylinders > 0) this.body.setPeriodicWave(exhaustWave(context, profile));
    else this.body.type = 'triangle';
    this.whine.type = 'sine';
    this.airBand.type = 'bandpass';
    this.airBand.Q.value = 0.75;
    this.cutoff.type = 'lowpass';
    this.cutoff.Q.value = 0.7;
    const resonance = context.createBiquadFilter();
    resonance.type = 'peaking';
    resonance.frequency.value = profile.exhaustResonanceHz || 220;
    resonance.Q.value = 0.9;
    resonance.gain.value = profile.cylinders > 0 ? 3.2 : 0;

    this.bodyGain.gain.value = this.whineGain.gain.value = this.airGain.gain.value = this.output.gain.value = 0;
    this.body.connect(resonance).connect(this.cutoff).connect(this.bodyGain).connect(this.output);
    this.whine.connect(this.whineGain).connect(this.output);
    this.air.connect(this.airBand).connect(this.airGain).connect(this.output);
    if (pan !== 0 && typeof context.createStereoPanner === 'function') {
      this.stereo = context.createStereoPanner();
      this.stereo.pan.value = pan;
      this.output.connect(this.stereo).connect(context.destination);
    } else {
      this.output.connect(context.destination);
    }
    this.body.start();
    this.whine.start();
    this.air.start();
    this.output.gain.setTargetAtTime(OUTPUT_LEVEL, context.currentTime, 0.02);
  }

  update(frame: SoundFrame) {
    const now = this.context.currentTime;
    const prev = this.previous;
    this.previous = frame;
    if (frame.shifting === undefined && prev && prev.gear !== frame.gear && this.profile.transmission !== 'cvt') {
      this.shiftUntil = now + clamp(this.profile.shiftTimeS, 0.045, 0.18);
    }
    if (this.profile.turboCount > 0 && prev && prev.throttle >= 0.48 && frame.throttle < 0.48 && prev.boostBar > 0.18) {
      this.releaseTime = now;
      this.releaseGain = 0.085 * clamp(prev.boostBar, 0, 1.5);
    }
    const release = this.releaseGain * Math.exp(-(now - this.releaseTime) / 0.13);
    const t = soundTargets(this.profile, frame, frame.shifting ?? (now < this.shiftUntil), release);
    if (!prev) {
      this.body.frequency.setValueAtTime(t.frequency, now);
      this.cutoff.frequency.setValueAtTime(t.cutoff, now);
      this.airBand.frequency.setValueAtTime(t.airFrequency, now);
      this.whine.frequency.setValueAtTime(t.whineFrequency, now);
    }
    this.body.frequency.setTargetAtTime(t.frequency, now, this.profile.transmission === 'cvt' ? 0.035 : 0.016);
    this.cutoff.frequency.setTargetAtTime(t.cutoff, now, 0.028);
    this.bodyGain.gain.setTargetAtTime(t.bodyGain, now, 0.023);
    this.airBand.frequency.setTargetAtTime(t.airFrequency, now, 0.04);
    this.airGain.gain.setTargetAtTime(t.airGain, now, 0.026);
    this.whine.frequency.setTargetAtTime(t.whineFrequency, now, 0.024);
    this.whineGain.gain.setTargetAtTime(t.whineGain, now, 0.028);
  }

  dispose() {
    const now = this.context.currentTime;
    const running = this.context.state === 'running';
    const disconnect = () => {
      this.output.disconnect();
      this.stereo?.disconnect();
    };
    if (!running) disconnect();
    const stop = now + (running ? 0.065 : 0);
    this.output.gain.setTargetAtTime(0, now, 0.01);
    if (running) this.body.onended = disconnect;
    this.body.stop(stop);
    this.whine.stop(stop);
    this.air.stop(stop);
  }
}
