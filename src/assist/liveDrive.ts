import { FIXED_DT } from '../physics/constants';
import { LiveTimer } from '../physics/liveTimer';
import { VehicleSimulator } from '../physics/simulator';
import type { ShiftMode, SimVehicle } from '../physics/types';
import { msToKmh } from '../physics/units';
import { AutoDriveController, plantModel, type AutoDriveCommand, type AutoDriveMode } from './autoDrive';
import { normaliseSeed } from './rng';
import { SCENARIO_NOTE, TrafficSim, type ScenarioPhase, type TrafficMode } from './traffic';

/** Pedal travel rate (full travel in ~0.14 s), like a real foot. */
export const PEDAL_RATE = 7;
/** Driver brake above this cancels Auto Drive (a touch on the brake pedal is ≥ 0.08). */
export const BRAKE_CANCEL = 0.05;
/** Driver throttle above this, and at least the automatic request, overrides automatic braking. */
export const THROTTLE_OVERRIDE = 0.05;
export const DEFAULT_TRAFFIC_SEED = 1;

export type DisengageReason = 'switch' | 'brake' | 'reset' | 'vehicle' | 'focus';

export interface DriverInput {
  throttle: number;
  brake: number;
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
  /** The driver is pressing the accelerator harder than Auto Drive. */
  override: boolean;
  /** Pedal requests from Auto Drive (before pedal smoothing). */
  throttle: number;
  brake: number;
  targetAccel: number | null;
  lastDisengage: { reason: DisengageReason; agoS: number } | null;
  /** Auto Drive was on at some point since the car last stood still with it off (labels a saved live run). */
  usedThisRun: boolean;
}

export interface TrafficCarView {
  id: number;
  /** Front bumper relative to the player's front bumper, m. */
  dx: number;
  lengthM: number;
  /** Lateral position in lanes (0 left, 1 player lane, 2 right). */
  lat: number;
  speedKmh: number;
  inLane: boolean;
  isLead: boolean;
  /** Turn signal: −1 left, +1 right, 0 off. */
  signal: -1 | 0 | 1;
  shade: number;
}

export interface TrafficView {
  mode: TrafficMode;
  seed: number;
  cars: TrafficCarView[];
  lead: LeadView | null;
  /** The player overlaps the car ahead (no collision physics: shown only). */
  contact: boolean;
  phase: ScenarioPhase | null;
  note: string | null;
}

/**
 * One Live Drive session: the vehicle simulator, the live timer, pedal
 * smoothing, Auto Hold, optional seeded traffic and Auto Drive, advanced in
 * FIXED_DT steps. `useDriveSimulation` drives it from requestAnimationFrame;
 * tests drive it directly, so a replay with the same seed, starting state and
 * inputs is reproduced step for step.
 *
 * With Auto Drive off and traffic off it performs exactly the steps the live
 * loop always did: driver pedals → smoothing → Auto Hold → simulator → timer.
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
  private readonly controller: AutoDriveController;
  private engaged = false;
  private command: AutoDriveCommand | null = null;
  private override = false;
  private driver: DriverInput = { throttle: 0, brake: 0 };
  private lastDisengage: { reason: DisengageReason; time: number } | null = null;
  private usedThisRun = false;

  constructor(
    vehicle: SimVehicle,
    shiftMode: ShiftMode = 'auto',
    opts: { trafficMode?: TrafficMode; seed?: number; /** Auto Drive was switched off by replacing the previous session (car or tuning change). */ disengaged?: DisengageReason } = {},
  ) {
    this.vehicle = vehicle;
    if (opts.disengaged) this.lastDisengage = { reason: opts.disengaged, time: 0 };
    this.sim = new VehicleSimulator(vehicle, shiftMode);
    this.controller = new AutoDriveController(plantModel(vehicle));
    this.trafficMode = opts.trafficMode ?? 'off';
    this.seed = normaliseSeed(opts.seed ?? DEFAULT_TRAFFIC_SEED);
    this.restartTraffic();
  }

  get autoDriveEngaged(): boolean {
    return this.engaged;
  }

  get trafficSetting(): { mode: TrafficMode; seed: number } {
    return { mode: this.trafficMode, seed: this.seed };
  }

  /** Turn Auto Drive on. Refused (false) while the driver is braking. */
  engage(): boolean {
    if (this.engaged) return true;
    if (this.driver.brake > BRAKE_CANCEL) return false;
    this.controller.engage(this.applied.throttle);
    this.engaged = true;
    this.lastDisengage = null;
    return true;
  }

  /** Turn Auto Drive off and drop its pedal requests at once (no automatic throttle carries over). */
  disengage(reason: DisengageReason): void {
    if (!this.engaged) return;
    this.engaged = false;
    this.command = null;
    this.override = false;
    this.lastDisengage = { reason, time: this.time };
    // Stale automatic throttle is cleared now; the brake follows the driver's foot through pedal smoothing.
    this.applied.throttle = Math.min(this.applied.throttle, this.driver.throttle);
  }

  setTraffic(mode: TrafficMode, seed: number = this.seed): void {
    this.trafficMode = mode;
    this.seed = normaliseSeed(seed);
    this.restartTraffic();
  }

  /** Back to a standing start: Auto Drive off, timer cleared, traffic restarted from its seed. */
  reset(): void {
    this.disengage('reset');
    this.sim.reset();
    this.timer.reset();
    this.applied.throttle = 0;
    this.applied.brake = 0;
    this.hold = true;
    this.time = 0;
    this.usedThisRun = false;
    this.restartTraffic();
  }

  private restartTraffic(): void {
    const s = this.sim.state;
    this.traffic = this.trafficMode === 'off' ? null : new TrafficSim(this.trafficMode, this.seed, { x: s.distance, speed: s.speed, accel: s.accelFiltered });
  }

  /** Advance one fixed step with the driver's pedal targets. */
  step(driver: DriverInput): void {
    this.driver = driver;
    const sim = this.sim;
    let wantThrottle = driver.throttle;
    let wantBrake = driver.brake;
    // The driver's brake has priority: it cancels Auto Drive in the same step.
    if (this.engaged && driver.brake > BRAKE_CANCEL) this.disengage('brake');
    if (this.engaged) {
      const cmd = this.controller.update(FIXED_DT, { speed: sim.state.speed, accel: sim.state.accelFiltered }, this.traffic?.lead() ?? null);
      this.command = cmd;
      // The higher accelerator request wins; pressing it at least as far as Auto Drive overrides automatic braking.
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
    this.traffic?.step(FIXED_DT, { x: sim.state.distance, speed: sim.state.speed, accel: sim.state.accelFiltered });
    this.time += FIXED_DT;
  }

  autoDriveView(): AutoDriveView {
    const c = this.engaged ? this.command : null;
    return {
      engaged: this.engaged,
      mode: c ? c.mode : 'off',
      override: this.engaged && this.override,
      throttle: c?.throttle ?? 0,
      brake: c?.brake ?? 0,
      targetAccel: c?.targetAccel ?? null,
      lastDisengage: this.lastDisengage ? { reason: this.lastDisengage.reason, agoS: this.time - this.lastDisengage.time } : null,
      usedThisRun: this.usedThisRun,
    };
  }

  trafficView(): TrafficView {
    const t = this.traffic;
    const x = this.sim.state.distance;
    const speed = this.sim.state.speed;
    const lead = t?.lead() ?? null;
    return {
      mode: this.trafficMode,
      seed: this.seed,
      cars: t
        ? t.cars.map((c) => {
            const ch = c.change;
            const signalling = ch !== null && ch.to !== ch.from && ch.elapsedS < ch.signalS + ch.durationS;
            return {
              id: c.id,
              dx: c.x - x,
              lengthM: c.lengthM,
              lat: c.lat,
              speedKmh: msToKmh(c.speed),
              inLane: c.inPlayerLane,
              isLead: lead?.id === c.id,
              signal: signalling ? (ch.to > ch.from ? 1 : -1) : 0,
              shade: c.shade,
            };
          })
        : [],
      lead: lead
        ? {
            id: lead.id,
            speedKmh: msToKmh(lead.speedMs),
            gapM: lead.gapM,
            timeGapS: speed > 1 ? lead.gapM / speed : null,
            cutIn: lead.cutIn,
          }
        : null,
      contact: !!lead && lead.gapM <= 0,
      phase: t?.phase ?? null,
      note: t?.phase ? SCENARIO_NOTE[t.phase] : null,
    };
  }
}
