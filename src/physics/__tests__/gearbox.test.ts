import { describe, expect, it } from 'vitest';
import { autoShiftTarget, manualStallProtection, type ShiftContext } from '../gearbox';
import { lexus, sim, skoda } from '../../test-helpers';

const t = sim(lexus).transmission;
const ctx = (patch: Partial<ShiftContext>): ShiftContext => ({
  gear: 3,
  inputRpm: 3000,
  throttle: 1,
  timeSinceShift: 5,
  idleRpm: 700,
  ...patch,
});

describe('automatic shift schedule', () => {
  it('computes full-throttle upshift points no higher than the TCU limit', () => {
    for (const spec of [lexus, skoda]) {
      const tr = sim(spec).transmission;
      expect(tr.wotUpshiftRpm).toHaveLength(tr.overallRatios.length);
      for (const rpm of tr.wotUpshiftRpm.slice(0, -1)) {
        expect(rpm).toBeGreaterThan(4000);
        expect(rpm).toBeLessThanOrEqual(tr.maxAutoUpshiftRpm);
      }
    }
  });

  it('upshifts at the full-throttle point and not before', () => {
    const up = t.wotUpshiftRpm[2];
    expect(autoShiftTarget(t, ctx({ inputRpm: up - 50 }))).toBeNull();
    expect(autoShiftTarget(t, ctx({ inputRpm: up + 1 }))).toBe(4);
  });

  it('upshifts early at light throttle', () => {
    expect(autoShiftTarget(t, ctx({ throttle: 0.2, inputRpm: 2200 }))).toBe(4);
  });

  it('kicks down several gears at full throttle', () => {
    const target = autoShiftTarget(t, ctx({ gear: 6, inputRpm: 1800, throttle: 1 }));
    expect(target).not.toBeNull();
    expect(target!).toBeLessThan(5);
  });

  it('never upshifts into lugging or during the cool-down after a shift', () => {
    expect(autoShiftTarget(t, ctx({ gear: 7, inputRpm: 1200, throttle: 0 }))).toBeNull();
    expect(autoShiftTarget(t, ctx({ inputRpm: 6500, timeSinceShift: 0.1 }))).toBeNull();
  });

  it('downshifts while coasting at low rpm', () => {
    expect(autoShiftTarget(t, ctx({ gear: 4, inputRpm: 1000, throttle: 0 }))).toBe(3);
  });

  it('protects against stalling in manual mode', () => {
    expect(manualStallProtection(ctx({ gear: 3, inputRpm: 600 }))).toBe(2);
    expect(manualStallProtection(ctx({ gear: 3, inputRpm: 2000 }))).toBeNull();
  });
});
