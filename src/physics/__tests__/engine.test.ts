import { describe, expect, it } from 'vitest';
import { ATMOSPHERE_BAR, CLOSED_THROTTLE_MAP_BAR } from '../constants';
import { engineTorque, frictionTorque, fullLoadManifold, stepManifold, targetManifold } from '../engine';
import { lexus, sim } from '../../test-helpers';

const engine = sim(lexus).engine;

describe('engine model', () => {
  it('delivers the full-load curve at full manifold pressure', () => {
    for (const rpm of [1500, 3000, 5800]) {
      const map = fullLoadManifold(engine, rpm);
      expect(engineTorque(engine, rpm, map, false)).toBeCloseTo(engine.torque.at(rpm), 6);
    }
  });

  it('produces friction torque at closed throttle and on fuel cut', () => {
    expect(engineTorque(engine, 3000, CLOSED_THROTTLE_MAP_BAR, false)).toBeCloseTo(frictionTorque(engine, 3000), 6);
    expect(engineTorque(engine, 6400, 2.0, true)).toBeLessThan(0);
    expect(frictionTorque(engine, 6000)).toBeLessThan(frictionTorque(engine, 1000));
  });

  it('maps throttle linearly onto manifold pressure', () => {
    const rpm = 3000;
    expect(targetManifold(engine, rpm, 0)).toBeCloseTo(CLOSED_THROTTLE_MAP_BAR, 6);
    expect(targetManifold(engine, rpm, 1)).toBeCloseTo(fullLoadManifold(engine, rpm), 6);
    expect(fullLoadManifold(engine, rpm)).toBeGreaterThan(ATMOSPHERE_BAR + 1);
  });

  it('spools the turbo more slowly at low rpm (turbo lag)', () => {
    const spoolTime = (rpm: number) => {
      let map = ATMOSPHERE_BAR;
      const target = fullLoadManifold(engine, rpm);
      let t = 0;
      while (map < ATMOSPHERE_BAR + 0.9 * (target - ATMOSPHERE_BAR) && t < 10) {
        map = stepManifold(engine, map, rpm, 1, 0.001);
        t += 0.001;
      }
      return t;
    };
    expect(spoolTime(2000)).toBeGreaterThan(spoolTime(4000));
    expect(spoolTime(4000)).toBeGreaterThan(0.2);
  });
});
