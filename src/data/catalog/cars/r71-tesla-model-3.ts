import { buildElectricSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

const EPA = 'https://www.epa.gov/system/files/documents/2025-05/24-testcar-2025-05.xlsx';
const TESLA = 'https://www.tesla.com/blog/introducing-new-model-3-performance';
const SPECS = 'https://www.evspecifications.com/en/model/7c633d9';
const CARSALES = 'https://www.carsales.com.au/editorial/details/tesla-model-3-and-model-y-outputs-exposed-139761';

/** Overall reduction from the EPA N/V of 114 rpm/mph (MY2024 Model 3 Performance AWD) with the simulator rolling radius. */
const REDUCTION = 8.8;

/** Roster #71: 2024 Tesla Model 3 Performance (US). */
export const entry: CatalogEntry = {
  id: "2024-tesla-model-3-performance-us-sedan-awd-ev",
  roster: 71,
  section: "Electric cars and trucks",
  make: "Tesla",
  model: "Model 3",
  trim: "Performance",
  modelYear: 2024,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "Highland",
  aliases: [
    "Model 3",
    "Highland"
  ],
  origin: "United States",
  usage: [
    "Sport Sedan",
    "Daily"
  ],
  drive: "AWD",
  transmission: "Direct drive",
  transmissionLabel: "Single-speed",
  powertrain: "Electric",
  engineLabel: "Dual-motor (158 kW front + 303 kW rear; 510 hp system)",
  modelPath: "EV",
  factory: {
    power: "510 hp (380 kW)",
    torque: "741 Nm (reported)",
    curbMass: "4,046 lb (Car and Driver)",
    zeroTo60MphS: 2.9,
    topSpeed: "163 mph",
    sourceId: "src-tesla"
  },
  sources: [
    {
      id: "src-tesla",
      title: "Introducing the New Model 3 Performance",
      publisher: "Tesla",
      url: TESLA,
      kind: "manufacturer",
      date: "2024-04"
    },
    {
      id: "src-epa",
      title: "Data on cars used for testing fuel economy, model year 2024 (Model 3 Performance AWD row)",
      publisher: "US EPA",
      url: EPA,
      kind: "manufacturer",
      date: "2025-05"
    },
    {
      id: "src-specs",
      title: "2024 Tesla Model 3 Performance AWD (EU) specifications",
      publisher: "EVSpecifications",
      url: SPECS,
      kind: "reference"
    },
    {
      id: "src-carsales",
      title: "Tesla Model 3 and Model Y outputs exposed",
      publisher: "Carsales",
      url: CARSALES,
      kind: "reference",
      date: "2023"
    },
    {
      id: "test",
      title: "2024 Tesla Model 3 Performance test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a62597386/2024-tesla-model-3-performance-test/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "'Highland' Tesla Model 3 Performance Is 8.7 Seconds Quicker to 150 MPH",
      publisher: "Car and Driver (syndicated on Yahoo)",
      url: "https://autos.yahoo.com/highland-tesla-model-3-performance-200000182.html",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "2024 Tesla Model 3 Performance full rating",
      publisher: "Edmunds",
      url: "https://www.edmunds.com/car-news/2024-tesla-model-3-performance-full-rating.html",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src2",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 2.8,
        quarterMileS: 11.0,
        quarterMileTrapMph: 125
      },
      conditions: {
        testMass: "4,046 lb"
      },
      match: "exact",
      verification: "Syndicated copy of the article (original page not reachable from this environment).",
      date: "2024"
    },
    {
      id: "edmunds",
      sourceId: "src3",
      publication: "Edmunds",
      timing: "standing-start",
      timingNote: "Edmunds times from a standstill (\"zero should mean zero\"), no rollout.",
      results: {
        zeroTo60MphS: 3.0,
        quarterMileS: 11.0,
        quarterMileTrapMph: 123.7
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2024"
    }
  ],
  dataGaps: [
    "Per-motor torque (only the front 3D3 rating and a reported 741 Nm system figure)",
    "Motor maximum speed",
    "Drag coefficient (only the EPA road-load coefficients are sourced)",
    "Dimensions, wheel fitment and weight distribution (not transcribed from a reachable Tesla page)"
  ],
  simCaveats: [
    "Electric model: front 158 kW / 219 Nm and rear 303 kW / 522 Nm under the 510 hp (380 kW) Tesla rating; the motor ratings come from reference listings (partly leaked homologation data), the rear torque is the reported 741 Nm system figure less the front, and Tesla publishes no curve above base speed.",
    "Tesla's own pages could not be fetched from this environment; reference figures were read through search-result summaries."
  ],
  notes: [
    "Tesla’s 2.9 s claim subtracts a 1-ft rollout."
  ],
  sim: buildElectricSpec({
  id: "2024-tesla-model-3-performance-us-sedan-awd-ev",
  make: "Tesla",
  model: "Model 3",
  trim: "Performance",
  modelYear: 2024,
  market: "US",
  body: "Sedan",
  shortName: "Tesla Model 3 Performance"
}, {
    description: 'Front induction-type 3D3 motor and rear Performance drive unit; single speed',
    code: '3D3 + Performance 4DU',
    motors: [
      { axle: 'front', peakPowerKw: 158, peakTorqueNm: 219, maxRpm: 19500, reductions: [REDUCTION] },
      { axle: 'rear', peakPowerKw: 303, peakTorqueNm: 522, maxRpm: 19500, reductions: [REDUCTION] },
    ],
    systemPowerKw: 380,
    systemTorqueNm: 741,
    creep: true,
    drivetrain: { layout: 'AWD', efficiency: 0.9, description: 'Dual-motor AWD (one motor per axle)' },
    chassis: { curbMassKg: 1835, frontWeightFraction: 0.48, cgHeightM: 0.46, wheelbaseM: 2.875, lengthMm: 4720, widthMm: 1850, heightMm: 1441 },
    aero: { dragCoefficient: 0.225, frontalAreaM2: 2.35 },
    tires: { sizes: [staggered('r20', '235/35 R20 / 255/35 R20', { widthMm: 235, aspectPct: 35, rimIn: 20 }, { widthMm: 255, aspectPct: 35, rimIn: 20 }, 'Performance 20-inch fitment')], compound: 'uhp', gripScale: 1 },
    speedLimiterKmh: 262,
    factory: { topSpeedKmh: 262, zeroTo60MphS: 2.9 },
    provenance: [
      { parameter: 'System output', value: '510 hp (380 kW)', status: 'verified', source: 'EPA test-car data rates 510 hp, matching Tesla’s announcement (510 hp, 0–60 mph 2.9 s; the Tesla page could not be fetched here)', url: EPA },
      { parameter: 'Peak power', value: 'Front 158 kW, rear 303 kW (461 kW sum, above the 380 kW system rating)', status: 'reported', source: 'EVSpecifications EU listing (partly from leaked homologation documents), read through a search-result summary', url: SPECS },
      { parameter: 'Peak torque', value: 'Front 219 Nm; rear 522 Nm (741 Nm system less the front)', status: 'reported', source: 'Front 3D3 rating from Carsales (2023 outputs story); 741 Nm system figure from spec listings, not confirmed by Tesla', url: CARSALES },
      { parameter: 'Motor maximum speed', value: '19,500 rpm', status: 'estimated', source: 'Not published; the 163 mph top speed needs ≈ 18,600 rpm at the EPA-derived reduction' },
      { parameter: 'Gear ratios', value: `Single-speed overall reduction ${REDUCTION} (both axles)`, status: 'reported', source: 'Derived from the EPA N/V of 114 rpm/mph (MY2024 Model 3 Performance AWD) with the simulator rolling radius; the front axle is assumed to match', url: EPA },
      { parameter: 'Curb mass', value: '1,835 kg (4,046 lb as tested by Car and Driver)', status: 'reported', source: 'Car and Driver test (calibration at measured test mass)' },
      { parameter: 'Tire size', value: '235/35 R20 front, 255/35 R20 rear', status: 'estimated', source: 'Performance 20-inch fitment; not transcribed from a reachable Tesla page' },
      { parameter: 'Dimensions', value: '≈ 4,720 × 1,850 × 1,441 mm, WB 2,875 mm', status: 'estimated', source: 'Approximate published Model 3 dimensions; not transcribed from a reachable Tesla page' },
      { parameter: 'Drag coefficient', value: 'Cd 0.225 × 2.35 m² (CdA ≈ 0.53 m²)', status: 'estimated', source: 'CdA from the EPA target road-load C coefficient 0.0143 lbf/mph² (MY2024 Model 3 Performance AWD) at 1.204 kg/m³; includes non-aerodynamic speed-squared losses', url: EPA },
      { parameter: 'Speed limiter', value: '262 km/h (163 mph)', status: 'reported', source: 'Tesla top-speed claim as reported; the Tesla page could not be fetched here', url: TESLA },
      { parameter: 'Weight distribution', value: '48 % front', status: 'estimated', source: 'Not published in the reachable sources' },
      { parameter: 'CG height', value: '0.46 m', status: 'estimated', source: 'Floor battery sedan; not published' },
      { parameter: 'Creep', value: 'Creeps off the brake', status: 'estimated', source: 'Default EV behaviour (Tesla offers Creep as a setting)' },
      { parameter: 'Tire grip calibration', value: '×1.00', status: 'estimated', source: 'The launch is torque-limited (741 Nm through the 8.8 reduction), so grip has no effect; held at the 1.00 floor' },
      { parameter: 'Drivetrain efficiency', value: '90 %', status: 'estimated', source: 'Trap fit to Car and Driver 125 mph (sim 11.19 s @ 125.3 mph, rollout). The simulation stays slower to 60 mph (3.02 s against 2.8 s): the reported 741 Nm limits the launch, and raising the system limit to the 461 kW motor sum does not help it (3.15 s standing start at 90 %), so the residual points at unpublished launch torque or reduction' },
    ],
  }),
};
