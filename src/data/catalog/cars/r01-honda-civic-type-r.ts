import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #1: 2023 Honda Civic Type R Type R (US). */
export const entry: CatalogEntry = {
  id: "2023-honda-civic-type-r-us-hatch-fwd-6mt",
  roster: 1,
  section: "Hot hatches",
  make: "Honda",
  model: "Civic Type R",
  trim: "Type R",
  modelYear: 2023,
  market: "US",
  body: "Hatchback",
  bodyLabel: "5-door hatchback",
  chassisCode: "FL5",
  aliases: [
    "CTR",
    "Type R",
    "FL5"
  ],
  origin: "Japan",
  usage: [
    "Hot Hatch",
    "Sport Compact",
    "Track"
  ],
  drive: "FWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "2.0 turbo I4 (K20C1)",
  modelPath: "MT",
  factory: {
    power: "315 hp @ 6,500 rpm",
    torque: "310 lb-ft @ 2,600–4,000 rpm",
    curbMass: "3,188 lb",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2023 Honda Civic Type R by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a41952459/2023-honda-civic-type-r-by-the-numbers/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2023 Honda Civic Type R specifications & features",
      publisher: "Honda",
      url: "https://hondanews.com/en-US/honda-automobiles/releases/2023-honda-civic-type-r-specifications-features",
      kind: "manufacturer"
    },
    {
      id: "src3",
      title: "Honda Civic Type R",
      publisher: "FastestLaps (citing Sport Auto)",
      url: "https://fastestlaps.com/models/honda-civic-type-r-n-a",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "sportauto",
      sourceId: "src3",
      publication: "Sport Auto (FR), as listed by FastestLaps",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        quarterMileS: 13.5,
        quarterMileTrapMph: 108
      },
      conditions: {},
      match: "equivalent",
      verification: "Aggregator listing; original test not reached.",
      deviation: "European-specification FL5 (rated 329 PS); same engine and gearbox."
    }
  ],
  dataGaps: [
    "Car and Driver test results",
    "Weight distribution",
    "Drag coefficient",
    "Launch benchmark for grip calibration"
  ],
  sim: buildSpec({
  id: "2023-honda-civic-type-r-us-hatch-fwd-6mt",
  make: "Honda",
  model: "Civic Type R",
  trim: "Type R",
  modelYear: 2023,
  market: "US",
  body: "Hatchback",
  shortName: "Honda Civic Type R"
}, {
    engine: { code: 'K20C1', description: '2.0 L turbo I4, VTC', displacementCc: 1996, aspiration: 'turbo', idleRpm: 750, redlineRpm: 7000, revLimitRpm: 7000, power: { value: 315, unit: 'hp', rpm: [6500, 6500] }, torque: { value: 310, unit: 'lb-ft', rpm: [2600, 4000] }, peakBoostBar: 1.6 },
    transmission: { type: 'manual', name: '6-speed manual', gearRatios: [3.62, 2.12, 1.53, 1.12, 0.91, 0.73], finalDrive: 3.84 },
    drivetrain: { layout: 'FWD', description: 'Front-wheel drive, helical limited-slip differential' },
    chassis: { curbMassKg: 1446, frontWeightFraction: 0.62, wheelbaseM: 2.735, lengthMm: 4595, widthMm: 1890, heightMm: 1405 },
    aero: {},
    tires: { sizes: [square('r19', '265/30 R19', 265, 30, 19, 'Michelin Pilot Sport 4S')], compound: 'uhp', gripScale: 1.15 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.15', status: 'estimated', source: 'No launch benchmark for this car: median of the fitted front-drive cars (Camry, Elantra N, Octavia)' },
      { parameter: 'Peak power', value: '315 hp @ 6,500 rpm', status: 'reported', source: 'Honda specifications', url: 'https://hondanews.com/en-US/honda-automobiles/releases/2023-honda-civic-type-r-specifications-features' },
      { parameter: 'Peak torque', value: '310 lb-ft @ 2,600–4,000 rpm', status: 'reported', source: 'Honda specifications', url: 'https://hondanews.com/en-US/honda-automobiles/releases/2023-honda-civic-type-r-specifications-features' },
      { parameter: 'Gear ratios', value: '3.62/2.12/1.53/1.12/0.91/0.73', status: 'reported', source: 'Motor Matchup (rounded)', url: 'https://www.motormatchup.com/catalog/Honda/Civic-Type-R/2023/Manual' },
      { parameter: 'Final drive', value: '3.84', status: 'reported', source: 'Motor Matchup and Auto123 agree', url: 'https://www.motormatchup.com/catalog/Honda/Civic-Type-R/2023/Manual' },
      { parameter: 'Curb mass', value: '3,188 lb (1,446 kg)', status: 'reported', source: 'Honda specifications', url: 'https://hondanews.com/en-US/honda-automobiles/releases/2023-honda-civic-type-r-specifications-features' },
      { parameter: 'Tire size', value: '265/30 R19', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
