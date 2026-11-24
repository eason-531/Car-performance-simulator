import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #45: 2018 Nissan GT-R Track Edition (US). */
export const entry: CatalogEntry = {
  id: "2018-nissan-gt-r-track-edition-us-coupe-awd-6dct",
  roster: 45,
  section: "Sports cars",
  make: "Nissan",
  model: "GT-R",
  trim: "Track Edition",
  modelYear: 2018,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "R35",
  aliases: [
    "GTR",
    "R35",
    "Godzilla",
    "ATTESA"
  ],
  origin: "Japan",
  usage: [
    "Sports Car",
    "Grand Tourer",
    "Track"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "6-speed DCT",
  powertrain: "Petrol",
  engineLabel: "3.8 twin-turbo V6 (VR38DETT)",
  modelPath: "Existing",
  factory: {
    power: "565 hp",
    torque: "467 lb-ft",
    curbMass: "3,915 lb",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2018 Nissan GT-R by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a23405694/2018-nissan-gt-r-by-the-numbers/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "GT-R 0–60 times",
      publisher: "0-60specs",
      url: "https://www.0-60specs.com/nissan/gt-r-0-60-times",
      kind: "reference"
    },
    {
      id: "src3",
      title: "2018 GT-R Track Edition",
      publisher: "Motor Matchup",
      url: "https://www.motormatchup.com/catalog/Nissan/GT_R/2018/Track-Edition-2DR-AWD-Coupe",
      kind: "reference"
    },
    {
      id: "src-nissan",
      title: "2018 Nissan GT-R press kit",
      publisher: "Nissan USA",
      url: "https://usa.nissannews.com/en-US/releases/us-2018-nissan-gt-r-press-kit",
      kind: "manufacturer"
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
        zeroTo60MphS: 2.9,
        quarterMileS: 11.1
      },
      conditions: {},
      match: "exact",
      verification: "Aggregator listing that attributes the run to the publication; original page not reachable. Trap speed not in the listing.",
      date: "2018"
    }
  ],
  dataGaps: [
    "Car and Driver page itself (trap speed, test weight)",
    "Power/torque rpm",
    "Tire size"
  ],
  simCaveats: [
    "The 2.937 front axle ratio is display-only; physics ties engine speed to the 3.700 rear axle with a generic 0–50 % front-share range."
  ],
  sim: buildSpec({
  id: "2018-nissan-gt-r-track-edition-us-coupe-awd-6dct",
  make: "Nissan",
  model: "GT-R",
  trim: "Track Edition",
  modelYear: 2018,
  market: "US",
  body: "Coupe",
  shortName: "Nissan GT-R Track Edition"
}, {
    engine: { code: 'VR38DETT', description: '3.8 L twin-turbo V6', displacementCc: 3799, aspiration: 'twin-turbo', idleRpm: 700, redlineRpm: 7100, revLimitRpm: 7100, power: { value: 565, unit: 'hp', rpm: [6800, 6800] }, torque: { value: 467, unit: 'lb-ft', rpm: [3300, 5800] }, peakBoostBar: 1.1, lowEndFraction: 0.5 },
    transmission: { type: 'dual-clutch', name: '6-speed dual-clutch (GR6, rear transaxle)', gearRatios: [4.056, 2.301, 1.595, 1.248, 1.001, 0.796], finalDrive: 3.7, frontAxleRatio: 2.937, upshiftTimeS: 0.15, launchClutch: { launchRpm: 4500, brakeHoldRpmLimit: 4500 } },
    drivetrain: { layout: 'AWD', efficiency: 0.85, description: 'ATTESA E-TS (rear-biased, up to 50 % front)', frontShareRange: [0, 0.5] },
    chassis: { curbMassKg: 1776, frontWeightFraction: 0.54, cgHeightM: 0.47, wheelbaseM: 2.78, lengthMm: 4710, widthMm: 1895, heightMm: 1370 },
    aero: { dragCoefficient: 0.26 },
    tires: { sizes: [staggered('r20', '255/40 R20 F · 285/35 R20 R', { widthMm: 255, aspectPct: 40, rimIn: 20 }, { widthMm: 285, aspectPct: 35, rimIn: 20 }, 'Track Edition fitment (assumed)')], compound: 'uhp', gripScale: 1.18 },
    speedLimiterKmh: 315,
    provenance: [
      { parameter: 'Gear ratios', value: '4.056/2.301/1.595/1.248/1.001/0.796 (GR6)', status: 'verified', source: 'Nissan 2018 US press kit (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://usa.nissannews.com/en-US/releases/us-2018-nissan-gt-r-press-kit' },
      { parameter: 'Final drive', value: '3.700 rear; 2.937 front (reference)', status: 'verified', source: 'Nissan 2018 US press kit (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://usa.nissannews.com/en-US/releases/us-2018-nissan-gt-r-press-kit' },
      { parameter: 'Tire grip calibration', value: '×1.18', status: 'estimated', source: 'Fitted to the Car and Driver 0–60 mph 2.9 s' },
      { parameter: 'Drivetrain efficiency', value: '85 %', status: 'estimated', source: 'Typical AWD loss; no trap speed available to fit against' },
      { parameter: 'Peak power', value: '565 hp', status: 'reported', source: 'Nissan rating (Car and Driver Lightning Lap entry)', url: 'https://autos.yahoo.com/lightning-lap-2017-nissan-gt-140000223.html' },
      { parameter: 'Peak torque', value: '467 lb-ft', status: 'reported', source: 'Nissan rating' },
      { parameter: 'Power / torque rpm', value: '6,800 / 3,300–5,800 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '3,915 lb (1,776 kg)', status: 'reported', source: 'Motor Matchup Track Edition listing (Lightning Lap 2017 lists 3,925 lb)', url: 'https://www.motormatchup.com/catalog/Nissan/GT_R/2018/Track-Edition-2DR-AWD-Coupe' },
      { parameter: 'Drag coefficient', value: 'Cd 0.26', status: 'estimated', source: 'Nissan quotes 0.26 for the 2017-on GT-R; not verified here' },
      { parameter: 'Launch rpm', value: '≈4,500 rpm', status: 'estimated', source: 'R-mode launch control behaviour; not verified' },
    ],
  }),
};
