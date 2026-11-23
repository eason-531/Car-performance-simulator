import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #49: 2022 Porsche 718 Cayman GT4 RS GT4 RS (US). */
export const entry: CatalogEntry = {
  id: "2022-porsche-718-cayman-gt4-rs-us-coupe-rwd-7dct",
  roster: 49,
  section: "Sports cars",
  make: "Porsche",
  model: "718 Cayman GT4 RS",
  trim: "GT4 RS",
  modelYear: 2022,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "982",
  aliases: [
    "GT4RS",
    "Cayman",
    "982"
  ],
  origin: "Germany",
  usage: [
    "Sports Car",
    "Track"
  ],
  drive: "RWD",
  transmission: "DCT",
  transmissionLabel: "7-speed PDK",
  powertrain: "Petrol",
  engineLabel: "4.0 flat-6 (MA1.75 GT)",
  modelPath: "Existing",
  factory: {
    power: "493 hp",
    torque: "331 lb-ft",
    curbMass: "3,227 lb",
    topSpeed: "196 mph (track)",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2022 Porsche 718 Cayman GT4 RS tested",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/news/a39725088/2022-porsche-718-cayman-gt4-rs-tested/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2022 Porsche 718 Cayman GT4 RS road test",
      publisher: "MotorWeek",
      url: "https://motorweek.org/road_tests/2022-porsche-cayman-gt4-rs",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "718 Cayman GT4 RS technical data (US)",
      publisher: "Porsche",
      url: "https://download.newsroom.porsche.com/dam/jcr:c84793f0-4df0-4f82-830b-24f76f543988/718%20Cayman%20GT4%20RS%20Technical%20Data.pdf",
      kind: "manufacturer"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "test",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo30MphS: 1.1,
        zeroTo60MphS: 2.8,
        quarterMileS: 11.0,
        quarterMileTrapMph: 126
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment). Read from a secondary repost of the test.",
      date: "2022"
    },
    {
      id: "motorweek",
      sourceId: "src2",
      publication: "MotorWeek",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 3.2,
        quarterMileS: 11.6,
        quarterMileTrapMph: 128
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2022"
    }
  ],
  dataGaps: [
    "1st–6th PDK ratios (GT3 set per forum report)",
    "Tire model",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "2022-porsche-718-cayman-gt4-rs-us-coupe-rwd-7dct",
  make: "Porsche",
  model: "718 Cayman GT4 RS",
  trim: "GT4 RS",
  modelYear: 2022,
  market: "US",
  body: "Coupe",
  shortName: "Porsche Cayman GT4 RS"
}, {
    engine: { code: '4.0 flat-6 (GT)', description: '4.0 L naturally aspirated flat-6', displacementCc: 3996, aspiration: 'na', idleRpm: 800, redlineRpm: 9000, revLimitRpm: 9000, power: { value: 493, unit: 'hp', rpm: [8400, 8400] }, torque: { value: 331, unit: 'lb-ft', rpm: [6750, 6750] }, lowEndFraction: 0.62, topEndPowerFraction: 0.97 },
    transmission: { type: 'dual-clutch', name: '7-speed PDK', gearRatios: [3.75, 2.38, 1.72, 1.34, 1.11, 0.96, 0.84], finalDrive: 4.17, upshiftTimeS: 0.12, shiftTorqueDip: 0.12, launchClutch: { launchRpm: 6500, brakeHoldRpmLimit: 6500 } },
    drivetrain: { layout: 'RWD', efficiency: 0.863, description: 'Rear-wheel drive with Porsche Torque Vectoring Plus (electronic LSD)' },
    chassis: { curbMassKg: 1464, frontWeightFraction: 0.44, cgHeightM: 0.43, wheelbaseM: 2.457, lengthMm: 4456, widthMm: 1824, heightMm: 1267 },
    aero: {},
    tires: { sizes: [staggered('r20', '245/35 R20 F · 295/30 R20 R', { widthMm: 245, aspectPct: 35, rimIn: 20 }, { widthMm: 295, aspectPct: 30, rimIn: 20 }, 'Michelin Pilot Sport Cup 2 (assumed)')], compound: 'semi-slick', gripScale: 1.3 },
    speedLimiterKmh: 315,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.30 (fit bound)', status: 'estimated', source: 'Fit toward the Car and Driver 0–60 mph 2.8 s stopped at the 1.30 bound (sim 2.88 s); residual shown rather than widening the bound' },
      { parameter: 'Drivetrain efficiency', value: '86.3 %', status: 'estimated', source: 'Fitted to the Car and Driver ¼-mile trap 126 mph' },
      { parameter: 'Peak power', value: '493 hp', status: 'reported', source: 'Porsche rating (multiple sources)', url: 'https://motorweek.org/road_tests/2022-porsche-cayman-gt4-rs' },
      { parameter: 'Peak torque', value: '331 lb-ft', status: 'reported', source: 'Porsche rating (multiple sources)', url: 'https://motorweek.org/road_tests/2022-porsche-cayman-gt4-rs' },
      { parameter: 'Power / torque rpm', value: '8,400 / 6,750 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Gear ratios', value: '3.75/2.38/1.72/1.34/1.11/0.96/0.84', status: 'reported', source: '7th gear 0.84 from Porsche US technical data; forum reports the GT3 PDK set is shared', url: 'https://download.newsroom.porsche.com/dam/jcr:c84793f0-4df0-4f82-830b-24f76f543988/718%20Cayman%20GT4%20RS%20Technical%20Data.pdf' },
      { parameter: 'Final drive', value: '4.17', status: 'verified', source: 'Porsche US technical data', url: 'https://download.newsroom.porsche.com/dam/jcr:c84793f0-4df0-4f82-830b-24f76f543988/718%20Cayman%20GT4%20RS%20Technical%20Data.pdf' },
      { parameter: 'Curb mass', value: '3,227 lb (1,464 kg); 3,205 lb with magnesium wheels', status: 'reported', source: 'Specification listings' },
      { parameter: 'Tire compound', value: 'Track semi-slick class', status: 'estimated', source: 'GT4 RS ships on Michelin Pilot Sport Cup 2 (not verified here)' },
      { parameter: 'Launch rpm', value: '≈6,500 rpm', status: 'estimated', source: 'Porsche GT launch-control behaviour (6,500 rpm reported for the GT3 Touring)' },
    ],
  }),
};
