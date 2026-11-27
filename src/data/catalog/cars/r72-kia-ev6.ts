import { buildElectricSpec, square } from '../build';
import type { CatalogEntry } from '../types';

const KIA_ES = 'https://press.kia.com/content/dam/kiapress/ES/Kia%20EV6%20GT%20-%20Ficha%20t%C3%A9cnica.pdf';
const KIA_AT = 'https://press.kia.com/content/dam/kiapress/AT/PDF2022/2822%20Kia%20EV6%20GT%20Marktstart.pdf';
const EPA = 'https://www.epa.gov/system/files/documents/2024-05/23-testcar-2024-05-17_0.xlsx';
const CD = 'https://www.caranddriver.com/reviews/a42097092/2023-kia-ev6-gt-by-the-numbers/';

/**
 * Overall motor → wheel reduction from the EPA N/V of 126.7 rpm/mph with the
 * simulator rolling radius of the 255/40 R21 tire (0.35765 m):
 * ratio = N/V × 2πr ÷ (60 × 0.44704).
 */
const REDUCTION = 10.62;

/** Roster #72: 2023 Kia EV6 GT (US). */
export const entry: CatalogEntry = {
  id: "2023-kia-ev6-gt-us-cuv-awd-ev",
  roster: 72,
  section: "Electric cars and trucks",
  make: "Kia",
  model: "EV6",
  trim: "GT",
  modelYear: 2023,
  market: "US",
  body: "Crossover",
  bodyLabel: "Crossover",
  chassisCode: "CV",
  aliases: [
    "EV6 GT",
    "CV"
  ],
  origin: "South Korea",
  usage: [
    "SUV",
    "Sport Compact"
  ],
  drive: "AWD",
  transmission: "Direct drive",
  transmissionLabel: "Single-speed",
  powertrain: "Electric",
  engineLabel: "Dual-motor (160 kW front + 270 kW rear)",
  modelPath: "EV",
  factory: {
    power: "576 hp (US); 430 kW combined (Kia Europe)",
    torque: "545 lb-ft (US); 740 Nm combined (Kia Europe)",
    curbMass: "2,185 kg EU running order (max, incl. 75 kg driver)",
    zeroTo100KmhS: 3.5,
    zeroTo60MphS: 3.4,
    topSpeed: "260 km/h",
    sourceId: "src-kia-es"
  },
  sources: [
    {
      id: "test",
      title: "2023 Kia EV6 GT by the numbers",
      publisher: "Car and Driver",
      url: CD,
      kind: "road-test"
    },
    {
      id: "src-kia-es",
      title: "Kia EV6 GT ficha técnica",
      publisher: "Kia Spain",
      url: KIA_ES,
      kind: "manufacturer"
    },
    {
      id: "src-kia-at",
      title: "Kia EV6 GT Marktstart (press release)",
      publisher: "Kia Austria",
      url: KIA_AT,
      kind: "manufacturer",
      date: "2022"
    },
    {
      id: "src-epa",
      title: "Data on cars used for testing fuel economy, model year 2023 (EV6 AWD GT row)",
      publisher: "US EPA",
      url: EPA,
      kind: "manufacturer",
      date: "2024-05"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "test",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver excludes a 0.3 s one-foot rollout from these times.",
      results: {
        zeroTo60MphS: 3.2,
        quarterMileS: 11.6,
        quarterMileTrapMph: 119,
        rolloutS: 0.3
      },
      conditions: {
        testMass: "4,772 lb curb (as weighed)",
        tires: "Test-car tires as specified in the original (not re-transcribed here)",
        driveMode: "Not identified for the timed runs; the article states the 576 hp peak requires GT mode",
        other: [
          "The article corroborates motor speeds up to 21,000 rpm",
          "State of charge and battery temperature not stated"
        ]
      },
      match: "exact",
      verification: "Original by-the-numbers test as verified in the Codex handoffs (2026-11-26): 3.2 s to 60 mph, 11.6 s @ 119 mph, 0.3 s rollout, 4,772 lb curb; up to 21,000 motor rpm; 576 hp needs GT mode, but the timed run's mode is not stated. The Car and Driver site refuses automated fetches from this session, so tire details are not transcribed."
    }
  ],
  dataGaps: [
    "Per-motor torque (derived from the peak-power rpm bands)",
    "Power curve above the published peak-power bands (motor maximum speed is only press-reported)",
    "Front reduction (assumed equal to the EPA-derived overall reduction)",
    "US curb mass and weight distribution",
    "Drag coefficient (only the EPA road-load coefficients are sourced)",
    "Test-day drive mode, state of charge and battery temperature"
  ],
  simCaveats: [
    "Electric model: each motor holds its peak torque to the start of its published peak-power band, holds peak power through the band and then falls as band-end speed ÷ speed (an estimated lower bound; Kia publishes no curve above the bands). The simulation therefore tops out near 243 km/h against Kia's 260 km/h limited claim, and traps ≈ 4 mph under Car and Driver; holding peak power instead overshoots the trap by ≈ 6 mph.",
    "Per-motor torque is derived from power ÷ speed at the start of each peak-power band (sum 726 Nm, under the 740 Nm system figure)."
  ],
  notes: [
    "Drag-strip runs by other outlets (11.2–11.5 s) used prepared surfaces and are not transcribed; Kia US claims 3.4 s to 60 mph, Kia Europe 3.5 s to 100 km/h."
  ],
  sim: buildElectricSpec({
  id: "2023-kia-ev6-gt-us-cuv-awd-ev",
  make: "Kia",
  model: "EV6",
  trim: "GT",
  modelYear: 2023,
  market: "US",
  body: "Crossover",
  shortName: "Kia EV6 GT"
}, {
    description: 'Front and rear permanent-magnet synchronous motors, single-speed reductions',
    code: 'E-GMP dual motor',
    motors: [
      { axle: 'front', peakPowerKw: 160, peakTorqueNm: 347, maxRpm: 21000, peakPowerEndRpm: 9000, reductions: [REDUCTION] },
      { axle: 'rear', peakPowerKw: 270, peakTorqueNm: 379, maxRpm: 21000, peakPowerEndRpm: 9400, reductions: [REDUCTION] },
    ],
    systemPowerKw: 430,
    systemTorqueNm: 740,
    creep: true,
    drivetrain: { layout: 'AWD', efficiency: 0.95, description: 'Dual-motor AWD (one motor per axle) with electronic rear limited-slip differential' },
    chassis: { curbMassKg: 2110, frontWeightFraction: 0.5, cgHeightM: 0.55, wheelbaseM: 2.9, lengthMm: 4695, widthMm: 1890, heightMm: 1545 },
    aero: { dragCoefficient: 0.371, frontalAreaM2: 2.45 },
    tires: { sizes: [square('r21', '255/40 R21', 255, 40, 21, 'Factory fitment')], compound: 'uhp', gripScale: 1 },
    speedLimiterKmh: 260,
    factory: { zeroTo100S: 3.5, topSpeedKmh: 260, zeroTo60MphS: 3.4 },
    provenance: [
      { parameter: 'Peak power', value: 'Front 160 kW @ 4,400–9,000 rpm; rear 270 kW @ 6,800–9,400 rpm; 430 kW combined (576 hp US)', status: 'verified', source: 'Kia Spain technical sheet and Kia Austria release (EPA rates 577 hp)', url: KIA_ES },
      { parameter: 'Peak torque', value: 'Front 347 Nm, rear 379 Nm (derived); 740 Nm combined', status: 'reported', source: 'Combined 740 Nm from Kia; per-motor torque derived as power ÷ speed at the start of each peak-power band (160 kW at 4,400 rpm, 270 kW at 6,800 rpm)', url: KIA_AT },
      { parameter: 'Gear ratios', value: `Single-speed overall reduction ${REDUCTION} (both axles)`, status: 'reported', source: 'Derived from the EPA N/V of 126.7 rpm/mph (MY2023 EV6 AWD GT) with the simulator rolling radius; Kia gives "single reduction" without the ratio; the front axle is assumed to match', url: EPA },
      { parameter: 'Curb mass', value: '2,110 kg (2,185 kg EU running order − 75 kg driver); Car and Driver weighed 4,772 lb', status: 'reported', source: 'Kia Spain technical sheet (running order, maximum); US curb not reachable (Kia US media site refused)', url: KIA_ES },
      { parameter: 'Tire size', value: '255/40 R21', status: 'verified', source: 'Kia Spain technical sheet', url: KIA_ES },
      { parameter: 'Dimensions', value: '4,695 × 1,890 × 1,545 mm, WB 2,900 mm', status: 'verified', source: 'Kia Spain technical sheet', url: KIA_ES },
      { parameter: 'Speed limiter', value: '260 km/h', status: 'verified', source: 'Kia Spain technical sheet and Kia Austria release', url: KIA_ES },
      { parameter: 'Drag coefficient', value: 'Cd 0.371 × 2.45 m² (CdA ≈ 0.91 m²)', status: 'estimated', source: 'CdA from the EPA target road-load C coefficient 0.024634 lbf/mph² (EV6 AWD GT) at 1.204 kg/m³; it includes non-aerodynamic speed-squared losses. Split using area ≈ 0.84 × width × height', url: EPA },
      { parameter: 'Motor maximum speed', value: '21,000 rpm (both)', status: 'reported', source: 'Car and Driver\'s original test describes motors spinning up to 21,000 rpm (as read in the Codex inspection of PR #9); Kia does not publish it. The 260 km/h limited top speed needs ≈ 20,500 rpm at the EPA-derived reduction', url: CD },
      { parameter: 'System limits', value: '430 kW and 740 Nm shared', status: 'verified', source: 'Kia combined output figures', url: KIA_AT },
      { parameter: 'Weight distribution', value: '50 % front', status: 'estimated', source: 'Dual-motor skateboard layout; not published in the reachable sources' },
      { parameter: 'CG height', value: '0.55 m', status: 'estimated', source: 'Floor battery: lower than a typical crossover; not published' },
      { parameter: 'Creep', value: 'Creeps off the brake', status: 'estimated', source: 'Default EV behaviour; the creep setting is driver-selectable on the car' },
      { parameter: 'Tire grip calibration', value: '×1.00', status: 'estimated', source: 'Fit to the Car and Driver 0–60 mph 3.2 s (1-ft rollout) lands on the 1.00 floor (3.21 s)' },
      { parameter: 'Drivetrain efficiency', value: '95 %', status: 'estimated', source: 'Single-reduction motor-to-wheel efficiency, held at the 95 % EV bound: a trap fit to 119 mph asks for more than 97 %. The trap residual (≈ −4 mph) is left visible; it is sensitive to the unpublished power curve above the peak-power bands (holding peak power to top speed instead gives ≈ 125 mph)' },
      { parameter: 'Power above the peak-power band', value: 'Falls as band-end speed ÷ speed above 9,000 rpm (front) and 9,400 rpm (rear)', status: 'estimated', source: 'Kia publishes peak power only within those bands; constant-voltage field weakening is the standard first-order law (a lower bound). Sensitivity: holding peak power to top speed instead gives ¼ mile 11.31 s @ 125.1 mph (rollout) and reaches the 260 km/h limiter; the decline law gives 11.62 s @ 114.8 mph and a 243 km/h drag-limited top speed' },
    ],
  }),
};
