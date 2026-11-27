import { describe, expect, it } from 'vitest';
import { computeDyno, theoreticalTopSpeedKmh, topSpeedKmh } from '../dyno';
import { electricOutput } from '../electric';
import { VehicleSimulator } from '../simulator';
import { kmhToMs, msToKmh } from '../units';
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

  it('reports electric wheel torque at the wheels, through each motor\'s reduction (Taycan: unequal axles)', () => {
    const taycan = VEHICLES.find((v) => v.id === '2020-porsche-taycan-turbo-s-us-sedan-awd-ev2')!;
    const v = sim(taycan);
    const d = computeDyno(v);
    expect(d.torqueBasis).toBe('motor-sum');
    expect(d.wheelTorqueBasis).toBe('at-wheels');
    const p20 = d.points.find((p) => p.speedKmh === 20)!;
    // Front 440 Nm × 8.0 + rear 550 Nm × 15.2 (first gear), × 95 %.
    const expected = (440 * 8.0 + 550 * 15.2) * v.drivetrain.efficiency;
    expect(p20.wheelTorqueNm).toBeCloseTo(expected, 0);
    expect(p20.torqueNm).toBeCloseTo(990, 0);
    // Same basis as the simulator's wheel force: force × radius at the same point, before tire limits.
    const out = electricOutput(v, v.electric!, kmhToMs(20), 1, 1);
    expect(p20.wheelTorqueNm).toBeCloseTo((out.front + out.rear) * v.wheelRadiusM, 6);
    // And consistent with wheel power: P_wheel = T_wheel × wheel speed at every point.
    for (const p of d.points) {
      const wheelOmega = kmhToMs(p.speedKmh!) / v.wheelRadiusM;
      expect((p.wheelTorqueNm * wheelOmega) / 1000).toBeCloseTo(p.wheelPowerPs * 0.73549875, 1);
    }
    // The peak is the wheel-torque maximum with its own speed (first gear at low speed).
    expect(d.peakWheelTorqueNm).toBe(Math.max(...d.points.map((p) => p.wheelTorqueNm)));
    expect(d.peakWheelTorqueKmh).toBeLessThan(60);
    // The live full-throttle drive force at 20 km/h never exceeds it.
    const s = new VehicleSimulator(v);
    while (msToKmh(s.state.speed) < 20) s.step(0.001, { throttle: 1, brake: 0 });
    expect(s.state.driveForceN * v.wheelRadiusM).toBeLessThanOrEqual(p20.wheelTorqueNm * 1.01);
  });

  it('keeps the combustion wheel-equivalent basis: crank torque × efficiency at engine rpm', () => {
    const v = sim(skoda);
    const d = computeDyno(v);
    expect(d.torqueBasis).toBe('crank');
    expect(d.wheelTorqueBasis).toBe('crank-equivalent');
    for (const p of d.points) expect(p.wheelTorqueNm).toBeCloseTo(p.torqueNm * v.drivetrain.efficiency, 9);
    expect(d.peakWheelTorqueNm).toBeCloseTo(d.peakTorqueNm * v.drivetrain.efficiency, 9);
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
