import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #54: 2020 Ford Mustang Shelby GT500 Carbon Fiber Track Package (US). */
export const entry: CatalogEntry = {
  id: "2020-ford-mustang-shelby-gt500-carbon-fiber-track-package-us-coupe-rwd-7dct",
  roster: 54,
  section: "American performance",
  make: "Ford",
  model: "Mustang Shelby GT500",
  trim: "Carbon Fiber Track Package",
  modelYear: 2020,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "S550",
  aliases: [
    "GT500",
    "Shelby",
    "S550",
    "Mustang"
  ],
  origin: "United States",
  usage: [
    "Muscle",
    "Track"
  ],
  drive: "RWD",
  transmission: "DCT",
  transmissionLabel: "7-speed DCT",
  powertrain: "Petrol",
  engineLabel: "5.2 supercharged V8 (Predator)",
  modelPath: "Existing",
  factory: {
    power: "760 hp @ 7,300 rpm",
    torque: "625 lb-ft @ 5,000 rpm",
    curbMass: "≈4,225 lb base (approx.)",
    zeroTo60MphS: 3.3,
    sourceId: "src3"
  },
  sources: [
    {
      id: "test",
      title: "2020 Ford Mustang Shelby GT500 first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2020-ford-mustang-shelby-gt500-first-test",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2020 Ford Shelby GT500 review",
      publisher: "Edmunds",
      url: "https://edmunds.com/ford/shelby-gt500/2020/review",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "2020 GT500 details & specs",
      publisher: "CJ Pony Parts",
      url: "https://www.cjponyparts.com/resources/news/2020-shelby-gt500",
      kind: "reference"
    },
    {
      id: "src4",
      title: "The Shelby GT500's Carbon Track Pack makes it slower",
      publisher: "CarBuzz (citing Car and Driver)",
      url: "https://carbuzz.com/news/the-shelby-gt500s-18500-carbon-track-pack-makes-it-slower",
      kind: "reference"
    },
    {
      id: "src5",
      title: "Mustang Shelby GT500 is quicker without the Carbon Fiber Track Pack",
      publisher: "Ford Authority (citing Car and Driver)",
      url: "https://fordauthority.com/2021/01/ford-mustang-shelby-gt500-is-quicker-without-the-carbon-fiber-track-pack",
      kind: "reference"
    },
    {
      id: "src-ford",
      title: "2020 Shelby GT500 owner supplement (transmission specifications)",
      publisher: "Ford",
      url: "https://www.fordservicecontent.com/Ford_Content/Catalog/owner_information/2020-Ford-Mustang-Shelby-GT500-Supplement-version-2_su_EN-US_03_2020.pdf",
      kind: "manufacturer"
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
        zeroTo60MphS: 3.8,
        quarterMileS: 11.3,
        quarterMileTrapMph: 130.7
      },
      conditions: {
        other: [
          "Carbon Fiber Track Package"
        ]
      },
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2020"
    },
    {
      id: "cd",
      sourceId: "src4",
      publication: "Car and Driver (as cited by CarBuzz)",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 3.6,
        zeroTo100MphS: 7.1
      },
      conditions: {
        other: [
          "Carbon Fiber Track Package"
        ]
      },
      match: "exact",
      verification: "Second-hand citation. Ford Authority quotes the same test as 3.4 s and 11.4 s, which conflicts.",
      date: "2020"
    },
    {
      id: "mt",
      sourceId: "test",
      publication: "MotorTrend",
      timing: "rollout-1ft",
      timingNote: "MotorTrend subtracts a 1-ft rollout from its acceleration times.",
      results: {
        quarterMileS: 11.3,
        quarterMileTrapMph: 131.6
      },
      conditions: {
        testMass: "4,054 lb (56/44)",
        other: [
          "Carbon Fiber Track Package column (the base-car column and prepared-drag-strip stories are separate)"
        ]
      },
      match: "exact",
      verification: "Original test as transcribed in the owner-supplied spec-sheet follow-up, 2026-11; two-car test, CFTP column.",
      date: "2020"
    }
  ],
  dataGaps: [
    "CFTP factory curb mass (4,054 lb is MotorTrend’s scale weight)",
    "Tire size and compound for the CFTP",
    "Car and Driver original test page (conflicting citations)",
    "Drag coefficient",
    "Power/torque rpm detail"
  ],
  notes: [
    "Ford claims 3.3 s to 60 mph and a 10.7 s quarter mile; the Track Package deletes the rear seat. MotorTrend’s quoted 2.09 is the overall top-gear reduction, not the axle ratio."
  ],
  sim: buildSpec({
  id: "2020-ford-mustang-shelby-gt500-carbon-fiber-track-package-us-coupe-rwd-7dct",
  make: "Ford",
  model: "Mustang Shelby GT500",
  trim: "Carbon Fiber Track Package",
  modelYear: 2020,
  market: "US",
  body: "Coupe",
  shortName: "Ford Mustang Shelby GT500 CFTP"
}, {
    engine: { code: 'Predator 5.2', description: '5.2 L supercharged cross-plane V8', displacementCc: 5163, aspiration: 'supercharged', idleRpm: 750, redlineRpm: 7500, revLimitRpm: 7500, power: { value: 760, unit: 'hp', rpm: [7300, 7300] }, torque: { value: 625, unit: 'lb-ft', rpm: [5000, 5000] }, peakBoostBar: 0.83, spoolScale: 0.25 },
    transmission: { type: 'dual-clutch', name: 'Tremec TR-9070 7-speed DCT', gearRatios: [3.14, 2.05, 1.43, 1.1, 0.86, 0.68, 0.56], finalDrive: 3.73, upshiftTimeS: 0.1, shiftTorqueDip: 0.12 },
    drivetrain: { layout: 'RWD', efficiency: 0.88, description: 'Rear-wheel drive, Torsen limited-slip differential' },
    chassis: { curbMassKg: 1839, frontWeightFraction: 0.56, wheelbaseM: 2.72, lengthMm: 4818, widthMm: 1916, heightMm: 1383 },
    aero: {},
    tires: { sizes: [staggered('r20', '305/30 R20 F · 315/30 R20 R', { widthMm: 305, aspectPct: 30, rimIn: 20 }, { widthMm: 315, aspectPct: 30, rimIn: 20 }, 'Michelin Pilot Sport Cup 2 (assumed for the CFTP)')], compound: 'semi-slick', gripScale: 1.07 },
    speedLimiterKmh: null,
    factory: { zeroTo60MphS: 3.3 },
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.07', status: 'estimated', source: 'Fitted to the Edmunds 0–60 mph 3.8 s' },
      { parameter: 'Drivetrain efficiency', value: '88 %', status: 'estimated', source: 'Default for a rear-drive dual-clutch; a trap fit asked for 80 %, likely absorbing the unmodelled drag of the track aero (Cd unknown), so the ≈+5 mph trap residual is left visible' },
      { parameter: 'Peak power', value: '760 hp @ 7,300 rpm', status: 'reported', source: 'Ford rating (CJ Pony Parts listing)', url: 'https://www.cjponyparts.com/resources/news/2020-shelby-gt500' },
      { parameter: 'Peak torque', value: '625 lb-ft @ 5,000 rpm', status: 'reported', source: 'Ford rating (CJ Pony Parts listing)', url: 'https://www.cjponyparts.com/resources/news/2020-shelby-gt500' },
      { parameter: 'Gear ratios', value: '3.14/2.05/1.43/1.10/0.86/0.68/0.56 (TR-9070)', status: 'verified', source: 'Ford GT500 owner supplement (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.fordservicecontent.com/Ford_Content/Catalog/owner_information/2020-Ford-Mustang-Shelby-GT500-Supplement-version-2_su_EN-US_03_2020.pdf' },
      { parameter: 'Final drive', value: '3.73', status: 'verified', source: 'Ford GT500 owner supplement (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.fordservicecontent.com/Ford_Content/Catalog/owner_information/2020-Ford-Mustang-Shelby-GT500-Supplement-version-2_su_EN-US_03_2020.pdf' },
      { parameter: 'Curb mass', value: '4,054 lb (1,839 kg) as tested', status: 'reported', source: 'MotorTrend CFTP column (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.motortrend.com/reviews/2020-ford-mustang-shelby-gt500-first-test' },
      { parameter: 'Weight distribution', value: '56/44 front/rear (as tested)', status: 'reported', source: 'MotorTrend CFTP column (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.motortrend.com/reviews/2020-ford-mustang-shelby-gt500-first-test' },
      { parameter: 'Tire size', value: '305/30 R20 F · 315/30 R20 R', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Tire compound', value: 'Track semi-slick class', status: 'estimated', source: 'CFTP ships on Michelin Pilot Sport Cup 2 (not verified here)' },
      { parameter: 'Dimensions', value: '4,818 × 1,916 × 1,383 mm, WB 2,720 mm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
