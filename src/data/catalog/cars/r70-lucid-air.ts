import { buildElectricSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

const LUCID = 'https://lucidmotors.com/media/document/lucid-air-sapphire-technical-specs-2024.pdf';
const EPA = 'https://www.epa.gov/system/files/documents/2025-05/24-testcar-2025-05.xlsx';

/** Roster #70: 2024 Lucid Air Sapphire (US). */
export const entry: CatalogEntry = {
  id: "2024-lucid-air-sapphire-us-sedan-awd-ev",
  roster: 70,
  section: "Electric cars and trucks",
  make: "Lucid",
  model: "Air",
  trim: "Sapphire",
  modelYear: 2024,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "Air",
  aliases: [
    "Air Sapphire",
    "Lucid"
  ],
  origin: "United States",
  usage: [
    "Sport Sedan",
    "Luxury",
    "Supercar"
  ],
  drive: "AWD",
  transmission: "Direct drive",
  transmissionLabel: "Single-speed",
  powertrain: "Electric",
  engineLabel: "Tri-motor (one front, twin rear; 908 kW / 1,940 Nm)",
  modelPath: "EV",
  factory: {
    power: "1,234 hp (908 kW)",
    torque: "1,430 lb-ft (1,940 Nm)",
    curbMass: "5,336 lb (Lucid); Edmunds weighed 5,356 lb",
    zeroTo60MphS: 1.89,
    topSpeed: "205 mph",
    sourceId: "src-lucid"
  },
  sources: [
    {
      id: "src-lucid",
      title: "2024 Lucid Air Sapphire technical specifications",
      publisher: "Lucid Motors",
      url: LUCID,
      kind: "manufacturer",
      date: "2024"
    },
    {
      id: "src-epa",
      title: "Data on cars used for testing fuel economy, model year 2024 (Air Sapphire AWD row)",
      publisher: "US EPA",
      url: EPA,
      kind: "manufacturer",
      date: "2025-05"
    },
    {
      id: "test",
      title: "Lucid Air Sapphire quickest EV tested",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/news/a46992150/lucid-air-sapphire-quickest-ev-tested/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Lucid Air Sapphire vs Tesla Model S Plaid",
      publisher: "Edmunds",
      url: "https://www.edmunds.com/car-news/lucid-air-sapphire-vs-tesla-model-s-plaid.html",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "Lucid Air Sapphire is the quickest car MotorTrend has ever tested",
      publisher: "Jalopnik (citing MotorTrend)",
      url: "https://jalopnik.com/1984093/lucid-air-sapphite-quickest-car-motortrend/",
      kind: "reference"
    },
    {
      id: "src4",
      title: "Final production specs: Sapphire",
      publisher: "Lucid Motors",
      url: "https://www.lucidmotors.com/stories/final-production-specs-sapphire",
      kind: "manufacturer"
    }
  ],
  benchmarks: [
    {
      id: "mt",
      sourceId: "src3",
      publication: "MotorTrend (as cited by Jalopnik)",
      timing: "rollout-1ft",
      timingNote: "MotorTrend subtracts a 1-ft rollout from its acceleration times.",
      results: {
        zeroTo60MphS: 2.1,
        zeroTo100MphS: 4.2,
        quarterMileS: 9.3,
        quarterMileTrapMph: 153
      },
      conditions: {
        testMass: "5,342 lb"
      },
      match: "exact",
      verification: "Second-hand citation; the original page was not reachable.",
      date: "2024"
    },
    {
      id: "edmunds",
      sourceId: "src2",
      publication: "Edmunds",
      timing: "standing-start",
      timingNote: "Edmunds times from a standstill (\"zero should mean zero\"), no rollout.",
      results: {
        zeroTo60MphS: 2.2,
        quarterMileS: 9.2,
        quarterMileTrapMph: 149.6
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2024"
    }
  ],
  dataGaps: [
    "Car and Driver test (roster source)",
    "Per-motor power and torque (Lucid publishes system totals only)",
    "Motor maximum speed",
    "Weight distribution",
    "Drag coefficient (only the EPA road-load coefficients are sourced)"
  ],
  simCaveats: [
    "Electric model: Lucid publishes only system totals (908 kW, 1,940 Nm), so the three motors are modelled as equal (400 kW, 647 Nm each) under the shared 908 kW / 1,940 Nm limit; the power split between axles and the curve above base speed are estimates.",
    "Benchmarks are MotorTrend (second-hand citation) and Edmunds (search-result summary); the original pages were not reachable."
  ],
  notes: [
    "Lucid claims 1.89 s to 60 mph, 3.84 s to 100 mph and an 8.95 s quarter mile at 158 mph. A later MotorTrend run on the optional track tires (1.88 s, 9.0 s @ 154.8 mph) is a different tire fitment and is not used."
  ],
  sim: buildElectricSpec({
  id: "2024-lucid-air-sapphire-us-sedan-awd-ev",
  make: "Lucid",
  model: "Air",
  trim: "Sapphire",
  modelYear: 2024,
  market: "US",
  body: "Sedan",
  shortName: "Lucid Air Sapphire"
}, {
    description: 'Three permanent-magnet motors: one front drive unit, twin-motor rear drive unit; single-speed',
    code: 'Lucid tri-motor',
    motors: [
      { axle: 'front', peakPowerKw: 400, peakTorqueNm: 647, maxRpm: 20000, reductions: [7.0] },
      { axle: 'rear', peakPowerKw: 400, peakTorqueNm: 647, maxRpm: 20000, reductions: [6.8] },
      { axle: 'rear', peakPowerKw: 400, peakTorqueNm: 647, maxRpm: 20000, reductions: [6.8] },
    ],
    systemPowerKw: 908,
    systemTorqueNm: 1940,
    creep: true,
    drivetrain: { layout: 'AWD', efficiency: 0.89, description: 'Tri-motor AWD with torque vectoring front/rear and left/right' },
    chassis: { curbMassKg: 2420, frontWeightFraction: 0.47, cgHeightM: 0.48, wheelbaseM: 2.959, lengthMm: 5004, widthMm: 1989, heightMm: 1407 },
    aero: { dragCoefficient: 0.303, frontalAreaM2: 2.35 },
    tires: { sizes: [staggered('r20r21', '265/35 R20 / 295/30 R21', { widthMm: 265, aspectPct: 35, rimIn: 20 }, { widthMm: 295, aspectPct: 30, rimIn: 21 }, 'Michelin Pilot Sport 4S (standard)')], compound: 'uhp', gripScale: 1.15 },
    speedLimiterKmh: 330,
    factory: { topSpeedKmh: 330, zeroTo60MphS: 1.89 },
    provenance: [
      { parameter: 'Peak power', value: '908 kW (1,234 hp) system', status: 'verified', source: 'Lucid technical specifications', url: LUCID },
      { parameter: 'Peak torque', value: '1,940 Nm (1,430 lb-ft) system', status: 'verified', source: 'Lucid technical specifications', url: LUCID },
      { parameter: 'Motor layout', value: 'Front drive unit: one motor; rear drive unit: twin motors', status: 'verified', source: 'Lucid technical specifications', url: LUCID },
      { parameter: 'Per-motor ratings', value: '400 kW and 647 Nm each', status: 'estimated', source: 'Not published. Torque = 1,940 Nm ÷ 3; power ≈ the per-motor average of the two-motor Air Dream Performance (1,111 hp), so the shared 908 kW limit binds' },
      { parameter: 'Motor maximum speed', value: '20,000 rpm', status: 'estimated', source: 'Not published; the 205 mph top speed needs ≈ 17,700 rpm at the published reductions' },
      { parameter: 'Gear ratios', value: 'Single speed, 7.0:1 front, 6.8:1 rear', status: 'verified', source: 'Lucid technical specifications', url: LUCID },
      { parameter: 'Curb mass', value: '2,420 kg (5,336 lb)', status: 'verified', source: 'Lucid technical specifications; MotorTrend weighed 5,342 lb', url: LUCID },
      { parameter: 'Tire size', value: '265/35 R20 front, 295/30 R21 rear, Michelin Pilot Sport 4S', status: 'verified', source: 'Lucid technical specifications', url: LUCID },
      { parameter: 'Dimensions', value: '197.0 × 78.3 × 55.4 in (5,004 × 1,989 × 1,407 mm), WB 116.5 in (2,959 mm)', status: 'verified', source: 'Lucid technical specifications (width without mirrors)', url: LUCID },
      { parameter: 'Speed limiter', value: '330 km/h (205 mph)', status: 'verified', source: 'Lucid technical specifications (top speed)', url: LUCID },
      { parameter: 'Drag coefficient', value: 'Cd 0.303 × 2.35 m² (CdA ≈ 0.71 m²)', status: 'estimated', source: 'CdA from the EPA target road-load C coefficient 0.01926 lbf/mph² (Air Sapphire AWD) at 1.204 kg/m³; includes non-aerodynamic speed-squared losses. Split using area ≈ 0.84 × width × height', url: EPA },
      { parameter: 'Weight distribution', value: '47 % front', status: 'estimated', source: 'Not published in the reachable sources' },
      { parameter: 'CG height', value: '0.48 m', status: 'estimated', source: 'Floor battery sedan; not published' },
      { parameter: 'Creep', value: 'Creeps off the brake', status: 'estimated', source: 'Default EV behaviour; not documented here' },
      { parameter: 'Tire grip calibration', value: '×1.15', status: 'estimated', source: 'Fit to the MotorTrend 0–60 mph 2.1 s (1-ft rollout): 2.10 s' },
      { parameter: 'Drivetrain efficiency', value: '89 %', status: 'estimated', source: 'Trap fit to MotorTrend 153 mph (sim 9.31 s @ 153.4 mph, rollout). It also absorbs the estimated per-motor split and the EPA-derived drag area; at 95 % the trap is 156.7 mph' },
    ],
  }),
};
