import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #2: 2024 Acura Integra Type S (US). */
export const entry: CatalogEntry = {
  id: "2024-acura-integra-type-s-us-liftback-fwd-6mt",
  roster: 2,
  section: "Hot hatches",
  make: "Acura",
  model: "Integra",
  trim: "Type S",
  modelYear: 2024,
  market: "US",
  body: "Liftback",
  bodyLabel: "5-door liftback",
  chassisCode: "DE5",
  aliases: [
    "Integra Type S",
    "DE5"
  ],
  origin: "Japan",
  usage: [
    "Hot Hatch",
    "Sport Compact"
  ],
  drive: "FWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "2.0 turbo I4 (K20C1)",
  modelPath: "MT",
  factory: {
    power: "320 hp",
    torque: "310 lb-ft",
    curbMass: "3,219 lb (listing)",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2024 Acura Integra Type S drive",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a44212736/2024-acura-integra-type-s-drive/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2024 Acura Integra review",
      publisher: "Autoblog",
      url: "https://autoblog.com/buy/2024-Acura-Integra/review/",
      kind: "reference"
    }
  ],
  benchmarks: [],
  dataGaps: [
    "Instrumented test results",
    "Gear ratios and final drive (assumed shared with Civic Type R)",
    "Power/torque rpm",
    "Weight distribution",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "2024-acura-integra-type-s-us-liftback-fwd-6mt",
  make: "Acura",
  model: "Integra",
  trim: "Type S",
  modelYear: 2024,
  market: "US",
  body: "Liftback",
  shortName: "Acura Integra Type S"
}, {
    engine: { code: 'K20C1', description: '2.0 L turbo I4, VTC', displacementCc: 1996, aspiration: 'turbo', idleRpm: 750, redlineRpm: 7000, revLimitRpm: 7000, power: { value: 320, unit: 'hp', rpm: [6500, 6500] }, torque: { value: 310, unit: 'lb-ft', rpm: [2600, 4000] }, peakBoostBar: 1.6 },
    transmission: { type: 'manual', name: '6-speed manual', gearRatios: [3.62, 2.12, 1.53, 1.12, 0.91, 0.73], finalDrive: 3.84 },
    drivetrain: { layout: 'FWD', description: 'Front-wheel drive, helical limited-slip differential' },
    chassis: { curbMassKg: 1460, frontWeightFraction: 0.62, wheelbaseM: 2.735, lengthMm: 4725, widthMm: 1900, heightMm: 1405 },
    aero: {},
    tires: { sizes: [square('r19', '265/30 R19', 265, 30, 19, 'Michelin Pilot Sport 4S (assumed)')], compound: 'uhp', gripScale: 1.15 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.15', status: 'estimated', source: 'No launch benchmark for this car: median of the fitted front-drive cars (Camry, Elantra N, Octavia)' },
      { parameter: 'Peak power', value: '320 hp @ 6,500', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Peak torque', value: '310 lb-ft @ 2,600–4,000 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Gear ratios', value: '3.62/…/0.73 (Civic Type R set)', status: 'estimated', source: 'Car and Driver reports the Type S shares the Type R six-speed; ratios assumed identical — awaiting spec sheet' },
      { parameter: 'Final drive', value: '3.84', status: 'estimated', source: 'Assumed equal to the Civic Type R — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '3,219 lb (1,460 kg)', status: 'reported', source: 'Autoblog listing (trim not stated)', url: 'https://autoblog.com/buy/2024-Acura-Integra/review/' },
      { parameter: 'Tire size', value: '265/30 R19', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
