import { ATMOSPHERE_BAR, CLOSED_THROTTLE_MAP_BAR } from './constants';
import type { SimEngine } from './types';
import { clamp } from './units';

/**
 * Engine model.
 *
 * Torque is driven by intake manifold pressure (MAP). The full-load torque
 * curve is the steady-state output with the turbo fully spooled. At any
 * instant the engine produces
 *
 *   T = T_friction + f · (T_fullLoad(rpm) − T_friction),
 *   f = (MAP − MAP_closed) / (MAP_fullLoad(rpm) − MAP_closed)
 *
 * so the throttle acts as a torque request and turbo lag appears naturally
 * because MAP above atmospheric pressure follows its target with an
 * rpm-dependent spool time constant.
 */

/** Closed-throttle friction and pumping torque (negative). */
export function frictionTorque(engine: SimEngine, rpm: number): number {
  return -(engine.frictionBaseNm + (engine.frictionPerKrpmNm * Math.max(0, rpm)) / 1000);
}

/** Manifold pressure at full load with the turbo fully spooled, bar absolute. */
export function fullLoadManifold(engine: SimEngine, rpm: number): number {
  return ATMOSPHERE_BAR + Math.max(0, engine.boost.at(rpm));
}

/** Manifold pressure the ECU targets for a throttle position, bar absolute. */
export function targetManifold(engine: SimEngine, rpm: number, throttle: number): number {
  return CLOSED_THROTTLE_MAP_BAR + clamp(throttle, 0, 1) * (fullLoadManifold(engine, rpm) - CLOSED_THROTTLE_MAP_BAR);
}

/** Time constant for MAP filling the intake below atmospheric pressure (throttle body), s. */
const THROTTLE_FILL_TAU = 0.06;
/** Time constant for MAP decay when the throttle closes (blow-off valve), s. */
const BLOW_OFF_TAU = 0.1;

/** Advance manifold pressure one step (exact first-order response). */
export function stepManifold(engine: SimEngine, map: number, rpm: number, throttle: number, dt: number): number {
  const target = targetManifold(engine, rpm, throttle);
  let tau: number;
  if (target > map) {
    tau = map < ATMOSPHERE_BAR ? THROTTLE_FILL_TAU : engine.spoolTau.at(rpm);
  } else {
    tau = BLOW_OFF_TAU;
  }
  return target + (map - target) * Math.exp(-dt / tau);
}

/** Instantaneous crank torque, Nm. */
export function engineTorque(engine: SimEngine, rpm: number, map: number, fuelCut: boolean): number {
  const friction = frictionTorque(engine, rpm);
  if (fuelCut) return friction;
  const full = fullLoadManifold(engine, rpm);
  const fill = clamp((map - CLOSED_THROTTLE_MAP_BAR) / (full - CLOSED_THROTTLE_MAP_BAR), 0, 1);
  return friction + fill * (engine.torque.at(rpm) - friction);
}

/** Throttle the idle controller adds to hold idle speed. */
export function idleThrottle(engine: SimEngine, rpm: number): number {
  return clamp(0.1 + (engine.idleRpm - rpm) / 250, 0, 0.4);
}

/** Boost as shown on a gauge (gauge pressure, negative = vacuum), bar. */
export function manifoldToBoostGauge(map: number): number {
  return map - ATMOSPHERE_BAR;
}
