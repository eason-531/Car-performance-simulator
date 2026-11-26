import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

const SHEET = 'https://bugatti-newsroom.imgix.net/66703700d9bf8f4b7ce9211c/211122_BU_Chiron%20ENG.pdf';
const SS_RELEASE = 'https://newsroom.bugatti.com/api/en/press-releases/pdf/shaped-by-speed-the-cutting-edge-technology-behind-worlds-fastest-and-most-luxurious-grand-tourisme';

/**
 * Effective overall reductions (gear × axle) derived from Bugatti's speed-per-gear
 * table at 6,700 rpm (90/150/200/260/320/390/420 km/h) with the simulator's
 * averaged AWD rolling radius 0.33705 m (0.97 × unloaded 285/30 R20 and 355/25 R21):
 * overall = rpm × 2πr ÷ (60 × v). Shared with the Chiron Sport and Super Sport.
 */
export const CHIRON_REDUCTIONS = [9.459, 5.676, 4.257, 3.274, 2.66, 2.183, 2.027] as const;

/** Hypercar extension #2: 2017 Bugatti Chiron (EU). */
export const entry: CatalogEntry = {
  id: "2017-bugatti-chiron-eu-coupe-awd-7dct",
  extension: { set: 'Hypercars', order: 2 },
  section: "Hypercars",
  make: "Bugatti",
  model: "Chiron",
  trim: "Coupé",
  modelYear: 2017,
  market: "EU",
  body: "Coupe",
  bodyLabel: "Coupé",
  aliases: [
    "W16",
    "Chiron 1500"
  ],
  origin: "France",
  usage: [
    "Hypercar",
    "Grand Tourer"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "7-speed dual-clutch",
  powertrain: "Petrol",
  engineLabel: "8.0 quad-turbo W16",
  modelPath: "Existing",
  factory: {
    power: "1,103 kW / 1,500 hp @ 6,700 rpm",
    torque: "1,600 Nm @ 2,000–6,000 rpm",
    curbMass: "1,995 kg (DIN empty)",
    zeroTo100KmhS: 2.4,
    topSpeed: "380 km/h limited (EB / Autobahn / Handling); 420 km/h limited (Top Speed mode)",
    sourceId: "src-bugatti-sheet"
  },
  sources: [
    {
      id: "src-bugatti-sheet",
      title: "Bugatti Chiron technical specifications",
      publisher: "Bugatti",
      url: SHEET,
      kind: "manufacturer"
    },
    {
      id: "src-bugatti-ss",
      title: "Shaped by speed: the technology behind the Chiron Super Sport",
      publisher: "Bugatti",
      url: SS_RELEASE,
      kind: "manufacturer"
    },
    {
      id: "src-cd-sport",
      title: "2021 Bugatti Chiron Sport by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a35353692/2021-bugatti-chiron-sport-by-the-numbers/",
      kind: "road-test",
      date: "2021"
    }
  ],
  benchmarks: [
    {
      id: "cd-sport",
      sourceId: "src-cd-sport",
      publication: "Car and Driver",
      date: "2021",
      timing: "rollout-1ft",
      timingNote: "Car and Driver excludes a 0.2 s one-foot rollout from these times.",
      results: {
        zeroTo60MphS: 2.4,
        quarterMileS: 9.4,
        quarterMileTrapMph: 158,
        rolloutS: 0.2
      },
      conditions: {
        testMass: "4,544 lb as tested",
        tires: "Michelin Pilot Sport Cup 2 BG, 285/30ZR20 F / 355/25ZR21 R",
        launchControl: "Launch control used"
      },
      match: "equivalent",
      deviation: "The test car was a 2018 Chiron retrofitted by Bugatti to Chiron Sport specification (Sport lightweight parts, about −18 kg, and chassis tune); published 2021. Same engine, gearbox, tire sizes and aero modes as this Chiron.",
      verification: "Full instrumented article, test context and conditions as verified in the Codex review of 7571153 (2026-11); the Car and Driver site refuses automated fetches from this session. Equivalent for both the Chiron and the production Chiron Sport."
    }
  ],
  dataGaps: [
    "Individual gear and axle ratios (only effective reductions derived from the speed-per-gear table)",
    "7th-gear reduction (the listed 420 km/h equals the Top Speed limiter, so 7th is at least this tall)",
    "Frontal area",
    "Weight distribution",
    "Rev limit (gear speeds are listed at 6,700 rpm; the Super Sport release implies about 6,800 rpm)",
    "Launch-control rpm"
  ],
  simCaveats: [
    "Gearing uses effective overall reductions derived from Bugatti's speed-per-gear table; the final-drive entry is 1.000 and the gearbox/axle split is not published.",
    "Provisional AWD approximation: one averaged rolling radius ties engine speed to both axles, and the BorgWarner front coupling uses a generic 0–50 % front-share range.",
    "Provisional calibration: grip and efficiency are transferred from the Chiron Sport fit, itself made to Car and Driver's run of a retrofitted 2018 Chiron (equivalent)."
  ],
  sim: buildSpec({
  id: "2017-bugatti-chiron-eu-coupe-awd-7dct",
  make: "Bugatti",
  model: "Chiron",
  trim: "Coupé",
  modelYear: 2017,
  market: "EU",
  body: "Coupe",
  shortName: "Bugatti Chiron"
}, {
    engine: { code: 'W16 8.0 (2-stage, 4 turbos)', description: '8.0 L quad-turbo W16', displacementCc: 7993, aspiration: 'twin-turbo', idleRpm: 800, redlineRpm: 6700, revLimitRpm: 6800, power: { value: 1103, unit: 'kW', rpm: [6700, 6700] }, torque: { value: 1600, unit: 'Nm', rpm: [2000, 6000] } },
    transmission: { type: 'dual-clutch', name: '7-speed DSG dual-clutch (effective reductions)', gearRatios: CHIRON_REDUCTIONS, finalDrive: 1, launchClutch: { creepTorqueNm: 40 } },
    drivetrain: { layout: 'AWD', efficiency: 0.84, description: 'Permanent AWD: BorgWarner-controlled front longitudinal differential, rear differential with controlled lock', frontShareRange: [0, 0.5] },
    chassis: { curbMassKg: 1995, frontWeightFraction: 0.43, wheelbaseM: 2.711, lengthMm: 4544, widthMm: 2038, heightMm: 1212 },
    aero: { dragCoefficient: 0.4, frontalAreaM2: 2.08 },
    tires: { sizes: [staggered('r20r21', '285/30 ZR20 F · 355/25 ZR21 R', { widthMm: 285, aspectPct: 30, rimIn: 20 }, { widthMm: 355, aspectPct: 25, rimIn: 21 }, 'Factory fitment (Bugatti-specific "BG" tires)')], compound: 'uhp', gripScale: 1 },
    speedLimiterKmh: 380,
    factory: { zeroTo100S: 2.4, topSpeedKmh: 380 },
    provenance: [
      { parameter: 'Peak power', value: '1,103 kW (1,500 PS) @ 6,700 rpm', status: 'verified', source: 'Bugatti Chiron technical specifications', url: SHEET },
      { parameter: 'Peak torque', value: '1,600 Nm @ 2,000–6,000 rpm', status: 'verified', source: 'Bugatti Chiron technical specifications', url: SHEET },
      { parameter: 'Gear ratios', value: 'Effective 9.459/5.676/4.257/3.274/2.660/2.183/2.027', status: 'estimated', source: 'Derived from the factory speed-per-gear table at 6,700 rpm (90/150/200/260/320/390/420 km/h) with the simulator rolling radius 0.33705 m. Speeds are rounded to 10 km/h (±5.6 % on 1st, ≤±1.6 % from 3rd). Gears 2–6 agree within rounding with the Super Sport table at its 7,100 rpm ceiling (159/212/276/339/413 vs 160/210/280/340/415 km/h); 7th is limiter-bound', url: SHEET },
      { parameter: 'Final drive', value: '1.000 (folded into the effective reductions)', status: 'estimated', source: 'Bugatti does not publish the gearbox/axle split' },
      { parameter: 'Tire size', value: '285/30 ZR20 F · 355/25 ZR21 R', status: 'verified', source: 'Bugatti Chiron technical specifications', url: SHEET },
      { parameter: 'Curb mass', value: '1,995 kg (DIN empty)', status: 'verified', source: 'Bugatti Chiron technical specifications', url: SHEET },
      { parameter: 'Dimensions', value: '4,544 × 2,038 × 1,212 mm, WB 2,711 mm', status: 'verified', source: 'Bugatti Chiron technical specifications', url: SHEET },
      { parameter: 'Speed limiter', value: '380 km/h (EB / Autobahn / Handling); 420 km/h in Top Speed mode, documented separately', status: 'verified', source: 'Bugatti Chiron technical specifications', url: SHEET },
      { parameter: 'Drag coefficient', value: 'Cd 0.40 (EB mode); 0.39 Autobahn, 0.41 Handling, 0.36 Top Speed', status: 'verified', source: 'Bugatti Chiron technical specifications (EB mode modelled)', url: SHEET },
      { parameter: 'Frontal area', value: '2.08 m²', status: 'estimated', source: '≈ 0.84 × 2,038 mm × 1,212 mm; not published' },
      { parameter: 'Rev limit', value: '6,700 rpm redline / 6,800 rpm limit', status: 'estimated', source: 'Gear speeds are listed at 6,700 rpm; the Super Sport release adds 300 rpm to reach its 7,100 rpm plateau', url: SS_RELEASE },
      { parameter: 'Idle speed', value: '800 rpm', status: 'estimated', source: 'Not published' },
      { parameter: 'Creep torque', value: '40 Nm clutch torque off the brake', status: 'estimated', source: 'Dual-clutch creep sized for a ≈ 2-tonne car (the generic 25 Nm barely moves it); affects idle creep only, not launches' },
      { parameter: 'Weight distribution', value: '43 % front', status: 'estimated', source: 'Mid-engine layout; not published' },
      { parameter: 'AWD split', value: 'Front share 0–0.50', status: 'estimated', source: 'Front-axle controlled longitudinal differential (BorgWarner); no fixed split published' },
      { parameter: 'Tire grip calibration', value: '×1.00', status: 'estimated', source: 'Transferred from the Chiron Sport calibration (same tires and powertrain), where the fit to Car and Driver 0–60 mph reaches the 1.00 floor' },
      { parameter: 'Drivetrain efficiency', value: '84 %', status: 'estimated', source: 'Transferred from the Chiron Sport calibration (held at the plausible AWD floor; trap residual left visible)' },
    ],
  }),
};
