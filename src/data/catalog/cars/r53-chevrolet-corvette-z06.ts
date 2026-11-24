import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #53: 2023 Chevrolet Corvette Z06 Z07 + Carbon Fiber Aero (US). */
export const entry: CatalogEntry = {
  id: "2023-chevrolet-corvette-z06-z07-carbon-fiber-aero-us-coupe-rwd-8dct",
  roster: 53,
  section: "American performance",
  make: "Chevrolet",
  model: "Corvette Z06",
  trim: "Z07 + Carbon Fiber Aero",
  modelYear: 2023,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "C8",
  aliases: [
    "Z06",
    "Z07",
    "C8",
    "Vette"
  ],
  origin: "United States",
  usage: [
    "Sports Car",
    "Track",
    "Supercar"
  ],
  drive: "RWD",
  transmission: "DCT",
  transmissionLabel: "8-speed DCT",
  powertrain: "Petrol",
  engineLabel: "5.5 flat-plane V8 (LT6)",
  modelPath: "Existing",
  factory: {
    power: "670 hp @ 8,400 rpm",
    torque: "460 lb-ft @ 6,300 rpm",
    zeroTo60MphS: 2.6,
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2023 Chevrolet Corvette Z06 Z07 tested",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2023-chevrolet-corvette-z06-coupe-z07-package-0-60-mph-time-quarter-mile",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "The 2023 C8 Corvette Z06 Does 0–60 MPH in 2.6 Seconds",
      publisher: "Car and Driver (syndicated on Yahoo)",
      url: "https://news.yahoo.com/2023-c8-corvette-z06-does-163800005.html",
      kind: "road-test"
    },
    {
      id: "src-chevy23",
      title: "2023 Corvette brochure",
      publisher: "Chevrolet",
      url: "https://s3.amazonaws.com/cdn.autoipacket.com/brochures/chevrolet/2023/chevrolet_2023_corvette.pdf",
      kind: "manufacturer"
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
        zeroTo60MphS: 2.6,
        quarterMileS: 10.5,
        quarterMileTrapMph: 131
      },
      conditions: {
        other: [
          "Z07 package"
        ]
      },
      match: "exact",
      verification: "Syndicated copy of the article (original page not reachable from this environment).",
      date: "2022"
    }
  ],
  dataGaps: [
    "Z06 gear ratios (assumed shared with Stingray)",
    "Curb mass",
    "Carbon Fiber Aero effect on mass",
    "Tire size",
    "Drag coefficient",
    "MotorTrend Z07 coupe test (package-specific; linked in the follow-up)"
  ],
  sim: buildSpec({
  id: "2023-chevrolet-corvette-z06-z07-carbon-fiber-aero-us-coupe-rwd-8dct",
  make: "Chevrolet",
  model: "Corvette Z06",
  trim: "Z07 + Carbon Fiber Aero",
  modelYear: 2023,
  market: "US",
  body: "Coupe",
  shortName: "Chevrolet Corvette Z06 Z07"
}, {
    engine: { code: 'LT6', description: '5.5 L flat-plane-crank DOHC V8', displacementCc: 5463, aspiration: 'na', idleRpm: 900, redlineRpm: 8600, revLimitRpm: 8600, power: { value: 670, unit: 'hp', rpm: [8400, 8400] }, torque: { value: 460, unit: 'lb-ft', rpm: [6300, 6300] }, lowEndFraction: 0.68 },
    transmission: { type: 'dual-clutch', name: 'Tremec TR-9080 8-speed DCT', gearRatios: [2.91, 1.76, 1.22, 0.88, 0.65, 0.51, 0.4, 0.33], finalDrive: 5.56, upshiftTimeS: 0.1, shiftTorqueDip: 0.12 },
    drivetrain: { layout: 'RWD', efficiency: 0.844, description: 'Rear-wheel drive, electronic limited-slip differential' },
    chassis: { curbMassKg: 1580, frontWeightFraction: 0.4, wheelbaseM: 2.722, lengthMm: 4685, widthMm: 2025, heightMm: 1226 },
    aero: {},
    tires: { sizes: [staggered('r20r21', '275/30 R20 F · 345/25 R21 R', { widthMm: 275, aspectPct: 30, rimIn: 20 }, { widthMm: 345, aspectPct: 25, rimIn: 21 }, 'Z07 fitment, Michelin Pilot Sport Cup 2 R (assumed)')], compound: 'semi-slick', gripScale: 1.3 },
    speedLimiterKmh: null,
    factory: { zeroTo60MphS: 2.6 },
    provenance: [
      { parameter: 'Final drive', value: '5.56 (Stingray Z51: 5.20 in the same brochure)', status: 'reported', source: 'Chevrolet MY2023 Corvette brochure (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://s3.amazonaws.com/cdn.autoipacket.com/brochures/chevrolet/2023/chevrolet_2023_corvette.pdf' },
      { parameter: 'Tire grip calibration', value: '×1.30 (fit bound)', status: 'estimated', source: 'Fit toward the Car and Driver 0–60 mph 2.6 s stopped at the 1.30 bound (sim 2.75 s); residual shown' },
      { parameter: 'Drivetrain efficiency', value: '84.4 %', status: 'estimated', source: 'Transferred from the Stingray fit (same TR-9080 transaxle); a trap fit asked for 80 %, likely absorbing the unmodelled drag of the Z07 aero, so it was not used' },
      { parameter: 'Peak power', value: '670 hp @ 8,400 rpm', status: 'reported', source: 'Chevrolet rating (multiple reviews)', url: 'https://www.thedrive.com/new-cars/2023-chevy-corvette-z06-review-c8-price-specs-driving-impressions-chevrolet' },
      { parameter: 'Peak torque', value: '460 lb-ft @ 6,300 rpm', status: 'reported', source: 'Chevrolet rating (multiple reviews)', url: 'https://www.thedrive.com/new-cars/2023-chevy-corvette-z06-review-c8-price-specs-driving-impressions-chevrolet' },
      { parameter: 'Gear ratios', value: '2.91/…/0.33 (Stingray TR-9080 set)', status: 'estimated', source: 'Assumed shared with the Stingray; Z06 application not confirmed — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '≈1,580 kg (3,480 lb)', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Tire size', value: '275/30 R20 F · 345/25 R21 R (Z07)', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Tire compound', value: 'Track semi-slick class', status: 'estimated', source: 'Z07 ships on Michelin Pilot Sport Cup 2 R (not verified here)' },
    ],
  }),
};
