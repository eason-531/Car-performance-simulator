import { AIR_DENSITY, GRAVITY } from './constants';
import type { SimVehicle } from './types';
import { msToKmh } from './units';

/** Aerodynamic drag, N. */
export function aeroDragN(v: SimVehicle, speedMs: number): number {
  return 0.5 * AIR_DENSITY * v.dragAreaM2 * speedMs * speedMs;
}

/** Speed-dependent rolling resistance coefficient. */
export function rollingResistanceCoefficient(v: SimVehicle, speedMs: number): number {
  const k = msToKmh(speedMs) / 100;
  return v.rollingResistance + 0.0015 * k * k;
}

/** Rolling resistance force, N. */
export function rollingResistanceN(v: SimVehicle, speedMs: number): number {
  return rollingResistanceCoefficient(v, speedMs) * v.massKg * GRAVITY;
}

/** Axle normal loads including longitudinal weight transfer, N. */
export function axleLoads(v: SimVehicle, accel: number): { front: number; rear: number } {
  const weight = v.massKg * GRAVITY;
  const transfer = (v.massKg * accel * v.cgHeightM) / v.wheelbaseM;
  return {
    front: Math.max(0, weight * v.frontWeightFraction - transfer),
    rear: Math.max(0, weight * (1 - v.frontWeightFraction) + transfer),
  };
}

/** Maximum tractive force the driven tires can transmit, N. */
export function tractionLimitN(v: SimVehicle, accel: number): number {
  const { front, rear } = axleLoads(v, accel);
  const mu = v.tireMu;
  switch (v.drivetrain.layout) {
    case 'RWD':
      return mu * rear;
    case 'FWD':
      return mu * front;
    case 'AWD':
    case '4WD':
      return splitTractionLimit(mu * front, mu * rear, v.drivetrain.frontShare);
  }
}

/**
 * Best total force when the front share s of drive force can be chosen within
 * [min, max]: F(s) = min(Ff/s, Fr/(1−s)). The unconstrained optimum is
 * s* = Ff/(Ff+Fr) (both axles at their limit); otherwise the nearest bound.
 */
export function splitTractionLimit(frontMax: number, rearMax: number, range: readonly [number, number]): number {
  const total = frontMax + rearMax;
  if (total <= 0) return 0;
  const s = Math.min(range[1], Math.max(range[0], frontMax / total));
  if (s <= 0) return rearMax;
  if (s >= 1) return frontMax;
  return Math.min(frontMax / s, rearMax / (1 - s));
}
