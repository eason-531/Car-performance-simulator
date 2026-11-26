/**
 * Road and traffic settings for Live Drive. The road preset governs how
 * traffic behaves (lane discipline, speeds); the numeric limit only affects
 * the NPCs' target speeds. Neither touches the player's car, Auto Drive or
 * conventional cruise control.
 */

export type RoadPreset = 'taiwan' | 'autobahn';

export interface RoadSettings {
  preset: RoadPreset;
  /** Posted limit for traffic, km/h; null = no limit. */
  limitKmh: number | null;
}

export const ROAD_PRESETS: readonly { value: RoadPreset; label: string }[] = [
  { value: 'taiwan', label: 'Taiwan' },
  { value: 'autobahn', label: 'Autobahn' },
];

/** Default limit of each preset (Taiwan national freeway 110 km/h; Autobahn advisory, no limit). */
export const ROAD_DEFAULT_LIMIT: Readonly<Record<RoadPreset, number | null>> = { taiwan: 110, autobahn: null };
/** Quick choices offered for Taiwan. */
export const TAIWAN_QUICK_LIMITS: readonly number[] = [100, 110];
export const LIMIT_RANGE_KMH: readonly [number, number] = [60, 200];
export const LIMIT_STEP_KMH = 10;

export function defaultRoad(preset: RoadPreset = 'taiwan'): RoadSettings {
  return { preset, limitKmh: ROAD_DEFAULT_LIMIT[preset] };
}

/** Step a limit up or down within the allowed range; stepping up from "no limit" is not possible, stepping down from it starts at the top of the range. */
export function stepLimit(limitKmh: number | null, direction: 1 | -1): number | null {
  const [lo, hi] = LIMIT_RANGE_KMH;
  if (limitKmh === null) return direction < 0 ? hi : null;
  const next = Math.round(limitKmh / LIMIT_STEP_KMH) * LIMIT_STEP_KMH + direction * LIMIT_STEP_KMH;
  return Math.min(hi, Math.max(lo, next));
}

export type TrafficDensity = 'very-sparse' | 'sparse' | 'mid' | 'heavy' | 'stuck' | 'auto';
export type TrafficScript = 'cut-in' | 'drivers';
export type TrafficMode = 'off' | TrafficDensity | TrafficScript;

export const TRAFFIC_MODES: readonly { value: TrafficMode; label: string }[] = [
  { value: 'off', label: 'Traffic off' },
  { value: 'very-sparse', label: 'Very sparse' },
  { value: 'sparse', label: 'Sparse' },
  { value: 'mid', label: 'Mid' },
  { value: 'heavy', label: 'Heavy' },
  { value: 'stuck', label: 'Stuck (queue)' },
  { value: 'auto', label: 'Auto (varies)' },
  { value: 'cut-in', label: 'Cut-in test' },
  { value: 'drivers', label: 'Driver test' },
];

export function isScripted(mode: TrafficMode): mode is TrafficScript {
  return mode === 'cut-in' || mode === 'drivers';
}

/** Generated (seeded) traffic: every density, including Auto and Stuck. */
export function isGenerated(mode: TrafficMode): mode is TrafficDensity {
  return mode !== 'off' && !isScripted(mode);
}
