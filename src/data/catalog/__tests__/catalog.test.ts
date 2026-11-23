import { describe, expect, it } from 'vitest';
import {
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
  it('holds the owner cars plus the 73-car roster with unique stable ids', () => {
    expect(CATALOG).toHaveLength(75);
    expect(OWNER_IDS).toEqual(['lexus-is200t-2016-tw', 'skoda-superb-combi-lk-280']);
    expect(new Set(CATALOG.map((e) => e.id)).size).toBe(CATALOG.length);
    const rosterNumbers = CATALOG.filter((e) => e.roster).map((e) => e.roster);
    expect(rosterNumbers).toEqual(Array.from({ length: 73 }, (_, i) => i + 1));
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
