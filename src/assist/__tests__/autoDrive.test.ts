import { describe, expect, it } from 'vitest';
import type { VehicleSpec } from '../../data/types';
import { FIXED_DT } from '../../physics/constants';
import { VehicleSimulator } from '../../physics/simulator';
import { kmhToMs, msToKmh } from '../../physics/units';
import { VEHICLES, lexus, sim, skoda } from '../../test-helpers';
import { AUTO_DRIVE_DEFAULTS, AutoDriveController, plantModel, type AutoDriveCommand } from '../autoDrive';
import { PEDAL_RATE } from '../liveDrive';
import type { LeadInfo } from '../traffic';

const nevera = VEHICLES.find((v) => v.id === '2022-rimac-nevera-eu-coupe-awd-ev')!;
const CARS: [string, VehicleSpec][] = [
  ['Lexus IS 200t', lexus],
  ['Škoda Superb', skoda],
  ['Rimac Nevera', nevera],
];

interface Sample {
  t: number;
  v: number;
  accel: number;
  gap: number | null;
  leadV: number;
  cmd: AutoDriveCommand;
}

/**
 * Controller on the real vehicle simulator with a scripted lead (pedal
 * smoothing as in Live Drive). `script` may change the lead at any time.
 */
function drive(
  spec: VehicleSpec,
  seconds: number,
  lead: { gapM: number; kmh: number } | null,
  script?: (t: number, l: { x: number; v: number; present: boolean }, egoX: number) => void,
): Sample[] {
  const v = sim(spec);
  const s = new VehicleSimulator(v);
  const c = new AutoDriveController(plantModel(v));
  c.engage(0);
  const applied = { throttle: 0, brake: 0 };
  const l = { x: lead ? lead.gapM + 4.6 : 0, v: lead ? kmhToMs(lead.kmh) : 0, present: !!lead };
  const out: Sample[] = [];
  const maxDelta = PEDAL_RATE * FIXED_DT;
  for (let i = 0; i < seconds / FIXED_DT; i++) {
    const t = i * FIXED_DT;
    script?.(t, l, s.state.distance);
    const info: LeadInfo | null = l.present ? { id: 1, gapM: l.x - 4.6 - s.state.distance, speedMs: l.v, cutIn: false } : null;
    const cmd = c.update(FIXED_DT, { speed: s.state.speed, accel: s.state.accelFiltered }, info);
    applied.throttle += Math.max(-maxDelta, Math.min(maxDelta, cmd.throttle - applied.throttle));
    applied.brake += Math.max(-maxDelta, Math.min(maxDelta, cmd.brake - applied.brake));
    s.step(FIXED_DT, applied);
    l.x += l.v * FIXED_DT;
    out.push({ t, v: s.state.speed, accel: s.state.accelFiltered, gap: info?.gapM ?? null, leadV: l.v, cmd });
  }
  return out;
}

/** Brake applications (rising edges of the brake request). */
function brakeEpisodes(samples: Sample[]): number {
  let n = 0;
  for (let i = 1; i < samples.length; i++) if (samples[i].cmd.brake > 0 && samples[i - 1].cmd.brake === 0) n++;
  return n;
}

describe('Auto Drive controller', () => {
  it('shares one set of defaults: a 2-second gap and a standstill gap', () => {
    expect(AUTO_DRIVE_DEFAULTS.timeGapS).toBe(2);
    expect(AUTO_DRIVE_DEFAULTS.standstillGapM).toBeGreaterThanOrEqual(4);
  });

  it.each(CARS)('requests 100 %% throttle on a clear lane (%s)', (_, spec) => {
    const run = drive(spec, 12, null);
    expect(run.every((x) => x.cmd.throttle === 1 && x.cmd.brake === 0 && x.cmd.mode === 'accelerating')).toBe(true);
    expect(msToKmh(run[run.length - 1].v)).toBeGreaterThan(100);
  });

  it.each(CARS)('closes gradually on a slower lead, lifts before braking and settles near 2 s (%s)', (_, spec) => {
    const run = drive(spec, 90, { gapM: 300, kmh: 80 });
    const vL = kmhToMs(80);
    // Full throttle while far away.
    expect(run[500].cmd.throttle).toBe(1);
    // Never both pedals; the throttle is closed before the brake is used.
    expect(run.some((x) => x.cmd.throttle > 0 && x.cmd.brake > 0)).toBe(false);
    const firstBrake = run.findIndex((x) => x.cmd.brake > 0);
    expect(firstBrake).toBeGreaterThan(0);
    let liftStart = firstBrake;
    while (liftStart > 0 && run[liftStart].cmd.throttle < 1) liftStart--;
    expect(firstBrake - liftStart).toBeGreaterThan(100); // a lift phase of more than 0.1 s
    // Braking starts well before the lead, while the gap is still larger than the target at the lead's speed.
    expect(run[firstBrake].gap!).toBeGreaterThan(5 + 2 * vL);
    // One smooth approach: a single brake application, firm at most.
    expect(brakeEpisodes(run)).toBe(1);
    expect(Math.min(...run.map((x) => x.accel))).toBeGreaterThan(-3.2);
    // Settled: within 1 km/h of the lead and within 3 m of the 2-second gap.
    const end = run[run.length - 1];
    expect(Math.abs(msToKmh(end.v) - 80)).toBeLessThan(1);
    expect(Math.abs(end.gap! - (5 + 2 * end.v))).toBeLessThan(3);
    expect(end.cmd.mode).toBe('following');
    expect(Math.min(...run.filter((x) => x.v > 10).map((x) => x.gap! / x.v))).toBeGreaterThan(1.7);
  }, 30_000);

  it('eases back to full throttle when the lead pulls away or leaves the lane', () => {
    for (const leave of ['pull-away', 'cut-out'] as const) {
      const run = drive(lexus, 80, { gapM: 250, kmh: 80 }, (t, l) => {
        if (t >= 60 && leave === 'pull-away') l.v = kmhToMs(160);
        if (t >= 60 && leave === 'cut-out') l.present = false;
      });
      const after = run.filter((x) => x.t >= 60);
      const following = run.find((x) => x.t >= 59.9)!.cmd.throttle;
      expect(following).toBeLessThan(0.6);
      // The throttle rises no faster than the resume rate…
      for (let i = 1; i < after.length; i++) {
        expect(after[i].cmd.throttle - after[i - 1].cmd.throttle).toBeLessThanOrEqual(AUTO_DRIVE_DEFAULTS.resumeRate * FIXED_DT + 1e-9);
      }
      // …and reaches 100 % once the lane is clear, without braking.
      const full = after.findIndex((x) => x.cmd.throttle === 1);
      expect(full).toBeGreaterThan(0);
      expect(after[full].t - 60).toBeLessThan(leave === 'cut-out' ? 2 : 12);
      expect(after.slice(0, full + 1).some((x) => x.cmd.brake > 0)).toBe(false);
      expect(after[full].cmd.mode).toBe('accelerating');
    }
  }, 30_000);

  it('stops behind a stopped car at the standstill gap and resumes when it moves', () => {
    const run = drive(skoda, 60, { gapM: 200, kmh: 0 }, (t, l) => {
      if (t >= 40) l.v = kmhToMs(30);
    });
    const stopped = run.find((x) => x.t >= 39)!;
    expect(stopped.v).toBe(0);
    expect(stopped.cmd.mode).toBe('stopped');
    expect(stopped.gap!).toBeGreaterThanOrEqual(AUTO_DRIVE_DEFAULTS.standstillGapM - 0.5);
    expect(stopped.gap!).toBeLessThan(AUTO_DRIVE_DEFAULTS.standstillGapM + 4);
    expect(Math.min(...run.map((x) => x.gap!))).toBeGreaterThan(AUTO_DRIVE_DEFAULTS.standstillGapM - 0.5);
    const end = run[run.length - 1];
    expect(msToKmh(end.v)).toBeGreaterThan(20);
    expect(end.cmd.brake).toBe(0);
  });

  it('brakes for a close cut-in without overreacting and opens the gap again', () => {
    // Following a 100 km/h lead, an 85 km/h car moves in 25 m ahead (under a second).
    const run = drive(lexus, 100, { gapM: 250, kmh: 100 }, (t, l, egoX) => {
      if (Math.abs(t - 50) < FIXED_DT / 2) {
        l.x = egoX + 25 + 4.6;
        l.v = kmhToMs(85);
      }
    });
    const before = run.find((x) => x.t >= 49.9)!;
    expect(Math.abs(before.gap! - (5 + 2 * before.v))).toBeLessThan(3);
    const after = run.filter((x) => x.t >= 50);
    expect(after[0].gap!).toBeLessThan(26);
    expect(after.slice(0, 2000).some((x) => x.cmd.mode === 'braking')).toBe(true);
    expect(Math.min(...after.map((x) => x.accel))).toBeGreaterThan(-3.2);
    expect(Math.min(...after.map((x) => x.gap!))).toBeGreaterThan(15);
    expect(brakeEpisodes(after)).toBe(1);
    const end = after[after.length - 1];
    expect(Math.abs(msToKmh(end.v) - 85)).toBeLessThan(1);
    expect(Math.abs(end.gap! - (5 + 2 * end.v))).toBeLessThan(4);
  }, 30_000);
});
