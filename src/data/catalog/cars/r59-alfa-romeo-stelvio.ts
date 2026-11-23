import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #59: 2018 Alfa Romeo Stelvio Quadrifoglio (US). */
export const entry: CatalogEntry = {
  id: "2018-alfa-romeo-stelvio-quadrifoglio-us-suv-awd-8at",
  roster: 59,
  section: "SUVs and pickups",
  make: "Alfa Romeo",
  model: "Stelvio",
  trim: "Quadrifoglio",
  modelYear: 2018,
  market: "US",
  body: "SUV",
  bodyLabel: "SUV",
  chassisCode: "949",
  aliases: [
    "Stelvio QV",
    "Quadrifoglio",
    "949",
    "Alfa"
  ],
  origin: "Italy",
  usage: [
    "SUV"
  ],
  drive: "AWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic",
  powertrain: "Petrol",
  engineLabel: "2.9 twin-turbo V6",
  modelPath: "Existing",
  factory: {
    power: "505 hp",
    torque: "443 lb-ft",
    curbMass: "4,360 lb",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2018 Alfa Romeo Stelvio Quadrifoglio (Best Driver’s Car)",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/news/alfa-romeo-stelvio-quadrifoglio-2018-best-drivers-car-contender",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2018 Alfa Romeo Stelvio review",
      publisher: "Autoblog",
      url: "https://www.autoblog.com/buy/2018-Alfa+Romeo-Stelvio/review/",
      kind: "reference"
    },
    {
      id: "src3",
      title: "The 2018 Alfa Romeo Stelvio Quadrifoglio Thinks It's a Sports Sedan",
      publisher: "Yahoo Autos (syndicated; outlet inferred)",
      url: "https://autos.yahoo.com/2018-alfa-romeo-stelvio-quadrifoglio-204500570.html",
      kind: "road-test"
    },
    {
      id: "src4",
      title: "2018 Alfa Romeo Stelvio Quadrifoglio, driven (hard)",
      publisher: "The Drive",
      url: "https://www.thedrive.com/new-cars/20871/2018-alfa-romeo-stelvio-quadrifoglio-review-a-sport-sedan-in-suv-disguise",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "synd",
      sourceId: "src3",
      publication: "Instrumented test syndicated on Yahoo Autos (likely Car and Driver)",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 3.4,
        quarterMileS: 12.0,
        quarterMileTrapMph: 115
      },
      conditions: {},
      match: "exact",
      verification: "Syndicated copy of the article (original page not reachable from this environment). Outlet not named on the page.",
      date: "2018"
    },
    {
      id: "mt",
      sourceId: "src4",
      publication: "MotorTrend (as cited by The Drive)",
      timing: "rollout-1ft",
      timingNote: "MotorTrend subtracts a 1-ft rollout from its acceleration times.",
      results: {
        zeroTo60MphS: 3.3,
        quarterMileS: 11.8,
        quarterMileTrapMph: 117
      },
      conditions: {},
      match: "exact",
      verification: "Second-hand citation; trap speed from a separate summary of the same California test.",
      date: "2018"
    }
  ],
  dataGaps: [
    "Final drive",
    "8HP ratios for this application",
    "Power/torque rpm",
    "Tire size",
    "Drag coefficient",
    "Original test pages"
  ],
  notes: [
    "Alfa Romeo quotes 3.6 s to 60 mph."
  ],
  sim: buildSpec({
  id: "2018-alfa-romeo-stelvio-quadrifoglio-us-suv-awd-8at",
  make: "Alfa Romeo",
  model: "Stelvio",
  trim: "Quadrifoglio",
  modelYear: 2018,
  market: "US",
  body: "SUV",
  shortName: "Alfa Romeo Stelvio Quadrifoglio"
}, {
    engine: { code: '690T', description: '2.9 L twin-turbo V6', displacementCc: 2891, aspiration: 'twin-turbo', idleRpm: 700, redlineRpm: 7000, revLimitRpm: 7200, power: { value: 505, unit: 'hp', rpm: [6500, 6500] }, torque: { value: 443, unit: 'lb-ft', rpm: [2500, 5500] }, peakBoostBar: 1.4 },
    transmission: { type: 'torque-converter-automatic', name: '8-speed automatic (ZF 8HP)', gearRatios: [5.0, 3.2, 2.143, 1.72, 1.313, 1.0, 0.823, 0.64], finalDrive: 3.09, upshiftTimeS: 0.18, downshiftTimeS: 0.28, shiftTorqueDip: 0.3, torqueConverter: { stallRpm: 2500 } },
    drivetrain: { layout: 'AWD', efficiency: 0.861, description: 'Q4 rear-biased AWD (up to 50 % front)', frontShareRange: [0, 0.5] },
    chassis: { curbMassKg: 1978, frontWeightFraction: 0.5, wheelbaseM: 2.818, lengthMm: 4702, widthMm: 1955, heightMm: 1681 },
    aero: {},
    tires: { sizes: [staggered('r20', '255/45 R20 F · 285/40 R20 R', { widthMm: 255, aspectPct: 45, rimIn: 20 }, { widthMm: 285, aspectPct: 40, rimIn: 20 }, 'Pirelli P Zero Corsa (assumed)')], compound: 'uhp', gripScale: 1.06 },
    speedLimiterKmh: null,
    factory: { zeroTo60MphS: 3.6 },
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.06', status: 'estimated', source: 'Fitted to the 0–60 mph 3.4 s of the syndicated instrumented test' },
      { parameter: 'Drivetrain efficiency', value: '86.1 %', status: 'estimated', source: 'Fitted to the ¼-mile trap 115 mph of the same test' },
      { parameter: 'Peak power', value: '505 hp', status: 'reported', source: 'Alfa Romeo rating (Autoblog listing)', url: 'https://www.autoblog.com/buy/2018-Alfa+Romeo-Stelvio/review/' },
      { parameter: 'Peak torque', value: '443 lb-ft', status: 'reported', source: 'Alfa Romeo rating (Autoblog listing)', url: 'https://www.autoblog.com/buy/2018-Alfa+Romeo-Stelvio/review/' },
      { parameter: 'Power / torque rpm', value: '6,500 / 2,500–5,500 rpm', status: 'estimated', source: 'Same 690T rating as the Giulia Quadrifoglio — recalled, not verified' },
      { parameter: 'Gear ratios', value: '5.000/…/0.640 (ZF 8HP)', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Final drive', value: '3.09', status: 'estimated', source: 'Assumed equal to the Giulia Quadrifoglio — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '4,360 lb (1,978 kg)', status: 'reported', source: 'Autoblog listing (matches the Alfa claim quoted by The Drive)', url: 'https://www.autoblog.com/buy/2018-Alfa+Romeo-Stelvio/review/' },
      { parameter: 'Tire size', value: '255/45 R20 F · 285/40 R20 R', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
