import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
import { CATALOG, OWNER_IDS } from '../data/catalog';
import type { CatalogEntry } from '../data/catalog/types';
import type { VehicleSpec } from '../data/types';
import { VEHICLES, getVehicle } from '../data/vehicles';
import type { TimingBasis } from '../physics/metrics';
import type { LaunchTechnique } from '../physics/runners';
import type { ShiftMode, SimVehicle } from '../physics/types';
import { createBrowserStore, type KeyValueStore } from '../storage/kv';
import { addResult, createResult, loadResults, persistResults, removeResult, type NewResult, type SavedResult } from '../storage/results';
import { loadSettings, persistSettings, type AppSettings, type CarChoice } from '../storage/settings';
import { buildSimVehicle } from '../tuning/buildSimVehicle';
import { defaultTuning, type TuningConfig } from '../tuning/tuning';

interface State {
  settings: AppSettings;
  results: SavedResult[];
}

type Action =
  | { type: 'patchSettings'; patch: Partial<AppSettings> }
  | { type: 'setTuning'; id: string; tuning: TuningConfig | null }
  | { type: 'toggleFavorite'; id: string }
  | { type: 'addResult'; result: SavedResult }
  | { type: 'deleteResult'; id: string }
  | { type: 'clearResults' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'patchSettings':
      return { ...state, settings: { ...state.settings, ...action.patch } };
    case 'setTuning': {
      const tunings = { ...state.settings.tunings };
      if (action.tuning) tunings[action.id] = action.tuning;
      else delete tunings[action.id];
      return { ...state, settings: { ...state.settings, tunings } };
    }
    case 'toggleFavorite': {
      const f = state.settings.favorites;
      const favorites = f.includes(action.id) ? f.filter((x) => x !== action.id) : [...f, action.id];
      return { ...state, settings: { ...state.settings, favorites } };
    }
    case 'addResult':
      return { ...state, results: addResult(state.results, action.result) };
    case 'deleteResult':
      return { ...state, results: removeResult(state.results, action.id) };
    case 'clearResults':
      return { ...state, results: [] };
  }
}

export interface Toast {
  id: number;
  message: string;
  tone: 'info' | 'good' | 'warning';
}

export interface AppContextValue {
  /** Every car the simulator can run. */
  vehicles: readonly VehicleSpec[];
  catalog: readonly CatalogEntry[];
  ownerIds: readonly string[];
  activeVehicle: VehicleSpec;
  settings: AppSettings;
  results: SavedResult[];
  /** False when localStorage is unavailable (results last for this session only). */
  persistent: boolean;
  setActiveVehicle(id: string): void;
  tuningFor(id: string): TuningConfig;
  setTuning(id: string, tuning: TuningConfig): void;
  resetTuning(id: string): void;
  setShiftMode(mode: ShiftMode): void;
  setLaunch(launch: LaunchTechnique): void;
  setTimingBasis(basis: TimingBasis): void;
  setDragLane(index: 0 | 1, choice: CarChoice): void;
  setTestCompare(choice: CarChoice | null): void;
  isFavorite(id: string): boolean;
  toggleFavorite(id: string): void;
  /** Simulation model for a vehicle with its current tune (or stock). Memoised. */
  simVehicle(id: string, variant?: 'current' | 'stock'): SimVehicle;
  saveResult(result: NewResult): SavedResult;
  deleteResult(id: string): void;
  clearResults(): void;
  toasts: Toast[];
  notify(message: string, tone?: Toast['tone']): void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children, store }: { children: ReactNode; store?: KeyValueStore }) {
  const kv = useMemo(() => store ?? createBrowserStore(), [store]);
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    settings: loadSettings(kv),
    results: loadResults(kv),
  }));
  const [persistent, setPersistent] = useState(true);

  useEffect(() => {
    setPersistent(persistSettings(kv, state.settings));
  }, [kv, state.settings]);
  useEffect(() => {
    persistResults(kv, state.results);
  }, [kv, state.results]);

  // Cache built SimVehicles by vehicle + tuning identity (undefined = stock).
  const cache = useRef(new Map<string, { tuning: TuningConfig | undefined; vehicle: SimVehicle }>());
  const simVehicle = useCallback(
    (id: string, variant: 'current' | 'stock' = 'current'): SimVehicle => {
      const spec = getVehicle(id);
      const tuning = variant === 'stock' ? undefined : state.settings.tunings[id];
      const key = `${id}:${variant}`;
      const hit = cache.current.get(key);
      if (hit && hit.tuning === tuning) return hit.vehicle;
      const vehicle = buildSimVehicle(spec, tuning ?? defaultTuning(spec));
      cache.current.set(key, { tuning, vehicle });
      return vehicle;
    },
    [state.settings.tunings],
  );

  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  const notify = useCallback((message: string, tone: Toast['tone'] = 'info') => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-2), { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const value = useMemo<AppContextValue>(() => {
    const activeVehicle = getVehicle(state.settings.activeVehicleId);
    const patch = (p: Partial<AppSettings>) => dispatch({ type: 'patchSettings', patch: p });
    return {
      vehicles: VEHICLES,
      catalog: CATALOG,
      ownerIds: OWNER_IDS,
      activeVehicle,
      settings: state.settings,
      results: state.results,
      persistent,
      setActiveVehicle: (id) => patch({ activeVehicleId: id }),
      tuningFor: (id) => state.settings.tunings[id] ?? defaultTuning(getVehicle(id)),
      setTuning: (id, tuning) => dispatch({ type: 'setTuning', id, tuning }),
      resetTuning: (id) => dispatch({ type: 'setTuning', id, tuning: null }),
      setShiftMode: (mode) => patch({ shiftMode: mode }),
      setLaunch: (launch) => patch({ launch }),
      setTimingBasis: (timingBasis) => patch({ timingBasis }),
      setDragLane: (index, choice) => {
        const lanes = [...state.settings.dragLanes] as AppSettings['dragLanes'];
        lanes[index] = choice;
        patch({ dragLanes: lanes });
      },
      setTestCompare: (choice) => patch({ testCompare: choice }),
      isFavorite: (id) => state.settings.favorites.includes(id),
      toggleFavorite: (id) => dispatch({ type: 'toggleFavorite', id }),
      simVehicle,
      saveResult: (input) => {
        const result = createResult(input);
        dispatch({ type: 'addResult', result });
        return result;
      },
      deleteResult: (id) => dispatch({ type: 'deleteResult', id }),
      clearResults: () => dispatch({ type: 'clearResults' }),
      toasts,
      notify,
    };
  }, [state, persistent, simVehicle, toasts, notify]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
