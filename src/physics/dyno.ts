import { aeroDragN, rollingResistanceN } from './forces';
import type { SimVehicle } from './types';
import { kmhToMs, msToKmh, powerKw, kwToPs } from './units';

export interface DynoPoint {
  rpm: number;
  torqueNm: number;
  powerPs: number;
  powerKw: number;
  wheelPowerPs: number;
  wheelTorqueNm: number;
  boostBar: number;
}

export interface DynoSheet {
  points: DynoPoint[];
  peakPowerPs: number;
  peakPowerRpm: number;
  peakTorqueNm: number;
  peakTorqueRpm: number;
  peakWheelPowerPs: number;
  peakWheelTorqueNm: number;
  peakBoostBar: number;
}

/**
 * Steady-state full-load dyno sheet. Crank figures come straight from the
 * (tuned) torque curve; wheel figures apply the drivetrain efficiency, like a
 * chassis dyno would measure.
 */
export function computeDyno(vehicle: SimVehicle, stepRpm = 50): DynoSheet {
  const e = vehicle.engine;
  const eta = vehicle.drivetrain.efficiency;
  const start = Math.ceil(Math.max(1000, e.idleRpm) / stepRpm) * stepRpm;
  const points: DynoPoint[] = [];
  for (let rpm = start; rpm <= e.revLimitRpm + 1e-9; rpm += stepRpm) {
    const torqueNm = e.torque.at(rpm);
    const kw = powerKw(torqueNm, rpm);
    points.push({
      rpm,
      torqueNm,
      powerKw: kw,
      powerPs: kwToPs(kw),
      wheelPowerPs: kwToPs(kw * eta),
      wheelTorqueNm: torqueNm * eta,
      boostBar: e.boost.at(rpm),
    });
  }
  let pp = points[0];
  let pt = points[0];
  for (const p of points) {
    if (p.powerPs > pp.powerPs) pp = p;
    if (p.torqueNm > pt.torqueNm + 1e-9) pt = p;
  }
  return {
    points,
    peakPowerPs: pp.powerPs,
    peakPowerRpm: pp.rpm,
    peakTorqueNm: pt.torqueNm,
    peakTorqueRpm: pt.rpm,
    peakWheelPowerPs: pp.wheelPowerPs,
    peakWheelTorqueNm: pt.wheelTorqueNm,
    peakBoostBar: Math.max(...points.map((p) => p.boostBar)),
  };
}

/** Speeds within this many km/h of each other are reported as a tie, not as one constraint beating the other. */
export const TOP_SPEED_TIE_KMH = 0.1;

/** What sets a car's top speed. */
export type TopSpeedConstraint = 'limiter' | 'rev-limit' | 'drag';

export interface TopSpeedBreakdown {
  /** Reachable top speed with the vehicle's limiter state, km/h. */
  kmh: number;
  /** Force- or gearing-limited top speed ignoring any limiter, km/h (resolved to 0.01 km/h). */
  unlimitedKmh: number;
  /** Active modelled limiter, km/h, or null when none is modelled or it is switched off. */
  limiterKmh: number | null;
  /**
   * The binding constraint: the limiter only when it sits more than the tie
   * tolerance below the force/gearing limit; otherwise the rev cut or the
   * force/road-load crossing in the gear that ends acceleration.
   */
  binding: TopSpeedConstraint;
  /** 1-based gear whose limit sets `unlimitedKmh`, and the gearbox's gear count. */
  gear: number;
  gearCount: number;
  /** A second constraint within {@link TOP_SPEED_TIE_KMH} of the binding one, or null. */
  tiedWith: TopSpeedConstraint | null;
}

const rpmAt = (v: SimVehicle, ratio: number, ms: number) => ((ms / v.wheelRadiusM) * ratio * 60) / (2 * Math.PI);
const roadLoadN = (v: SimVehicle, ms: number) => aeroDragN(v, ms) + rollingResistanceN(v, ms);

/** Net full-load force in one gear (wheel force − road load), or null outside the gear's idle–cut range. */
function netForceInGear(v: SimVehicle, ratio: number, ms: number): number | null {
  const rpm = rpmAt(v, ratio, ms);
  if (rpm > v.engine.revLimitRpm || rpm < v.engine.idleRpm) return null;
  return (v.engine.torque.at(rpm) * ratio * v.drivetrain.efficiency) / v.wheelRadiusM - roadLoadN(v, ms);
}

/** Gears (0-based) that still out-pull the road load at this speed. */
function pullingGears(v: SimVehicle, ms: number): number[] {
  const out: number[] = [];
  v.transmission.overallRatios.forEach((ratio, i) => {
    const net = netForceInGear(v, ratio, ms);
    if (net !== null && net > 0) out.push(i);
  });
  return out;
}

/**
 * Force/gearing-limited top speed and what ends it. Acceleration must be
 * continuous from low speed, so the first speed at which no gear out-pulls the
 * road load is the limit; it is located on a 0.5 km/h scan and then bisected to
 * 0.01 km/h. The gear that pulls just below the limit decides the cause: its
 * rev cut when the limit sits on that gear's cut speed, otherwise the
 * force/road-load crossing. A lower gear can set the limit when a stretched top
 * gear cannot pull at that speed.
 */
function forceGearingLimit(v: SimVehicle): { kmh: number; gear: number; binding: 'rev-limit' | 'drag'; tied: boolean } {
  // Start just above idle in the lowest gear (below that no gear is engaged).
  const lowest = Math.max(...v.transmission.overallRatios);
  const startKmh = msToKmh((v.engine.idleRpm * 1.001 * 2 * Math.PI * v.wheelRadiusM) / (60 * lowest));
  let lo = kmhToMs(startKmh);
  if (pullingGears(v, lo).length === 0) return { kmh: 0, gear: 1, binding: 'drag', tied: false };
  let hi = lo;
  for (let kmh = startKmh + 0.5; kmh <= 600; kmh += 0.5) {
    const ms = kmhToMs(kmh);
    if (pullingGears(v, ms).length === 0) {
      hi = ms;
      break;
    }
    lo = ms;
    hi = ms;
  }
  for (let i = 0; i < 40 && msToKmh(hi - lo) > 0.002; i++) {
    const mid = (lo + hi) / 2;
    if (pullingGears(v, mid).length > 0) lo = mid;
    else hi = mid;
  }
  const limitMs = lo;
  const gears = pullingGears(v, limitMs);
  const ratios = v.transmission.overallRatios;
  // Of the gears still pulling at the limit, the one that would carry on furthest.
  const revKmhOf = (i: number) => msToKmh((v.engine.revLimitRpm * 2 * Math.PI * v.wheelRadiusM) / (60 * ratios[i]));
  const g = gears.reduce((best, i) => (revKmhOf(i) > revKmhOf(best) ? i : best), gears[0]);
  const kmh = msToKmh(limitMs);
  const revKmh = revKmhOf(g);
  const atCut = revKmh - kmh <= 0.01;
  let tied: boolean;
  if (atCut) {
    // Hold the force at the cut constant and see how soon road load would have caught it.
    const cutMs = kmhToMs(revKmh);
    const forceAtCut = (v.engine.torque.at(v.engine.revLimitRpm) * ratios[g] * v.drivetrain.efficiency) / v.wheelRadiusM;
    tied = forceAtCut <= roadLoadN(v, kmhToMs(revKmh + TOP_SPEED_TIE_KMH)) && forceAtCut > roadLoadN(v, cutMs) - 1e-9;
  } else {
    tied = revKmh - kmh <= TOP_SPEED_TIE_KMH;
  }
  return { kmh: Math.round(kmh * 100) / 100, gear: g + 1, binding: atCut ? 'rev-limit' : 'drag', tied };
}

/**
 * Force/gearing-limited top speed (ignoring the limiter): the highest speed the
 * car can accelerate to continuously in some gear, to 0.01 km/h.
 */
export function theoreticalTopSpeedKmh(vehicle: SimVehicle): number {
  return forceGearingLimit(vehicle).kmh;
}

export function topSpeedBreakdown(vehicle: SimVehicle): TopSpeedBreakdown {
  const f = forceGearingLimit(vehicle);
  const limiterKmh = vehicle.speedLimitMs === null ? null : msToKmh(vehicle.speedLimitMs);
  const base = { unlimitedKmh: f.kmh, limiterKmh, gear: f.gear, gearCount: vehicle.transmission.overallRatios.length };
  const other: TopSpeedConstraint = f.binding === 'rev-limit' ? 'drag' : 'rev-limit';
  if (limiterKmh !== null && Math.abs(limiterKmh - f.kmh) <= TOP_SPEED_TIE_KMH) {
    return { ...base, kmh: Math.min(limiterKmh, f.kmh), binding: f.binding, tiedWith: 'limiter' };
  }
  if (limiterKmh !== null && limiterKmh < f.kmh) return { ...base, kmh: limiterKmh, binding: 'limiter', tiedWith: null };
  return { ...base, kmh: f.kmh, binding: f.binding, tiedWith: f.tied ? other : null };
}

/** Top speed reachable with the limiter state of the vehicle. */
export function topSpeedKmh(vehicle: SimVehicle): number {
  return topSpeedBreakdown(vehicle).kmh;
}
