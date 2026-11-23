import type { DriveLayout, TransmissionType } from '../data/types';
import type { Curve } from './curve';

/**
 * A fully-resolved vehicle the physics engine can simulate: factory spec with
 * tuning applied, every value in SI units. Built by `buildSimVehicle()`.
 */
export interface SimVehicle {
  id: string;
  name: string;
  /** Home chart-colour slot of the owner's cars; -1 for every other car. */
  colorSlot: number;
  engine: SimEngine;
  transmission: SimTransmission;
  /** `frontShare`: feasible share of drive force on the front axle, [min, max]. */
  drivetrain: { layout: DriveLayout; efficiency: number; frontShare: readonly [number, number] };
  /** Test mass: curb + driver + tuning delta, kg. */
  massKg: number;
  frontWeightFraction: number;
  wheelbaseM: number;
  cgHeightM: number;
  /** Drag coefficient × frontal area, m². */
  dragAreaM2: number;
  /** Dynamic rolling radius of the driven wheels, m. */
  wheelRadiusM: number;
  /** Total rotating inertia of all four wheels, kg·m². */
  wheelInertiaKgM2: number;
  /** Effective peak longitudinal friction of the driven tires. */
  tireMu: number;
  rollingResistance: number;
  speedLimitMs: number | null;
}

export interface SimEngine {
  idleRpm: number;
  redlineRpm: number;
  revLimitRpm: number;
  /** Full-load steady-state crank torque vs rpm (tuned). */
  torque: Curve;
  /** Full-load steady-state boost vs rpm, gauge bar (tuned). */
  boost: Curve;
  spoolTau: Curve;
  inertiaKgM2: number;
  frictionBaseNm: number;
  frictionPerKrpmNm: number;
}

export interface SimTorqueConverter {
  stallRpm: number;
  stallTorqueRatio: number;
  couplingSpeedRatio: number;
  lockupMinGear: number;
  /** Pump capacity factor at stall: T = C·ω², Nm/(rad/s)². */
  capacityAtStall: number;
}

export interface SimLaunchClutch {
  launchRpm: number;
  brakeHoldRpmLimit: number;
  maxClutchTorqueNm: number;
  creep: boolean;
  /** Seconds for the driver to fully engage the clutch at launch; 0 = instant (TCU). */
  driverEngageS: number;
}

export interface SimTransmission {
  type: TransmissionType;
  gearRatios: number[];
  finalDrive: number[];
  /** gearRatio × finalDrive per gear. */
  overallRatios: number[];
  upshiftTimeS: number;
  downshiftTimeS: number;
  shiftTorqueDip: number;
  shiftProfile: 'blend' | 'interrupt';
  maxAutoUpshiftRpm: number;
  /** Best full-throttle upshift rpm per gear (last gear: rev limit). */
  wotUpshiftRpm: number[];
  torqueConverter?: SimTorqueConverter;
  launchClutch?: SimLaunchClutch;
}

export interface DriverInput {
  /** 0..1 accelerator pedal. */
  throttle: number;
  /** 0..1 brake pedal. */
  brake: number;
}

export type ShiftMode = 'auto' | 'manual';

export interface ShiftState {
  from: number;
  to: number;
  elapsed: number;
  duration: number;
}

export type CouplingState = 'locked' | 'slipping';

export interface SimState {
  time: number;
  /** Distance travelled, m. */
  distance: number;
  /** Vehicle speed, m/s. */
  speed: number;
  /** Longitudinal acceleration, m/s². */
  accel: number;
  /** Low-pass-filtered acceleration used for weight transfer and the g-meter. */
  accelFiltered: number;
  engineRpm: number;
  /** 1-based gear currently engaged (the target gear while a shift completes). */
  gear: number;
  shift: ShiftState | null;
  coupling: CouplingState;
  /** Intake manifold pressure, bar absolute. */
  manifoldBar: number;
  engineTorqueNm: number;
  /** Net tractive force at the contact patches, N. */
  driveForceN: number;
  fuelCut: boolean;
  tractionLimited: boolean;
  speedLimited: boolean;
  throttle: number;
  brake: number;
  timeSinceShift: number;
  /** Manual: fraction of full clamp the driver has applied during a launch, 0..1. */
  clutchEngage: number;
}
