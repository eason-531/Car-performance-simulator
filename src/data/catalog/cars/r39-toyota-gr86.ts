import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #39: 2022 Toyota GR86 Premium (US). */
export const entry: CatalogEntry = {
  id: "2022-toyota-gr86-premium-us-coupe-rwd-6mt",
  roster: 39,
  section: "Sports cars",
  make: "Toyota",
  model: "GR86",
  trim: "Premium",
  modelYear: 2022,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "ZN8",
  aliases: [
    "GR86",
    "86",
    "ZN8"
  ],
  origin: "Japan",
  usage: [
    "Sports Car",
    "Track"
  ],
  drive: "RWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "2.4 flat-4 (FA24D)",
  modelPath: "MT",
  factory: {
    power: "228 hp",
    torque: "184 lb-ft",
    curbMass: "2,833 lb (listing)",
    zeroTo60MphS: 6.1,
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2022 Toyota GR86 drive",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a37322814/2022-toyota-gr86-drive/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2022 Toyota GR86 review",
      publisher: "Motor1",
      url: "https://www.motor1.com/reviews/597481/2022-toyota-gr86-review/",
      kind: "reference"
    },
    {
      id: "src3",
      title: "2022 Toyota GR86 review",
      publisher: "Edmunds",
      url: "https://www.edmunds.com/toyota/gr86/2022/review/",
      kind: "road-test"
    },
    {
      id: "src4",
      title: "2022 Toyota GR86 Premium test drive review",
      publisher: "KSL Cars",
      url: "https://cars.ksl.com/resources/car-review/2022-toyota-gr86-premium-test-drive-review",
      kind: "reference"
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
        zeroTo60MphS: 6.1
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2022"
    },
    {
      id: "cd-ksl",
      sourceId: "src4",
      publication: "Car and Driver (as cited by KSL Cars)",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 5.4
      },
      conditions: {},
      match: "exact",
      verification: "Second-hand citation; not confirmed on the Car and Driver page.",
      date: "2022"
    }
  ],
  dataGaps: [
    "Gear ratios and final drive",
    "Car and Driver original test (¼-mile figures unclear)",
    "Power/torque rpm",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "2022-toyota-gr86-premium-us-coupe-rwd-6mt",
  make: "Toyota",
  model: "GR86",
  trim: "Premium",
  modelYear: 2022,
  market: "US",
  body: "Coupe",
  shortName: "Toyota GR86 Premium (manual)"
}, {
    engine: { code: 'FA24D', description: '2.4 L flat-4, D-4S', displacementCc: 2387, aspiration: 'na', idleRpm: 700, redlineRpm: 7400, revLimitRpm: 7500, power: { value: 228, unit: 'hp', rpm: [7000, 7000] }, torque: { value: 184, unit: 'lb-ft', rpm: [3700, 3700] }, lowEndFraction: 0.78 },
    transmission: { type: 'manual', name: '6-speed manual', gearRatios: [3.626, 2.188, 1.541, 1.213, 1.0, 0.767], finalDrive: 4.3 },
    drivetrain: { layout: 'RWD', description: 'Rear-wheel drive, Torsen limited-slip differential' },
    chassis: { curbMassKg: 1285, frontWeightFraction: 0.53, wheelbaseM: 2.575, lengthMm: 4265, widthMm: 1775, heightMm: 1310 },
    aero: {},
    tires: { sizes: [square('r18', '215/40 R18', 215, 40, 18, 'Michelin Pilot Sport 4 (Premium)')], compound: 'uhp', gripScale: 1.3 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.30 (fit bound)', status: 'estimated', source: 'Fit toward the Edmunds 0–60 mph 6.1 s stopped at the bound (sim 6.22 s)' },
      { parameter: 'Peak power', value: '228 hp @ 7,000', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Peak torque', value: '184 lb-ft @ 3,700 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Gear ratios', value: '3.626/2.188/1.541/1.213/1.000/0.767', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Final drive', value: '4.300', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '2,833 lb (1,285 kg)', status: 'reported', source: 'Autoblog listing (other listings 2,811–2,868 lb)', url: 'https://www.autoblog.com/2022/04/26/2022-toyota-gr86-road-test/' },
      { parameter: 'Tire size', value: '215/40 R18', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
