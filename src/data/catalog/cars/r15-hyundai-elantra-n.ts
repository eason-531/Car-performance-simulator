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
      id: "src-a123",
      title: "Hyundai Elantra N 2024 DCT specifications",
      publisher: "Auto123",
      url: "https://specs2.auto123.com/en/specs/hyundai/elantra/hyundai-elantra-2024-dct-456373",
      kind: "reference"
    },
    {
      id: "src-i30n",
      title: "i30 N specification sheet (N DCT final drives)",
      publisher: "Hyundai Australia",
      url: "https://hyundai.com/content/dam/hyundai/au/en/models/i30-n/docs/Hyundai_i30N_Specification_Sheet.pdf",
      kind: "manufacturer"
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
      sourceId: "test",
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
    "Hyundai US confirmation of the N DCT ratios and final-drive split (two listings and the i30 N sheet agree)",
    "2025 factory curb mass (2022 figure used)",
    "Drag coefficient"
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
      gearRatios: [3.714, 2.261, 2.174, 1.621, 0.927, 0.767, 0.878, 0.698], finalDrive: [3.8, 3.8, 2.714, 2.714, 3.8, 3.8, 2.714, 2.714],
      launchClutch: { launchRpm: 3300, brakeHoldRpmLimit: 3300 },
    },
    drivetrain: { layout: 'FWD', efficiency: 0.9, description: 'Front-wheel drive with electronic limited-slip differential (e-LSD)' },
    chassis: { frontWeightFraction: 0.64, curbMassKg: 1495, wheelbaseM: 2.72, lengthMm: 4676, widthMm: 1826, heightMm: 1415 },
    aero: {},
    tires: { sizes: [square('r19', '245/35 R19', 245, 35, 19, 'N fitment')], compound: 'uhp', gripScale: 1.3 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.30 (fit bound)', status: 'estimated', source: 'Fit toward the MotorTrend 0–60 mph 4.7 s reached it at the bound with the corrected N DCT gearing (efficiency held at 90 %)' },
      { parameter: 'Drivetrain efficiency', value: '90 %', status: 'estimated', source: 'A fit to the MotorTrend trap 106.7 mph asks for more than the 90 % front-drive DCT bound; capped. Edmunds’ 2024 test (101.9 mph) disagrees, likely through overboost use' },
      { parameter: 'Gear ratios', value: '3.714/2.261/2.174/1.621/0.927/0.767/0.878/0.698', status: 'reported', source: 'Auto123 Elantra N DCT listings (2022: 1st–3rd; 2024: 3rd–8th)', url: 'https://specs2.auto123.com/en/specs/hyundai/elantra/hyundai-elantra-2024-dct-456373' },
      { parameter: 'Final drive', value: '3.800 (1st, 2nd, 5th, 6th) / 2.714 (3rd, 4th, 7th, 8th)', status: 'reported', source: 'Auto123 lists 2.71 and Motor Matchup 3.8; Motor Matchup’s 3rd/4th/7th/8th equal these ratios × 2.714/3.8, matching the 3.800/2.714 split in Hyundai’s i30 N DCT sheet', url: 'https://hyundai.com/content/dam/hyundai/au/en/models/i30-n/docs/Hyundai_i30N_Specification_Sheet.pdf' },
      { parameter: 'Weight distribution', value: '64/36 front/rear (as tested)', status: 'reported', source: 'MotorTrend DCT test (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.motortrend.com/reviews/2025-hyundai-elantra-n-dct-first-test-review' },
      { parameter: 'Peak power', value: '276 hp @ 5,500–6,000 rpm', status: 'reported', source: 'Hyundai Canada specifications', url: 'https://www.hyundaicanada.com/en/showroom/elantra-n' },
      { parameter: 'Peak torque', value: '289 lb-ft @ 2,100–4,700 rpm', status: 'reported', source: 'Hyundai Canada specifications', url: 'https://www.hyundaicanada.com/en/showroom/elantra-n' },
      { parameter: 'Curb mass', value: '3,296 lb (1,495 kg), 2022 N DCT', status: 'reported', source: 'Motor Matchup', url: 'https://www.motormatchup.com/catalog/Hyundai/Elantra/2022/N-DCT' },
      { parameter: 'Tire size', value: '245/35 R19', status: 'reported', source: 'Specification listing', url: 'https://www.motormatchup.com/catalog/Hyundai/Elantra/2022/N-DCT' },
      { parameter: 'Tire compound', value: 'Ultra-high-performance class', status: 'estimated', source: 'Elantra N ships on max-performance summer tires (model not confirmed)' },
      { parameter: 'Dimensions', value: '4,676 × 1,826 × 1,415 mm, WB 2,720 mm', status: 'estimated', source: 'Recalled Hyundai figures; not verified' },
    ],
  }),
};
