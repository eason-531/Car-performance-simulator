import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

const ARCHIVE = 'https://newsroom.porsche.com/pdf/17da8703-0d52-4ab7-8630-6e98ff05c194?print=';
const MY05 = 'https://www.ausmotive.com/downloads/Porsche/Carrera-GT-specs.pdf';

/** Hypercar extension #6: 2005 Porsche Carrera GT (Germany). */
export const entry: CatalogEntry = {
  id: "2005-porsche-carrera-gt-de-convertible-rwd-6mt",
  extension: { set: 'Hypercars', order: 6 },
  section: "Hypercars",
  make: "Porsche",
  model: "Carrera GT",
  trim: "Roadster",
  modelYear: 2005,
  market: "DE",
  body: "Convertible",
  bodyLabel: "Roadster (two-piece removable roof)",
  chassisCode: "980",
  aliases: [
    "980",
    "CGT"
  ],
  origin: "Germany",
  usage: [
    "Hypercar",
    "Track"
  ],
  drive: "RWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "5.7 V10",
  modelPath: "MT",
  factory: {
    power: "450 kW (612 PS) @ 8,000 rpm",
    torque: "590 Nm @ 5,750 rpm",
    curbMass: "1,380 kg (DIN unladen)",
    zeroTo100KmhS: 3.9,
    topSpeed: "330 km/h",
    sourceId: "src-porsche-archive"
  },
  sources: [
    {
      id: "src-porsche-archive",
      title: "25 years of the Carrera GT (technical data)",
      publisher: "Porsche",
      url: ARCHIVE,
      kind: "manufacturer",
      date: "2025"
    },
    {
      id: "src-porsche-my05",
      title: "Specifications Carrera GT (MY05 technical table, mirrored)",
      publisher: "Porsche (mirror)",
      url: MY05,
      kind: "manufacturer"
    },
    {
      id: "src-cd-2004",
      title: "Porsche Carrera GT road test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15132548/porsche-carrera-gt-road-test/",
      kind: "road-test",
      date: "2004-06"
    }
  ],
  benchmarks: [
    {
      id: "cd-2004",
      sourceId: "src-cd-2004",
      publication: "Car and Driver",
      date: "2004-06",
      timing: "unconfirmed",
      timingNote: "Car and Driver test from June 2004, under its legacy (pre-late-2019) procedure. The timing basis is not confirmed, so both simulator bases are shown and grip is not fitted to this run.",
      results: {
        zeroTo60MphS: 3.5,
        quarterMileS: 11.2,
        quarterMileTrapMph: 132
      },
      conditions: {
        testMass: "3,146 lb as tested",
        other: [
          "Six-speed manual",
          "Rated 605 hp @ 8,000 rpm as printed by Car and Driver"
        ]
      },
      match: "equivalent",
      deviation: "US-market Carrera GT as rated and weighed by Car and Driver (605 hp as printed, 3,146 lb as tested); this configuration is the German-specification car (450 kW / 612 PS DIN, 1,380 kg DIN unladen, kept independently).",
      verification: "Original Car and Driver road test as verified in the Codex review of 7571153 (2026-11): 3.5 s to 60 mph, 11.2 s @ 132 mph. Replaces the unverified secondary lead (11.1 s @ 133 mph). The Car and Driver site refuses automated fetches from this session."
    }
  ],
  dataGaps: [
    "Car and Driver 2004 timing procedure (needed before fitting grip to its run)",
    "Weight distribution",
    "Frontal area",
    "US-market rating (605 hp SAE) and US curb weight"
  ],
  simCaveats: [
    "Grip is the RWD calibration median, not fitted: the only measured run (Car and Driver 2004, US-market, equivalent) has an unconfirmed timing basis. The simulation reaches 60 mph in ≈ 3.21 s (brake release) / 2.90 s (1-ft rollout) against 3.5 s measured, and 100 km/h in ≈ 3.35 s against Porsche's 3.9 s claim."
  ],
  notes: [
    "Porsche's 0–100 km/h 3.9 s, 0–160 km/h 6.9 s, 0–200 km/h 9.9 s and standing kilometre 20.0 s are factory claims, not measurements."
  ],
  sim: buildSpec({
  id: "2005-porsche-carrera-gt-de-convertible-rwd-6mt",
  make: "Porsche",
  model: "Carrera GT",
  trim: "Roadster",
  modelYear: 2005,
  market: "DE",
  body: "Convertible",
  shortName: "Porsche Carrera GT"
}, {
    engine: { code: 'Carrera GT V10', description: '5.7 L naturally aspirated V10', displacementCc: 5733, aspiration: 'na', idleRpm: 900, redlineRpm: 8400, revLimitRpm: 8400, power: { value: 450, unit: 'kW', rpm: [8000, 8000] }, torque: { value: 590, unit: 'Nm', rpm: [5750, 5750] } },
    transmission: { type: 'manual', name: '6-speed manual (ceramic PCCC clutch)', gearRatios: [3.2, 1.87, 1.36, 1.07, 0.9, 0.75], finalDrive: 4.44 },
    drivetrain: { layout: 'RWD', description: 'Rear-wheel drive (engine and gearbox as one unit, twin drive shafts)' },
    chassis: { curbMassKg: 1380, frontWeightFraction: 0.42, wheelbaseM: 2.73, lengthMm: 4613, widthMm: 1921, heightMm: 1166 },
    aero: { dragCoefficient: 0.39 },
    tires: { sizes: [staggered('r19r20', '265/35 ZR19 F · 335/30 ZR20 R', { widthMm: 265, aspectPct: 35, rimIn: 19 }, { widthMm: 335, aspectPct: 30, rimIn: 20 }, 'Factory fitment on forged magnesium wheels')], compound: 'uhp', gripScale: 1.3 },
    speedLimiterKmh: null,
    factory: { zeroTo100S: 3.9, topSpeedKmh: 330 },
    provenance: [
      { parameter: 'Peak power', value: '450 kW (612 PS) @ 8,000 rpm', status: 'verified', source: 'Porsche technical data (archive) and MY05 table', url: ARCHIVE },
      { parameter: 'Peak torque', value: '590 Nm @ 5,750 rpm', status: 'verified', source: 'Porsche technical data (archive) and MY05 table', url: ARCHIVE },
      { parameter: 'Rev limit', value: '8,400 rpm', status: 'verified', source: 'Porsche MY05 table (max engine speed)', url: MY05 },
      { parameter: 'Gear ratios', value: '3.20/1.87/1.36/1.07/0.90/0.75', status: 'verified', source: 'Porsche MY05 table (mirrored)', url: MY05 },
      { parameter: 'Final drive', value: '4.44', status: 'verified', source: 'Porsche MY05 table (mirrored)', url: MY05 },
      { parameter: 'Tire size', value: '265/35 ZR19 F · 335/30 ZR20 R', status: 'verified', source: 'Porsche MY05 table (mirrored)', url: MY05 },
      { parameter: 'Curb mass', value: '1,380 kg (DIN unladen)', status: 'verified', source: 'Porsche technical data (archive) and MY05 table', url: ARCHIVE },
      { parameter: 'Dimensions', value: '4,613 × 1,921 × 1,166 mm, WB 2,730 mm', status: 'verified', source: 'Porsche technical data (archive)', url: ARCHIVE },
      { parameter: 'Drag coefficient', value: 'Cd 0.39', status: 'verified', source: 'Porsche MY05 table (mirrored); rear wing rises at speed', url: MY05 },
      { parameter: 'Weight distribution', value: '42 % front', status: 'estimated', source: 'Mid-engine layout; not in the Porsche tables' },
      { parameter: 'Idle speed', value: '900 rpm', status: 'estimated', source: 'Not published' },
      { parameter: 'Tire grip calibration', value: '×1.30', status: 'estimated', source: 'RWD layout median of the calibrated cars; not fitted because the Car and Driver 2004 run (equivalent) has an unconfirmed timing basis' },
    ],
  }),
};
