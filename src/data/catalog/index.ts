import type { VehicleSpec } from '../types';
import { ENTRIES } from './cars';
import { STOCK_STATS, type StockStats } from './stockStats.generated';
import { eraOf, type CatalogEntry, type Era, type MeasuredBenchmark, type Readiness } from './types';
import type { StockClass } from './classes';

export * from './types';

export const CATALOG: readonly CatalogEntry[] = ENTRIES;

/** The owner's cars, shown in My Garage and used for the default drag matchup. */
export const OWNER_IDS: readonly string[] = CATALOG.filter((e) => e.owner).map((e) => e.id);

const BY_ID = new Map(CATALOG.map((e) => [e.id, e]));

export function findEntry(id: string): CatalogEntry | undefined {
  return BY_ID.get(id);
}

export function getEntry(id: string): CatalogEntry {
  const e = BY_ID.get(id);
  if (!e) throw new Error(`Unknown catalog id: ${id}`);
  return e;
}

/** Cars the physics model can run, owner cars first. */
export const PLAYABLE: readonly VehicleSpec[] = CATALOG.flatMap((e) => (e.sim ? [e.sim] : []));

export function isPlayable(id: string): boolean {
  return !!BY_ID.get(id)?.sim;
}

/** Pre-generated stock benchmark (see stockStats.ts); undefined when not simulated. */
export function stockStats(id: string): StockStats | undefined {
  return STOCK_STATS[id];
}

export function stockClass(id: string): StockClass | null {
  return STOCK_STATS[id]?.cls ?? null;
}

export function hasExactBenchmark(e: CatalogEntry): boolean {
  return e.benchmarks.some((b) => b.match === 'exact' && Object.keys(b.results).length > 0);
}

export function readinessOf(e: CatalogEntry): Readiness {
  if (!e.sim) return 'catalog';
  return hasExactBenchmark(e) ? 'sim+benchmark' : 'sim';
}

export function displayName(e: CatalogEntry): string {
  return `${e.modelYear} ${e.make} ${e.model}`;
}

export function fullName(e: CatalogEntry): string {
  const trim = e.trim && !e.model.includes(e.trim) ? ` ${e.trim}` : '';
  return `${e.modelYear} ${e.make} ${e.model}${trim}`;
}

/** Fold case and diacritics: "Škoda" → "skoda", "Huracán" → "huracan". */
export function fold(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ß/g, 'ss')
    .toLowerCase();
}

const HAYSTACK = new Map<string, string>();
function haystack(e: CatalogEntry): string {
  let h = HAYSTACK.get(e.id);
  if (!h) {
    h = fold(
      [
        e.make,
        e.model,
        e.trim,
        String(e.modelYear),
        e.chassisCode ?? '',
        e.engineLabel,
        e.bodyLabel,
        e.transmissionLabel,
        e.market,
        ...e.aliases,
      ].join(' '),
    );
    HAYSTACK.set(e.id, h);
  }
  return h;
}

/** Every whitespace-separated query token must appear somewhere in the car's searchable text. */
export function matchesQuery(e: CatalogEntry, query: string): boolean {
  const tokens = fold(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  const h = haystack(e);
  return tokens.every((t) => h.includes(t));
}

export interface CatalogFilters {
  brands: string[];
  origins: string[];
  markets: string[];
  classes: string[];
  bodies: string[];
  usage: string[];
  eras: string[];
  drives: string[];
  transmissions: string[];
  powertrains: string[];
  readiness: string[];
  favoritesOnly: boolean;
  playableOnly: boolean;
}

export const EMPTY_FILTERS: CatalogFilters = {
  brands: [],
  origins: [],
  markets: [],
  classes: [],
  bodies: [],
  usage: [],
  eras: [],
  drives: [],
  transmissions: [],
  powertrains: [],
  readiness: [],
  favoritesOnly: false,
  playableOnly: false,
};

export function activeFilterCount(f: CatalogFilters): number {
  let n = 0;
  for (const [k, v] of Object.entries(f)) {
    if (Array.isArray(v)) n += v.length > 0 ? 1 : 0;
    else if (v === true && k !== 'playableOnly') n += 1;
  }
  return n + (f.playableOnly ? 1 : 0);
}

const inList = (list: string[], value: string) => list.length === 0 || list.includes(value);

/** Values within one facet are OR-ed; facets are AND-ed together. */
export function applyFilters(entries: readonly CatalogEntry[], f: CatalogFilters, favorites: readonly string[]): CatalogEntry[] {
  return entries.filter(
    (e) =>
      inList(f.brands, e.make) &&
      inList(f.origins, e.origin) &&
      inList(f.markets, e.market) &&
      inList(f.classes, stockClass(e.id) ?? 'Pending') &&
      inList(f.bodies, e.body) &&
      (f.usage.length === 0 || e.usage.some((u) => f.usage.includes(u))) &&
      inList(f.eras, eraOf(e.modelYear)) &&
      inList(f.drives, e.drive) &&
      inList(f.transmissions, e.transmission) &&
      inList(f.powertrains, e.powertrain) &&
      inList(f.readiness, readinessOf(e)) &&
      (!f.favoritesOnly || favorites.includes(e.id) || !!e.owner) &&
      (!f.playableOnly || !!e.sim),
  );
}

export type SortKey =
  | 'favorites'
  | 'name'
  | 'year-desc'
  | 'year-asc'
  | 'class'
  | 'sim-0-100'
  | 'meas-0-100'
  | 'sim-quarter'
  | 'meas-quarter';

export const SORT_LABEL: Record<SortKey, string> = {
  favorites: 'Favorites first',
  name: 'Make, model, year',
  'year-desc': 'Year (newest first)',
  'year-asc': 'Year (oldest first)',
  class: 'Stock class (quickest first)',
  'sim-0-100': '0–100 km/h · simulated, brake release',
  'meas-0-100': '0–100 km/h · measured (exact tests first), as published',
  'sim-quarter': '¼-mile ET · simulated, brake release',
  'meas-quarter': '¼-mile ET · measured (exact tests first), publication timing',
};

export type MeasuredKey = 'zeroTo100KmhS' | 'quarterMileS';

/**
 * The published value used for measured sorting: the quickest result from an
 * exact-configuration test, falling back to equivalent configurations only when
 * no exact test exists. The benchmark is returned so the list can say which
 * publication, timing basis and match it came from.
 */
export function measuredResult(e: CatalogEntry, key: MeasuredKey): { value: number; benchmark: MeasuredBenchmark } | null {
  const withValue = e.benchmarks.filter((b) => typeof b.results[key] === 'number');
  const pool = withValue.some((b) => b.match === 'exact') ? withValue.filter((b) => b.match === 'exact') : withValue;
  let best: { value: number; benchmark: MeasuredBenchmark } | null = null;
  for (const b of pool) {
    const v = b.results[key] as number;
    if (!best || v < best.value) best = { value: v, benchmark: b };
  }
  return best;
}

/** Best published value for sorting (see `measuredResult`). */
export function measured(e: CatalogEntry, key: MeasuredKey): number | null {
  return measuredResult(e, key)?.value ?? null;
}

const SORT_NOTE_LABEL: Partial<Record<SortKey, string>> = {
  'sim-0-100': '0–100 km/h',
  'meas-0-100': '0–100 km/h',
  'sim-quarter': '¼ mile',
  'meas-quarter': '¼ mile',
};

/** One-line explanation of the value a car is sorted by, or null for non-value sorts. */
export function sortNote(e: CatalogEntry, key: SortKey): string | null {
  const label = SORT_NOTE_LABEL[key];
  if (!label) return null;
  if (key === 'sim-0-100' || key === 'sim-quarter') {
    const t = STOCK_STATS[e.id]?.brakeRelease;
    const v = key === 'sim-0-100' ? t?.zeroTo100KmhS : t?.quarterMileS;
    return v === null || v === undefined ? `Simulated ${label}: not simulated` : `Simulated ${label} ${v.toFixed(2)} s · brake release`;
  }
  const r = measuredResult(e, key === 'meas-0-100' ? 'zeroTo100KmhS' : 'quarterMileS');
  if (!r) return `Measured ${label}: no published result`;
  const b = r.benchmark;
  const timing = TIMING_NOTE[b.timing];
  return `Measured ${label} ${r.value} s · ${b.publication} · ${timing}${b.match === 'equivalent' ? ' · equivalent configuration' : ''}`;
}

const TIMING_NOTE: Record<MeasuredBenchmark['timing'], string> = {
  'rollout-1ft': '1-ft rollout',
  'standing-start': 'standing start',
  'drag-strip': 'drag-strip timing',
  unconfirmed: 'timing basis unconfirmed',
};

const byName = (a: CatalogEntry, b: CatalogEntry) =>
  fold(a.make).localeCompare(fold(b.make)) || fold(a.model).localeCompare(fold(b.model)) || a.modelYear - b.modelYear || a.id.localeCompare(b.id);

/** Missing values always sort last. */
function byValue(get: (e: CatalogEntry) => number | null) {
  return (a: CatalogEntry, b: CatalogEntry) => {
    const va = get(a);
    const vb = get(b);
    if (va === null && vb === null) return byName(a, b);
    if (va === null) return 1;
    if (vb === null) return -1;
    return va - vb || byName(a, b);
  };
}

export function sortEntries(entries: readonly CatalogEntry[], key: SortKey, favorites: readonly string[]): CatalogEntry[] {
  const list = [...entries];
  switch (key) {
    case 'favorites': {
      const rank = (e: CatalogEntry) => (e.owner ? 0 : favorites.includes(e.id) ? 1 : 2);
      return list.sort((a, b) => rank(a) - rank(b) || byName(a, b));
    }
    case 'name':
      return list.sort(byName);
    case 'year-desc':
      return list.sort((a, b) => b.modelYear - a.modelYear || byName(a, b));
    case 'year-asc':
      return list.sort((a, b) => a.modelYear - b.modelYear || byName(a, b));
    case 'class':
      return list.sort(byValue((e) => { const s = STOCK_STATS[e.id]?.score; return s === undefined || s === null ? null : -s; }));
    case 'sim-0-100':
      return list.sort(byValue((e) => STOCK_STATS[e.id]?.brakeRelease.zeroTo100KmhS ?? null));
    case 'meas-0-100':
      return list.sort(byValue((e) => measured(e, 'zeroTo100KmhS')));
    case 'sim-quarter':
      return list.sort(byValue((e) => STOCK_STATS[e.id]?.brakeRelease.quarterMileS ?? null));
    case 'meas-quarter':
      return list.sort(byValue((e) => measured(e, 'quarterMileS')));
  }
}

export interface FacetOptions {
  brands: string[];
  origins: string[];
  markets: string[];
  classes: string[];
  bodies: string[];
  usage: string[];
  eras: Era[];
  drives: string[];
  transmissions: string[];
  powertrains: string[];
  readiness: Readiness[];
}

const uniq = <T,>(xs: T[]) => [...new Set(xs)];

export const FACETS: FacetOptions = {
  brands: uniq(CATALOG.map((e) => e.make)).sort((a, b) => fold(a).localeCompare(fold(b))),
  origins: uniq(CATALOG.map((e) => e.origin)).sort(),
  markets: uniq(CATALOG.map((e) => e.market)).sort(),
  classes: ['S+', 'S', 'A', 'B', 'C', 'D', 'Pending'],
  bodies: uniq(CATALOG.map((e) => e.body)).sort(),
  usage: uniq(CATALOG.flatMap((e) => [...e.usage])).sort(),
  eras: uniq(CATALOG.map((e) => eraOf(e.modelYear))).sort() as Era[],
  drives: ['FWD', 'RWD', 'AWD', '4WD'].filter((d) => CATALOG.some((e) => e.drive === d)),
  transmissions: uniq(CATALOG.map((e) => e.transmission)).sort(),
  powertrains: uniq(CATALOG.map((e) => e.powertrain)).sort(),
  readiness: ['sim+benchmark', 'sim', 'catalog'],
};
