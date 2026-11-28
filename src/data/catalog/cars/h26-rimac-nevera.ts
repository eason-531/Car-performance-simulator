import { buildElectricSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

const RIMAC = 'https://www.rimac-automobili.com/nevera/';
const EPA = 'https://www.epa.gov/system/files/documents/2024-05/23-testcar-2024-05-17_0.xlsx';
const DRAGTIMES = 'https://insideevs.com/news/526584/rimac-nevera-dragstrip-world-record/';
const IEEE = 'https://spectrum.ieee.org/rimac-nevera-record';
const REC_2023 = 'https://www.rimac-newsroom.com/press-releases/rimac-automobili/rimac-nevera-sets-23-performance-records-in-a-single-day';
const REC_2021 = 'https://www.rimac-newsroom.com/press-releases/rimac-automobili/rimac-nevera-is-the-world-s-fastest-accelerating-production-car';
const BENDING_PHYSICS = 'https://www.rimac-automobili.com/bendingphysics/episode-1.php';

/**
 * Power above base speed (provisional): full power to FADE_RPM, then power ∝
 * (FADE_RPM ÷ rpm)^FADE_EXP. Two parameters fitted to Rimac's 2023 Dewesoft
 * 200–300 km/h (4.79 s) and 300–400 km/h (12.09 s) splits; Rimac publishes no curve.
 */
const FADE_RPM = 8400;
const FADE_EXP = 0.44;

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
      id: "src-rimac-2023",
      title: "Rimac Nevera sets 23 performance records in a single day (ATP Papenburg; Dewesoft and Racelogic)",
      publisher: "Rimac Newsroom",
      url: REC_2023,
      kind: "manufacturer",
      date: "2023-05-17"
    },
    {
      id: "src-rimac-bp1",
      title: "Bending Physics, episode 1 (the Papenburg record day, 30 April 2023)",
      publisher: "Rimac Automobili",
      url: BENDING_PHYSICS,
      kind: "manufacturer"
    },
    {
      id: "src-rimac-2021",
      title: "Rimac Nevera is the world's fastest accelerating production car (Famoso Raceway quarter mile)",
      publisher: "Rimac Newsroom",
      url: REC_2021,
      kind: "manufacturer",
      date: "2021-08-13"
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
      id: "rimac-2023",
      sourceId: "src-rimac-2023",
      publication: "Rimac records at ATP Papenburg (Dewesoft and Racelogic)",
      timing: "rollout-1ft",
      timingNote: "Rimac: all acceleration records used a standard one-foot rollout. The release tables Racelogic and Dewesoft side by side; the Dewesoft column is shown here. The two differ by up to 0.03 s (0–100 km/h 1.82 s Racelogic / 1.81 s Dewesoft; quarter mile 8.26 / 8.25 s; standing mile 20.62 / 20.59 s).",
      results: {
        zeroTo60MphS: 1.74,
        zeroTo100KmhS: 1.81,
        zeroTo100MphS: 3.21,
        zeroTo200KmhS: 4.42,
        quarterMileS: 8.25
      },
      conditions: {
        surface: "Non-prepped asphalt, Automotive Testing Papenburg (4.0 km straights), Germany",
        tires: "Michelin Pilot Sport Cup 2 R (road-legal track tires)",
        launchControl: "Not stated",
        other: [
          "No quarter-mile trap speed published",
          "Also published, Dewesoft (Racelogic): 0–300 km/h 9.22 s (9.23), 0–400 km/h 21.31 s (21.32), 200–300 km/h 4.79 s (4.81), ½ mile 12.83 s (12.82), standing mile 20.59 s (20.62), 0–200 mph 10.86 s (10.86)",
          "Record day 30 April 2023 (Rimac's Bending Physics episode 1, which lists one figure per test without naming the system: mostly the Dewesoft values, e.g. standing mile 20.59 s, but ½ mile 12.82 s is the Racelogic value). The press release, published 17 May 2023, gives no run date"
        ]
      },
      match: "equivalent",
      deviation: "Record fitment: Michelin Pilot Sport Cup 2 R instead of the standard Pilot Sport 4S modelled here",
      verification: "Rimac press release of 17 May 2023 (fetched 2026-11-27, re-read 2026-11-28): 23 records on one day, both verifiers on site, table of Racelogic and Dewesoft figures. Event date from Rimac's Bending Physics episode 1 (read 2026-11-28). Rimac's specification page repeats 1.74 s and 1.81 s.",
      date: "2023-04-30"
    },
    {
      id: "famoso-2021",
      sourceId: "src-rimac-2021",
      publication: "Rimac / DragTimes at Famoso Raceway",
      timing: "drag-strip",
      timingNote: "Drag-strip elapsed time and trap at Famoso Raceway, verified by track officials and DragTimes; the release names no timing system or rollout.",
      results: {
        quarterMileS: 8.582,
        quarterMileTrapMph: 167.51
      },
      conditions: {
        surface: "Prepared drag strip, Famoso Raceway, California (Rimac's test driver calls it their first run on a VHT-glued surface)",
        temperatureC: 37,
        tires: "Michelin Pilot Sport 4S (standard)",
        launchControl: "Launch control: left foot on the brake, floor the accelerator, release",
        other: [
          "Track temperature 65 °C",
          "11th run of the day; driver Brooks Weiselblat (DragTimes)",
          "Earlier runs that day 8.7–8.8 s before traction-control and tire warm-up changes"
        ]
      },
      match: "exact",
      verification: "Rimac press release of 13 August 2021 (fetched 2026-11-27); the InsideEVs report is listed as corroboration.",
      date: "2021-08-13"
    }
  ],
  dataGaps: [
    "Gear ratio (derived from Rimac's wheel and motor torque)",
    "Motor maximum speed, and the power curve above base speed (a provisional fit to Rimac's 2023 high-speed splits)",
    "Quarter-mile trap of the 2023 records (not published), and battery state and temperature on both record days",
    "Weight distribution",
    "Frontal area (Rimac gives Cd 0.3 in low-drag mode only)",
    "Magazine road test"
  ],
  simCaveats: [
    "Electric model: four motors (2 × 226 kW / 270 Nm front, 2 × 450 kW / 900 Nm rear) under the 1,408 kW system rating. Rimac's motor ratings sum to 1,352 kW, so each motor cap is raised by the same 4.1 % for the rated output to be reachable — a modelling assumption, not a rating (as for the Taycan's overboost).",
    "Power above ≈ 190 km/h (8,400 motor rpm) falls as (8,400 ÷ rpm)^0.44, a provisional two-parameter fit to Rimac's 2023 Dewesoft 200–300 and 300–400 km/h splits; Rimac publishes no curve. Holding the full 1,408 kW to top speed instead runs 300–400 km/h in 7.5 s against 12.1 s.",
    "The 2023 Papenburg records (record day 30 April 2023, published 17 May 2023; Cup 2 R tires, non-prepped asphalt, 1-ft rollout; Dewesoft column used) and the 2021 Famoso drag-strip record (standard Pilot Sport 4S, launch control, prepared strip, 37 °C air, 65 °C track) are separate events with different tires, surfaces and timing. Neither trap is fitted: the model (standard tires) traps ≈ 178 mph against Famoso's 167.5 mph, and runs 1.83 s to 60 mph against 1.74 s on Cup 2 R."
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
      { axle: 'front', peakPowerKw: 235.4, peakTorqueNm: 270, maxRpm: 18500, peakPowerEndRpm: FADE_RPM, peakPowerFadeExponent: FADE_EXP, reductions: [REDUCTION] },
      { axle: 'front', peakPowerKw: 235.4, peakTorqueNm: 270, maxRpm: 18500, peakPowerEndRpm: FADE_RPM, peakPowerFadeExponent: FADE_EXP, reductions: [REDUCTION] },
      { axle: 'rear', peakPowerKw: 468.6, peakTorqueNm: 900, maxRpm: 18500, peakPowerEndRpm: FADE_RPM, peakPowerFadeExponent: FADE_EXP, reductions: [REDUCTION] },
      { axle: 'rear', peakPowerKw: 468.6, peakTorqueNm: 900, maxRpm: 18500, peakPowerEndRpm: FADE_RPM, peakPowerFadeExponent: FADE_EXP, reductions: [REDUCTION] },
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
      { parameter: 'Motor power caps', value: 'Front 235.4 kW, rear 468.6 kW each (ratings × 1,408/1,352)', status: 'estimated', source: 'Modelling assumption, not a rating: Rimac\'s motor ratings sum to 1,352 kW, under the 1,408 kW system rating, so each cap is raised 4.1 % for the system rating to be reachable', url: RIMAC },
      { parameter: 'Power above base speed', value: `Full power to ${FADE_RPM.toLocaleString('en-US')} rpm (≈ 190 km/h), then ∝ (${FADE_RPM.toLocaleString('en-US')} ÷ rpm)^${FADE_EXP} (≈ 72 % of peak at 412 km/h)`, status: 'estimated', source: 'Provisional two-parameter fit to Rimac\'s 2023 Dewesoft splits 200–300 km/h (4.79 s; sim 4.77 s) and 300–400 km/h (12.09 s; sim 12.11 s): power-limited segments where the Cup 2 R tires matter little. Not fitted to any trap. Checks: 0–300 km/h 9.11 s (9.22), 0–400 km/h 21.22 s (21.31), ½ mile 12.80 s (12.83), standing mile 20.56 s (Dewesoft 20.59, Racelogic 20.62), drag-limited top speed 412.1 km/h (412). Sensitivity: full power to top speed gives 300–400 km/h in 7.52 s and a 183.4 mph quarter trap; a 12,100 rpm band end with power ∝ 1/speed fits 300–400 km/h but leaves 200–300 km/h 0.6 s quick (182.9 mph)', url: REC_2023 },
      { parameter: 'Peak torque', value: 'Front 270 Nm each, rear 900 Nm each; 2,340 Nm motor torque, 13,430 Nm wheel torque', status: 'verified', source: 'Rimac technical specifications', url: RIMAC },
      { parameter: 'Gear ratios', value: `Single speed ${REDUCTION}:1 (all four gearboxes)`, status: 'reported', source: 'Rimac wheel torque ÷ motor torque (13,430 / 2,340); EPA lists an axle ratio of 5.6 and an N/V of 70.5 rpm/mph', url: RIMAC },
      { parameter: 'Motor maximum speed', value: '18,500 rpm', status: 'estimated', source: 'Not published; the 412 km/h top speed needs ≈ 17,800 rpm at the derived reduction' },
      { parameter: 'Curb mass', value: '2,300 kg', status: 'verified', source: 'Rimac technical specifications', url: RIMAC },
      { parameter: 'Tire size', value: '275/35 R20 front, 315/35 R20 rear, Michelin Pilot Sport 4S (standard; modelled)', status: 'verified', source: 'Rimac technical specifications; the 2021 Famoso record used this standard tire. The 2023 Papenburg records used road-legal Michelin Pilot Sport Cup 2 R, which are not modelled', url: RIMAC },
      { parameter: 'Dimensions', value: '4,745 × 2,052 × 1,240 mm, WB 2,745 mm', status: 'verified', source: 'Rimac technical specifications', url: RIMAC },
      { parameter: 'Drag coefficient', value: 'Cd 0.3 (low-drag mode) × 2.14 m² (CdA ≈ 0.64 m²)', status: 'reported', source: 'Cd from Rimac (low-drag mode); frontal area ≈ 0.84 × width × height (estimated)', url: RIMAC },
      { parameter: 'Top speed', value: '412 km/h', status: 'verified', source: 'Rimac technical specifications', url: RIMAC },
      { parameter: 'Speed limiter', value: 'Modelled at 412 km/h', status: 'estimated', source: 'Rimac does not say whether 412 km/h is governed; the model places a limiter there. With the provisional power fade the drag/power limit is ≈ 412.1 km/h, so the two coincide' },
      { parameter: 'Weight distribution', value: '45 % front', status: 'estimated', source: 'Mid/rear-biased motors and battery; not published' },
      { parameter: 'CG height', value: '0.40 m', status: 'estimated', source: 'Low carbon monocoque with structural battery; not published' },
      { parameter: 'Creep', value: 'Creeps off the brake', status: 'estimated', source: 'Default EV behaviour; not documented here' },
      { parameter: 'Tire grip calibration', value: '×1.30', status: 'estimated', source: 'Fit toward Rimac’s 0–60 mph 1.74 s (1-ft rollout, on Cup 2 R) reaches the 1.30 upper bound; on the standard Pilot Sport 4S the simulation stays slower (1.83 s). The 0.09 s left is attributed to the record tires and surface and not fitted further' },
      { parameter: 'Drivetrain efficiency', value: '95 %', status: 'estimated', source: 'Held at the 95 % EV bound and not fitted to any trap. Residuals at 1-ft rollout: quarter mile 8.24 s against the 2023 record 8.25 s (no trap published); against the 2021 Famoso drag-strip run 8.24 s @ 178.2 mph vs 8.582 s @ 167.51 mph, on standard tires in 37 °C air and 65 °C track — the trap gap is not converted into a driveline loss' },
    ],
  }),
};
