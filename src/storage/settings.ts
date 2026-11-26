import { CATALOG, OWNER_IDS, canonicalId, findEntry, isPlayable } from '../data/catalog';
import type { TimingBasis } from '../physics/metrics';
import type { LaunchTechnique } from '../physics/runners';
import type { ShiftMode } from '../physics/types';
import { findVehicle } from '../data/vehicles';
import { sanitizeTuning, type TuningConfig } from '../tuning/tuning';
import { readJson, type KeyValueStore } from './kv';

export const SETTINGS_KEY = 'cps:v1:settings';

/** A car in a particular configuration: its current tune, or stock. */
export interface CarChoice {
  vehicleId: string;
  variant: 'current' | 'stock';
}

export interface AppSettings {
  activeVehicleId: string;
  /** Sparse: only cars the user has tuned. Missing = stock. */
  tunings: Record<string, TuningConfig>;
  shiftMode: ShiftMode;
  launch: LaunchTechnique;
  /** Catalog ids the user starred (the owner's cars are always in My Garage). */
  favorites: string[];
  dragLanes: [CarChoice, CarChoice];
  /** Optional overlay car on the Tests screen (independent of the drag lanes). */
  testCompare: CarChoice | null;
  /** Timing basis used to display test results. */
  timingBasis: TimingBasis;
}

export function defaultSettings(): AppSettings {
  return {
    activeVehicleId: OWNER_IDS[0],
    tunings: {},
    shiftMode: 'auto',
    launch: 'brake-boost',
    favorites: [],
    dragLanes: [
      { vehicleId: OWNER_IDS[0], variant: 'current' },
      { vehicleId: OWNER_IDS[1] ?? OWNER_IDS[0], variant: 'current' },
    ],
    testCompare: null,
    timingBasis: 'brake-release',
  };
}

function sanitizeChoice(raw: unknown): CarChoice | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.vehicleId !== 'string' || !isPlayable(r.vehicleId)) return null;
  return { vehicleId: canonicalId(r.vehicleId), variant: r.variant === 'stock' ? 'stock' : 'current' };
}

export function sanitizeSettings(raw: unknown): AppSettings {
  const d = defaultSettings();
  if (!raw || typeof raw !== 'object') return d;
  const r = raw as Record<string, unknown>;
  const tuningsRaw = (r.tunings && typeof r.tunings === 'object' ? r.tunings : {}) as Record<string, unknown>;
  const tunings: Record<string, TuningConfig> = {};
  for (const [rawId, t] of Object.entries(tuningsRaw)) {
    const id = canonicalId(rawId);
    const spec = findVehicle(id);
    if (spec && !(id in tunings && id !== rawId)) tunings[id] = sanitizeTuning(spec, t);
  }
  const lanes = Array.isArray(r.dragLanes) ? r.dragLanes : [];
  return {
    activeVehicleId: typeof r.activeVehicleId === 'string' && isPlayable(r.activeVehicleId) ? canonicalId(r.activeVehicleId) : d.activeVehicleId,
    tunings,
    shiftMode: r.shiftMode === 'manual' ? 'manual' : 'auto',
    launch: r.launch === 'standard' ? 'standard' : 'brake-boost',
    favorites: Array.isArray(r.favorites)
      ? [...new Set(r.favorites.filter((id): id is string => typeof id === 'string' && !!findEntry(id)).map(canonicalId))]
      : [],
    dragLanes: [sanitizeChoice(lanes[0]) ?? d.dragLanes[0], sanitizeChoice(lanes[1]) ?? d.dragLanes[1]],
    testCompare: sanitizeChoice(r.testCompare),
    timingBasis: r.timingBasis === 'rollout-1ft' ? 'rollout-1ft' : 'brake-release',
  };
}

export function loadSettings(store: KeyValueStore): AppSettings {
  return sanitizeSettings(readJson(store, SETTINGS_KEY));
}

export function persistSettings(store: KeyValueStore, settings: AppSettings): boolean {
  return store.set(SETTINGS_KEY, JSON.stringify(settings));
}

export { CATALOG };
