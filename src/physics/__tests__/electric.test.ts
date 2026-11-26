import { describe, expect, it } from 'vitest';
import type { VehicleSpec } from '../../data/types';
import { VEHICLES, sim } from '../../test-helpers';
import { TRACTION_CONTROL_EFFICIENCY } from '../constants';
import { electricOutput } from '../electric';
import { axleLoads } from '../forces';
import { runAccelerationRun } from '../runners';
import { VehicleSimulator } from '../simulator';
import type { SimVehicle } from '../types';
import { kmhToMs, msToKmh } from '../units';

const byId = (id: string): VehicleSpec => {
  const v = VEHICLES.find((x) => x.id === id);
  if (!v) throw new Error(`missing ${id}`);
  return v;
};
const ev6 = byId('2023-kia-ev6-gt-us-cuv-awd-ev');
const ioniq = byId('2025-hyundai-ioniq-5-n-us-cuv-awd-ev');
const FULL = { throttle: 1, brake: 0 };

/** Drive from rest at full throttle until a speed or time is reached. */
function pull(s: VehicleSimulator, kmh: number, maxS = 30, each?: (s: VehicleSimulator) => void) {
  for (let i = 0; i < maxS * 1000 && msToKmh(s.state.speed) < kmh; i++) {
    s.step(0.001, FULL);
    each?.(s);
  }
}

describe('electric drive', () => {
  it('limits each axle to its own grip with weight transfer at launch', () => {
    const v = sim(ev6);
    const s = new VehicleSimulator(v);
    let checked = 0;
    for (let i = 0; i < 1500; i++) {
      // Limits from the state the step starts from.
      const out = electricOutput(v, v.electric!, s.state.speed, 1, 1);
      const loads = axleLoads(v, s.state.accelFiltered);
      const cap = v.tireMu * TRACTION_CONTROL_EFFICIENCY;
      s.step(0.001, FULL);
      expect(s.state.driveForceN).toBeLessThanOrEqual(Math.min(out.front, cap * loads.front) + Math.min(out.rear, cap * loads.rear) + 1);
      checked++;
    }
    expect(checked).toBe(1500);
    expect(s.state.tractionLimited).toBe(true);
  });

  it('never exceeds the shared power limit', () => {
    const v = sim(ev6);
    for (const kmh of [30, 80, 150, 220]) {
      const out = electricOutput(v, v.electric!, kmhToMs(kmh), 1, 1);
      expect(out.powerW).toBeLessThanOrEqual(v.electric!.systemPowerW * 1.0001);
    }
  });

  it('creeps off the brake at walking pace and holds still on the brake', () => {
    const s = new VehicleSimulator(sim(ev6));
    s.advance(5, { throttle: 0, brake: 0 });
    expect(s.state.speed).toBeGreaterThan(0.5);
    expect(s.state.speed).toBeLessThan(2);
    const held = new VehicleSimulator(sim(ev6));
    held.advance(2, { throttle: 0, brake: 0.5 });
    expect(held.state.speed).toBe(0);
  });

  it('fires a driver boost only when armed, once, for its published duration', () => {
    const off = new VehicleSimulator(sim(ioniq));
    pull(off, 120, 10, (s) => expect(s.state.boostS).toBe(0));
    const on = new VehicleSimulator(sim(ioniq, { electricBoostArmed: true }));
    let peak = 0;
    let seen = 0;
    for (let i = 0; i < 14000; i++) {
      on.step(0.001, FULL);
      if (on.state.boostS > 0) seen += 0.001;
      peak = Math.max(peak, on.state.motorPowerKw);
    }
    expect(seen).toBeCloseTo(10, 1);
    expect(on.state.boostUsed).toBe(true);
    expect(peak).toBeGreaterThan(450);
    expect(peak).toBeLessThanOrEqual(478.1);
  });

  it('primes a launch-control boost on the brake and fires it on release', () => {
    const base = sim(ev6);
    const v: SimVehicle = { ...base, electric: { ...base.electric!, boost: { systemPowerW: 480000, systemTorqueNm: null, durationS: 2.5, trigger: 'launch-control', armed: true } } };
    const s = new VehicleSimulator(v);
    s.advance(1, { throttle: 1, brake: 1 });
    expect(s.state.launchPrimed).toBe(true);
    expect(s.state.speed).toBe(0);
    s.advance(0.01, FULL);
    expect(s.state.boostS).toBeGreaterThan(2.4);
    const rolling = new VehicleSimulator(v);
    rolling.advance(3, FULL);
    expect(rolling.state.boostUsed).toBe(false);
  });

  it('changes a two-speed axle at its published speed', () => {
    const base = sim(ev6);
    const rear = base.electric!.motors.find((m) => m.axle === 'rear')!;
    const v: SimVehicle = {
      ...base,
      electric: { ...base.electric!, motors: base.electric!.motors.map((m) => (m === rear ? { ...m, reductions: [15, 8], upshiftMs: kmhToMs(90) } : m)) },
    };
    const s = new VehicleSimulator(v);
    pull(s, 85);
    expect(s.state.gear).toBe(1);
    pull(s, 100);
    expect(s.state.gear).toBe(2);
  });
});

describe('simulated stepped gearbox (Hyundai N e-Shift)', () => {
  it('is off by default and only exists on cars that publish one', () => {
    const s = new VehicleSimulator(sim(ioniq));
    expect(s.virtualShift).toBe(false);
    expect(s.gearCount).toBe(1);
    const k = new VehicleSimulator(sim(ev6));
    k.setVirtualShift(true);
    expect(k.virtualShift).toBe(false);
    expect(k.gearCount).toBe(1);
  });

  it('runs eight virtual gears in auto with a virtual tach under the limiter', () => {
    const s = new VehicleSimulator(sim(ioniq), 'auto');
    s.setVirtualShift(true);
    expect(s.gearCount).toBe(8);
    expect(s.state.engineRpm).toBe(750);
    const gears = new Set<number>();
    let maxRpm = 0;
    let cutDuringShift = false;
    pull(s, 200, 20, (x) => {
      gears.add(x.state.gear);
      maxRpm = Math.max(maxRpm, x.state.engineRpm);
      if (x.state.shift && x.state.shift.elapsed / x.state.shift.duration > 0.5 && !x.state.tractionLimited) {
        cutDuringShift ||= x.state.motorPowerKw < 0.3 * 448;
      }
    });
    expect(gears.size).toBeGreaterThanOrEqual(6);
    expect(maxRpm).toBeLessThanOrEqual(6850 + 50);
    expect(cutDuringShift).toBe(true);
  });

  it('holds a manual gear on the hard limiter', () => {
    const s = new VehicleSimulator(sim(ioniq), 'manual');
    s.setVirtualShift(true);
    s.advance(6, FULL);
    expect(s.state.gear).toBe(1);
    expect(s.state.fuelCut || s.state.fuelCutTime > 0).toBe(true);
    // 1st tops out near 35 km/h at the 6,850 rpm virtual limiter.
    expect(msToKmh(s.state.speed)).toBeGreaterThan(30);
    expect(msToKmh(s.state.speed)).toBeLessThan(38);
    expect(s.requestShift(1).ok).toBe(true);
  });

  it('refuses a virtual downshift past the limiter and returns to the real reduction when switched off', () => {
    const s = new VehicleSimulator(sim(ioniq), 'auto');
    s.setVirtualShift(true);
    pull(s, 120);
    s.shiftMode = 'manual';
    while (s.state.shift) s.step(0.001, { throttle: 0.2, brake: 0 });
    const r = s.requestShift(-1);
    if (s.state.gear <= 2) expect(r.ok).toBe(false);
    s.setVirtualShift(false);
    expect(s.state.gear).toBe(1);
    expect(s.gearCount).toBe(1);
    s.step(0.001, FULL);
    expect(s.state.engineRpm).toBeGreaterThan(6000); // rear-motor rpm at 120 km/h
  });

  it('leaves the test runners on the real single-speed drive', () => {
    const a = runAccelerationRun(sim(ioniq), { targetSpeedKmh: 200 });
    expect(a.trace.every((p) => p.gear === 1)).toBe(true);
    // Motor rpm, not a virtual engine speed: ≈ 18,000 rpm at 200 km/h.
    expect(Math.max(...a.trace.map((p) => p.rpm))).toBeGreaterThan(15000);
  });
});
