import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #3: 2023 Toyota GR Corolla Circuit Edition (US). */
export const entry: CatalogEntry = {
  id: "2023-toyota-gr-corolla-circuit-edition-us-hatch-awd-6mt",
  roster: 3,
  section: "Hot hatches",
  make: "Toyota",
  model: "GR Corolla",
  trim: "Circuit Edition",
  modelYear: 2023,
  market: "US",
  body: "Hatchback",
  bodyLabel: "5-door hatchback",
  chassisCode: "GZEA14",
  aliases: [
    "GR Corolla",
    "GZEA14",
    "GR-Four"
  ],
  origin: "Japan",
  usage: [
    "Hot Hatch",
    "Sport Compact",
    "Track"
  ],
  drive: "AWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "1.6 turbo I3 (G16E-GTS)",
  modelPath: "MT",
  factory: {
    power: "300 hp",
    torque: "273 lb-ft",
    curbMass: "3,285 lb (Circuit)",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2023 Toyota GR Corolla Circuit Edition first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/features/2023-toyota-gr-corolla-circuit-edition-first-test-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Tested: Is the Toyota GR Corolla Quicker Than We Thought?",
      publisher: "Car and Driver (syndicated on AOL)",
      url: "https://www.aol.com/tested-toyota-gr-corolla-quicker-153000033.html",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "2023 GR Corolla clocks 0–60 in 5.4 s in first test",
      publisher: "Carscoops (citing MotorTrend)",
      url: "https://www.carscoops.com/2022/09/2023-gr-corolla-clocks-0-60-time-of-5-4-sec-in-first-test-comes-up-short-on-toyotas-claims/",
      kind: "reference"
    },
    {
      id: "src4",
      title: "Toyota GR Corolla 0–60 times",
      publisher: "carwhere (citing MotorWeek)",
      url: "https://www.carwhere.com/0-60-times/toyota/gr-corolla",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src2",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 4.8,
        quarterMileS: 13.3,
        quarterMileTrapMph: 105
      },
      conditions: {
        other: [
          "Best run of a retest"
        ]
      },
      match: "exact",
      verification: "Syndicated copy of the article (original page not reachable from this environment).",
      date: "2023"
    },
    {
      id: "mt",
      sourceId: "src3",
      publication: "MotorTrend",
      timing: "rollout-1ft",
      timingNote: "MotorTrend subtracts a 1-ft rollout from its acceleration times.",
      results: {
        zeroTo60MphS: 5.4,
        quarterMileS: 13.7,
        quarterMileTrapMph: 101.2
      },
      conditions: {},
      match: "exact",
      verification: "Secondary report of the MotorTrend first test.",
      date: "2022"
    },
    {
      id: "motorweek",
      sourceId: "src4",
      publication: "MotorWeek",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 5.0,
        quarterMileS: 13.3,
        quarterMileTrapMph: 104
      },
      conditions: {},
      match: "equivalent",
      verification: "Aggregator listing.",
      date: "2023",
      deviation: "Listed for the Core/Circuit together."
    }
  ],
  dataGaps: [
    "Gear ratios and final drive",
    "Power/torque rpm",
    "AWD split range",
    "Weight distribution",
    "Drag coefficient"
  ],
  notes: [
    "Car and Driver’s first test was slower than its later retest; MotorTrend’s first test (5.4 s) is quoted as falling short of Toyota’s claim."
  ],
  sim: buildSpec({
  id: "2023-toyota-gr-corolla-circuit-edition-us-hatch-awd-6mt",
  make: "Toyota",
  model: "GR Corolla",
  trim: "Circuit Edition",
  modelYear: 2023,
  market: "US",
  body: "Hatchback",
  shortName: "Toyota GR Corolla Circuit Edition"
}, {
    engine: { code: 'G16E-GTS', description: '1.6 L turbo I3', displacementCc: 1618, aspiration: 'turbo', idleRpm: 800, redlineRpm: 7000, revLimitRpm: 7200, power: { value: 300, unit: 'hp', rpm: [6500, 6500] }, torque: { value: 273, unit: 'lb-ft', rpm: [3000, 5500] }, peakBoostBar: 1.4 },
    transmission: { type: 'manual', name: '6-speed manual', gearRatios: [3.538, 2.238, 1.535, 1.162, 1.081, 0.902], finalDrive: [3.941, 3.941, 3.941, 3.941, 3.35, 3.35] },
    drivetrain: { layout: 'AWD', efficiency: 0.865, description: 'GR-Four coupling AWD (60:40, 50:50, 30:70 modes)', frontShareRange: [0.3, 0.6] },
    chassis: { curbMassKg: 1490, frontWeightFraction: 0.6, wheelbaseM: 2.64, lengthMm: 4410, widthMm: 1850, heightMm: 1480 },
    aero: {},
    tires: { sizes: [square('r18', '235/40 R18', 235, 40, 18, 'Michelin Pilot Sport 4 (assumed)')], compound: 'uhp', gripScale: 1.3 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.30 (fit bound)', status: 'estimated', source: 'Fitted to the Car and Driver 0–60 mph 4.8 s (sim 4.81 s at the bound)' },
      { parameter: 'Drivetrain efficiency', value: '86.5 %', status: 'estimated', source: 'Fitted to the Car and Driver ¼-mile trap 105 mph' },
      { parameter: 'Peak power', value: '300 hp', status: 'reported', source: 'Toyota rating (multiple reviews)', url: 'https://www.motor1.com/reviews/610129/toyota-gr-corolla-first-drive-review/' },
      { parameter: 'Peak torque', value: '273 lb-ft', status: 'reported', source: 'Toyota rating (multiple reviews)', url: 'https://www.motor1.com/reviews/610129/toyota-gr-corolla-first-drive-review/' },
      { parameter: 'Power / torque rpm', value: '6,500 / 3,000–5,500 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Gear ratios', value: '3.538/2.238/1.535/1.162/1.081/0.902', status: 'estimated', source: 'Assumed shared with the GR Yaris; not verified — awaiting spec sheet' },
      { parameter: 'Final drive', value: '3.941 (1st–4th) / 3.350 (5th–6th)', status: 'estimated', source: 'GR Yaris figures from Toyota UK, assumed shared — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '3,285 lb (1,490 kg), Circuit', status: 'reported', source: 'Toyota figures (Core 3,252 lb + 23 lb)', url: 'https://aol.com/2023-toyota-gr-corolla-specs-113000201.html' },
      { parameter: 'AWD split', value: 'Front share 0.30–0.60', status: 'estimated', source: 'Published GR-Four mode splits (recalled)' },
      { parameter: 'Tire size', value: '235/40 R18', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
