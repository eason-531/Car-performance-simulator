import { buildElectricSpec, square } from '../build';
import type { CatalogEntry } from '../types';

const TECH = 'https://www.hyundai.news/newsroom/dam/eu/press-kits/20240325_ioniq_5_n/hyundai-ioniq-5-n-technical-data-0324.pdf';
const KIT = 'https://www.hyundai.news/eu/models/performance/ioniq-5-n/press-kit/press-information.html';
const EPA = 'https://www.epa.gov/system/files/documents/2026-01/25-testcar-2026-01-21.xlsx';
const MT = 'https://www.motortrend.com/reviews/2025-hyundai-ioniq-5-n-first-test-review';
/** Hyundai IONIQ 5 N owner's manual (2025, UK edition): N Grin Boost, N Launch Control and N e-Shift pages. */
const OM_NGB = 'https://ownersmanual.hyundai.com/full_webhelp/NE1N/2025/en_UK/id2362F020YYK.html';
const OM_LC = 'https://ownersmanual.hyundai.com/full_webhelp/NE1N/2025/en_UK/id2362E0V0UY4.html';
const OM_ESHIFT = 'https://ownersmanual.hyundai.com/full_webhelp/NE1N/2025/en_UK/id2362E07M0Y4.html';

/** Overall reduction from the EPA N/V of 128.5 rpm/mph with the 275/35 R21 rolling radius (0.35206 m). */
const REDUCTION = 10.6;

/**
 * N e-Shift virtual gears (estimated; Hyundai publishes none): the 8-speed N DCT
 * overall ratios (Elantra N: gears × 3.800 / 2.714 finals) scaled so the virtual
 * 8th reaches the 260 km/h top speed at the 6,850 rpm virtual limiter.
 */
const N_DCT = [3.714 * 3.8, 2.261 * 3.8, 2.174 * 2.714, 1.621 * 2.714, 0.927 * 3.8, 0.767 * 3.8, 0.878 * 2.714, 0.698 * 2.714];
const ESHIFT_SCALE = 6850 / ((260 / 3.6 / 0.35206) * (60 / (2 * Math.PI)) * N_DCT[7]);
const ESHIFT_RATIOS = N_DCT.map((r) => Math.round(r * ESHIFT_SCALE * 1000) / 1000);

/** Roster #68: 2025 Hyundai Ioniq 5 N Ioniq 5 N (US). */
export const entry: CatalogEntry = {
  id: "2025-hyundai-ioniq-5-n-us-cuv-awd-ev",
  roster: 68,
  section: "Electric cars and trucks",
  make: "Hyundai",
  model: "Ioniq 5 N",
  trim: "Ioniq 5 N",
  modelYear: 2025,
  market: "US",
  body: "Crossover",
  bodyLabel: "Crossover",
  chassisCode: "NE",
  aliases: [
    "Ioniq5N",
    "N Grin Boost"
  ],
  origin: "South Korea",
  usage: [
    "SUV",
    "Track"
  ],
  drive: "AWD",
  transmission: "Direct drive",
  transmissionLabel: "Single-speed",
  powertrain: "Electric",
  engineLabel: "Dual-motor (166 kW front + 282 kW rear; N Grin Boost 175 + 303 kW)",
  modelPath: "EV",
  factory: {
    power: "448 kW / 601 hp (478 kW / 641 hp with N Grin Boost)",
    torque: "740 Nm (770 Nm with N Grin Boost)",
    curbMass: "2,200–2,230 kg (Hyundai Europe kerb)",
    zeroTo100KmhS: 3.5,
    zeroTo60MphS: 3.25,
    topSpeed: "260 km/h",
    sourceId: "src-hyundai-tech"
  },
  sources: [
    {
      id: "src-hyundai-tech",
      title: "Hyundai IONIQ 5 N technical data",
      publisher: "Hyundai Motor Europe",
      url: TECH,
      kind: "manufacturer",
      date: "2024-03"
    },
    {
      id: "src-hyundai-kit",
      title: "IONIQ 5 N press information",
      publisher: "Hyundai Motor Europe",
      url: KIT,
      kind: "manufacturer"
    },
    {
      id: "src-epa",
      title: "Data on cars used for testing fuel economy, model year 2025 (Ioniq 5 N row)",
      publisher: "US EPA",
      url: EPA,
      kind: "manufacturer",
      date: "2026-01"
    },
    {
      id: "test",
      title: "2025 Hyundai Ioniq 5 N first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2025-hyundai-ioniq-5-n-first-test-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2025 Hyundai Ioniq 5 N review",
      publisher: "The Drive (citing MotorTrend)",
      url: "https://www.thedrive.com/car-reviews/2025-hyundai-ioniq-5-n-review-a-racing-sim-you-can-drive-on-the-road",
      kind: "reference"
    },
    {
      id: "src3",
      title: "2025 Hyundai Ioniq 5 N Is the Quickest Korean Car We've Ever Tested",
      publisher: "Car and Driver (syndicated on Yahoo)",
      url: "https://uk.news.yahoo.com/2025-hyundai-ioniq-5-n-180000719.html",
      kind: "road-test"
    },
    {
      id: "src4",
      title: "Is the 2025 Hyundai Ioniq 5 N an EV car enthusiasts can embrace?",
      publisher: "Cars.com",
      url: "https://www.cars.com/articles/is-the-2025-hyundai-ioniq-5-n-an-ev-car-enthusiasts-can-embrace-488233",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "mt",
      sourceId: "test",
      publication: "MotorTrend",
      timing: "rollout-1ft",
      timingNote: "MotorTrend subtracts a 1-ft rollout from its acceleration times.",
      results: {
        zeroTo60MphS: 2.8,
        quarterMileS: 11.0,
        quarterMileTrapMph: 124.9
      },
      conditions: {
        testMass: "4,860 lb curb (50/50 %)",
        driveMode: "Not stated (N Grin Boost and N e-Shift use unknown); spec box lists the 641 hp boosted rating",
        other: [
          "N Grin Boost use not stated"
        ]
      },
      match: "exact",
      verification: "Original MotorTrend first test (fetched): 2.8 s to 60 mph, 11.0 s @ 124.9 mph, 4,860 lb, 50/50; power listed as 235 hp front + 406 hp rear (641 hp, boosted). The run's drive mode is not stated, so it is compared with and without N Grin Boost.",
      date: "2024"
    },
    {
      id: "cd",
      sourceId: "src3",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 3.0,
        quarterMileS: 11.1,
        quarterMileTrapMph: 123
      },
      conditions: {
        other: [
          "N Grin Boost use not stated"
        ]
      },
      match: "exact",
      verification: "Syndicated copy of the article (original page not reachable from this environment).",
      date: "2024"
    },
    {
      id: "carscom",
      sourceId: "src4",
      publication: "Cars.com",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 3.3,
        quarterMileS: 11.2,
        quarterMileTrapMph: 124
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2024"
    }
  ],
  dataGaps: [
    "Drag coefficient (only the EPA road-load coefficients are sourced)",
    "Front reduction (assumed equal to the EPA-derived overall reduction)",
    "Power curve above base speed (Hyundai publishes peak ratings only)",
    "Drive mode of the published tests (N Grin Boost / N e-Shift / launch grip level not stated)",
    "US-market owner's manual for the launch-control, N Grin Boost and N e-Shift behaviour (the UK 2025 edition is cited)",
    "N e-Shift virtual gear ratios, rpm range, shift timing and torque shaping"
  ],
  simCaveats: [
    "Electric model: each motor holds its rated torque to base speed (rated power ÷ rated torque) and then rated power up to its 21,000 rpm limit; Hyundai publishes no curve above base speed, so high-speed power may be optimistic.",
    "N Grin Boost runs 10 s from the Live Drive boost button (N key) and can be used again 10 s after it ends, as the owner's manual describes; N e-Shift pauses while it runs. Linking it to launches (Tuning, off by default) models N Launch Control with the boost link (MEDIUM or HIGH road grip level in the manual): a brake-held launch fires it at brake release (not during the hold), at most once per 2 minutes (the manual asks for at least 2 minutes of cooling between launches; the car's real limit is temperature-based), and every timed run then starts with it. Unlinked — the stock comparison — is a simulation assumption, not a factory launch setting: no boost at launch, as on LOW, and no pre-torque in either case. Whether the published tests used N Grin Boost is unknown. Pre-torque (HIGH), the 8 s brake-release window, battery charge and temperature limits are not modelled. The behaviour is taken from the UK 2025 owner's manual; the US manual has not been checked.",
    "N e-Shift is a separate Live Drive option, off by default: its virtual gear ratios, rpm range and shift timing are estimates, it keeps full motor output between changes and has no simulated engine braking (regeneration is not modelled). As in the car, launch control is unavailable while it runs."
  ],
  notes: [
    "N Grin Boost raises output to 478 kW (641 hp) for 10 s; the published tests do not state whether it was used, so stock figures run without it (a simulation assumption) and the boosted launch is a labelled Tuning option.",
    "The UK 2025 owner's manual's N Launch Control page says N Grin Boost activates automatically with launch control, and its road-grip table applies that link on MEDIUM and HIGH only (LOW: no boost link, no pre-torque; MEDIUM: boost link, no pre-torque; HIGH: boost link and pre-torque). Launch control use is limited while N Grin Boost or N e-Shift operate."
  ],
  sim: buildElectricSpec({
  id: "2025-hyundai-ioniq-5-n-us-cuv-awd-ev",
  make: "Hyundai",
  model: "Ioniq 5 N",
  trim: "Ioniq 5 N",
  modelYear: 2025,
  market: "US",
  body: "Crossover",
  shortName: "Hyundai Ioniq 5 N"
}, {
    description: 'Front and rear permanent-magnet synchronous motors, single-stage reductions',
    code: 'E-GMP N dual motor',
    motors: [
      { axle: 'front', peakPowerKw: 175, peakTorqueNm: 370, maxRpm: 21000, reductions: [REDUCTION] },
      { axle: 'rear', peakPowerKw: 303, peakTorqueNm: 400, maxRpm: 21000, reductions: [REDUCTION] },
    ],
    systemPowerKw: 448,
    systemTorqueNm: 740,
    boost: { systemPowerKw: 478, systemTorqueNm: 770, durationS: 10, trigger: 'driver', label: 'N Grin Boost', armedByDefault: false, recoveryS: 10, launchCooldownS: 120 },
    creep: true,
    virtualShift: { label: 'N e-Shift', ratios: ESHIFT_RATIOS, idleRpm: 750, redlineRpm: 6750, revLimitRpm: 6850, upshiftTimeS: 0.15, downshiftTimeS: 0.25 },
    drivetrain: { layout: 'AWD', efficiency: 0.94, description: 'Dual-motor AWD with variable front/rear torque distribution and electronic rear limited-slip differential' },
    chassis: { curbMassKg: 2200, frontWeightFraction: 0.5, cgHeightM: 0.55, wheelbaseM: 3.0, lengthMm: 4715, widthMm: 1940, heightMm: 1585 },
    aero: { dragCoefficient: 0.347, frontalAreaM2: 2.58 },
    tires: { sizes: [square('r21', '275/35 R21', 275, 35, 21, 'Pirelli P Zero (factory)')], compound: 'uhp', gripScale: 1.3 },
    speedLimiterKmh: 260,
    factory: { zeroTo100S: 3.5, topSpeedKmh: 260, zeroTo60MphS: 3.25 },
    provenance: [
      { parameter: 'Peak power', value: 'Front 166 kW, rear 282 kW (448 kW); with N Grin Boost 175 + 303 kW (478 kW)', status: 'verified', source: 'Hyundai IONIQ 5 N technical data', url: TECH },
      { parameter: 'Peak torque', value: 'Front 350 Nm, rear 390 Nm (740 Nm); with N Grin Boost 370 + 400 Nm (770 Nm)', status: 'verified', source: 'Hyundai IONIQ 5 N technical data. Modelled as motor caps at the boosted values with shared 448 kW / 740 Nm limits that lift to 478 kW / 770 Nm while the boost runs', url: TECH },
      { parameter: 'Motor maximum speed', value: '21,000 rpm', status: 'verified', source: 'Hyundai IONIQ 5 N press information (motors running at up to 21,000 rpm)', url: KIT },
      { parameter: 'Gear ratios', value: `Single-speed overall reduction ${REDUCTION} (both axles)`, status: 'reported', source: 'Derived from the EPA N/V of 128.5 rpm/mph (MY2025 Ioniq 5 N) with the simulator rolling radius; Hyundai gives "single-stage reduction"; the front axle is assumed to match', url: EPA },
      { parameter: 'N Grin Boost', value: '478 kW for 10 s from the steering-wheel NGB button; usable again 10 s after it ends', status: 'reported', source: 'Hyundai owner\'s manual, 2025 UK (en_UK) edition — not the US manual for this US entry (N Grin Boost: "increase the output 40 hp for 10 seconds", "reuse after waiting for 10 seconds"), press information and technical data (478 kW). Live Drive boost button (N key); not available below 30 % charge or when cold/hot in the car, which is not modelled', url: OM_NGB },
      { parameter: 'N Launch Control', value: 'Brake and accelerator at rest, then release the brake within 8 s; lifting the accelerator cancels. Road grip level LOW: no N Grin Boost link, no pre-torque; MEDIUM: N Grin Boost link, no pre-torque; HIGH: N Grin Boost link and pre-torque. Cool at least 2 minutes between launches; use is limited while N Grin Boost or N e-Shift operate', status: 'reported', source: 'Hyundai owner\'s manual, 2025 UK (en_UK) edition, N Launch Control (read 2026-11-28) — UK evidence on this US entry; the US manual has not been checked. Modelled: the Tuning link = boost at brake release (MEDIUM or HIGH; one linked launch per 2 minutes). Unlinked (stock comparison) = no boost: a simulation assumption, not a factory setting; test-day use unknown. Pre-torque and the 8 s window are not modelled', url: OM_LC },
      { parameter: 'N e-Shift', value: 'Simulated 8-speed DCT with manual and automatic shifts, a hard rev limiter and a jolt on each change; switched off while N Grin Boost runs and back on afterwards; launch control is limited while it operates (modelled: switching it on drops a launch prime)', status: 'reported', source: 'Hyundai IONIQ 5 N press information and owner\'s manual (2025 UK edition, N e-Shift; the US manual has not been checked). Live Drive option, off by default; tests, drag runs and the dyno never use it', url: OM_ESHIFT },
      { parameter: 'N e-Shift virtual gearing', value: `Virtual ratios ${ESHIFT_RATIOS.map((r) => r.toFixed(2)).join(' / ')} (virtual rpm per wheel rpm); idle 750, redline 6,750, limiter 6,850 rpm; 0.15 s up / 0.25 s down with torque cut to 20 % then restored in one step`, status: 'estimated', source: 'Not published. Spacing from the Hyundai 8-speed N DCT (Elantra N ratios and finals), scaled so 8th reaches 260 km/h at the limiter; rpm figures from the Elantra N engine; full motor output between changes (Hyundai does not publish how torque is shaped)' },
      { parameter: 'Curb mass', value: '2,200 kg (lower end of Hyundai Europe 2,200–2,230 kg); MotorTrend weighed 4,860 lb', status: 'reported', source: 'Hyundai IONIQ 5 N technical data', url: TECH },
      { parameter: 'Weight distribution', value: '50 % front', status: 'reported', source: 'MotorTrend measured 50/50 on its test car', url: MT },
      { parameter: 'Tire size', value: '275/35 R21 Pirelli P Zero', status: 'verified', source: 'Hyundai IONIQ 5 N press information', url: KIT },
      { parameter: 'Dimensions', value: '4,715 × 1,940 × 1,585 mm, WB 3,000 mm', status: 'verified', source: 'Hyundai IONIQ 5 N technical data', url: TECH },
      { parameter: 'Speed limiter', value: '260 km/h', status: 'verified', source: 'Hyundai IONIQ 5 N technical data (top speed)', url: TECH },
      { parameter: 'Drag coefficient', value: 'Cd 0.347 × 2.58 m² (CdA ≈ 0.90 m²)', status: 'estimated', source: 'CdA from the EPA target road-load C coefficient 0.02423 lbf/mph² (Ioniq 5 N) at 1.204 kg/m³; includes non-aerodynamic speed-squared losses. Split using area ≈ 0.84 × width × height', url: EPA },
      { parameter: 'CG height', value: '0.55 m', status: 'estimated', source: 'Floor battery; not published' },
      { parameter: 'Creep', value: 'Creeps off the brake', status: 'estimated', source: 'Default EV behaviour; not documented for this car' },
      { parameter: 'Tire grip calibration', value: '×1.30', status: 'estimated', source: 'Fit to the MotorTrend 0–60 mph 2.8 s (1-ft rollout) reaches the 1.30 upper bound; the simulation stays slower (3.04 s without N Grin Boost, 2.94 s with the boost linked to the launch). The test\'s drive mode is not stated' },
      { parameter: 'Drivetrain efficiency', value: '94 %', status: 'estimated', source: 'Trap fit to MotorTrend 124.9 mph without N Grin Boost (sim 125.1 mph). Sensitivity: with N Grin Boost linked to the launch (starting at brake release, all 10 s used) the same calibration gives 2.94 s, 10.98 s @ 127.3 mph (rollout)' },
    ],
  }),
};
