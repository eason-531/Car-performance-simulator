import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #23: 2022 Genesis G70 3.3T AWD (US). */
export const entry: CatalogEntry = {
  id: "2022-genesis-g70-3-3t-awd-us-sedan-awd-8at",
  roster: 23,
  section: "Luxury and sport sedans",
  make: "Genesis",
  model: "G70",
  trim: "3.3T AWD",
  modelYear: 2022,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "IK facelift",
  aliases: [
    "G70",
    "IK"
  ],
  origin: "South Korea",
  usage: [
    "Sport Sedan",
    "Luxury"
  ],
  drive: "AWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic",
  powertrain: "Petrol",
  engineLabel: "3.3 twin-turbo V6 (Lambda II)",
  modelPath: "Existing",
  factory: {
    power: "365 hp @ 6,000 rpm",
    torque: "376 lb-ft @ 1,300–4,500 rpm",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2022 Genesis G70 3.3T AWD first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2022-genesis-g70-33t-awd-first-test-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2022 Genesis G70 3.3T specs",
      publisher: "Cars.com",
      url: "https://www.cars.com/research/genesis-g70-2022/specs/421729/",
      kind: "reference"
    },
    {
      id: "src3",
      title: "2022 Genesis G70 0–60 times by trim",
      publisher: "carwhere",
      url: "https://www.carwhere.com/0-60-times/genesis/g70",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "motorweek",
      sourceId: "src3",
      publication: "MotorWeek (as listed by carwhere)",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 4.6
      },
      conditions: {},
      match: "equivalent",
      verification: "Aggregator listing that attributes the run to the publication; original page not reachable.",
      date: "2022",
      deviation: "Drivetrain of the test car not confirmed; MotorTrend linked test unreachable."
    }
  ],
  dataGaps: [
    "MotorTrend first-test results",
    "Curb mass and weight distribution",
    "8-speed ratios and final drive for the G70",
    "Tire size",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "2022-genesis-g70-3-3t-awd-us-sedan-awd-8at",
  make: "Genesis",
  model: "G70",
  trim: "3.3T AWD",
  modelYear: 2022,
  market: "US",
  body: "Sedan",
  shortName: "Genesis G70 3.3T AWD"
}, {
    engine: { code: 'Lambda II 3.3 T-GDi', description: '3.3 L twin-turbo V6', displacementCc: 3342, aspiration: 'twin-turbo', idleRpm: 650, redlineRpm: 6250, revLimitRpm: 6500, power: { value: 365, unit: 'hp', rpm: [6000, 6000] }, torque: { value: 376, unit: 'lb-ft', rpm: [1300, 4500] }, peakBoostBar: 1.0, lowEndFraction: 0.55 },
    transmission: { type: 'torque-converter-automatic', name: '8-speed automatic', gearRatios: [3.665, 2.396, 1.61, 1.19, 1.0, 0.826, 0.643, 0.556], finalDrive: 3.538, torqueConverter: { stallRpm: 2300 } },
    drivetrain: { layout: 'AWD', description: 'Rear-biased AWD', frontShareRange: [0, 0.5] },
    chassis: { curbMassKg: 1775, frontWeightFraction: 0.54, wheelbaseM: 2.835, lengthMm: 4685, widthMm: 1850, heightMm: 1400 },
    aero: {},
    tires: { sizes: [staggered('r19', '225/40 R19 F · 255/35 R19 R', { widthMm: 225, aspectPct: 40, rimIn: 19 }, { widthMm: 255, aspectPct: 35, rimIn: 19 }, '3.3T fitment (assumed)')], compound: 'oe-performance' },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Peak power', value: '365 hp @ 6,000 rpm', status: 'reported', source: 'Genesis rating (reviews)', url: 'https://www.cars.com/research/genesis-g70-2022/specs/421729/' },
      { parameter: 'Peak torque', value: '376 lb-ft @ 1,300–4,500 rpm', status: 'reported', source: 'Genesis rating (reviews)', url: 'https://www.cars.com/research/genesis-g70-2022/specs/421729/' },
      { parameter: 'Gear ratios', value: '3.665/2.396/1.610/1.190/1.000/0.826/0.643/0.556', status: 'estimated', source: 'Same 8-speed as the Stinger 3.3T (reported there); G70 application not confirmed' },
      { parameter: 'Final drive', value: '3.538', status: 'estimated', source: 'Stinger GT value; G70 application not confirmed' },
      { parameter: 'Curb mass', value: '≈3,913 lb (1,775 kg)', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Tire size', value: '225/40 R19 F, 255/35 R19 R', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
