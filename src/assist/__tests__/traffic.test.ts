import { describe, expect, it } from 'vitest';
import type { VehicleSpec } from '../../data/types';
import { FIXED_DT } from '../../physics/constants';
import { kmhToMs, msToKmh } from '../../physics/units';
import { VEHICLES, lexus, sim, skoda } from '../../test-helpers';
import { LiveDriveLoop, type DriverInput } from '../liveDrive';
import { TRAFFIC_MODES, defaultRoad, isGenerated, stepLimit, type RoadSettings, type TrafficMode } from '../road';
import { LEVELS, TrafficSim, rearOf, type TrafficCar } from '../traffic';

const nevera = VEHICLES.find((v) => v.id === '2022-rimac-nevera-eu-coupe-awd-ev')!;
const TAIWAN: RoadSettings = { preset: 'taiwan', limitKmh: 110 };
const AUTOBAHN: RoadSettings = { preset: 'autobahn', limitKmh: null };
const IDLE: DriverInput = { throttle: 0, brake: 0 };
const steps = (s: number) => Math.round(s / FIXED_DT);

function session(spec: VehicleSpec, mode: TrafficMode, road: RoadSettings = TAIWAN, seed = 5, autoDrive = true) {
  const loop = new LiveDriveLoop(sim(spec), 'auto', { trafficMode: mode, seed, road });
  if (autoDrive) loop.engage();
  return loop;
}

function run(loop: LiveDriveLoop, seconds: number, input: DriverInput | ((t: number) => DriverInput) = IDLE, each?: (l: LiveDriveLoop, i: number) => void) {
  for (let i = 0; i < steps(seconds); i++) {
    loop.step(typeof input === 'function' ? input(loop.time) : input);
    each?.(loop, i);
  }
}

/** No two vehicles in the same path overlap (NPC with NPC). */
function overlaps(cars: readonly TrafficCar[]): boolean {
  for (const a of cars) for (const b of cars) if (a !== b && Math.abs(a.lat - b.lat) < 0.5 && rearOf(a) < b.x - 0.05 && a.x > rearOf(b) + 0.05) return true;
  return false;
}

describe('traffic selector', () => {
  it('offers Off, six densities and the two scripted tests in one list', () => {
    expect(TRAFFIC_MODES.map((m) => m.value)).toEqual(['off', 'very-sparse', 'sparse', 'mid', 'heavy', 'stuck', 'auto', 'cut-in', 'drivers']);
    expect(TRAFFIC_MODES.filter((m) => isGenerated(m.value)).map((m) => m.value)).toEqual(['very-sparse', 'sparse', 'mid', 'heavy', 'stuck', 'auto']);
  });

  it('keeps the road preset and limit independent of density, with a default to return to', () => {
    expect(defaultRoad('taiwan')).toEqual({ preset: 'taiwan', limitKmh: 110 });
    expect(defaultRoad('autobahn')).toEqual({ preset: 'autobahn', limitKmh: null });
    expect(stepLimit(110, -1)).toBe(100);
    expect(stepLimit(null, -1)).toBe(200);
    expect(stepLimit(60, -1)).toBe(60);
  });
});

describe('traffic density', () => {
  it('grows from Very sparse to Heavy, with Sparse at the 12–25 s baseline', () => {
    const load: Record<string, number> = {};
    for (const mode of ['very-sparse', 'sparse', 'mid', 'heavy'] as const) {
      const loop = session(lexus, mode);
      let sum = 0;
      let n = 0;
      run(loop, 180, IDLE, (l, i) => {
        if (i % 500 !== 0) return;
        const x = l.sim.state.distance;
        sum += l.traffic!.cars.filter((c) => Math.abs(c.x - x) < 400).length;
        n++;
      });
      load[mode] = sum / n;
      if (mode === 'sparse') {
        const times = [...new Set(loop.traffic!.events.filter((e) => e.kind === 'spawn' && e.t > 0).map((e) => e.t))];
        const gaps = times.slice(1).map((t, k) => t - times[k]);
        // Sparse keeps one car per encounter, 12–25 s of driving apart (the car is moving the whole time here).
        expect(Math.min(...gaps)).toBeGreaterThanOrEqual(LEVELS.sparse.intervalS[0] - 0.01);
        expect(gaps.filter((g) => g <= LEVELS.sparse.intervalS[1] + 0.01).length / gaps.length).toBeGreaterThan(0.7);
      }
    }
    expect(load['very-sparse']).toBeLessThan(load.sparse);
    expect(load.sparse).toBeLessThan(load.mid);
    expect(load.mid).toBeLessThan(load.heavy);
  }, 60_000);

  it('Auto holds seeded traffic patterns for a while and moves between them by changing the flow', () => {
    const levels = (seed: number) => {
      const loop = session(lexus, 'auto', TAIWAN, seed);
      run(loop, 420);
      return loop.traffic!.events.filter((e) => e.kind === 'level').map((e) => ({ t: e.t, level: e.note }));
    };
    const a = levels(11);
    expect(a.length).toBeGreaterThanOrEqual(4);
    for (let k = 1; k < a.length; k++) expect(a[k].t - a[k - 1].t).toBeGreaterThanOrEqual(35);
    expect(new Set(a.map((x) => x.level)).size).toBeGreaterThanOrEqual(3);
    expect(levels(11)).toEqual(a);
    expect(levels(12)).not.toEqual(a);
  }, 60_000);

  it('Stuck: the queue stops and restarts while the player waits, and Auto Drive stops at the gap and resumes', () => {
    const waiting = session(lexus, 'stuck', TAIWAN, 3, false);
    let starts = 0;
    let moving = false;
    run(waiting, 120, { throttle: 0, brake: 1 }, (l) => {
      const lead = l.traffic!.lead();
      if (!lead) return;
      const m = lead.speedMs > 0.3;
      if (m && !moving) starts++;
      moving = m;
    });
    expect(waiting.sim.state.distance).toBe(0);
    expect(starts).toBeGreaterThanOrEqual(5);

    for (const spec of [lexus, skoda, nevera]) {
      const loop = session(spec, 'stuck', TAIWAN, 3);
      let stops = 0;
      let rolling = false;
      let minGap = Infinity;
      run(loop, 150, IDLE, (l) => {
        const v = l.sim.state.speed;
        if (rolling && v === 0) stops++;
        rolling = v > 0.5 ? true : v === 0 ? false : rolling;
        if (l.time > 2) minGap = Math.min(minGap, l.traffic!.lead()?.gapM ?? Infinity);
      });
      expect(stops).toBeGreaterThanOrEqual(2);
      expect(minGap).toBeGreaterThan(4.3);
      expect(msToKmh(Math.max(...loop.traffic!.cars.map((c) => c.speed)))).toBeLessThan(120);
    }
  }, 60_000);

  it('switches density mid-drive without moving or removing the cars already there', () => {
    const loop = session(lexus, 'sparse');
    run(loop, 60);
    const before = new Map(loop.traffic!.cars.map((c) => [c.id, c.x]));
    loop.setTraffic('heavy');
    loop.step(IDLE);
    const after = loop.traffic!.cars.filter((c) => before.has(c.id));
    expect(after.length).toBe(before.size);
    for (const c of after) expect(Math.abs(c.x - before.get(c.id)!)).toBeLessThanOrEqual(c.speed * FIXED_DT + 1e-6);
    expect(loop.sim.state.distance).toBeGreaterThan(0);
    run(loop, 60);
    expect(loop.traffic!.events.some((e) => e.kind === 'setting' && e.note === 'density heavy')).toBe(true);
    expect(loop.traffic!.cars.length).toBeGreaterThan(before.size);
  }, 30_000);
});

describe('road presets and limits', () => {
  it('Taiwan: most traffic cruises at or below 100 or 110 km/h; a seeded minority drives less courteously', () => {
    for (const limit of [100, 110]) {
      const targets: number[] = [];
      for (const seed of [7, 8, 9]) {
        const loop = session(lexus, 'mid', { preset: 'taiwan', limitKmh: limit }, seed);
        run(loop, 150);
        for (const c of loop.traffic!.cars) {
          targets.push(msToKmh(c.v0Target));
          if (c.kind === 'truck') expect(msToKmh(c.v0Target)).toBeLessThanOrEqual(90.01);
        }
      }
      // Nobody over 10 % above the limit; most at it or below (courteous drivers aim up to 2 % over).
      expect(Math.max(...targets)).toBeLessThanOrEqual(limit * 1.1 + 0.1);
      expect(targets.filter((v) => v <= limit * 1.02 + 0.01).length / targets.length).toBeGreaterThan(0.75);
    }
    let polite = 0;
    let rude = 0;
    let unsignalledByRude = 0;
    let bursts = 0;
    for (const seed of [1, 2, 3, 4, 5]) {
      const loop = session(lexus, 'heavy', TAIWAN, seed);
      run(loop, 150);
      const ev = loop.traffic!.events;
      for (const e of ev.filter((x) => x.kind === 'spawn')) {
        if (e.courteous) polite++;
        else rude++;
      }
      for (const e of ev.filter((x) => x.kind === 'signal')) {
        if (e.courteous) expect(e.signalS!).toBeGreaterThanOrEqual(0.9);
        else if (e.signalS === 0) unsignalledByRude++;
      }
      bursts += ev.filter((x) => x.kind === 'burst').length;
    }
    expect(rude / (rude + polite)).toBeGreaterThan(0.04);
    expect(rude / (rude + polite)).toBeLessThan(0.25);
    expect(unsignalledByRude).toBeGreaterThan(0);
    expect(bursts).toBeGreaterThan(0);
  }, 90_000);

  it('a numeric limit applies to a running session gradually, under either preset, without changing lane behaviour', () => {
    for (const road of [TAIWAN, AUTOBAHN]) {
      const loop = session(lexus, 'mid', road, 9);
      run(loop, 60);
      loop.setRoad({ ...road, limitKmh: 80 });
      const v0Before = new Map(loop.traffic!.cars.map((c) => [c.id, c.v0]));
      let maxV0Step = 0;
      run(loop, 1, IDLE, (l) => {
        for (const c of l.traffic!.cars) {
          const prev = v0Before.get(c.id);
          if (prev !== undefined) maxV0Step = Math.max(maxV0Step, Math.abs(c.v0 - prev));
          v0Before.set(c.id, c.v0);
        }
      });
      expect(maxV0Step).toBeLessThanOrEqual(1.5 * FIXED_DT + 1e-9);
      run(loop, 40);
      for (const c of loop.traffic!.cars) if (c.fixedSpeed === null && !c.pacer && c.role !== 'behind') expect(msToKmh(c.v0Target)).toBeLessThanOrEqual(80 * 1.12 + 0.1);
      const settled = loop.traffic!.cars.filter((c) => c.ageS > 30 && c.fixedSpeed === null && c.role !== 'behind');
      expect(settled.every((c) => msToKmh(c.speed) < 80 * 1.12 + 3)).toBe(true);
      // The preset still governs lane behaviour: keep-right only on the Autobahn.
      const keepRight = loop.traffic!.events.filter((e) => e.reason === 'keep-right').length;
      if (road.preset === 'autobahn') expect(keepRight).toBeGreaterThan(0);
      else expect(keepRight).toBe(0);
    }
  }, 60_000);

  it('Autobahn: traffic keeps right, passes on the left, makes way for faster cars and the player, and does not weave', () => {
    const loop = session(nevera, 'heavy', AUTOBAHN, 4);
    // The player moves to the passing lane (its own command) and closes on traffic there.
    loop.requestLaneChange(-1);
    const laneTime = [0, 0, 0];
    const changesPerCar = new Map<number, number[]>();
    let overlap = false;
    run(loop, 200, IDLE, (l, i) => {
      if (i % 250 === 0) {
        for (const c of l.traffic!.cars) laneTime[c.lane]++;
        if (overlaps(l.traffic!.cars)) overlap = true;
      }
    });
    for (const e of loop.traffic!.events.filter((x) => x.kind === 'signal')) {
      const list = changesPerCar.get(e.id) ?? [];
      list.push(e.t * Math.sign(e.to! - e.lane!));
      changesPerCar.set(e.id, list);
    }
    const ev = loop.traffic!.events.filter((x) => x.kind === 'signal');
    expect(laneTime[2]).toBeGreaterThan(laneTime[0]);
    expect(ev.filter((e) => e.reason === 'keep-right').length).toBeGreaterThan(5);
    expect(ev.filter((e) => e.reason === 'pass' && e.to! > e.lane!).length).toBe(0);
    expect(ev.filter((e) => e.reason === 'yield').length).toBeGreaterThan(0);
    // No weaving: never out-and-back-and-out (or back-out-back) within 12 s, and at most four lane changes in any 30 s.
    // (Pulling out to pass, returning right and later passing the next slow car is ordinary overtaking.)
    for (const signed of changesPerCar.values()) {
      const t = signed.map(Math.abs);
      const dir = signed.map(Math.sign);
      for (let k = 2; k < t.length; k++) if (dir[k] !== dir[k - 1] && dir[k - 1] !== dir[k - 2]) expect(t[k] - t[k - 2]).toBeGreaterThan(12);
      for (let k = 4; k < t.length; k++) expect(t[k] - t[k - 4]).toBeGreaterThan(30);
    }
    expect(overlap).toBe(false);
    expect(loop.playerLane).toBe(0);
  }, 60_000);

  it('Autobahn: a car in the passing lane makes way for the faster player only into a free right lane, and returns right by habit', () => {
    const make = (id: number, lane: number, x: number, kmh: number, keepRightDelayS = 3): TrafficCar => ({
      id,
      role: 'adjacent',
      kind: 'car',
      lengthM: 4.6,
      shade: 0,
      traits: { courteous: true, speedFactor: 1, naturalKmh: kmh, limitFactor: 1, accel: 1.4, decel: 2.5, timeGapS: 1.4, jamGapM: 3, signalS: 1, changeS: 3, gapAcceptance: 1, keepRightDelayS, reactionS: 1 },
      x,
      speed: kmhToMs(kmh),
      lane,
      lat: lane,
      latV: 0,
      latA: 0,
      change: null,
      v0: kmhToMs(kmh),
      v0Target: kmhToMs(kmh),
      reactAtS: 0,
      flow: 1,
      burstUntilS: 0,
      inPlayerLane: false,
      followedS: 0,
      cutOutAfterS: null,
      cutOutSide: 1,
      cutInPending: false,
      cutInWindowM: null,
      retryAtS: 0,
      lastChangeS: -Infinity,
      lastChangeDir: 0,
      lastYieldS: -Infinity,
      laneSinceS: 0,
      nextDecisionS: 0,
      scripted: false,
      fixedSpeed: null,
      pacer: null,
      ageS: 0,
    });
    const world = (cars: TrafficCar[]) => {
      const player = { x: 0, speed: kmhToMs(200), accel: 0, lat: 0, targetLane: 0 };
      const t = new TrafficSim('very-sparse', 1, player, AUTOBAHN);
      (t as unknown as { nextEncounterS: number }).nextEncounterS = Infinity;
      t.cars.splice(0, t.cars.length, ...cars);
      return {
        t,
        go(seconds: number) {
          for (let i = 0; i < steps(seconds); i++) {
            player.x += player.speed * FIXED_DT;
            t.step(FIXED_DT, { ...player });
          }
        },
      };
    };
    // Faster player closing in the passing lane, right lane free: the car signals and moves right for the player.
    const free = world([make(100, 0, 90, 120, 60)]);
    free.go(3);
    expect(free.t.events.some((e) => e.kind === 'signal' && e.reason === 'yield' && e.note === 'for the player')).toBe(true);
    // Right lane occupied alongside: it stays put rather than merging into the other car.
    const blocked = world([make(100, 0, 90, 120, 60), make(101, 1, 92, 120, 60)]);
    blocked.go(2);
    expect(blocked.t.events.some((e) => e.kind === 'signal' && e.id === 100)).toBe(false);
    // No one behind: it returns right after its keep-right delay instead of staying in the passing lane.
    const camp = world([make(100, 0, 600, 150, 3)]);
    camp.go(5);
    expect(camp.t.events.find((e) => e.kind === 'signal' && e.id === 100)?.reason).toBe('keep-right');
  });

  it('NPC limits never change the player: Auto Drive still asks for 100 % on a clear road', () => {
    const loop = session(nevera, 'off', { preset: 'taiwan', limitKmh: 60 });
    run(loop, 3);
    expect(loop.autoDriveView().throttle).toBe(1);
    expect(msToKmh(loop.sim.state.speed)).toBeGreaterThan(80);
  });
});

describe('scripted tests', () => {
  it.each([
    ['Lexus IS 200t', lexus],
    ['Škoda Superb', skoda],
    ['Rimac Nevera', nevera],
  ] as [string, VehicleSpec][])('Driver test: a signalled merge, an unsignalled late merge and a short burst (%s)', (_, spec) => {
    const loop = session(spec, 'drivers', TAIWAN, 1);
    let minGap = Infinity;
    run(loop, 110, IDLE, (l) => {
      const g = l.traffic!.lead()?.gapM;
      if (g !== undefined) minGap = Math.min(minGap, g);
    });
    const ev = loop.traffic!.events;
    expect(ev.filter((e) => e.kind === 'phase').map((e) => e.note)).toEqual(['approach', 'signalled', 'unsignalled', 'burst', 'clear', 'done']);
    const cutIns = ev.filter((e) => e.kind === 'signal' && e.reason === 'cut-in');
    expect(cutIns[0].signalS).toBeGreaterThanOrEqual(1.5);
    expect(cutIns[0].courteous).toBe(true);
    expect(cutIns[1].signalS).toBe(0);
    expect(cutIns[1].courteous).toBe(false);
    expect(ev.filter((e) => e.kind === 'burst').length).toBe(1);
    expect(minGap).toBeGreaterThan(8);
    expect(loop.autoDriveView().throttle).toBe(1);
  }, 30_000);

  it('Cut-in test ends as missed, not stuck, when the lead is passed manually; the Auto Drive run still completes', () => {
    const manual = session(lexus, 'cut-in', TAIWAN, 1, false);
    let missedAt = -1;
    run(manual, 60, { throttle: 1, brake: 0 }, (l) => {
      if (missedAt < 0 && l.traffic!.phase === 'missed') missedAt = l.time;
    });
    expect(missedAt).toBeGreaterThan(0);
    expect(missedAt).toBeLessThan(35);
    expect(manual.trafficView().note).toMatch(/missed.*passed.*Reset to rerun/);
    // Reset reruns the baseline.
    manual.reset();
    expect(manual.traffic!.phase).toBe('approach');
    manual.engage();
    run(manual, 75);
    expect(manual.traffic!.phase).toBe('done');
  }, 30_000);

  it('Cut-in test is missed when the player leaves the test lane', () => {
    const loop = session(lexus, 'cut-in', TAIWAN, 1);
    run(loop, 10);
    expect(loop.requestLaneChange(-1).ok).toBe(true);
    run(loop, 4);
    expect(loop.traffic!.phase).toBe('missed');
    expect(loop.trafficView().note).toMatch(/left the test lane/);
  });
});

describe('replay', () => {
  it('reproduces traffic, lead changes and control with the same seed, settings and inputs, including mid-drive changes', () => {
    const go = () => {
      const loop = session(nevera, 'auto', AUTOBAHN, 21);
      const leads: (number | null)[] = [];
      run(loop, 140, (t) => (t > 100 && t < 102 ? { throttle: 0, brake: 1 } : IDLE), (l, i) => {
        if (i === steps(20)) l.setRoad({ preset: 'autobahn', limitKmh: 150 });
        if (i === steps(30)) l.requestLaneChange(1);
        if (i === steps(45)) l.setTraffic('heavy');
        if (i === steps(60)) l.setSeed(77);
        if (i === steps(105)) l.engage();
        const id = l.traffic!.lead()?.id ?? null;
        if (leads[leads.length - 1] !== id) leads.push(id);
      });
      return { events: JSON.stringify(loop.traffic!.events), leads, state: loop.sim.state, lane: loop.playerLat };
    };
    const a = go();
    const b = go();
    expect(b.events).toBe(a.events);
    expect(b.leads).toEqual(a.leads);
    expect(b.state).toEqual(a.state);
    expect(b.lane).toBe(a.lane);
    expect(a.leads.length).toBeGreaterThan(3);
  }, 60_000);

  it('Reset replays the seed with the current settings from a standing start', () => {
    const loop = session(lexus, 'mid', AUTOBAHN, 8);
    run(loop, 50);
    const first = JSON.stringify(loop.traffic!.events.filter((e) => e.t <= 50));
    loop.reset();
    loop.engage();
    run(loop, 50);
    expect(JSON.stringify(loop.traffic!.events.filter((e) => e.t <= 50))).toBe(first);
    expect(kmhToMs(1)).toBeGreaterThan(0);
  }, 30_000);
});

describe('traffic integrity', () => {
  it('never lets two vehicles overlap, including merges in stop-and-go queues', () => {
    const cases: [VehicleSpec, TrafficMode, RoadSettings][] = [
      [lexus, 'stuck', TAIWAN],
      [lexus, 'stuck', AUTOBAHN],
      [lexus, 'heavy', TAIWAN],
      [nevera, 'heavy', AUTOBAHN],
    ];
    for (const [spec, mode, road] of cases) {
      for (const seed of [1, 2, 3]) {
        const loop = session(spec, mode, road, seed);
        let overlap = false;
        run(loop, 120, IDLE, (l, i) => {
          if (i % 50 === 0 && overlaps(l.traffic!.cars)) overlap = true;
        });
        expect(overlap, `${mode}/${road.preset} seed ${seed}`).toBe(false);
      }
    }
  }, 120_000);

  it('moves traffic sideways with continuous position and speed, also when a lane change is abandoned', () => {
    let aborts = 0;
    for (const seed of [1, 2, 3, 4]) {
      const loop = session(nevera, 'heavy', AUTOBAHN, seed);
      const prev = new Map<number, { lat: number; v: number }>();
      let maxStep = 0;
      let maxDv = 0;
      run(loop, 100, IDLE, (l) => {
        for (const c of l.traffic!.cars) {
          const p = prev.get(c.id);
          if (p) {
            const v = (c.lat - p.lat) / FIXED_DT;
            maxStep = Math.max(maxStep, Math.abs(c.lat - p.lat));
            maxDv = Math.max(maxDv, Math.abs(v - p.v));
            prev.set(c.id, { lat: c.lat, v });
          } else prev.set(c.id, { lat: c.lat, v: 0 });
        }
      });
      aborts += loop.traffic!.events.filter((e) => e.kind === 'abort').length;
      // At most ~1.1 lanes/s sideways, and no step change in sideways speed (minimum-jerk moves and reversals).
      expect(maxStep).toBeLessThan(1.1 * FIXED_DT);
      expect(maxDv).toBeLessThan(0.02);
    }
    expect(aborts).toBeGreaterThan(0);
  }, 60_000);
});

describe('mode transitions (review fixes)', () => {
  it('Stuck → Sparse: queue heads become ordinary traffic, speed up when unblocked and follow later road changes', () => {
    const loop = session(lexus, 'stuck', TAIWAN, 1, false);
    run(loop, 20, { throttle: 0, brake: 1 });
    const heads = loop.traffic!.cars.filter((c) => c.pacer).map((c) => c.id);
    expect(heads.length).toBe(3);
    const before = new Map(loop.traffic!.cars.map((c) => [c.id, { x: c.x, v: c.speed }]));
    loop.setTraffic('sparse');
    loop.setRoad({ preset: 'autobahn', limitKmh: 120 });
    for (const c of loop.traffic!.cars) {
      const b = before.get(c.id)!;
      expect(c.x).toBe(b.x);
      expect(c.speed).toBe(b.v);
    }
    run(loop, 40, { throttle: 0, brake: 1 });
    for (const id of heads) {
      const c = loop.traffic!.cars.find((x) => x.id === id);
      if (!c) continue;
      expect(c.pacer).toBeNull();
      expect(msToKmh(c.v0Target)).toBeLessThanOrEqual(120 * 1.12 + 0.1);
      expect(msToKmh(c.v0Target)).toBeGreaterThan(60);
      expect(msToKmh(c.speed)).toBeGreaterThan(40);
    }
  }, 30_000);

  it('Auto: leaving congestion releases the queue the same way', () => {
    // Seed 11 with the player waiting: mid → heavy → jam (159 s) → mid (200 s).
    const loop = session(lexus, 'auto', TAIWAN, 11, false);
    let heads: number[] = [];
    run(loop, 199, { throttle: 0, brake: 1 }, (l) => {
      if (!heads.length && l.traffic!.currentLevel === 'jam') heads = [];
      const ps = l.traffic!.cars.filter((c) => c.pacer).map((c) => c.id);
      if (ps.length) heads = ps;
    });
    expect(loop.traffic!.currentLevel).toBe('jam');
    expect(heads.length).toBeGreaterThan(0);
    run(loop, 30, { throttle: 0, brake: 1 });
    expect(loop.traffic!.currentLevel).toBe('mid');
    expect(loop.traffic!.cars.some((c) => c.pacer)).toBe(false);
    for (const c of loop.traffic!.cars.filter((x) => heads.includes(x.id))) expect(msToKmh(c.v0Target)).toBeGreaterThan(60);
  }, 60_000);

  it('choosing generated traffic ends a test: no stale phase or guidance, and its cars follow the road limit', () => {
    const loop = session(lexus, 'cut-in', TAIWAN, 1);
    run(loop, 20);
    expect(loop.traffic!.phase).toBe('approach');
    loop.setTraffic('sparse');
    expect(loop.traffic!.phase).toBeNull();
    expect(loop.trafficView().note).toBeNull();
    const a = loop.traffic!.cars.find((c) => c.id === 1)!;
    expect(a.fixedSpeed).toBeNull();
    loop.setRoad({ preset: 'taiwan', limitKmh: 60 });
    let maxDecel = 0;
    let prev = a.speed;
    run(loop, 40, IDLE, () => {
      maxDecel = Math.max(maxDecel, (prev - a.speed) / FIXED_DT);
      prev = a.speed;
    });
    expect(msToKmh(a.v0Target)).toBeLessThanOrEqual(60 * 1.1 + 0.1);
    expect(msToKmh(a.speed)).toBeLessThan(60 * 1.1 + 2);
    expect(maxDecel).toBeLessThan(1.3);
    // The test itself still replays from Reset while selected.
    loop.setTraffic('cut-in');
    expect(loop.traffic!.phase).toBe('approach');
  }, 30_000);
});
