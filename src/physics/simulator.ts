import { ATMOSPHERE_BAR, FIXED_DT, GRAVITY, MAX_BRAKE_G, TRACTION_CONTROL_EFFICIENCY } from './constants';
import { engineTorque, idleThrottle, stepManifold } from './engine';
import { aeroDragN, rollingResistanceN, tractionLimitN } from './forces';
import { autoShiftTarget, manualStallProtection, type ShiftContext } from './gearbox';
import { torqueConverterTorques } from './torqueConverter';
import type { DriverInput, ShiftMode, SimState, SimVehicle } from './types';
import { clamp, lerp, radSToRpm, rpmToRadS, smoothstep } from './units';

export interface ShiftRequestResult {
  ok: boolean;
  reason?: string;
}

const MIN_ENGINE_RPM = 300;

/** Manual / single-clutch shift: drive torque drops out while the clutch is open. */
function interruptFactor(p: number): number {
  if (p < 0.12) return 1 - p / 0.12;
  if (p > 0.8) return (p - 0.8) / 0.2;
  return 0;
}

export function initialState(vehicle: SimVehicle): SimState {
  return {
    time: 0,
    distance: 0,
    speed: 0,
    accel: 0,
    accelFiltered: 0,
    engineRpm: vehicle.engine.idleRpm,
    gear: 1,
    shift: null,
    coupling: 'slipping',
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

  constructor(vehicle: SimVehicle, shiftMode: ShiftMode = 'auto') {
    this.vehicle = vehicle;
    this.shiftMode = shiftMode;
    this.state = initialState(vehicle);
  }

  reset(): void {
    this.state = initialState(this.vehicle);
  }

  get gearCount(): number {
    return this.vehicle.transmission.overallRatios.length;
  }

  /** Gearbox input-shaft rpm for a gear at the current road speed. */
  inputRpmInGear(gear: number): number {
    const wheelOmega = this.state.speed / this.vehicle.wheelRadiusM;
    return radSToRpm(wheelOmega * this.vehicle.transmission.overallRatios[gear - 1]);
  }

  /** Manual paddle request. Downshifts are refused if they would over-rev the engine. */
  requestShift(direction: 1 | -1): ShiftRequestResult {
    const s = this.state;
    if (s.shift) return { ok: false, reason: 'Shift in progress' };
    const target = s.gear + direction;
    if (target < 1) return { ok: false, reason: 'Already in 1st' };
    if (target > this.gearCount) return { ok: false, reason: 'Already in top gear' };
    if (direction < 0 && this.inputRpmInGear(target) > this.vehicle.engine.revLimitRpm - 100) {
      return { ok: false, reason: 'Over-rev protection' };
    }
    this.startShift(target);
    return { ok: true };
  }

  private startShift(target: number): void {
    const s = this.state;
    const t = this.vehicle.transmission;
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

  /** Boost gauge reading, bar (negative = vacuum). */
  get boostBar(): number {
    return this.state.manifoldBar - ATMOSPHERE_BAR;
  }
}
