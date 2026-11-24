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
    }
  ],
  benchmarks: [],
  dataGaps: [
    "Instrumented test results",
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
    drivetrain: { layout: 'FWD', description: 'Front-wheel drive, helical limited-slip differential' },
    chassis: { curbMassKg: 1460, frontWeightFraction: 0.62, wheelbaseM: 2.735, lengthMm: 4725, widthMm: 1900, heightMm: 1405 },
    aero: {},
    tires: { sizes: [square('r19', '265/30 R19', 265, 30, 19, 'Michelin Pilot Sport 4S (assumed)')], compound: 'uhp', gripScale: 1.15 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Peak power', value: '320 hp @ 6,500 rpm', status: 'verified', source: 'Acura US specifications (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://acuranews.com/en-US/releases/release-13f25e90cfe47cd58453f1f7100d2209-2024-acura-integra-integra-type-s-specifications-features?selectedTabId=release-13f25e90cfe47cd58453f1f7100d2209-photos' },
      { parameter: 'Peak torque', value: '310 lb-ft @ 2,600–4,000 rpm', status: 'verified', source: 'Acura US specifications (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://acuranews.com/en-US/releases/release-13f25e90cfe47cd58453f1f7100d2209-2024-acura-integra-integra-type-s-specifications-features?selectedTabId=release-13f25e90cfe47cd58453f1f7100d2209-photos' },
      { parameter: 'Gear ratios', value: '3.625/2.115/1.529/1.125/0.911/0.734', status: 'verified', source: 'Acura US specifications (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://acuranews.com/en-US/releases/release-13f25e90cfe47cd58453f1f7100d2209-2024-acura-integra-integra-type-s-specifications-features?selectedTabId=release-13f25e90cfe47cd58453f1f7100d2209-photos' },
      { parameter: 'Final drive', value: '3.842', status: 'verified', source: 'Acura US specifications (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://acuranews.com/en-US/releases/release-13f25e90cfe47cd58453f1f7100d2209-2024-acura-integra-integra-type-s-specifications-features?selectedTabId=release-13f25e90cfe47cd58453f1f7100d2209-photos' },
      { parameter: 'Tire grip calibration', value: '×1.15', status: 'estimated', source: 'No launch benchmark for this car: median of the fitted front-drive cars (Camry, Elantra N, Octavia)' },
      { parameter: 'Curb mass', value: '3,219 lb (1,460 kg)', status: 'reported', source: 'Autoblog listing (trim not stated)', url: 'https://autoblog.com/buy/2024-Acura-Integra/review/' },
      { parameter: 'Tire size', value: '265/30 R19', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
