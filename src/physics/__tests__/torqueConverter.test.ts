import { describe, expect, it } from 'vitest';
import { torqueConverterEfficiency, torqueConverterTorques } from '../torqueConverter';
import { lexus, sim } from '../../test-helpers';
import { rpmToRadS } from '../units';

const tc = sim(lexus).transmission.torqueConverter!;

describe('torque converter', () => {
  it('multiplies torque at stall', () => {
    const { pump, turbine } = torqueConverterTorques(tc, rpmToRadS(2400), 0);
    expect(turbine / pump).toBeCloseTo(tc.stallTorqueRatio, 6);
    // Capacity is sized so the stock engine stalls at the rated stall speed.
    expect(pump).toBeCloseTo(sim(lexus).engine.torque.at(2400), 0);
  });

  it('acts as a fluid coupling above the coupling point', () => {
    const e = rpmToRadS(3000);
    const { pump, turbine } = torqueConverterTorques(tc, e, e * 0.9);
    expect(turbine).toBeCloseTo(pump, 6);
  });

  it('transmits no torque at a speed ratio of 1 and reverses on overrun', () => {
    const e = rpmToRadS(3000);
    expect(torqueConverterTorques(tc, e, e).pump).toBeCloseTo(0, 6);
    expect(torqueConverterTorques(tc, e, e * 1.2).turbine).toBeLessThan(0);
  });

  it('has zero efficiency at stall and peaks near coupling', () => {
    expect(torqueConverterEfficiency(tc, 0)).toBe(0);
    expect(torqueConverterEfficiency(tc, 0.85)).toBeCloseTo(0.85, 6);
  });
});
