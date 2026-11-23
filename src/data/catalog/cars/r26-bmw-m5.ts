import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #26: 2018 BMW M5 Standard (US). */
export const entry: CatalogEntry = {
  id: "2018-bmw-m5-standard-us-sedan-awd-8at",
  roster: 26,
  section: "Luxury and sport sedans",
  make: "BMW",
  model: "M5",
  trim: "Standard",
  modelYear: 2018,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "F90",
  aliases: [
    "M5",
    "F90",
    "M xDrive"
  ],
  origin: "Germany",
  usage: [
    "Sport Sedan",
    "Luxury"
  ],
  drive: "AWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic",
  powertrain: "Petrol",
  engineLabel: "4.4 twin-turbo V8 (S63)",
  modelPath: "Existing",
  factory: {
    power: "600 hp",
    torque: "553 lb-ft",
    curbMass: "4,089 lb (Autoblog)",
    zeroTo60MphS: 3.2,
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2018 BMW M5 first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/features/2018-bmw-m5-first-test-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2018 BMW M5 first drive",
      publisher: "Autoblog",
      url: "https://www.autoblog.com/2017/12/05/2018-bmw-m5-first-drive-review",
      kind: "reference"
    },
    {
      id: "src3",
      title: "2018 BMW M5 road test",
      publisher: "MotorWeek",
      url: "https://motorweek.org/road_tests/2018-bmw-m5",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "motorweek",
      sourceId: "src3",
      publication: "MotorWeek",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 3.2,
        quarterMileS: 11.4,
        quarterMileTrapMph: 127
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2018",
      deviation: "Independent replacement for the unreachable MotorTrend first test."
    }
  ],
  dataGaps: [
    "MotorTrend first-test results",
    "Curb mass (sources span 4,089–4,370 lb)",
    "8-speed ratios and final drive",
    "Power/torque bands",
    "Tire size",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "2018-bmw-m5-standard-us-sedan-awd-8at",
  make: "BMW",
  model: "M5",
  trim: "Standard",
  modelYear: 2018,
  market: "US",
  body: "Sedan",
  shortName: "BMW M5 (F90)"
}, {
    engine: { code: 'S63B44T4', description: '4.4 L twin-turbo V8', displacementCc: 4395, aspiration: 'twin-turbo', idleRpm: 650, redlineRpm: 7200, revLimitRpm: 7200, power: { value: 600, unit: 'hp', rpm: [5600, 6700] }, torque: { value: 553, unit: 'lb-ft', rpm: [1800, 5600] }, peakBoostBar: 1.2, lowEndFraction: 0.55 },
    transmission: { type: 'torque-converter-automatic', name: '8-speed M Steptronic (ZF 8HP)', gearRatios: [5.0, 3.2, 2.143, 1.72, 1.313, 1.0, 0.823, 0.64], finalDrive: 3.154, upshiftTimeS: 0.2, downshiftTimeS: 0.28, shiftTorqueDip: 0.3, torqueConverter: { stallRpm: 2500 } },
    drivetrain: { layout: 'AWD', efficiency: 0.844, description: 'M xDrive (rear-biased; 4WD Sport / 2WD modes)', frontShareRange: [0, 0.5] },
    chassis: { curbMassKg: 1855, frontWeightFraction: 0.53, wheelbaseM: 2.982, lengthMm: 4966, widthMm: 1903, heightMm: 1469 },
    aero: {},
    tires: { sizes: [staggered('r19', '275/40 R19 F · 285/40 R19 R', { widthMm: 275, aspectPct: 40, rimIn: 19 }, { widthMm: 285, aspectPct: 40, rimIn: 19 }, 'Standard M5 fitment (assumed)')], compound: 'uhp' },
    speedLimiterKmh: 250,
    factory: { zeroTo60MphS: 3.2 },
    provenance: [
      { parameter: 'Drivetrain efficiency', value: '84.4 %', status: 'estimated', source: 'Fitted to the MotorWeek 127 mph trap; 0–60 (2.98 vs 3.2 s) and ET held out' },
      { parameter: 'Peak power', value: '600 hp', status: 'reported', source: 'BMW rating (Autoblog specs)', url: 'https://www.autoblog.com/2017/12/05/2018-bmw-m5-first-drive-review' },
      { parameter: 'Peak torque', value: '553 lb-ft', status: 'reported', source: 'BMW rating (Autoblog specs)', url: 'https://www.autoblog.com/2017/12/05/2018-bmw-m5-first-drive-review' },
      { parameter: 'Power / torque bands', value: '5,600–6,700 / 1,800–5,600 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Gear ratios', value: '5.000/3.200/2.143/1.720/1.313/1.000/0.823/0.640 (ZF 8HP M)', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Final drive', value: '3.154', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '4,089 lb (1,855 kg)', status: 'reported', source: 'Autoblog specification listing (other sources 4,293–4,370 lb)', url: 'https://www.autoblog.com/2017/12/05/2018-bmw-m5-first-drive-review' },
      { parameter: 'Tire size', value: '275/40 R19 F, 285/40 R19 R', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
