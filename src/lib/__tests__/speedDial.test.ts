import { describe, expect, it } from 'vitest';
import { SPEED_DIAL_DEFAULT_KMH, speedDial } from '../speedDial';

describe('speedDial', () => {
  it('keeps the familiar 280 km/h dial for cars up to ≈ 260 km/h', () => {
    expect(speedDial(230)).toEqual({ max: SPEED_DIAL_DEFAULT_KMH, step: 40 });
    expect(speedDial(250)).toEqual({ max: 280, step: 40 });
    expect(speedDial(260)).toEqual({ max: 280, step: 40 });
  });

  it('extends the dial in whole steps so the top speed stays on the scale', () => {
    expect(speedDial(296)).toEqual({ max: 320, step: 40 });
    expect(speedDial(340)).toEqual({ max: 360, step: 40 });
    expect(speedDial(407)).toEqual({ max: 480, step: 60 });
    expect(speedDial(440)).toEqual({ max: 480, step: 60 });
    for (const v of [270, 330, 380, 415, 470]) {
      const d = speedDial(v);
      expect(d.max).toBeGreaterThanOrEqual(v + 20);
      expect(d.max % d.step).toBe(0);
    }
  });
});
