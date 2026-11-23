import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #7: 2019 Hyundai Veloster N Performance Package (US). */
export const entry: CatalogEntry = {
  id: "2019-hyundai-veloster-n-performance-package-us-hatch-fwd-6mt",
  roster: 7,
  section: "Hot hatches",
  make: "Hyundai",
  model: "Veloster N",
  trim: "Performance Package",
  modelYear: 2019,
  market: "US",
  body: "Hatchback",
  bodyLabel: "3-door hatchback (3+1)",
  chassisCode: "JS",
  aliases: [
    "Veloster N",
    "JS"
  ],
  origin: "South Korea",
  usage: [
    "Hot Hatch",
    "Sport Compact"
  ],
  drive: "FWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "2.0 turbo I4 (Theta II)",
  modelPath: "MT",
  factory: {
    power: "275 hp",
    torque: "260 lb-ft",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2019 Hyundai Veloster N long-term test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a28270052/2019-hyundai-veloster-n-reliability-maintenance/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2019 Hyundai Veloster N review",
      publisher: "Motor1",
      url: "https://www.motor1.com/reviews/348290/2019-hyundai-veloster-n-review/",
      kind: "reference"
    },
    {
      id: "src3",
      title: "2019 Hyundai Veloster N specifications",
      publisher: "Carspecs",
      url: "https://www.carspecs.us/cars/2019/hyundai/veloster/81921",
      kind: "reference"
    },
    {
      id: "src4",
      title: "2019 Hyundai Veloster N review",
      publisher: "DoubleClutch.ca",
      url: "https://doubleclutch.ca/?p=60189",
      kind: "reference"
    }
  ],
  benchmarks: [],
  dataGaps: [
    "Instrumented test results (Car and Driver 2019 manual)",
    "Curb mass",
    "Final drive (conflicting sources)",
    "Power/torque rpm",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "2019-hyundai-veloster-n-performance-package-us-hatch-fwd-6mt",
  make: "Hyundai",
  model: "Veloster N",
  trim: "Performance Package",
  modelYear: 2019,
  market: "US",
  body: "Hatchback",
  shortName: "Hyundai Veloster N Performance Package"
}, {
    engine: { code: 'Theta II 2.0 T-GDi', description: '2.0 L turbo I4', displacementCc: 1998, aspiration: 'turbo', idleRpm: 750, redlineRpm: 6750, revLimitRpm: 6750, power: { value: 275, unit: 'hp', rpm: [6000, 6000] }, torque: { value: 260, unit: 'lb-ft', rpm: [1450, 4700] }, peakBoostBar: 1.3 },
    transmission: { type: 'manual', name: '6-speed manual', gearRatios: [3.08, 1.93, 1.7, 1.28, 1.03, 0.85], finalDrive: [4.333, 4.333, 3.25, 3.25, 3.25, 3.25] },
    drivetrain: { layout: 'FWD', description: 'Front-wheel drive, electronic limited-slip differential (Performance Package)' },
    chassis: { curbMassKg: 1409, frontWeightFraction: 0.62, wheelbaseM: 2.65, lengthMm: 4265, widthMm: 1800, heightMm: 1399 },
    aero: {},
    tires: { sizes: [square('r19', '235/35 R19', 235, 35, 19, 'Pirelli P Zero (Performance Package)')], compound: 'uhp', gripScale: 1.15 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.15', status: 'estimated', source: 'No launch benchmark for this car: median of the fitted front-drive cars (Camry, Elantra N, Octavia)' },
      { parameter: 'Peak power', value: '275 hp', status: 'reported', source: 'Hyundai rating (Motor1)', url: 'https://www.motor1.com/reviews/348290/2019-hyundai-veloster-n-review/' },
      { parameter: 'Peak torque', value: '260 lb-ft', status: 'reported', source: 'Hyundai rating (Motor1)', url: 'https://www.motor1.com/reviews/348290/2019-hyundai-veloster-n-review/' },
      { parameter: 'Power / torque rpm', value: '6,000 / 1,450–4,700 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Gear ratios', value: '3.08/1.93/1.70/1.28/1.03/0.85', status: 'reported', source: 'Carspecs and Motor Matchup agree', url: 'https://www.carspecs.us/cars/2019/hyundai/veloster/81921' },
      { parameter: 'Final drive', value: '4.333 (1st, 2nd) / 3.250 (3rd–6th)', status: 'reported', source: 'DoubleClutch review; spec databases list a single 4.15, which would leave an implausibly small 2–3 step', url: 'https://doubleclutch.ca/?p=60189' },
      { parameter: 'Curb mass', value: '≈3,106 lb (1,409 kg)', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Tire size', value: '235/35 R19', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
