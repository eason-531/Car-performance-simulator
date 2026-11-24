import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #44: 2023 Nissan Z Performance 9AT (US). */
export const entry: CatalogEntry = {
  id: "2023-nissan-z-performance-9at-us-coupe-rwd-9at",
  roster: 44,
  section: "Sports cars",
  make: "Nissan",
  model: "Z",
  trim: "Performance 9AT",
  modelYear: 2023,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "RZ34",
  aliases: [
    "400Z",
    "Fairlady Z",
    "RZ34"
  ],
  origin: "Japan",
  usage: [
    "Sports Car",
    "Grand Tourer"
  ],
  drive: "RWD",
  transmission: "AT",
  transmissionLabel: "9-speed automatic",
  powertrain: "Petrol",
  engineLabel: "3.0 twin-turbo V6 (VR30DDTT)",
  modelPath: "Existing",
  factory: {
    power: "400 hp",
    torque: "350 lb-ft",
    curbMass: "3,602 lb (Performance A/T)",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2023 Nissan Z Performance first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2023-nissan-z-performance-first-test-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2023 Nissan Z road test",
      publisher: "Autoblog",
      url: "https://www.autoblog.com/2022/07/14/2023-nissan-z-road-test/",
      kind: "reference"
    },
    {
      id: "src3",
      title: "A week with the 2023 Nissan Z Performance A/T",
      publisher: "The Detroit Bureau",
      url: "https://thedetroitbureau.com/reviews/a-week-with-2023-nissan-z-performance-a-t/",
      kind: "reference"
    },
    {
      id: "src-nissan",
      title: "2023 Nissan Z specifications",
      publisher: "Nissan (mirror)",
      url: "https://zcca.org/wp-content/uploads/2025/10/Specifications-2023-Nissan-Z.pdf",
      kind: "manufacturer"
    },
    {
      id: "src-cd-at",
      title: "2023 Nissan Z automatic by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a43987884/2023-nissan-z-automatic-by-the-numbers/",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "cd-at",
      sourceId: "src-cd-at",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 4.3,
        quarterMileS: 12.7,
        quarterMileTrapMph: 115,
        rolloutS: 0.3
      },
      conditions: {
        testMass: "3,592 lb as tested",
        fuel: "91 AKI"
      },
      match: "exact",
      date: "2023",
      verification: "Original Car and Driver instrumented test of the Performance nine-speed automatic, as identified in the Codex inspection of d6e2b40 (2026-11-24). Replaces a row that cited the Mach 1 comparison, whose Z was a six-speed manual (4.5 s, 13.0 s @ 111 mph) and did not support the 4.0 s / 12.3 s @ 116 mph shown before."
    }
  ],
  dataGaps: [
    "Power/torque rpm",
    "Tire size",
    "Drag coefficient",
    "MotorTrend Performance 9AT first-test figures (roster source; not transcribed)"
  ],
  sim: buildSpec({
  id: "2023-nissan-z-performance-9at-us-coupe-rwd-9at",
  make: "Nissan",
  model: "Z",
  trim: "Performance 9AT",
  modelYear: 2023,
  market: "US",
  body: "Coupe",
  shortName: "Nissan Z Performance 9AT"
}, {
    engine: { code: 'VR30DDTT', description: '3.0 L twin-turbo V6', displacementCc: 2997, aspiration: 'twin-turbo', idleRpm: 650, redlineRpm: 7000, revLimitRpm: 7000, power: { value: 400, unit: 'hp', rpm: [6400, 6400] }, torque: { value: 350, unit: 'lb-ft', rpm: [1600, 5200] }, peakBoostBar: 1.1, lowEndFraction: 0.55 },
    transmission: { type: 'torque-converter-automatic', name: '9-speed automatic', gearRatios: [5.425, 3.263, 2.25, 1.649, 1.221, 1.0, 0.862, 0.713, 0.597], finalDrive: 3.133, torqueConverter: { stallRpm: 2400 } },
    drivetrain: { layout: 'RWD', efficiency: 0.88, description: 'Rear-wheel drive with mechanical limited-slip differential' },
    chassis: { curbMassKg: 1634, frontWeightFraction: 0.55, cgHeightM: 0.47, wheelbaseM: 2.55, lengthMm: 4379, widthMm: 1844, heightMm: 1316 },
    aero: {},
    tires: { sizes: [staggered('r19', '255/40 R19 F · 275/35 R19 R', { widthMm: 255, aspectPct: 40, rimIn: 19 }, { widthMm: 275, aspectPct: 35, rimIn: 19 }, 'Performance fitment (assumed)')], compound: 'oe-performance', gripScale: 1.22 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.22', status: 'estimated', source: 'Fitted to the Car and Driver 9AT 0–60 mph 4.3 s (1-ft rollout) with efficiency held at the automatic bound' },
      { parameter: 'Drivetrain efficiency', value: '88 %', status: 'estimated', source: 'A fit to the Car and Driver 9AT trap 115 mph asked for more than 92 %, above the 88 % automatic bound (the VR30 is widely reported to exceed its rating); held at the bound, ≈−2.4 mph trap residual left visible' },
      { parameter: 'Gear ratios', value: '5.425/3.263/2.250/1.649/1.221/1.000/0.862/0.713/0.597', status: 'verified', source: 'Nissan US MY2023 specifications (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://zcca.org/wp-content/uploads/2025/10/Specifications-2023-Nissan-Z.pdf' },
      { parameter: 'Final drive', value: '3.133', status: 'verified', source: 'Nissan US MY2023 specifications (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://zcca.org/wp-content/uploads/2025/10/Specifications-2023-Nissan-Z.pdf' },
      { parameter: 'Peak power', value: '400 hp', status: 'reported', source: 'Nissan rating', url: 'https://www.autoblog.com/2022/07/14/2023-nissan-z-road-test/' },
      { parameter: 'Peak torque', value: '350 lb-ft', status: 'reported', source: 'Nissan rating', url: 'https://www.autoblog.com/2022/07/14/2023-nissan-z-road-test/' },
      { parameter: 'Power / torque rpm', value: '6,400 / 1,600–5,200 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '3,602 lb (1,634 kg), Performance automatic', status: 'reported', source: 'Review specification', url: 'https://thedetroitbureau.com/reviews/a-week-with-2023-nissan-z-performance-a-t/' },
      { parameter: 'Tire size', value: '255/40 R19 F, 275/35 R19 R', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
