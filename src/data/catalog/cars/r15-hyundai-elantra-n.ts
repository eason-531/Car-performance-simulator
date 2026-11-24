import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #15: 2025 Hyundai Elantra N DCT (US). */
export const entry: CatalogEntry = {
  id: "2025-hyundai-elantra-n-dct-us-sedan-fwd-8dct",
  roster: 15,
  section: "Daily and sport compacts",
  make: "Hyundai",
  model: "Elantra N",
  trim: "DCT",
  modelYear: 2025,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "CN7 facelift",
  aliases: [
    "Elantra N",
    "CN7"
  ],
  origin: "South Korea",
  usage: [
    "Sport Compact",
    "Daily",
    "Track"
  ],
  drive: "FWD",
  transmission: "DCT",
  transmissionLabel: "8-speed wet DCT",
  powertrain: "Petrol",
  engineLabel: "2.0 turbo I4 (Smartstream G2.0 T-GDi)",
  modelPath: "Existing",
  factory: {
    power: "276 hp @ 5,500–6,000 rpm (286 hp with N Grin Shift)",
    torque: "289 lb-ft @ 2,100–4,700 rpm",
    curbMass: "3,296 lb (2022 N DCT listing)",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2025 Hyundai Elantra N DCT first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2025-hyundai-elantra-n-dct-first-test-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Elantra N specifications",
      publisher: "Hyundai Canada",
      url: "https://www.hyundaicanada.com/en/showroom/elantra-n",
      kind: "manufacturer"
    },
    {
      id: "src3",
      title: "2022 Elantra N DCT",
      publisher: "Motor Matchup",
      url: "https://www.motormatchup.com/catalog/Hyundai/Elantra/2022/N-DCT",
      kind: "reference"
    },
    {
      id: "src4",
      title: "2024 Hyundai Elantra N track tested",
      publisher: "Edmunds",
      url: "https://edmunds.com/car-news/2024-hyundai-elantra-n-track-tested.html",
      kind: "road-test"
    },
    {
      id: "src-mt",
      title: "2025 Hyundai Elantra N DCT first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2025-hyundai-elantra-n-dct-first-test-review",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "edmunds-2024",
      sourceId: "src4",
      publication: "Edmunds",
      timing: "standing-start",
      timingNote: "Edmunds times from a standstill (\"zero should mean zero\"), no rollout.",
      results: {
        zeroTo60MphS: 5.4,
        quarterMileS: 13.8,
        quarterMileTrapMph: 101.9
      },
      conditions: {},
      match: "equivalent",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2024",
      deviation: "2024 car (pre-facelift styling, same 276 hp powertrain and 8-speed DCT); independent replacement for the unreachable MotorTrend test."
    },
    {
      id: "mt",
      sourceId: "src-mt",
      publication: "MotorTrend",
      timing: "rollout-1ft",
      timingNote: "MotorTrend subtracts a 1-ft rollout from its acceleration times.",
      results: {
        zeroTo60MphS: 4.7,
        quarterMileS: 13.3,
        quarterMileTrapMph: 106.7
      },
      conditions: {
        testMass: "3,334 lb (64/36)",
        other: [
          "Overboost (N Grin Shift) use matters when comparing runs; not stated here"
        ]
      },
      match: "exact",
      verification: "Original test as transcribed in the owner-supplied spec-sheet follow-up, 2026-11; exact model-year DCT test.",
      date: "2024"
    }
  ],
  dataGaps: [
    "MotorTrend first-test results",
    "DCT 2nd–7th gear ratios (interpolated between published 1st 3.714 and 8th 0.498)",
    "DCT final drive (3.8 per one listing, conflicting)",
    "2025 curb mass (2022 figure used)",
    "Drag coefficient",
    "Weight distribution"
  ],
  sim: buildSpec({
  id: "2025-hyundai-elantra-n-dct-us-sedan-fwd-8dct",
  make: "Hyundai",
  model: "Elantra N",
  trim: "DCT",
  modelYear: 2025,
  market: "US",
  body: "Sedan",
  shortName: "Hyundai Elantra N DCT"
}, {
    engine: {
      code: 'Smartstream G2.0 T-GDi', description: '2.0 L turbo I4, flat power', displacementCc: 1998, aspiration: 'turbo',
      idleRpm: 750, redlineRpm: 6750, revLimitRpm: 6850,
      power: { value: 276, unit: 'hp', rpm: [5500, 6000] },
      torque: { value: 289, unit: 'lb-ft', rpm: [2100, 4700] },
      peakBoostBar: 1.4,
    },
    transmission: {
      type: 'dual-clutch', name: '8-speed wet N DCT',
      gearRatios: [3.714, 2.6, 1.95, 1.48, 1.12, 0.85, 0.65, 0.498], finalDrive: 3.8,
      launchClutch: { launchRpm: 3300, brakeHoldRpmLimit: 3300 },
    },
    drivetrain: { layout: 'FWD', efficiency: 0.9, description: 'Front-wheel drive with electronic limited-slip differential (e-LSD)' },
    chassis: { frontWeightFraction: 0.64, curbMassKg: 1495, wheelbaseM: 2.72, lengthMm: 4676, widthMm: 1826, heightMm: 1415 },
    aero: {},
    tires: { sizes: [square('r19', '245/35 R19', 245, 35, 19, 'N fitment')], compound: 'uhp', gripScale: 1.24 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.24', status: 'estimated', source: 'Fitted to the MotorTrend 0–60 mph 4.7 s with efficiency held at the bound (the follow-up names this as the DCT test)' },
      { parameter: 'Drivetrain efficiency', value: '90 %', status: 'estimated', source: 'A fit to the MotorTrend trap 106.7 mph asked for 91.7 %, above the 90 % front-drive DCT bound; capped. Edmunds’ 2024 test (101.9 mph) disagrees, likely through overboost use' },
      { parameter: 'Weight distribution', value: '64/36 front/rear (as tested)', status: 'reported', source: 'MotorTrend DCT test (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.motortrend.com/reviews/2025-hyundai-elantra-n-dct-first-test-review' },
      { parameter: 'Peak power', value: '276 hp @ 5,500–6,000 rpm', status: 'reported', source: 'Hyundai Canada specifications', url: 'https://www.hyundaicanada.com/en/showroom/elantra-n' },
      { parameter: 'Peak torque', value: '289 lb-ft @ 2,100–4,700 rpm', status: 'reported', source: 'Hyundai Canada specifications', url: 'https://www.hyundaicanada.com/en/showroom/elantra-n' },
      { parameter: 'Gear ratios', value: '3.714 / … / 0.498 (2nd–7th interpolated)', status: 'estimated', source: '1st and 8th from Motor Matchup; intermediate ratios not published in a reachable source — awaiting spec sheet', url: 'https://www.motormatchup.com/catalog/Hyundai/Elantra/2022/N-DCT' },
      { parameter: 'Final drive', value: '3.8', status: 'reported', source: 'Motor Matchup (another listing conflicts)', url: 'https://www.motormatchup.com/catalog/Hyundai/Elantra/2022/N-DCT' },
      { parameter: 'Curb mass', value: '3,296 lb (1,495 kg), 2022 N DCT', status: 'reported', source: 'Motor Matchup', url: 'https://www.motormatchup.com/catalog/Hyundai/Elantra/2022/N-DCT' },
      { parameter: 'Tire size', value: '245/35 R19', status: 'reported', source: 'Specification listing', url: 'https://www.motormatchup.com/catalog/Hyundai/Elantra/2022/N-DCT' },
      { parameter: 'Tire compound', value: 'Ultra-high-performance class', status: 'estimated', source: 'Elantra N ships on max-performance summer tires (model not confirmed)' },
      { parameter: 'Dimensions', value: '4,676 × 1,826 × 1,415 mm, WB 2,720 mm', status: 'estimated', source: 'Recalled Hyundai figures; not verified' },
    ],
  }),
};
