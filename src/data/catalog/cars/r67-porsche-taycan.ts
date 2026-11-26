import { buildElectricSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

const TD = 'https://newsroom.porsche.com/dam/jcr:36531be5-a8a3-46ec-b146-27272996361d/pag-taycan-turbo-s-td-en.pdf.PDF';
const FEATURE = 'https://newsroom.porsche.com/pdf/7504e7b5-be34-4bcd-9ea8-5f102d60d9a7';
const POWERTRAIN = 'https://newsroom.porsche.com/en/products/taycan/powertrain-18555.html';
const EPA = 'https://www.epa.gov/system/files/documents/2024-05/23-testcar-2024-05-17_0.xlsx';

/** Rear first gear from the EPA N/V of 186 rpm/mph (MY2023 Taycan Turbo, first gear) with the simulator rolling radius of the 305/30 ZR21 (0.34806 m); Porsche: "roughly 15". */
const REAR_FIRST = 15.2;
/** Rear second gear and the front single-speed reduction: Porsche "around 8:1". */
const EIGHT = 8.0;

/** Roster #67: 2020 Porsche Taycan Turbo S (US). */
export const entry: CatalogEntry = {
  id: "2020-porsche-taycan-turbo-s-us-sedan-awd-ev2",
  roster: 67,
  section: "Electric cars and trucks",
  make: "Porsche",
  model: "Taycan",
  trim: "Turbo S",
  modelYear: 2020,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "J1",
  aliases: [
    "Taycan",
    "J1"
  ],
  origin: "Germany",
  usage: [
    "Sport Sedan",
    "Luxury"
  ],
  drive: "AWD",
  transmission: "Two-speed",
  transmissionLabel: "Two-speed rear axle",
  powertrain: "Electric",
  engineLabel: "Dual-motor (190 kW front + 335 kW rear; 560 kW overboost)",
  modelPath: "EV",
  factory: {
    power: "460 kW (625 PS); 560 kW (761 PS) overboost with Launch Control",
    torque: "1,050 Nm with Launch Control",
    curbMass: "2,295 kg unladen (DIN); Autocar weighed 2,355 kg",
    zeroTo100KmhS: 2.8,
    zeroTo60MphS: 2.6,
    topSpeed: "260 km/h",
    sourceId: "src-porsche-td"
  },
  sources: [
    {
      id: "src-porsche-td",
      title: "Taycan Turbo S technical data (EU, model year M)",
      publisher: "Porsche AG",
      url: TD,
      kind: "manufacturer"
    },
    {
      id: "src-porsche-feature",
      title: "Technical Feature: The Porsche Taycan",
      publisher: "Porsche Newsroom (Australia)",
      url: FEATURE,
      kind: "manufacturer",
      date: "2021-02-25"
    },
    {
      id: "src-porsche-powertrain",
      title: "The powertrain: Pure performance",
      publisher: "Porsche Newsroom",
      url: POWERTRAIN,
      kind: "manufacturer",
      date: "2019-09-04"
    },
    {
      id: "src-epa",
      title: "Data on cars used for testing fuel economy, model year 2023 (Taycan Turbo rows)",
      publisher: "US EPA",
      url: EPA,
      kind: "manufacturer",
      date: "2024-05"
    },
    {
      id: "test",
      title: "2020 Porsche Taycan Turbo S acceleration testing",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a30688949/2020-porsche-taycan-turbo-s-testing-acceleration-zero-to-60/",
      kind: "road-test"
    },
    {
      id: "src-cd-cmp",
      title: "2020 Porsche Taycan Turbo S vs. 2020 Tesla Model S Performance (comparison test)",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/comparison-test/a30799498/2020-porsche-taycan-turbo-s-vs-2020-tesla-model-s-performance/",
      kind: "road-test",
      date: "2020"
    },
    {
      id: "src2",
      title: "Porsche Taycan Turbo S review",
      publisher: "Autocar",
      url: "https://autocar.co.uk/node/99423",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src-cd-cmp",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "The original Car and Driver comparison table (2020) lists a 0.2 s one-foot rollout, subtracted from the published times (procedure in use since late 2019).",
      results: {
        zeroTo60MphS: 2.4,
        quarterMileS: 10.5,
        quarterMileTrapMph: 130,
        rolloutS: 0.2
      },
      conditions: {},
      match: "exact",
      verification: "Elapsed times unchanged; source moved to the original comparison table, whose 0.2 s rollout entry sets the timing basis, per the Codex inspection of 358661b (2026-11-24). The January 2020 acceleration story remains listed as a reference.",
      date: "2020"
    }
  ],
  dataGaps: [
    "Overboost duration (not published by Porsche)",
    "Exact gear ratios (Porsche gives approximately 15:1 and 8:1)",
    "Rear first-to-second change speed",
    "Weight distribution and the Car and Driver test mass",
    "Power curve above base speed (Porsche publishes peak ratings only)"
  ],
  simCaveats: [
    "Electric model: each motor holds its rated torque to base speed and then rated power up to 16,000 rpm; Porsche publishes no curve above base speed.",
    "Overboost (560 kW) runs for an estimated 2.5 s after a Launch Control start; Porsche does not state the duration in the reachable sources, and the quarter-mile trap is sensitive to it.",
    "Porsche's motor ratings (190 + 335 kW) sum to less than the 560 kW overboost, so both motor caps are raised in proportion (to 203 and 357 kW) for the published overboost to be reachable."
  ],
  notes: [
    "Porsche quotes 0–60 mph in 2.6 s, 0–100 km/h in 2.8 s, 0–200 km/h in 9.6 s and the quarter mile in 10.7 s with Launch Control."
  ],
  sim: buildElectricSpec({
  id: "2020-porsche-taycan-turbo-s-us-sedan-awd-ev2",
  make: "Porsche",
  model: "Taycan",
  trim: "Turbo S",
  modelYear: 2020,
  market: "US",
  body: "Sedan",
  shortName: "Porsche Taycan Turbo S"
}, {
    description: 'Front and rear permanent-magnet synchronous motors; single-speed front, two-speed rear',
    code: 'J1 PSM dual motor',
    motors: [
      { axle: 'front', peakPowerKw: 202.7, peakTorqueNm: 440, maxRpm: 16000, reductions: [EIGHT] },
      { axle: 'rear', peakPowerKw: 357.3, peakTorqueNm: 550, maxRpm: 16000, reductions: [REAR_FIRST, EIGHT], upshiftKmh: 120 },
    ],
    systemPowerKw: 460,
    boost: { systemPowerKw: 560, systemTorqueNm: 1050, durationS: 2.5, trigger: 'launch-control', label: 'Overboost' },
    creep: true,
    drivetrain: { layout: 'AWD', efficiency: 0.95, description: 'Dual-motor AWD with two-speed rear transmission and electronically controlled rear limited-slip differential (PTV Plus)' },
    chassis: { curbMassKg: 2295, frontWeightFraction: 0.49, cgHeightM: 0.45, wheelbaseM: 2.9, lengthMm: 4963, widthMm: 1966, heightMm: 1378 },
    aero: { dragCoefficient: 0.25, frontalAreaM2: 2.33 },
    tires: { sizes: [staggered('r21', '265/35 ZR21 / 305/30 ZR21', { widthMm: 265, aspectPct: 35, rimIn: 21 }, { widthMm: 305, aspectPct: 30, rimIn: 21 }, 'Factory fitment')], compound: 'uhp', gripScale: 1.12 },
    speedLimiterKmh: 260,
    factory: { zeroTo100S: 2.8, topSpeedKmh: 260, zeroTo60MphS: 2.6 },
    provenance: [
      { parameter: 'Peak power', value: 'Front 190 kW, rear 335 kW; system 460 kW, 560 kW overboost with Launch Control', status: 'verified', source: 'Porsche Technical Feature (motor ratings) and technical data (system and overboost)', url: FEATURE },
      { parameter: 'Motor power caps', value: 'Front 202.7 kW, rear 357.3 kW (ratings × 560/525)', status: 'reported', source: 'Derived: the published ratings sum to 525 kW, under the published 560 kW overboost, so both are scaled in proportion; the shared 460 kW limit binds outside overboost', url: FEATURE },
      { parameter: 'Peak torque', value: 'Front 400 Nm (440 Nm with Launch Control, modelled), rear 550 Nm; 1,050 Nm system with Launch Control', status: 'verified', source: 'Porsche Technical Feature and technical data', url: FEATURE },
      { parameter: 'Motor maximum speed', value: '16,000 rpm (both)', status: 'verified', source: 'Porsche Technical Feature', url: FEATURE },
      { parameter: 'Gear ratios', value: `Front ${EIGHT.toFixed(1)}:1 single speed; rear ${REAR_FIRST}:1 first, ${EIGHT.toFixed(1)}:1 second`, status: 'reported', source: 'Porsche: front approx. 8:1, rear first roughly 15:1, second around 8:1. Rear first refined from the EPA N/V of 186 rpm/mph (MY2023 Taycan Turbo) with the simulator rolling radius', url: POWERTRAIN },
      { parameter: 'Gear change speed', value: 'First to second at 120 km/h', status: 'estimated', source: 'Porsche: the transmission "remains in first gear for a relatively long time"; first runs out near 139 km/h at 16,000 rpm. Above ≈ 98 km/h second gear also reaches full power, so the choice mainly moves the change dip' },
      { parameter: 'Overboost duration', value: '2.5 s after a Launch Control start', status: 'estimated', source: 'Not stated in the reachable Porsche sources' },
      { parameter: 'Curb mass', value: '2,295 kg unladen (DIN); Autocar weighed 2,355 kg', status: 'verified', source: 'Porsche technical data', url: TD },
      { parameter: 'Tire size', value: '265/35 ZR21 front, 305/30 ZR21 rear', status: 'verified', source: 'Porsche technical data', url: TD },
      { parameter: 'Dimensions', value: '4,963 × 1,966 × 1,378 mm, WB 2,900 mm', status: 'verified', source: 'Porsche technical data', url: TD },
      { parameter: 'Drag coefficient', value: 'Cd 0.25, CdA 0.583 m² (Range mode)', status: 'verified', source: 'Porsche technical data (Range mode, lowered; other modes raise the car and spoiler)', url: TD },
      { parameter: 'Speed limiter', value: '260 km/h', status: 'verified', source: 'Porsche technical data', url: TD },
      { parameter: 'Weight distribution', value: '49 % front', status: 'estimated', source: 'Not published in the reachable sources' },
      { parameter: 'CG height', value: '0.45 m', status: 'estimated', source: 'Low sedan with floor battery; not published' },
      { parameter: 'Creep', value: 'Creeps off the brake', status: 'estimated', source: 'Default EV behaviour; not documented here' },
      { parameter: 'Tire grip calibration', value: '×1.12', status: 'estimated', source: 'Fit to the Car and Driver 0–60 mph 2.4 s (0.2 s rollout): 2.40 s' },
      { parameter: 'Drivetrain efficiency', value: '95 %', status: 'estimated', source: 'Held at the 95 % EV bound: the Car and Driver trap (130 mph) asks for more. The simulation gives 10.66 s @ 128.1 mph with a 2.5 s overboost; a 10 s overboost instead gives 10.26 s @ 135.6 mph, so the residual mostly reflects the unpublished overboost duration' },
    ],
  }),
};
