import { describe, expect, it } from 'vitest';
import { DISTANCES_M, MetricsTracker, SPEEDS_MS } from '../metrics';

describe('MetricsTracker', () => {
  it('interpolates crossings exactly for constant acceleration', () => {
    const a = 5; // m/s²
    const tracker = new MetricsTracker();
    for (let t = 0; t <= 60; t += 0.1) tracker.update({ t, v: a * t, x: 0.5 * a * t * t, a });
    const m = tracker.metrics;
    expect(m.zeroTo100KmhS!).toBeCloseTo(SPEEDS_MS.kmh100 / a, 6);
    expect(m.zeroTo200KmhS!).toBeCloseTo(SPEEDS_MS.kmh200 / a, 6);
    expect(m.hundredTo200KmhS!).toBeCloseTo((SPEEDS_MS.kmh200 - SPEEDS_MS.kmh100) / a, 6);
    // Distance crossings interpolate linearly; error is tiny at 0.1 s steps.
    expect(m.quarterMileS!).toBeCloseTo(Math.sqrt((2 * DISTANCES_M.quarterMile) / a), 2);
    expect(m.peakAccelG).toBeCloseTo(a / 9.80665, 6);
  });

  it('leaves unreached targets as null', () => {
    const tracker = new MetricsTracker();
    tracker.update({ t: 0, v: 0, x: 0, a: 0 });
    tracker.update({ t: 1, v: 10, x: 5, a: 10 });
    expect(tracker.metrics.zeroTo100KmhS).toBeNull();
    expect(tracker.metrics.quarterMileS).toBeNull();
    expect(tracker.metrics.topSpeedKmh).toBeCloseTo(36, 6);
  });
});
