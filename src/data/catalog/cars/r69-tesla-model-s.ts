import { buildElectricSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

const EPA = 'https://www.epa.gov/system/files/documents/2025-05/24-testcar-2025-05.xlsx';
const MANUAL_CN = 'https://www.tesla.cn/ownersmanual/models/en_cn/GUID-E414862C-CFA1-4A0B-9548-BE21C32CAA58.html';
const CD = 'https://autos.yahoo.com/tested-2021-tesla-model-plaid-140000565.html';

/**
 * Single-speed reduction: the EPA axle ratio. The EPA N/V of 90.3 rpm/mph implies 7.25 with the simulator
 * rolling radius (0.3428 m); the real 19-inch tire turns ≈ 4 % fewer revolutions per mile.
 */
const REDUCTION = 7.56;

/** Roster #69: 2021 Tesla Model S Plaid (US). */
export const entry: CatalogEntry = {
  id: "2021-tesla-model-s-plaid-us-liftback-awd-ev",
  roster: 69,
  section: "Electric cars and trucks",
  make: "Tesla",
  model: "Model S",
  trim: "Plaid",
  modelYear: 2021,
  market: "US",
  body: "Liftback",
  bodyLabel: "Liftback",
  chassisCode: "Refresh",
  aliases: [
    "Plaid",
    "Model S"
  ],
  origin: "United States",
  usage: [
    "Sport Sedan",
    "Luxury"
  ],
  drive: "AWD",
  transmission: "Direct drive",
  transmissionLabel: "Single-speed",
  powertrain: "Electric",
  engineLabel: "Tri-motor (one front, two rear; 760 kW)",
  modelPath: "EV",
  factory: {
    power: "1,020 hp (760 kW); EPA-rated 1,006 hp",
    torque: "1,050 lb-ft (reported)",
    curbMass: "4,766 lb (Tesla, 19-inch wheels)",
    topSpeed: "163 mph (200 mph with the later Track Package)",
    sourceId: "src3"
  },
  sources: [
    {
      id: "src-epa",
      title: "Data on cars used for testing fuel economy, model years 2021 and 2024 (Model S Plaid rows)",
      publisher: "US EPA",
      url: EPA,
      kind: "manufacturer",
      date: "2025-05"
    },
    {
      id: "src-manual-cn",
      title: "Model S owner's manual: motors (China English edition)",
      publisher: "Tesla",
      url: MANUAL_CN,
      kind: "manufacturer"
    },
    {
      id: "test",
      title: "2021 Tesla Model S Plaid performance test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/news/a38439509/2021-tesla-model-s-plaid-performance-test-comparison/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Tested: 2021 Tesla Model S Plaid Is Absurdly Quick but Also Has a Few Key Flaws",
      publisher: "Car and Driver (syndicated on Yahoo)",
      url: "https://autos.yahoo.com/tested-2021-tesla-model-plaid-140000565.html",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "2021 Tesla Model S Plaid track tested",
      publisher: "Edmunds",
      url: "https://www.edmunds.com/car-news/2021-tesla-model-s-plaid-track-tested.html",
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
        zeroTo100MphS: 4.3,
        quarterMileS: 9.4
      },
      conditions: {
        surface: "Non-prepped asphalt (Car and Driver method)"
      },
      match: "exact",
      verification: "Syndicated copy of the article (original page not reachable from this environment). The 0–60 time was not in the reachable text.",
      date: "2021"
    },
    {
      id: "edmunds",
      sourceId: "src3",
      publication: "Edmunds",
      timing: "standing-start",
      timingNote: "Edmunds times from a standstill (\"zero should mean zero\"), no rollout.",
      results: {
        zeroTo60MphS: 2.3,
        quarterMileS: 9.4,
        quarterMileTrapMph: 150.8
      },
      conditions: {
        testMass: "4,842 lb",
        surface: "Unprepped"
      },
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2021"
    }
  ],
  dataGaps: [
    "Car and Driver 0–60 and trap speed",
    "Per-motor torque and the power split (Tesla publishes ratings only in its China manual, read here through a search summary)",
    "Dimensions and weight distribution (not transcribed from a reachable Tesla page)",
    "Test-car wheel fitment and drive mode"
  ],
  simCaveats: [
    "Electric model: three equal motors (295 kW, 475 Nm each) under the 760 kW system rating; Tesla publishes no per-motor torque or curve above base speed.",
    "Tesla's own pages could not be fetched from this environment; the motor ratings come from a search-result summary of Tesla's China owner's manual and the reduction from EPA test-car data."
  ],
  notes: [
    "Tesla’s sub-2-second claim subtracts a 1-ft rollout and was set on a prepared drag strip; magazine tests on ordinary pavement are slower. The two must not be compared directly."
  ],
  sim: buildElectricSpec({
  id: "2021-tesla-model-s-plaid-us-liftback-awd-ev",
  make: "Tesla",
  model: "Model S",
  trim: "Plaid",
  modelYear: 2021,
  market: "US",
  body: "Liftback",
  shortName: "Tesla Model S Plaid"
}, {
    description: 'Three carbon-sleeved permanent-magnet synchronous motors (one front, two rear); single speed',
    code: 'Plaid tri-motor',
    motors: [
      { axle: 'front', peakPowerKw: 295, peakTorqueNm: 475, maxRpm: 20000, reductions: [REDUCTION] },
      { axle: 'rear', peakPowerKw: 295, peakTorqueNm: 475, maxRpm: 20000, reductions: [REDUCTION] },
      { axle: 'rear', peakPowerKw: 295, peakTorqueNm: 475, maxRpm: 20000, reductions: [REDUCTION] },
    ],
    systemPowerKw: 760,
    systemTorqueNm: 1424,
    creep: true,
    drivetrain: { layout: 'AWD', efficiency: 0.89, description: 'Tri-motor AWD with rear torque vectoring' },
    chassis: { curbMassKg: 2162, frontWeightFraction: 0.49, cgHeightM: 0.46, wheelbaseM: 2.96, lengthMm: 5021, widthMm: 1964, heightMm: 1431 },
    aero: { dragCoefficient: 0.208, frontalAreaM2: 2.34 },
    tires: { sizes: [staggered('r19', '245/45 R19 / 285/40 R19', { widthMm: 245, aspectPct: 45, rimIn: 19 }, { widthMm: 285, aspectPct: 40, rimIn: 19 }, 'Standard 19-inch fitment')], compound: 'uhp', gripScale: 1.2 },
    speedLimiterKmh: 262,
    factory: { topSpeedKmh: 262 },
    provenance: [
      { parameter: 'System output', value: '760 kW (1,020 hp); EPA rates 1,006 hp', status: 'reported', source: 'Tesla rating as reported by Car and Driver and Edmunds; EPA test-car data', url: EPA },
      { parameter: 'Peak power', value: '295 kW per motor (front and rear)', status: 'reported', source: "Tesla China owner's manual (rated maximum per motor), read through a search-result summary; the page could not be fetched here", url: MANUAL_CN },
      { parameter: 'Peak torque', value: '475 Nm per motor, 1,424 Nm (1,050 lb-ft) system', status: 'estimated', source: 'System torque as reported by magazines (Tesla publishes none); split evenly across the three motors' },
      { parameter: 'Motor maximum speed', value: '20,000 rpm', status: 'reported', source: 'Car and Driver: the carbon-sleeved motors spin to 20,000 rpm', url: CD },
      { parameter: 'Gear ratios', value: `Single speed ${REDUCTION}:1 (all motors)`, status: 'reported', source: 'EPA axle ratio 7.56 for the Model S Plaid (MY2021–2023 rows); the N/V of 90.3 rpm/mph would give 7.25 with the simulator rolling radius', url: EPA },
      { parameter: 'Curb mass', value: '2,162 kg (4,766 lb, 19-inch wheels); Edmunds weighed 4,842 lb', status: 'reported', source: 'Tesla figure as cited by Edmunds' },
      { parameter: 'Tire size', value: '245/45 R19 front, 285/40 R19 rear', status: 'estimated', source: 'Standard 19-inch fitment; the test cars’ fitment is not stated in the reachable text' },
      { parameter: 'Dimensions', value: '≈ 5,021 × 1,964 × 1,431 mm, WB 2,960 mm', status: 'estimated', source: 'Approximate published Model S dimensions; not transcribed from a reachable Tesla page' },
      { parameter: 'Drag coefficient', value: 'Cd 0.208 × 2.34 m² (CdA ≈ 0.49 m²)', status: 'reported', source: 'Tesla’s published Cd 0.208; the CdA agrees with the EPA target road-load C of 0.0132 lbf/mph² (MY2024 Plaid, 19-inch: 0.49 m² at 1.204 kg/m³)', url: EPA },
      { parameter: 'Speed limiter', value: '262 km/h (163 mph)', status: 'reported', source: 'Launch top speed without the Track Package' },
      { parameter: 'Weight distribution', value: '49 % front', status: 'estimated', source: 'Not published in the reachable sources' },
      { parameter: 'CG height', value: '0.46 m', status: 'estimated', source: 'Floor battery liftback; not published' },
      { parameter: 'Creep', value: 'Creeps off the brake', status: 'estimated', source: 'Default EV behaviour (Tesla offers Creep as a setting)' },
      { parameter: 'Tire grip calibration', value: '×1.20', status: 'estimated', source: 'Fit toward the Edmunds 0–60 mph 2.3 s (standing start): the run is power-limited from ≈ 1.2 up, giving 2.35 s' },
      { parameter: 'Drivetrain efficiency', value: '89 %', status: 'estimated', source: 'Trap fit to Edmunds 150.8 mph (standing start: 9.68 s @ 150.8 mph); Car and Driver’s 9.4 s quarter mile (rollout) gives 9.44 s. Absorbs the estimated per-motor torque split' },
    ],
  }),
};
