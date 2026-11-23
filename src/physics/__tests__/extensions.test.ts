import { describe, expect, it } from 'vitest';
import type { VehicleSpec } from '../../data/types';
import { buildSimVehicle } from '../../tuning/buildSimVehicle';
import { splitTractionLimit } from '../forces';
import { MetricsTracker, ROLLOUT_M } from '../metrics';
import { runAccelerationRun } from '../runners';
import { VehicleSimulator } from '../simulator';
import { lexus, sim, skoda } from '../../test-helpers';

/** A synthetic six-speed manual derived from the Lexus data, for path tests only. */
const manualFixture: VehicleSpec = {
  ...lexus,
  id: 'test-manual-fixture',
  transmission: {
    type: 'manual',
    name: 'Test 6MT',
    gearRatios: [3.6, 2.1, 1.5, 1.15, 0.92, 0.75],
    finalDrive: [3.9, 3.9, 3.9, 3.9, 3.9, 3.9],
    upshiftTimeS: 0.4,
    downshiftTimeS: 0.5,
    shiftTorqueDip: 1,
    maxAutoUpshiftRpm: 6100,
    ratedInputTorqueNm: 450,
    launchClutch: { launchRpm: 3500, brakeHoldRpmLimit: 3500, maxClutchTorqueNm: 600, creep: false, driverEngageS: 0.3 },
  },
};

describe('AWD torque split', () => {
  it('reaches full grip when the ideal split is allowed', () => {
    expect(splitTractionLimit(6000, 4000, [0, 1])).toBeCloseTo(10000, 6);
  });
  it('is limited by the axle that saturates first at a fixed split', () => {
    // 50/50 locked: front can take 6000 → total 12000, rear 4000 → total 8000.
    expect(splitTractionLimit(6000, 4000, [0.5, 0.5])).toBeCloseTo(8000, 6);
  });
  it('degenerates to two-wheel drive at the bounds', () => {
    expect(splitTractionLimit(6000, 4000, [1, 1])).toBe(6000);
    expect(splitTractionLimit(6000, 4000, [0, 0])).toBe(4000);
  });
  it('front-biased on-demand AWD gives the Superb its previous traction', () => {
    const v = sim(skoda);
    expect(v.drivetrain.frontShare).toEqual([0.5, 1]);
  });
});

describe('timing basis', () => {
  it('rollout restarts the clock after one foot of travel', () => {
    const a = 4;
    const tracker = new MetricsTracker();
    for (let t = 0; t <= 20; t += 0.01) tracker.update({ t, v: a * t, x: 0.5 * a * t * t, a });
    const br = tracker.metricsFor('brake-release');
    const ro = tracker.metricsFor('rollout-1ft');
    const tRoll = Math.sqrt((2 * ROLLOUT_M) / a);
    expect(br.zeroTo100KmhS! - ro.zeroTo100KmhS!).toBeCloseTo(tRoll, 2);
    expect(br.quarterMileS! - ro.quarterMileS!).toBeCloseTo(tRoll, 2);
    expect(ro.quarterMileTrapKmh).toBeCloseTo(br.quarterMileTrapKmh!, 9);
    expect(tracker.splitsFor('rollout-1ft')['60mph']).toBeCloseTo(ro.zeroTo60MphS!, 9);
  });

  it('runner reports both bases with rollout always quicker', () => {
    const r = runAccelerationRun(sim(skoda));
    expect(r.metricsRollout.zeroTo60MphS!).toBeLessThan(r.metrics.zeroTo60MphS!);
    expect(r.metrics.zeroTo60MphS! - r.metricsRollout.zeroTo60MphS!).toBeLessThan(0.6);
    expect(r.splits['brake-release']['100kmh']).toBeCloseTo(r.metrics.zeroTo100KmhS!, 9);
  });
});

describe('manual transmission path', () => {
  const v = buildSimVehicle(manualFixture);

  it('does not creep and holds the launch rpm on the brake with the clutch open', () => {
    const s = new VehicleSimulator(v);
    s.advance(3, { throttle: 0, brake: 0 });
    expect(s.state.speed).toBe(0);
    s.advance(2, { throttle: 1, brake: 1 });
    expect(s.state.speed).toBe(0);
    expect(Math.abs(s.state.engineRpm - 3500)).toBeLessThan(250);
  });

  it('launches with clutch slip, then shifts with a torque interruption', () => {
    const r = runAccelerationRun(v);
    expect(r.completed).toBe(true);
    expect(r.metrics.zeroTo100KmhS!).toBeGreaterThan(4);
    expect(r.metrics.zeroTo100KmhS!).toBeLessThan(12);
    // Somewhere during an upshift the car must coast (no drive torque).
    const s = new VehicleSimulator(v);
    let sawInterruption = false;
    for (let i = 0; i < 12000; i++) {
      s.step(0.001, { throttle: 1, brake: 0 });
      if (s.state.shift && s.state.driveForceN === 0) sawInterruption = true;
    }
    expect(sawInterruption).toBe(true);
    expect(s.state.gear).toBeGreaterThan(2);
  });

  it('is deterministic', () => {
    const a = runAccelerationRun(v).metrics;
    const b = runAccelerationRun(v).metrics;
    expect(a).toEqual(b);
  });
});

describe('traction-limited acceleration', () => {
  it('does not charge reflected engine inertia against tire-limited force', () => {
    // A very short first gear and a big engine guarantee a coupled, wheel-spinning phase.
    const v = buildSimVehicle({
      ...lexus,
      id: 'test-short-gear',
      // The Superb's dual-clutch (no converter slip) on the rear-drive Lexus.
      transmission: { ...skoda.transmission, gearRatios: [5, 2.8, 1.8, 1.3, 1, 0.8], finalDrive: [4, 4, 4, 4, 4, 4] },
      engine: { ...lexus.engine, inertiaKgM2: 0.4 },
    });
    const s = new VehicleSimulator(v);
    s.advance(2.5, { throttle: 1, brake: 1 });
    const carMass = v.massKg + v.wheelInertiaKgM2 / v.wheelRadiusM ** 2;
    let checked = 0;
    for (let i = 0; i < 4000; i++) {
      s.step(0.001, { throttle: 1, brake: 0 });
      const st = s.state;
      if (st.coupling === 'locked' && st.tractionLimited && st.speed < 15) {
        // Resistances are small at this speed: acceleration ≈ tire force / car mass.
        expect(st.accel).toBeGreaterThan((st.driveForceN / carMass) * 0.95);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(0);
  });
});
