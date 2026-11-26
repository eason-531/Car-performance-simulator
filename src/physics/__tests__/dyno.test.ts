import { describe, expect, it } from 'vitest';
import { computeDyno, theoreticalTopSpeedKmh, topSpeedKmh } from '../dyno';
import { lexus, sim, skoda, VEHICLES } from '../../test-helpers';

describe('dyno', () => {
  it.each(VEHICLES.map((v) => [v.shortName, v] as const))('%s stock curve reproduces rated output', (_n, spec) => {
    const d = computeDyno(sim(spec));
    if (spec.electric) {
      // Electric cars are measured over road speed: peak output is the shared
      // limit (no boost), and torque the motors' combined shaft torque.
      const el = spec.electric;
      const motorSum = el.motors.reduce((a, m) => a + m.peakTorqueNm, 0);
      const ratedPs = Math.min(el.systemPowerKw, el.motors.reduce((a, m) => a + m.peakPowerKw, 0)) / 0.73549875;
      expect(d.axis).toBe('speed');
      expect(d.peakPowerPs).toBeGreaterThan(ratedPs * 0.985);
      expect(d.peakPowerPs).toBeLessThan(ratedPs * 1.015);
      expect(d.peakTorqueNm).toBeCloseTo(Math.min(motorSum, el.systemTorqueNm ?? Infinity), 0);
      expect(d.peakWheelPowerPs).toBeLessThan(d.peakPowerPs);
      return;
    }
    expect(d.peakPowerPs).toBeGreaterThan(spec.engine.rated.powerPs * 0.985);
    expect(d.peakPowerPs).toBeLessThan(spec.engine.rated.powerPs * 1.015);
    expect(d.peakTorqueNm).toBeCloseTo(spec.engine.rated.torqueNm, 0);
    // The peak lands in the rated band, or the curve is flat (within 0.5 %) from
    // the peak to the band: some published ratings put the torque plateau's end
    // at almost exactly rated power (e.g. the S58: 479 lb-ft to 5,500, 503 hp at 6,250).
    const [lo, hi] = spec.engine.rated.powerRpm;
    if (d.peakPowerRpm < lo - 300 || d.peakPowerRpm > hi + 300) {
      const nearest = d.points.reduce((a, p) => (Math.abs(p.rpm - lo) < Math.abs(a.rpm - lo) ? p : a));
      expect(nearest.powerPs).toBeGreaterThan(d.peakPowerPs * 0.995);
    }
    expect(d.peakWheelPowerPs).toBeLessThan(d.peakPowerPs);
  });

  it.each(VEHICLES.filter((v) => v.stage1).map((v) => [v.shortName, v] as const))('%s Stage 1 lands near its advertised figures', (_n, spec) => {
    if (!spec.stage1) return;
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
