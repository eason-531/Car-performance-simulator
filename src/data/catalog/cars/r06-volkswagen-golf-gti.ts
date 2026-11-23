import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #6: 2022 Volkswagen Golf GTI Autobahn (US). */
export const entry: CatalogEntry = {
  id: "2022-volkswagen-golf-gti-autobahn-us-hatch-fwd-7dct",
  roster: 6,
  section: "Hot hatches",
  make: "Volkswagen",
  model: "Golf GTI",
  trim: "Autobahn",
  modelYear: 2022,
  market: "US",
  body: "Hatchback",
  bodyLabel: "5-door hatchback",
  chassisCode: "Mk8",
  aliases: [
    "GTI",
    "Mk8",
    "VW"
  ],
  origin: "Germany",
  usage: [
    "Hot Hatch",
    "Sport Compact",
    "Daily"
  ],
  drive: "FWD",
  transmission: "DCT",
  transmissionLabel: "7-speed DSG",
  powertrain: "Petrol",
  engineLabel: "2.0 turbo I4 (EA888 evo4)",
  modelPath: "Existing",
  factory: {
    power: "241 hp",
    torque: "273 lb-ft",
    curbMass: "3,190 lb (Autobahn DSG listing)",
    sourceId: "src3"
  },
  sources: [
    {
      id: "test",
      title: "2022 Volkswagen GTI first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2022-volkswagen-gti-first-test-first-drive-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2023 Volkswagen GTI 0-60 mph tested",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/features/2023-volkswagen-gti-0-60-mph-tested",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "2022 Golf GTI 2.0T Autobahn DSG",
      publisher: "Motor Matchup",
      url: "https://www.motormatchup.com/catalog/Volkswagen/Golf-GTI/2022/2.0T-Autobahn-DSG",
      kind: "reference"
    },
    {
      id: "src4",
      title: "DQ381 transmission specs",
      publisher: "Arteon Forums",
      url: "https://www.arteonforums.com/threads/vw-arteon-dsg381-transmission-specs-usa-builds.1510/",
      kind: "reference"
    },
    {
      id: "src5",
      title: "Tested: 2022 Volkswagen Golf GTI",
      publisher: "Car and Driver (Yahoo syndication)",
      url: "https://autos.yahoo.com/tested-2022-volkswagen-golf-gti-110000682.html",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "cd-gti",
      sourceId: "src5",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 5.1
      },
      conditions: {},
      match: "equivalent",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2021",
      deviation: "Gearbox and trim of the test car not confirmed in the summary; used as a labelled comparison only."
    }
  ],
  dataGaps: [
    "MotorTrend first-test results (both linked pages unreachable)",
    "DSG gear ratios and final drives (DQ381 family set used)",
    "Power/torque rpm bands (recalled VW US figures)",
    "Tire size (235/35 R19 assumed for Autobahn)",
    "Drag coefficient",
    "Weight distribution"
  ],
  sim: buildSpec({
  id: "2022-volkswagen-golf-gti-autobahn-us-hatch-fwd-7dct",
  make: "Volkswagen",
  model: "Golf GTI",
  trim: "Autobahn",
  modelYear: 2022,
  market: "US",
  body: "Hatchback",
  shortName: "VW GTI Autobahn"
}, {
    engine: {
      code: 'EA888 evo4 (DNPA)', description: '2.0 TSI turbo I4', displacementCc: 1984, aspiration: 'turbo',
      idleRpm: 750, redlineRpm: 6500, revLimitRpm: 6700,
      power: { value: 241, unit: 'hp', rpm: [5000, 6500] },
      torque: { value: 273, unit: 'lb-ft', rpm: [1750, 4500] },
      peakBoostBar: 1.2,
    },
    transmission: {
      type: 'dual-clutch', name: '7-speed DSG (DQ381 family)',
      gearRatios: [3.188, 2.19, 1.517, 1.057, 0.738, 0.557, 0.433], finalDrive: 4.176,
      launchClutch: { launchRpm: 3200, brakeHoldRpmLimit: 3200 },
    },
    drivetrain: { layout: 'FWD', description: 'Front-wheel drive with VAQ electronic limited-slip differential' },
    chassis: { curbMassKg: 1447, frontWeightFraction: 0.61, wheelbaseM: 2.626, lengthMm: 4288, widthMm: 1789, heightMm: 1442 },
    aero: {},
    tires: { sizes: [square('r19', '235/35 R19', 235, 35, 19, 'Autobahn fitment (assumed)'), square('r18', '225/40 R18', 225, 40, 18, 'GTI S fitment')], compound: 'oe-performance', gripScale: 1.3 },
    speedLimiterKmh: 250,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.30 (fit bound)', status: 'estimated', source: 'Fit toward the Car and Driver 0–60 mph 5.1 s stopped at the 1.30 bound (sim 5.25 s); residual shown' },
      { parameter: 'Peak power', value: '241 hp (US rating)', status: 'reported', source: 'Multiple 2022 GTI specification listings', url: 'https://www.motormatchup.com/catalog/Volkswagen/Golf-GTI/2022/2.0T-Autobahn-DSG' },
      { parameter: 'Peak torque', value: '273 lb-ft', status: 'reported', source: 'Multiple 2022 GTI specification listings', url: 'https://www.motormatchup.com/catalog/Volkswagen/Golf-GTI/2022/2.0T-Autobahn-DSG' },
      { parameter: 'Power / torque bands', value: '5,000–6,500 / 1,750–4,500 rpm', status: 'estimated', source: 'Recalled VW figures; not verified' },
      { parameter: 'Gear ratios', value: '3.188/2.190/1.517/1.057/0.738/0.557/0.433', status: 'estimated', source: 'DQ381 (0GC) family ratios from a forum spec table; the application-specific set is not published in a reachable source — awaiting spec sheet', url: 'https://www.arteonforums.com/threads/vw-arteon-dsg381-transmission-specs-usa-builds.1510/' },
      { parameter: 'Final drive', value: '4.176', status: 'estimated', source: 'DQ381 family value (3.611 or 4.176 by model); application not confirmed', url: 'https://www.arteonforums.com/threads/vw-arteon-dsg381-transmission-specs-usa-builds.1510/' },
      { parameter: 'Curb mass', value: '3,190 lb (1,447 kg)', status: 'reported', source: 'Motor Matchup Autobahn DSG listing', url: 'https://www.motormatchup.com/catalog/Volkswagen/Golf-GTI/2022/2.0T-Autobahn-DSG' },
      { parameter: 'Dimensions', value: '4,288 × 1,789 × 1,442 mm, WB 2,626 mm', status: 'estimated', source: 'Recalled VW figures; not verified' },
      { parameter: 'Speed limiter', value: '250 km/h', status: 'estimated', source: 'Typical VW governor with summer tires' },
    ],
  }),
};
