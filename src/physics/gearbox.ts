import type { Curve } from './curve';
import type { SimTransmission } from './types';
import { lerp } from './units';

/**
 * Gearbox helpers and the automatic shift schedule (TCU logic).
 */

/** Engine-side rpm of the gearbox input shaft for a wheel speed. */
export function inputRpmFromWheel(wheelRpm: number, transmission: SimTransmission, gear: number): number {
  return wheelRpm * transmission.overallRatios[gear - 1];
}

/**
 * Best full-throttle upshift points: for each gear, the rpm at which the wheel
 * force available in the next gear (at the same road speed) catches up with
 * the current gear. Falls back to the TCU's maximum upshift rpm.
 */
export function computeWotUpshiftRpms(
  torque: Curve,
  overallRatios: readonly number[],
  maxAutoUpshiftRpm: number,
  revLimitRpm: number,
): number[] {
  const result: number[] = [];
  for (let g = 0; g < overallRatios.length - 1; g++) {
    const current = overallRatios[g];
    const next = overallRatios[g + 1];
    let shiftRpm = maxAutoUpshiftRpm;
    for (let rpm = 2500; rpm <= maxAutoUpshiftRpm; rpm += 10) {
      const nextRpm = (rpm * next) / current;
      if (torque.at(nextRpm) * next >= torque.at(rpm) * current) {
        shiftRpm = rpm;
        break;
      }
    }
    result.push(shiftRpm);
  }
  result.push(revLimitRpm);
  return result;
}

export interface ShiftContext {
  gear: number;
  /** Input-shaft rpm in the current gear (from road speed). */
  inputRpm: number;
  throttle: number;
  timeSinceShift: number;
  idleRpm: number;
}

const PART_THROTTLE_UPSHIFT_RPM = 1700;
const MIN_RPM_AFTER_UPSHIFT = 1050;
const COAST_DOWNSHIFT_RPM = 1100;
const WOT_DOWNSHIFT_RPM = 3300;

function upshiftRpm(t: SimTransmission, gear: number, throttle: number): number {
  const wot = t.wotUpshiftRpm[gear - 1];
  if (throttle >= 0.9) return wot;
  return lerp(PART_THROTTLE_UPSHIFT_RPM, wot, (throttle / 0.9) ** 1.6);
}

/**
 * Automatic-mode shift decision. Returns the gear to shift to, or null.
 * Includes multi-gear kickdown at full throttle.
 */
export function autoShiftTarget(t: SimTransmission, ctx: ShiftContext): number | null {
  const n = t.overallRatios.length;
  const { gear, inputRpm, throttle, timeSinceShift } = ctx;
  const rpmIn = (g: number) => (inputRpm * t.overallRatios[g - 1]) / t.overallRatios[gear - 1];

  if (gear < n && timeSinceShift > 0.25) {
    if (inputRpm >= upshiftRpm(t, gear, throttle) && rpmIn(gear + 1) >= MIN_RPM_AFTER_UPSHIFT) return gear + 1;
  }

  if (gear > 1) {
    if (throttle >= 0.85 && timeSinceShift > 0.4) {
      for (let g = 1; g < gear; g++) {
        if (rpmIn(g) < t.wotUpshiftRpm[g - 1] * 0.9) return g;
      }
    }
    const cooldown = throttle < 0.05 ? 0.2 : 0.4;
    if (timeSinceShift > cooldown) {
      const downRpm = lerp(COAST_DOWNSHIFT_RPM, WOT_DOWNSHIFT_RPM, throttle ** 1.5);
      if (inputRpm < downRpm && rpmIn(gear - 1) < upshiftRpm(t, gear - 1, throttle) * 0.9) return gear - 1;
    }
  }
  return null;
}

/** Manual-mode safety: downshift automatically before the engine would lug below idle. */
export function manualStallProtection(ctx: ShiftContext): number | null {
  if (ctx.gear > 1 && ctx.inputRpm < ctx.idleRpm * 1.05 && ctx.timeSinceShift > 0.2) return ctx.gear - 1;
  return null;
}
