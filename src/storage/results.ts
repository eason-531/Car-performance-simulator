import { emptyMetrics, type PerformanceMetrics } from '../physics/metrics';
import type { LaunchTechnique, TraceSample } from '../physics/runners';
import type { TuningConfig } from '../tuning/tuning';
import { readJson, type KeyValueStore } from './kv';

export const RESULTS_KEY = 'cps:v1:results';
export const MAX_RESULTS = 100;
const TRACE_POINTS = 240;

export type ResultSource = 'test' | 'drag' | 'drive';

export interface SavedResult {
  id: string;
  /** ISO timestamp. */
  createdAt: string;
  source: ResultSource;
  vehicleId: string;
  vehicleName: string;
  colorSlot: number;
  tuningLabel: string;
  tuning: TuningConfig;
  launch: LaunchTechnique | 'driver';
  powerPs: number;
  torqueNm: number;
  massKg: number;
  metrics: PerformanceMetrics;
  /** Speed (km/h) versus time (s), downsampled. */
  trace: { t: number[]; v: number[] };
}

export type NewResult = Omit<SavedResult, 'id' | 'createdAt' | 'trace'> & {
  trace: readonly Pick<TraceSample, 't' | 'speedKmh'>[];
};

export function newId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Reduce a trace to at most `points` samples, always keeping the last one. */
export function downsampleTrace(
  trace: readonly Pick<TraceSample, 't' | 'speedKmh'>[],
  points = TRACE_POINTS,
): { t: number[]; v: number[] } {
  const t: number[] = [];
  const v: number[] = [];
  if (trace.length === 0) return { t, v };
  const stride = Math.max(1, Math.ceil(trace.length / points));
  for (let i = 0; i < trace.length; i += stride) {
    t.push(round(trace[i].t, 3));
    v.push(round(trace[i].speedKmh, 2));
  }
  const last = trace[trace.length - 1];
  if (t[t.length - 1] !== round(last.t, 3)) {
    t.push(round(last.t, 3));
    v.push(round(last.speedKmh, 2));
  }
  return { t, v };
}

const round = (x: number, d: number) => Math.round(x * 10 ** d) / 10 ** d;

const isNum = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);
const isNumOrNull = (x: unknown): x is number | null => x === null || isNum(x);

function sanitizeMetrics(raw: unknown): PerformanceMetrics | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const m = emptyMetrics();
  for (const key of Object.keys(m) as (keyof PerformanceMetrics)[]) {
    const value = r[key];
    if (key === 'topSpeedKmh' || key === 'peakAccelG') {
      if (!isNum(value)) return null;
      m[key] = value;
    } else {
      if (!isNumOrNull(value)) return null;
      (m as unknown as Record<string, number | null>)[key] = value;
    }
  }
  return m;
}

/** Validate one stored result; returns null for anything malformed. */
export function sanitizeResult(raw: unknown): SavedResult | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const metrics = sanitizeMetrics(r.metrics);
  const trace = r.trace as { t?: unknown; v?: unknown } | undefined;
  if (
    typeof r.id !== 'string' ||
    typeof r.createdAt !== 'string' ||
    !['test', 'drag', 'drive'].includes(r.source as string) ||
    typeof r.vehicleId !== 'string' ||
    typeof r.vehicleName !== 'string' ||
    !isNum(r.colorSlot) ||
    typeof r.tuningLabel !== 'string' ||
    !r.tuning ||
    typeof r.tuning !== 'object' ||
    !['standard', 'brake-boost', 'driver'].includes(r.launch as string) ||
    !isNum(r.powerPs) ||
    !isNum(r.torqueNm) ||
    !isNum(r.massKg) ||
    !metrics ||
    !trace ||
    !Array.isArray(trace.t) ||
    !Array.isArray(trace.v) ||
    trace.t.length !== trace.v.length ||
    !trace.t.every(isNum) ||
    !trace.v.every(isNum)
  ) {
    return null;
  }
  return {
    id: r.id,
    createdAt: r.createdAt,
    source: r.source as ResultSource,
    vehicleId: r.vehicleId,
    vehicleName: r.vehicleName,
    colorSlot: r.colorSlot,
    tuningLabel: r.tuningLabel,
    tuning: r.tuning as TuningConfig,
    launch: r.launch as SavedResult['launch'],
    powerPs: r.powerPs,
    torqueNm: r.torqueNm,
    massKg: r.massKg,
    metrics,
    trace: { t: trace.t as number[], v: trace.v as number[] },
  };
}

export function loadResults(store: KeyValueStore): SavedResult[] {
  const raw = readJson(store, RESULTS_KEY);
  if (!Array.isArray(raw)) return [];
  return raw.map(sanitizeResult).filter((r): r is SavedResult => r !== null);
}

export function persistResults(store: KeyValueStore, results: readonly SavedResult[]): boolean {
  return store.set(RESULTS_KEY, JSON.stringify(results.slice(0, MAX_RESULTS)));
}

export function createResult(input: NewResult, now: Date = new Date()): SavedResult {
  return { ...input, id: newId(), createdAt: now.toISOString(), trace: downsampleTrace(input.trace) };
}

/** Newest first, capped at MAX_RESULTS. */
export function addResult(results: readonly SavedResult[], result: SavedResult): SavedResult[] {
  return [result, ...results].slice(0, MAX_RESULTS);
}

export function removeResult(results: readonly SavedResult[], id: string): SavedResult[] {
  return results.filter((r) => r.id !== id);
}
