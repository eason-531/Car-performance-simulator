import { describe, expect, it } from 'vitest';
import { VehicleSimulator } from '../simulator';
import { msToKmh } from '../units';
import { VEHICLES, lexus, sim, skoda } from '../../test-helpers';

describe('VehicleSimulator', () => {
  it('is deterministic for identical inputs', () => {
    const run = () => {
      const s = new VehicleSimulator(sim(skoda));
      s.advance(3, { throttle: 1, brake: 0 });
      s.advance(1, { throttle: 0.2, brake: 0.1 });
      return s.state;
    };
    expect(run()).toEqual(run());
  });

  it.each(VEHICLES.map((v) => [v.shortName, v] as const))('%s idles and holds still on the brake', (_n, spec) => {
    const s = new VehicleSimulator(sim(spec));
    s.advance(3, { throttle: 0, brake: 1 });
    expect(s.state.speed).toBe(0);
    expect(s.state.engineRpm).toBeGreaterThan(spec.engine.idleRpm * 0.85);
    expect(s.state.engineRpm).toBeLessThan(spec.engine.idleRpm * 1.1);
  });

  it.each(VEHICLES.filter((v) => v.transmission.type !== 'manual').map((v) => [v.shortName, v] as const))('%s creeps forward off the brake', (_n, spec) => {
    const s = new VehicleSimulator(sim(spec));
    s.advance(4, { throttle: 0, brake: 0 });
    expect(msToKmh(s.state.speed)).toBeGreaterThan(2);
    expect(msToKmh(s.state.speed)).toBeLessThan(15);
  });

  it('builds boost while brake-boosting without moving', () => {
    const s = new VehicleSimulator(sim(lexus));
    s.advance(2.5, { throttle: 1, brake: 1 });
    expect(s.state.speed).toBe(0);
    expect(s.boostBar).toBeGreaterThan(0.8);
    expect(s.state.engineRpm).toBeGreaterThan(2000);
    expect(s.state.tractionLimited).toBe(false);
  });

  it('never runs significantly past the rev limiter', () => {
    const v = sim(skoda);
    const s = new VehicleSimulator(v, 'manual');
    let maxRpm = 0;
    for (let i = 0; i < 10000; i++) {
      s.step(0.001, { throttle: 1, brake: 0 });
      maxRpm = Math.max(maxRpm, s.state.engineRpm);
    }
    expect(s.state.gear).toBe(1);
    expect(maxRpm).toBeLessThan(v.engine.revLimitRpm + 150);
    expect(maxRpm).toBeGreaterThan(v.engine.revLimitRpm - 50);
  });

  it('refuses a downshift that would over-rev, and accepts a safe one', () => {
    const s = new VehicleSimulator(sim(lexus), 'manual');
    s.advance(6, { throttle: 1, brake: 0 });
    expect(s.requestShift(1).ok).toBe(true);
    s.advance(1, { throttle: 1, brake: 0 });
    expect(s.state.gear).toBe(2);
    const down = s.requestShift(-1);
    expect(down.ok).toBe(false);
    expect(down.reason).toMatch(/over-rev/i);
    s.advance(0.5, { throttle: 0, brake: 0 });
    expect(s.requestShift(1).ok).toBe(true);
    expect(s.requestShift(1).ok).toBe(false); // shift already in progress
  });

  it.each(VEHICLES.filter((v) => v.speedLimiterKmh !== null).map((v) => [v.shortName, v] as const))('%s respects its speed limiter', (_n, spec) => {
    const s = new VehicleSimulator(sim(spec));
    s.advance(70, { throttle: 1, brake: 0 });
    const kmh = msToKmh(s.state.speed);
    expect(kmh).toBeLessThanOrEqual(spec.speedLimiterKmh! + 0.5);
    expect(kmh).toBeGreaterThan(spec.speedLimiterKmh! - 6);
  });

  it('goes faster without the limiter', () => {
    const limited = new VehicleSimulator(sim(skoda));
    const free = new VehicleSimulator(sim(skoda, { speedLimiter: false, ecuStage: 'stage1' }));
    limited.advance(70, { throttle: 1, brake: 0 });
    free.advance(70, { throttle: 1, brake: 0 });
    expect(free.state.speed).toBeGreaterThan(limited.state.speed);
  });

  it('decelerates when coasting and stops under braking', () => {
    const s = new VehicleSimulator(sim(lexus));
    s.advance(8, { throttle: 1, brake: 0 });
    const v0 = s.state.speed;
    s.advance(2, { throttle: 0, brake: 0 });
    expect(s.state.speed).toBeLessThan(v0);
    s.advance(10, { throttle: 0, brake: 1 });
    expect(s.state.speed).toBe(0);
    expect(s.state.gear).toBe(1);
  });

  it('upshifts through the gears in automatic mode', () => {
    const s = new VehicleSimulator(sim(lexus));
    s.advance(20, { throttle: 1, brake: 0 });
    expect(s.state.gear).toBeGreaterThanOrEqual(4);
  });

  it('tracks distance as the integral of speed', () => {
    const s = new VehicleSimulator(sim(skoda));
    let integral = 0;
    for (let i = 0; i < 5000; i++) {
      s.step(0.001, { throttle: 0.7, brake: 0 });
      integral += s.state.speed * 0.001;
    }
    expect(s.state.distance).toBeCloseTo(integral, 6);
  });
});
