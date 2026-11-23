import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #55: 2018 Chevrolet Camaro ZL1 1LE (US). */
export const entry: CatalogEntry = {
  id: "2018-chevrolet-camaro-zl1-1le-us-coupe-rwd-6mt",
  roster: 55,
  section: "American performance",
  make: "Chevrolet",
  model: "Camaro",
  trim: "ZL1 1LE",
  modelYear: 2018,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "6th gen",
  aliases: [
    "ZL1",
    "1LE",
    "Camaro"
  ],
  origin: "United States",
  usage: [
    "Muscle",
    "Track"
  ],
  drive: "RWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "6.2 supercharged V8 (LT4)",
  modelPath: "MT",
  factory: {
    power: "650 hp",
    torque: "650 lb-ft",
    zeroTo60MphS: 3.6,
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2018 Chevrolet Camaro ZL1 1LE first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/features/2018-chevrolet-camaro-zl1-1le-first-test-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Chevrolet Camaro ZL1 1LE",
      publisher: "FastestLaps",
      url: "https://fastestlaps.com/models/chevrolet-camaro-g6-zl1-1le",
      kind: "reference"
    },
    {
      id: "src3",
      title: "2018 Chevrolet Camaro ZL1 1LE road test",
      publisher: "MotorWeek",
      url: "https://motorweek.org/road_tests/2018-chevrolet-camaro-zl1-1le",
      kind: "road-test"
    }
  ],
  benchmarks: [],
  dataGaps: [
    "MotorTrend first test (roster source)",
    "MotorWeek measured figures",
    "Gear ratios and final drive",
    "Power/torque rpm",
    "Tire size",
    "Drag coefficient"
  ],
  notes: [
    "A syndicated review projects 3.7 s and 11.9 s for the manual 1LE; it is an estimate, not a measured result, so it is not transcribed."
  ],
  sim: buildSpec({
  id: "2018-chevrolet-camaro-zl1-1le-us-coupe-rwd-6mt",
  make: "Chevrolet",
  model: "Camaro",
  trim: "ZL1 1LE",
  modelYear: 2018,
  market: "US",
  body: "Coupe",
  shortName: "Chevrolet Camaro ZL1 1LE"
}, {
    engine: { code: 'LT4', description: '6.2 L supercharged V8', displacementCc: 6162, aspiration: 'supercharged', idleRpm: 700, redlineRpm: 6500, revLimitRpm: 6500, power: { value: 650, unit: 'hp', rpm: [6400, 6400] }, torque: { value: 650, unit: 'lb-ft', rpm: [3600, 3600] }, peakBoostBar: 0.7, spoolScale: 0.25 },
    transmission: { type: 'manual', name: 'Tremec TR-6060 6-speed manual', gearRatios: [2.66, 1.78, 1.3, 1.0, 0.74, 0.5], finalDrive: 3.73 },
    drivetrain: { layout: 'RWD', description: 'Rear-wheel drive, electronic limited-slip differential' },
    chassis: { curbMassKg: 1733, frontWeightFraction: 0.54, wheelbaseM: 2.811, lengthMm: 4784, widthMm: 1905, heightMm: 1348 },
    aero: {},
    tires: { sizes: [staggered('r19', '305/30 R19 F · 325/30 R19 R', { widthMm: 305, aspectPct: 30, rimIn: 19 }, { widthMm: 325, aspectPct: 30, rimIn: 19 }, 'Goodyear Eagle F1 Supercar 3R (assumed)')], compound: 'semi-slick', gripScale: 1.3 },
    speedLimiterKmh: null,
    factory: { zeroTo60MphS: 3.6 },
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.30', status: 'estimated', source: 'No defensible launch benchmark for this car (no benchmark): median of the fitted rear-drive cars (1.30, which is also the fit bound)' },
      { parameter: 'Peak power', value: '650 hp @ 6,400', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Peak torque', value: '650 lb-ft @ 3,600 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Gear ratios', value: '2.66/1.78/1.30/1.00/0.74/0.50 (TR-6060)', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Final drive', value: '3.73', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '≈3,820 lb (1,733 kg)', status: 'reported', source: 'FastestLaps listing (3,821–3,887 lb)', url: 'https://fastestlaps.com/models/chevrolet-camaro-g6-zl1-1le' },
      { parameter: 'Tire size', value: '305/30 R19 F · 325/30 R19 R', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Tire compound', value: 'Track semi-slick class', status: 'estimated', source: '1LE ships on Goodyear Eagle F1 Supercar 3R (not verified here)' },
    ],
  }),
};
