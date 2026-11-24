import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #2: 2024 Acura Integra Type S (US). */
export const entry: CatalogEntry = {
  id: "2024-acura-integra-type-s-us-liftback-fwd-6mt",
  roster: 2,
  section: "Hot hatches",
  make: "Acura",
  model: "Integra",
  trim: "Type S",
  modelYear: 2024,
  market: "US",
  body: "Liftback",
  bodyLabel: "5-door liftback",
  chassisCode: "DE5",
  aliases: [
    "Integra Type S",
    "DE5"
  ],
  origin: "Japan",
  usage: [
    "Hot Hatch",
    "Sport Compact"
  ],
  drive: "FWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "2.0 turbo I4 (K20C1)",
  modelPath: "MT",
  factory: {
    power: "320 hp",
    torque: "310 lb-ft",
    curbMass: "3,219 lb (listing)",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2024 Acura Integra Type S drive",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a44212736/2024-acura-integra-type-s-drive/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2024 Acura Integra review",
      publisher: "Autoblog",
      url: "https://autoblog.com/buy/2024-Acura-Integra/review/",
      kind: "reference"
    },
    {
      id: "src-acura",
      title: "2024 Acura Integra / Integra Type S specifications",
      publisher: "Acura",
      url: "https://acuranews.com/en-US/releases/release-13f25e90cfe47cd58453f1f7100d2209-2024-acura-integra-integra-type-s-specifications-features?selectedTabId=release-13f25e90cfe47cd58453f1f7100d2209-photos",
      kind: "manufacturer"
    },
    {
      id: "src-cd",
      title: "The Strong and Silent Type S (September 2023 issue)",
      publisher: "Car and Driver",
      url: "https://www.magzter.com/ja/stories/automotive/Car-and-Driver/THE-STRONG-AND-SILENT-TYPE-S",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src-cd",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 5.1,
        quarterMileS: 13.7,
        quarterMileTrapMph: 105
      },
      conditions: {
        fuel: "High-test (premium) fuel"
      },
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment). An aggregator lists a different Car and Driver run (13.6 s @ 107 mph), not used.",
      date: "2023"
    }
  ],
  dataGaps: [
    "Weight distribution",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "2024-acura-integra-type-s-us-liftback-fwd-6mt",
  make: "Acura",
  model: "Integra",
  trim: "Type S",
  modelYear: 2024,
  market: "US",
  body: "Liftback",
  shortName: "Acura Integra Type S"
}, {
    engine: { code: 'K20C1', description: '2.0 L turbo I4, VTC', displacementCc: 1996, aspiration: 'turbo', idleRpm: 750, redlineRpm: 7000, revLimitRpm: 7000, power: { value: 320, unit: 'hp', rpm: [6500, 6500] }, torque: { value: 310, unit: 'lb-ft', rpm: [2600, 4000] }, peakBoostBar: 1.6 },
    transmission: { type: 'manual', name: '6-speed manual', gearRatios: [3.625, 2.115, 1.529, 1.125, 0.911, 0.734], finalDrive: 3.842 },
    drivetrain: { layout: 'FWD', efficiency: 0.89, description: 'Front-wheel drive, helical limited-slip differential' },
    chassis: { curbMassKg: 1460, frontWeightFraction: 0.62, wheelbaseM: 2.735, lengthMm: 4725, widthMm: 1900, heightMm: 1405 },
    aero: {},
    tires: { sizes: [square('r19', '265/30 R19', 265, 30, 19, 'Michelin Pilot Sport 4S (assumed)')], compound: 'uhp', gripScale: 1.05 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.05', status: 'estimated', source: 'Fitted to the Car and Driver 0–60 mph 5.1 s with efficiency held at the front-drive manual default' },
      { parameter: 'Drivetrain efficiency', value: '89 %', status: 'estimated', source: 'Default for a front-drive manual; a trap fit asked for 82.6 %, implausibly low, so the ≈+2.7 mph trap residual is left visible' },
      { parameter: 'Peak power', value: '320 hp @ 6,500 rpm', status: 'verified', source: 'Acura US specifications (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://acuranews.com/en-US/releases/release-13f25e90cfe47cd58453f1f7100d2209-2024-acura-integra-integra-type-s-specifications-features?selectedTabId=release-13f25e90cfe47cd58453f1f7100d2209-photos' },
      { parameter: 'Peak torque', value: '310 lb-ft @ 2,600–4,000 rpm', status: 'verified', source: 'Acura US specifications (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://acuranews.com/en-US/releases/release-13f25e90cfe47cd58453f1f7100d2209-2024-acura-integra-integra-type-s-specifications-features?selectedTabId=release-13f25e90cfe47cd58453f1f7100d2209-photos' },
      { parameter: 'Gear ratios', value: '3.625/2.115/1.529/1.125/0.911/0.734', status: 'verified', source: 'Acura US specifications (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://acuranews.com/en-US/releases/release-13f25e90cfe47cd58453f1f7100d2209-2024-acura-integra-integra-type-s-specifications-features?selectedTabId=release-13f25e90cfe47cd58453f1f7100d2209-photos' },
      { parameter: 'Final drive', value: '3.842', status: 'verified', source: 'Acura US specifications (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://acuranews.com/en-US/releases/release-13f25e90cfe47cd58453f1f7100d2209-2024-acura-integra-integra-type-s-specifications-features?selectedTabId=release-13f25e90cfe47cd58453f1f7100d2209-photos' },
      { parameter: 'Curb mass', value: '3,219 lb (1,460 kg)', status: 'reported', source: 'Autoblog listing (trim not stated)', url: 'https://autoblog.com/buy/2024-Acura-Integra/review/' },
      { parameter: 'Tire size', value: '265/30 R19', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
