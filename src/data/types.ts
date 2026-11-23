/**
 * Vehicle database types.
 *
 * A `VehicleSpec` describes a car exactly as delivered from the factory. It is
 * pure data: the physics engine never reads it directly. Instead
 * `buildSimVehicle()` (src/tuning/buildSimVehicle.ts) combines a spec with a
 * `TuningConfig` and resolves everything into a flat `SimVehicle`.
 *
 * To add a vehicle: create a new file in `src/data/vehicles/`, export a
 * `VehicleSpec`, and register it in `src/data/vehicles/index.ts`.
 */

/** How confident we are in a published parameter. */
export type DataStatus = 'verified' | 'reported' | 'estimated';

export interface Provenance {
  /** Human-readable parameter name, e.g. "Peak power". */
  parameter: string;
  /** Human-readable value, e.g. "245 PS @ 5,800 rpm". */
  value: string;
  status: DataStatus;
  /** Where the number comes from, or the reasoning behind an estimate. */
  source: string;
}

/** A curve as `[x, y]` control points, sorted by x (e.g. `[rpm, Nm]`). */
export type CurvePoints = ReadonlyArray<readonly [number, number]>;

export interface EngineSpec {
  code: string;
  description: string;
  displacementCc: number;
  idleRpm: number;
  redlineRpm: number;
  /** Fuel cut. */
  revLimitRpm: number;
  /** Full-load, steady-state (turbo fully spooled) crank torque. */
  torqueCurveNm: CurvePoints;
  /** Full-load, steady-state boost pressure, gauge bar. */
  boostCurveBar: CurvePoints;
  /** First-order turbo spool time constant (s) versus rpm. */
  spoolTimeConstantS: CurvePoints;
  /** Rotating inertia of crank, flywheel / flexplate and clutch or converter pump, kg·m². */
  inertiaKgM2: number;
  /** Closed-throttle friction + pumping torque: base + perKrpm * rpm/1000 (Nm, positive number). */
  friction: { baseNm: number; perKrpmNm: number };
  rated: {
    powerPs: number;
    powerRpm: readonly [number, number];
    torqueNm: number;
    torqueRpm: readonly [number, number];
  };
}

export type TransmissionType = 'torque-converter-automatic' | 'dual-clutch';

export interface TorqueConverterSpec {
  /** Stall speed at full throttle, rpm. */
  stallRpm: number;
  /** Torque multiplication at stall. */
  stallTorqueRatio: number;
  /** Speed ratio at which multiplication ends (coupling point). */
  couplingSpeedRatio: number;
  /** Lowest gear in which the lock-up clutch may engage. */
  lockupMinGear: number;
}

export interface LaunchClutchSpec {
  /** Engine speed the TCU targets while slipping the clutch at full throttle. */
  launchRpm: number;
  /** Engine speed limit while the brake is held at standstill (brake boosting). */
  brakeHoldRpmLimit: number;
  /** Maximum torque the clutch pack can transmit, Nm. */
  maxClutchTorqueNm: number;
}

export interface TransmissionSpec {
  type: TransmissionType;
  name: string;
  /** Gear ratios, 1st gear first. */
  gearRatios: readonly number[];
  /** Final drive per gear (dual-clutch boxes can have two output shafts). Same length as gearRatios. */
  finalDrive: readonly number[];
  /** Time for a full-throttle upshift (torque phase + inertia phase), s. */
  upshiftTimeS: number;
  downshiftTimeS: number;
  /** Peak depth of the torque reduction during a shift, 0..1. */
  shiftTorqueDip: number;
  /** Highest rpm at which the TCU upshifts at full throttle in automatic mode. */
  maxAutoUpshiftRpm: number;
  /** Rated input torque of the gearbox (used for tuning warnings). */
  ratedInputTorqueNm: number;
  torqueConverter?: TorqueConverterSpec;
  launchClutch?: LaunchClutchSpec;
}

export type DriveLayout = 'RWD' | 'FWD' | 'AWD';

export interface DrivetrainSpec {
  layout: DriveLayout;
  description: string;
  /** Crank-to-wheel mechanical efficiency with the converter locked / clutch closed. */
  efficiency: number;
  /** AWD only: maximum share of drive force that can be sent to the rear axle. */
  maxRearShare?: number;
}

export interface ChassisSpec {
  /** Curb mass without driver, kg. */
  curbMassKg: number;
  frontWeightFraction: number;
  wheelbaseM: number;
  cgHeightM: number;
  lengthMm: number;
  widthMm: number;
  heightMm: number;
}

export interface AeroSpec {
  dragCoefficient: number;
  frontalAreaM2: number;
}

export interface TireDims {
  widthMm: number;
  aspectPct: number;
  rimIn: number;
}

export interface TireSizeOption {
  id: string;
  label: string;
  front: TireDims;
  rear: TireDims;
  /** Wheel + tire + brake rotor inertia per corner, kg·m². */
  wheelInertiaKgM2: number;
  note?: string;
}

export interface StageTune {
  label: string;
  description: string;
  /** Multiplier applied to the stock torque curve versus rpm. */
  torqueMultiplier: CurvePoints;
  /** Boost added to the stock boost curve versus rpm, bar. */
  boostAddBar: CurvePoints;
  /** Headline figures typically advertised for this stage (estimates). */
  claimedPowerPs: number;
  claimedTorqueNm: number;
  /** Multiplier on shift times (e.g. a TCU tune). */
  shiftTimeScale?: number;
}

export interface Benchmark {
  label: string;
  value: string;
  source: string;
  kind: 'factory' | 'measured';
}

export interface VehicleSpec {
  id: string;
  make: string;
  model: string;
  variant: string;
  modelYear: number;
  market: string;
  /** Short label for tight UI. */
  shortName: string;
  /** Categorical series slot (0-based) — fixed per vehicle so colour follows the car. */
  colorSlot: number;
  engine: EngineSpec;
  transmission: TransmissionSpec;
  drivetrain: DrivetrainSpec;
  chassis: ChassisSpec;
  aero: AeroSpec;
  tires: {
    sizes: readonly TireSizeOption[];
    defaultSizeId: string;
    defaultCompoundId: string;
  };
  /** Electronic top-speed limiter, km/h (null = none). */
  speedLimiterKmh: number | null;
  factory: { zeroTo100S: number; topSpeedKmh: number };
  benchmarks: readonly Benchmark[];
  stage1: StageTune;
  provenance: readonly Provenance[];
  notes: readonly string[];
}

export interface TireCompound {
  id: string;
  label: string;
  description: string;
  /** Peak longitudinal friction coefficient on dry asphalt. */
  mu: number;
  /** Rolling resistance coefficient at low speed. */
  rollingResistance: number;
}
