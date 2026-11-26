import { TOP_SPEED_TIE_KMH, type TopSpeedBreakdown } from '../physics/dyno';
import { fmt, ordinalGear } from './format';

/**
 * Whole km/h, or one decimal when rounding would make two different speeds look
 * equal. Speeds closer than the tie tolerance are reported as a tie instead, so
 * one decimal always keeps the two apart.
 */
const kmhPair = (a: number, b: number): [string, string] =>
  Math.round(a) === Math.round(b) && a !== b ? [fmt(a, 1), fmt(b, 1)] : [fmt(a), fmt(b)];

/** The force/gearing constraint in words, naming the gear when it is not the top one. */
function causeText(t: TopSpeedBreakdown): string {
  if (t.electric) {
    const where = t.gearCount > 1 ? ` in ${t.gear === t.gearCount ? 'top gear' : `${ordinalGear(t.gear)} gear`}` : '';
    if (t.tiedWith === 'rev-limit' || t.tiedWith === 'drag') return `motor maximum speed and drag coincide${where}`;
    return t.binding === 'rev-limit' ? `at the motors' maximum speed${where}` : `drag-limited${where}`;
  }
  if (t.cvt) {
    const where = t.gear === t.gearCount ? " at the CVT's highest ratio" : ' with the CVT at its best ratio';
    if (t.tiedWith === 'rev-limit' || t.tiedWith === 'drag') return `rev cut and drag coincide${where}`;
    return t.binding === 'rev-limit' ? `rev-limited${where}` : `drag-limited${where}`;
  }
  const top = t.gear === t.gearCount;
  const gear = top ? 'top gear' : `${ordinalGear(t.gear)} gear (${ordinalGear(t.gearCount)} cannot pull past it)`;
  if (t.tiedWith === 'rev-limit' || t.tiedWith === 'drag') return `rev cut and drag coincide in ${gear}`;
  return t.binding === 'rev-limit' ? `rev-limited in ${gear}` : `drag-limited in ${gear}`;
}

/** Stock top speed with the constraint that actually sets it (decided before rounding). */
export function topSpeedText(t: TopSpeedBreakdown): string {
  if (t.tiedWith === 'limiter') {
    return `≈ ${fmt(t.kmh)} km/h · the modelled ${fmt(t.limiterKmh!)} km/h limiter and the force/gearing limit coincide (within ${TOP_SPEED_TIE_KMH} km/h; ${causeText({ ...t, tiedWith: null })})`;
  }
  if (t.binding === 'limiter') {
    return `${fmt(t.kmh)} km/h · held by the modelled ${fmt(t.limiterKmh!)} km/h limiter (≈ ${fmt(t.unlimitedKmh)} km/h without it)`;
  }
  if (t.limiterKmh !== null) {
    const [speed, cap] = kmhPair(t.kmh, t.limiterKmh);
    return `${speed} km/h · ${causeText(t)}, below the modelled ${cap} km/h limiter, which is never reached`;
  }
  return `${fmt(t.kmh)} km/h · uncapped prediction, ${causeText(t)} (no limiter modelled); not a published or governed figure`;
}
