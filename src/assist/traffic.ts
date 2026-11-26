import { clamp, kmhToMs, msToKmh, smoothstep } from '../physics/units';
import { Rng, normaliseSeed } from './rng';

/**
 * Light, seeded traffic for Live Drive (and later the Highway view).
 *
 * One straight road with three lanes: 0 = left, 1 = the player's lane,
 * 2 = right. Positions run along the same axis as the player's distance
 * (front bumpers, metres). Traffic advances on simulation time only: the same
 * seed, starting state and player trajectory always give the same cars, lane
 * changes and lead, whatever the display frame rate.
 *
 * Cars follow each other with the Intelligent Driver Model and never react
 * to the player except as a car ahead in their own lane. Lane changes signal
 * first and then move over a fixed time; a car counts as being in the
 * player's lane once it is 40 % of the way across (and stops counting when it
 * is 75 % of a lane away), which is when it starts or stops affecting Auto Drive.
 */

export type TrafficMode = 'off' | 'sparse' | 'cut-in';
export type ActiveTrafficMode = Exclude<TrafficMode, 'off'>;

export const LANE_COUNT = 3;
export const PLAYER_LANE = 1;
export const PLAYER_LENGTH_M = 4.7;
/** Generated cruise speeds, km/h. */
export const TRAFFIC_SPEED_KMH: readonly [number, number] = [75, 125];
/** Driving time between sparse encounters, s. */
export const ENCOUNTER_INTERVAL_S: readonly [number, number] = [12, 25];
/** A car within this many lanes of the player-lane centre starts to count as in the lane… */
export const CLAIM_LANES = 0.6;
/** …and stops counting beyond this many. */
export const RELEASE_LANES = 0.75;
export const SIGNAL_S = 1.2;
export const LANE_CHANGE_S = 3;

/** Spawn planning: comfortable deceleration assumed when placing a slower car ahead, m/s². */
const SPAWN_DECEL = 1.0;
/** Cut-in planning: deceleration the cut-in should leave the player at most, m/s². */
const CUT_IN_DECEL = 1.8;
/** A cut-in still short of the player's lane is abandoned if the player would need more than this to keep the standstill gap, m/s². */
const CUT_IN_ABORT_DECEL = 2.5;
/** Time from a cut-in's signal to the car counting as in the player's lane, s (signal + ~43 % of the move). */
const CUT_IN_CLAIM_S = 2.5;
const STANDSTILL_GAP_M = 5;
const MAX_CARS = 8;
const MAX_EVENTS = 400;
/** Intelligent Driver Model for traffic (desired accel, comfortable decel, time gap, jam gap). */
const IDM = { a: 1.4, b: 2.5, T: 1.3, s0: 4 } as const;

export type CarRole = 'lead' | 'cut-in' | 'adjacent' | 'scenario-lead' | 'scenario-cut-in';

interface LaneChange {
  from: number;
  to: number;
  /** Lateral position when the move started (differs from `from` after an aborted cut-in). */
  latStart: number;
  elapsedS: number;
  /** Signal time before moving, s. */
  signalS: number;
  /** Time to move across, s. */
  durationS: number;
}

export interface TrafficCar {
  readonly id: number;
  readonly role: CarRole;
  readonly lengthM: number;
  readonly cruiseMs: number;
  /** Visual variant, 0–3. */
  readonly shade: number;
  /** Front bumper, m along the road. */
  x: number;
  speed: number;
  /** Lane the car is in, or is leaving during a change. */
  lane: number;
  /** Lateral position in lanes (0 = left lane centre, 2 = right lane centre). */
  lat: number;
  change: LaneChange | null;
  /** Counted as in the player's lane (with hysteresis). */
  inPlayerLane: boolean;
  /** Seconds the player has spent following this car closely. */
  followedS: number;
  /** Leave the player's lane after being followed this long, s; null = stay. */
  cutOutAfterS: number | null;
  cutOutSide: -1 | 1;
  /** Waiting to cut into the player's lane. */
  cutInPending: boolean;
  /** Fixed cut-in trigger window (gap to the player, m) for scripted cars; null = derived from speeds. */
  cutInWindowM: readonly [number, number] | null;
  /** No new cut-in attempt before this age, s (after an aborted one). */
  retryAtS: number;
  ageS: number;
}

export interface TrafficEvent {
  /** Traffic time, s. */
  t: number;
  kind: 'spawn' | 'signal' | 'abort' | 'despawn' | 'phase';
  id: number;
  role?: CarRole;
  lane?: number;
  to?: number;
  /** Bumper-to-bumper gap ahead of the player (negative = behind), m. */
  gapM?: number;
  speedKmh?: number;
  note?: string;
}

export interface PlayerState {
  /** Front bumper, m along the road. */
  x: number;
  speed: number;
  /** Current (filtered) acceleration, m/s²; traffic uses it to anticipate the player's speed. */
  accel: number;
}

export interface LeadInfo {
  id: number;
  /** Bumper-to-bumper gap, m (≤ 0 = overlapping). */
  gapM: number;
  speedMs: number;
  /** The car is moving into the player's lane. */
  cutIn: boolean;
}

export type ScenarioPhase = 'approach' | 'cut-in' | 'follow' | 'resume' | 'clear' | 'done';

export const SCENARIO_NOTE: Record<ScenarioPhase, string> = {
  approach: 'Close on the slow lead',
  'cut-in': 'A slower car is cutting in',
  follow: 'Following the car that cut in',
  resume: 'It moved out — closing on the original lead',
  clear: 'The lead is leaving the lane',
  done: 'Lane clear — scenario complete (Reset replays it)',
};

/** Scripted cut-in test: lead and cut-in car speeds, km/h. */
export const SCENARIO = { leadKmh: 80, leadGapM: 220, cutInKmh: 65, cutInGapM: 36, cutInWindowM: [12, 30] as const };

export function rearOf(c: TrafficCar): number {
  return c.x - c.lengthM;
}

/** Player speed expected when a lane change that starts now reaches the player's lane, m/s. */
export function anticipatedSpeed(player: PlayerState, aheadS = CUT_IN_CLAIM_S): number {
  return player.speed + Math.max(0, player.accel) * aheadS;
}

/** Gap the generic cut-in trigger allows ahead of the player: from just past a minimum up to a gap that leaves room for the closing speed. */
export function cutInWindow(playerSpeed: number, carSpeed: number): [number, number] {
  const closing = Math.max(0, playerSpeed - carSpeed);
  const min = STANDSTILL_GAP_M + 0.6 * playerSpeed + 4;
  const max = Math.max(STANDSTILL_GAP_M + 1.2 * playerSpeed + (closing * closing) / (2 * CUT_IN_DECEL) + 1.5 * closing, min + 10);
  return [min, max];
}

/** Distance ahead at which a slower car is placed in the player's lane so the closing speed can be shed comfortably. */
export function leadSpawnGap(playerSpeed: number, carSpeed: number): number {
  const closing = Math.max(0, playerSpeed - carSpeed);
  return STANDSTILL_GAP_M + 2 * carSpeed + (closing * closing) / (2 * SPAWN_DECEL) + 3 * closing + 80;
}

export class TrafficSim {
  readonly mode: ActiveTrafficMode;
  readonly seed: number;
  readonly cars: TrafficCar[] = [];
  readonly events: TrafficEvent[] = [];
  time = 0;
  /** Encounters generated so far (sparse mode). */
  encounters = 0;
  phase: ScenarioPhase | null;
  private readonly rng: Rng;
  private nextId = 1;
  private drivingS = 0;
  private nextEncounterS: number;
  private leadCache: LeadInfo | null = null;
  private player: PlayerState;

  constructor(mode: ActiveTrafficMode, seed: number, player: PlayerState) {
    this.mode = mode;
    this.seed = normaliseSeed(seed);
    this.rng = new Rng(this.seed);
    this.player = { ...player };
    this.nextEncounterS = 0;
    if (mode === 'cut-in') {
      this.phase = 'approach';
      const v = kmhToMs(SCENARIO.leadKmh);
      this.spawn('scenario-lead', PLAYER_LANE, player.x + SCENARIO.leadGapM + 4.6, v, { length: 4.6, shade: 1 });
      this.log({ kind: 'phase', id: 0, note: 'approach' });
    } else {
      this.phase = null;
      // One car in view from the start, then the first encounter after a few seconds of driving.
      const lane = this.rng.pick([0, 2]);
      this.spawn('adjacent', lane, player.x + this.rng.range(60, 90), this.randomSpeed());
      this.nextEncounterS = this.rng.range(4, 8);
    }
    this.updateClaims(0);
  }

  /** The tracked lead in the player's lane: the nearest car counted in the lane whose front is ahead of the player. */
  lead(): LeadInfo | null {
    return this.leadCache;
  }

  step(dt: number, player: PlayerState): void {
    this.player = player;
    this.time += dt;
    if (player.speed > 1) this.drivingS += dt;

    if (this.mode === 'sparse') this.stepEncounters(player);
    else this.stepScenario(player);
    this.stepLaneDecisions(player);
    this.stepLaneChanges(dt);
    this.stepLongitudinal(dt, player);
    this.updateClaims(dt);
    this.despawn(player);
  }

  // ---------------------------------------------------------------------------

  private randomSpeed(): number {
    return kmhToMs(this.rng.range(TRAFFIC_SPEED_KMH[0], TRAFFIC_SPEED_KMH[1]));
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
    opts: { length?: number; shade?: number; cutOutAfterS?: number | null; cutOutSide?: -1 | 1; cutInPending?: boolean; cutInWindowM?: readonly [number, number] } = {},
  ): TrafficCar {
    const car: TrafficCar = {
      id: this.nextId++,
      role,
      lengthM: opts.length ?? (this.rng.chance(0.2) ? 5.2 : 4.6),
      cruiseMs: speed,
      shade: opts.shade ?? Math.floor(this.rng.next() * 4),
      x,
      speed,
      lane,
      lat: lane,
      change: null,
      inPlayerLane: lane === PLAYER_LANE,
      followedS: 0,
      cutOutAfterS: opts.cutOutAfterS ?? null,
      cutOutSide: opts.cutOutSide ?? 1,
      cutInPending: opts.cutInPending ?? false,
      cutInWindowM: opts.cutInWindowM ?? null,
      retryAtS: 0,
      ageS: 0,
    };
    this.cars.push(car);
    this.log({ kind: 'spawn', id: car.id, role, lane, gapM: round1(rearOf(car) - this.player.x), speedKmh: round1(msToKmh(speed)) });
    return car;
  }

  /**
   * Whether `c` can move into lane `to` without crowding anyone: a clear slot
   * beside it, and room to the car ahead and from the car behind for their speeds.
   */
  private laneChangeSafe(c: TrafficCar, to: number): boolean {
    if (this.laneOccupied(to, rearOf(c) - 12, c.x + 12, c)) return false;
    for (const o of this.cars) {
      if (o === c) continue;
      const inLane = Math.abs(o.lat - to) < RELEASE_LANES || (o.change !== null && o.change.to === to);
      if (!inLane) continue;
      if (o.x > c.x) {
        const gap = rearOf(o) - c.x;
        const closing = Math.max(0, c.speed - o.speed);
        if (gap < STANDSTILL_GAP_M + 0.5 * c.speed + (closing * closing) / (2 * CUT_IN_DECEL)) return false;
      } else {
        const gap = rearOf(c) - o.x;
        const closing = Math.max(0, o.speed - c.speed);
        if (gap < STANDSTILL_GAP_M + 0.5 * o.speed + (closing * closing) / (2 * CUT_IN_DECEL)) return false;
      }
    }
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

  private stepEncounters(player: PlayerState): void {
    if (this.drivingS < this.nextEncounterS) return;
    if (this.cars.length >= MAX_CARS) {
      this.nextEncounterS = this.drivingS + 5;
      return;
    }
    this.nextEncounterS = this.drivingS + this.rng.range(ENCOUNTER_INTERVAL_S[0], ENCOUNTER_INTERVAL_S[1]);
    this.encounters++;
    const roll = this.rng.next();
    const speed = this.randomSpeed();
    const side = this.rng.pick([-1, 1] as const);
    const vP = anticipatedSpeed(player, 4);
    if (roll < 0.4) {
      // A slower (or similar) car ahead in the player's lane, placed for the closing speed; it leaves after a while.
      let x = player.x + leadSpawnGap(vP, speed) + 4.6;
      for (let i = 0; i < 6 && this.laneOccupied(PLAYER_LANE, x - 50, x + 40); i++) x += 60;
      if (this.laneOccupied(PLAYER_LANE, x - 50, x + 40)) return;
      this.spawn('lead', PLAYER_LANE, x, speed, { cutOutAfterS: this.rng.range(5, 14), cutOutSide: side });
    } else if (roll < 0.75) {
      // A car in an adjacent lane that will cut in ahead of the player.
      const lane = PLAYER_LANE + side;
      let v = speed;
      let x: number;
      if (v < vP - 1) {
        const [, max] = cutInWindow(vP, v);
        x = player.x + max + 4 * (vP - v) + 50;
      } else {
        // The player is slower: the car comes from behind, overtakes and cuts in.
        v = Math.min(kmhToMs(TRAFFIC_SPEED_KMH[1]), Math.max(v, vP + 2));
        if (v < vP + 1) {
          const [, max] = cutInWindow(vP, v);
          x = player.x + max + 4 * (vP - v) + 50;
        } else {
          x = player.x - 45;
        }
      }
      if (this.laneOccupied(lane, x - 40, x + 30)) return;
      this.spawn('cut-in', lane, x, v, { cutInPending: true, cutOutAfterS: this.rng.range(5, 12), cutOutSide: side === -1 ? 1 : -1 });
    } else {
      // Adjacent traffic: either passed by the player or overtaking from behind.
      const lane = PLAYER_LANE + side;
      const x = speed > vP + 2 ? player.x - 45 : player.x + 120 + 4 * Math.max(0, vP - speed);
      if (this.laneOccupied(lane, x - 40, x + 30)) return;
      this.spawn('adjacent', lane, x, speed);
    }
  }

  private stepScenario(player: PlayerState): void {
    const a = this.cars.find((c) => c.role === 'scenario-lead');
    const b = this.cars.find((c) => c.role === 'scenario-cut-in');
    const setPhase = (p: ScenarioPhase) => {
      this.phase = p;
      this.log({ kind: 'phase', id: 0, note: p });
    };
    switch (this.phase) {
      case 'approach':
        if (a && a.followedS >= 2.5) {
          // A slower car in the right lane, just ahead, that the player closes on and that cuts in.
          const x = player.x + SCENARIO.cutInGapM + 4.6;
          this.spawn('scenario-cut-in', PLAYER_LANE + 1, x, kmhToMs(SCENARIO.cutInKmh), {
            length: 4.6,
            shade: 2,
            cutInPending: true,
            cutInWindowM: SCENARIO.cutInWindowM,
          });
          setPhase('cut-in');
        }
        break;
      case 'cut-in':
        if (b && b.lane === PLAYER_LANE && b.change === null) {
          b.cutOutAfterS = 6;
          b.cutOutSide = -1;
          b.followedS = 0;
          setPhase('follow');
        }
        break;
      case 'follow':
        if (!b || (b.change !== null && b.change.to !== PLAYER_LANE)) {
          if (a) {
            a.followedS = 0;
            a.cutOutAfterS = 4;
            a.cutOutSide = 1;
          }
          setPhase('resume');
        }
        break;
      case 'resume':
        if (!a || (a.change !== null && a.change.to !== PLAYER_LANE)) setPhase('clear');
        break;
      case 'clear':
        if (!a || !a.inPlayerLane) setPhase('done');
        break;
      default:
        break;
    }
  }

  /** Start lane changes: cut-ins when the gap to the player is in the trigger window, cut-outs after being followed. */
  private stepLaneDecisions(player: PlayerState): void {
    for (const c of this.cars) {
      if (c.change) {
        if (c.change.to === PLAYER_LANE && !c.inPlayerLane && this.cutInUnsafe(c, player)) this.abortCutIn(c, player);
        continue;
      }
      if (c.cutInPending && c.lane !== PLAYER_LANE) {
        if (c.ageS > 60) {
          c.cutInPending = false;
          continue;
        }
        if (c.ageS < c.retryAtS) continue;
        const gap = rearOf(c) - player.x;
        const [min, max] = c.cutInWindowM ?? cutInWindow(anticipatedSpeed(player), c.speed);
        if (gap >= min && gap <= max && !this.cutInUnsafe(c, player) && this.laneChangeSafe(c, PLAYER_LANE)) {
          this.startChange(c, PLAYER_LANE, gap);
          c.cutInPending = false;
        }
      } else if (c.lane === PLAYER_LANE && c.cutOutAfterS !== null && c.followedS >= c.cutOutAfterS) {
        const first = PLAYER_LANE + c.cutOutSide;
        const second = PLAYER_LANE - c.cutOutSide;
        for (const to of [first, second]) {
          if (to >= 0 && to < LANE_COUNT && this.laneChangeSafe(c, to)) {
            this.startChange(c, to, rearOf(c) - player.x);
            c.cutOutAfterS = null;
            break;
          }
        }
      }
    }
  }

  private startChange(c: TrafficCar, to: number, gap: number): void {
    c.change = { from: c.lane, to, latStart: c.lat, elapsedS: 0, signalS: SIGNAL_S, durationS: LANE_CHANGE_S };
    this.log({ kind: 'signal', id: c.id, role: c.role, lane: c.lane, to, gapM: round1(gap), speedKmh: round1(msToKmh(c.speed)) });
  }

  /** Whether moving in ahead of the player now would leave it more than a firm brake to keep the standstill gap. */
  private cutInUnsafe(c: TrafficCar, player: PlayerState): boolean {
    const gap = rearOf(c) - player.x;
    const closing = anticipatedSpeed(player) - c.speed;
    if (gap < STANDSTILL_GAP_M + 2) return true;
    if (closing <= 0) return false;
    return (closing * closing) / (2 * Math.max(gap - closing * CUT_IN_CLAIM_S * 0.5 - STANDSTILL_GAP_M, 0.5)) > CUT_IN_ABORT_DECEL;
  }

  /** Steer back into the original lane, like a driver who checks the mirror again; it may try again later. */
  private abortCutIn(c: TrafficCar, player: PlayerState): void {
    const back = c.change!.from;
    c.change = { from: back, to: back, latStart: c.lat, elapsedS: 0, signalS: 0, durationS: Math.max(0.6, LANE_CHANGE_S * Math.abs(c.lat - back)) };
    c.cutInPending = true;
    c.retryAtS = c.ageS + 4;
    this.log({ kind: 'abort', id: c.id, role: c.role, lane: back, gapM: round1(rearOf(c) - player.x), speedKmh: round1(msToKmh(c.speed)) });
  }

  private stepLaneChanges(dt: number): void {
    for (const c of this.cars) {
      c.ageS += dt;
      const ch = c.change;
      if (!ch) continue;
      ch.elapsedS += dt;
      const p = clamp((ch.elapsedS - ch.signalS) / ch.durationS, 0, 1);
      c.lat = ch.latStart + (ch.to - ch.latStart) * smoothstep(p);
      if (p >= 1) {
        c.lane = ch.to;
        c.lat = ch.to;
        c.change = null;
      }
    }
  }

  /** IDM car following; the player counts as a car ahead for traffic behind it in its lane. */
  private stepLongitudinal(dt: number, player: PlayerState): void {
    const n = this.cars.length;
    const accel = new Array<number>(n);
    for (let i = 0; i < n; i++) {
      const c = this.cars[i];
      let gap = Infinity;
      let leadSpeed = c.speed;
      for (const o of this.cars) {
        if (o === c || o.x <= c.x || Math.abs(o.lat - c.lat) >= 0.8) continue;
        const g = rearOf(o) - c.x;
        if (g < gap) {
          gap = g;
          leadSpeed = o.speed;
        }
      }
      if (Math.abs(c.lat - PLAYER_LANE) < 0.8 && player.x > c.x) {
        const g = player.x - PLAYER_LENGTH_M - c.x;
        if (g < gap) {
          gap = g;
          leadSpeed = player.speed;
        }
      }
      const v = c.speed;
      const free = 1 - (v / c.cruiseMs) ** 4;
      let a = IDM.a * free;
      if (gap < Infinity) {
        const sStar = IDM.s0 + Math.max(0, v * IDM.T + (v * (v - leadSpeed)) / (2 * Math.sqrt(IDM.a * IDM.b)));
        a -= IDM.a * (sStar / Math.max(gap, 0.5)) ** 2;
      }
      accel[i] = clamp(a, -9, IDM.a);
    }
    for (let i = 0; i < n; i++) {
      const c = this.cars[i];
      c.speed = Math.max(0, c.speed + accel[i] * dt);
      c.x += c.speed * dt;
    }
  }

  private updateClaims(dt: number): void {
    const p = this.player;
    let lead: TrafficCar | null = null;
    for (const c of this.cars) {
      const off = Math.abs(c.lat - PLAYER_LANE);
      if (c.inPlayerLane && off > RELEASE_LANES) c.inPlayerLane = false;
      else if (!c.inPlayerLane && off <= CLAIM_LANES) c.inPlayerLane = true;
      if (c.inPlayerLane && c.x > p.x && (!lead || rearOf(c) < rearOf(lead))) lead = c;
    }
    if (!lead) {
      this.leadCache = null;
      return;
    }
    const gap = rearOf(lead) - p.x;
    // Following closely: near the speed of the lead and within about three seconds.
    if (gap <= STANDSTILL_GAP_M + 3 * p.speed + 10 && Math.abs(p.speed - lead.speed) < 3) lead.followedS += dt;
    this.leadCache = {
      id: lead.id,
      gapM: gap,
      speedMs: lead.speed,
      cutIn: lead.change !== null && lead.change.to === PLAYER_LANE,
    };
  }

  private despawn(player: PlayerState): void {
    for (let i = this.cars.length - 1; i >= 0; i--) {
      const c = this.cars[i];
      if (c.x < player.x - 200 || c.x > player.x + 9000) {
        this.cars.splice(i, 1);
        this.log({ kind: 'despawn', id: c.id, role: c.role });
      }
    }
  }
}

function round1(v: number): number {
  return Math.round(v * 10) / 10;
}
