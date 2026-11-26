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
const msAtRpm = (v: SimVehicle, ratio: number, rpm: number) => (rpm * 2 * Math.PI * v.wheelRadiusM) / (60 * ratio);
const roadLoadN = (v: SimVehicle, ms: number) => aeroDragN(v, ms) + rollingResistanceN(v, ms);

/** Full-load wheel force minus road load in one gear, ignoring the gear's rpm window. */
function netForce(v: SimVehicle, ratio: number, ms: number): number {
  return (v.engine.torque.at(rpmAt(v, ratio, ms)) * ratio * v.drivetrain.efficiency) / v.wheelRadiusM - roadLoadN(v, ms);
}

/** Root of a decreasing-through-zero net force between lo (> 0) and hi (≤ 0). */
function lastPositive(v: SimVehicle, ratio: number, lo: number, hi: number): number {
  for (let i = 0; i < 60 && hi - lo > 1e-7; i++) {
    const mid = (lo + hi) / 2;
    if (netForce(v, ratio, mid) > 0) lo = mid;
    else hi = mid;
  }
  return lo;
}

/**
 * Force/gearing-limited top speed and what ends it, exactly for the model's
 * torque lookup. The full-load torque is linear between lookup-table samples
 * and road load is convex in speed, so between consecutive breakpoints (every
 * gear's torque samples and its idle and cut speeds) each gear's net force is
 * concave: positive at both ends means positive throughout, and a positive
 * stretch ends at a single root. Acceleration is continuous only while some
 * gear out-pulls the road load, so the limit is the end of the covered stretch
 * that starts at low speed; a dip of any width, however narrow, ends it. A
 * lower gear sets the limit when a stretched top gear cannot pull at that speed.
 */
function forceGearingLimit(v: SimVehicle): { kmh: number; gear: number; binding: 'rev-limit' | 'drag'; tied: boolean } {
  const ratios = v.transmission.overallRatios;
  const e = v.engine;
  const lowest = Math.max(...ratios);
  const startMs = msAtRpm(v, lowest, e.idleRpm * 1.001);
  const cuts = ratios.map((r) => msAtRpm(v, r, e.revLimitRpm));
  const idles = ratios.map((r) => msAtRpm(v, r, e.idleRpm));
  const speeds = new Set<number>([startMs, ...cuts, ...idles]);
  ratios.forEach((r) => {
    for (const rpm of e.torque.knotsWithin(e.idleRpm, e.revLimitRpm)) speeds.add(msAtRpm(v, r, rpm));
  });
  const xs = [...speeds].filter((x) => x >= startMs).sort((a, b) => a - b);
  const inWindow = (g: number, ms: number) => {
    const rpm = rpmAt(v, ratios[g], ms);
    return rpm >= e.idleRpm - 1e-6 && rpm <= e.revLimitRpm + 1e-6;
  };
  const result = (ms: number, g: number) => {
    const kmh = msToKmh(ms);
    const revKmh = msToKmh(cuts[g]);
    const atCut = revKmh - kmh <= 0.01;
    let tied: boolean;
    if (atCut) {
      // Hold the force at the cut constant and see how soon road load would have caught it.
      const forceAtCut = (e.torque.at(e.revLimitRpm) * ratios[g] * v.drivetrain.efficiency) / v.wheelRadiusM;
      tied = forceAtCut <= roadLoadN(v, kmhToMs(revKmh + TOP_SPEED_TIE_KMH));
    } else {
      tied = revKmh - kmh <= TOP_SPEED_TIE_KMH;
    }
    return { kmh: Math.round(kmh * 100) / 100, gear: g + 1, binding: (atCut ? 'rev-limit' : 'drag') as 'rev-limit' | 'drag', tied };
  };
  if (!ratios.some((r, g) => inWindow(g, startMs) && netForce(v, r, startMs) > 0)) return { kmh: 0, gear: 1, binding: 'drag', tied: false };

  let covered = startMs;
  let lastGear = ratios.indexOf(lowest);
  for (let i = 0; i + 1 < xs.length; i++) {
    const a = xs[i];
    const b = xs[i + 1];
    if (b - a < 1e-9) continue;
    const mid = (a + b) / 2;
    // Extend the covered stretch through [a, b] gear by gear.
    let extended = true;
    while (covered < b && extended) {
      extended = false;
      for (let g = 0; g < ratios.length; g++) {
        if (!inWindow(g, mid) || netForce(v, ratios[g], covered) <= 0) continue;
        const end = netForce(v, ratios[g], b) > 0 ? b : lastPositive(v, ratios[g], covered, b);
        if (end > covered + 1e-9 || (end === b && covered < b)) {
          covered = end;
          lastGear = g;
          extended = true;
        }
      }
    }
    if (covered < b) return result(covered, lastGear);
  }
  return result(covered, lastGear);
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
