import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #21: 2022 Lexus IS 500 F Sport Performance Premium (US). */
export const entry: CatalogEntry = {
  id: "2022-lexus-is-500-f-sport-performance-premium-us-sedan-rwd-8at",
  roster: 21,
  section: "Luxury and sport sedans",
  make: "Lexus",
  model: "IS 500",
  trim: "F Sport Performance Premium",
  modelYear: 2022,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "XE30",
  aliases: [
    "IS500",
    "XE30"
  ],
  origin: "Japan",
  usage: [
    "Sport Sedan",
    "Luxury"
  ],
  drive: "RWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic",
  powertrain: "Petrol",
  engineLabel: "5.0 V8 (2UR-GSE)",
  modelPath: "Existing",
  factory: {
    power: "472 hp",
    torque: "395 lb-ft",
    zeroTo60MphS: 4.4,
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2022 Lexus IS500 F Sport Performance by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a37418797/2022-lexus-is500-f-sport-performance-by-the-numbers/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2022 Lexus IS 500 F Sport Performance press release",
      publisher: "Lexus",
      url: "https://pressroom.lexus.com/2022-lexus-is-500-f-sport-performance-the-is-sports-sedan-unleashed/",
      kind: "manufacturer"
    },
    {
      id: "src3",
      title: "2022 Lexus IS 500 F Sport Performance road test",
      publisher: "MotorWeek",
      url: "https://motorweek.org/road_tests/2022-lexus-is-500-f-sport-performance",
      kind: "road-test"
    }
  ],
  benchmarks: [],
  dataGaps: [
    "Car and Driver test results (linked page unreachable; MotorWeek figures not in search summary)",
    "Curb mass",
    "8-speed ratios and final drive",
    "Tire size",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "2022-lexus-is-500-f-sport-performance-premium-us-sedan-rwd-8at",
  make: "Lexus",
  model: "IS 500",
  trim: "F Sport Performance Premium",
  modelYear: 2022,
  market: "US",
  body: "Sedan",
  shortName: "Lexus IS 500 F Sport"
}, {
    engine: { code: '2UR-GSE', description: '5.0 L V8, D-4S', displacementCc: 4969, aspiration: 'na', idleRpm: 650, redlineRpm: 7300, revLimitRpm: 7300, power: { value: 472, unit: 'hp', rpm: [7100, 7100] }, torque: { value: 395, unit: 'lb-ft', rpm: [4800, 4800] }, lowEndFraction: 0.72 },
    transmission: { type: 'torque-converter-automatic', name: '8-speed Sport Direct Shift (AA80E family)', gearRatios: [4.596, 2.724, 1.863, 1.464, 1.231, 1.0, 0.824, 0.685], finalDrive: 3.133, upshiftTimeS: 0.28, shiftTorqueDip: 0.38, torqueConverter: { stallRpm: 2400 } },
    drivetrain: { layout: 'RWD', efficiency: 0.823, description: 'Rear-wheel drive with Torsen limited-slip differential' },
    chassis: { curbMassKg: 1765, frontWeightFraction: 0.55, wheelbaseM: 2.8, lengthMm: 4710, widthMm: 1840, heightMm: 1435 },
    aero: {},
    tires: { sizes: [staggered('r19', '235/40 R19 F · 265/35 R19 R', { widthMm: 235, aspectPct: 40, rimIn: 19 }, { widthMm: 265, aspectPct: 35, rimIn: 19 }, 'F Sport Performance fitment (assumed)')], compound: 'oe-performance', gripScale: 1.12 },
    speedLimiterKmh: null,
    factory: { zeroTo60MphS: 4.4 },
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.12', status: 'estimated', source: 'Transferred from the GS F fit (same 2UR-GSE V8 and 8-speed); no IS 500 benchmark reached' },
      { parameter: 'Drivetrain efficiency', value: '82.3 %', status: 'estimated', source: 'Transferred from the GS F fit' },
      { parameter: 'Peak power', value: '472 hp', status: 'verified', source: 'Lexus press release', url: 'https://pressroom.lexus.com/2022-lexus-is-500-f-sport-performance-the-is-sports-sedan-unleashed/' },
      { parameter: 'Peak torque', value: '395 lb-ft', status: 'verified', source: 'Lexus press release', url: 'https://pressroom.lexus.com/2022-lexus-is-500-f-sport-performance-the-is-sports-sedan-unleashed/' },
      { parameter: 'Power / torque rpm', value: '7,100 / 4,800 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Gear ratios', value: '4.596/…/0.685 (AA80E family)', status: 'estimated', source: 'AA80E family set; IS 500 application not confirmed — awaiting spec sheet' },
      { parameter: 'Final drive', value: '3.133', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '≈3,891 lb (1,765 kg)', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Tire size', value: '235/40 R19 F, 265/35 R19 R', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
