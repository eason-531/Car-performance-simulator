import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

const SHEET = 'https://bugatti-newsroom.imgix.net/6673ed80bde16a1e5495301d/211122_BU_Chiron%20Pur%20Sport_ENG-1.pdf';
const RELEASE = 'https://newsroom.bugatti.com/en/press-releases/the-technology-of-the-bugatti-chiron-pur-sport-in-detail';

/**
 * Effective overall reductions derived from the Pur Sport speed-per-gear table
 * (90/145/185/230/280/325/350 km/h) at its 6,900 rpm maximum shift speed with the
 * simulator's averaged AWD rolling radius 0.33705 m: overall = rpm × 2πr ÷ (60 × v).
 */
const PUR_SPORT_REDUCTIONS = [9.742, 6.047, 4.739, 3.812, 3.131, 2.698, 2.505] as const;

/** Hypercar extension #11: 2020 Bugatti Chiron Pur Sport (EU). */
export const entry: CatalogEntry = {
  id: "2020-bugatti-chiron-pur-sport-eu-coupe-awd-7dct",
  extension: { set: 'Hypercars', order: 11 },
  section: "Hypercars",
  make: "Bugatti",
  model: "Chiron",
  trim: "Pur Sport",
  modelYear: 2020,
  market: "EU",
  body: "Coupe",
  bodyLabel: "Coupé (fixed rear wing)",
  aliases: [
    "Chiron Pur Sport",
    "W16"
  ],
  origin: "France",
  usage: [
    "Hypercar",
    "Track"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "7-speed dual-clutch (shortened ratios)",
  powertrain: "Petrol",
  engineLabel: "8.0 quad-turbo W16",
  modelPath: "Existing",
  factory: {
    power: "1,103 kW / 1,500 hp @ 6,700–6,900 rpm",
    torque: "1,600 Nm @ 2,000–6,000 rpm",
    curbMass: "1,995 kg (DIN empty; Bugatti states a 50 kg reduction not reflected in the homologated value)",
    zeroTo100KmhS: 2.3,
    topSpeed: "350 km/h (electronically regulated)",
    sourceId: "src-bugatti-sheet"
  },
  sources: [
    {
      id: "src-bugatti-sheet",
      title: "Bugatti Chiron Pur Sport technical specifications",
      publisher: "Bugatti",
      url: SHEET,
      kind: "manufacturer"
    },
    {
      id: "src-bugatti-release",
      title: "The technology of the Bugatti Chiron Pur Sport in detail",
      publisher: "Bugatti",
      url: RELEASE,
      kind: "manufacturer",
      date: "2020-05"
    }
  ],
  benchmarks: [],
  dataGaps: [
    "Individual gear and axle ratios (effective reductions derived from the speed-per-gear table)",
    "Speed-per-gear table rpm (6,900 rpm maximum shift speed assumed; 7,000 rpm maximum engine speed would make every reduction 1.4 % taller)",
    "Measured road test",
    "Frontal area",
    "Weight distribution",
    "Launch-control rpm",
    "0–200 km/h claim (sheet 5.5 s vs release 5.9 s)"
  ],
  simCaveats: [
    "Gearing uses effective overall reductions derived from Bugatti's Pur Sport speed-per-gear table at the 6,900 rpm maximum shift speed; the final-drive entry is 1.000. Relative to the Chiron table the gears are 3–24 % shorter (Bugatti: 'all in all' 15 %).",
    "No measured benchmark: grip and efficiency are the Chiron family's provisional calibration, transferred unchanged (Bugatti's +10 % Cup 2 R figure is lateral and is not applied). The simulation reaches 100 km/h in ≈ 2.67 s from brake release against the 2.3 s factory claim; with +10 % grip it would be ≈ 2.25 s.",
    "Provisional AWD approximation: one averaged rolling radius ties engine speed to both axles, and the front coupling uses a generic 0–50 % front-share range."
  ],
  notes: [
    "Bugatti's 0–100 km/h 2.3 s, 0–200 km/h 5.5 s (sheet; 5.9 s in the release) and 0–300 km/h 12.4 s are factory claims, not measurements."
  ],
  sim: buildSpec({
  id: "2020-bugatti-chiron-pur-sport-eu-coupe-awd-7dct",
  make: "Bugatti",
  model: "Chiron",
  trim: "Pur Sport",
  modelYear: 2020,
  market: "EU",
  body: "Coupe",
  shortName: "Bugatti Chiron Pur Sport"
}, {
    engine: { code: 'W16 8.0 (2-stage, 4 turbos)', description: '8.0 L quad-turbo W16', displacementCc: 7993, aspiration: 'twin-turbo', idleRpm: 800, redlineRpm: 6900, revLimitRpm: 7000, power: { value: 1103, unit: 'kW', rpm: [6700, 6900] }, torque: { value: 1600, unit: 'Nm', rpm: [2000, 6000] } },
    transmission: { type: 'dual-clutch', name: '7-speed DSG dual-clutch (shortened; effective reductions)', gearRatios: PUR_SPORT_REDUCTIONS, finalDrive: 1, launchClutch: { creepTorqueNm: 40 } },
    drivetrain: { layout: 'AWD', efficiency: 0.84, description: 'Permanent AWD: BorgWarner-controlled front longitudinal differential, rear differential with controlled lock', frontShareRange: [0, 0.5] },
    chassis: { curbMassKg: 1945, frontWeightFraction: 0.43, wheelbaseM: 2.711, lengthMm: 4647, widthMm: 2038, heightMm: 1212 },
    aero: { dragCoefficient: 0.38, frontalAreaM2: 2.08 },
    tires: { sizes: [staggered('r20r21', 'Michelin Sport Cup 2 R 285/30 R20 F · 355/25 R21 R', { widthMm: 285, aspectPct: 30, rimIn: 20 }, { widthMm: 355, aspectPct: 25, rimIn: 21 }, 'Factory fitment (Bugatti-exclusive Cup 2 R)')], compound: 'uhp', gripScale: 1 },
    speedLimiterKmh: 350,
    factory: { zeroTo100S: 2.3, topSpeedKmh: 350 },
    provenance: [
      { parameter: 'Peak power', value: '1,103 kW (1,500 PS) @ 6,700–6,900 rpm', status: 'verified', source: 'Bugatti Pur Sport sheet (1,103 kW / 1,500 hp) and release (rated output between 6,700 and 6,900 rpm)', url: RELEASE },
      { parameter: 'Peak torque', value: '1,600 Nm @ 2,000–6,000 rpm', status: 'verified', source: 'Bugatti Chiron Pur Sport technical specifications', url: SHEET },
      { parameter: 'Maximum engine speed', value: '7,000 rpm (200 rpm above the Chiron); maximum shift speed 6,900 rpm', status: 'verified', source: 'Bugatti release', url: RELEASE },
      { parameter: 'Gear ratios', value: 'Effective 9.742/6.047/4.739/3.812/3.131/2.698/2.505', status: 'estimated', source: 'Derived from the factory speed-per-gear table (90/145/185/230/280/325/350 km/h) at the 6,900 rpm maximum shift speed with the simulator rolling radius 0.33705 m. Speeds are rounded to 5 km/h; 7th is limiter-bound ("350 km/h deactivated"). The release states every gear is shorter, 15 % overall', url: SHEET },
      { parameter: 'Final drive', value: '1.000 (folded into the effective reductions)', status: 'estimated', source: 'Bugatti does not publish the gearbox/axle split' },
      { parameter: 'Tire size', value: 'Michelin Sport Cup 2 R 285/30 R20 F · 355/25 R21 R', status: 'verified', source: 'Bugatti Pur Sport sheet and release (Bugatti-exclusive compound, about 10 % more lateral acceleration)', url: SHEET },
      { parameter: 'Curb mass', value: '1,945 kg (1,995 kg DIN empty − 50 kg)', status: 'reported', source: 'Bugatti sheet: a 50 kg reduction through lightweight measures; the homologated DIN empty value stays 1,995 kg', url: SHEET },
      { parameter: 'Dimensions', value: '4,647 mm long, 1,212 mm high, WB 2,711 mm; 2,162 mm wide incl. mirrors (body width 2,038 mm from the Chiron sheet)', status: 'reported', source: 'Bugatti Pur Sport sheet', url: SHEET },
      { parameter: 'Speed limiter', value: '350 km/h', status: 'verified', source: 'Bugatti release: top speed electronically regulated at 350 km/h', url: RELEASE },
      { parameter: 'Drag coefficient', value: 'Cd 0.38 (fixed wing, −5°)', status: 'verified', source: 'Bugatti Chiron Pur Sport technical specifications', url: SHEET },
      { parameter: 'Frontal area', value: '2.08 m²', status: 'estimated', source: 'As the Chiron (≈ 0.84 × 2,038 mm × 1,212 mm); not published' },
      { parameter: 'Model year', value: '2020', status: 'reported', source: 'Bugatti release (May 2020): series production in the second half of 2020', url: RELEASE },
      { parameter: 'Idle speed', value: '800 rpm', status: 'estimated', source: 'Not published' },
      { parameter: 'Creep torque', value: '40 Nm clutch torque off the brake', status: 'estimated', source: 'As the other Chirons; idle creep only' },
      { parameter: 'Weight distribution', value: '43 % front', status: 'estimated', source: 'Mid-engine layout; not published' },
      { parameter: 'AWD split', value: 'Front share 0–0.50', status: 'estimated', source: 'Front-axle controlled longitudinal differential (BorgWarner); no fixed split published' },
      { parameter: 'Tire grip calibration', value: '×1.00 (neutral, transferred)', status: 'estimated', source: 'Provisional: the Chiron family longitudinal calibration, transferred unchanged. Bugatti credits the Cup 2 R with about ten per cent more lateral acceleration; that is lateral evidence and is not applied to launch grip. Sensitivity: ×1.00 → 0–100 km/h 2.67 s, ¼ mile 9.38 s @ 265.1 km/h; ×1.10 → 2.25 s, 8.96 s @ 266.3 km/h (brake release)' },
      { parameter: 'Lateral grip (not modelled)', value: '≈ +10 % lateral acceleration with the Cup 2 R', status: 'reported', source: 'Bugatti release; the straight-line model has no lateral dynamics', url: RELEASE },
      { parameter: 'Drivetrain efficiency', value: '84 %', status: 'estimated', source: 'Provisional: the Chiron family calibration (held at the plausible AWD floor)' },
    ],
  }),
};
