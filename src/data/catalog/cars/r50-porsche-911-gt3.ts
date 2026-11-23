import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #50: 2022 Porsche 911 GT3 GT3 PDK (US). */
export const entry: CatalogEntry = {
  id: "2022-porsche-911-gt3-gt3-pdk-us-coupe-rwd-7dct",
  roster: 50,
  section: "Sports cars",
  make: "Porsche",
  model: "911 GT3",
  trim: "GT3 PDK",
  modelYear: 2022,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "992.1",
  aliases: [
    "GT3",
    "992",
    "911"
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
  engineLabel: "4.0 flat-6 (MA1.76 GT)",
  modelPath: "Existing",
  factory: {
    power: "502 hp",
    torque: "346 lb-ft",
    zeroTo60MphS: 3.2,
    topSpeed: "197 mph (track)",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2022 Porsche 911 GT3 drive",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a36164987/2022-porsche-911-gt3-drive/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "911 GT3 (PDK) technical data",
      publisher: "Porsche",
      url: "https://newsroom.porsche.com/dam/jcr:ca1882c7-1588-4a2e-995c-fe19ef1281fc/pag-911-gt3-pdk-en.pdf",
      kind: "manufacturer"
    },
    {
      id: "src3",
      title: "Tested: 2022 Porsche 911 GT3 PDK Rockets to 60 in 2.7 Seconds",
      publisher: "Car and Driver (Yahoo syndication)",
      url: "https://autos.yahoo.com/2022-porsche-911-gt3-leaves-220100613.html",
      kind: "road-test"
    },
    {
      id: "src4",
      title: "2022 Porsche 911 GT3 road test",
      publisher: "MotorWeek",
      url: "https://motorweek.org/road_tests/2022-porsche-911-gt3-2",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src3",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 2.7
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment). Quarter mile not in the summary.",
      date: "2021"
    },
    {
      id: "motorweek",
      sourceId: "src4",
      publication: "MotorWeek",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 2.8,
        quarterMileS: 10.9,
        quarterMileTrapMph: 127
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2021"
    }
  ],
  dataGaps: [
    "Final drive (4.19 / 4.54 / 3.97 conflict)",
    "Curb mass",
    "Car and Driver quarter-mile result",
    "Tire size and model",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "2022-porsche-911-gt3-gt3-pdk-us-coupe-rwd-7dct",
  make: "Porsche",
  model: "911 GT3",
  trim: "GT3 PDK",
  modelYear: 2022,
  market: "US",
  body: "Coupe",
  shortName: "Porsche 911 GT3 PDK"
}, {
    engine: { code: '4.0 flat-6 (GT)', description: '4.0 L naturally aspirated flat-6', displacementCc: 3996, aspiration: 'na', idleRpm: 800, redlineRpm: 9000, revLimitRpm: 9000, power: { value: 502, unit: 'hp', rpm: [8400, 8400] }, torque: { value: 346, unit: 'lb-ft', rpm: [6100, 6100] }, lowEndFraction: 0.62, topEndPowerFraction: 0.97 },
    transmission: { type: 'dual-clutch', name: '7-speed PDK', gearRatios: [3.75, 2.38, 1.72, 1.34, 1.11, 0.96, 0.84], finalDrive: 4.19, upshiftTimeS: 0.12, shiftTorqueDip: 0.12, launchClutch: { launchRpm: 6500, brakeHoldRpmLimit: 6500 } },
    drivetrain: { layout: 'RWD', efficiency: 0.852, description: 'Rear-wheel drive with electronic limited-slip differential (rear-engine)' },
    chassis: { curbMassKg: 1435, frontWeightFraction: 0.39, cgHeightM: 0.44, wheelbaseM: 2.457, lengthMm: 4573, widthMm: 1852, heightMm: 1279 },
    aero: {},
    tires: { sizes: [staggered('r20r21', '255/35 R20 F · 315/30 R21 R', { widthMm: 255, aspectPct: 35, rimIn: 20 }, { widthMm: 315, aspectPct: 30, rimIn: 21 }, 'Standard fitment (assumed)')], compound: 'uhp', gripScale: 1.3 },
    speedLimiterKmh: 318,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.30 (fit bound)', status: 'estimated', source: 'Fit toward the Car and Driver 0–60 mph 2.7 s stopped at the 1.30 bound (sim 2.88 s); residual shown rather than widening the bound' },
      { parameter: 'Drivetrain efficiency', value: '85.2 %', status: 'estimated', source: 'Fitted to the MotorWeek ¼-mile trap 127 mph' },
      { parameter: 'Peak power', value: '502 hp', status: 'reported', source: 'Porsche rating', url: 'https://www.motor1.com/reviews/664283/2022-porsche-911-gt3-touring-review/' },
      { parameter: 'Peak torque', value: '346 lb-ft', status: 'reported', source: 'Porsche rating', url: 'https://www.motor1.com/reviews/664283/2022-porsche-911-gt3-touring-review/' },
      { parameter: 'Power / torque rpm', value: '8,400 / 6,100 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Gear ratios', value: '3.75/2.38/1.72/1.34/1.11/0.96/0.84', status: 'verified', source: 'Porsche 911 GT3 (PDK) technical data', url: 'https://newsroom.porsche.com/dam/jcr:ca1882c7-1588-4a2e-995c-fe19ef1281fc/pag-911-gt3-pdk-en.pdf' },
      { parameter: 'Final drive', value: '4.19', status: 'reported', source: 'Carfolio and an NHTSA filing; Porsche sheets also show 4.54 / forum 3.97 — conflict unresolved', url: 'https://www.carfolio.com/porsche-911-gt3-pdk-720016' },
      { parameter: 'Curb mass', value: '≈3,164 lb (1,435 kg)', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Tire size', value: '255/35 R20 F, 315/30 R21 R', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Launch rpm', value: '≈6,500 rpm', status: 'estimated', source: 'Car and Driver describes a 6,500-rpm clutch drop (GT3 Touring)' },
    ],
  }),
};
