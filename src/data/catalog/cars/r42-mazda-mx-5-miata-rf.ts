import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #42: 2024 Mazda MX-5 Miata RF Club (US). */
export const entry: CatalogEntry = {
  id: "2024-mazda-mx-5-miata-rf-club-us-conv-rwd-6mt",
  roster: 42,
  section: "Sports cars",
  make: "Mazda",
  model: "MX-5 Miata RF",
  trim: "Club",
  modelYear: 2024,
  market: "US",
  body: "Convertible",
  bodyLabel: "Retractable fastback",
  chassisCode: "ND3",
  aliases: [
    "Miata RF",
    "MX5 RF",
    "ND3",
    "Roadster RF"
  ],
  origin: "Japan",
  usage: [
    "Sports Car"
  ],
  drive: "RWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "2.0 I4 (Skyactiv-G PE-VPS)",
  modelPath: "MT",
  factory: {
    power: "181 hp",
    torque: "151 lb-ft",
    curbMass: "2,452 lb",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2024 Mazda MX-5 Miata RF Club first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2024-mazda-mx-5-miata-rf-club-first-test-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2024 Mazda Miata RF review",
      publisher: "Motor1",
      url: "https://www.motor1.com/reviews/722936/2024-mazda-miata-rf-review/",
      kind: "reference"
    },
    {
      id: "src3",
      title: "2024 Mazda MX-5 Miata RF Club track tested",
      publisher: "Edmunds",
      url: "https://www.edmunds.com/car-news/2024-mazda-mx-5-miata-rf-club-track-tested.html",
      kind: "road-test"
    },
    {
      id: "src4",
      title: "2024 MX-5 spec deck",
      publisher: "Mazda USA",
      url: "https://news.mazdausa.com/download/2024+MX-5+Spec+Deck.pdf",
      kind: "manufacturer"
    }
  ],
  benchmarks: [
    {
      id: "edmunds",
      sourceId: "src3",
      publication: "Edmunds",
      timing: "standing-start",
      timingNote: "Edmunds times from a standstill (\"zero should mean zero\"), no rollout.",
      results: {
        zeroTo60MphS: 6.4,
        quarterMileS: 14.8,
        quarterMileTrapMph: 92.9
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2024"
    }
  ],
  dataGaps: [
    "MotorTrend first test (roster source)",
    "Gear ratios and final drive (Mazda spec deck not reachable)",
    "Drag coefficient"
  ],
  notes: [
    "An aggregator lists RF Club runs of 5.5 s / 14.3 s @ 96.0 mph and 5.7 s / 14.5 s @ 94.1 mph without saying which publication ran each, so they are not transcribed."
  ],
  sim: buildSpec({
  id: "2024-mazda-mx-5-miata-rf-club-us-conv-rwd-6mt",
  make: "Mazda",
  model: "MX-5 Miata RF",
  trim: "Club",
  modelYear: 2024,
  market: "US",
  body: "Convertible",
  shortName: "Mazda MX-5 Miata RF Club (2024)"
}, {
    engine: { code: 'PE-VPS', description: '2.0 L I4, Skyactiv-G (181 hp revision)', displacementCc: 1998, aspiration: 'na', idleRpm: 700, redlineRpm: 7500, revLimitRpm: 7500, power: { value: 181, unit: 'hp', rpm: [7000, 7000] }, torque: { value: 151, unit: 'lb-ft', rpm: [4000, 4000] }, lowEndFraction: 0.78 },
    transmission: { type: 'manual', name: '6-speed manual', gearRatios: [5.087, 2.991, 2.035, 1.594, 1.286, 1.0], finalDrive: 2.866 },
    drivetrain: { layout: 'RWD', efficiency: 0.854, description: 'Rear-wheel drive, asymmetric limited-slip differential (Club)' },
    chassis: { curbMassKg: 1112, frontWeightFraction: 0.51, wheelbaseM: 2.31, lengthMm: 3915, widthMm: 1735, heightMm: 1245 },
    aero: {},
    tires: { sizes: [square('r17', '205/45 R17', 205, 45, 17, 'Bridgestone Potenza S007A (Club, assumed)')], compound: 'uhp', gripScale: 1.3 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.30 (fit bound)', status: 'estimated', source: 'Fit toward the Edmunds 0–60 mph 6.4 s stopped at the bound (sim 6.61 s)' },
      { parameter: 'Drivetrain efficiency', value: '85.4 %', status: 'estimated', source: 'Fitted to the Edmunds ¼-mile trap 92.9 mph' },
      { parameter: 'Peak power', value: '181 hp', status: 'reported', source: 'Mazda rating (Motor1)', url: 'https://www.motor1.com/reviews/722936/2024-mazda-miata-rf-review/' },
      { parameter: 'Peak torque', value: '151 lb-ft', status: 'reported', source: 'Mazda rating (Motor1)', url: 'https://www.motor1.com/reviews/722936/2024-mazda-miata-rf-review/' },
      { parameter: 'Power / torque rpm', value: '7,000 / 4,000 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Gear ratios', value: '5.087/2.991/2.035/1.594/1.286/1.000', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Final drive', value: '2.866', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '2,452 lb (1,112 kg)', status: 'reported', source: 'Motor1 listing', url: 'https://www.motor1.com/reviews/722936/2024-mazda-miata-rf-review/' },
      { parameter: 'Tire size', value: '205/45 R17', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
