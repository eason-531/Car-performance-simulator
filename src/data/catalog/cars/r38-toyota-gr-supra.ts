import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #38: 2023 Toyota GR Supra A91-MT Edition (US). */
export const entry: CatalogEntry = {
  id: "2023-toyota-gr-supra-a91-mt-edition-us-coupe-rwd-6mt",
  roster: 38,
  section: "Sports cars",
  make: "Toyota",
  model: "GR Supra",
  trim: "A91-MT Edition",
  modelYear: 2023,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "A90",
  aliases: [
    "Supra",
    "A90",
    "A91-MT",
    "GR Supra 3.0"
  ],
  origin: "Japan",
  usage: [
    "Sports Car"
  ],
  drive: "RWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "3.0 turbo I6 (B58)",
  modelPath: "MT",
  factory: {
    power: "382 hp",
    torque: "368 lb-ft",
    curbMass: "3,389 lb",
    sourceId: "src3"
  },
  sources: [
    {
      id: "test",
      title: "2023 Toyota GR Supra manual drive",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a41096194/2023-toyota-gr-supra-manual-drive/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "GR Supra adds manual transmission for 2023",
      publisher: "Toyota USA",
      url: "https://pressroom.toyota.com/toyota-gr-supra-adds-manual-transmission-and-enhanced-drive-dynamics-for-2023/",
      kind: "manufacturer"
    },
    {
      id: "src2",
      title: "Tested: 2023 Toyota GR Supra 3.0 Manual Answers Our Pleas",
      publisher: "Car and Driver (syndicated on Yahoo)",
      url: "https://autos.yahoo.com/2023-toyota-gr-supra-3-110000407.html",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "GR Supra evolves again with a new manual transmission option",
      publisher: "Toyota Pressroom",
      url: "https://pressroom.toyota.com/?p=78597",
      kind: "manufacturer"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src2",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 3.9,
        quarterMileS: 12.4,
        quarterMileTrapMph: 115
      },
      conditions: {},
      match: "exact",
      verification: "Syndicated copy of the article (original page not reachable from this environment). An aggregator lists the same run at 114 mph.",
      date: "2022"
    }
  ],
  dataGaps: [
    "Manual gear ratios (unpublished)",
    "Tire size",
    "Drag coefficient"
  ],
  notes: [
    "The A91-MT Edition is an appearance/equipment edition of the 3.0 manual; the powertrain is modelled as the 3.0 manual."
  ],
  sim: buildSpec({
  id: "2023-toyota-gr-supra-a91-mt-edition-us-coupe-rwd-6mt",
  make: "Toyota",
  model: "GR Supra",
  trim: "A91-MT Edition",
  modelYear: 2023,
  market: "US",
  body: "Coupe",
  shortName: "Toyota GR Supra 3.0 (manual)"
}, {
    engine: { code: 'B58', description: '3.0 L turbo I6', displacementCc: 2998, aspiration: 'turbo', idleRpm: 700, redlineRpm: 6500, revLimitRpm: 7000, power: { value: 382, unit: 'hp', rpm: [5800, 6500] }, torque: { value: 368, unit: 'lb-ft', rpm: [1800, 5000] }, peakBoostBar: 1.3 },
    transmission: { type: 'manual', name: '6-speed manual (ZF-based, iMT)', gearRatios: [4.11, 2.315, 1.542, 1.179, 1.0, 0.846], finalDrive: 3.46 },
    drivetrain: { layout: 'RWD', efficiency: 0.9, description: 'Rear-wheel drive, active differential' },
    chassis: { curbMassKg: 1537, frontWeightFraction: 0.5, wheelbaseM: 2.47, lengthMm: 4379, widthMm: 1854, heightMm: 1292 },
    aero: {},
    tires: { sizes: [staggered('r19', '255/35 R19 F · 275/35 R19 R', { widthMm: 255, aspectPct: 35, rimIn: 19 }, { widthMm: 275, aspectPct: 35, rimIn: 19 }, 'Michelin Pilot Sport 4S (assumed)')], compound: 'uhp', gripScale: 1.2 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.20', status: 'estimated', source: 'Fitted to the Car and Driver 0–60 mph 3.9 s' },
      { parameter: 'Drivetrain efficiency', value: '90 %', status: 'estimated', source: 'Fitted to the Car and Driver ¼-mile trap 115 mph (fit asked 90.2 %; capped at the 90 % manual bound)' },
      { parameter: 'Peak power', value: '382 hp @ 5,800–6,500', status: 'reported', source: 'Toyota rating (multiple reviews)', url: 'https://www.thedrive.com/car-reviews/2023-toyota-supra-mt-review-perfectly-impractical-better-with-a-stick' },
      { parameter: 'Peak torque', value: '368 lb-ft @ 1,800–5,000 rpm', status: 'reported', source: 'Toyota rating (multiple reviews)', url: 'https://www.thedrive.com/car-reviews/2023-toyota-supra-mt-review-perfectly-impractical-better-with-a-stick' },
      { parameter: 'Gear ratios', value: '4.110/2.315/1.542/1.179/1.000/0.846', status: 'estimated', source: 'Toyota did not publish the ratios; the BMW ZF six-speed set behind the same engine is assumed — awaiting spec sheet' },
      { parameter: 'Final drive', value: '3.46 (automatic 3.15)', status: 'reported', source: 'Toyota press release', url: 'https://pressroom.toyota.com/?p=78597' },
      { parameter: 'Curb mass', value: '3,389 lb (1,537 kg)', status: 'reported', source: 'Cars.com specifications', url: 'https://www.cars.com/research/toyota-gr_supra-2023/specs/428445' },
      { parameter: 'Tire size', value: '255/35 R19 F · 275/35 R19 R', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
