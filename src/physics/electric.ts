import type { SimElectric, SimMotor, SimVehicle } from './types';
import { radSToRpm } from './units';

/** Output fades linearly to zero over the last 3 % of a motor's speed range. */
const FADE_FRACTION = 0.03;

export interface MotorOutput {
  axle: 'front' | 'rear';
  rpm: number;
  torqueNm: number;
  ratio: number;
}

export interface ElectricOutput {
  /** Wheel force each axle's motors deliver before tire limits, N. */
  front: number;
  rear: number;
  /** Mechanical motor output after the shared limits, W. */
  powerW: number;
  motors: MotorOutput[];
  /** Rotor inertia reflected to the wheels (Σ J·ratio²), kg·m². */
  reflectedInertiaKgM2: number;
}

/** Reduction a motor uses in the given 1-based gear (single-speed motors ignore the gear). */
export function motorRatio(m: SimMotor, gear: number, blendTo?: { gear: number; f: number }): number {
  const pick = (g: number) => m.reductions[Math.min(m.reductions.length, Math.max(1, g)) - 1];
  if (!blendTo || m.reductions.length < 2) return pick(gear);
  return pick(gear) + (pick(blendTo.gear) - pick(gear)) * blendTo.f;
}

/** Full-load torque of one motor at a shaft speed: peak torque to base speed, then constant power, fading at max speed. */
export function motorTorqueNm(m: SimMotor, omega: number): number {
  let t = m.peakTorqueNm;
  const rpm = radSToRpm(omega);
  if (omega > 0) {
    // Constant power, then (above the published band) power ∝ (band end ÷ speed)^exponent.
    const power = m.peakPowerEndRpm !== null && rpm > m.peakPowerEndRpm ? m.peakPowerW * (m.peakPowerEndRpm / rpm) ** m.peakPowerFadeExponent : m.peakPowerW;
    t = Math.min(t, power / omega);
  }
  const fadeStart = m.maxRpm * (1 - FADE_FRACTION);
  if (rpm >= m.maxRpm) return 0;
  if (rpm > fadeStart) t *= (m.maxRpm - rpm) / (m.maxRpm - fadeStart);
  return t;
}

/**
 * Motor torques and axle wheel forces at a road speed for a throttle position,
 * after the shared system torque and power limits (scaled evenly across motors).
 */
export function electricOutput(
  v: SimVehicle,
  el: SimElectric,
  speedMs: number,
  throttle: number,
  gear: number,
  options: { boosting?: boolean; blendTo?: { gear: number; f: number }; torqueFactor?: number } = {},
): ElectricOutput {
  const r = v.wheelRadiusM;
  const wheelOmega = speedMs / r;
  const motors: MotorOutput[] = el.motors.map((m) => {
    const ratio = motorRatio(m, gear, options.blendTo);
    const omega = wheelOmega * ratio;
    return { axle: m.axle, rpm: radSToRpm(omega), torqueNm: motorTorqueNm(m, omega) * throttle, ratio };
  });
  const boost = options.boosting && el.boost ? el.boost : null;
  const sysTorque = boost?.systemTorqueNm ?? el.systemTorqueNm;
  const sysPower = boost ? boost.systemPowerW : el.systemPowerW;
  let scale = 1;
  const torqueSum = motors.reduce((a, m) => a + m.torqueNm, 0);
  if (sysTorque !== null && torqueSum > sysTorque * throttle && torqueSum > 0) scale = Math.min(scale, (sysTorque * throttle) / torqueSum);
  const powerSum = motors.reduce((a, m) => a + m.torqueNm * ((m.rpm * 2 * Math.PI) / 60), 0) * scale;
  if (powerSum > sysPower * throttle && powerSum > 0) scale *= (sysPower * throttle) / powerSum;
  const tf = options.torqueFactor ?? 1;
  const out: ElectricOutput = { front: 0, rear: 0, powerW: 0, motors, reflectedInertiaKgM2: 0 };
  el.motors.forEach((m, i) => {
    const mo = motors[i];
    // Shift interruptions act on motor torque, so reported torque and power dip too.
    mo.torqueNm *= scale * tf;
    out[mo.axle] += (mo.torqueNm * mo.ratio * v.drivetrain.efficiency) / r;
    out.powerW += mo.torqueNm * ((mo.rpm * 2 * Math.PI) / 60);
    out.reflectedInertiaKgM2 += m.rotorInertiaKgM2 * mo.ratio * mo.ratio;
  });
  return out;
}

/** Highest reachable gear for the motors (two-speed axles count their gears). */
export function electricGearCount(el: SimElectric): number {
  return Math.max(...el.motors.map((m) => m.reductions.length));
}
