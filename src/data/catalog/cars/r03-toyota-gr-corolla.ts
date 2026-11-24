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
      id: "src4",
      title: "Toyota GR Corolla 0–60 times",
      publisher: "carwhere (citing MotorWeek)",
      url: "https://www.carwhere.com/0-60-times/toyota/gr-corolla",
      kind: "reference"
    },
    {
      id: "src-toy23",
      title: "2023 GR Corolla brochure",
      publisher: "Toyota USA",
      url: "https://www.toyota.com/content/dam/toyota/brochures/pdf/2023/gr-corolla_ebrochure.pdf",
      kind: "manufacturer"
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
    },
    {
      id: "mt",
      sourceId: "test",
      publication: "MotorTrend",
      timing: "rollout-1ft",
      timingNote: "MotorTrend subtracts a 1-ft rollout from its acceleration times.",
      results: {
        zeroTo60MphS: 5.4,
        quarterMileS: 13.7,
        quarterMileTrapMph: 100.1
      },
      conditions: {
        testMass: "3,261 lb as tested (58/42)",
        other: [
          "Prototype without the stock rear wing and the edition shift knob"
        ]
      },
      match: "equivalent",
      verification: "Original MotorTrend Circuit Edition test table, as transcribed in the Codex inspection handoff, 2026-11. The 101.2 mph previously shown belonged to the Core.",
      date: "2022",
      deviation: "Pre-production Circuit Edition without its rear wing and edition shift knob; the stock Circuit model (3,285 lb factory curb) is kept unchanged."
    }
  ],
  dataGaps: [
    "Power/torque rpm",
    "Power and torque rpm bands",
    "Production-car (with rear wing) instrumented test"
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
    transmission: { type: 'manual', name: '6-speed manual', gearRatios: [3.538, 2.238, 1.535, 1.162, 1.081, 0.902], finalDrive: [4.058, 4.058, 4.058, 4.058, 3.45, 3.45] },
    drivetrain: { layout: 'AWD', efficiency: 0.873, description: 'GR-Four coupling AWD (60:40, 50:50, 30:70 modes)', frontShareRange: [0.3, 0.6] },
    chassis: { curbMassKg: 1490, frontWeightFraction: 0.58, wheelbaseM: 2.64, lengthMm: 4410, widthMm: 1850, heightMm: 1480 },
    aero: { dragCoefficient: 0.35 },
    tires: { sizes: [square('r18', '235/40 R18', 235, 40, 18, 'Michelin Pilot Sport 4 (assumed)')], compound: 'uhp', gripScale: 1.0 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Gear ratios', value: '3.538/2.238/1.535/1.162/1.081/0.902', status: 'verified', source: 'Toyota US MY2023 brochure confirms the six forward ratios', url: 'https://www.toyota.com/content/dam/toyota/brochures/pdf/2023/gr-corolla_ebrochure.pdf' },
      { parameter: 'Weight distribution', value: '58/42 front/rear (as tested)', status: 'reported', source: 'MotorTrend Circuit Edition test', url: 'https://www.motortrend.com/features/2023-toyota-gr-corolla-circuit-edition-first-test-review' },
      { parameter: 'Tire grip calibration', value: '×1.00', status: 'estimated', source: 'A grip fit to the Car and Driver 0–60 mph 4.8 s needed no increase after the corrected 4.058 axle' },
      { parameter: 'Drivetrain efficiency', value: '87.3 %', status: 'estimated', source: 'Fitted to the Car and Driver ¼-mile trap 105 mph' },
      { parameter: 'Final drive', value: '4.058 (1st–4th) / 3.450 (5th, 6th, reverse)', status: 'verified', source: 'Toyota US MY2023 brochure (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.toyota.com/content/dam/toyota/brochures/pdf/2023/gr-corolla_ebrochure.pdf' },
      { parameter: 'Drag coefficient', value: 'Cd 0.35', status: 'verified', source: 'Toyota US MY2023 brochure (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.toyota.com/content/dam/toyota/brochures/pdf/2023/gr-corolla_ebrochure.pdf' },
      { parameter: 'Curb mass', value: '3,285 lb (1,490 kg), Circuit', status: 'verified', source: 'Toyota US MY2023 brochure (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.toyota.com/content/dam/toyota/brochures/pdf/2023/gr-corolla_ebrochure.pdf' },
      { parameter: 'AWD split', value: 'Front share 0.30–0.60 (60:40, 50:50, 30:70 modes)', status: 'reported', source: 'Toyota nominal mode splits (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.toyota.com/content/dam/toyota/brochures/pdf/2023/gr-corolla_ebrochure.pdf' },
      { parameter: 'Peak power', value: '300 hp', status: 'reported', source: 'Toyota rating (multiple reviews)', url: 'https://www.motor1.com/reviews/610129/toyota-gr-corolla-first-drive-review/' },
      { parameter: 'Peak torque', value: '273 lb-ft', status: 'reported', source: 'Toyota rating (multiple reviews)', url: 'https://www.motor1.com/reviews/610129/toyota-gr-corolla-first-drive-review/' },
      { parameter: 'Power / torque rpm', value: '6,500 / 3,000–5,500 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Tire size', value: '235/40 R18', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
