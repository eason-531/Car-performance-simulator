import { buildElectricSpec, square } from '../build';
import type { CatalogEntry } from '../types';

const WIKI = 'https://en.wikipedia.org/wiki/Rivian_R1T';
const MA = 'https://www.motorauthority.com/news/1143445_2025-rivian-r1t-r1s-quad-motor-acceleration-130-mph';
const EPA = 'https://www.epa.gov/system/files/documents/2024-05/23-testcar-2024-05-17_0.xlsx';

/** First-generation Quad-Motor reduction (all four motors), as reported by Motor Authority. */
const REDUCTION = 12.6;

/** Roster #73: 2022 Rivian R1T Launch Edition (US). */
export const entry: CatalogEntry = {
  id: "2022-rivian-r1t-launch-edition-us-pickup-awd-ev",
  roster: 73,
  section: "Electric cars and trucks",
  make: "Rivian",
  model: "R1T",
  trim: "Launch Edition",
  modelYear: 2022,
  market: "US",
  body: "Pickup",
  bodyLabel: "Crew-cab pickup",
  chassisCode: "R1T",
  aliases: [
    "R1T",
    "Rivian"
  ],
  origin: "United States",
  usage: [
    "Pickup",
    "Off-road"
  ],
  drive: "AWD",
  transmission: "Direct drive",
  transmissionLabel: "Single-speed",
  powertrain: "Electric",
  engineLabel: "Quad-motor (one per wheel), Large Pack",
  modelPath: "EV",
  factory: {
    power: "835 hp (623 kW)",
    torque: "908 lb-ft (1,231 Nm)",
    curbMass: "≈7,148 lb (Edmunds scales)",
    topSpeed: "110 mph",
    sourceId: "src4"
  },
  sources: [
    {
      id: "src-wiki",
      title: "Rivian R1T",
      publisher: "Wikipedia",
      url: WIKI,
      kind: "reference"
    },
    {
      id: "src-ma",
      title: "2025 Rivian R1T, R1S Quad-Motor models are quicker (gear ratios versus the previous Quad-Motor)",
      publisher: "Motor Authority",
      url: MA,
      kind: "reference",
      date: "2024"
    },
    {
      id: "src-epa",
      title: "Data on cars used for testing fuel economy, model year 2023 (R1T 21 quad-motor row)",
      publisher: "US EPA",
      url: EPA,
      kind: "manufacturer",
      date: "2024-05"
    },
    {
      id: "test",
      title: "2022 Rivian R1T 60-mph acceleration",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/news/a38943455/2022-rivian-r1t-60-mph-acceleration/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Rivian R1T: quickest pickup truck ever tested by Car and Driver",
      publisher: "InsideEVs (citing Car and Driver)",
      url: "https://insideevs.com/news/564834/rivian-r1t-quickest-truck-ever/",
      kind: "reference"
    },
    {
      id: "src3",
      title: "2022 Rivian R1T road test",
      publisher: "MotorWeek",
      url: "https://motorweek.org/road_tests/2022-rivian-r1t/",
      kind: "road-test"
    },
    {
      id: "src4",
      title: "Tested: 2023 Rivian R1T",
      publisher: "Edmunds",
      url: "https://edmunds.com/car-news/tested-2023-rivian-r1t.html",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src2",
      publication: "Car and Driver (as cited by InsideEVs)",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 3.3,
        quarterMileS: 11.9,
        quarterMileTrapMph: 110
      },
      conditions: {},
      match: "exact",
      verification: "Second-hand citation; the original page was not reachable.",
      date: "2022"
    },
    {
      id: "motorweek",
      sourceId: "src3",
      publication: "MotorWeek",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 3.2,
        quarterMileS: 11.8,
        quarterMileTrapMph: 111
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2022"
    },
    {
      id: "edmunds",
      sourceId: "src4",
      publication: "Edmunds",
      timing: "standing-start",
      timingNote: "Edmunds times from a standstill (\"zero should mean zero\"), no rollout.",
      results: {
        zeroTo60MphS: 3.5,
        quarterMileS: 11.9,
        quarterMileTrapMph: 109.9
      },
      conditions: {},
      match: "equivalent",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2023",
      deviation: "2023 quad-motor truck (same powertrain); 3.3 s with a 1-ft rollout."
    }
  ],
  dataGaps: [
    "Car and Driver original page",
    "Per-motor ratings (Rivian publishes system totals only)",
    "Motor maximum speed and the power curve above base speed",
    "Test-truck wheel fitment, dimensions and weight distribution",
    "Drag coefficient (only the EPA road-load coefficients are sourced)"
  ],
  simCaveats: [
    "Electric model: four identical motors, one per wheel, each a quarter of the 623 kW / 1,231 Nm system rating (156 kW, 308 Nm), modelled as two motors' worth per axle; Rivian publishes no per-motor ratings or curve.",
    "Motor data come from reference sources (Wikipedia, Motor Authority) because Rivian's own pages were not reachable."
  ],
  sim: buildElectricSpec({
  id: "2022-rivian-r1t-launch-edition-us-pickup-awd-ev",
  make: "Rivian",
  model: "R1T",
  trim: "Launch Edition",
  modelYear: 2022,
  market: "US",
  body: "Pickup",
  shortName: "Rivian R1T"
}, {
    description: 'Four permanent-magnet AC motors, one per wheel; single-speed reductions',
    code: 'Quad-Motor (gen 1)',
    motors: [
      { axle: 'front', peakPowerKw: 156, peakTorqueNm: 308, maxRpm: 15500, reductions: [REDUCTION] },
      { axle: 'front', peakPowerKw: 156, peakTorqueNm: 308, maxRpm: 15500, reductions: [REDUCTION] },
      { axle: 'rear', peakPowerKw: 156, peakTorqueNm: 308, maxRpm: 15500, reductions: [REDUCTION] },
      { axle: 'rear', peakPowerKw: 156, peakTorqueNm: 308, maxRpm: 15500, reductions: [REDUCTION] },
    ],
    systemPowerKw: 623,
    systemTorqueNm: 1231,
    creep: true,
    drivetrain: { layout: 'AWD', efficiency: 0.95, description: 'Quad-motor AWD with per-wheel torque vectoring' },
    chassis: { curbMassKg: 3242, frontWeightFraction: 0.5, cgHeightM: 0.7, wheelbaseM: 3.45, lengthMm: 5514, widthMm: 2015, heightMm: 1816 },
    aero: { dragCoefficient: 0.297, frontalAreaM2: 3.07 },
    tires: { sizes: [square('r21', '275/55 R21', 275, 55, 21, '21-inch Road wheels')], compound: 'touring', gripScale: 1.06 },
    speedLimiterKmh: 177,
    factory: { topSpeedKmh: 177 },
    provenance: [
      { parameter: 'Peak power', value: '623 kW (835 hp) system', status: 'reported', source: 'Wikipedia (four motors, one per wheel); EPA rates the quad-motor R1T at 872 hp', url: WIKI },
      { parameter: 'Peak torque', value: '1,231 Nm (908 lb-ft) system', status: 'reported', source: 'Wikipedia', url: WIKI },
      { parameter: 'Per-motor ratings', value: '156 kW and 308 Nm each', status: 'estimated', source: 'System totals split evenly across four identical motors' },
      { parameter: 'Gear ratios', value: `Single speed ${REDUCTION}:1 (all four motors)`, status: 'reported', source: 'Motor Authority: the previous Quad-Motor used 12.6:1 on all four motors', url: MA },
      { parameter: 'Motor maximum speed', value: '15,500 rpm', status: 'estimated', source: 'Not published; the 110 mph top speed needs ≈ 14,500 rpm at 12.6:1' },
      { parameter: 'Curb mass', value: '3,242 kg (≈ 7,148 lb, Edmunds scales)', status: 'reported', source: 'Edmunds test (2023 quad-motor truck)', url: 'https://edmunds.com/car-news/tested-2023-rivian-r1t.html' },
      { parameter: 'Speed limiter', value: '177 km/h (110 mph)', status: 'reported', source: 'Wikipedia', url: WIKI },
      { parameter: 'Tire size', value: '275/55 R21', status: 'estimated', source: '21-inch Road wheel fitment; the test trucks’ fitment is not stated in the reachable text' },
      { parameter: 'Dimensions', value: '≈ 5,514 × 2,015 × 1,816 mm, WB 3,450 mm', status: 'estimated', source: 'Approximate published R1T dimensions; not transcribed from a reachable Rivian page' },
      { parameter: 'Drag coefficient', value: 'Cd 0.297 × 3.07 m² (CdA ≈ 0.91 m²)', status: 'estimated', source: 'CdA from the EPA target road-load C coefficient 0.02461 lbf/mph² (MY2023 R1T 21, quad motor) at 1.204 kg/m³; includes non-aerodynamic speed-squared losses. Split using area ≈ 0.84 × width × height', url: EPA },
      { parameter: 'Weight distribution', value: '50 % front', status: 'estimated', source: 'Not published in the reachable sources' },
      { parameter: 'CG height', value: '0.70 m', status: 'estimated', source: 'Pickup with skateboard battery; not published' },
      { parameter: 'Creep', value: 'Creeps off the brake', status: 'estimated', source: 'Default EV behaviour; not documented here' },
      { parameter: 'Tire grip calibration', value: '×1.06', status: 'estimated', source: 'Fit to the Car and Driver 0–60 mph 3.3 s (1-ft rollout): 3.30 s; Edmunds’ standing-start 3.5 s gives 3.57 s' },
      { parameter: 'Drivetrain efficiency', value: '95 %', status: 'estimated', source: 'Held at the 95 % EV bound: the trap is capped by the 110 mph limiter (sim 109.8 mph, Car and Driver 110), so it cannot set efficiency. The quarter mile runs 0.3 s quicker than Car and Driver’s 11.9 s (11.59 s); lowering efficiency slows the 0–60 instead, so the residual is left visible' },
    ],
  }),
};
