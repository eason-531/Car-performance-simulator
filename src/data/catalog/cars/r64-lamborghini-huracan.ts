import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #64: 2018 Lamborghini Huracán Performante LP 640-4 (US). */
export const entry: CatalogEntry = {
  id: "2018-lamborghini-huracan-performante-lp-640-4-us-coupe-awd-7dct",
  roster: 64,
  section: "Exotics",
  make: "Lamborghini",
  model: "Huracán",
  trim: "Performante LP 640-4",
  modelYear: 2018,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "LB724",
  aliases: [
    "Huracan",
    "Performante",
    "LP640-4"
  ],
  origin: "Italy",
  usage: [
    "Supercar",
    "Track"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "7-speed DCT",
  powertrain: "Petrol",
  engineLabel: "5.2 V10",
  modelPath: "Existing",
  factory: {
    power: "640 PS (470 kW) @ 8,000 rpm",
    torque: "600 Nm @ 6,500 rpm",
    curbMass: "1,382 kg dry (Lamborghini)",
    sourceId: "src-lambo"
  },
  sources: [
    {
      id: "test",
      title: "2018 Lamborghini Huracan Performante test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a18665738/2018-lamborghini-huracan-performante-test-review/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2018 Lamborghini Huracán Performante",
      publisher: "Car and Driver (syndicated on Yahoo)",
      url: "https://autos.yahoo.com/2018-lamborghini-huracan-performante-153500211.html",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "2018 Lamborghini Huracán Performante road test",
      publisher: "MotorWeek",
      url: "https://motorweek.org/road_tests/2018-lambroghini-huracan-performante",
      kind: "road-test"
    },
    {
      id: "src-lambo",
      title: "Huracán Performante press kit",
      publisher: "Lamborghini",
      url: "https://preview.thenewsmarket.com/Previews/lamb/DocumentAssets/466201_v2.pdf",
      kind: "manufacturer"
    },
    {
      id: "src-cd",
      title: "2018 Lamborghini Huracán Performante test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a18665738/2018-lamborghini-huracan-performante-test-review/",
      kind: "road-test"
    },
    {
      id: "src-mm",
      title: "Huracán Performante specifications",
      publisher: "Motor Matchup (secondary)",
      url: "https://www.motormatchup.com/catalog/Lamborghini/Huracan/2018/Performante-2DR-Coupe",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src-cd",
      publication: "Car and Driver",
      timing: "unconfirmed",
      timingNote: "Car and Driver test published before its late-2019 move to a 1-ft rollout; the earlier procedure is not confirmed here, so both simulator bases are shown.",
      results: {
        zeroTo60MphS: 2.2,
        zeroTo100MphS: 5.4,
        quarterMileS: 10.1,
        quarterMileTrapMph: 136
      },
      conditions: {
        testMass: "3,429 lb",
        tires: "Pirelli P Zero Corsa 245/30 R20 F · 305/30 R20 R",
        other: [
          "ALA active aerodynamics fitted"
        ]
      },
      match: "exact",
      verification: "Original test as transcribed in the owner-supplied spec-sheet follow-up, 2026-11; original test; replaces the syndicated 2.3 s / 10.2 s figures.",
      date: "2018"
    },
    {
      id: "motorweek",
      sourceId: "src3",
      publication: "MotorWeek",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 2.9,
        quarterMileS: 10.7,
        quarterMileTrapMph: 132
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2018"
    }
  ],
  dataGaps: [
    "Factory confirmation of the LDF gear ratios and final drive (secondary listing only)",
    "AWD control map",
    "Drag coefficient",
    "Launch-control rpm"
  ],
  sim: buildSpec({
  id: "2018-lamborghini-huracan-performante-lp-640-4-us-coupe-awd-7dct",
  make: "Lamborghini",
  model: "Huracán",
  trim: "Performante LP 640-4",
  modelYear: 2018,
  market: "US",
  body: "Coupe",
  shortName: "Lamborghini Huracán Performante"
}, {
    engine: { code: 'L 5.2 V10', description: '5.2 L naturally aspirated V10', displacementCc: 5204, aspiration: 'na', idleRpm: 900, redlineRpm: 8500, revLimitRpm: 8700, power: { value: 640, unit: 'PS', rpm: [8000, 8000] }, torque: { value: 600, unit: 'Nm', rpm: [6500, 6500] }, lowEndFraction: 0.72 },
    transmission: { type: 'dual-clutch', name: '7-speed LDF dual-clutch', gearRatios: [3.133, 2.083, 1.575, 1.244, 0.979, 0.788, 0.677], finalDrive: 4.89, upshiftTimeS: 0.1, shiftTorqueDip: 0.12, launchClutch: { launchRpm: 6000, brakeHoldRpmLimit: 6000 } },
    drivetrain: { layout: 'AWD', efficiency: 0.87, description: 'Electro-hydraulic front coupling (rear-biased AWD)', frontShareRange: [0, 0.5] },
    chassis: { curbMassKg: 1555, frontWeightFraction: 0.43, cgHeightM: 0.42, wheelbaseM: 2.62, lengthMm: 4506, widthMm: 1924, heightMm: 1165 },
    aero: {},
    tires: { sizes: [staggered('r20', '245/30 R20 F · 305/30 R20 R', { widthMm: 245, aspectPct: 30, rimIn: 20 }, { widthMm: 305, aspectPct: 30, rimIn: 20 }, 'Pirelli P Zero Corsa (factory)')], compound: 'semi-slick', gripScale: 1.1 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.10', status: 'estimated', source: 'Fitted to the Car and Driver 0–60 mph 2.2 s' },
      { parameter: 'Drivetrain efficiency', value: '87 %', status: 'estimated', source: 'Fitted to the Car and Driver ¼-mile trap 136 mph' },
      { parameter: 'Peak power', value: '640 PS (470 kW) @ 8,000 rpm', status: 'verified', source: 'Lamborghini Performante press kit (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://preview.thenewsmarket.com/Previews/lamb/DocumentAssets/466201_v2.pdf' },
      { parameter: 'Peak torque', value: '600 Nm @ 6,500 rpm', status: 'verified', source: 'Lamborghini Performante press kit (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://preview.thenewsmarket.com/Previews/lamb/DocumentAssets/466201_v2.pdf' },
      { parameter: 'Weight distribution', value: '43/57 static', status: 'verified', source: 'Lamborghini Performante press kit (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://preview.thenewsmarket.com/Previews/lamb/DocumentAssets/466201_v2.pdf' },
      { parameter: 'Tire size', value: 'P Zero Corsa 245/30 R20 F · 305/30 R20 R', status: 'verified', source: 'Lamborghini Performante press kit (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://preview.thenewsmarket.com/Previews/lamb/DocumentAssets/466201_v2.pdf' },
      { parameter: 'Gear ratios', value: '3.133/2.083/1.575/1.244/0.979/0.788/0.677', status: 'reported', source: 'Secondary exact-trim listing only; no factory confirmation found (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.motormatchup.com/catalog/Lamborghini/Huracan/2018/Performante-2DR-Coupe' },
      { parameter: 'Final drive', value: '4.89', status: 'reported', source: 'Secondary exact-trim listing only; no factory confirmation found (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.motormatchup.com/catalog/Lamborghini/Huracan/2018/Performante-2DR-Coupe' },
      { parameter: 'Curb mass', value: '3,429 lb (1,555 kg) as tested; 1,382 kg is Lamborghini’s dry weight', status: 'reported', source: 'Car and Driver test (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.caranddriver.com/reviews/a18665738/2018-lamborghini-huracan-performante-test-review/' },
      { parameter: 'AWD split', value: 'Front share 0–0.50', status: 'estimated', source: 'Rear-biased coupling; the control map is not published' },
      { parameter: 'Launch rpm', value: '≈6,000 rpm', status: 'estimated', source: 'Typical launch-control hold for the V10; not published' },
      { parameter: 'Dimensions', value: '4,506 × 1,924 × 1,165 mm, WB 2,620 mm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
