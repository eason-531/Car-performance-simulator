import { useCallback, useEffect, useRef, useState } from 'react';
import { FIXED_DT } from '../physics/constants';
import { LiveTimer, type LiveTimerView } from '../physics/liveTimer';
import type { TraceSample } from '../physics/runners';
import { VehicleSimulator, type ShiftRequestResult } from '../physics/simulator';
import type { CouplingState, ShiftMode, SimVehicle } from '../physics/types';
import { msToKmh } from '../physics/units';

export interface DriveSnapshot {
  speedKmh: number;
  rpm: number;
  gear: number;
  gearCount: number;
  shifting: boolean;
  boostBar: number;
  throttle: number;
  brake: number;
  accelG: number;
  engineTorqueNm: number;
  wheelPowerKw: number;
  tractionLimited: boolean;
  speedLimited: boolean;
  fuelCut: boolean;
  coupling: CouplingState;
  /** Clutch disengaged during a clutch-open shift (manual or automated manual). */
  clutchOpen: boolean;
  /** Electric cars: motor output, kW, and whether a published boost is running. */
  motorPowerKw: number;
  boostActive: boolean;
  distanceM: number;
  /** Auto Hold is keeping the car stationary until the throttle is pressed. */
  autoHold: boolean;
  timer: LiveTimerView;
}

/** Pedal travel rate (full travel in ~0.14 s), like a real foot. */
const PEDAL_RATE = 7;
const NO_INPUT = { throttle: 0, brake: 0 };
const MAX_FRAME_S = 0.1;

type InputSource = 'pointer' | 'key';

function snapshotOf(
  sim: VehicleSimulator,
  timer: LiveTimer,
  pedals: { throttle: number; brake: number },
  autoHold: boolean,
): DriveSnapshot {
  const s = sim.state;
  return {
    speedKmh: msToKmh(s.speed),
    rpm: s.engineRpm,
    gear: s.gear,
    gearCount: sim.gearCount,
    shifting: s.shift !== null,
    boostBar: sim.boostBar,
    throttle: pedals.throttle,
    brake: pedals.brake,
    accelG: s.accelFiltered / 9.80665,
    engineTorqueNm: s.engineTorqueNm,
    wheelPowerKw: Math.max(0, (s.driveForceN * s.speed) / 1000),
    tractionLimited: s.tractionLimited,
    speedLimited: s.speedLimited,
    fuelCut: s.fuelCut,
    coupling: s.coupling,
    clutchOpen: s.clutchOpen,
    motorPowerKw: s.motorPowerKw,
    boostActive: s.boostS > 0,
    distanceM: s.distance,
    autoHold,
    timer: timer.view,
  };
}

/**
 * Real-time driving loop. Rendering runs on requestAnimationFrame, but the
 * physics always advances in FIXED_DT steps through a time accumulator, so
 * the simulation is identical at 30, 60 or 120 Hz.
 */
export function useDriveSimulation(vehicle: SimVehicle, shiftMode: ShiftMode, virtualShift = false) {
  const simRef = useRef<VehicleSimulator | null>(null);
  const timerRef = useRef(new LiveTimer());
  const targets = useRef({ pointer: { throttle: 0, brake: 0 }, key: { throttle: 0, brake: 0 } });
  const applied = useRef({ throttle: 0, brake: 0 });
  /** Auto Hold: engaged at rest (initially, or after braking to a stop), released by the throttle. */
  const hold = useRef(true);

  if (simRef.current === null || simRef.current.vehicle !== vehicle) {
    simRef.current = new VehicleSimulator(vehicle, shiftMode);
    timerRef.current.reset();
    hold.current = true;
  }
  simRef.current.shiftMode = shiftMode;
  // Electric cars with a simulated stepped gearbox (e.g. N e-Shift): Live Drive only, off unless chosen.
  simRef.current.setVirtualShift(virtualShift);

  const [snapshot, setSnapshot] = useState<DriveSnapshot>(() => snapshotOf(simRef.current!, timerRef.current, NO_INPUT, true));

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const tick = (now: number) => {
      acc += Math.min(MAX_FRAME_S, Math.max(0, (now - last) / 1000));
      last = now;
      const sim = simRef.current!;
      const timer = timerRef.current;
      const t = targets.current;
      const wantThrottle = Math.max(t.pointer.throttle, t.key.throttle);
      const wantBrake = Math.max(t.pointer.brake, t.key.brake);
      const steps = Math.floor(acc / FIXED_DT + 1e-9);
      acc -= steps * FIXED_DT;
      const a = applied.current;
      const maxDelta = PEDAL_RATE * FIXED_DT;
      for (let i = 0; i < steps; i++) {
        a.throttle += Math.max(-maxDelta, Math.min(maxDelta, wantThrottle - a.throttle));
        a.brake += Math.max(-maxDelta, Math.min(maxDelta, wantBrake - a.brake));
        if (sim.state.speed === 0 && a.brake > 0.05) hold.current = true;
        if (a.throttle > 0.02) hold.current = false;
        sim.step(FIXED_DT, hold.current ? { throttle: a.throttle, brake: 1 } : a);
        timer.update(sim.state);
      }
      setSnapshot(snapshotOf(sim, timer, a, hold.current));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const setPedal = useCallback((source: InputSource, pedal: 'throttle' | 'brake', value: number) => {
    targets.current[source][pedal] = Math.min(1, Math.max(0, value));
  }, []);

  const shift = useCallback((direction: 1 | -1): ShiftRequestResult => simRef.current!.requestShift(direction), []);

  const reset = useCallback(() => {
    simRef.current!.reset();
    timerRef.current.reset();
    applied.current = { throttle: 0, brake: 0 };
    hold.current = true;
  }, []);

  const runSamples = useCallback((): readonly TraceSample[] => timerRef.current.samples, []);

  return { snapshot, setPedal, shift, reset, runSamples };
}
