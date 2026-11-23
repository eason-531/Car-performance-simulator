import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #24: 2022 Cadillac CT4-V Blackwing (US). */
export const entry: CatalogEntry = {
  id: "2022-cadillac-ct4-v-blackwing-us-sedan-rwd-6mt",
  roster: 24,
  section: "Luxury and sport sedans",
  make: "Cadillac",
  model: "CT4-V",
  trim: "Blackwing",
  modelYear: 2022,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "A2LL",
  aliases: [
    "CT4 Blackwing",
    "CT4-V"
  ],
  origin: "United States",
  usage: [
    "Sport Sedan",
    "Track"
  ],
  drive: "RWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "3.6 twin-turbo V6 (LF4)",
  modelPath: "MT",
  factory: {
    power: "472 hp",
    torque: "445 lb-ft",
    curbMass: "3,860 lb (manual)",
    zeroTo60MphS: 4.1,
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2022 Cadillac CT4-V Blackwing manual first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/features/2022-cadillac-ct4-v-blackwing-manual-first-test-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Cadillac CT4-V 2022 Blackwing specifications",
      publisher: "Auto123",
      url: "https://specs2.auto123.com/en/specs/cadillac/ct4-v/cadillac-ct4-v-2022-blackwing-4dr-sdn-419139",
      kind: "reference"
    }
  ],
  benchmarks: [],
  dataGaps: [
    "MotorTrend manual first-test results (roster source)",
    "Gear ratios and final drive (single listing)",
    "Power/torque rpm",
    "Tire size",
    "Drag coefficient"
  ],
  notes: [
    "Cadillac quotes 4.1 s to 60 mph with the manual (3.9 s automatic)."
  ],
  sim: buildSpec({
  id: "2022-cadillac-ct4-v-blackwing-us-sedan-rwd-6mt",
  make: "Cadillac",
  model: "CT4-V",
  trim: "Blackwing",
  modelYear: 2022,
  market: "US",
  body: "Sedan",
  shortName: "Cadillac CT4-V Blackwing (manual)"
}, {
    engine: { code: 'LF4', description: '3.6 L twin-turbo V6', displacementCc: 3564, aspiration: 'twin-turbo', idleRpm: 700, redlineRpm: 6500, revLimitRpm: 6500, power: { value: 472, unit: 'hp', rpm: [5750, 5750] }, torque: { value: 445, unit: 'lb-ft', rpm: [3500, 3500] }, peakBoostBar: 1.2 },
    transmission: { type: 'manual', name: '6-speed manual', gearRatios: [2.66, 1.78, 1.3, 1.0, 0.8, 0.63], finalDrive: 3.73 },
    drivetrain: { layout: 'RWD', description: 'Rear-wheel drive, electronic limited-slip differential' },
    chassis: { curbMassKg: 1751, frontWeightFraction: 0.52, wheelbaseM: 2.776, lengthMm: 4786, widthMm: 1815, heightMm: 1410 },
    aero: {},
    tires: { sizes: [staggered('r18', '255/35 R18 F · 275/35 R18 R', { widthMm: 255, aspectPct: 35, rimIn: 18 }, { widthMm: 275, aspectPct: 35, rimIn: 18 }, 'Michelin Pilot Sport 4S (assumed)')], compound: 'uhp', gripScale: 1.3 },
    speedLimiterKmh: null,
    factory: { zeroTo60MphS: 4.1 },
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.30', status: 'estimated', source: 'No defensible launch benchmark for this car (no benchmark): median of the fitted rear-drive cars (1.30, which is also the fit bound)' },
      { parameter: 'Peak power', value: '472 hp @ 5,750', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Peak torque', value: '445 lb-ft @ 3,500 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Gear ratios', value: '2.66/1.78/1.30/1.00/0.80/0.63 (Tremec TR6060)', status: 'reported', source: 'Auto123 specification listing (single source)', url: 'https://specs2.auto123.com/en/specs/cadillac/ct4-v/cadillac-ct4-v-2022-blackwing-4dr-sdn-419139' },
      { parameter: 'Final drive', value: '3.73', status: 'reported', source: 'Auto123 specification listing (single source)', url: 'https://specs2.auto123.com/en/specs/cadillac/ct4-v/cadillac-ct4-v-2022-blackwing-4dr-sdn-419139' },
      { parameter: 'Curb mass', value: '3,860 lb (1,751 kg), manual', status: 'reported', source: 'First-drive specification list', url: 'https://www.thedrive.com/new-cars/41696/2022-cadillac-ct4-v-blackwing-first-drive-review-american-performance-keeps-the-manual-alive' },
      { parameter: 'Tire size', value: '255/35 R18 F · 275/35 R18 R', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
