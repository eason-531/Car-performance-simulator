/// <reference types="node" />
import { writeFileSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CATALOG } from '..';
import { computeStockStats } from '../stockStats';
import { STOCK_STATS, type StockStats } from '../stockStats.generated';

const FILE = new URL('../stockStats.generated.ts', import.meta.url);

/**
 * The stock benchmark table is generated offline (so the UI never runs every
 * car's simulation). This test regenerates it and fails if the committed copy
 * is stale. Update with `npm run generate:stats`.
 */
describe('generated stock stats', () => {
  const fresh: Record<string, StockStats> = {};
  for (const e of CATALOG) if (e.sim) fresh[e.id] = computeStockStats(e.sim);

  if (process.env.UPDATE_GENERATED) {
    it('writes the generated file', () => {
      const src = readFileSync(FILE, 'utf8');
      const head = src.slice(0, src.indexOf('export const STOCK_STATS'));
      writeFileSync(FILE, `${head}export const STOCK_STATS: Record<string, StockStats> = ${JSON.stringify(fresh, null, 2)};\n`);
      expect(true).toBe(true);
    });
    return;
  }

  it('covers exactly the playable cars', () => {
    expect(Object.keys(STOCK_STATS).sort()).toEqual(Object.keys(fresh).sort());
  });

  it.each(Object.keys(fresh))('%s is up to date', (id) => {
    const a = STOCK_STATS[id];
    const b = fresh[id];
    expect(a.cls).toBe(b.cls);
    expect(a.formula).toBe(b.formula);
    expect(a.score ?? 0).toBeCloseTo(b.score ?? 0, 0);
    expect(a.brakeRelease.quarterMileS ?? 0).toBeCloseTo(b.brakeRelease.quarterMileS ?? 0, 2);
    expect(a.rollout.zeroTo100KmhS ?? 0).toBeCloseTo(b.rollout.zeroTo100KmhS ?? 0, 2);
  });
});
