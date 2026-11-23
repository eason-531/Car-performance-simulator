import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #48: 2023 BMW M2 Carbon Package 6MT (US). */
export const entry: CatalogEntry = {
  id: "2023-bmw-m2-carbon-package-6mt-us-coupe-rwd-6mt",
  roster: 48,
  section: "Sports cars",
  make: "BMW",
  model: "M2",
  trim: "Carbon Package 6MT",
  modelYear: 2023,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "G87",
  aliases: [
    "M2",
    "G87"
  ],
  origin: "Germany",
  usage: [
    "Sports Car",
    "Track"
  ],
  drive: "RWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "3.0 twin-turbo I6 (S58)",
  modelPath: "MT",
  factory: {
    power: "453 hp",
    torque: "406 lb-ft",
    curbMass: "3,814 lb (manual)",
    zeroTo60MphS: 4.2,
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2023 BMW M2 drive",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a43452901/2023-bmw-m2-drive/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2023 BMW M2 review",
      publisher: "The Drive",
      url: "https://thedrive.com/car-reviews/2023-bmw-m2-review",
      kind: "reference"
    },
    {
      id: "src3",
      title: "BMW M2 specifications",
      publisher: "TrueCar",
      url: "https://www.truecar.com/bmw/m2/specs/",
      kind: "reference"
    }
  ],
  benchmarks: [],
  dataGaps: [
    "Instrumented test of a 2023 manual M2",
    "Power/torque rpm",
    "Tire size",
    "Drag coefficient"
  ],
  notes: [
    "Edmunds tested a 2025 manual M2 (4.3 s, 12.2 s @ 117.4 mph), but that update adds 20 hp, so it is not used as a benchmark here."
  ],
  sim: buildSpec({
  id: "2023-bmw-m2-carbon-package-6mt-us-coupe-rwd-6mt",
  make: "BMW",
  model: "M2",
  trim: "Carbon Package 6MT",
  modelYear: 2023,
  market: "US",
  body: "Coupe",
  shortName: "BMW M2 (6-speed manual)"
}, {
    engine: { code: 'S58B30T0', description: '3.0 L twin-turbo I6', displacementCc: 2993, aspiration: 'twin-turbo', idleRpm: 700, redlineRpm: 7200, revLimitRpm: 7200, power: { value: 453, unit: 'hp', rpm: [6250, 6250] }, torque: { value: 406, unit: 'lb-ft', rpm: [2650, 5850] }, peakBoostBar: 1.7 },
    transmission: { type: 'manual', name: '6-speed manual', gearRatios: [4.11, 2.315, 1.542, 1.179, 1.0, 0.846], finalDrive: 3.462 },
    drivetrain: { layout: 'RWD', description: 'Rear-wheel drive, Active M Differential' },
    chassis: { curbMassKg: 1730, frontWeightFraction: 0.52, wheelbaseM: 2.747, lengthMm: 4580, widthMm: 1887, heightMm: 1403 },
    aero: {},
    tires: { sizes: [staggered('r19r20', '275/35 R19 F · 285/30 R20 R', { widthMm: 275, aspectPct: 35, rimIn: 19 }, { widthMm: 285, aspectPct: 30, rimIn: 20 }, 'Michelin Pilot Sport 4S (assumed)')], compound: 'uhp', gripScale: 1.3 },
    speedLimiterKmh: null,
    factory: { zeroTo60MphS: 4.2 },
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.30', status: 'estimated', source: 'No defensible launch benchmark for this car (no benchmark): median of the fitted rear-drive cars (1.30, which is also the fit bound)' },
      { parameter: 'Peak power', value: '453 hp @ 6,250', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Peak torque', value: '406 lb-ft @ 2,650–5,870 rpm (modelled to 5,850 rpm so the curve stays within the 453 hp rating)', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Gear ratios', value: '4.110/2.315/1.542/1.179/1.000/0.846', status: 'reported', source: 'BMW press tables (manual values in parentheses) and TrueCar', url: 'https://www.truecar.com/bmw/m2/specs/' },
      { parameter: 'Final drive', value: '3.462', status: 'reported', source: 'BMW press table (manual value in parentheses; reading inferred)', url: 'https://www.press.bmwgroup.com/global/article/detail/T0404444EN/' },
      { parameter: 'Curb mass', value: '3,814 lb (1,730 kg), manual', status: 'reported', source: 'The Drive and Hagerty', url: 'https://thedrive.com/car-reviews/2023-bmw-m2-review' },
      { parameter: 'Tire size', value: '275/35 R19 F · 285/30 R20 R', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
