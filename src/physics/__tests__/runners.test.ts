import { describe, expect, it } from 'vitest';
import { runAccelerationRun, runDragRace } from '../runners';
import { lexus, sim, skoda, VEHICLES } from '../../test-helpers';

describe('acceleration runs', () => {
  it.each(VEHICLES.map((v) => [v.shortName, v] as const))(
    '%s stock 0–100 km/h is within 0.6 s of the factory claim',
    (_n, spec) => {
      const r = runAccelerationRun(sim(spec), { launch: 'brake-boost' });
      expect(r.completed).toBe(true);
      expect(Math.abs(r.metrics.zeroTo100KmhS! - spec.factory.zeroTo100S)).toBeLessThan(0.6);
    },
  );

  it('produces ordered metrics', () => {
    const m = runAccelerationRun(sim(skoda)).metrics;
    expect(m.zeroTo60MphS!).toBeLessThan(m.zeroTo100KmhS!);
    expect(m.zeroTo100KmhS!).toBeLessThan(m.zeroTo200KmhS!);
    expect(m.sixtyFootS!).toBeLessThan(m.eighthMileS!);
    expect(m.eighthMileS!).toBeLessThan(m.quarterMileS!);
    expect(m.quarterMileS!).toBeLessThan(m.kilometerS!);
    expect(m.eighthMileTrapKmh!).toBeLessThan(m.quarterMileTrapKmh!);
  });

  it('matches the measured Škoda intermediate times (Automobil Revue) within 0.8 s', () => {
    const r = runAccelerationRun(sim(skoda), { launch: 'standard' });
    const at = (kmh: number) => r.trace.find((p) => p.speedKmh >= kmh)!.t;
    expect(Math.abs(r.metrics.zeroTo100KmhS! - 6.0)).toBeLessThan(0.8);
    expect(Math.abs(at(160) - 14.1)).toBeLessThan(0.8);
    expect(Math.abs(at(180) - 18.6)).toBeLessThan(0.8);
  });

  it('puts the Lexus quarter mile near published tests (≈15.3 s)', () => {
    const m = runAccelerationRun(sim(lexus)).metrics;
    expect(m.quarterMileS!).toBeGreaterThan(14.6);
    expect(m.quarterMileS!).toBeLessThan(16.0);
  });

  it('a brake-boost launch beats a standard launch', () => {
    const boost = runAccelerationRun(sim(skoda), { launch: 'brake-boost', targetSpeedKmh: 100, targetDistanceM: 0 });
    const std = runAccelerationRun(sim(skoda), { launch: 'standard', targetSpeedKmh: 100, targetDistanceM: 0 });
    expect(boost.metrics.zeroTo100KmhS!).toBeLessThan(std.metrics.zeroTo100KmhS!);
  });

  it('responds to tuning in the right direction', () => {
    const base = runAccelerationRun(sim(lexus)).metrics;
    const stage1 = runAccelerationRun(sim(lexus, { ecuStage: 'stage1' })).metrics;
    const heavy = runAccelerationRun(sim(lexus, { weightDeltaKg: 300 })).metrics;
    const grippy = runAccelerationRun(sim(lexus, { tireCompoundId: 'semi-slick' })).metrics;
    expect(stage1.quarterMileS!).toBeLessThan(base.quarterMileS!);
    expect(stage1.quarterMileTrapKmh!).toBeGreaterThan(base.quarterMileTrapKmh!);
    expect(heavy.quarterMileS!).toBeGreaterThan(base.quarterMileS!);
    expect(grippy.sixtyFootS!).toBeLessThan(base.sixtyFootS!);
  });

  it('stops when the car can no longer accelerate', () => {
    const r = runAccelerationRun(sim(lexus, { weightDeltaKg: 500, powerAdjustPct: -30 }), {
      targetSpeedKmh: 300,
      maxTimeS: 200,
    });
    expect(r.completed).toBe(false);
    expect(r.durationS).toBeLessThan(200);
  });
});

describe('drag race', () => {
  it('stock Škoda AWD beats the stock Lexus over a quarter mile', () => {
    const race = runDragRace(sim(lexus), sim(skoda), 402.336);
    expect(race.winner).toBe(1);
    expect(race.marginS!).toBeGreaterThan(0.3);
    expect(race.marginM!).toBeGreaterThan(0);
    expect(race.lanes[0].elapsedS!).toBeGreaterThan(race.lanes[1].elapsedS!);
  });

  it('identical cars dead-heat', () => {
    const race = runDragRace(sim(skoda), sim(skoda), 201.168);
    expect(race.winner).toBeNull();
    expect(race.lanes[0].elapsedS).toBeCloseTo(race.lanes[1].elapsedS!, 9);
  });
});
