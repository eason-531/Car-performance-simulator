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
const taycan = byId('2020-porsche-taycan-turbo-s-us-sedan-awd-ev2');
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

  it('fires a driver boost from its button for the published 10 s, then needs 10 s to recover', () => {
    const s = new VehicleSimulator(sim(ioniq));
    // Unlinked, full-throttle pulls never boost on their own.
    pull(s, 120, 10, (x) => expect(x.state.boostS).toBe(0));
    expect(s.requestBoost()).toEqual({ ok: true });
    let seen = 0;
    let peak = 0;
    for (let i = 0; i < 14000; i++) {
      s.step(0.001, FULL);
      if (s.state.boostS > 0) seen += 0.001;
      peak = Math.max(peak, s.state.motorPowerKw);
      if (i === 5000) expect(s.requestBoost()).toEqual({ ok: false, reason: 'Boost already running' });
    }
    expect(seen).toBeCloseTo(10, 2);
    expect(peak).toBeGreaterThan(450);
    expect(peak).toBeLessThanOrEqual(478.1);
    // 4 s after it ended: still recovering, with the time left.
    expect(s.state.boostRecoveryS).toBeGreaterThan(5.9);
    expect(s.state.boostRecoveryS).toBeLessThan(6.1);
    expect(s.requestBoost()).toEqual({ ok: false, reason: `Boost recovering — ready in ${Math.ceil(s.state.boostRecoveryS - 1e-6)} s` });
    s.advance(6.1, FULL);
    expect(s.state.boostRecoveryS).toBe(0);
    expect(s.requestBoost()).toEqual({ ok: true });
    expect(s.state.boostS).toBeCloseTo(10, 6);
    // Cars without a boost button refuse it.
    expect(new VehicleSimulator(sim(ev6)).requestBoost()).toEqual({ ok: false, reason: 'No boost button on this car' });
    expect(new VehicleSimulator(sim(taycan)).requestBoost().ok).toBe(false);
  });

  it('keeps a linked boost out of the brake-held preload and fires it at brake release', () => {
    const linked = new VehicleSimulator(sim(ioniq, { electricBoostArmed: true }));
    linked.advance(2.5, { throttle: 1, brake: 1 });
    expect(linked.state.boostS).toBe(0);
    expect(linked.state.boostUsed).toBe(false);
    expect(linked.state.launchPrimed).toBe(true);
    linked.step(0.001, FULL);
    expect(linked.state.boostS).toBeCloseTo(10, 2);
    expect(linked.state.launchPrimed).toBe(false);
    // Unlinked (stock comparison, MEDIUM grip): no prime and no boost.
    const stock = new VehicleSimulator(sim(ioniq));
    stock.advance(2.5, { throttle: 1, brake: 1 });
    expect(stock.state.launchPrimed).toBe(false);
    stock.advance(1, FULL);
    expect(stock.state.boostUsed).toBe(false);
  });

  it('starts timed runs with the full linked boost on either launch technique', () => {
    for (const launch of ['brake-boost', 'standard'] as const) {
      const run = runAccelerationRun(sim(ioniq, { electricBoostArmed: true }), { launch, targetSpeedKmh: 200, sampleIntervalS: 0.01 });
      const boosted = run.trace.filter((p) => p.boostActive);
      expect(boosted[0].t).toBeLessThanOrEqual(0.15);
      expect(boosted[boosted.length - 1].t).toBeGreaterThan(9.8);
      expect(boosted[boosted.length - 1].t).toBeLessThan(10.3);
      const plain = runAccelerationRun(sim(ioniq), { launch, targetSpeedKmh: 200 });
      expect(plain.trace.every((p) => !p.boostActive)).toBe(true);
      expect(run.metrics.zeroTo200KmhS!).toBeLessThan(plain.metrics.zeroTo200KmhS!);
    }
  });

  it('cancels a launch-control prime when the accelerator lifts, so a later pull gets no stale boost', () => {
    // Taycan: brake + full throttle 1 s, lift for 2 s with the brake held, release and coast 2 s, then floor it.
    const s = new VehicleSimulator(sim(taycan));
    s.advance(1, { throttle: 1, brake: 1 });
    expect(s.state.launchPrimed).toBe(true);
    s.advance(2, { throttle: 0, brake: 1 });
    expect(s.state.launchPrimed).toBe(false);
    s.advance(2, { throttle: 0, brake: 0 });
    expect(s.state.speed).toBeGreaterThan(0.3);
    s.advance(3, FULL);
    expect(s.state.boostUsed).toBe(false);
    // A rolling pull never boosts either.
    const rolling = new VehicleSimulator(sim(taycan));
    rolling.advance(3, FULL);
    expect(rolling.state.boostUsed).toBe(false);
  });

  it('repeats the launch-control overboost on every launch without a reset', () => {
    const s = new VehicleSimulator(sim(taycan));
    const launchAndStop = () => {
      s.advance(1, { throttle: 1, brake: 1 });
      expect(s.state.launchPrimed).toBe(true);
      s.step(0.001, FULL);
      expect(s.state.boostS).toBeGreaterThan(2.49);
      let peak = 0;
      for (let i = 0; i < 2600; i++) {
        s.step(0.001, FULL);
        peak = Math.max(peak, s.state.motorPowerKw);
      }
      expect(peak).toBeGreaterThan(470);
      expect(s.state.boostS).toBe(0);
      for (let i = 0; i < 20000 && s.state.speed > 0; i++) s.step(0.001, { throttle: 0, brake: 1 });
      expect(s.state.speed).toBe(0);
    };
    for (let n = 0; n < 3; n++) launchAndStop();
  });

  it('allows one linked Ioniq launch per 2 minutes, while the boost button still works after its recovery', () => {
    const s = new VehicleSimulator(sim(ioniq, { electricBoostArmed: true }));
    const launch = () => {
      s.advance(1, { throttle: 1, brake: 1 });
      const primed = s.state.launchPrimed;
      s.step(0.001, FULL);
      return primed;
    };
    const stop = () => {
      for (let i = 0; i < 30000 && s.state.speed > 0; i++) s.step(0.001, { throttle: 0, brake: 1 });
    };
    expect(launch()).toBe(true);
    s.advance(4, FULL);
    stop();
    s.advance(20, { throttle: 0, brake: 1 });
    // 10 s boost over, 10 s recovery over, but launch control still cooling: no linked boost.
    expect(s.state.boostRecoveryS).toBe(0);
    expect(launch()).toBe(false);
    expect(s.state.boostS).toBe(0);
    expect(s.requestBoost()).toEqual({ ok: true });
    stop();
    s.advance(130, { throttle: 0, brake: 1 });
    expect(launch()).toBe(true);
    expect(s.state.boostS).toBeCloseTo(10, 2);
  });

  it('primes a launch-control boost on the brake and fires it on release', () => {
    const base = sim(ev6);
    const v: SimVehicle = {
      ...base,
      electric: { ...base.electric!, boost: { systemPowerW: 480000, systemTorqueNm: null, durationS: 2.5, trigger: 'launch-control', armed: true, recoveryS: 0, launchCooldownS: 0 } },
    };
    const s = new VehicleSimulator(v);
    s.advance(1, { throttle: 1, brake: 1 });
    expect(s.state.launchPrimed).toBe(true);
    expect(s.state.speed).toBe(0);
    s.advance(0.01, FULL);
    expect(s.state.boostS).toBeGreaterThan(2.4);
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

  it('pauses for N Grin Boost and returns when it ends; launch control is unavailable while it runs', () => {
    const s = new VehicleSimulator(sim(ioniq, { electricBoostArmed: true }), 'auto');
    s.setVirtualShift(true);
    // N e-Shift on: a brake-held hold does not prime launch control.
    s.advance(2, { throttle: 1, brake: 1 });
    expect(s.state.launchPrimed).toBe(false);
    pull(s, 60);
    expect(s.gearCount).toBe(8);
    expect(s.state.gear).toBeGreaterThan(1);
    expect(s.requestBoost()).toEqual({ ok: true });
    // The boost switches the simulated gears off for its duration…
    expect(s.virtualShift).toBe(true);
    expect(s.virtualShiftSuspended).toBe(true);
    expect(s.gearCount).toBe(1);
    expect(s.requestShift(1).ok).toBe(false);
    let peak = 0;
    for (let i = 0; i < 9900; i++) {
      s.step(0.001, FULL);
      peak = Math.max(peak, s.state.motorPowerKw);
      expect(s.state.gear).toBe(1);
    }
    expect(peak).toBeGreaterThan(460);
    // …and they come back afterwards, in a gear that keeps the simulated rpm under redline.
    s.advance(0.2, FULL);
    expect(s.state.boostS).toBe(0);
    expect(s.virtualShiftSuspended).toBe(false);
    expect(s.gearCount).toBe(8);
    expect(s.state.gear).toBeGreaterThan(1);
    expect(s.state.engineRpm).toBeLessThanOrEqual(6750);
  });

  it('drops a linked launch prime when N e-Shift is switched on, so releasing the brake fires no boost', () => {
    const s = new VehicleSimulator(sim(ioniq, { electricBoostArmed: true }), 'auto');
    s.advance(1, { throttle: 1, brake: 1 });
    expect(s.state.launchPrimed).toBe(true);
    s.setVirtualShift(true);
    expect(s.state.launchPrimed).toBe(false);
    // Brake released at full throttle on the next fixed step: no boost, no cooldown, gears not suspended.
    s.step(0.001, FULL);
    expect(s.state.boostS).toBe(0);
    expect(s.state.boostUsed).toBe(false);
    expect(s.state.launchCooldownS).toBe(0);
    expect(s.virtualShiftSuspended).toBe(false);
    expect(s.gearCount).toBe(8);
    s.advance(3, FULL);
    expect(s.state.boostUsed).toBe(false);
  });

  it('does not re-prime from the same hold across rapid N e-Shift toggles, but primes again after a fresh hold', () => {
    const s = new VehicleSimulator(sim(ioniq, { electricBoostArmed: true }), 'auto');
    const hold = { throttle: 1, brake: 1 };
    s.advance(1, hold);
    expect(s.state.launchPrimed).toBe(true);
    for (const on of [true, false, true, false]) {
      s.setVirtualShift(on);
      s.advance(0.05, hold);
      expect(s.state.launchPrimed).toBe(false);
    }
    // Still holding with N e-Shift off: the invalidated hold stays unprimed and the release fires nothing.
    s.advance(0.5, hold);
    expect(s.state.launchPrimed).toBe(false);
    s.step(0.001, FULL);
    expect(s.state.boostUsed).toBe(false);
    expect(s.state.launchCooldownS).toBe(0);
    // Stop, then a fresh brake-and-accelerator hold with N e-Shift off primes and fires as usual.
    for (let i = 0; i < 30000 && s.state.speed > 0; i++) s.step(0.001, { throttle: 0, brake: 1 });
    s.advance(1, hold);
    expect(s.state.launchPrimed).toBe(true);
    s.step(0.001, FULL);
    expect(s.state.boostS).toBeCloseTo(10, 2);
    expect(s.state.launchCooldownS).toBeGreaterThan(119);
  });

  it('fires a prime only if launch control is still available at the release', () => {
    const s = new VehicleSimulator(sim(ioniq, { electricBoostArmed: true }), 'auto');
    s.setVirtualShift(true);
    s.advance(1, { throttle: 1, brake: 1 });
    // Even a prime that somehow survived (forced here) cannot fire while N e-Shift operates.
    s.state.launchPrimed = true;
    s.step(0.001, FULL);
    expect(s.state.launchPrimed).toBe(false);
    expect(s.state.boostUsed).toBe(false);
    expect(s.state.launchCooldownS).toBe(0);
    expect(s.virtualShiftSuspended).toBe(false);
  });

  it('keeps launch control blocked after N Grin Boost suspends and returns N e-Shift', () => {
    const s = new VehicleSimulator(sim(ioniq, { electricBoostArmed: true }), 'auto');
    s.setVirtualShift(true);
    expect(s.requestBoost()).toEqual({ ok: true });
    expect(s.virtualShiftSuspended).toBe(true);
    // Hold at rest while the boost runs and after it: no prime (boost running, then recovery and N e-Shift back).
    s.advance(10.2, { throttle: 1, brake: 1 });
    expect(s.state.launchPrimed).toBe(false);
    expect(s.virtualShiftSuspended).toBe(false);
    expect(s.gearCount).toBe(8);
    s.advance(11, { throttle: 1, brake: 1 });
    expect(s.state.boostRecoveryS).toBe(0);
    expect(s.state.launchPrimed).toBe(false);
    // N e-Shift off and a fresh hold: launch control is available again.
    s.setVirtualShift(false);
    s.advance(0.5, { throttle: 0, brake: 1 });
    s.advance(1, { throttle: 1, brake: 1 });
    expect(s.state.launchPrimed).toBe(true);
  });

  it('leaves the test runners on the real single-speed drive', () => {
    const a = runAccelerationRun(sim(ioniq), { targetSpeedKmh: 200 });
    expect(a.trace.every((p) => p.gear === 1)).toBe(true);
    // Motor rpm, not a virtual engine speed: ≈ 18,000 rpm at 200 km/h.
    expect(Math.max(...a.trace.map((p) => p.rpm))).toBeGreaterThan(15000);
  });
});
