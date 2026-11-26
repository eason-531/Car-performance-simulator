import { describe, expect, it } from 'vitest';
import { getEntry } from '../../data/catalog';
import { topSpeedBreakdown } from '../../physics/dyno';
import { buildSimVehicle } from '../../tuning/buildSimVehicle';
import { defaultTuning } from '../../tuning/tuning';
import { topSpeedText } from '../topSpeed';

const stock = (id: string) => {
  const spec = getEntry(id).sim!;
  return buildSimVehicle(spec, defaultTuning(spec));
};

describe('stock top speed and its binding constraint', () => {
  it('calls a limiter binding only when it sits below the force/gearing limit (Chiron Super Sport)', () => {
    const t = topSpeedBreakdown(stock('2022-bugatti-chiron-super-sport-us-coupe-awd-7dct'));
    expect(t.binding).toBe('limiter');
    expect(t.kmh).toBeCloseTo(380, 6);
    expect(t.unlimitedKmh).toBeGreaterThan(380);
    expect(topSpeedText(t)).toMatch(/^380 km\/h · held by the modelled 380 km\/h limiter/);
  });

  it.each([
    ['2022-volkswagen-golf-gti-autobahn-us-hatch-fwd-7dct', 250],
    ['2018-nissan-gt-r-track-edition-us-coupe-awd-6dct', 315],
  ])('does not call a configured limiter binding when the car cannot reach it (%s)', (id, cap) => {
    const t = topSpeedBreakdown(stock(id));
    expect(t.limiterKmh).toBeCloseTo(cap, 6);
    expect(t.unlimitedKmh).toBeLessThan(cap);
    expect(t.binding).not.toBe('limiter');
    expect(t.kmh).toBe(t.unlimitedKmh);
    expect(topSpeedText(t)).toMatch(new RegExp(`below the modelled ${cap}(\\.0)? km/h limiter, which is never reached$`));
    expect(topSpeedText(t)).not.toMatch(/held by/);
  });

  it('labels a car with no modelled limiter as an uncapped prediction (Nissan Z)', () => {
    const t = topSpeedBreakdown(stock('2023-nissan-z-performance-9at-us-coupe-rwd-9at'));
    expect(t.limiterKmh).toBeNull();
    expect(t.binding).not.toBe('limiter');
    expect(topSpeedText(t)).toMatch(/uncapped prediction, (drag-limited|rev-limited in top gear) \(no limiter modelled\); not a published or governed figure$/);
  });

  it('shows a decimal when rounding would make a speed look equal to its limiter', () => {
    const text = topSpeedText({ kmh: 249.6, unlimitedKmh: 249.6, limiterKmh: 250, binding: 'drag' });
    expect(text).toBe('249.6 km/h · drag-limited below the modelled 250.0 km/h limiter, which is never reached');
  });
});
