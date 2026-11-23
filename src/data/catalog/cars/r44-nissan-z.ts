import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #44: 2023 Nissan Z Performance 9AT (US). */
export const entry: CatalogEntry = {
  id: "2023-nissan-z-performance-9at-us-coupe-rwd-9at",
  roster: 44,
  section: "Sports cars",
  make: "Nissan",
  model: "Z",
  trim: "Performance 9AT",
  modelYear: 2023,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "RZ34",
  aliases: [
    "400Z",
    "Fairlady Z",
    "RZ34"
  ],
  origin: "Japan",
  usage: [
    "Sports Car",
    "Grand Tourer"
  ],
  drive: "RWD",
  transmission: "AT",
  transmissionLabel: "9-speed automatic",
  powertrain: "Petrol",
  engineLabel: "3.0 twin-turbo V6 (VR30DDTT)",
  modelPath: "Existing",
  factory: {
    power: "400 hp",
    torque: "350 lb-ft",
    curbMass: "3,602 lb (Performance A/T)",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2023 Nissan Z Performance first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2023-nissan-z-performance-first-test-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2023 Nissan Z road test",
      publisher: "Autoblog",
      url: "https://www.autoblog.com/2022/07/14/2023-nissan-z-road-test/",
      kind: "reference"
    },
    {
      id: "src3",
      title: "A week with the 2023 Nissan Z Performance A/T",
      publisher: "The Detroit Bureau",
      url: "https://thedetroitbureau.com/reviews/a-week-with-2023-nissan-z-performance-a-t/",
      kind: "reference"
    }
  ],
  benchmarks: [],
  dataGaps: [
    "MotorTrend first-test results (linked page unreachable; no independent instrumented automatic test found)",
    "9-speed ratios and final drive",
    "Power/torque rpm",
    "Tire size",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "2023-nissan-z-performance-9at-us-coupe-rwd-9at",
  make: "Nissan",
  model: "Z",
  trim: "Performance 9AT",
  modelYear: 2023,
  market: "US",
  body: "Coupe",
  shortName: "Nissan Z Performance 9AT"
}, {
    engine: { code: 'VR30DDTT', description: '3.0 L twin-turbo V6', displacementCc: 2997, aspiration: 'twin-turbo', idleRpm: 650, redlineRpm: 7000, revLimitRpm: 7000, power: { value: 400, unit: 'hp', rpm: [6400, 6400] }, torque: { value: 350, unit: 'lb-ft', rpm: [1600, 5200] }, peakBoostBar: 1.1, lowEndFraction: 0.55 },
    transmission: { type: 'torque-converter-automatic', name: '9-speed automatic', gearRatios: [5.425, 3.263, 2.25, 1.649, 1.221, 1.0, 0.865, 0.717, 0.601], finalDrive: 3.133, torqueConverter: { stallRpm: 2400 } },
    drivetrain: { layout: 'RWD', description: 'Rear-wheel drive with mechanical limited-slip differential' },
    chassis: { curbMassKg: 1634, frontWeightFraction: 0.55, cgHeightM: 0.47, wheelbaseM: 2.55, lengthMm: 4379, widthMm: 1844, heightMm: 1316 },
    aero: {},
    tires: { sizes: [staggered('r19', '255/40 R19 F · 275/35 R19 R', { widthMm: 255, aspectPct: 40, rimIn: 19 }, { widthMm: 275, aspectPct: 35, rimIn: 19 }, 'Performance fitment (assumed)')], compound: 'oe-performance' },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Peak power', value: '400 hp', status: 'reported', source: 'Nissan rating', url: 'https://www.autoblog.com/2022/07/14/2023-nissan-z-road-test/' },
      { parameter: 'Peak torque', value: '350 lb-ft', status: 'reported', source: 'Nissan rating', url: 'https://www.autoblog.com/2022/07/14/2023-nissan-z-road-test/' },
      { parameter: 'Power / torque rpm', value: '6,400 / 1,600–5,200 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '3,602 lb (1,634 kg), Performance automatic', status: 'reported', source: 'Review specification', url: 'https://thedetroitbureau.com/reviews/a-week-with-2023-nissan-z-performance-a-t/' },
      { parameter: 'Gear ratios', value: '5.425/3.263/2.250/1.649/1.221/1.000/0.865/0.717/0.601', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Final drive', value: '3.133', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Tire size', value: '255/40 R19 F, 275/35 R19 R', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
