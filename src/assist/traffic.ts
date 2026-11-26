import { clamp, kmhToMs, msToKmh, smoothstep } from '../physics/units';
import { Rng, normaliseSeed } from './rng';
import { isGenerated, isScripted, type RoadSettings, type TrafficDensity, type TrafficMode, type TrafficScript } from './road';

/**
 * Seeded traffic for Live Drive (and later the Highway view).
 *
 * One straight road with three lanes: 0 = left, 1 = middle, 2 = right. The
 * player starts in the middle lane and changes lanes only on command; its
 * lateral position (`lat`, in lanes) is passed in every step. Positions run
 * along the player's distance axis (front bumpers, metres). Everything
 * advances on simulation time with one seeded generator, so the same seed,
 * settings, starting state and player inputs reproduce the same traffic.
 *
 * NPCs follow each other (and the player) with the Intelligent Driver Model
 * using per-driver parameters. Lane changes signal (or not, for a seeded
 * minority of less courteous drivers), then move along a smoothstep curve.
 * A car counts as in the player's path once it is within 0.6 lanes of the
 * player's lateral position and stops counting beyond 0.75 lanes, so cut-ins,
 * cut-outs and the player's own lane changes all use one boundary.
 */

export const LANE_COUNT = 3;
export const START_LANE = 1;
export const PLAYER_LENGTH_M = 4.7;
/** A car within this many lanes of the player's lateral position counts as in its path… */
export const CLAIM_LANES = 0.6;
/** …and stops counting beyond this many. */
export const RELEASE_LANES = 0.75;
export const SIGNAL_S = 1.2;
export const LANE_CHANGE_S = 3;
/** Sparse baseline: driving time between encounters, s. */
export const ENCOUNTER_INTERVAL_S: readonly [number, number] = [12, 25];
/** Slower traffic is placed at least this far ahead (beyond the drawn road), m. */
export const SPAWN_AHEAD_MIN_M = 240;
/** Faster traffic joins this far behind the player, m. */
export const SPAWN_BEHIND_M = 70;
/** Traffic farther than this ahead or behind is removed, m. */
export const DESPAWN_AHEAD_M = 4000;
export const DESPAWN_BEHIND_M = 250;

const STANDSTILL_GAP_M = 5;
const SPAWN_DECEL = 1.0;
const CUT_IN_DECEL = 1.8;
const CUT_IN_CLAIM_S = 2.5;
const DECISION_S = 0.25;
const MAX_EVENTS = 600;

export type Level = 'very-sparse' | 'sparse' | 'mid' | 'heavy' | 'jam';

interface LevelSpec {
  intervalS: readonly [number, number];
  group: readonly [number, number];
  maxCars: number;
  /** Scales the target speed of cars spawned at this level (reduced flow). */
  flow: number;
  /** Encounter mix: slower car in the player's lane, cut-in, adjacent, faster car from behind. */
  mix: readonly [number, number, number, number];
}

export const LEVELS: Readonly<Record<Level, LevelSpec>> = {
  'very-sparse': { intervalS: [30, 55], group: [1, 1], maxCars: 4, flow: 1, mix: [0.35, 0.25, 0.3, 0.1] },
  sparse: { intervalS: ENCOUNTER_INTERVAL_S, group: [1, 1], maxCars: 8, flow: 1, mix: [0.4, 0.35, 0.25, 0] },
  mid: { intervalS: [7, 13], group: [1, 3], maxCars: 14, flow: 1, mix: [0.3, 0.3, 0.25, 0.15] },
  heavy: { intervalS: [3.5, 7], group: [2, 4], maxCars: 22, flow: 0.88, mix: [0.3, 0.25, 0.25, 0.2] },
  jam: { intervalS: [6, 12], group: [1, 2], maxCars: 26, flow: 0.8, mix: [0, 0, 0, 1] },
};

export type VehicleKind = 'car' | 'van' | 'truck';
export type CarRole = 'lead' | 'cut-in' | 'adjacent' | 'behind' | 'queue' | 'pacer' | 'script';

/** Per-vehicle driver habits, sampled from the seed at spawn (simulator design assumptions, not measured data). */
export interface DriverTraits {
  /** A seeded minority: late or unsignalled cut-ins, tighter accepted gaps, short acceleration bursts. */
  courteous: boolean;
  /** Taiwan: fraction of the limit this driver aims for. */
  speedFactor: number;
  /** Autobahn: preferred speed without a limit, km/h. */
  naturalKmh: number;
  /** Autobahn with a numeric limit: fraction of the limit tolerated. */
  limitFactor: number;
  accel: number;
  decel: number;
  timeGapS: number;
  jamGapM: number;
  /** Signal time before a lane change, s (0 = none). */
  signalS: number;
  /** Lateral move duration, s. */
  changeS: number;
  /** Multiplier on accepted lane-change gaps (1 normal, ~0.55 less courteous). */
  gapAcceptance: number;
  /** Autobahn: time before returning right after a pass or on entering a left lane, s. */
  keepRightDelayS: number;
  /** Delay before reacting to a new speed limit, s. */
  reactionS: number;
}

interface LaneChange {
  from: number;
  to: number;
  latStart: number;
  elapsedS: number;
  signalS: number;
  durationS: number;
  reason: 'cut-in' | 'cut-out' | 'pass' | 'keep-right' | 'yield' | 'abort' | 'script';
}

interface Pacer {
  /** Stop-and-go phase and when it ends (simulation time). */
  go: boolean;
  untilS: number;
  goMs: number;
  released: boolean;
}

export interface TrafficCar {
  readonly id: number;
  readonly role: CarRole;
  readonly kind: VehicleKind;
  readonly lengthM: number;
  readonly shade: number;
  readonly traits: DriverTraits;
  x: number;
  speed: number;
  /** Lane the car is in, or is leaving during a change. */
  lane: number;
  lat: number;
  change: LaneChange | null;
  /** Desired speed now, and the speed it is adjusting to after a limit change, m/s. */
  v0: number;
  v0Target: number;
  reactAtS: number;
  /** Flow scaling applied at spawn. */
  flow: number;
  burstUntilS: number;
  /** Counted as in the player's path (with hysteresis). */
  inPlayerLane: boolean;
  followedS: number;
  cutOutAfterS: number | null;
  cutOutSide: -1 | 1;
  cutInPending: boolean;
  cutInWindowM: readonly [number, number] | null;
  retryAtS: number;
  lastChangeS: number;
  /** Direction of the last lane change (−1 left, +1 right, 0 none). */
  lastChangeDir: -1 | 0 | 1;
  /** Last time it made way for faster traffic (it lets that traffic go by before pulling out again). */
  lastYieldS: number;
  laneSinceS: number;
  nextDecisionS: number;
  /** Driven by a script (no lane decisions of its own). */
  scripted: boolean;
  /** Scripted speed (m/s) overriding the road-derived target, or null. */
  fixedSpeed: number | null;
  pacer: Pacer | null;
  ageS: number;
}

export interface TrafficEvent {
  t: number;
  kind: 'spawn' | 'signal' | 'abort' | 'despawn' | 'phase' | 'level' | 'burst' | 'setting';
  id: number;
  role?: CarRole;
  lane?: number;
  to?: number;
  gapM?: number;
  speedKmh?: number;
  /** Signal time used for a lane change, s (0 = unsignalled). */
  signalS?: number;
  reason?: string;
  courteous?: boolean;
  note?: string;
}

export interface PlayerState {
  /** Front bumper, m along the road. */
  x: number;
  speed: number;
  accel: number;
  /** Lateral position in lanes (continuous during a lane change). */
  lat: number;
  /** Lane the player is moving to (or is in). */
  targetLane: number;
}

export interface LeadInfo {
  id: number;
  /** Bumper-to-bumper gap, m (≤ 0 = overlapping). */
  gapM: number;
  speedMs: number;
  /** The car is moving into the player's lane. */
  cutIn: boolean;
}

export type ScenarioPhase =
  | 'approach'
  | 'cut-in'
  | 'follow'
  | 'resume'
  | 'signalled'
  | 'unsignalled'
  | 'burst'
  | 'clear'
  | 'done'
  | 'missed';

export const SCENARIO_NOTE: Record<ScenarioPhase, string> = {
  approach: 'Close on the slow lead',
  'cut-in': 'A slower car is cutting in',
  follow: 'Following the car that cut in',
  resume: 'It moved out — closing on the original lead',
  signalled: 'A courteous driver signals and merges ahead',
  unsignalled: 'A less courteous driver merges late without signalling',
  burst: 'A driver alongside makes a short acceleration burst',
  clear: 'The lead is leaving the lane',
  done: 'Lane clear — scenario complete (Reset replays it)',
  missed: 'Scenario missed',
};

/** Scripted cut-in test: lead and cut-in car speeds, km/h, and placements, m. */
export const SCENARIO = { leadKmh: 80, leadGapM: 220, cutInKmh: 65, cutInGapM: 36, cutInWindowM: [12, 30] as const };

export function rearOf(c: TrafficCar): number {
  return c.x - c.lengthM;
}

export function laneOf(lat: number): number {
  return clamp(Math.round(lat), 0, LANE_COUNT - 1);
}

/** Player speed expected when a lane change that starts now reaches the player's lane, m/s. */
export function anticipatedSpeed(player: { speed: number; accel: number }, aheadS = CUT_IN_CLAIM_S): number {
  return player.speed + Math.max(0, player.accel) * aheadS;
}

/** Gap the generic cut-in trigger allows ahead of the player. Less courteous drivers accept a shorter minimum. */
export function cutInWindow(playerSpeed: number, carSpeed: number, courteous = true): [number, number] {
  const closing = Math.max(0, playerSpeed - carSpeed);
  const min = courteous ? STANDSTILL_GAP_M + 0.6 * playerSpeed + 4 : STANDSTILL_GAP_M + 0.35 * playerSpeed + 2;
  const max = Math.max(STANDSTILL_GAP_M + 1.2 * playerSpeed + (closing * closing) / (2 * CUT_IN_DECEL) + 1.5 * closing, min + 10);
  return [min, max];
}

/** Distance ahead at which a slower car is placed so the closing speed can be shed comfortably. */
export function leadSpawnGap(playerSpeed: number, carSpeed: number): number {
  const closing = Math.max(0, playerSpeed - carSpeed);
  return STANDSTILL_GAP_M + 2 * carSpeed + (closing * closing) / (2 * SPAWN_DECEL) + 3 * closing + 80;
}

interface Neighbour {
  gap: number;
  speed: number;
  player: boolean;
}

interface Script {
  kind: TrafficScript;
  lane: number;
  side: -1 | 1;
  phaseAtS: number;
  actors: Record<string, number>;
  note: string | null;
}

export class TrafficSim {
  readonly cars: TrafficCar[] = [];
  readonly events: TrafficEvent[] = [];
  time = 0;
  /** Encounters generated so far. */
  encounters = 0;
  phase: ScenarioPhase | null = null;
  private mode: Exclude<TrafficMode, 'off'>;
  private road: RoadSettings;
  private seedValue: number;
  private rng: Rng;
  private nextId = 1;
  private drivingS = 0;
  private nextEncounterS = 0;
  private level: Level = 'sparse';
  private levelUntilS = Infinity;
  private truckShare = 0.1;
  private rudeShare = 0.12;
  private script: Script | null = null;
  private leadCache: LeadInfo | null = null;
  private player: PlayerState;

  constructor(mode: Exclude<TrafficMode, 'off'>, seed: number, player: PlayerState, road: RoadSettings) {
    this.mode = mode;
    this.road = { ...road };
    this.seedValue = normaliseSeed(seed);
    this.rng = new Rng(this.seedValue);
    this.player = { ...player };
    if (isScripted(mode)) this.startScript(mode, player);
    else this.startGenerated(mode, player);
    this.updateClaims(0);
  }

  get seed(): number {
    return this.seedValue;
  }

  get trafficMode(): Exclude<TrafficMode, 'off'> {
    return this.mode;
  }

  get currentLevel(): Level | null {
    return isGenerated(this.mode) ? this.level : null;
  }

  get roadSettings(): RoadSettings {
    return this.road;
  }

  get scenarioNote(): string | null {
    if (!this.phase) return null;
    return this.phase === 'missed' && this.script?.note ? `${SCENARIO_NOTE.missed}: ${this.script.note} — Reset to rerun` : SCENARIO_NOTE[this.phase];
  }

  /** The tracked lead: the nearest car in the player's path whose front is ahead of the player's front. */
  lead(): LeadInfo | null {
    return this.leadCache;
  }

  // ---------------------------------------------------------------------------
  // Settings that change during a drive (they are inputs: a replay needs them at the same steps).

  /** Switch to another generated density without removing or moving existing traffic. */
  setDensity(mode: TrafficDensity): void {
    if (this.mode === mode) return;
    const wasStuck = this.mode === 'stuck';
    if (this.script) this.releaseScript();
    this.mode = mode;
    this.log({ kind: 'setting', id: 0, note: `density ${mode}` });
    if (mode === 'auto') this.nextSegment(true);
    else this.setLevel(mode === 'stuck' ? 'jam' : mode);
    if (mode === 'stuck') this.spawnQueue(this.player, true);
    else if (wasStuck) this.releasePacers();
    // The new density is felt soon, from the traffic that is already there.
    this.nextEncounterS = this.drivingS + this.rng.range(...LEVELS[this.level].intervalS) * 0.5;
  }

  /** New road preset or limit: lane behaviour switches at once; each driver adjusts its speed after a short reaction. */
  setRoad(road: RoadSettings): void {
    this.road = { ...road };
    this.log({ kind: 'setting', id: 0, note: `road ${road.preset} ${road.limitKmh ?? 'none'}` });
    for (const c of this.cars) {
      if (c.fixedSpeed !== null || c.pacer) continue;
      c.v0Target = this.targetSpeed(c.kind, c.traits) * c.flow;
      c.reactAtS = this.time + c.traits.reactionS;
    }
  }

  /** Reseed future generation; traffic already on the road stays. */
  setSeed(seed: number): void {
    this.seedValue = normaliseSeed(seed);
    this.rng = new Rng(this.seedValue);
    this.log({ kind: 'setting', id: 0, note: `seed ${this.seedValue}` });
  }

  // ---------------------------------------------------------------------------

  step(dt: number, player: PlayerState): void {
    this.player = player;
    this.time += dt;
    if (player.speed > 1) this.drivingS += dt;
    if (this.script) this.stepScript(player);
    else {
      if (this.mode === 'auto' && this.time >= this.levelUntilS) this.nextSegment(false);
      this.stepEncounters(player);
    }
    this.sortCars();
    for (const c of this.cars) this.decide(c, player);
    this.stepLaneChanges(dt);
    this.stepLongitudinal(dt, player);
    this.updateClaims(dt);
    this.despawn(player);
  }

  // ---------------------------------------------------------------------------
  // Generation

  private startGenerated(mode: TrafficDensity, player: PlayerState): void {
    if (mode === 'auto') this.nextSegment(true);
    else this.setLevel(mode === 'stuck' ? 'jam' : mode);
    if (mode === 'stuck') {
      this.spawnQueue(player, true);
      this.nextEncounterS = this.rng.range(8, 15);
      return;
    }
    // Something in view from the start, then the first encounter after a few seconds of driving.
    const initial = this.level === 'very-sparse' ? 0 : this.level === 'sparse' ? 1 : this.level === 'mid' ? 2 : 4;
    for (let i = 0; i < initial; i++) {
      const lane = this.rng.pick([0, 1, 2].filter((l) => l !== laneOf(player.lat)));
      const kind = this.sampleKind();
      const traits = this.sampleTraits(kind);
      const x = player.x + this.rng.range(50, 110) + i * 45;
      if (!this.laneOccupied(lane, x - 20, x + 15)) this.spawn('adjacent', lane, x, this.targetSpeed(kind, traits) * LEVELS[this.level].flow, kind, traits);
    }
    this.nextEncounterS = this.rng.range(4, 8);
  }

  private setLevel(level: Level): void {
    this.level = level;
    this.levelUntilS = Infinity;
  }

  /** Auto: pick the next traffic pattern (seeded), hold it for a while, and change the flow rather than the cars. */
  private nextSegment(first: boolean): void {
    const prev = this.level;
    const next: Level = first
      ? this.rng.pick(['sparse', 'mid'] as const)
      : this.rng.pick(
          (
            {
              'very-sparse': ['sparse', 'sparse', 'mid'],
              sparse: ['very-sparse', 'mid', 'mid'],
              mid: ['sparse', 'heavy', 'very-sparse'],
              heavy: ['mid', 'jam', 'mid'],
              jam: ['heavy', 'mid'],
            } as const
          )[prev],
        );
    this.level = next;
    this.levelUntilS = this.time + (next === 'jam' ? this.rng.range(40, 75) : this.rng.range(50, 110));
    this.truckShare = this.rng.range(0.03, 0.22);
    this.rudeShare = this.rng.range(0.05, 0.2);
    this.log({ kind: 'level', id: 0, note: next });
    if (next === 'jam') this.spawnQueue(this.player, false);
    else if (prev === 'jam' && !first) this.releasePacers();
  }

  private sampleKind(): VehicleKind {
    const r = this.rng.next();
    return r < this.truckShare ? 'truck' : r < this.truckShare + 0.15 ? 'van' : 'car';
  }

  private sampleTraits(kind: VehicleKind, courteous?: boolean): DriverTraits {
    const r = this.rng;
    const polite = courteous ?? !(kind !== 'truck' && r.chance(this.road.preset === 'taiwan' ? this.rudeShare : this.rudeShare * 0.5));
    const slow = r.chance(0.2);
    const naturalRoll = r.next();
    const naturalKmh =
      kind === 'truck' ? r.range(80, 89) : kind === 'van' ? r.range(100, 140) : naturalRoll < 0.15 ? r.range(95, 115) : naturalRoll < 0.85 ? r.range(115, 165) : r.range(170, 230);
    const lazy = r.chance(0.08);
    return {
      courteous: polite,
      speedFactor: polite ? (slow ? r.range(0.72, 0.85) : r.range(0.85, 1.02)) : r.range(1.0, 1.1),
      naturalKmh,
      limitFactor: polite ? r.range(0.9, 1.03) : r.range(1.0, 1.12),
      accel: kind === 'truck' ? r.range(0.5, 0.8) : polite ? r.range(1.0, 1.7) : r.range(1.6, 2.2),
      decel: r.range(2.0, 3.0),
      timeGapS: polite ? r.range(1.2, 1.8) : r.range(0.7, 1.0),
      jamGapM: polite ? r.range(2.5, 4) : r.range(1.8, 2.5),
      signalS: polite ? r.range(0.9, 2.0) : r.chance(0.7) ? 0 : r.range(0.1, 0.4),
      changeS: polite ? r.range(2.6, 3.6) : r.range(1.8, 2.4),
      gapAcceptance: polite ? 1 : r.range(0.5, 0.65),
      keepRightDelayS: lazy ? r.range(10, 20) : r.range(2, 5),
      reactionS: r.range(0.5, 4),
    };
  }

  /** Target speed for this driver on the current road, m/s. */
  private targetSpeed(kind: VehicleKind, t: DriverTraits): number {
    const limit = this.road.limitKmh;
    let kmh: number;
    if (this.road.preset === 'taiwan') {
      const base = limit ?? 110;
      kmh = kind === 'truck' ? Math.min(90, base - 10) * clamp(t.speedFactor, 0.85, 1) : base * t.speedFactor;
    } else {
      kmh = t.naturalKmh;
      if (limit !== null) kmh = Math.min(kmh, limit * t.limitFactor);
    }
    return kmhToMs(Math.max(20, kmh));
  }

  private log(e: Omit<TrafficEvent, 't'>): void {
    this.events.push({ t: Math.round(this.time * 1000) / 1000, ...e });
    if (this.events.length > MAX_EVENTS) this.events.splice(0, this.events.length - MAX_EVENTS);
  }

  private spawn(
    role: CarRole,
    lane: number,
    x: number,
    speed: number,
    kind: VehicleKind,
    traits: DriverTraits,
    opts: { length?: number; shade?: number; cutOutAfterS?: number | null; cutOutSide?: -1 | 1; cutInPending?: boolean; cutInWindowM?: readonly [number, number]; scripted?: boolean; fixedSpeed?: number; flow?: number; desired?: number } = {},
  ): TrafficCar {
    const length = opts.length ?? (kind === 'truck' ? (this.road.preset === 'autobahn' ? 12 : 10) : kind === 'van' ? 5.2 : this.rng.range(4.3, 4.9));
    const flow = opts.flow ?? 1;
    const target = opts.fixedSpeed ?? opts.desired ?? speed;
    const car: TrafficCar = {
      id: this.nextId++,
      role,
      kind,
      lengthM: length,
      shade: opts.shade ?? Math.floor(this.rng.next() * 4),
      traits,
      x,
      speed,
      lane,
      lat: lane,
      change: null,
      v0: target,
      v0Target: target,
      reactAtS: 0,
      flow,
      burstUntilS: 0,
      inPlayerLane: Math.abs(lane - this.player.lat) <= CLAIM_LANES,
      followedS: 0,
      cutOutAfterS: opts.cutOutAfterS ?? null,
      cutOutSide: opts.cutOutSide ?? 1,
      cutInPending: opts.cutInPending ?? false,
      cutInWindowM: opts.cutInWindowM ?? null,
      retryAtS: 0,
      lastChangeS: -Infinity,
      lastChangeDir: 0,
      lastYieldS: -Infinity,
      laneSinceS: this.time,
      nextDecisionS: this.time + DECISION_S * ((this.nextId % 4) / 4),
      scripted: opts.scripted ?? false,
      fixedSpeed: opts.fixedSpeed ?? null,
      pacer: null,
      ageS: 0,
    };
    this.cars.push(car);
    this.log({ kind: 'spawn', id: car.id, role, lane, gapM: round1(rearOf(car) - this.player.x), speedKmh: round1(msToKmh(speed)), courteous: traits.courteous });
    return car;
  }

  private stepEncounters(player: PlayerState): void {
    if (this.drivingS < this.nextEncounterS) return;
    const spec = LEVELS[this.level];
    if (this.cars.length >= spec.maxCars) {
      this.nextEncounterS = this.drivingS + 3;
      return;
    }
    this.nextEncounterS = this.drivingS + this.rng.range(spec.intervalS[0], spec.intervalS[1]);
    this.encounters++;
    const roll = this.rng.next();
    const [mLead, mCut, mAdj] = spec.mix;
    const role: CarRole = roll < mLead ? 'lead' : roll < mLead + mCut ? 'cut-in' : roll < mLead + mCut + mAdj ? 'adjacent' : 'behind';
    const size = Math.round(this.rng.range(spec.group[0], spec.group[1] + 0.999) - 0.499);
    this.spawnGroup(role, Math.max(1, size), player, spec);
  }

  private spawnGroup(role: CarRole, size: number, player: PlayerState, spec: LevelSpec): void {
    const pl = laneOf(player.targetLane);
    const vP = anticipatedSpeed(player, 4);
    const sides = ([-1, 1] as const).filter((s) => pl + s >= 0 && pl + s < LANE_COUNT);
    const side = this.rng.pick(sides);
    const others = [0, 1, 2].filter((l) => l !== pl);
    for (let k = 0; k < size; k++) {
      const kind = this.sampleKind();
      const traits = this.sampleTraits(kind);
      let speed = this.targetSpeed(kind, traits) * spec.flow;
      let lane: number;
      let x: number;
      let cutIn = false;
      let cutOutAfterS: number | null = null;
      if (role === 'lead' && k === 0) {
        lane = this.road.preset === 'autobahn' && kind === 'truck' ? LANE_COUNT - 1 : pl;
        x = player.x + Math.min(DESPAWN_AHEAD_M - 200, Math.max(SPAWN_AHEAD_MIN_M, leadSpawnGap(vP, speed))) + 5;
        cutOutAfterS = lane === pl ? this.rng.range(5, 14) : null;
      } else if (role === 'cut-in' && k === 0) {
        lane = pl + side;
        cutIn = kind !== 'truck';
        cutOutAfterS = this.rng.range(5, 12);
        if (speed < vP - 1) {
          const [, max] = cutInWindow(vP, speed, traits.courteous);
          x = player.x + Math.max(SPAWN_AHEAD_MIN_M, max + 4 * (vP - speed) + 50);
        } else {
          // The player is slower: a somewhat faster car comes from behind (in Taiwan still within 10 % over the limit).
          const cap = this.road.preset === 'taiwan' ? kmhToMs((this.road.limitKmh ?? 110) * 1.1) : Infinity;
          speed = Math.max(speed, Math.min(vP + 3, speed * 1.25, cap));
          x = speed > vP + 1 ? player.x - SPAWN_BEHIND_M : player.x + SPAWN_AHEAD_MIN_M;
        }
      } else if (role === 'behind') {
        // Faster traffic from behind, only as fast as the road allows (Taiwan: within 10 % over the limit; trucks under 90).
        const maxKmh = kind === 'truck' ? 89 : this.road.preset === 'taiwan' ? (this.road.limitKmh ?? 110) * 1.1 : this.road.limitKmh === null ? 250 : this.road.limitKmh * 1.12;
        lane = this.road.preset === 'autobahn' && kind === 'truck' ? LANE_COUNT - 1 : this.rng.pick([0, 1, 2]);
        if (speed < vP + 3) speed = vP + this.rng.range(3, 8);
        if (msToKmh(speed) > maxKmh) continue;
        x = player.x - SPAWN_BEHIND_M - k * 35;
      } else {
        lane = k === 0 || size < 3 ? this.rng.pick(others) : this.rng.pick([0, 1, 2]);
        if (this.road.preset === 'autobahn' && kind === 'truck') lane = LANE_COUNT - 1;
        x = speed > vP + 2 ? player.x - SPAWN_BEHIND_M - k * 30 : player.x + SPAWN_AHEAD_MIN_M + 4 * Math.max(0, vP - speed) + k * this.rng.range(20, 45);
      }
      if (role !== 'behind' && k > 0 && x > player.x) x += k * this.rng.range(25, 50);
      const len = kind === 'truck' ? 12 : 5;
      let tries = 0;
      while (!this.spawnClear(lane, x, len, speed) && tries++ < 6) x += x > player.x ? 60 : -60;
      if (!this.spawnClear(lane, x, len, speed)) continue;
      this.spawn(role, lane, x, speed, kind, traits, { cutInPending: cutIn, cutOutAfterS, cutOutSide: (lane === pl ? side : -side) as -1 | 1, flow: spec.flow });
    }
  }

  /**
   * A queue in every lane: a pacer at its head alternates stops and crawls,
   * and the cars behind follow, so stop-and-go waves start and clear even
   * while the player is standing still.
   */
  private spawnQueue(player: PlayerState, near: boolean): void {
    const v = player.speed;
    const tail = near ? Math.max(30, (v * v) / (2 * 1.5) + 40) : Math.max(SPAWN_AHEAD_MIN_M + 200, leadSpawnGap(v, 2) + 100);
    for (let lane = 0; lane < LANE_COUNT; lane++) {
      const count = near ? 5 + Math.floor(this.rng.next() * 3) : 4 + Math.floor(this.rng.next() * 3);
      let x = player.x + tail + this.rng.range(0, 25) + count * 9;
      const kindHead = this.sampleKind();
      const head = this.spawn('pacer', lane, x, kmhToMs(this.rng.range(0, 10)), kindHead, this.sampleTraits(kindHead), { flow: 1 });
      head.pacer = { go: false, untilS: this.time + this.rng.range(2, 6), goMs: kmhToMs(this.rng.range(8, 25)), released: false };
      for (let i = 1; i < count; i++) {
        const kind = this.sampleKind();
        const traits = this.sampleTraits(kind);
        x -= (kind === 'truck' ? 12 : 4.8) + traits.jamGapM + this.rng.range(0, 3);
        if (this.laneOccupied(lane, x - 14, x + 2)) continue;
        this.spawn('queue', lane, x, head.speed, kind, traits, {
          cutOutAfterS: lane === laneOf(player.lat) ? this.rng.range(20, 40) : null,
          flow: LEVELS.jam.flow,
          desired: this.targetSpeed(kind, traits) * LEVELS.jam.flow,
        });
      }
    }
  }

  private releasePacers(): void {
    for (const c of this.cars) if (c.pacer) c.pacer.released = true;
  }

  // ---------------------------------------------------------------------------
  // Scripts

  private startScript(kind: TrafficScript, player: PlayerState): void {
    const lane = laneOf(player.targetLane);
    const side: -1 | 1 = lane + 1 < LANE_COUNT ? 1 : -1;
    this.script = { kind, lane, side, phaseAtS: 0, actors: {}, note: null };
    this.phase = 'approach';
    const traits = this.sampleTraits('car', true);
    const a = this.spawn('script', lane, player.x + SCENARIO.leadGapM + 4.6, kmhToMs(SCENARIO.leadKmh), 'car', traits, {
      length: 4.6,
      shade: 1,
      scripted: true,
      fixedSpeed: kmhToMs(SCENARIO.leadKmh),
    });
    this.script.actors.A = a.id;
    this.log({ kind: 'phase', id: 0, note: 'approach' });
  }

  private actor(name: string): TrafficCar | undefined {
    const id = this.script?.actors[name];
    return id === undefined ? undefined : this.cars.find((c) => c.id === id);
  }

  private setPhase(p: ScenarioPhase, note: string | null = null): void {
    this.phase = p;
    if (this.script) {
      this.script.phaseAtS = this.time;
      this.script.note = note;
    }
    this.log({ kind: 'phase', id: 0, note: note ? `${p}: ${note}` : p });
  }

  /** Scripted actors become ordinary traffic (missed scenario, or another traffic mode chosen). */
  private releaseScript(): void {
    for (const c of this.cars) {
      if (!c.scripted) continue;
      c.scripted = false;
      c.cutInPending = false;
      c.cutOutAfterS = null;
    }
    this.script = null;
  }

  private miss(note: string): void {
    this.setPhase('missed', note);
    for (const c of this.cars) {
      if (!c.scripted) continue;
      c.scripted = false;
      c.cutInPending = false;
      c.cutOutAfterS = null;
    }
  }

  private stepScript(player: PlayerState): void {
    const s = this.script!;
    if (this.phase === 'done' || this.phase === 'missed') return;
    const inPhaseS = this.time - s.phaseAtS;
    const a = this.actor('A');
    // Terminal outcomes instead of waiting forever.
    if (Math.abs(player.lat - s.lane) > RELEASE_LANES && this.phase !== 'clear') return this.miss('you left the test lane');
    if (this.phase !== 'clear' && (!a || a.x < player.x)) return this.miss('the lead was passed or left the road');
    if (inPhaseS > (this.phase === 'approach' ? 150 : 60)) return this.miss('timed out');
    if (s.kind === 'cut-in') this.stepCutInScript(s, a, player);
    else this.stepDriverScript(s, a, player);
  }

  private stepCutInScript(s: Script, a: TrafficCar | undefined, player: PlayerState): void {
    const b = this.actor('B');
    switch (this.phase) {
      case 'approach':
        if (a && a.followedS >= 2.5 && Math.abs(player.speed - a.speed) < 1.5) {
          // A slower car in the adjacent lane, just ahead, that the player closes on and that cuts in.
          const x = player.x + SCENARIO.cutInGapM + 4.6;
          const car = this.spawn('script', s.lane + s.side, x, kmhToMs(SCENARIO.cutInKmh), 'car', this.sampleTraits('car', true), {
            length: 4.6,
            shade: 2,
            cutInPending: true,
            cutInWindowM: SCENARIO.cutInWindowM,
            scripted: true,
            fixedSpeed: kmhToMs(SCENARIO.cutInKmh),
          });
          s.actors.B = car.id;
          this.setPhase('cut-in');
        }
        break;
      case 'cut-in':
        if (!b || b.x < player.x) return this.miss('the cut-in car was passed');
        if (b.lane === s.lane && b.change === null) {
          b.cutOutAfterS = 6;
          b.cutOutSide = (-s.side as -1 | 1);
          b.followedS = 0;
          this.setPhase('follow');
        }
        break;
      case 'follow':
        if (!b || (b.change !== null && b.change.to !== s.lane)) {
          if (a) {
            a.followedS = 0;
            a.cutOutAfterS = 4;
            a.cutOutSide = s.side;
          }
          this.setPhase('resume');
        }
        break;
      case 'resume':
        if (!a || (a.change !== null && a.change.to !== s.lane)) this.setPhase('clear');
        break;
      case 'clear':
        if (!a || !a.inPlayerLane) this.setPhase('done');
        break;
      default:
        break;
    }
  }

  /**
   * Driver test (Taiwan driver variation): a courteous signalled merge, a
   * late unsignalled merge from behind with a tight gap, and a short
   * acceleration burst alongside, each with room for a playable response.
   */
  private stepDriverScript(s: Script, a: TrafficCar | undefined, player: PlayerState): void {
    const adj = s.lane + s.side;
    // The opposite neighbour lane where there is one, so actors do not meet each other.
    const other = s.lane - s.side >= 0 && s.lane - s.side < LANE_COUNT ? s.lane - s.side : adj;
    switch (this.phase) {
      case 'approach':
        if (a && a.followedS >= 2.5 && Math.abs(player.speed - a.speed) < 1.5) {
          const t = { ...this.sampleTraits('car', true), signalS: 1.5, changeS: 3 };
          const c = this.spawn('script', adj, player.x + 40 + 4.6, kmhToMs(70), 'car', t, { length: 4.6, shade: 2, cutInPending: true, cutInWindowM: [20, 34], scripted: true, fixedSpeed: kmhToMs(70) });
          s.actors.C1 = c.id;
          this.setPhase('signalled');
        }
        break;
      case 'signalled': {
        const c = this.actor('C1');
        if (!c || c.x < player.x) return this.miss('the merging car was passed');
        if (c.lane === s.lane && c.change === null && c.cutOutAfterS === null) {
          c.cutOutAfterS = 4;
          c.cutOutSide = (other - s.lane || s.side) as -1 | 1;
          c.followedS = 0;
        }
        if (c.change && c.change.from === s.lane && c.change.to !== s.lane) {
          // Back out of the lane: next, a faster car from behind that will merge late.
          const t: DriverTraits = { ...this.sampleTraits('car', false), signalS: 0, changeS: 2, gapAcceptance: 0.5 };
          const fast = kmhToMs(SCENARIO.leadKmh + 22);
          const d = this.spawn('script', adj, player.x - 45, fast, 'car', t, { length: 4.6, shade: 3, cutInPending: true, cutInWindowM: [10, 16], scripted: true, fixedSpeed: fast });
          s.actors.C2 = d.id;
          this.setPhase('unsignalled');
        }
        break;
      }
      case 'unsignalled': {
        const d = this.actor('C2');
        if (!d) return this.miss('the merging car left');
        if (d.lane === s.lane && d.change === null && d.fixedSpeed !== null && d.fixedSpeed > kmhToMs(SCENARIO.leadKmh)) {
          // Merged: settle just under the lead's speed, then leave after a while.
          d.fixedSpeed = kmhToMs(SCENARIO.leadKmh - 4);
          d.v0 = d.v0Target = d.fixedSpeed;
          d.cutOutAfterS = 4;
          d.cutOutSide = (other - s.lane || s.side) as -1 | 1;
          d.followedS = 0;
        }
        if (d.change && d.change.from === s.lane && d.change.to !== s.lane) {
          const t = { ...this.sampleTraits('car', false), signalS: 0 };
          const cruise = kmhToMs(SCENARIO.leadKmh);
          const e = this.spawn('script', adj, player.x + 8, Math.max(player.speed, cruise * 0.8), 'car', t, { length: 4.6, shade: 0, scripted: true, fixedSpeed: cruise });
          s.actors.C3 = e.id;
          this.setPhase('burst');
        }
        break;
      }
      case 'burst': {
        const e = this.actor('C3');
        const t = this.time - s.phaseAtS;
        if (e && t >= 2 && e.burstUntilS === 0) {
          e.burstUntilS = this.time + 3;
          this.log({ kind: 'burst', id: e.id, speedKmh: round1(msToKmh(e.speed)) });
        }
        if (t >= 9) {
          if (a) {
            a.followedS = 0;
            a.cutOutAfterS = 3;
            a.cutOutSide = s.side;
          }
          this.setPhase('clear');
        }
        break;
      }
      case 'clear':
        if (!a || !a.inPlayerLane) this.setPhase('done');
        break;
      default:
        break;
    }
  }

  // ---------------------------------------------------------------------------
  // Lane decisions

  /** Nearest vehicle ahead (or behind) in a lane, from a car's position; includes the player. */
  private neighbour(c: TrafficCar, lane: number, ahead: boolean): Neighbour | null {
    let best: Neighbour | null = null;
    const p = this.player;
    const occupies = (lat: number, target: number | null) => Math.abs(lat - lane) < RELEASE_LANES || target === lane;
    for (const o of this.cars) {
      if (o === c || !occupies(o.lat, o.change ? o.change.to : null)) continue;
      const gap = ahead ? rearOf(o) - c.x : rearOf(c) - o.x;
      if ((ahead ? o.x > c.x : o.x <= c.x) && (!best || gap < best.gap)) best = { gap, speed: o.speed, player: false };
    }
    if (occupies(p.lat, p.targetLane)) {
      const gap = ahead ? p.x - PLAYER_LENGTH_M - c.x : rearOf(c) - p.x;
      if ((ahead ? p.x > c.x : p.x <= c.x) && (!best || gap < best.gap)) best = { gap, speed: p.speed, player: true };
    }
    return best;
  }

  /** Room in lane `to` beside, ahead and behind for this driver's accepted gaps (the player counts as a vehicle). */
  private laneChangeSafe(c: TrafficCar, to: number, scriptedMerge = false): boolean {
    if (to < 0 || to >= LANE_COUNT) return false;
    const k = c.traits.gapAcceptance;
    const margin = 2 + 4 * k;
    const p = this.player;
    const playerIn = Math.abs(p.lat - to) < RELEASE_LANES || p.targetLane === to;
    if (playerIn && p.x - PLAYER_LENGTH_M < c.x + margin && p.x > rearOf(c) - margin) return false;
    if (this.laneOccupied(to, rearOf(c) - margin, c.x + margin, c)) return false;
    const ahead = this.neighbour(c, to, true);
    if (ahead) {
      const closing = Math.max(0, c.speed - ahead.speed);
      if (ahead.gap < (STANDSTILL_GAP_M + 0.5 * c.speed + (closing * closing) / (2 * CUT_IN_DECEL)) * k) return false;
    }
    const behind = this.neighbour(c, to, false);
    if (behind) {
      const closing = Math.max(0, behind.speed - c.speed);
      // A scripted merge in front of the player is judged only by the deceleration it leaves the player.
      if (!(scriptedMerge && behind.player) && behind.gap < (STANDSTILL_GAP_M + 0.5 * behind.speed + (closing * closing) / (2 * CUT_IN_DECEL)) * k) return false;
      if (behind.player && this.mergeUnsafeForPlayer(c, behind.gap)) return false;
    }
    return true;
  }

  /**
   * Whether moving in ahead of the player would leave it more than a firm brake (a hard one for less
   * courteous drivers) once the car is in its path: the gap then, after the time still needed to get
   * there (the whole signal and ~43 % of the move before starting, less once under way).
   */
  private mergeUnsafeForPlayer(c: TrafficCar, gap: number): boolean {
    const ch = c.change;
    const toClaim = c.traits.signalS + 0.43 * c.traits.changeS;
    const remainingS = ch ? Math.max(0, ch.signalS + 0.43 * ch.durationS - ch.elapsedS) : toClaim;
    const closing = anticipatedSpeed(this.player, remainingS) - c.speed;
    if (gap < STANDSTILL_GAP_M + 2) return true;
    if (closing <= 0) return false;
    const limit = c.traits.courteous ? 2.5 : 3.5;
    return (closing * closing) / (2 * Math.max(gap - closing * remainingS - STANDSTILL_GAP_M, 0.5)) > limit;
  }

  /** Room to place a vehicle in a lane: gaps to the vehicles ahead and behind (the player included) that their speeds can absorb. */
  private spawnClear(lane: number, x: number, length: number, speed: number): boolean {
    const need = (follower: number, leader: number) => STANDSTILL_GAP_M + follower + (Math.max(0, follower - leader) ** 2) / (2 * 3);
    // Ahead of the new vehicle: its gap to that rear bumper; behind it: that vehicle's gap to the new rear bumper.
    const check = (front: number, rear: number, v: number) => (front > x ? rear - x >= need(speed, v) : x - length - front >= need(v, speed));
    for (const c of this.cars) {
      const inLane = Math.abs(c.lat - lane) < RELEASE_LANES || (c.change !== null && c.change.to === lane);
      if (inLane && !check(c.x, rearOf(c), c.speed)) return false;
    }
    const p = this.player;
    if ((Math.abs(p.lat - lane) < RELEASE_LANES || p.targetLane === lane) && !check(p.x, p.x - PLAYER_LENGTH_M, p.speed)) return false;
    return true;
  }

  /** Whether any car occupies `lane` between the given positions (rear, front), m. */
  private laneOccupied(lane: number, rear: number, front: number, except?: TrafficCar): boolean {
    return this.cars.some((c) => {
      if (c === except) return false;
      const occupies = Math.abs(c.lat - lane) < RELEASE_LANES || (c.change !== null && c.change.to === lane);
      return occupies && rearOf(c) < front && c.x > rear;
    });
  }

  private startChange(c: TrafficCar, to: number, reason: LaneChange['reason'], note?: string): void {
    const t = c.traits;
    c.change = { from: c.lane, to, latStart: c.lat, elapsedS: 0, signalS: t.signalS, durationS: t.changeS, reason };
    c.lastChangeS = this.time;
    c.lastChangeDir = to > c.lane ? 1 : -1;
    this.log({ kind: 'signal', id: c.id, role: c.role, lane: c.lane, to, gapM: round1(rearOf(c) - this.player.x), speedKmh: round1(msToKmh(c.speed)), signalS: round1(t.signalS), reason, courteous: t.courteous, note });
  }

  /** Steer back from where the car is, along the same kind of curve; it may try again later. */
  private abortChange(c: TrafficCar): void {
    const back = c.change!.from;
    const wasCutIn = c.change!.reason === 'cut-in';
    c.change = { from: back, to: back, latStart: c.lat, elapsedS: 0, signalS: 0, durationS: Math.max(0.8, c.traits.changeS * Math.abs(c.lat - back)), reason: 'abort' };
    if (wasCutIn) c.cutInPending = true;
    c.retryAtS = c.ageS + 4;
    c.lastChangeS = this.time;
    this.log({ kind: 'abort', id: c.id, role: c.role, lane: back, gapM: round1(rearOf(c) - this.player.x), speedKmh: round1(msToKmh(c.speed)) });
  }

  private decide(c: TrafficCar, player: PlayerState): void {
    // Any move into the player's path that is still short of it is abandoned if it has become unsafe
    // (the player may have sped up since it started).
    if (c.change) {
      const ch = c.change;
      if (ch.reason !== 'abort' && ch.to !== ch.from && !c.inPlayerLane && c.x > player.x && Math.abs(ch.to - player.lat) < RELEASE_LANES && this.mergeUnsafeForPlayer(c, rearOf(c) - player.x)) {
        this.abortChange(c);
      }
      return;
    }
    if (this.time < c.nextDecisionS || c.pacer) return;
    c.nextDecisionS = this.time + DECISION_S;
    const pl = laneOf(player.targetLane);
    // Scripted and generated cut-ins into the player's lane.
    if (c.cutInPending) {
      if (c.lane === pl || (!c.scripted && c.ageS > 60)) {
        c.cutInPending = false;
      } else if (Math.abs(c.lane - pl) === 1 && c.ageS >= c.retryAtS && Math.abs(player.lat - pl) < 0.05) {
        const gap = rearOf(c) - player.x;
        const [min, max] = c.cutInWindowM ?? cutInWindow(anticipatedSpeed(player), c.speed, c.traits.courteous);
        if (gap >= min && gap <= max && !this.mergeUnsafeForPlayer(c, gap) && this.laneChangeSafe(c, pl, c.scripted)) {
          this.startChange(c, pl, 'cut-in');
          c.cutInPending = false;
          return;
        }
      }
    }
    // Leave the player's lane after being followed for a while.
    if (c.inPlayerLane && c.cutOutAfterS !== null && c.followedS >= c.cutOutAfterS) {
      for (const to of [c.lane + c.cutOutSide, c.lane - c.cutOutSide]) {
        if (this.laneChangeSafe(c, to)) {
          this.startChange(c, to, 'cut-out');
          c.cutOutAfterS = null;
          return;
        }
      }
    }
    if (c.scripted) return;
    if (this.road.preset === 'autobahn') this.decideAutobahn(c);
    else this.decideTaiwan(c);
  }

  /** Keep right, pass on the left, and make way for faster traffic (NPCs or the player). */
  private decideAutobahn(c: TrafficCar): void {
    const sinceChange = this.time - c.lastChangeS;
    if (sinceChange < 3) return;
    const right = c.lane + 1;
    const left = c.lane - 1;
    const ahead = this.neighbour(c, c.lane, true);
    const behind = this.neighbour(c, c.lane, false);
    // Making way for faster traffic only needs room to the right; returning right by habit needs a clear
    // stretch there, so the car does not soon have to pull out again.
    const rightOk = (strict: boolean) => {
      if (right >= LANE_COUNT) return false;
      const r = this.neighbour(c, right, true);
      return strict ? !r || r.gap > Math.max(100, 8 * c.speed) || r.speed >= c.v0 + 0.5 : !r || r.gap > Math.max(60, 5 * c.speed) || r.speed >= c.speed - 1;
    };
    // Mid-overtake (a slower car close ahead to the right) it finishes the pass first, then returns right.
    const r = right < LANE_COUNT ? this.neighbour(c, right, true) : null;
    const passing = !!r && r.speed < c.speed - 1 && r.gap < 4 * c.speed + 20;
    if (right < LANE_COUNT && !passing && behind && behind.speed > c.speed + 2 && behind.gap < 3.5 * behind.speed + 10 && rightOk(false) && this.laneChangeSafe(c, right)) {
      this.startChange(c, right, 'yield', behind.player ? 'for the player' : undefined);
      c.lastYieldS = this.time;
      return;
    }
    const blocked = ahead && ahead.speed < c.v0 - 2.2 && ahead.gap < 4 * c.speed + 20;
    // Pull out again only after settling: longer after just moving right, longest after making way.
    if (blocked && left >= 0 && sinceChange > (c.lastChangeDir > 0 ? 10 : 6) && this.time - c.lastYieldS > 20) {
      const l = this.neighbour(c, left, true);
      const better = !l || (l.speed > ahead.speed + 2 && l.gap > 2 * c.speed);
      if (better && this.laneChangeSafe(c, left)) {
        this.startChange(c, left, 'pass');
        return;
      }
    }
    if (right < LANE_COUNT && this.time - c.laneSinceS >= c.traits.keepRightDelayS && rightOk(true) && this.laneChangeSafe(c, right)) {
      this.startChange(c, right, 'keep-right');
      return;
    }
    this.maybeBurst(c, !!blocked);
  }

  /** Overtake when held up (left preferred); less courteous drivers change sooner, on either side. */
  private decideTaiwan(c: TrafficCar): void {
    const sinceChange = this.time - c.lastChangeS;
    const t = c.traits;
    const ahead = this.neighbour(c, c.lane, true);
    const blocked = !!ahead && ahead.speed < c.v0 - (t.courteous ? 2.8 : 1.5) && ahead.gap < 3.5 * c.speed + 15;
    if (blocked && sinceChange > (t.courteous ? 8 : 4)) {
      const options = t.courteous ? [c.lane - 1, c.lane + 1] : this.rng.chance(0.5) ? [c.lane - 1, c.lane + 1] : [c.lane + 1, c.lane - 1];
      for (const to of options) {
        if (to < 0 || to >= LANE_COUNT) continue;
        const o = this.neighbour(c, to, true);
        const better = !o || (o.speed > ahead!.speed + (t.courteous ? 3 : 1.5) && o.gap > (t.courteous ? 2 : 1) * c.speed);
        if (better && this.laneChangeSafe(c, to)) {
          this.startChange(c, to, 'pass');
          return;
        }
      }
    }
    this.maybeBurst(c, blocked);
  }

  /** Less courteous drivers sometimes make a short burst: right after a lane change or when the way opens. */
  private maybeBurst(c: TrafficCar, blocked: boolean): void {
    if (c.traits.courteous || c.burstUntilS > this.time || c.kind === 'truck') return;
    const recentChange = this.time - c.lastChangeS < 4;
    if (!this.rng.chance(recentChange ? 0.12 : blocked ? 0.01 : 0.004)) return;
    c.burstUntilS = this.time + this.rng.range(2.5, 4);
    this.log({ kind: 'burst', id: c.id, speedKmh: round1(msToKmh(c.speed)) });
  }

  // ---------------------------------------------------------------------------
  // Motion

  private stepLaneChanges(dt: number): void {
    for (const c of this.cars) {
      c.ageS += dt;
      const ch = c.change;
      if (!ch) continue;
      ch.elapsedS += dt;
      const p = clamp((ch.elapsedS - ch.signalS) / ch.durationS, 0, 1);
      c.lat = ch.latStart + (ch.to - ch.latStart) * smoothstep(p);
      if (p >= 1) {
        if (c.lane !== ch.to) c.laneSinceS = this.time;
        c.lane = ch.to;
        c.lat = ch.to;
        c.change = null;
      }
    }
  }

  /** Keep the list ordered by position (insertion sort: nearly sorted already), so each car finds its leader nearby. */
  private sortCars(): void {
    const a = this.cars;
    for (let i = 1; i < a.length; i++) {
      const c = a[i];
      let j = i - 1;
      while (j >= 0 && (a[j].x > c.x || (a[j].x === c.x && a[j].id > c.id))) {
        a[j + 1] = a[j];
        j--;
      }
      a[j + 1] = c;
    }
  }

  /** IDM with per-driver parameters; the player is a vehicle ahead for traffic behind it in its path. */
  private stepLongitudinal(dt: number, player: PlayerState): void {
    const cars = this.cars;
    const n = cars.length;
    const accel = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const c = cars[i];
      if (this.time >= c.reactAtS && c.v0 !== c.v0Target) {
        const d = c.v0Target - c.v0;
        c.v0 += clamp(d, -1.5 * dt, 1.5 * dt);
      }
      if (c.fixedSpeed !== null) c.v0 = c.fixedSpeed;
      let gap = Infinity;
      let leadSpeed = c.speed;
      // Cars are sorted by front position, so the first lateral match ahead is the leader (check a few more for long vehicles).
      for (let j = i + 1; j < n; j++) {
        const o = cars[j];
        if (o.x - 14 > c.x + gap) break;
        if (Math.abs(o.lat - c.lat) >= 0.8) continue;
        const g = rearOf(o) - c.x;
        if (g < gap) {
          gap = g;
          leadSpeed = o.speed;
        }
      }
      if (Math.abs(c.lat - player.lat) < 0.8 && player.x > c.x) {
        const g = player.x - PLAYER_LENGTH_M - c.x;
        if (g < gap) {
          gap = g;
          leadSpeed = player.speed;
        }
      }
      const t = c.traits;
      const bursting = c.burstUntilS > this.time;
      const aMax = bursting ? 2.4 : t.accel;
      const v = c.speed;
      let free: number;
      if (c.pacer && !c.pacer.released) {
        if (this.time >= c.pacer.untilS) {
          c.pacer.go = !c.pacer.go;
          c.pacer.untilS = this.time + (c.pacer.go ? this.rng.range(4, 9) : this.rng.range(3, 8));
          c.pacer.goMs = kmhToMs(this.rng.range(8, 25));
        }
        free = c.pacer.go ? aMax * (1 - (v / c.pacer.goMs) ** 4) : -Math.min(2, 2 * v);
      } else {
        const v0 = c.v0 + (bursting ? kmhToMs(20) : 0);
        free = Math.max(aMax * (1 - (v / Math.max(v0, 1)) ** 4), -1.2);
      }
      let a = free;
      if (gap < Infinity) {
        const sStar = t.jamGapM + Math.max(0, v * t.timeGapS + (v * (v - leadSpeed)) / (2 * Math.sqrt(aMax * t.decel)));
        a -= aMax * (sStar / Math.max(gap, 0.3)) ** 2;
      }
      accel[i] = clamp(a, -9, aMax);
    }
    for (let i = 0; i < n; i++) {
      const c = cars[i];
      c.speed = Math.max(0, c.speed + accel[i] * dt);
      c.x += c.speed * dt;
    }
  }

  private updateClaims(dt: number): void {
    const p = this.player;
    let lead: TrafficCar | null = null;
    for (const c of this.cars) {
      const off = Math.abs(c.lat - p.lat);
      if (c.inPlayerLane && off > RELEASE_LANES) c.inPlayerLane = false;
      else if (!c.inPlayerLane && off <= CLAIM_LANES) c.inPlayerLane = true;
      if (c.inPlayerLane && c.x > p.x && (!lead || rearOf(c) < rearOf(lead))) lead = c;
    }
    if (!lead) {
      this.leadCache = null;
      return;
    }
    const gap = rearOf(lead) - p.x;
    // Following closely: near the lead's speed and within about three seconds.
    if (gap <= STANDSTILL_GAP_M + 3 * p.speed + 10 && Math.abs(p.speed - lead.speed) < 3) lead.followedS += dt;
    this.leadCache = {
      id: lead.id,
      gapM: gap,
      speedMs: lead.speed,
      cutIn: lead.change !== null && Math.abs(lead.change.to - p.lat) < RELEASE_LANES && lead.change.to !== lead.change.from,
    };
  }

  private despawn(player: PlayerState): void {
    for (let i = this.cars.length - 1; i >= 0; i--) {
      const c = this.cars[i];
      if (c.x < player.x - DESPAWN_BEHIND_M || c.x > player.x + DESPAWN_AHEAD_M) {
        this.cars.splice(i, 1);
        this.log({ kind: 'despawn', id: c.id, role: c.role });
      }
    }
  }
}

function round1(v: number): number {
  return Math.round(v * 10) / 10;
}

export { isGenerated, isScripted };
export type { TrafficMode, TrafficDensity, TrafficScript };
