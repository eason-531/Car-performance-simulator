import { describe, expect, it } from 'vitest';
import { AIR_DENSITY, GRAVITY } from '../constants';
import { aeroDragN, axleLoads, rollingResistanceN, tractionLimitN } from '../forces';
import { lexus, sim, skoda } from '../../test-helpers';

describe('road load and traction', () => {
  const v = sim(lexus);

  it('computes aerodynamic drag as ½ρCdAv²', () => {
    expect(aeroDragN(v, 30)).toBeCloseTo(0.5 * AIR_DENSITY * v.dragAreaM2 * 900, 6);
    expect(aeroDragN(v, 0)).toBe(0);
  });

  it('rolling resistance grows slightly with speed', () => {
    expect(rollingResistanceN(v, 0)).toBeCloseTo(v.rollingResistance * v.massKg * GRAVITY, 6);
    expect(rollingResistanceN(v, 50)).toBeGreaterThan(rollingResistanceN(v, 0));
  });

  it('transfers weight rearwards under acceleration', () => {
    const still = axleLoads(v, 0);
    const accel = axleLoads(v, 5);
    expect(still.front + still.rear).toBeCloseTo(v.massKg * GRAVITY, 6);
    expect(accel.front + accel.rear).toBeCloseTo(v.massKg * GRAVITY, 6);
    expect(accel.rear).toBeGreaterThan(still.rear);
  });

  it('gives AWD more traction than RWD at equal mass and grip', () => {
    const rwd = tractionLimitN(v, 0) / (v.massKg * GRAVITY);
    const s = sim(skoda);
    const awd = tractionLimitN(s, 0) / (s.massKg * GRAVITY);
    expect(rwd).toBeLessThan(0.6);
    expect(awd).toBeGreaterThan(0.9);
  });

  it('scales traction with tire compound', () => {
    expect(tractionLimitN(sim(lexus, { tireCompoundId: 'semi-slick' }), 0)).toBeGreaterThan(tractionLimitN(v, 0));
  });
});
