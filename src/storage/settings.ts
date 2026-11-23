import { VEHICLES, findVehicle } from '../data/vehicles';
import type { ShiftMode } from '../physics/types';
import type { LaunchTechnique } from '../physics/runners';
import { defaultTuning, sanitizeTuning, type TuningConfig } from '../tuning/tuning';
import { readJson, type KeyValueStore } from './kv';

export const SETTINGS_KEY = 'cps:v1:settings';

export interface AppSettings {
  activeVehicleId: string;
  tunings: Record<string, TuningConfig>;
  shiftMode: ShiftMode;
  launch: LaunchTechnique;
}

export function defaultSettings(): AppSettings {
  const tunings: Record<string, TuningConfig> = {};
  for (const v of VEHICLES) tunings[v.id] = defaultTuning(v);
  return { activeVehicleId: VEHICLES[0].id, tunings, shiftMode: 'auto', launch: 'brake-boost' };
}

export function sanitizeSettings(raw: unknown): AppSettings {
  const d = defaultSettings();
  if (!raw || typeof raw !== 'object') return d;
  const r = raw as Record<string, unknown>;
  const tuningsRaw = (r.tunings && typeof r.tunings === 'object' ? r.tunings : {}) as Record<string, unknown>;
  const tunings: Record<string, TuningConfig> = {};
  for (const v of VEHICLES) tunings[v.id] = sanitizeTuning(v, tuningsRaw[v.id]);
  return {
    activeVehicleId:
      typeof r.activeVehicleId === 'string' && findVehicle(r.activeVehicleId) ? r.activeVehicleId : d.activeVehicleId,
    tunings,
    shiftMode: r.shiftMode === 'manual' ? 'manual' : 'auto',
    launch: r.launch === 'standard' ? 'standard' : 'brake-boost',
  };
}

export function loadSettings(store: KeyValueStore): AppSettings {
  return sanitizeSettings(readJson(store, SETTINGS_KEY));
}

export function persistSettings(store: KeyValueStore, settings: AppSettings): boolean {
  return store.set(SETTINGS_KEY, JSON.stringify(settings));
}
