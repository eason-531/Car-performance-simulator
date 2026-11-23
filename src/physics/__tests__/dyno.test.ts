import { describe, expect, it } from 'vitest';
import { computeDyno, theoreticalTopSpeedKmh, topSpeedKmh } from '../dyno';
import { lexus, sim, skoda, VEHICLES } from '../../test-helpers';

describe('dyno', () => {
  it.each(VEHICLES.map((v) => [v.shortName, v] as const))('%s stock curve reproduces rated output', (_n, spec) => {
    const d = computeDyno(sim(spec));
    expect(d.peakPowerPs).toBeGreaterThan(spec.engine.rated.powerPs * 0.985);
    expect(d.peakPowerPs).toBeLessThan(spec.engine.rated.powerPs * 1.015);
    expect(d.peakTorqueNm).toBeCloseTo(spec.engine.rated.torqueNm, 0);
    const [lo, hi] = spec.engine.rated.powerRpm;
    expect(d.peakPowerRpm).toBeGreaterThanOrEqual(lo - 300);
    expect(d.peakPowerRpm).toBeLessThanOrEqual(hi + 300);
    expect(d.peakWheelPowerPs).toBeLessThan(d.peakPowerPs);
  });

  it.each(VEHICLES.map((v) => [v.shortName, v] as const))('%s Stage 1 lands near its advertised figures', (_n, spec) => {
    const d = computeDyno(sim(spec, { ecuStage: 'stage1' }));
    expect(Math.abs(d.peakPowerPs - spec.stage1.claimedPowerPs) / spec.stage1.claimedPowerPs).toBeLessThan(0.03);
    expect(Math.abs(d.peakTorqueNm - spec.stage1.claimedTorqueNm) / spec.stage1.claimedTorqueNm).toBeLessThan(0.03);
  });

  it('scales power with the power adjustment', () => {
    const base = computeDyno(sim(skoda)).peakPowerPs;
    expect(computeDyno(sim(skoda, { powerAdjustPct: 10 })).peakPowerPs).toBeCloseTo(base * 1.1, 0);
  });

  it('estimates a plausible drag-limited top speed and applies the limiter', () => {
    const v = sim(lexus);
    expect(theoreticalTopSpeedKmh(v)).toBeGreaterThan(230);
    expect(theoreticalTopSpeedKmh(v)).toBeLessThan(280);
    expect(topSpeedKmh(v)).toBe(230);
  });
});
