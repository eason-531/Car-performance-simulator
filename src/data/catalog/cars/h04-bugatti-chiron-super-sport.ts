import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';
import { CHIRON_REDUCTIONS } from './h02-bugatti-chiron';

const SHEET = 'https://bugatti-newsroom.imgix.net/6673edce31d99cf64fc74087/211122_BU_Chiron%20Super%20Sport_ENG.pdf';
const RELEASE = 'https://newsroom.bugatti.com/api/en/press-releases/pdf/shaped-by-speed-the-cutting-edge-technology-behind-worlds-fastest-and-most-luxurious-grand-tourisme';
const BASE_SHEET = 'https://bugatti-newsroom.imgix.net/66703700d9bf8f4b7ce9211c/211122_BU_Chiron%20ENG.pdf';

/** Super Sport seventh: Bugatti states it is 3.6 % longer than the Chiron's. */
const SS_REDUCTIONS = [...CHIRON_REDUCTIONS.slice(0, 6), Math.round((CHIRON_REDUCTIONS[6] / 1.036) * 1000) / 1000];

/** Hypercar extension #4: 2022 Bugatti Chiron Super Sport (US). */
export const entry: CatalogEntry = {
  id: "2022-bugatti-chiron-super-sport-us-coupe-awd-7dct",
  extension: { set: 'Hypercars', order: 4 },
  section: "Hypercars",
  make: "Bugatti",
  model: "Chiron",
  trim: "Super Sport",
  modelYear: 2022,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupé (long tail)",
  aliases: [
    "Chiron Super Sport",
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
    power: "1,177 kW / 1,600 hp @ 7,050–7,100 rpm",
    torque: "1,600 Nm @ 2,250–7,000 rpm",
    curbMass: "1,995 kg (DIN empty; Bugatti states a 23 kg reduction not reflected in the homologated value)",
    zeroTo100KmhS: 2.4,
    topSpeed: "380 km/h (EB / Autobahn / Handling); 440 km/h (Top Speed mode)",
    sourceId: "src-bugatti-sheet"
  },
  sources: [
    {
      id: "src-bugatti-sheet",
      title: "Bugatti Chiron Super Sport technical specifications",
      publisher: "Bugatti",
      url: SHEET,
      kind: "manufacturer"
    },
    {
      id: "src-bugatti-release",
      title: "Shaped by speed: the technology behind the Chiron Super Sport",
      publisher: "Bugatti",
      url: RELEASE,
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
      title: "2022 Bugatti Chiron Super Sport by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a39429194/2022-bugatti-chiron-super-sport-by-the-numbers/",
      kind: "road-test",
      date: "2022"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src-cd",
      publication: "Car and Driver",
      date: "2022",
      timing: "rollout-1ft",
      timingNote: "Car and Driver excludes a 0.2 s one-foot rollout from these times.",
      results: {
        zeroTo60MphS: 2.2,
        quarterMileS: 9.1,
        quarterMileTrapMph: 161,
        rolloutS: 0.2
      },
      conditions: {
        testMass: "4,587 lb as tested",
        tires: "Michelin Pilot Sport Cup 2 BG2, 285/30ZR20 F / 355/25ZR21 R",
        launchControl: "Launch at about 2,500 rpm (as described by Car and Driver)"
      },
      match: "exact",
      verification: "Result, test mass and rollout as verified in the Codex hypercar handoff (main 62eca11, 2026-11); the Car and Driver page refuses automated fetches from this session. Tires and the ≈ 2,500 rpm launch added per the Codex review of 7571153; drive mode not confirmed. The prototype 300 mph record car is a separate configuration and is not used."
    }
  ],
  dataGaps: [
    "Individual gear and axle ratios (effective reductions from the Chiron table plus Bugatti's 3.6 % longer 7th)",
    "Frontal area",
    "Weight distribution",
    "Car and Driver drive mode"
  ],
  simCaveats: [
    "Gearing uses the Chiron's effective reductions for 1st–6th (the Super Sport table at ≈7,100 rpm agrees within rounding) and a 7th 3.6 % longer per Bugatti; the final-drive entry is 1.000.",
    "Provisional AWD approximation: one averaged rolling radius ties engine speed to both axles, and the front coupling uses a generic 0–50 % front-share range."
  ],
  sim: buildSpec({
  id: "2022-bugatti-chiron-super-sport-us-coupe-awd-7dct",
  make: "Bugatti",
  model: "Chiron",
  trim: "Super Sport",
  modelYear: 2022,
  market: "US",
  body: "Coupe",
  shortName: "Bugatti Chiron Super Sport"
}, {
    engine: { code: 'W16 8.0 (2-stage, 4 turbos)', description: '8.0 L quad-turbo W16', displacementCc: 7993, aspiration: 'twin-turbo', idleRpm: 800, redlineRpm: 7100, revLimitRpm: 7100, power: { value: 1177, unit: 'kW', rpm: [7050, 7100] }, torque: { value: 1600, unit: 'Nm', rpm: [2250, 7000] } },
    transmission: { type: 'dual-clutch', name: '7-speed DSG dual-clutch (effective reductions)', gearRatios: SS_REDUCTIONS, finalDrive: 1, launchClutch: { launchRpm: 2500, brakeHoldRpmLimit: 2500, creepTorqueNm: 40 } },
    drivetrain: { layout: 'AWD', efficiency: 0.84, description: 'Permanent AWD: BorgWarner-controlled front longitudinal differential, rear differential with controlled lock', frontShareRange: [0, 0.5] },
    chassis: { curbMassKg: 1972, frontWeightFraction: 0.43, wheelbaseM: 2.711, lengthMm: 4733, widthMm: 2038, heightMm: 1212 },
    aero: { dragCoefficient: 0.38, frontalAreaM2: 2.08 },
    tires: { sizes: [staggered('r20r21', '285/30 ZR20 F · 355/25 ZR21 R', { widthMm: 285, aspectPct: 30, rimIn: 20 }, { widthMm: 355, aspectPct: 25, rimIn: 21 }, 'Factory fitment (Bugatti-specific "BG2" tires)')], compound: 'uhp', gripScale: 1.05 },
    speedLimiterKmh: 380,
    factory: { zeroTo100S: 2.4, topSpeedKmh: 380 },
    provenance: [
      { parameter: 'Peak power', value: '1,177 kW (1,600 PS) @ 7,050–7,100 rpm', status: 'verified', source: 'Bugatti Chiron Super Sport technical specifications and release', url: SHEET },
      { parameter: 'Peak torque', value: '1,600 Nm @ 2,250–7,000 rpm', status: 'verified', source: 'Bugatti Chiron Super Sport technical specifications', url: SHEET },
      { parameter: 'Gear ratios', value: `Effective ${SS_REDUCTIONS.map((r) => r.toFixed(3)).join('/')}`, status: 'estimated', source: '1st–6th: Chiron reductions from its 6,700 rpm speed-per-gear table; the Super Sport table (100/160/210/280/340/415 km/h) matches them at its 7,100 rpm ceiling within rounding. 7th: Chiron 7th ÷ 1.036 (Bugatti release: 3.6 % longer). The Chiron 7th is itself bounded by its 420 km/h limiter entry, so this 7th is a derived bound, not a published ratio; the Super Sport table entry "7th 440 km/h (deactivated)" is the Top Speed-mode limit and is not used to derive it (the derived 7th would reach ≈ 461 km/h at 7,100 rpm)', url: RELEASE },
      { parameter: '6→7 upshift check', value: 'Simulated full-load upshift 407 km/h (7,000 rpm) vs Bugatti 403 km/h', status: 'reported', source: 'Bugatti release: at full load the gearbox shifts from sixth to seventh at 403 km/h. The ≈ 1 % gap checks the derived 6th reduction and shift point; it does not verify the 7th ratio', url: RELEASE },
      { parameter: 'Launch rpm', value: '≈ 2,500 rpm (launch control)', status: 'reported', source: 'Car and Driver describes an approximately 2,500 rpm launch in its Super Sport test (Codex review of 7571153); replaces the generic 3,000 rpm default. The launch is traction-limited, so 0–60 mph, ¼ mile and trap are unchanged at 0.01 s / 0.1 mph resolution' },
      { parameter: 'Final drive', value: '1.000 (folded into the effective reductions)', status: 'estimated', source: 'Bugatti does not publish the gearbox/axle split' },
      { parameter: 'Tire size', value: '285/30 ZR20 F · 355/25 ZR21 R', status: 'verified', source: 'Bugatti Chiron Super Sport technical specifications', url: SHEET },
      { parameter: 'Curb mass', value: '1,972 kg (1,995 kg DIN empty − 23 kg)', status: 'reported', source: 'Bugatti sheet: 23 kg lighter through lightweight measures; the homologated DIN empty value stays 1,995 kg because the Super Sport was not homologated as a variant', url: SHEET },
      { parameter: 'Dimensions', value: '4,733 mm long, 2,038 mm body width (2,183 mm incl. mirrors), 1,212 mm high, WB 2,711 mm', status: 'reported', source: 'Bugatti Super Sport sheet (length, height, wheelbase, width incl. mirrors); body width taken from the Chiron sheet', url: SHEET },
      { parameter: 'Speed limiter', value: '380 km/h (EB / Autobahn / Handling); 440 km/h in Top Speed mode, documented separately', status: 'verified', source: 'Bugatti Chiron Super Sport technical specifications', url: SHEET },
      { parameter: 'Drag coefficient', value: 'Cd 0.38 (EB mode); 0.39 Autobahn, 0.41 Handling, 0.35 Top Speed', status: 'verified', source: 'Bugatti Chiron Super Sport technical specifications (EB mode modelled)', url: SHEET },
      { parameter: 'Frontal area', value: '2.08 m²', status: 'estimated', source: 'As the Chiron (≈ 0.84 × 2,038 mm × 1,212 mm); not published' },
      { parameter: 'Rev limit', value: '7,100 rpm', status: 'reported', source: 'Bugatti release: 300 rpm more than the Chiron, power plateau to 7,100 rpm', url: RELEASE },
      { parameter: 'Idle speed', value: '800 rpm', status: 'estimated', source: 'Not published' },
      { parameter: 'Creep torque', value: '40 Nm clutch torque off the brake', status: 'estimated', source: 'Dual-clutch creep sized for a ≈ 2-tonne car (the generic 25 Nm barely moves it); affects idle creep only, not launches' },
      { parameter: 'Weight distribution', value: '43 % front', status: 'estimated', source: 'Mid-engine layout; not published' },
      { parameter: 'AWD split', value: 'Front share 0–0.50', status: 'estimated', source: 'Front-axle controlled longitudinal differential (BorgWarner); no fixed split published' },
      { parameter: 'Tire grip calibration', value: '×1.05', status: 'estimated', source: 'Fitted to the Car and Driver 0–60 mph 2.2 s (1-ft rollout) with efficiency held at 84 %' },
      { parameter: 'Drivetrain efficiency', value: '84 %', status: 'estimated', source: 'A trap fit to 161 mph asked for less than 80 %, below the plausible AWD range; held at 84 % (the lowest accepted AWD value) and the ≈ +4 mph trap residual left visible with no cause attributed' },
    ],
  }),
};
