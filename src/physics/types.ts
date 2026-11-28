import type { CvtSpec, DriveLayout, TransmissionType } from '../data/types';
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
  /** Battery-electric drive (tuned); when present the simulator uses the electric path. */
  electric?: SimElectric;
  /** Hybrid motors added to the engine path. */
  hybrid?: SimHybrid;
}

export interface SimMotor {
  axle: 'front' | 'rear';
  peakPowerW: number;
  peakTorqueNm: number;
  maxRpm: number;
  /** End of the peak-power band, rpm (power ∝ (end/speed)^peakPowerFadeExponent above it), or null. */
  peakPowerEndRpm: number | null;
  peakPowerFadeExponent: number;
  reductions: readonly number[];
  upshiftMs: number | null;
  /** Rotor inertia reflected per unit ratio², kg·m². */
  rotorInertiaKgM2: number;
}

export interface SimHybridMotor {
  peakTorqueNm: number;
  peakPowerW: number;
  maxRpm: number;
}

/** Hybrid drive on the engine path (see HybridSpec). */
export interface SimHybrid {
  inputMotor: SimHybridMotor | null;
  axleMotors: readonly (SimHybridMotor & { axle: 'front' | 'rear'; reduction: number })[];
  systemPowerW: number;
  batteryPowerW: number;
  /** Axle-motor gear efficiency. */
  axleEfficiency: number;
}

export interface SimElectric {
  motors: readonly SimMotor[];
  systemPowerW: number;
  systemTorqueNm: number | null;
  boost: SimBoost | null;
  creep: boolean;
  /** Simulated stepped gearbox (Live Drive option), or null. */
  virtualShift: SimVirtualShift | null;
}

/**
 * Published temporary boost. `launch-control`: each brake-held launch fires it.
 * `driver`: fired by the boost button (VehicleSimulator.requestBoost), then
 * `recoveryS` before reuse; with `armed` (linked to launches) a brake-held
 * launch fires it too, at most once per `launchCooldownS`.
 */
export interface SimBoost {
  systemPowerW: number;
  systemTorqueNm: number | null;
  durationS: number;
  trigger: 'launch-control' | 'driver';
  armed: boolean;
  recoveryS: number;
  launchCooldownS: number;
}

export interface SimVirtualShift {
  label: string;
  idleRpm: number;
  redlineRpm: number;
  revLimitRpm: number;
  /** Virtual gearbox: overall ratios are virtual engine rpm per wheel rpm. */
  transmission: SimTransmission;
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
  /** Clutch torque allowed while creeping off the brake, Nm. */
  creepTorqueNm: number;
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
  /** Belt CVT ratio control; `overallRatios` then hold the simulated steps × final drive. */
  cvt?: CvtSpec;
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
  /**
   * True while a clutch-open (manual or single-clutch automated-manual) shift
   * has the clutch disengaged: drive torque ramps out over the first 12 % of
   * the shift, is zero in the middle and ramps back in over the last 20 %.
   */
  clutchOpen: boolean;
  /** Intake manifold pressure, bar absolute. */
  manifoldBar: number;
  engineTorqueNm: number;
  /** Net tractive force at the contact patches, N. */
  driveForceN: number;
  fuelCut: boolean;
  tractionLimited: boolean;
  speedLimited: boolean;
  /** Electric drive: motor output after shared limits, kW (0 for combustion cars). */
  motorPowerKw: number;
  /** Electric drive: seconds of published boost remaining (0 when inactive). */
  boostS: number;
  /** Electric drive: the boost has been used since the last reset. */
  boostUsed: boolean;
  /** Electric drive: seconds before a driver boost can be used again (0 = ready). */
  boostRecoveryS: number;
  /** Electric drive: seconds before a linked launch can fire the boost again (0 = ready). */
  launchCooldownS: number;
  /**
   * Electric drive: a launch-control hold (brake + full throttle at rest) is
   * ready to fire the launch boost on brake release. Lifting the accelerator
   * cancels it.
   */
  launchPrimed: boolean;
  throttle: number;
  brake: number;
  timeSinceShift: number;
  /** Manual: fraction of full clamp the driver has applied during a launch, 0..1. */
  clutchEngage: number;
  /** Continuous time spent on the rev limiter, s. */
  fuelCutTime: number;
  /** CVT: pulley ratio (before the final drive) and whether the step-shift program is running. */
  cvtRatio: number;
  cvtStepping: boolean;
}
