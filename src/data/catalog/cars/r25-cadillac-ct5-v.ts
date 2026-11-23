import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #25: 2022 Cadillac CT5-V Blackwing 10AT (US). */
export const entry: CatalogEntry = {
  id: "2022-cadillac-ct5-v-blackwing-10at-us-sedan-rwd-10at",
  roster: 25,
  section: "Luxury and sport sedans",
  make: "Cadillac",
  model: "CT5-V",
  trim: "Blackwing 10AT",
  modelYear: 2022,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "A2LL",
  aliases: [
    "CT5 Blackwing",
    "CT5-V"
  ],
  origin: "United States",
  usage: [
    "Sport Sedan",
    "Muscle",
    "Track"
  ],
  drive: "RWD",
  transmission: "AT",
  transmissionLabel: "10-speed automatic",
  powertrain: "Petrol",
  engineLabel: "6.2 supercharged V8 (LT4)",
  modelPath: "Existing",
  factory: {
    power: "668 hp",
    torque: "659 lb-ft",
    curbMass: "4,142 lb (automatic)",
    zeroTo60MphS: 3.4,
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2022 Cadillac CT5-V Blackwing manual vs automatic test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/features/2022-cadillac-ct5v-blackwing-test-0-60-quarter-mile-manual-vs-automatic-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2022 Cadillac CT5-V Blackwing road test",
      publisher: "MotorWeek",
      url: "https://motorweek.org/road_tests/2022-cadillac-ct5-v-blackwing",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "CT5-V Blackwing first drive",
      publisher: "The Drive",
      url: "https://www.thedrive.com/new-cars/41697/2022-cadillac-ct5-v-blackwing-first-drive-review-a-grand-finale-for-explosive-v8-manual-power",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "motorweek",
      sourceId: "src2",
      publication: "MotorWeek",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 3.6,
        quarterMileS: 11.7,
        quarterMileTrapMph: 124
      },
      conditions: {},
      match: "equivalent",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2022",
      deviation: "Transmission of the MotorWeek test car not stated; MotorTrend automatic test unreachable."
    }
  ],
  dataGaps: [
    "MotorTrend automatic test results",
    "10-speed ratios and final drive",
    "Power/torque rpm",
    "Tire size",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "2022-cadillac-ct5-v-blackwing-10at-us-sedan-rwd-10at",
  make: "Cadillac",
  model: "CT5-V",
  trim: "Blackwing 10AT",
  modelYear: 2022,
  market: "US",
  body: "Sedan",
  shortName: "Cadillac CT5-V Blackwing"
}, {
    engine: { code: 'LT4', description: '6.2 L supercharged V8', displacementCc: 6162, aspiration: 'supercharged', idleRpm: 700, redlineRpm: 6500, revLimitRpm: 6600, power: { value: 668, unit: 'hp', rpm: [6500, 6500] }, torque: { value: 659, unit: 'lb-ft', rpm: [3600, 3600] }, peakBoostBar: 0.8, lowEndFraction: 0.62 },
    transmission: { type: 'torque-converter-automatic', name: '10-speed automatic (10L90)', gearRatios: [4.7, 2.99, 2.15, 1.8, 1.52, 1.28, 1.0, 0.85, 0.69, 0.64], finalDrive: 2.85, upshiftTimeS: 0.22, shiftTorqueDip: 0.35, torqueConverter: { stallRpm: 2300 } },
    drivetrain: { layout: 'RWD', description: 'Rear-wheel drive with electronic limited-slip differential' },
    chassis: { curbMassKg: 1879, frontWeightFraction: 0.53, wheelbaseM: 2.947, lengthMm: 4924, widthMm: 1883, heightMm: 1452 },
    aero: {},
    tires: { sizes: [staggered('r19', '275/35 R19 F · 305/30 R19 R', { widthMm: 275, aspectPct: 35, rimIn: 19 }, { widthMm: 305, aspectPct: 30, rimIn: 19 }, 'Michelin Pilot Sport 4S (assumed)')], compound: 'uhp' },
    speedLimiterKmh: null,
    factory: { zeroTo60MphS: 3.4 },
    provenance: [
      { parameter: 'Peak power', value: '668 hp', status: 'reported', source: 'Cadillac rating', url: 'https://motorweek.org/road_tests/2022-cadillac-ct5-v-blackwing' },
      { parameter: 'Peak torque', value: '659 lb-ft', status: 'reported', source: 'Cadillac rating', url: 'https://motorweek.org/road_tests/2022-cadillac-ct5-v-blackwing' },
      { parameter: 'Power / torque rpm', value: '6,500 / 3,600 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Gear ratios', value: '4.70/2.99/2.15/1.80/1.52/1.28/1.00/0.85/0.69/0.64 (10L90)', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Final drive', value: '2.85', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '4,142 lb (1,879 kg), automatic', status: 'reported', source: 'The Drive specification table', url: 'https://www.thedrive.com/new-cars/41697/2022-cadillac-ct5-v-blackwing-first-drive-review-a-grand-finale-for-explosive-v8-manual-power' },
      { parameter: 'Tire size', value: '275/35 R19 F, 305/30 R19 R', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
