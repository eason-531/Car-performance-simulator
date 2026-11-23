import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
import type { VehicleSpec } from '../data/types';
import { VEHICLES, getVehicle } from '../data/vehicles';
import type { LaunchTechnique } from '../physics/runners';
import type { ShiftMode, SimVehicle } from '../physics/types';
import { createBrowserStore, type KeyValueStore } from '../storage/kv';
import { addResult, createResult, loadResults, persistResults, removeResult, type NewResult, type SavedResult } from '../storage/results';
import { loadSettings, persistSettings, type AppSettings } from '../storage/settings';
import { buildSimVehicle } from '../tuning/buildSimVehicle';
import { defaultTuning, type TuningConfig } from '../tuning/tuning';

interface State {
  settings: AppSettings;
  results: SavedResult[];
}

type Action =
  | { type: 'setActiveVehicle'; id: string }
  | { type: 'setTuning'; id: string; tuning: TuningConfig }
  | { type: 'setShiftMode'; mode: ShiftMode }
  | { type: 'setLaunch'; launch: LaunchTechnique }
  | { type: 'addResult'; result: SavedResult }
  | { type: 'deleteResult'; id: string }
  | { type: 'clearResults' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setActiveVehicle':
      return { ...state, settings: { ...state.settings, activeVehicleId: action.id } };
    case 'setTuning':
      return {
        ...state,
        settings: { ...state.settings, tunings: { ...state.settings.tunings, [action.id]: action.tuning } },
      };
    case 'setShiftMode':
      return { ...state, settings: { ...state.settings, shiftMode: action.mode } };
    case 'setLaunch':
      return { ...state, settings: { ...state.settings, launch: action.launch } };
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
  vehicles: readonly VehicleSpec[];
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

  // Cache built SimVehicles by vehicle + tuning identity.
  const cache = useRef(new Map<string, { tuning: TuningConfig; vehicle: SimVehicle }>());
  const simVehicle = useCallback(
    (id: string, variant: 'current' | 'stock' = 'current'): SimVehicle => {
      const spec = getVehicle(id);
      const tuning = variant === 'stock' ? null : state.settings.tunings[id];
      const key = `${id}:${variant}`;
      const hit = cache.current.get(key);
      if (hit && (variant === 'stock' || hit.tuning === tuning)) return hit.vehicle;
      const t = tuning ?? defaultTuning(spec);
      const vehicle = buildSimVehicle(spec, t);
      cache.current.set(key, { tuning: t, vehicle });
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
    return {
      vehicles: VEHICLES,
      activeVehicle,
      settings: state.settings,
      results: state.results,
      persistent,
      setActiveVehicle: (id) => dispatch({ type: 'setActiveVehicle', id }),
      tuningFor: (id) => state.settings.tunings[id] ?? defaultTuning(getVehicle(id)),
      setTuning: (id, tuning) => dispatch({ type: 'setTuning', id, tuning }),
      resetTuning: (id) => dispatch({ type: 'setTuning', id, tuning: defaultTuning(getVehicle(id)) }),
      setShiftMode: (mode) => dispatch({ type: 'setShiftMode', mode }),
      setLaunch: (launch) => dispatch({ type: 'setLaunch', launch }),
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
