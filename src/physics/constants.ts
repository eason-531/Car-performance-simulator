/** Physical constants and simulation settings shared by the whole engine. */

/** Fixed physics time step, seconds. Every simulation (live or headless) uses it. */
export const FIXED_DT = 0.001;

export const GRAVITY = 9.80665;
/** Air density at 20 °C, sea level, kg/m³. */
export const AIR_DENSITY = 1.204;
/** Standard atmosphere, bar absolute. */
export const ATMOSPHERE_BAR = 1.013;
/** Intake manifold pressure at closed throttle, bar absolute. */
export const CLOSED_THROTTLE_MAP_BAR = 0.3;
/** Mass of the driver added to every simulation, kg. */
export const DRIVER_MASS_KG = 75;
/** Fraction of peak tire friction that traction control actually exploits. */
export const TRACTION_CONTROL_EFFICIENCY = 0.95;
/** Maximum braking deceleration the brake system can request, in g. */
export const MAX_BRAKE_G = 1.1;

/** Dual-clutch creep: clutch torque the TCU allows off the brake at idle, Nm. */
export const DEFAULT_CREEP_TORQUE_NM = 25;
