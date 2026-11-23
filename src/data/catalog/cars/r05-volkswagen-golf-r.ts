import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #5: 2022 Volkswagen Golf R Golf R (US). */
export const entry: CatalogEntry = {
  id: "2022-volkswagen-golf-r-us-hatch-awd-7dct",
  roster: 5,
  section: "Hot hatches",
  make: "Volkswagen",
  model: "Golf R",
  trim: "Golf R",
  modelYear: 2022,
  market: "US",
  body: "Hatchback",
  bodyLabel: "5-door hatchback",
  chassisCode: "Mk8",
  aliases: [
    "Golf R",
    "Mk8",
    "VW",
    "4Motion"
  ],
  origin: "Germany",
  usage: [
    "Hot Hatch",
    "Sport Compact",
    "Daily"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "7-speed DSG",
  powertrain: "Petrol",
  engineLabel: "2.0 turbo I4 (EA888 evo4)",
  modelPath: "Existing",
  factory: {
    power: "315 hp",
    torque: "295 lb-ft",
    sourceId: "test"
  },
  sources: [
    {
      id: "test",
      title: "2022 Volkswagen Golf R",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/volkswagen/golf-r-2022",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2022 Volkswagen Golf R review (instrumented)",
      publisher: "Edmunds",
      url: "https://www.edmunds.com/volkswagen/golf-r/2022/review/",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "2022 Volkswagen Golf R road test",
      publisher: "MotorWeek",
      url: "https://motorweek.org/reviews/road_tests/2022-volkswagen-golf-r",
      kind: "road-test"
    },
    {
      id: "src4",
      title: "DQ381 transmission specs",
      publisher: "Arteon Forums",
      url: "https://www.arteonforums.com/threads/vw-arteon-dsg381-transmission-specs-usa-builds.1510/",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "edmunds",
      sourceId: "src2",
      publication: "Edmunds",
      timing: "standing-start",
      timingNote: "Edmunds times from a standstill (\"zero should mean zero\"), no rollout.",
      results: {
        zeroTo60MphS: 4.3,
        quarterMileS: 12.7,
        quarterMileTrapMph: 108.3
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2022",
      deviation: "Independent replacement for the unreachable Car and Driver page; DSG car."
    },
    {
      id: "motorweek",
      sourceId: "src3",
      publication: "MotorWeek",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 4.1,
        quarterMileS: 12.5,
        quarterMileTrapMph: 111
      },
      conditions: {
        launchControl: "DSG launch control"
      },
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2022",
      deviation: "Independent replacement; launch control used."
    }
  ],
  dataGaps: [
    "Car and Driver test page (results, test weight)",
    "Curb mass (3,380 lb estimated)",
    "DSG gear ratios and final drives (DQ381 family set used)",
    "Power/torque rpm bands",
    "Tire size (235/35 R19 assumed)",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "2022-volkswagen-golf-r-us-hatch-awd-7dct",
  make: "Volkswagen",
  model: "Golf R",
  trim: "Golf R",
  modelYear: 2022,
  market: "US",
  body: "Hatchback",
  shortName: "VW Golf R"
}, {
    engine: {
      code: 'EA888 evo4 (DNFF)', description: '2.0 TSI turbo I4, 235 kW', displacementCc: 1984, aspiration: 'turbo',
      idleRpm: 750, redlineRpm: 6500, revLimitRpm: 6700,
      power: { value: 315, unit: 'hp', rpm: [5600, 6500] },
      torque: { value: 295, unit: 'lb-ft', rpm: [2100, 5350] },
      peakBoostBar: 1.5,
    },
    transmission: {
      type: 'dual-clutch', name: '7-speed DSG (DQ381 family)',
      gearRatios: [3.188, 2.19, 1.517, 1.057, 0.738, 0.557, 0.433], finalDrive: 4.176,
      launchClutch: { launchRpm: 3500, brakeHoldRpmLimit: 3500 },
    },
    drivetrain: { layout: 'AWD', efficiency: 0.874, description: '4Motion with rear torque-vectoring coupling (front-biased on demand)', frontShareRange: [0.5, 1] },
    chassis: { curbMassKg: 1533, frontWeightFraction: 0.6, wheelbaseM: 2.628, lengthMm: 4290, widthMm: 1789, heightMm: 1458 },
    aero: {},
    tires: { sizes: [square('r19', '235/35 R19', 235, 35, 19, 'US fitment (assumed)')], compound: 'oe-performance', gripScale: 1.3 },
    speedLimiterKmh: 250,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.30 (upper bound)', status: 'estimated', source: 'Fitted to Edmunds 0–60 mph 4.3 s (sim 4.36 s); held-out ¼-mile ET 12.94 s vs 12.7 s published' },
      { parameter: 'Drivetrain efficiency', value: '87.4 %', status: 'estimated', source: 'Fitted to Edmunds ¼-mile trap 108.3 mph (bounded 80–92 %)' },
      { parameter: 'Peak power', value: '315 hp (US rating)', status: 'reported', source: '2022 Golf R specification listings' },
      { parameter: 'Peak torque', value: '295 lb-ft', status: 'reported', source: '2022 Golf R specification listings' },
      { parameter: 'Power / torque bands', value: '5,600–6,500 / 2,100–5,350 rpm', status: 'estimated', source: 'Recalled VW figures; not verified' },
      { parameter: 'Gear ratios', value: '3.188/2.190/1.517/1.057/0.738/0.557/0.433', status: 'estimated', source: 'DQ381 (0GC) family ratios from a forum spec table; the application-specific set is not published in a reachable source — awaiting spec sheet', url: 'https://www.arteonforums.com/threads/vw-arteon-dsg381-transmission-specs-usa-builds.1510/' },
      { parameter: 'Final drive', value: '4.176', status: 'estimated', source: 'DQ381 family value (3.611 or 4.176 by model); application not confirmed', url: 'https://www.arteonforums.com/threads/vw-arteon-dsg381-transmission-specs-usa-builds.1510/' },
      { parameter: 'Curb mass', value: '≈3,380 lb (1,533 kg)', status: 'estimated', source: 'Edmunds measured 3,376 lb on a 2025 car; 2022 figure not found' },
      { parameter: 'Dimensions', value: '4,290 × 1,789 × 1,458 mm, WB 2,628 mm', status: 'estimated', source: 'Recalled VW figures; not verified' },
    ],
  }),
};
