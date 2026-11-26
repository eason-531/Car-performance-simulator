import { buildElectricSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

const RIMAC = 'https://www.rimac-automobili.com/nevera/';
const EPA = 'https://www.epa.gov/system/files/documents/2024-05/23-testcar-2024-05-17_0.xlsx';
const DRAGTIMES = 'https://insideevs.com/news/526584/rimac-nevera-dragstrip-world-record/';
const IEEE = 'https://spectrum.ieee.org/rimac-nevera-record';

/**
 * Single-speed reduction for all four motors: Rimac's 13,430 Nm wheel torque ÷
 * 2,340 Nm motor torque. EPA lists an axle ratio of 5.6, and the N/V of 70.5
 * rpm/mph gives 5.85 with the simulator rolling radius.
 */
const REDUCTION = 5.74;

/** Hypercar extension #26: 2022 Rimac Nevera (EU), the electric hypercar extension. */
export const entry: CatalogEntry = {
  id: "2022-rimac-nevera-eu-coupe-awd-ev",
  extension: { set: 'Hypercars', order: 26 },
  section: "Hypercars",
  make: "Rimac",
  model: "Nevera",
  trim: "Coupé",
  modelYear: 2022,
  market: "EU",
  body: "Coupe",
  bodyLabel: "Coupé",
  aliases: [
    "Nevera",
    "C_Two"
  ],
  origin: "Croatia",
  usage: [
    "Hypercar"
  ],
  drive: "AWD",
  transmission: "Direct drive",
  transmissionLabel: "Single-speed (four gearboxes)",
  powertrain: "Electric",
  engineLabel: "Quad-motor (2 × 226 kW front, 2 × 450 kW rear)",
  modelPath: "EV",
  factory: {
    power: "1,408 kW / 1,914 hp",
    torque: "2,340 Nm motor torque; 13,430 Nm at the wheels",
    curbMass: "2,300 kg",
    zeroTo60MphS: 1.74,
    zeroTo100KmhS: 1.81,
    topSpeed: "412 km/h / 258 mph",
    sourceId: "src-rimac"
  },
  sources: [
    {
      id: "src-rimac",
      title: "Nevera technical specifications",
      publisher: "Rimac Automobili",
      url: RIMAC,
      kind: "manufacturer"
    },
    {
      id: "src-epa",
      title: "Data on cars used for testing fuel economy, model year 2023 (Bugatti Rimac Nevera row)",
      publisher: "US EPA",
      url: EPA,
      kind: "manufacturer",
      date: "2024-05"
    },
    {
      id: "src-ieee",
      title: "Rimac Nevera acceleration records (Racelogic and Dewesoft verification)",
      publisher: "IEEE Spectrum",
      url: IEEE,
      kind: "reference"
    },
    {
      id: "src-dragtimes",
      title: "Rimac Nevera drag-strip record (DragTimes runs)",
      publisher: "InsideEVs",
      url: DRAGTIMES,
      kind: "reference",
      date: "2021"
    }
  ],
  benchmarks: [
    {
      id: "rimac",
      sourceId: "src-rimac",
      publication: "Rimac (record runs, independently verified)",
      timing: "rollout-1ft",
      timingNote: "Rimac marks its 0–60 mph, 0–100 km/h and 0–300 km/h times as one-foot rollout figures.",
      results: {
        zeroTo60MphS: 1.74,
        zeroTo100KmhS: 1.81
      },
      conditions: {
        other: [
          "Rimac record runs in Germany, verified by Racelogic and Dewesoft (IEEE Spectrum)",
          "The 8.25 s quarter mile on the same page carries no timing basis and is not used"
        ]
      },
      match: "exact",
      verification: "Rimac's own specification page (fetched): 1.74 s to 60 mph and 1.81 s to 100 km/h with a one-foot rollout, 9.22 s to 300 km/h, quarter mile 8.25 s (basis not stated).",
      date: "2022"
    },
    {
      id: "dragtimes",
      sourceId: "src-dragtimes",
      publication: "DragTimes (as reported by InsideEVs)",
      timing: "drag-strip",
      timingNote: "Drag-strip timing from the start beam on a prepared surface.",
      results: {
        quarterMileS: 8.582,
        quarterMileTrapMph: 167.51
      },
      conditions: {
        surface: "Prepared drag strip (California)"
      },
      match: "exact",
      verification: "Search-result summary of the InsideEVs report (page not fetched here).",
      date: "2021"
    }
  ],
  dataGaps: [
    "Gear ratio (derived from Rimac's wheel and motor torque)",
    "Motor maximum speed and the power curve above base speed",
    "Weight distribution",
    "Frontal area (Rimac gives Cd 0.3 in low-drag mode only)",
    "Magazine road test"
  ],
  simCaveats: [
    "Electric model: four motors (2 × 226 kW / 270 Nm front, 2 × 450 kW / 900 Nm rear) under the 1,408 kW system rating. Rimac's motor ratings sum to 1,352 kW, so each motor cap is raised by the same 4.1 % for the rated output to be reachable (as for the Taycan's overboost); the curve above base speed is not published.",
    "Calibrated to Rimac's rollout 0–60 mph only; the DragTimes quarter mile is shown for comparison with its own timing basis. Holding the full 1,408 kW to top speed overstates the trap (≈ 183 mph against 167.5 mph)."
  ],
  sim: buildElectricSpec({
  id: "2022-rimac-nevera-eu-coupe-awd-ev",
  make: "Rimac",
  model: "Nevera",
  trim: "Coupé",
  modelYear: 2022,
  market: "EU",
  body: "Coupe",
  shortName: "Rimac Nevera"
}, {
    description: 'Four surface-mounted, carbon-sleeved permanent-magnet motors, one per wheel; four single-speed gearboxes',
    code: 'Rimac quad-motor',
    motors: [
      { axle: 'front', peakPowerKw: 235.4, peakTorqueNm: 270, maxRpm: 18500, reductions: [REDUCTION] },
      { axle: 'front', peakPowerKw: 235.4, peakTorqueNm: 270, maxRpm: 18500, reductions: [REDUCTION] },
      { axle: 'rear', peakPowerKw: 468.6, peakTorqueNm: 900, maxRpm: 18500, reductions: [REDUCTION] },
      { axle: 'rear', peakPowerKw: 468.6, peakTorqueNm: 900, maxRpm: 18500, reductions: [REDUCTION] },
    ],
    systemPowerKw: 1408,
    systemTorqueNm: 2340,
    creep: true,
    drivetrain: { layout: 'AWD', efficiency: 0.95, description: 'Quad-motor AWD with all-wheel torque vectoring (R-AWTV)' },
    chassis: { curbMassKg: 2300, frontWeightFraction: 0.45, cgHeightM: 0.4, wheelbaseM: 2.745, lengthMm: 4745, widthMm: 2052, heightMm: 1240 },
    aero: { dragCoefficient: 0.3, frontalAreaM2: 2.14 },
    tires: { sizes: [staggered('r20', '275/35 R20 / 315/35 R20', { widthMm: 275, aspectPct: 35, rimIn: 20 }, { widthMm: 315, aspectPct: 35, rimIn: 20 }, 'Michelin Pilot Sport 4S')], compound: 'uhp', gripScale: 1.3 },
    speedLimiterKmh: 412,
    factory: { zeroTo100S: 1.81, topSpeedKmh: 412, zeroTo60MphS: 1.74 },
    provenance: [
      { parameter: 'Peak power', value: '1,408 kW (1,914 hp) system; front 226 kW each, rear 450 kW each', status: 'verified', source: 'Rimac technical specifications', url: RIMAC },
      { parameter: 'Motor power caps', value: 'Front 235.4 kW, rear 468.6 kW each (ratings × 1,408/1,352)', status: 'reported', source: 'Derived: the motor ratings sum to 1,352 kW, under the 1,408 kW rating', url: RIMAC },
      { parameter: 'Peak torque', value: 'Front 270 Nm each, rear 900 Nm each; 2,340 Nm motor torque, 13,430 Nm wheel torque', status: 'verified', source: 'Rimac technical specifications', url: RIMAC },
      { parameter: 'Gear ratios', value: `Single speed ${REDUCTION}:1 (all four gearboxes)`, status: 'reported', source: 'Rimac wheel torque ÷ motor torque (13,430 / 2,340); EPA lists an axle ratio of 5.6 and an N/V of 70.5 rpm/mph', url: RIMAC },
      { parameter: 'Motor maximum speed', value: '18,500 rpm', status: 'estimated', source: 'Not published; the 412 km/h top speed needs ≈ 17,800 rpm at the derived reduction' },
      { parameter: 'Curb mass', value: '2,300 kg', status: 'verified', source: 'Rimac technical specifications', url: RIMAC },
      { parameter: 'Tire size', value: '275/35 R20 front, 315/35 R20 rear, Michelin Pilot Sport 4S', status: 'verified', source: 'Rimac technical specifications', url: RIMAC },
      { parameter: 'Dimensions', value: '4,745 × 2,052 × 1,240 mm, WB 2,745 mm', status: 'verified', source: 'Rimac technical specifications', url: RIMAC },
      { parameter: 'Drag coefficient', value: 'Cd 0.3 (low-drag mode) × 2.14 m² (CdA ≈ 0.64 m²)', status: 'reported', source: 'Cd from Rimac (low-drag mode); frontal area ≈ 0.84 × width × height (estimated)', url: RIMAC },
      { parameter: 'Speed limiter', value: '412 km/h', status: 'verified', source: 'Rimac top speed', url: RIMAC },
      { parameter: 'Weight distribution', value: '45 % front', status: 'estimated', source: 'Mid/rear-biased motors and battery; not published' },
      { parameter: 'CG height', value: '0.40 m', status: 'estimated', source: 'Low carbon monocoque with structural battery; not published' },
      { parameter: 'Creep', value: 'Creeps off the brake', status: 'estimated', source: 'Default EV behaviour; not documented here' },
      { parameter: 'Tire grip calibration', value: '×1.30', status: 'estimated', source: 'Fit toward Rimac’s 0–60 mph 1.74 s (1-ft rollout) reaches the 1.30 upper bound; the simulation stays slower (1.83 s)' },
      { parameter: 'Drivetrain efficiency', value: '95 %', status: 'estimated', source: 'Held at the 95 % EV bound. The simulation traps ≈ 183 mph against DragTimes’ 167.5 mph: a trap fit would need about 72 %, outside the plausible range, so the residual is left visible; it points at battery power falling with speed, which Rimac does not publish' },
    ],
  }),
};
