import { describe, expect, it } from 'vitest';
import { findEntry } from '../../data/catalog';
import type { VehicleSpec } from '../../data/types';
import { FIXED_DT } from '../../physics/constants';
import { msToKmh } from '../../physics/units';
import { lexus, sim } from '../../test-helpers';
import { LiveDriveLoop } from '../liveDrive';
import type { TrafficMode } from '../road';
import { LEVELS, PLAYER_LENGTH_M, rearOf, type TrafficCar } from '../traffic';

/** What the road strip draws around the player's front bumper (≈ 170 m ahead, a car length or so behind). */
const VIEW_AHEAD_M = 170;
const VIEW_BEHIND_M = 30;
const SF90 = findEntry('2021-ferrari-sf90-stradale-assetto-fiorano-us-coupe-awd-8dct')!.sim! as VehicleSpec;

interface FlowStats {
  /** Cars that came into view after the warm-up, by the side they came from. */
  newAhead: number;
  newBehind: number;
  /** Cars that came from behind and then passed the player. */
  passed: number;
  /** Longest stretch with nothing in view after the warm-up, s. */
  longestEmptyS: number;
  maxCars: number;
  overlap: boolean;
  throughPlayer: boolean;
  avgKmh: number;
}

function overlaps(cars: readonly TrafficCar[]): boolean {
  for (const a of cars) for (const b of cars) if (a !== b && Math.abs(a.lat - b.lat) < 0.5 && rearOf(a) < b.x - 0.05 && a.x > rearOf(b) + 0.05) return true;
  return false;
}

/**
 * Auto Drive off, the driver holding a speed with the accelerator only (no
 * brake, no lane change): the player keeps the middle lane, so traffic in it
 * must follow the player and the rest must flow past.
 */
function drive(spec: VehicleSpec, mode: Exclude<TrafficMode, 'off'>, seed: number, targetKmh: number, warmupS: number, seconds: number): FlowStats {
  const loop = new LiveDriveLoop(sim(spec), 'auto', { trafficMode: mode, seed, road: { preset: 'taiwan', limitKmh: 110 } });
  const firstSeen = new Map<number, { t: number; behind: boolean }>();
  const passedIds = new Set<number>();
  let lastVisible = warmupS;
  let longestEmpty = 0;
  let maxCars = 0;
  let overlap = false;
  let through = false;
  let kmhSum = 0;
  let n = 0;
  const total = warmupS + seconds;
  for (let i = 0; i * FIXED_DT < total; i++) {
    const v = msToKmh(loop.sim.state.speed);
    loop.step({ throttle: v < targetKmh - 2 ? 1 : v < targetKmh ? 0.4 : 0, brake: 0 });
    if (i % 20 !== 0) continue;
    const t = loop.time;
    const x = loop.sim.state.distance;
    const cars = loop.traffic!.cars;
    maxCars = Math.max(maxCars, cars.length);
    let any = false;
    for (const c of cars) {
      const d = c.x - x;
      const inView = d > -VIEW_BEHIND_M && d - c.lengthM < VIEW_AHEAD_M;
      if (inView) {
        any = true;
        if (!firstSeen.has(c.id)) firstSeen.set(c.id, { t, behind: d < 0 });
      }
      const seen = firstSeen.get(c.id);
      if (seen?.behind && rearOf(c) > x + 1) passedIds.add(c.id);
      // Traffic responds to the player: a faster car in the player's lane never runs into it from behind.
      // (The player itself has no collision model, so a fast driver can still pass through slower cars.)
      const closing = c.speed > loop.sim.state.speed + 0.5;
      if (closing && Math.abs(c.lat - loop.playerLat) < 0.5 && c.x <= x && c.x > x - PLAYER_LENGTH_M + 0.3) through = true;
    }
    if (i % 50 === 0 && overlaps(cars)) overlap = true;
    if (t < warmupS) continue;
    kmhSum += v;
    n++;
    if (any) {
      longestEmpty = Math.max(longestEmpty, t - lastVisible);
      lastVisible = t;
    }
  }
  longestEmpty = Math.max(longestEmpty, total - lastVisible);
  const after = [...firstSeen.values()].filter((s) => s.t >= warmupS);
  return {
    newAhead: after.filter((s) => !s.behind).length,
    newBehind: after.filter((s) => s.behind).length,
    passed: [...passedIds].filter((id) => (firstSeen.get(id)?.t ?? 0) >= warmupS).length,
    longestEmptyS: longestEmpty,
    maxCars,
    overlap,
    throughPlayer: through,
    avgKmh: kmhSum / Math.max(1, n),
  };
}

const BOUND = LEVELS.heavy.maxCars + LEVELS.heavy.group[1];

describe('Heavy traffic keeps flowing with Auto Drive off', () => {
  it('at ≈ 195 km/h, new traffic keeps appearing ahead after the first group is overtaken (two minutes, Taiwan)', () => {
    for (const seed of [1, 6]) {
      const heavy = drive(SF90, 'heavy', seed, 195, 30, 120);
      const sparse = drive(SF90, 'sparse', seed, 195, 30, 120);
      expect(heavy.avgKmh).toBeGreaterThan(185);
      // Dozens of cars come into view ahead, with no long empty stretch.
      expect(heavy.newAhead).toBeGreaterThan(40);
      expect(heavy.longestEmptyS).toBeLessThan(5);
      // Heavy stays far denser than Sparse at the same speed.
      expect(heavy.newAhead).toBeGreaterThan(4 * sparse.newAhead);
      expect(sparse.longestEmptyS).toBeGreaterThan(heavy.longestEmptyS + 5);
      expect(heavy.maxCars).toBeLessThanOrEqual(BOUND);
      expect(heavy.overlap).toBe(false);
      expect(heavy.throughPlayer).toBe(false);
    }
  }, 120_000);

  it('at ≈ 25 km/h, traffic keeps arriving from behind and passing in the free lanes (two minutes, Taiwan)', () => {
    for (const seed of [1, 3]) {
      const heavy = drive(lexus, 'heavy', seed, 25, 30, 120);
      const sparse = drive(lexus, 'sparse', seed, 25, 30, 120);
      expect(heavy.avgKmh).toBeGreaterThan(20);
      expect(heavy.avgKmh).toBeLessThan(30);
      // Repeated rear approaches that overtake the player, never a dry road.
      expect(heavy.newBehind).toBeGreaterThan(20);
      expect(heavy.passed).toBeGreaterThan(15);
      expect(heavy.longestEmptyS).toBeLessThan(5);
      expect(heavy.newBehind).toBeGreaterThan(3 * Math.max(1, sparse.newBehind));
      // Overtaken traffic that pulls away no longer holds the car budget.
      expect(heavy.maxCars).toBeLessThanOrEqual(BOUND);
      expect(heavy.overlap).toBe(false);
      expect(heavy.throughPlayer).toBe(false);
    }
  }, 120_000);
});

