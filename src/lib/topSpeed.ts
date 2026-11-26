import type { TopSpeedBreakdown } from '../physics/dyno';
import { fmt } from './format';

/** Whole km/h, or one decimal when rounding would make two different speeds look equal. */
const kmhPair = (a: number, b: number): [string, string] =>
  Math.round(a) === Math.round(b) && a !== b ? [fmt(a, 1), fmt(b, 1)] : [fmt(a), fmt(b)];

/** Stock top speed with the constraint that actually sets it (decided before rounding). */
export function topSpeedText(t: TopSpeedBreakdown): string {
  const cause = t.binding === 'rev-limit' ? 'rev-limited in top gear' : 'drag-limited';
  if (t.binding === 'limiter') {
    return `${fmt(t.kmh)} km/h · held by the modelled ${fmt(t.limiterKmh!)} km/h limiter (≈ ${fmt(t.unlimitedKmh)} km/h without it)`;
  }
  if (t.limiterKmh !== null) {
    const [speed, cap] = kmhPair(t.kmh, t.limiterKmh);
    return `${speed} km/h · ${cause} below the modelled ${cap} km/h limiter, which is never reached`;
  }
  return `${fmt(t.kmh)} km/h · uncapped prediction, ${cause} (no limiter modelled); not a published or governed figure`;
}
