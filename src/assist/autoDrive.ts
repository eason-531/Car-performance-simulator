import { GRAVITY, MAX_BRAKE_G } from '../physics/constants';
import { aeroDragN, rollingResistanceN } from '../physics/forces';
import type { SimVehicle } from '../physics/types';
import { clamp, rpmToRadS } from '../physics/units';
import type { LeadInfo } from './traffic';

/**
 * Auto Drive: a universal longitudinal controller for the simulator. It is a
 * driving aid of this simulator, not a model of any manufacturer's adaptive
 * cruise control, and it works only the accelerator and brake pedals; the
 * gearbox, traction, torque and speed limits stay those of the active car.
 *
 * Gap policy (one set of defaults shared by every car):
 *  - lane clear → 100 % throttle;
 *  - closing on a slower lead → keep full throttle until the constant
 *    deceleration needed to arrive at the 2-second gap reaches `liftDecel`,
 *    then follow that plan (lift first, brake if lifting is not enough);
 *  - near the lead → constant-time-gap law
 *    a = k_s·(gap − s0 − T·v) + k_v·(v_lead − v), with the gap term capped so
 *    a cut-in opens the gap gently;
 *  - never plan inside the standstill gap: brake harder when needed.
 *
 * Pedal layer: a feedforward throttle from a rough plant estimate plus an
 * integral trim, slew-limited (ease back on at `resumeRate`), and a brake
 * feedforward from the car's brake capacity with its own trim. Throttle and
 * brake are never requested together (the throttle closes first, four times
 * faster when urgent), and the switch between them has
 * hysteresis and a short coast dwell so the controller does not cycle.
 */
export interface AutoDriveParams {
  /** Following time gap, s. */
  timeGapS: number;
  /** Bumper-to-bumper gap kept at a standstill, m. */
  standstillGapM: number;
  /** Closing on a lead: start the approach when the deceleration needed to settle at the time gap reaches this, m/s². */
  liftDecel: number;
  /** Drop the approach plan when the needed deceleration falls below this (hysteresis), m/s². */
  releaseDecel: number;
  /** The approach is over once the closing speed is below this, m/s (less at low speed, so a stop ends on the plan). */
  closingEndMs: number;
  /** An approach starts only above this closing speed (smaller differences are left to the following law), m/s. */
  planClosingMs: number;
  /** Deceleration the approach plan settles for when arriving exactly at the time gap would need more, m/s². */
  planDecel: number;
  /** …unless that would leave less than this time gap at the lead's speed, s. */
  minTimeGapS: number;
  /** Strongest deceleration the following law asks for unless a collision must be avoided, m/s². */
  comfortDecel: number;
  /** Following law gains: per metre of gap error (s⁻²) and per m/s of relative speed (s⁻¹). */
  gapGain: number;
  speedGain: number;
  /** Floor of the gap-error term when closer than the time gap, m/s². */
  gapTermMin: number;
  /** Throttle rise rate after following or braking, 1/s (ease back on). */
  resumeRate: number;
  /** Throttle fall rate, 1/s… */
  liftRate: number;
  /** …lowered on cars with a lot of throttle authority so lifting stays within this jerk, m/s³ (not below 0.6/s). */
  liftJerk: number;
  /** Integral trim bandwidth of the throttle and brake layers, 1/s. */
  trimBandwidth: number;
  /** Braking starts when the request is this far below coasting, m/s²… */
  brakeOn: number;
  /** …and stops when it is within this of coasting (hysteresis), m/s². */
  brakeOff: number;
  /** Lift four times faster, and apply the brake faster, when the request is this far below coasting, m/s². */
  urgentBrake: number;
  /** Brake application and release jerk limits, m/s³. */
  brakeJerk: number;
  releaseJerk: number;
  /** Minimum coasting time between brake release and throttle, s. */
  coastDwellS: number;
  /** Speed cap (cruise set speed): requested acceleration per m/s below the set speed, 1/s… */
  capGain: number;
  /** …and the most deceleration it asks for above the set speed, m/s² (gentle; a lead can ask for more). */
  capDecel: number;
}

export const AUTO_DRIVE_DEFAULTS: Readonly<AutoDriveParams> = {
  timeGapS: 2,
  standstillGapM: 5,
  liftDecel: 1.5,
  releaseDecel: 0.6,
  closingEndMs: 0.8,
  planClosingMs: 3,
  planDecel: 2.5,
  minTimeGapS: 1,
  comfortDecel: 3,
  gapGain: 0.06,
  speedGain: 0.4,
  gapTermMin: 1.2,
  resumeRate: 0.6,
  liftRate: 2,
  liftJerk: 8,
  trimBandwidth: 0.8,
  brakeOn: 0.4,
  brakeOff: 0.1,
  urgentBrake: 3,
  brakeJerk: 4,
  releaseJerk: 5,
  coastDwellS: 0.4,
  capGain: 0.4,
  capDecel: 0.8,
};

/** What the controller needs to know about the active car (derived from it, not tuned per car). */
export interface PlantModel {
  /** Deceleration per unit of brake pedal, m/s². */
  brakeDecelPerUnit: number;
  /** Road-load acceleration with the throttle closed (≤ 0), m/s². */
  coastAccel(speed: number): number;
  /** Rough acceleration per unit of throttle at a speed, m/s² (feedforward and trim scaling only). */
  throttleAuthority(speed: number): number;
}

function peakPowerW(v: SimVehicle): number {
  if (v.electric) return v.electric.systemPowerW;
  const e = v.engine;
  let best = 0;
  for (let rpm = e.idleRpm; rpm <= e.revLimitRpm; rpm += 50) best = Math.max(best, e.torque.at(rpm) * rpmToRadS(rpm));
  return best;
}

export function plantModel(v: SimVehicle): PlantModel {
  const mass = v.massKg + v.wheelInertiaKgM2 / (v.wheelRadiusM * v.wheelRadiusM);
  const wheelPowerW = peakPowerW(v) * v.drivetrain.efficiency;
  const grip = v.tireMu * GRAVITY;
  return {
    brakeDecelPerUnit: (Math.min(MAX_BRAKE_G, v.tireMu * 1.05) * v.massKg * GRAVITY) / mass,
    coastAccel: (speed) => -(aeroDragN(v, speed) + rollingResistanceN(v, speed)) / mass,
    throttleAuthority: (speed) => clamp(wheelPowerW / (v.massKg * Math.max(speed, 8)), 0.5, grip),
  };
}

export type AutoDriveMode = 'accelerating' | 'following' | 'cruising' | 'braking' | 'stopped';

/** Per-step options: a speed cap (cruise set speed) and whether the brake may be used. */
export interface ControlOptions {
  /** Maximum speed to target, m/s; null or absent = none (full throttle when nothing limits). */
  capMs?: number | null;
  /** Conventional cruise coasts instead of braking. Default true. */
  allowBrake?: boolean;
}

export interface EgoState {
  speed: number;
  /** Measured (filtered) acceleration, m/s². */
  accel: number;
}

export interface AutoDriveCommand {
  throttle: number;
  brake: number;
  mode: AutoDriveMode;
  /** Requested acceleration, m/s²; null when no lead limits the car (full throttle). */
  targetAccel: number | null;
  /** Closing on a slower lead under the approach plan. */
  approaching: boolean;
  /** What limits the request: the lead, the speed cap, or nothing (full throttle). */
  limiter: 'lead' | 'cap' | null;
}

export const IDLE_COMMAND: AutoDriveCommand = { throttle: 0, brake: 0, mode: 'accelerating', targetAccel: null, approaching: false, limiter: null };

export class AutoDriveController {
  readonly params: Readonly<AutoDriveParams>;
  readonly plant: PlantModel;
  private throttle = 0;
  private brake = 0;
  private braking = false;
  private approaching = false;
  private throttleTrim = 0;
  private brakeTrim = 0;
  private dwellS = 0;
  /** Engaged in a clear lane and not yet limited by a lead: request full throttle at once. */
  private fresh = true;
  private last: AutoDriveCommand = IDLE_COMMAND;

  constructor(plant: PlantModel, params: Readonly<AutoDriveParams> = AUTO_DRIVE_DEFAULTS) {
    this.plant = plant;
    this.params = params;
  }

  /** Start from the pedal positions the car already has (bumpless engagement). */
  engage(currentThrottle = 0): void {
    this.throttle = clamp(currentThrottle, 0, 1);
    this.brake = 0;
    this.braking = false;
    this.approaching = false;
    this.throttleTrim = 0;
    this.brakeTrim = 0;
    this.dwellS = 0;
    this.fresh = true;
    this.last = IDLE_COMMAND;
  }

  get command(): AutoDriveCommand {
    return this.last;
  }

  /** Throttle that holds a steady speed on this road (rough plant estimate). */
  holdThrottle(speed: number): number {
    return clamp(-this.plant.coastAccel(speed) / this.plant.throttleAuthority(speed), 0, 1);
  }

  /** Throttle fall rate for this car and speed, 1/s. */
  private liftRate(speed: number): number {
    return clamp(this.params.liftJerk / this.plant.throttleAuthority(speed), 0.6, this.params.liftRate);
  }

  /**
   * Gap policy: the requested acceleration for this lead, or null when it does
   * not limit the car. `lagS` is how long lifting off will take; the approach
   * starts early enough to allow for the closing speed gained meanwhile.
   */
  private target(ego: EgoState, lead: LeadInfo | null, lagS: number): number | null {
    const P = this.params;
    if (!lead) {
      this.approaching = false;
      return null;
    }
    const v = ego.speed;
    const vL = lead.speedMs;
    const s = lead.gapM;
    if (s <= 0.5) {
      this.approaching = false;
      return -Infinity;
    }
    const rel = vL - v; // < 0 while closing
    const desired = P.standstillGapM + P.timeGapS * v;
    const gapTerm = Math.max(P.gapGain * (s - desired), -P.gapTermMin);
    const following = Math.max(gapTerm + P.speedGain * rel, -P.comfortDecel);
    // Room to shed the closing speed before reaching the time gap, and the minimum gap, at the lead's speed.
    const roomDes = s - P.standstillGapM - P.timeGapS * vL;
    const roomMin = s - P.standstillGapM - P.minTimeGapS * vL;
    let target: number | null;
    const closingEnd = clamp(0.05 * v, 0.1, P.closingEndMs);
    if (rel < -closingEnd && roomMin > 0) {
      const needDes = roomDes > 0 ? (rel * rel) / (2 * roomDes) : Infinity;
      const needMin = (rel * rel) / (2 * roomMin);
      if (!this.approaching && rel < -P.planClosingMs) {
        // Closing and room expected once the throttle is closed.
        const relLag = rel - Math.max(0, ego.accel) * lagS;
        const roomLag = roomDes + relLag * lagS;
        if (roomLag <= 0 || (relLag * relLag) / (2 * roomLag) >= P.liftDecel) this.approaching = true;
      } else if (this.approaching && needDes < P.releaseDecel) {
        this.approaching = false;
      }
      if (this.approaching && roomDes > 0) target = -Math.max(Math.min(needDes, P.planDecel), needMin);
      else if (this.approaching) target = Math.min(following, -needMin);
      // Closing fast but still well beyond the time gap: full throttle until the approach starts.
      else if (rel < -P.planClosingMs && roomDes > 0 && s > 1.5 * desired) target = null;
      else target = following;
    } else {
      this.approaching = false;
      target = following;
    }
    if (rel < 0) {
      // Collision avoidance: never plan inside the standstill gap.
      const safe = (rel * rel) / (2 * Math.max(s - P.standstillGapM, 0.1));
      if (safe > P.comfortDecel) target = Math.min(target ?? Infinity, -safe);
    }
    // Inside the standstill gap and still rolling (e.g. creeping behind a crawling queue): come to a stop.
    if (s < P.standstillGapM && v > 0.05 && rel <= 0.5) target = Math.min(target ?? Infinity, -1.5);
    return target;
  }

  /**
   * One step. `lead` is null for conventional cruise (or a clear lane); with a
   * speed cap the request is the lower of the lead's and the cap's, so the
   * car slows for a slower lead and returns to the set speed when it leaves.
   */
  update(dt: number, ego: EgoState, lead: LeadInfo | null, opts: ControlOptions = {}): AutoDriveCommand {
    const P = this.params;
    const v = ego.speed;
    const coast = this.plant.coastAccel(v);
    const kB = this.plant.brakeDecelPerUnit;
    const allowBrake = opts.allowBrake ?? true;
    const liftRate = this.liftRate(v);
    const leadTarget = this.target(ego, lead, this.throttle / (2 * liftRate));
    const capTarget = opts.capMs === null || opts.capMs === undefined ? null : Math.max(P.capGain * (opts.capMs - v), -P.capDecel);
    let target: number | null = leadTarget;
    let limiter: AutoDriveCommand['limiter'] = leadTarget === null ? null : 'lead';
    if (capTarget !== null && (target === null || capTarget < target)) {
      target = capTarget;
      limiter = 'cap';
    }
    // A request for more than full throttle can give (lead far ahead or pulling away, well below the cap) does not limit the car.
    if (target !== null && !this.approaching && (target - coast) / this.plant.throttleAuthority(v) >= 1) {
      target = null;
      limiter = null;
    }
    const stopped = allowBrake && v < 0.3 && target !== null && target <= 0.05;

    let throttleTarget: number;
    let brakeTarget = 0;
    let urgent = false;
    if (target === null) {
      if (this.braking) this.dwellS = P.coastDwellS;
      this.braking = false;
      this.brakeTrim = 0;
      throttleTarget = 1;
    } else {
      this.fresh = false;
      const aDes = Math.max(target, -kB);
      urgent = aDes < coast - P.urgentBrake;
      // At walking pace idle creep can push the car on with the throttle closed: brake against it.
      const creeping = v < 5 && aDes < 0 && this.throttle <= 1e-3 && ego.accel > aDes + 0.25;
      const wantBrake = allowBrake && (stopped || creeping || aDes < coast - (this.braking ? P.brakeOff : P.brakeOn));
      if (wantBrake && !this.braking && this.throttle <= 1e-3) {
        this.braking = true;
        this.throttle = 0;
        this.throttleTrim = 0;
      } else if (!wantBrake && this.braking) {
        this.braking = false;
        this.brakeTrim = 0;
        this.dwellS = P.coastDwellS;
      }
      if (this.braking) {
        throttleTarget = 0;
        this.brakeTrim = clamp(this.brakeTrim + (P.trimBandwidth * (ego.accel - aDes) * dt) / kB, -0.1, 0.2);
        brakeTarget = clamp((coast - aDes) / kB + this.brakeTrim, 0, 1);
        if (stopped) brakeTarget = Math.max(brakeTarget, 0.35);
      } else {
        const g = this.plant.throttleAuthority(v);
        const ff = (aDes - coast) / g;
        const raw = ff + this.throttleTrim;
        // Integrate the trim only while it can still move the throttle (anti-windup).
        const err = aDes - ego.accel;
        if ((raw < 1 || err < 0) && (raw > 0 || err > 0)) {
          this.throttleTrim = clamp(this.throttleTrim + (P.trimBandwidth * err * dt) / g, -0.5, 0.5);
        }
        throttleTarget = clamp(ff + this.throttleTrim, 0, 1);
      }
    }

    // Pedal slew limits: never both pedals; brake off before the throttle comes back.
    if (this.dwellS > 0) this.dwellS = Math.max(0, this.dwellS - dt);
    if (stopped) this.throttle = Math.min(this.throttle, throttleTarget);
    if (this.braking || this.brake > 0) throttleTarget = 0;
    const brakeUp = ((urgent ? 4 : 1) * P.brakeJerk * dt) / kB;
    const brakeDown = (P.releaseJerk * dt) / kB;
    this.brake = clamp(this.brake + clamp(brakeTarget - this.brake, -brakeDown, brakeUp), 0, 1);
    if (this.fresh && target === null) {
      this.throttle = 1;
    } else if (throttleTarget > this.throttle) {
      if (this.dwellS === 0 && this.brake === 0) this.throttle = Math.min(throttleTarget, this.throttle + P.resumeRate * dt);
    } else {
      // At or over the set speed, close the throttle quickly so a SET made while accelerating hard does not overshoot.
      const atCap = limiter === 'cap' && opts.capMs !== null && opts.capMs !== undefined && v >= opts.capMs - 0.5;
      this.throttle = Math.max(throttleTarget, this.throttle - (urgent || atCap ? 4 : 1) * liftRate * dt);
    }

    let mode: AutoDriveMode;
    if (this.brake > 0.005) mode = v < 0.3 ? 'stopped' : 'braking';
    else if (target === null || (this.throttle >= 0.98 && !this.approaching)) mode = 'accelerating';
    else mode = limiter === 'cap' ? 'cruising' : 'following';
    this.last = {
      throttle: this.throttle,
      brake: this.brake,
      mode,
      targetAccel: target === null ? null : Math.max(target, -kB),
      approaching: this.approaching,
      limiter,
    };
    return this.last;
  }
}
