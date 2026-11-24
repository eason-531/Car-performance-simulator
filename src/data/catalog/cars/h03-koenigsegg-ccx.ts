import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

const OEM = 'https://www.koenigsegg.com/technical-specifications-ccx';

/** Hypercar extension #3: 2006 Koenigsegg CCX six-speed manual. */
export const entry: CatalogEntry = {
  id: "2006-koenigsegg-ccx-eu-coupe-rwd-6mt",
  extension: { set: 'Hypercars', order: 3 },
  section: "Hypercars",
  make: "Koenigsegg",
  model: "CCX",
  trim: "Coupé",
  modelYear: 2006,
  market: "EU",
  body: "Coupe",
  bodyLabel: "Targa coupé (removable roof)",
  aliases: [
    "CCX",
    "Competition Coupé X"
  ],
  origin: "Sweden",
  usage: [
    "Hypercar"
  ],
  drive: "RWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "4.7 twin-supercharged V8",
  modelPath: "MT",
  factory: {
    power: "806 bhp @ 7,000 rpm",
    torque: "920 Nm @ 5,500 rpm",
    curbMass: "1,280 kg dry (no curb figure published)",
    zeroTo100KmhS: 3.2,
    topSpeed: "395+ km/h (factory claim)",
    sourceId: "src-oem"
  },
  sources: [
    {
      id: "src-oem",
      title: "CCX technical specifications",
      publisher: "Koenigsegg",
      url: OEM,
      kind: "manufacturer"
    }
  ],
  benchmarks: [],
  dataGaps: [
    "Measured road test of the 6MT (no instrumented result transcribed)",
    "Curb mass (only the 1,280 kg dry weight is published)",
    "Rev limit / redline",
    "Wheelbase",
    "Fuel grade for the 806 bhp rating"
  ],
  simCaveats: [
    "No measured benchmark: grip is the RWD calibration median and curb mass is estimated from the factory dry weight. The simulation reaches 100 km/h in ≈ 3.2 s (Koenigsegg claims 3.2 s) but 200 km/h in ≈ 7.5 s against the 9.8 s claim."
  ],
  notes: [
    "Koenigsegg's performance figures (0–100 km/h 3.2 s, 0–200 km/h 9.8 s, 395+ km/h) are factory claims, not measurements."
  ],
  sim: buildSpec({
  id: "2006-koenigsegg-ccx-eu-coupe-rwd-6mt",
  make: "Koenigsegg",
  model: "CCX",
  trim: "Coupé",
  modelYear: 2006,
  market: "EU",
  body: "Coupe",
  shortName: "Koenigsegg CCX"
}, {
    engine: { code: 'Koenigsegg 4.7 V8', description: '4.7 L twin-supercharged V8 (Rotrex centrifugal)', displacementCc: 4700, aspiration: 'supercharged', idleRpm: 900, redlineRpm: 7200, revLimitRpm: 7200, power: { value: 806, unit: 'hp', rpm: [7000, 7000] }, torque: { value: 920, unit: 'Nm', rpm: [5500, 5500] }, peakBoostBar: 1.4, lowEndFraction: 0.55 },
    transmission: { type: 'manual', name: '6-speed manual (transverse)', gearRatios: [2.875, 1.773, 1.267, 1.0, 0.833, 0.711], finalDrive: 3.364 },
    drivetrain: { layout: 'RWD', description: 'Rear-wheel drive with torque-sensitive limited-slip differential' },
    chassis: { curbMassKg: 1360, frontWeightFraction: 0.45, wheelbaseM: 2.66, lengthMm: 4293, widthMm: 1996, heightMm: 1120 },
    aero: { dragCoefficient: 0.32, frontalAreaM2: 1.867 },
    tires: { sizes: [staggered('r19r20', '255/35 R19 F · 335/30 R20 R', { widthMm: 255, aspectPct: 35, rimIn: 19 }, { widthMm: 335, aspectPct: 30, rimIn: 20 }, 'Factory fitment (Y-rated)')], compound: 'uhp', gripScale: 1.3 },
    speedLimiterKmh: null,
    factory: { zeroTo100S: 3.2 },
    provenance: [
      { parameter: 'Peak power', value: '806 bhp @ 7,000 rpm', status: 'verified', source: 'Koenigsegg CCX technical specifications', url: OEM },
      { parameter: 'Peak torque', value: '920 Nm @ 5,500 rpm', status: 'verified', source: 'Koenigsegg CCX technical specifications', url: OEM },
      { parameter: 'Gear ratios', value: '2.875/1.773/1.267/1.000/0.833/0.711', status: 'verified', source: 'Koenigsegg CCX technical specifications (transverse 6-speed; optional paddle-shift not modelled)', url: OEM },
      { parameter: 'Final drive', value: '3.364', status: 'verified', source: 'Koenigsegg CCX technical specifications', url: OEM },
      { parameter: 'Tire size', value: '255/35 R19 F · 335/30 R20 R', status: 'verified', source: 'Koenigsegg CCX technical specifications', url: OEM },
      { parameter: 'Drag coefficient', value: 'Cd 0.32, frontal area 1.867 m²', status: 'verified', source: 'Koenigsegg CCX technical specifications', url: OEM },
      { parameter: 'Weight distribution', value: '45 % front', status: 'verified', source: 'Koenigsegg CCX technical specifications (45:55)', url: OEM },
      { parameter: 'Dimensions', value: '4,293 × 1,996 × 1,120 mm', status: 'verified', source: 'Koenigsegg CCX technical specifications', url: OEM },
      { parameter: 'Boost pressure', value: '1.4 bar', status: 'verified', source: 'Koenigsegg CCX technical specifications (twin Rotrex centrifugal superchargers)', url: OEM },
      { parameter: 'Curb mass', value: '1,360 kg', status: 'estimated', source: 'Factory dry weight 1,280 kg (1.59 kg/hp) plus ≈ 80 kg of fuel (70 l tank) and fluids; no curb figure published' },
      { parameter: 'Wheelbase', value: '2,660 mm', status: 'estimated', source: 'Not on the factory sheet; commonly published figure' },
      { parameter: 'Rev limit', value: '7,200 rpm', status: 'estimated', source: 'Not published; set just above the 7,000 rpm power peak (6th gear then reaches ≈ 390 km/h against the 395+ km/h claim)' },
      { parameter: 'Idle speed', value: '900 rpm', status: 'estimated', source: 'Not published' },
      { parameter: 'Tire grip calibration', value: '×1.30', status: 'estimated', source: 'No measured benchmark; RWD layout median of the calibrated cars' },
    ],
  }),
};
