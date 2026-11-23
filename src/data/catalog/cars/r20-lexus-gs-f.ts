import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #20: 2016 Lexus GS F GS F (US). */
export const entry: CatalogEntry = {
  id: "2016-lexus-gs-f-us-sedan-rwd-8at",
  roster: 20,
  section: "Luxury and sport sedans",
  make: "Lexus",
  model: "GS F",
  trim: "GS F",
  modelYear: 2016,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "L10",
  aliases: [
    "GSF",
    "L10"
  ],
  origin: "Japan",
  usage: [
    "Sport Sedan",
    "Luxury",
    "Track"
  ],
  drive: "RWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic",
  powertrain: "Petrol",
  engineLabel: "5.0 V8 (2UR-GSE)",
  modelPath: "Existing",
  factory: {
    power: "467 hp @ 7,100 rpm",
    torque: "389 lb-ft @ 4,800–5,600 rpm",
    zeroTo60MphS: 4.5,
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2016 Lexus GS F test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15102088/2016-lexus-gs-f-test-review/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "GS F 0–60 times",
      publisher: "0-60specs",
      url: "https://www.0-60specs.com/lexus/gs-f-0-60-times",
      kind: "reference"
    },
    {
      id: "src3",
      title: "Motor Trend GS F review (forum transcription)",
      publisher: "Club Lexus",
      url: "https://www.clublexus.com/forums/gs-f-2016-present/807172-motor-trend-gsf-review.html",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "cd-agg",
      sourceId: "src2",
      publication: "Car and Driver (as listed by 0-60specs)",
      timing: "unconfirmed",
      timingNote: "Car and Driver test published before its late-2019 move to a 1-ft rollout; the earlier procedure is not confirmed here, so both simulator bases are shown.",
      results: {
        zeroTo60MphS: 4.4,
        quarterMileS: 12.9,
        quarterMileTrapMph: 113
      },
      conditions: {},
      match: "exact",
      verification: "Aggregator listing that attributes the run to the publication; original page not reachable.",
      date: "2016"
    },
    {
      id: "mt",
      sourceId: "src3",
      publication: "MotorTrend",
      timing: "rollout-1ft",
      timingNote: "MotorTrend subtracts a 1-ft rollout from its acceleration times.",
      results: {
        zeroTo60MphS: 4.5,
        quarterMileS: 12.9,
        quarterMileTrapMph: 110.9
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment). Figures transcribed on a forum.",
      date: "2015"
    }
  ],
  dataGaps: [
    "Car and Driver page itself",
    "8-speed ratios and final drive for the GS F",
    "Tire size",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "2016-lexus-gs-f-us-sedan-rwd-8at",
  make: "Lexus",
  model: "GS F",
  trim: "GS F",
  modelYear: 2016,
  market: "US",
  body: "Sedan",
  shortName: "Lexus GS F"
}, {
    engine: { code: '2UR-GSE', description: '5.0 L V8, D-4S', displacementCc: 4969, aspiration: 'na', idleRpm: 650, redlineRpm: 7300, revLimitRpm: 7300, power: { value: 467, unit: 'hp', rpm: [7100, 7100] }, torque: { value: 389, unit: 'lb-ft', rpm: [4800, 5600] }, lowEndFraction: 0.7 },
    transmission: { type: 'torque-converter-automatic', name: '8-speed Sport Direct Shift (AA80E family)', gearRatios: [4.596, 2.724, 1.863, 1.464, 1.231, 1.0, 0.824, 0.685], finalDrive: 2.937, upshiftTimeS: 0.25, shiftTorqueDip: 0.35, torqueConverter: { stallRpm: 2400 } },
    drivetrain: { layout: 'RWD', efficiency: 0.823, description: 'Rear-wheel drive with Torque Vectoring Differential' },
    chassis: { curbMassKg: 1830, frontWeightFraction: 0.54, wheelbaseM: 2.85, lengthMm: 4915, widthMm: 1845, heightMm: 1440 },
    aero: {},
    tires: { sizes: [staggered('r19', '255/35 R19 F · 275/35 R19 R', { widthMm: 255, aspectPct: 35, rimIn: 19 }, { widthMm: 275, aspectPct: 35, rimIn: 19 }, 'GS F fitment (assumed)')], compound: 'uhp', gripScale: 1.12 },
    speedLimiterKmh: null,
    factory: { zeroTo60MphS: 4.5 },
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.12', status: 'estimated', source: 'Fitted to Car and Driver 0–60 mph 4.4 s (aggregator-listed)' },
      { parameter: 'Drivetrain efficiency', value: '82.3 %', status: 'estimated', source: 'Fitted to the 113 mph trap; held-out ET 12.80 s vs 12.9 s' },
      { parameter: 'Peak power', value: '467 hp @ 7,100 rpm', status: 'reported', source: 'Lexus rating (multiple reviews)', url: 'https://www.edmunds.com/lexus/gs-f/2016/review' },
      { parameter: 'Peak torque', value: '389 lb-ft @ 4,800–5,600 rpm', status: 'reported', source: 'Lexus rating (multiple reviews)', url: 'https://www.edmunds.com/lexus/gs-f/2016/review' },
      { parameter: 'Gear ratios', value: '4.596/…/0.685 (AA80E family)', status: 'estimated', source: 'AA80E family set (verified on the IS); GS F application not confirmed — awaiting spec sheet' },
      { parameter: 'Final drive', value: '2.937', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '4,034 lb (1,830 kg) as tested', status: 'reported', source: 'Aggregator listing of the Car and Driver test car', url: 'https://www.0-60specs.com/lexus/gs-f-0-60-times' },
      { parameter: 'Tire size', value: '255/35 R19 F, 275/35 R19 R', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
