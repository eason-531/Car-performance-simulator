import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';
import { CHIRON_REDUCTIONS } from './h02-bugatti-chiron';

const SHEET = 'https://bugatti-newsroom.imgix.net/6673f255bde16a1e54953020/211122_BU_Chiron%20Sport_ENG-1.pdf';
const BASE_SHEET = 'https://bugatti-newsroom.imgix.net/66703700d9bf8f4b7ce9211c/211122_BU_Chiron%20ENG.pdf';

/** Hypercar extension #10: 2021 Bugatti Chiron Sport (US). */
export const entry: CatalogEntry = {
  id: "2021-bugatti-chiron-sport-us-coupe-awd-7dct",
  extension: { set: 'Hypercars', order: 10 },
  section: "Hypercars",
  make: "Bugatti",
  model: "Chiron",
  trim: "Sport",
  modelYear: 2021,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupé",
  aliases: [
    "Chiron Sport",
    "W16"
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
    curbMass: "1,977 kg (Bugatti: 18 kg lighter than the Chiron; homologated DIN empty value stays 1,995 kg)",
    zeroTo100KmhS: 2.4,
    topSpeed: "380 km/h limited (EB / Autobahn / Handling); 420 km/h limited (Top Speed mode)",
    sourceId: "src-bugatti-sheet"
  },
  sources: [
    {
      id: "src-bugatti-sheet",
      title: "Bugatti Chiron Sport technical specifications",
      publisher: "Bugatti",
      url: SHEET,
      kind: "manufacturer"
    },
    {
      id: "src-bugatti-base",
      title: "Bugatti Chiron technical specifications (speed-per-gear basis)",
      publisher: "Bugatti",
      url: BASE_SHEET,
      kind: "manufacturer"
    },
    {
      id: "src-cd",
      title: "Bugatti Chiron tested: quickest car ever (Chiron Sport)",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/news/a35105452/bugatti-chiron-tested-quickest-car-ever/",
      kind: "road-test",
      date: "2021"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src-cd",
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
        testMass: "4,544 lb as tested"
      },
      match: "exact",
      verification: "Result, test mass and rollout as verified in the Codex hypercar handoff (main 62eca11, 2026-11); the Car and Driver page refuses automated fetches from this session. Test-car model year, drive mode and tires not transcribed."
    }
  ],
  dataGaps: [
    "Individual gear and axle ratios (effective reductions shared with the Chiron)",
    "7th-gear reduction (limiter-bound in the factory table)",
    "Frontal area",
    "Weight distribution",
    "Rev limit",
    "Launch-control rpm",
    "Car and Driver test-car model year, drive mode and tires"
  ],
  simCaveats: [
    "Gearing uses the Chiron's effective overall reductions (the Sport sheet repeats the Chiron speed-per-gear table); the final-drive entry is 1.000.",
    "Provisional AWD approximation: one averaged rolling radius ties engine speed to both axles, and the front coupling uses a generic 0–50 % front-share range."
  ],
  sim: buildSpec({
  id: "2021-bugatti-chiron-sport-us-coupe-awd-7dct",
  make: "Bugatti",
  model: "Chiron",
  trim: "Sport",
  modelYear: 2021,
  market: "US",
  body: "Coupe",
  shortName: "Bugatti Chiron Sport"
}, {
    engine: { code: 'W16 8.0 (2-stage, 4 turbos)', description: '8.0 L quad-turbo W16', displacementCc: 7993, aspiration: 'twin-turbo', idleRpm: 800, redlineRpm: 6700, revLimitRpm: 6800, power: { value: 1103, unit: 'kW', rpm: [6700, 6700] }, torque: { value: 1600, unit: 'Nm', rpm: [2000, 6000] } },
    transmission: { type: 'dual-clutch', name: '7-speed DSG dual-clutch (effective reductions)', gearRatios: CHIRON_REDUCTIONS, finalDrive: 1, launchClutch: { creepTorqueNm: 40 } },
    drivetrain: { layout: 'AWD', efficiency: 0.84, description: 'Permanent AWD: BorgWarner-controlled front longitudinal differential, rear differential with controlled lock', frontShareRange: [0, 0.5] },
    chassis: { curbMassKg: 1977, frontWeightFraction: 0.43, wheelbaseM: 2.711, lengthMm: 4544, widthMm: 2038, heightMm: 1212 },
    aero: { dragCoefficient: 0.4, frontalAreaM2: 2.08 },
    tires: { sizes: [staggered('r20r21', '285/30 ZR20 F · 355/25 ZR21 R', { widthMm: 285, aspectPct: 30, rimIn: 20 }, { widthMm: 355, aspectPct: 25, rimIn: 21 }, 'Factory fitment (Bugatti-specific "BG" tires)')], compound: 'uhp', gripScale: 1 },
    speedLimiterKmh: 380,
    factory: { zeroTo100S: 2.4, topSpeedKmh: 380 },
    provenance: [
      { parameter: 'Peak power', value: '1,103 kW (1,500 PS) @ 6,700 rpm', status: 'verified', source: 'Bugatti Chiron Sport technical specifications', url: SHEET },
      { parameter: 'Peak torque', value: '1,600 Nm @ 2,000–6,000 rpm', status: 'verified', source: 'Bugatti Chiron Sport technical specifications', url: SHEET },
      { parameter: 'Gear ratios', value: 'Effective 9.459/5.676/4.257/3.274/2.660/2.183/2.027', status: 'estimated', source: 'Chiron reductions derived from the speed-per-gear table at 6,700 rpm, which the Sport sheet repeats (90/150/200/260/320/390/420 km/h); 7th is limiter-bound', url: SHEET },
      { parameter: 'Final drive', value: '1.000 (folded into the effective reductions)', status: 'estimated', source: 'Bugatti does not publish the gearbox/axle split' },
      { parameter: 'Tire size', value: '285/30 ZR20 F · 355/25 ZR21 R', status: 'verified', source: 'Bugatti Chiron Sport technical specifications', url: SHEET },
      { parameter: 'Curb mass', value: '1,977 kg', status: 'verified', source: 'Bugatti Chiron Sport sheet: 18 kg lighter than the Chiron through lightweight measures; the homologated DIN empty value stays 1,995 kg because the Sport was not homologated as a variant', url: SHEET },
      { parameter: 'Dimensions', value: '4,544 × 2,038 × 1,212 mm, WB 2,711 mm', status: 'verified', source: 'Bugatti Chiron Sport technical specifications', url: SHEET },
      { parameter: 'Speed limiter', value: '380 km/h (EB / Autobahn / Handling); 420 km/h in Top Speed mode, documented separately', status: 'verified', source: 'Bugatti Chiron Sport technical specifications', url: SHEET },
      { parameter: 'Drag coefficient', value: 'Cd 0.40 (EB mode); 0.39 Autobahn, 0.41 Handling, 0.36 Top Speed', status: 'verified', source: 'Bugatti Chiron Sport technical specifications (EB mode modelled)', url: SHEET },
      { parameter: 'Frontal area', value: '2.08 m²', status: 'estimated', source: '≈ 0.84 × 2,038 mm × 1,212 mm; not published' },
      { parameter: 'Rev limit', value: '6,700 rpm redline / 6,800 rpm limit', status: 'estimated', source: 'As the Chiron: gear speeds listed at 6,700 rpm; Super Sport release adds 300 rpm to reach 7,100 rpm' },
      { parameter: 'Idle speed', value: '800 rpm', status: 'estimated', source: 'Not published' },
      { parameter: 'Creep torque', value: '40 Nm clutch torque off the brake', status: 'estimated', source: 'Dual-clutch creep sized for a ≈ 2-tonne car (the generic 25 Nm barely moves it); affects idle creep only, not launches' },
      { parameter: 'Weight distribution', value: '43 % front', status: 'estimated', source: 'Mid-engine layout; not published' },
      { parameter: 'AWD split', value: 'Front share 0–0.50', status: 'estimated', source: 'Front-axle controlled longitudinal differential (BorgWarner); no fixed split published' },
      { parameter: 'Tire grip calibration', value: '×1.00', status: 'estimated', source: 'Fit to the Car and Driver 0–60 mph 2.4 s (1-ft rollout) reaches the 1.00 floor; the simulation stays ≈ 0.06 s quicker' },
      { parameter: 'Drivetrain efficiency', value: '84 %', status: 'estimated', source: 'A trap fit to 158 mph asked for less than 80 %, below the plausible AWD range; held at 84 % (the lowest accepted AWD value) and the ≈ +4 mph trap residual left visible with no cause attributed' },
    ],
  }),
};
