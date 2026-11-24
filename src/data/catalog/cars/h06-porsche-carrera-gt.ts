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
    }
  ],
  benchmarks: [],
  dataGaps: [
    "Measured road test (a 2004 Car and Driver result is known only through secondary summaries; verification requested)",
    "Weight distribution",
    "Frontal area",
    "US-market rating (605 hp SAE) and US curb weight"
  ],
  simCaveats: [
    "No verified measured benchmark: grip is the RWD calibration median. The simulation reaches 100 km/h in ≈ 3.35 s against Porsche's 3.9 s claim (200 km/h ≈ 9.8 s vs 9.9 s claimed)."
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
      { parameter: 'Tire grip calibration', value: '×1.30', status: 'estimated', source: 'No verified measured benchmark; RWD layout median of the calibrated cars' },
    ],
  }),
};
