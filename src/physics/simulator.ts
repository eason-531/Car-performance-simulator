import { ATMOSPHERE_BAR, FIXED_DT, GRAVITY, MAX_BRAKE_G, TRACTION_CONTROL_EFFICIENCY } from './constants';
import { engineTorque, idleThrottle, stepManifold } from './engine';
import { electricOutput } from './electric';
import { aeroDragN, axleLoads, rollingResistanceN, tractionLimitN } from './forces';
import { autoShiftTarget, manualStallProtection, type ShiftContext } from './gearbox';
import { torqueConverterTorques } from './torqueConverter';
import type { DriverInput, ShiftMode, SimElectric, SimState, SimVehicle } from './types';
import { clamp, lerp, radSToRpm, rpmToRadS, smoothstep } from './units';

export interface ShiftRequestResult {
  ok: boolean;
  reason?: string;
}

const MIN_ENGINE_RPM = 300;

/**
 * Manual / single-clutch shift envelope: drive torque ramps out over the first
 * 12 % of the shift as the clutch opens, is zero while it is open, and ramps
 * back in over the last 20 % as it re-engages.
 */
function interruptFactor(p: number): number {
  if (p < 0.12) return 1 - p / 0.12;
  if (p > 0.8) return (p - 0.8) / 0.2;
  return 0;
}

/**
 * Simulated shift on an electric car (N e-Shift): the controller pulls torque
 * down to 20 % over the first 15 % of the change and then restores it in one
 * step at the end — the "jolt" Hyundai describes.
 */
export function virtualShiftFactor(p: number): number {
  if (p >= 1) return 1;
  if (p < 0.15) return 1 - (0.8 * p) / 0.15;
  return 0.2;
}

export function initialState(vehicle: SimVehicle): SimState {
  return {
    time: 0,
    distance: 0,
    speed: 0,
    accel: 0,
    accelFiltered: 0,
    engineRpm: vehicle.electric ? 0 : vehicle.engine.idleRpm,
    gear: 1,
    shift: null,
    coupling: vehicle.electric ? 'locked' : 'slipping',
    clutchOpen: false,
    manifoldBar: 0.35,
    engineTorqueNm: 0,
    driveForceN: 0,
    fuelCut: false,
    tractionLimited: false,
    speedLimited: false,
    throttle: 0,
    brake: 0,
    timeSinceShift: 10,
    clutchEngage: 0,
    fuelCutTime: 0,
    motorPowerKw: 0,
    boostS: 0,
    boostUsed: false,
    launchPrimed: false,
  };
}

/**
 * Longitudinal vehicle simulator.
 *
 * Deterministic: advance it only with fixed time steps (FIXED_DT). The same
 * inputs always produce the same trajectory, independent of display frame rate.
 *
 * Each step:
 *  1. gearbox decisions (auto schedule or manual stall protection)
 *  2. shift progress (ratio blend + torque dip)
 *  3. throttle processing (speed limiter, idle control)
 *  4. manifold pressure → engine torque
 *  5. coupling: locked, torque converter slip, or launch-clutch slip
 *  6. wheel force, traction limit with weight transfer
 *  7. resistances (aero, rolling, brakes) and semi-implicit Euler integration
 */
export class VehicleSimulator {
  readonly vehicle: SimVehicle;
  shiftMode: ShiftMode;
  state: SimState;

  private virtualOn = false;

  constructor(vehicle: SimVehicle, shiftMode: ShiftMode = 'auto') {
    this.vehicle = vehicle;
    this.shiftMode = shiftMode;
    this.state = initialState(vehicle);
  }

  reset(): void {
    this.state = initialState(this.vehicle);
    if (this.virtualOn) this.state.engineRpm = this.vehicle.electric!.virtualShift!.idleRpm;
  }

  /** Whether an electric car's simulated stepped gearbox (e.g. N e-Shift) is in use. */
  get virtualShift(): boolean {
    return this.virtualOn;
  }

  /**
   * Switch an electric car's simulated stepped gearbox on or off (Live Drive only).
   * Switching on picks the virtual gear that keeps the virtual rpm under redline;
   * switching off returns to the real reduction. No-op for cars without one.
   */
  setVirtualShift(on: boolean): void {
    const vs = this.vehicle.electric?.virtualShift;
    const next = on && !!vs;
    if (next === this.virtualOn) return;
    this.virtualOn = next;
    const s = this.state;
    s.shift = null;
    s.timeSinceShift = 0;
    s.fuelCut = false;
    s.fuelCutTime = 0;
    if (!next || !vs) {
      s.gear = 1;
      return;
    }
    const n = vs.transmission.overallRatios.length;
    let g = 1;
    while (g < n && this.inputRpmInGear(g) > vs.redlineRpm * 0.95) g++;
    s.gear = g;
    s.engineRpm = Math.max(vs.idleRpm, this.inputRpmInGear(g));
  }

  /** The transmission the driver's gears refer to (virtual gears while simulated shifting is on). */
  private get gearbox() {
    return this.virtualOn ? this.vehicle.electric!.virtualShift!.transmission : this.vehicle.transmission;
  }

  get gearCount(): number {
    return this.gearbox.overallRatios.length;
  }

  /** Gearbox input-shaft rpm (virtual engine rpm while simulated shifting is on) for a gear at the current road speed. */
  inputRpmInGear(gear: number): number {
    const wheelOmega = this.state.speed / this.vehicle.wheelRadiusM;
    return radSToRpm(wheelOmega * this.gearbox.overallRatios[gear - 1]);
  }

  /** Manual paddle request. Downshifts are refused if they would over-rev the engine. */
  requestShift(direction: 1 | -1): ShiftRequestResult {
    const s = this.state;
    if (s.shift) return { ok: false, reason: 'Shift in progress' };
    const target = s.gear + direction;
    if (target < 1) return { ok: false, reason: 'Already in 1st' };
    if (target > this.gearCount) return { ok: false, reason: 'Already in top gear' };
    const limit = this.virtualOn ? this.vehicle.electric!.virtualShift!.revLimitRpm : this.vehicle.engine.revLimitRpm;
    if (direction < 0 && this.inputRpmInGear(target) > limit - 100) {
      return { ok: false, reason: 'Over-rev protection' };
    }
    this.startShift(target);
    return { ok: true };
  }

  private startShift(target: number): void {
    const s = this.state;
    const t = this.gearbox;
    const up = target > s.gear;
    const steps = Math.abs(target - s.gear);
    // Skip-shifts take a little longer than single steps.
    const base = up ? t.upshiftTimeS : t.downshiftTimeS;
    s.shift = { from: s.gear, to: target, elapsed: 0, duration: base * (1 + 0.15 * (steps - 1)) };
    s.gear = target;
    s.timeSinceShift = 0;
  }

  /** Run whole fixed steps covering `seconds`. */
  advance(seconds: number, input: DriverInput): void {
    const steps = Math.round(seconds / FIXED_DT);
    for (let i = 0; i < steps; i++) this.step(FIXED_DT, input);
  }

  step(dt: number, input: DriverInput): void {
    if (this.vehicle.electric) {
      this.stepElectric(dt, input);
      return;
    }
    const v = this.vehicle;
    const s = this.state;
    const e = v.engine;
    const tr = v.transmission;
    const r = v.wheelRadiusM;
    const throttleCmd = clamp(input.throttle, 0, 1);
    const brake = clamp(input.brake, 0, 1);
    const wheelOmega = s.speed / r;

    // 1. Gearbox decisions --------------------------------------------------
    s.timeSinceShift += dt;
    if (!s.shift) {
      if (s.speed < 0.8 && s.gear !== 1) {
        s.gear = 1; // come to rest in first
      } else {
        const ctx: ShiftContext = {
          gear: s.gear,
          inputRpm: radSToRpm(wheelOmega * tr.overallRatios[s.gear - 1]),
          throttle: throttleCmd,
          timeSinceShift: s.timeSinceShift,
          idleRpm: e.idleRpm,
        };
        let target = this.shiftMode === 'auto' ? autoShiftTarget(tr, ctx) : manualStallProtection(ctx);
        // TCU protection: if the engine has been held on the limiter (e.g. converter
        // slip in 1st), upshift rather than bounce indefinitely.
        if (this.shiftMode === 'auto' && target === null && s.fuelCutTime > 0.4 && s.gear < this.gearCount) target = s.gear + 1;
        if (target !== null && target !== s.gear) this.startShift(target);
      }
    }

    // 2. Shift progress ------------------------------------------------------
    let ratio = tr.overallRatios[s.gear - 1];
    let torqueFactor = 1;
    if (s.shift) {
      const sh = s.shift;
      sh.elapsed += dt;
      const p = Math.min(1, sh.elapsed / sh.duration);
      ratio = lerp(tr.overallRatios[sh.from - 1], tr.overallRatios[sh.to - 1], smoothstep(p));
      torqueFactor = tr.shiftProfile === 'interrupt' ? interruptFactor(p) : 1 - tr.shiftTorqueDip * Math.sin(Math.PI * p);
      if (p >= 1) s.shift = null;
    }
    s.clutchOpen = tr.shiftProfile === 'interrupt' && s.shift !== null && torqueFactor < 1;
    const inputOmega = wheelOmega * ratio;
    const inputRpm = radSToRpm(inputOmega);

    // 3. Throttle processing -----------------------------------------------
    let throttle = throttleCmd;
    s.speedLimited = false;
    if (v.speedLimitMs !== null) {
      const allowed = clamp((v.speedLimitMs - s.speed) / 0.4, 0, 1);
      if (throttle > allowed) {
        throttle = allowed;
        s.speedLimited = true;
      }
    }
    const stationaryHold = s.speed < 0.3 && brake > 0.2;
    const manual = tr.type === 'manual';
    if (manual && stationaryHold && s.coupling === 'slipping') {
      // Clutch pedal down on the brake: the driver holds the revs at the launch rpm.
      const holdRpm = lerp(e.idleRpm, tr.launchClutch!.brakeHoldRpmLimit, throttleCmd);
      throttle = Math.min(throttle, clamp((holdRpm - s.engineRpm) / 300, 0, 1));
    }
    throttle = Math.max(throttle, idleThrottle(e, s.engineRpm));

    // 4. Manifold pressure and engine torque -------------------------------
    s.manifoldBar = stepManifold(e, s.manifoldBar, s.engineRpm, throttle, dt);
    if (s.engineRpm >= e.revLimitRpm) s.fuelCut = true;
    else if (s.engineRpm < e.revLimitRpm - 150) s.fuelCut = false;
    s.fuelCutTime = s.fuelCut || s.engineRpm > e.revLimitRpm - 160 ? s.fuelCutTime + dt : 0;
    const engineT = engineTorque(e, s.engineRpm, s.manifoldBar, s.fuelCut);
    s.engineTorqueNm = engineT;

    // 5. Coupling ------------------------------------------------------------
    const engineOmega = rpmToRadS(s.engineRpm);
    let inputTorque: number;
    let engineCoupled = false;

    if (tr.torqueConverter) {
      const tc = tr.torqueConverter;
      if (s.coupling === 'slipping') {
        const sr = inputOmega / Math.max(engineOmega, 1);
        if (s.gear >= tc.lockupMinGear && !s.shift && sr > 0.9 && inputRpm > 1100) s.coupling = 'locked';
      } else if (s.gear < tc.lockupMinGear || inputRpm < 1000) {
        s.coupling = 'slipping';
      }
      if (s.coupling === 'locked') {
        engineCoupled = true;
        inputTorque = engineT;
      } else {
        const { pump, turbine } = torqueConverterTorques(tc, engineOmega, inputOmega);
        const nextOmega = engineOmega + ((engineT - pump) / e.inertiaKgM2) * dt;
        s.engineRpm = Math.max(MIN_ENGINE_RPM, radSToRpm(nextOmega));
        inputTorque = turbine;
      }
    } else {
      const lc = tr.launchClutch!;
      if (s.coupling === 'locked' && inputRpm < e.idleRpm * 0.9 && !s.shift) s.coupling = 'slipping';
      if (s.coupling === 'slipping') {
        const slip = engineOmega - inputOmega;
        // A manual driver squeezes the clutch in over `driverEngageS`; a TCU is instant.
        if (lc.driverEngageS > 0) {
          s.clutchEngage =
            throttleCmd < 0.02 || stationaryHold ? 0 : Math.min(1, s.clutchEngage + dt / lc.driverEngageS);
        } else {
          s.clutchEngage = 1;
        }
        let clutchT: number;
        if (slip <= 0) {
          clutchT = 0;
        } else if (throttleCmd < 0.02) {
          clutchT = brake > 0.05 || !lc.creep ? 0 : Math.min(lc.creepTorqueNm, slip * 2); // creep
        } else if (stationaryHold && manual) {
          clutchT = 0; // pedal down while pre-revving
        } else {
          const targetRpm = stationaryHold
            ? lerp(e.idleRpm, lc.brakeHoldRpmLimit, throttleCmd)
            : lerp(e.idleRpm, lc.launchRpm, throttleCmd ** 0.8);
          clutchT = clamp(
            engineT + 3 * (engineOmega - rpmToRadS(targetRpm)),
            0,
            lc.maxClutchTorqueNm * s.clutchEngage,
          );
        }
        const nextOmega = engineOmega + ((engineT - clutchT) / e.inertiaKgM2) * dt;
        s.engineRpm = Math.max(MIN_ENGINE_RPM, radSToRpm(nextOmega));
        inputTorque = clutchT;
        const synced = Math.abs(rpmToRadS(s.engineRpm) - inputOmega) < rpmToRadS(40) && inputRpm >= e.idleRpm;
        // Rolling faster than idle off-throttle: close the clutch for engine braking.
        const coasting = slip <= 0 && throttleCmd < 0.02 && inputRpm > e.idleRpm * 1.1;
        if (synced || coasting) s.coupling = 'locked';
      } else {
        engineCoupled = true;
        inputTorque = engineT;
      }
    }
    if (engineCoupled) s.engineRpm = Math.max(MIN_ENGINE_RPM, inputRpm);

    // 6. Wheel force and traction --------------------------------------------
    const eta = v.drivetrain.efficiency;
    const engineForce = (inputTorque * ratio * torqueFactor * (inputTorque >= 0 ? eta : 1 / eta)) / r;
    const tractionMax = tractionLimitN(v, s.accelFiltered) * TRACTION_CONTROL_EFFICIENCY;
    const driveForce = clamp(engineForce, -tractionMax, tractionMax);

    // 7. Resistances and integration ------------------------------------------
    const m = v.massKg;
    const brakeForce = brake * Math.min(MAX_BRAKE_G, v.tireMu * 1.05) * m * GRAVITY;
    const resist = aeroDragN(v, s.speed) + rollingResistanceN(v, s.speed) + brakeForce;
    const carMass = m + v.wheelInertiaKgM2 / (r * r);
    // A coupled engine's inertia, reflected through the gearing, is spun up by
    // the engine's own torque. With grip to spare it loads the car (engine-
    // limited); at the grip limit the surplus torque feeds it and only the tire
    // force moves the car (traction-limited). The binding limit is the smaller.
    const engineMass = carMass + (engineCoupled ? (e.inertiaKgM2 * ratio * ratio) / (r * r) : 0);
    const accelEngine = (engineForce - resist) / engineMass;
    const accelTraction = (driveForce - resist) / carMass;
    // Held on the brakes the wheels cannot spin, so traction control stays idle.
    s.tractionLimited = engineForce > tractionMax && accelTraction < accelEngine && !stationaryHold;

    let accel: number;
    if (s.speed <= 1e-6 && driveForce - resist <= 0) {
      accel = 0;
      s.speed = 0;
    } else {
      accel =
        engineForce > tractionMax
          ? Math.min(accelEngine, accelTraction)
          : engineForce < -tractionMax
            ? Math.max(accelEngine, accelTraction)
            : accelEngine;
      s.speed = Math.max(0, s.speed + accel * dt);
      if (s.speed === 0) accel = 0;
    }
    s.distance += s.speed * dt;
    s.accel = accel;
    s.accelFiltered += (accel - s.accelFiltered) * (1 - Math.exp(-dt / 0.12));
    s.driveForceN = driveForce;
    s.throttle = throttleCmd;
    s.brake = brake;
    s.time += dt;
  }

  /**
   * Battery-electric step: motors per axle (peak torque to base speed, then
   * constant power, fading at max speed), shared system torque/power limits with
   * any published boost, per-axle tire limits under weight transfer, creep, the
   * speed limiter and optional two-speed axles. No clutch, converter or idle.
   */
  private stepElectric(dt: number, input: DriverInput): void {
    const v = this.vehicle;
    const s = this.state;
    const el = v.electric!;
    const tr = v.transmission;
    const throttleCmd = clamp(input.throttle, 0, 1);
    const brake = clamp(input.brake, 0, 1);
    const twoSpeed = el.motors.find((m) => m.reductions.length > 1);
    const vs = this.virtualOn ? el.virtualShift : null;
    if (vs) {
      this.stepVirtualShift(dt, input, vs);
      return;
    }

    // 1. Two-speed axle schedule (first below the published change speed).
    s.timeSinceShift += dt;
    if (!s.shift && twoSpeed && twoSpeed.upshiftMs !== null) {
      if (s.speed < 0.8) s.gear = 1;
      else if (s.gear === 1 && s.speed >= twoSpeed.upshiftMs && this.shiftMode === 'auto') this.startShift(2);
      else if (s.gear === 2 && s.speed < twoSpeed.upshiftMs * 0.6 && this.shiftMode === 'auto' && throttleCmd > 0.5) this.startShift(1);
    }
    let torqueFactor = 1;
    let blendTo: { gear: number; f: number } | undefined;
    if (s.shift) {
      const sh = s.shift;
      sh.elapsed += dt;
      const p = Math.min(1, sh.elapsed / sh.duration);
      blendTo = { gear: sh.to, f: smoothstep(p) };
      torqueFactor = 1 - tr.shiftTorqueDip * Math.sin(Math.PI * p);
      if (p >= 1) s.shift = null;
    }
    const gearFrom = s.shift ? s.shift.from : s.gear;

    this.driveElectric(dt, input, throttleCmd, brake, gearFrom, blendTo, torqueFactor);
    const primary = this.lastElectric!.motors.find((mo) => mo.axle === 'rear') ?? this.lastElectric!.motors[0];
    s.engineRpm = primary.rpm;
    s.fuelCut = false;
    s.fuelCutTime = 0;
  }

  /**
   * Electric step with the simulated stepped gearbox (N e-Shift): the virtual
   * gear sets a virtual engine speed for the tach, shift lights and the hard
   * limiter; each change interrupts motor torque and restores it with a jolt.
   * The real single-speed reduction is unchanged.
   */
  private stepVirtualShift(dt: number, input: DriverInput, vs: NonNullable<SimElectric['virtualShift']>): void {
    const s = this.state;
    const vt = vs.transmission;
    const throttleCmd = clamp(input.throttle, 0, 1);
    const brake = clamp(input.brake, 0, 1);
    s.timeSinceShift += dt;
    if (!s.shift) {
      if (s.speed < 0.8 && s.gear !== 1) {
        s.gear = 1;
      } else {
        const ctx: ShiftContext = { gear: s.gear, inputRpm: this.inputRpmInGear(s.gear), throttle: throttleCmd, timeSinceShift: s.timeSinceShift, idleRpm: vs.idleRpm };
        let target = this.shiftMode === 'auto' ? autoShiftTarget(vt, ctx) : manualStallProtection(ctx);
        if (this.shiftMode === 'auto' && target === null && s.fuelCutTime > 0.4 && s.gear < this.gearCount) target = s.gear + 1;
        if (target !== null && target !== s.gear) this.startShift(target);
      }
    }
    let torqueFactor = 1;
    if (s.shift) {
      const sh = s.shift;
      sh.elapsed += dt;
      const p = Math.min(1, sh.elapsed / sh.duration);
      torqueFactor = virtualShiftFactor(p);
      if (p >= 1) s.shift = null;
    }
    // Hard limiter at the virtual rev limit (150 rpm hysteresis).
    const virtualRpm = this.inputRpmInGear(s.gear);
    if (virtualRpm >= vs.revLimitRpm) s.fuelCut = true;
    else if (virtualRpm < vs.revLimitRpm - 150) s.fuelCut = false;
    s.fuelCutTime = s.fuelCut || virtualRpm > vs.revLimitRpm - 160 ? s.fuelCutTime + dt : 0;
    this.driveElectric(dt, input, s.fuelCut ? 0 : throttleCmd, brake, 1, undefined, torqueFactor);
    s.engineRpm = Math.max(vs.idleRpm, virtualRpm);
    s.throttle = throttleCmd;
  }

  private lastElectric: ReturnType<typeof electricOutput> | null = null;

  /** Shared electric drive: speed limiter, boost, motor output, traction, creep and integration. */
  private driveElectric(
    dt: number,
    input: DriverInput,
    throttleCmd: number,
    brake: number,
    gearFrom: number,
    blendTo: { gear: number; f: number } | undefined,
    torqueFactor: number,
  ): void {
    const v = this.vehicle;
    const s = this.state;
    const el = v.electric!;
    const r = v.wheelRadiusM;

    // 2. Speed limiter.
    let throttle = throttleCmd;
    s.speedLimited = false;
    if (v.speedLimitMs !== null && s.speed > v.speedLimitMs - 0.5) {
      const allowed = clamp((v.speedLimitMs - s.speed) / 0.5, 0, 1);
      if (throttle > allowed) {
        throttle = allowed;
        s.speedLimited = true;
      }
    }
    const stationaryHold = s.speed < 0.3 && brake > 0.2;

    // 3. Published boost: launch-control boosts prime on a brake-held full-throttle
    // launch and fire on release; driver boosts fire when armed.
    if (el.boost) {
      if (el.boost.trigger === 'launch-control') {
        if (stationaryHold && throttle > 0.9) s.launchPrimed = true;
        else if (s.launchPrimed && !stationaryHold && throttle > 0.9 && !s.boostUsed) {
          s.boostS = el.boost.durationS;
          s.boostUsed = true;
          s.launchPrimed = false;
        }
      } else if (el.boost.armed && throttle > 0.9 && !s.boostUsed && s.boostS === 0) {
        s.boostS = el.boost.durationS;
        s.boostUsed = true;
      }
    }
    const boosting = s.boostS > 0;
    if (boosting) s.boostS = Math.max(0, s.boostS - dt);

    // 4. Motor output and per-axle traction.
    const out = electricOutput(v, el, s.speed, throttle, gearFrom, { boosting, blendTo, torqueFactor });
    const loads = axleLoads(v, s.accelFiltered);
    const mu = v.tireMu * TRACTION_CONTROL_EFFICIENCY;
    let front = Math.min(out.front, mu * loads.front);
    let rear = Math.min(out.rear, mu * loads.rear);
    s.tractionLimited = (front < out.front - 1e-6 || rear < out.rear - 1e-6) && !stationaryHold;
    // Creep off the brake at a walking pace, from whichever axle is driven.
    if (el.creep && throttleCmd < 0.02 && brake < 0.05 && s.speed < 2) {
      const creepN = v.massKg * 0.6 * (1 - s.speed / 2);
      if (el.motors.some((m) => m.axle === 'rear')) rear += creepN;
      else front += creepN;
    }
    const driveForce = stationaryHold ? 0 : front + rear;

    // 5. Resistances and integration.
    const m = v.massKg;
    const brakeForce = brake * Math.min(MAX_BRAKE_G, v.tireMu * 1.05) * m * GRAVITY;
    const resist = aeroDragN(v, s.speed) + rollingResistanceN(v, s.speed) + brakeForce;
    const mass = m + (v.wheelInertiaKgM2 + out.reflectedInertiaKgM2) / (r * r);
    let accel: number;
    if (s.speed <= 1e-6 && driveForce - resist <= 0) {
      accel = 0;
      s.speed = 0;
    } else {
      accel = (driveForce - resist) / mass;
      s.speed = Math.max(0, s.speed + accel * dt);
      if (s.speed === 0) accel = 0;
    }
    s.distance += s.speed * dt;
    s.accel = accel;
    s.accelFiltered += (accel - s.accelFiltered) * (1 - Math.exp(-dt / 0.12));
    const primary = out.motors.find((mo) => mo.axle === 'rear') ?? out.motors[0];
    s.engineTorqueNm = primary.torqueNm;
    s.motorPowerKw = out.powerW / 1000;
    s.coupling = 'locked';
    s.clutchOpen = false;
    s.manifoldBar = ATMOSPHERE_BAR;
    s.driveForceN = driveForce;
    s.throttle = clamp(input.throttle, 0, 1);
    s.brake = brake;
    s.time += dt;
    this.lastElectric = out;
  }

  /** Boost gauge reading, bar (negative = vacuum). */
  get boostBar(): number {
    return this.state.manifoldBar - ATMOSPHERE_BAR;
  }
}
