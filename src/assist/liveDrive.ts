import { FIXED_DT } from '../physics/constants';
import { LiveTimer } from '../physics/liveTimer';
import { VehicleSimulator } from '../physics/simulator';
import type { ShiftMode, SimVehicle } from '../physics/types';
import { kmhToMs, msToKmh } from '../physics/units';
import { AutoDriveController, plantModel, type AutoDriveCommand, type AutoDriveMode } from './autoDrive';
import { lateralMove, reversalDuration, sampleLateral, type LateralMove } from './lateral';
import { normaliseSeed } from './rng';
import { defaultRoad, isGenerated, isScripted, type RoadSettings, type TrafficMode } from './road';
import { LANE_COUNT, PLAYER_LENGTH_M, RELEASE_LANES, START_LANE, TrafficSim, rearOf, type Level, type ScenarioPhase } from './traffic';

/** Pedal travel rate (full travel in ~0.14 s), like a real foot. */
export const PEDAL_RATE = 7;
/** Driver brake above this cancels Auto Drive and cruise (a touch on the brake pedal is ≥ 0.08). */
export const BRAKE_CANCEL = 0.05;
/** Driver throttle above this, and at least the automatic request, overrides automatic braking. */
export const THROTTLE_OVERRIDE = 0.05;
export const DEFAULT_TRAFFIC_SEED = 1;
/** Player lane change: time to move one lane across, s. */
export const PLAYER_LANE_CHANGE_S = 2.5;
/** Cruise: lowest speed SET accepts, step of + and −, and the highest stored speed, km/h. */
export const CRUISE_MIN_KMH = 20;
export const CRUISE_STEP_KMH = 1;
export const CRUISE_MAX_KMH = 400;

export type DisengageReason = 'switch' | 'brake' | 'reset' | 'vehicle' | 'focus';

export interface DriverInput {
  throttle: number;
  brake: number;
}

export interface CommandResult {
  ok: boolean;
  message?: string;
}

export interface LeadView {
  id: number;
  speedKmh: number;
  gapM: number;
  /** Gap divided by own speed, s; null when (nearly) stopped. */
  timeGapS: number | null;
  cutIn: boolean;
}

export interface AutoDriveView {
  engaged: boolean;
  mode: AutoDriveMode | 'off';
  /** The driver is pressing the accelerator harder than the automated request. */
  override: boolean;
  /** Pedal requests from Auto Drive or cruise (before pedal smoothing). */
  throttle: number;
  brake: number;
  targetAccel: number | null;
  limiter: AutoDriveCommand['limiter'];
  lastDisengage: { reason: DisengageReason; agoS: number } | null;
  /** Auto Drive was on at some point since the car last stood still with it off (labels a saved live run). */
  usedThisRun: boolean;
  cruiseUsedThisRun: boolean;
}

/** off: nothing stored · standby: stored, not active · cruise: holding it (Auto Drive off) · cap: Auto Drive's maximum speed. */
export type CruiseState = 'off' | 'standby' | 'cruise' | 'cap';

export interface CruiseView {
  setKmh: number | null;
  state: CruiseState;
}

export interface PlayerLaneView {
  /** Lane the player is in or moving to. */
  lane: number;
  /** Continuous lateral position, lanes. */
  lat: number;
  /** −1 left, +1 right, 0 not changing. */
  signal: -1 | 0 | 1;
}

export interface TrafficCarView {
  id: number;
  /** Front bumper relative to the player's front bumper, m. */
  dx: number;
  lengthM: number;
  /** Lateral position in lanes (0 left, 1 middle, 2 right). */
  lat: number;
  speedKmh: number;
  inLane: boolean;
  isLead: boolean;
  /** Turn signal: −1 left, +1 right, 0 off (unsignalled moves show none). */
  signal: -1 | 0 | 1;
  shade: number;
  kind: 'car' | 'van' | 'truck';
  courteous: boolean;
  bursting: boolean;
}

export interface TrafficView {
  mode: TrafficMode;
  seed: number;
  road: RoadSettings;
  /** Auto: the traffic pattern in force; other generated modes: their level. */
  level: Level | null;
  cars: TrafficCarView[];
  lead: LeadView | null;
  /** The player overlaps a car in its path (no collision physics: shown only). */
  contact: boolean;
  phase: ScenarioPhase | null;
  note: string | null;
}

interface PlayerLaneChange {
  from: number;
  to: number;
  latStart: number;
  elapsedS: number;
  move: LateralMove;
}

/**
 * One Live Drive session: the vehicle simulator, the live timer, pedal
 * smoothing, Auto Hold, the player's lane, seeded traffic, Auto Drive and
 * conventional cruise, advanced in FIXED_DT steps. `useDriveSimulation`
 * drives it from requestAnimationFrame; tests drive it directly, so a replay
 * with the same seed, settings, starting state and inputs is reproduced step
 * for step.
 *
 * Automated pedals come from one controller: conventional cruise (no lead,
 * no braking, coasts above the set speed), or Auto Drive (lead following and
 * braking) with the cruise set speed as an optional cap. With Auto Drive,
 * cruise and traffic off it performs exactly the steps the live loop always
 * did: driver pedals → smoothing → Auto Hold → simulator → timer.
 */
export class LiveDriveLoop {
  readonly vehicle: SimVehicle;
  readonly sim: VehicleSimulator;
  readonly timer = new LiveTimer();
  readonly applied = { throttle: 0, brake: 0 };
  /** Auto Hold: engaged at rest (initially, or after braking to a stop), released by the throttle. */
  hold = true;
  /** Simulation time since the last reset, s. */
  time = 0;
  traffic: TrafficSim | null = null;
  private trafficMode: TrafficMode;
  private seed: number;
  private road: RoadSettings;
  private readonly controller: AutoDriveController;
  private engaged = false;
  private cruiseKmh: number | null = null;
  private cruiseActive = false;
  private command: AutoDriveCommand | null = null;
  private override = false;
  private driver: DriverInput = { throttle: 0, brake: 0 };
  private lastDisengage: { reason: DisengageReason; time: number } | null = null;
  private usedThisRun = false;
  private cruiseUsedThisRun = false;
  private lane = START_LANE;
  private lat = START_LANE;
  /** Lateral velocity and acceleration of the player's car, lanes/s and lanes/s². */
  private latV = 0;
  private latA = 0;
  private laneChange: PlayerLaneChange | null = null;

  constructor(
    vehicle: SimVehicle,
    shiftMode: ShiftMode = 'auto',
    opts: {
      trafficMode?: TrafficMode;
      seed?: number;
      road?: RoadSettings;
      /** Auto Drive was switched off by replacing the previous session (car or tuning change). */
      disengaged?: DisengageReason;
      /**
       * The driver's pedal targets when this session replaces another one (car or tuning change). A brake
       * still held across the change keeps refusing Auto Drive, SET and RESUME before the first step.
       */
      driver?: DriverInput;
    } = {},
  ) {
    this.vehicle = vehicle;
    if (opts.disengaged) this.lastDisengage = { reason: opts.disengaged, time: 0 };
    if (opts.driver) this.driver = { ...opts.driver };
    this.sim = new VehicleSimulator(vehicle, shiftMode);
    this.controller = new AutoDriveController(plantModel(vehicle));
    this.trafficMode = opts.trafficMode ?? 'off';
    this.seed = normaliseSeed(opts.seed ?? DEFAULT_TRAFFIC_SEED);
    this.road = { ...(opts.road ?? defaultRoad()) };
    this.restartTraffic();
  }

  get autoDriveEngaged(): boolean {
    return this.engaged;
  }

  /** Auto Drive or cruise is producing pedal requests. */
  get automated(): boolean {
    return this.engaged || this.cruiseActive;
  }

  get trafficSetting(): { mode: TrafficMode; seed: number; road: RoadSettings } {
    return { mode: this.trafficMode, seed: this.seed, road: { ...this.road } };
  }

  get playerLane(): number {
    return this.lane;
  }

  get playerLat(): number {
    return this.lat;
  }

  // ---------------------------------------------------------------------------
  // Auto Drive

  /**
   * The driver's pedal targets as they are now (the hook calls this on every pedal event), so a command
   * that must be refused while braking sees a brake pressed since the last fixed step.
   */
  setDriverInput(driver: DriverInput): void {
    this.driver = { ...driver };
  }

  /** Turn Auto Drive on. Refused (false) while the driver is braking. An active cruise speed becomes its cap. */
  engage(): boolean {
    if (this.engaged) return true;
    if (this.driver.brake > BRAKE_CANCEL) return false;
    if (!this.automated) this.controller.engage(this.applied.throttle);
    this.engaged = true;
    this.lastDisengage = null;
    return true;
  }

  /**
   * Turn Auto Drive off. The stored cruise speed stays in standby (it is not
   * resumed automatically) and no automatic throttle carries over.
   */
  disengage(reason: DisengageReason): void {
    if (!this.automated) return;
    const wasEngaged = this.engaged;
    this.engaged = false;
    this.cruiseActive = false;
    if (wasEngaged || reason !== 'switch') this.lastDisengage = { reason, time: this.time };
    this.stopAutomation();
  }

  private stopAutomation(): void {
    this.command = null;
    this.override = false;
    // Stale automatic throttle is cleared now; the brake follows the driver's foot through pedal smoothing.
    this.applied.throttle = Math.min(this.applied.throttle, this.driver.throttle);
  }

  // ---------------------------------------------------------------------------
  // Conventional cruise control (and Auto Drive's speed cap)

  get cruise(): CruiseView {
    const state: CruiseState = this.cruiseKmh === null ? 'off' : !this.cruiseActive ? 'standby' : this.engaged ? 'cap' : 'cruise';
    return { setKmh: this.cruiseKmh, state };
  }

  /** SET: store the current road speed and hold it (or cap Auto Drive with it). */
  cruiseSet(): CommandResult {
    if (this.driver.brake > BRAKE_CANCEL) return { ok: false, message: 'Release the brake to set a speed' };
    const kmh = msToKmh(this.sim.state.speed);
    if (kmh < CRUISE_MIN_KMH) return { ok: false, message: `Drive above ${CRUISE_MIN_KMH} km/h to set a speed` };
    this.cruiseKmh = Math.round(kmh);
    this.activateCruise();
    return { ok: true };
  }

  /** + / −: change the stored speed in small steps. */
  cruiseAdjust(direction: 1 | -1): CommandResult {
    if (this.cruiseKmh === null) return { ok: false, message: 'Set a speed first' };
    this.cruiseKmh = Math.min(CRUISE_MAX_KMH, Math.max(CRUISE_MIN_KMH, this.cruiseKmh + direction * CRUISE_STEP_KMH));
    return { ok: true };
  }

  /** CANCEL: stop using the set speed and keep it stored. With Auto Drive on, only the cap is removed. */
  cruiseCancel(): CommandResult {
    if (!this.cruiseActive) return { ok: false, message: this.cruiseKmh === null ? 'Cruise is not set' : 'Cruise is already in standby' };
    this.cruiseActive = false;
    if (!this.engaged) this.stopAutomation();
    return { ok: true };
  }

  /** RESUME: use the stored speed again. */
  cruiseResume(): CommandResult {
    if (this.cruiseKmh === null) return { ok: false, message: 'No set speed stored yet — use SET' };
    if (this.driver.brake > BRAKE_CANCEL) return { ok: false, message: 'Release the brake to resume' };
    this.activateCruise();
    return { ok: true };
  }

  private activateCruise(): void {
    // Start from the throttle that holds the current speed (not the driver's pedal), so SET does not surge.
    if (!this.automated) this.controller.engage(Math.min(this.applied.throttle, this.controller.holdThrottle(this.sim.state.speed)));
    this.cruiseActive = true;
  }

  // ---------------------------------------------------------------------------
  // Player lane changes (only ever on command)

  get laneView(): PlayerLaneView {
    const ch = this.laneChange;
    return { lane: this.lane, lat: this.lat, signal: ch ? (ch.to > ch.latStart ? 1 : ch.to < ch.latStart ? -1 : 0) : 0 };
  }

  requestLaneChange(direction: -1 | 1): CommandResult {
    const ch = this.laneChange;
    if (ch) {
      const moving = Math.sign(ch.to - this.lat) as -1 | 0 | 1;
      if (moving === direction) return { ok: false, message: 'Already changing lanes' };
      // The other way mid-change: ease out of the current sideways motion and back to the lane it came from.
      const back = ch.from;
      const from = { p: this.lat, v: this.latV, a: this.latA };
      this.laneChange = { from: ch.to, to: back, latStart: this.lat, elapsedS: 0, move: lateralMove(from, back, reversalDuration(PLAYER_LANE_CHANGE_S, this.lat - back, this.latV)) };
      this.lane = back;
      return { ok: true, message: 'Lane change cancelled' };
    }
    const to = this.lane + direction;
    if (to < 0 || to >= LANE_COUNT) return { ok: false, message: direction < 0 ? 'No lane to the left' : 'No lane to the right' };
    if (this.laneOccupiedBeside(to)) return { ok: false, message: 'Lane occupied — wait for a gap' };
    this.laneChange = { from: this.lane, to, latStart: this.lat, elapsedS: 0, move: lateralMove({ p: this.lat, v: 0, a: 0 }, to, PLAYER_LANE_CHANGE_S) };
    this.lane = to;
    return { ok: true };
  }

  /** A car beside the player in that lane, or so close ahead that moving in would leave no gap (more room at speed). */
  private laneOccupiedBeside(lane: number): boolean {
    const x = this.sim.state.distance;
    const ahead = Math.max(5, 0.4 * this.sim.state.speed);
    return (this.traffic?.cars ?? []).some((c) => {
      const inLane = Math.abs(c.lat - lane) < RELEASE_LANES || (c.change !== null && c.change.to === lane);
      return inLane && rearOf(c) < x + ahead && c.x > x - PLAYER_LENGTH_M - 3;
    });
  }

  private stepLane(dt: number): void {
    const ch = this.laneChange;
    if (!ch) return;
    ch.elapsedS += dt;
    const s = sampleLateral(ch.move, ch.elapsedS);
    this.lat = s.p;
    this.latV = s.v;
    this.latA = s.a;
    if (ch.elapsedS >= ch.move.durationS) {
      this.lat = ch.to;
      this.latV = 0;
      this.latA = 0;
      this.laneChange = null;
    }
  }

  // ---------------------------------------------------------------------------
  // Traffic and road settings

  /** Change traffic. Densities switch in place (no car is moved or removed); a scripted test restarts its script; Off clears the road. */
  setTraffic(mode: TrafficMode, seed: number = this.seed): void {
    const newSeed = normaliseSeed(seed);
    const prev = this.trafficMode;
    this.trafficMode = mode;
    if (newSeed !== this.seed) {
      this.seed = newSeed;
      if (this.traffic && isGenerated(mode) && isGenerated(prev)) this.traffic.setSeed(newSeed);
    }
    if (this.traffic && isGenerated(mode) && (isGenerated(prev) || isScripted(prev))) {
      this.traffic.setDensity(mode);
      return;
    }
    this.restartTraffic();
  }

  /** New seed for future traffic; cars already on the road stay. Reset replays from the seed. */
  setSeed(seed: number): void {
    this.seed = normaliseSeed(seed);
    if (this.traffic && isGenerated(this.trafficMode)) this.traffic.setSeed(this.seed);
  }

  /** Road preset or limit for traffic. Never changes the player's car or cruise setting. */
  setRoad(road: RoadSettings): void {
    this.road = { ...road };
    this.traffic?.setRoad(this.road);
  }

  /** Back to a standing start in the starting lane: Auto Drive and cruise off, set speed cleared, traffic restarted from its seed and settings. */
  reset(): void {
    this.disengage('reset');
    this.cruiseKmh = null;
    this.cruiseActive = false;
    this.sim.reset();
    this.timer.reset();
    this.applied.throttle = 0;
    this.applied.brake = 0;
    this.hold = true;
    this.time = 0;
    this.usedThisRun = false;
    this.cruiseUsedThisRun = false;
    this.lane = START_LANE;
    this.lat = START_LANE;
    this.latV = 0;
    this.latA = 0;
    this.laneChange = null;
    this.restartTraffic();
  }

  private playerState() {
    const s = this.sim.state;
    return { x: s.distance, speed: s.speed, accel: s.accelFiltered, lat: this.lat, targetLane: this.lane };
  }

  private restartTraffic(): void {
    this.traffic = this.trafficMode === 'off' ? null : new TrafficSim(this.trafficMode, this.seed, this.playerState(), this.road);
  }

  // ---------------------------------------------------------------------------

  /** Advance one fixed step with the driver's pedal targets. */
  step(driver: DriverInput): void {
    this.driver = driver;
    const sim = this.sim;
    let wantThrottle = driver.throttle;
    let wantBrake = driver.brake;
    // The driver's brake has priority: it cancels Auto Drive and cruise in the same step.
    if (this.automated && driver.brake > BRAKE_CANCEL) this.disengage('brake');
    if (this.automated) {
      const cmd = this.controller.update(
        FIXED_DT,
        { speed: sim.state.speed, accel: sim.state.accelFiltered },
        this.engaged ? (this.traffic?.lead() ?? null) : null,
        { capMs: this.cruiseActive && this.cruiseKmh !== null ? kmhToMs(this.cruiseKmh) : null, allowBrake: this.engaged },
      );
      this.command = cmd;
      // The higher accelerator request wins; pressing it at least as far as the automation overrides its braking.
      this.override = driver.throttle > THROTTLE_OVERRIDE && driver.throttle >= cmd.throttle;
      wantThrottle = Math.max(driver.throttle, cmd.throttle);
      wantBrake = this.override ? 0 : cmd.brake;
    }
    const a = this.applied;
    const maxDelta = PEDAL_RATE * FIXED_DT;
    a.throttle += Math.max(-maxDelta, Math.min(maxDelta, wantThrottle - a.throttle));
    a.brake += Math.max(-maxDelta, Math.min(maxDelta, wantBrake - a.brake));
    if (sim.state.speed === 0 && a.brake > 0.05) this.hold = true;
    if (a.throttle > 0.02) this.hold = false;
    sim.step(FIXED_DT, this.hold ? { throttle: a.throttle, brake: 1 } : a);
    this.timer.update(sim.state);
    if (this.engaged) this.usedThisRun = true;
    else if (sim.state.speed === 0) this.usedThisRun = false;
    if (this.cruiseActive && !this.engaged) this.cruiseUsedThisRun = true;
    else if (sim.state.speed === 0) this.cruiseUsedThisRun = false;
    this.stepLane(FIXED_DT);
    this.traffic?.step(FIXED_DT, this.playerState());
    this.time += FIXED_DT;
  }

  // ---------------------------------------------------------------------------
  // Views for the HUD

  autoDriveView(): AutoDriveView {
    const c = this.automated ? this.command : null;
    return {
      engaged: this.engaged,
      mode: this.engaged ? (c ? c.mode : 'accelerating') : 'off',
      override: this.automated && this.override,
      throttle: c?.throttle ?? 0,
      brake: c?.brake ?? 0,
      targetAccel: c?.targetAccel ?? null,
      limiter: c?.limiter ?? null,
      lastDisengage: this.lastDisengage ? { reason: this.lastDisengage.reason, agoS: this.time - this.lastDisengage.time } : null,
      usedThisRun: this.usedThisRun,
      cruiseUsedThisRun: this.cruiseUsedThisRun,
    };
  }

  trafficView(): TrafficView {
    const t = this.traffic;
    const x = this.sim.state.distance;
    const speed = this.sim.state.speed;
    const lead = t?.lead() ?? null;
    let contact = !!lead && lead.gapM <= 0;
    const cars: TrafficCarView[] = [];
    if (t) {
      for (const c of t.cars) {
        const ch = c.change;
        const moving = ch !== null && ch.to !== ch.from;
        const signalling = moving && ch.signalS > 0 && ch.elapsedS < ch.signalS + ch.durationS;
        if (c.inPlayerLane && rearOf(c) < x && c.x > x - PLAYER_LENGTH_M) contact = true;
        cars.push({
          id: c.id,
          dx: c.x - x,
          lengthM: c.lengthM,
          lat: c.lat,
          speedKmh: msToKmh(c.speed),
          inLane: c.inPlayerLane,
          isLead: lead?.id === c.id,
          signal: signalling ? (ch.to > ch.from ? 1 : -1) : 0,
          shade: c.shade,
          kind: c.kind,
          courteous: c.traits.courteous,
          bursting: c.burstUntilS > t.time,
        });
      }
    }
    return {
      mode: this.trafficMode,
      seed: this.seed,
      road: { ...this.road },
      level: t?.currentLevel ?? null,
      cars,
      lead: lead
        ? {
            id: lead.id,
            speedKmh: msToKmh(lead.speedMs),
            gapM: lead.gapM,
            timeGapS: speed > 1 ? lead.gapM / speed : null,
            cutIn: lead.cutIn,
          }
        : null,
      contact,
      phase: t?.phase ?? null,
      note: t?.scenarioNote ?? null,
    };
  }
}
