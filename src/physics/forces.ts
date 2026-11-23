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
    case 'AWD': {
      // The coupling can send at most `maxRearShare` of the force rearwards,
      // so the front axle must carry the rest.
      const frontShare = 1 - v.drivetrain.maxRearShare;
      return Math.min(mu * (front + rear), frontShare > 0 ? (mu * front) / frontShare : Infinity);
    }
  }
}
