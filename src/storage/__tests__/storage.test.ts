import { describe, expect, it } from 'vitest';
import { createMemoryStore } from '../kv';
import {
  MAX_RESULTS,
  RESULTS_KEY,
  addResult,
  createResult,
  downsampleTrace,
  loadResults,
  persistResults,
  removeResult,
  type NewResult,
} from '../results';
import { SETTINGS_KEY, defaultSettings, loadSettings, persistSettings } from '../settings';
import { emptyMetrics } from '../../physics/metrics';
import { defaultTuning } from '../../tuning/tuning';
import { lexus } from '../../test-helpers';

const sample = (): NewResult => ({
  source: 'test',
  vehicleId: lexus.id,
  vehicleName: lexus.shortName,
  colorSlot: 0,
  tuningLabel: 'Stock',
  tuning: defaultTuning(lexus),
  launch: 'brake-boost',
  powerPs: 245,
  torqueNm: 350,
  massKg: 1755,
  metrics: { ...emptyMetrics(), zeroTo100KmhS: 7.1, topSpeedKmh: 200 },
  trace: Array.from({ length: 1000 }, (_, i) => ({ t: i * 0.05, speedKmh: i * 0.2 })),
});

describe('results storage', () => {
  it('round-trips results', () => {
    const store = createMemoryStore();
    const r = createResult(sample(), new Date('2026-01-01T00:00:00Z'));
    expect(r.createdAt).toBe('2026-01-01T00:00:00.000Z');
    expect(persistResults(store, [r])).toBe(true);
    expect(loadResults(store)).toEqual([r]);
  });

  it('downsamples traces and keeps the final point', () => {
    const d = downsampleTrace(sample().trace, 100);
    expect(d.t.length).toBeLessThanOrEqual(101);
    expect(d.t[d.t.length - 1]).toBeCloseTo(999 * 0.05, 3);
    expect(d.v[0]).toBe(0);
  });

  it('ignores corrupt or malformed data', () => {
    const store = createMemoryStore();
    store.set(RESULTS_KEY, '{not json');
    expect(loadResults(store)).toEqual([]);
    const good = createResult(sample());
    store.set(RESULTS_KEY, JSON.stringify([good, { id: 1 }, null, { ...good, metrics: 'x' }]));
    expect(loadResults(store)).toEqual([good]);
  });

  it('adds newest first, caps the list and removes by id', () => {
    let list = [] as ReturnType<typeof createResult>[];
    for (let i = 0; i < MAX_RESULTS + 5; i++) list = addResult(list, createResult(sample()));
    expect(list).toHaveLength(MAX_RESULTS);
    const id = list[3].id;
    expect(removeResult(list, id).some((r) => r.id === id)).toBe(false);
  });
});

describe('settings storage', () => {
  it('returns defaults for empty or corrupt storage', () => {
    const store = createMemoryStore();
    expect(loadSettings(store)).toEqual(defaultSettings());
    store.set(SETTINGS_KEY, 'nope');
    expect(loadSettings(store)).toEqual(defaultSettings());
  });

  it('round-trips and sanitizes settings', () => {
    const store = createMemoryStore();
    const s = defaultSettings();
    s.shiftMode = 'manual';
    s.launch = 'standard';
    s.tunings[lexus.id] = { ...defaultTuning(lexus), ecuStage: 'stage1' };
    s.favorites = ['2018-mclaren-720s-coupe-us-coupe-rwd-7dct'];
    s.timingBasis = 'rollout-1ft';
    persistSettings(store, s);
    expect(loadSettings(store)).toEqual(s);
    store.set(SETTINGS_KEY, JSON.stringify({ ...s, activeVehicleId: 'ghost', favorites: ['ghost', 5], dragLanes: [{ vehicleId: 'ghost' }] }));
    const loaded = loadSettings(store);
    expect(loaded.activeVehicleId).toBe(defaultSettings().activeVehicleId);
    expect(loaded.favorites).toEqual([]);
    expect(loaded.dragLanes).toEqual(defaultSettings().dragLanes);
  });

  it('loads settings saved by the original two-car version unchanged', () => {
    const store = createMemoryStore();
    const legacy = {
      activeVehicleId: 'skoda-superb-combi-lk-280',
      tunings: { 'lexus-is200t-2016-tw': { ...defaultTuning(lexus), ecuStage: 'stage1', weightDeltaKg: 80 } },
      shiftMode: 'manual',
      launch: 'standard',
    };
    store.set(SETTINGS_KEY, JSON.stringify(legacy));
    const s = loadSettings(store);
    expect(s.activeVehicleId).toBe('skoda-superb-combi-lk-280');
    expect(s.tunings['lexus-is200t-2016-tw'].ecuStage).toBe('stage1');
    expect(s.tunings['lexus-is200t-2016-tw'].weightDeltaKg).toBe(80);
    expect(s.shiftMode).toBe('manual');
    expect(s.dragLanes.map((l) => l.vehicleId)).toEqual(['lexus-is200t-2016-tw', 'skoda-superb-combi-lk-280']);
  });
});
