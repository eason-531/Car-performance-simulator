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

/**
 * Drag-limited top speed (ignoring the limiter): the highest speed at which
 * full-load wheel force in the best gear still exceeds the road load.
 */
export function theoreticalTopSpeedKmh(vehicle: SimVehicle): number {
  const e = vehicle.engine;
  const t = vehicle.transmission;
  const r = vehicle.wheelRadiusM;
  let best = 0;
  for (let kmh = 20; kmh <= 400; kmh += 0.5) {
    const v = kmhToMs(kmh);
    let force = 0;
    for (const ratio of t.overallRatios) {
      const rpm = ((v / r) * ratio * 60) / (2 * Math.PI);
      if (rpm > e.revLimitRpm || rpm < e.idleRpm) continue;
      force = Math.max(force, (e.torque.at(rpm) * ratio * vehicle.drivetrain.efficiency) / r);
    }
    if (force > aeroDragN(vehicle, v) + rollingResistanceN(vehicle, v)) best = kmh;
  }
  return best;
}

/** Top speed reachable with the limiter state of the vehicle. */
export function topSpeedKmh(vehicle: SimVehicle): number {
  const drag = theoreticalTopSpeedKmh(vehicle);
  return vehicle.speedLimitMs === null ? drag : Math.min(drag, msToKmh(vehicle.speedLimitMs));
}
