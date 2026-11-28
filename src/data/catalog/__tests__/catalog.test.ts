import { describe, expect, it } from 'vitest';
import {
  LEGACY_IDS,
  measuredResult,
  sortNote,
  CATALOG,
  EMPTY_FILTERS,
  FACETS,
  OWNER_IDS,
  applyFilters,
  findEntry,
  fold,
  matchesQuery,
  readinessOf,
  sortEntries,
} from '..';
import { assignSeries } from '../../../lib/colors';
import { classForScore, classScore } from '../classes';

describe('catalog', () => {
  it('holds the owner cars, the 73-car roster and the hypercar extension with unique stable ids', () => {
    const extension = CATALOG.filter((e) => e.extension);
    expect(CATALOG).toHaveLength(75 + extension.length);
    expect(OWNER_IDS).toEqual(['lexus-is200t-2016-tw', 'skoda-superb-combi-lk-280']);
    expect(new Set(CATALOG.map((e) => e.id)).size).toBe(CATALOG.length);
    const rosterNumbers = CATALOG.filter((e) => e.roster).map((e) => e.roster);
    expect(rosterNumbers).toEqual(Array.from({ length: 73 }, (_, i) => i + 1));
    // Every entry is exactly one of: owner car, roster row, extension entry.
    for (const e of CATALOG) expect([!!e.owner, e.roster !== undefined, !!e.extension].filter(Boolean)).toHaveLength(1);
  });

  it('keeps the hypercar extension playable, tagged and in handoff order', () => {
    const ext = CATALOG.filter((e) => e.extension);
    expect(ext.length).toBeGreaterThanOrEqual(6);
    const orders = ext.map((e) => e.extension!.order);
    expect(new Set(orders).size).toBe(orders.length);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
    for (const e of ext) {
      expect(e.extension!.set).toBe('Hypercars');
      expect(Number.isInteger(e.extension!.order) && e.extension!.order > 0).toBe(true);
      expect(e.usage).toContain('Hypercar');
      expect(e.section).toBe('Hypercars');
      expect(e.sim, `${e.id} must be playable`).toBeTruthy();
      expect(e.sim!.provenance.some((p) => p.status === 'verified' && p.parameter === 'Peak power')).toBe(true);
    }
    // The handoff requires Veyron 16.4, base Chiron and Koenigsegg representation.
    expect(ext.some((e) => e.make === 'Bugatti' && e.model === 'Veyron 16.4')).toBe(true);
    expect(ext.some((e) => e.make === 'Bugatti' && e.model === 'Chiron' && e.trim === 'Coupé')).toBe(true);
    expect(ext.some((e) => e.make === 'Koenigsegg')).toBe(true);
    // Only extension entries carry the Hypercar tag; the original roster is unchanged.
    for (const e of CATALOG.filter((x) => !x.extension)) expect(e.usage).not.toContain('Hypercar');
  });

  it('keeps retired ids resolvable and never reuses them', () => {
    expect(Object.keys(LEGACY_IDS).length).toBeGreaterThan(0);
    for (const [oldId, newId] of Object.entries(LEGACY_IDS)) {
      expect(CATALOG.some((e) => e.id === oldId)).toBe(false);
      expect(findEntry(newId)?.id).toBe(newId);
      expect(findEntry(oldId)?.id).toBe(newId);
    }
  });

  it('runs every configuration of the pinned 83-car data-gap roster, including the nine formerly catalog-only', () => {
    // The nine configurations that had no simulator spec at 85cf2b7 / 5566be6 (pinned DATA_GAPS.md).
    const formerlyCatalogOnly = [
      '2023-toyota-prius-limited-awd-us-liftback-awd-ecvt',
      '2022-audi-rs-3-us-sedan-awd-7dct',
      '2018-mercedes-amg-e-63-s-wagon-4matic-us-wagon-awd-9mct',
      '2020-volvo-v60-t8-polestar-engineered-us-wagon-awd-8at',
      '2025-bmw-m5-touring-us-wagon-awd-8at',
      '2021-porsche-macan-gts-us-suv-awd-7dct',
      '2021-ford-f-150-raptor-supercrew-37-performance-package-us-pickup-4wd-10at',
      '2017-acura-nsx-us-coupe-awd-9dct',
      '2021-ferrari-sf90-stradale-assetto-fiorano-us-coupe-awd-8dct',
    ];
    for (const id of formerlyCatalogOnly) {
      const e = findEntry(id);
      expect(e?.id, id).toBe(id);
      expect(e!.sim, `${id} must be playable`).toBeTruthy();
      expect(e!.unsupportedReason).toBeUndefined();
    }
  });

  it('gives every car at least one source link and a reason when it cannot run', () => {
    for (const e of CATALOG) {
      expect(e.sources.length).toBeGreaterThan(0);
      if (!e.sim) expect(e.unsupportedReason).toBeTruthy();
      if (e.sim) expect(e.sim.id).toBe(e.id);
      for (const b of e.benchmarks) expect(e.sources.some((s) => s.id === b.sourceId)).toBe(true);
    }
  });

  it('keeps the owner ACC note as owner metadata', () => {
    expect(findEntry('skoda-superb-combi-lk-280')?.owner?.acc).toBe(false);
  });

  it('folds case and diacritics in search', () => {
    expect(fold('Škoda Huracán Première')).toBe('skoda huracan premiere');
    const skodas = CATALOG.filter((e) => matchesQuery(e, 'skoda'));
    expect(skodas.map((e) => e.make)).toEqual(['Škoda', 'Škoda']);
    expect(CATALOG.filter((e) => matchesQuery(e, 'HURACAN')).length).toBe(1);
  });

  it('searches aliases, chassis codes and multiple tokens', () => {
    expect(CATALOG.filter((e) => matchesQuery(e, 'fl5')).map((e) => e.roster)).toEqual([1]);
    expect(CATALOG.filter((e) => matchesQuery(e, 'gr-four')).length).toBe(2);
    expect(CATALOG.filter((e) => matchesQuery(e, 'porsche 2022')).length).toBe(2);
  });

  it('combines facets (AND) and values within a facet (OR)', () => {
    const r = applyFilters(CATALOG, { ...EMPTY_FILTERS, drives: ['AWD'], transmissions: ['MT'] }, []);
    expect(r.length).toBeGreaterThan(3);
    for (const e of r) {
      expect(e.drive).toBe('AWD');
      expect(e.transmission).toBe('MT');
    }
    const either = applyFilters(CATALOG, { ...EMPTY_FILTERS, brands: ['Lexus', 'Acura'] }, []);
    expect(new Set(either.map((e) => e.make))).toEqual(new Set(['Lexus', 'Acura']));
  });

  it('keeps brand origin independent of spec market', () => {
    const usAudis = applyFilters(CATALOG, { ...EMPTY_FILTERS, brands: ['Audi'], markets: ['US'] }, []);
    expect(usAudis.length).toBeGreaterThan(0);
    for (const e of usAudis) expect(e.origin).toBe('Germany');
    for (const e of CATALOG.filter((x) => x.make === 'Acura' || x.make === 'Lexus')) expect(e.origin).toBe('Japan');
  });

  it('puts favorites first and missing values last', () => {
    const fav = CATALOG[10].id;
    const sorted = sortEntries(CATALOG, 'favorites', [fav]);
    expect(sorted.slice(0, 2).map((e) => e.id)).toEqual(OWNER_IDS);
    expect(sorted[2].id).toBe(fav);
    const byMeasured = sortEntries(CATALOG, 'meas-quarter', []);
    const firstMissing = byMeasured.findIndex((e) => !e.benchmarks.some((b) => b.results.quarterMileS));
    expect(byMeasured.slice(firstMissing).every((e) => !e.benchmarks.some((b) => b.results.quarterMileS))).toBe(true);
  });

  it('labels readiness and leaves class pending without a simulation', () => {
    for (const e of CATALOG) {
      if (!e.sim) expect(readinessOf(e)).toBe('catalog');
      else expect(['sim', 'sim+benchmark']).toContain(readinessOf(e));
    }
    expect(FACETS.classes).toContain('Pending');
  });
});

describe('stock class formula', () => {
  it('orders classes by straight-line performance', () => {
    expect(classForScore(classScore(16.5, 135, 9.5))).toBe('D');
    // SLC-2 reference fixtures: slow → D, middle → B, fast → S+.
    expect(classForScore(classScore(15.5, 150, 7.5))).toBe('D');
    expect(classForScore(classScore(13.5, 170, 5.5))).toBe('B');
    expect(classForScore(classScore(11.0, 210, 3.0))).toBe('S+');
    expect(classForScore(classScore(10.0, 220, 2.8))).toBe('S+');
    expect(classScore(12, 190, 4)).toBeGreaterThan(classScore(13, 175, 5));
  });
});

describe('local series colours', () => {
  it('keeps owner home slots and gives distinct cars distinct colours', () => {
    const s = assignSeries([
      { key: 'a', vehicleId: 'x' },
      { key: 'b', vehicleId: 'skoda', homeSlot: 1 },
      { key: 'c', vehicleId: 'y' },
    ]);
    expect(s.get('b')!.slot).toBe(1);
    expect(new Set([s.get('a')!.slot, s.get('b')!.slot, s.get('c')!.slot]).size).toBe(3);
  });

  it('gives the same car the same colour with a different dash', () => {
    const s = assignSeries([
      { key: 'stock', vehicleId: 'x' },
      { key: 'tuned', vehicleId: 'x' },
    ]);
    expect(s.get('stock')!.color).toBe(s.get('tuned')!.color);
    expect(s.get('stock')!.dash).not.toBe(s.get('tuned')!.dash);
  });
});

describe('catalog source integrity', () => {
  it.each(CATALOG.map((e) => [e.id, e] as const))('%s has unique, resolvable sources', (_id, e) => {
    const ids = e.sources.map((s) => s.id);
    expect(new Set(ids).size, 'duplicate source id').toBe(ids.length);
    const urls = e.sources.map((s) => s.url).filter((u): u is string => !!u);
    expect(new Set(urls).size, 'same URL listed under two source ids').toBe(urls.length);
    const benchIds = e.benchmarks.map((b) => b.id);
    expect(new Set(benchIds).size, 'duplicate benchmark id').toBe(benchIds.length);
    for (const b of e.benchmarks) expect(ids, `benchmark ${b.id} cites a missing source`).toContain(b.sourceId);
    if (e.factory.sourceId) expect(ids, 'factory cites a missing source').toContain(e.factory.sourceId);
  });
});

describe('measured sorting transparency', () => {
  const find = (fragment: string) => CATALOG.find((e) => e.id.includes(fragment))!;
  it('prefers exact-configuration tests over equivalents such as drag-strip passes', () => {
    const redeye = find('redeye');
    const r = measuredResult(redeye, 'quarterMileS')!;
    expect(r.benchmark.match).toBe('exact');
    expect(r.value).toBeGreaterThan(10.8); // the Cars.com drag-strip 10.8 s is an equivalent
  });
  it('falls back to equivalent tests only when no exact test exists, and says so', () => {
    const yaris = find('gr-yaris');
    expect(measuredResult(yaris, 'zeroTo100KmhS')!.benchmark.match).toBe('equivalent');
    expect(sortNote(yaris, 'meas-0-100')).toMatch(/equivalent configuration/);
  });
  it('names the publication and timing basis of the value used', () => {
    const note = sortNote(find('gr-corolla'), 'meas-quarter')!;
    expect(note).toContain('Car and Driver');
    expect(note).toContain('1-ft rollout');
    expect(sortNote(find('gr-corolla'), 'name')).toBeNull();
  });
});
