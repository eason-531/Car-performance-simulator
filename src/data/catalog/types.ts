import type { DataStatus, DriveLayout, VehicleSpec } from '../types';

/**
 * Catalog types. Every car the app knows about is a `CatalogEntry`: identity,
 * classification, sources and published benchmarks. Cars the physics model
 * can run also carry a `sim` VehicleSpec (the single source of truth for the
 * simulation). Cars it cannot run stay browsable with `unsupportedReason`.
 */

/** Parent manufacturer origin (Acura/Lexus → Japan, etc.). */
export type Origin =
  | 'Japan'
  | 'Germany'
  | 'South Korea'
  | 'United States'
  | 'Italy'
  | 'France'
  | 'United Kingdom'
  | 'Sweden'
  | 'Czechia';

/** Specification market (country/region the configuration was sold in). */
export type Market = 'US' | 'UK' | 'DE' | 'IT' | 'TW' | 'EU';

export const MARKET_LABEL: Record<Market, string> = {
  US: 'United States',
  UK: 'United Kingdom',
  DE: 'Germany',
  IT: 'Italy',
  TW: 'Taiwan',
  EU: 'Europe',
};

export type BodyStyle =
  | 'Sedan'
  | 'Hatchback'
  | 'Liftback'
  | 'Wagon'
  | 'Coupe'
  | 'Convertible'
  | 'SUV'
  | 'Crossover'
  | 'Pickup';

export type UsageTag =
  | 'Daily'
  | 'Sport Compact'
  | 'Hot Hatch'
  | 'Sport Sedan'
  | 'Luxury'
  | 'Grand Tourer'
  | 'Sports Car'
  | 'Track'
  | 'Muscle'
  | 'Wagon'
  | 'SUV'
  | 'Off-road'
  | 'Supercar'
  | 'Hypercar'
  | 'Pickup';

export type TransmissionKind = 'AT' | 'DCT' | 'MT' | 'CVT' | 'e-CVT' | 'AMT' | 'MCT' | 'Direct drive' | 'Two-speed';

export type Powertrain = 'Petrol' | 'Hybrid' | 'Plug-in hybrid' | 'Electric';

/** Which physics path the configuration needs (roster column). */
export type ModelPath = 'Owner' | 'Existing' | 'MT' | 'CVT' | 'Hybrid' | 'MCT' | '4WD' | 'AMT' | 'EV';

export type Era = '1990s' | '2000s' | '2010s' | '2020s';

export interface SourceRef {
  id: string;
  title: string;
  publisher: string;
  url?: string;
  kind: 'road-test' | 'manufacturer' | 'reference' | 'owner';
  /** Publication date (YYYY or YYYY-MM) where known. */
  date?: string;
}

/**
 * How a published time was started.
 * - `rollout-1ft`: clock starts after ~1 ft of travel (US magazines since late 2019; MotorTrend)
 * - `standing-start`: clock starts at first motion / brake release (European tests)
 * - `drag-strip`: timing-light ET with staging rollout and no reaction time
 * - `unconfirmed`: procedure not confirmed for this publication/date
 */
export type PublishedTiming = 'rollout-1ft' | 'standing-start' | 'drag-strip' | 'unconfirmed';

/** Raw published results in the publication's own units. Missing = not published. */
export interface PublishedResults {
  zeroTo30MphS?: number;
  zeroTo60MphS?: number;
  zeroTo100MphS?: number;
  zeroTo130MphS?: number;
  zeroTo150MphS?: number;
  zeroTo100KmhS?: number;
  zeroTo160KmhS?: number;
  zeroTo180KmhS?: number;
  zeroTo200KmhS?: number;
  quarterMileS?: number;
  quarterMileTrapMph?: number;
  quarterMileTrapKmh?: number;
  kilometerS?: number;
  kilometerTrapKmh?: number;
  /** Standing 400 m (European tests), kept separate from the quarter mile (402.3 m). */
  metres400S?: number;
  metres400TrapKmh?: number;
  topSpeedMph?: number;
  topSpeedKmh?: number;
  /**
   * What the published top speed is (e.g. "governed limit; Car and Driver
   * estimate, not measured"), so a governed or claimed figure is never read as
   * a measured or simulated one.
   */
  topSpeedNote?: string;
  /** Rollout time reported separately by the publication, s. */
  rolloutS?: number;
}

export interface TestConditions {
  surface?: string;
  weather?: string;
  temperatureC?: number;
  testMass?: string;
  occupants?: string;
  fuel?: string;
  driveMode?: string;
  launchControl?: string;
  tires?: string;
  other?: string[];
}

export interface MeasuredBenchmark {
  id: string;
  sourceId: string;
  /** Publication label, e.g. "Car and Driver". */
  publication: string;
  /** Test (publication) date — distinct from the car's model year. */
  date?: string;
  timing: PublishedTiming;
  /** Why this timing basis was assigned. */
  timingNote: string;
  results: PublishedResults;
  conditions: TestConditions;
  /**
   * `exact`: the tested car matches this configuration.
   * `equivalent`: a close configuration — documented in `deviation`.
   */
  match: 'exact' | 'equivalent';
  /** Test-specific deviations from the stock identity (missing wing, prepped strip, …). */
  deviation?: string;
  /** Where the numbers were read from in this session (search summary, spec box, PDF…). */
  verification: string;
}

/** Owner-only metadata for the user's own cars. */
export interface OwnerInfo {
  note: string;
  /** Adaptive cruise control fitted to the owner's car. */
  acc?: boolean;
}

export interface FactorySpecs {
  /** Raw rated output as published, e.g. "315 hp (SAE net) @ 6,500 rpm". */
  power?: string;
  torque?: string;
  /** Curb mass as published, with its definition. */
  curbMass?: string;
  zeroTo60MphS?: number;
  zeroTo100KmhS?: number;
  topSpeed?: string;
  sourceId?: string;
}

export interface CatalogEntry {
  /** Stable configuration id (year, make, model, trim, market, body, drive, transmission). */
  id: string;
  /** Roster row number (1–73); undefined for the owner's cars and extension sets. */
  roster?: number;
  /**
   * Playable configuration added after the original 73-car roster (handoff
   * extension sets). `order` is the 1-based position within the set.
   */
  extension?: { set: 'Hypercars'; order: number };
  section: string;
  make: string;
  model: string;
  trim: string;
  modelYear: number;
  market: Market;
  body: BodyStyle;
  bodyLabel: string;
  chassisCode?: string;
  aliases: readonly string[];
  origin: Origin;
  usage: readonly UsageTag[];
  drive: DriveLayout;
  transmission: TransmissionKind;
  transmissionLabel: string;
  powertrain: Powertrain;
  engineLabel: string;
  modelPath: ModelPath;
  owner?: OwnerInfo;
  factory: FactorySpecs;
  sources: readonly SourceRef[];
  benchmarks: readonly MeasuredBenchmark[];
  /** Physics model, present only when the car can be simulated. */
  sim?: VehicleSpec;
  /** Visible reason the car cannot run yet (when `sim` is absent). */
  unsupportedReason?: string;
  /**
   * Known approximations in a playable model (provisional gearing, display-only
   * axle ratios, generic AWD splits…). Shown beside readiness and residuals.
   */
  simCaveats?: readonly string[];
  /** Fields that could not be confirmed from a reachable source (for spec-sheet follow-up). */
  dataGaps: readonly string[];
  notes?: readonly string[];
}

export type Readiness = 'catalog' | 'sim' | 'sim+benchmark';

export const READINESS_LABEL: Record<Readiness, string> = {
  catalog: 'Catalog only',
  sim: 'Simulation available',
  'sim+benchmark': 'Simulation + measured benchmark',
};

export const STATUS_LABEL: Record<DataStatus, string> = { verified: 'Verified', reported: 'Reported', estimated: 'Estimated' };

export function eraOf(year: number): Era {
  if (year < 2000) return '1990s';
  if (year < 2010) return '2000s';
  if (year < 2020) return '2010s';
  return '2020s';
}
