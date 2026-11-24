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
    },
    {
      id: "src-nissan-brochure",
      title: "2023 Nissan Z brochure",
      publisher: "Nissan USA",
      url: "https://www.nissanusa.com/content/dam/Nissan/us/vehicle-brochures/2023/2023-nissan-nissan-z-brochure-en.pdf",
      kind: "manufacturer",
      date: "2023"
    },
    {
      id: "src-mt-method",
      title: "How MotorTrend tests cars",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/news/motor-trend-testing",
      kind: "reference"
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
        rolloutS: 0.3,
        topSpeedMph: 155,
        topSpeedNote: "governed limit, Car and Driver estimate; not measured and not confirmed by a Nissan US document"
      },
      conditions: {
        testMass: "3,592 lb as tested",
        fuel: "91 AKI",
        tires: "Bridgestone Potenza S007, 255/40R-19 F / 275/35R-19 R (test car, as listed by Car and Driver)"
      },
      match: "exact",
      date: "2023",
      verification: "Original Car and Driver instrumented test of the Performance nine-speed automatic, as identified in the Codex inspection of d6e2b40 (2026-11-24). Replaces a row that cited the Mach 1 comparison, whose Z was a six-speed manual (4.5 s, 13.0 s @ 111 mph) and did not support the 4.0 s / 12.3 s @ 116 mph shown before. Production calibration reference; sorts ahead of the equivalent MotorTrend run. Governed top speed and test-car tires added per the Codex inspection of 358661b (2026-11-24)."
    },
    {
      id: "mt-first-test",
      sourceId: "test",
      publication: "MotorTrend",
      timing: "rollout-1ft",
      timingNote: "MotorTrend subtracts a 1-ft rollout from its acceleration times (see its published testing procedure).",
      results: {
        zeroTo60MphS: 4.3,
        quarterMileS: 12.9,
        quarterMileTrapMph: 107.6
      },
      conditions: {
        testMass: "3,597 lb as tested, 57/43 front/rear",
        fuel: "91-octane pump fuel, no octane booster",
        other: [
          "Knock / low-power warning reported after the initial runs"
        ]
      },
      match: "equivalent",
      deviation: "Preproduction Performance 9AT test car. The engine reported a knock / low-power warning after the initial runs, so its runs may not represent production output.",
      verification: "MotorTrend first test, transcribed per the Codex inspection of 358661b (2026-11-24). Kept separate from the exact Car and Driver row, which stays the calibration and sort reference. The two published traps (115 and 107.6 mph) bracket the simulation's ≈112.6 mph, so the trap residual is shown as uncertainty, not as evidence of a power cause."
    }
  ],
  dataGaps: [
    "Drag coefficient",
    "Production speed limiter (Car and Driver lists a governed 155 mph estimate; no Nissan US document confirms it, so none is modelled)"
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
    engine: { code: 'VR30DDTT', description: '3.0 L twin-turbo V6', displacementCc: 2997, aspiration: 'twin-turbo', idleRpm: 650, redlineRpm: 7000, revLimitRpm: 7000, power: { value: 400, unit: 'hp', rpm: [6400, 6400] }, torque: { value: 350, unit: 'lb-ft', rpm: [1600, 5600] }, peakBoostBar: 1.1, lowEndFraction: 0.55 },
    transmission: { type: 'torque-converter-automatic', name: '9-speed automatic', gearRatios: [5.425, 3.263, 2.25, 1.649, 1.221, 1.0, 0.862, 0.713, 0.597], finalDrive: 3.133, torqueConverter: { stallRpm: 2400 } },
    drivetrain: { layout: 'RWD', efficiency: 0.88, description: 'Rear-wheel drive with mechanical limited-slip differential' },
    chassis: { curbMassKg: 1634, frontWeightFraction: 0.55, cgHeightM: 0.47, wheelbaseM: 2.55, lengthMm: 4379, widthMm: 1844, heightMm: 1316 },
    aero: {},
    tires: { sizes: [staggered('r19', '255/40 R19 F · 275/35 R19 R', { widthMm: 255, aspectPct: 40, rimIn: 19 }, { widthMm: 275, aspectPct: 35, rimIn: 19 }, 'Performance 19-in fitment (Nissan US)')], compound: 'oe-performance', gripScale: 1.22 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.22', status: 'estimated', source: 'Fitted to the Car and Driver 9AT 0–60 mph 4.3 s (1-ft rollout) with efficiency held at the automatic bound' },
      { parameter: 'Drivetrain efficiency', value: '88 %', status: 'estimated', source: 'Held at the 88 % automatic bound. The Car and Driver trap (115 mph) sits above the simulation and the equivalent MotorTrend preproduction trap (107.6 mph, after a knock / low-power warning) sits below it, so the trap residual is uncertainty between tests; no cause is attributed' },
      { parameter: 'Gear ratios', value: '5.425/3.263/2.250/1.649/1.221/1.000/0.862/0.713/0.597', status: 'verified', source: 'Nissan US MY2023 specifications (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://zcca.org/wp-content/uploads/2025/10/Specifications-2023-Nissan-Z.pdf' },
      { parameter: 'Final drive', value: '3.133', status: 'verified', source: 'Nissan US MY2023 specifications (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://zcca.org/wp-content/uploads/2025/10/Specifications-2023-Nissan-Z.pdf' },
      { parameter: 'Peak power', value: '400 hp', status: 'reported', source: 'Nissan rating', url: 'https://www.autoblog.com/2022/07/14/2023-nissan-z-road-test/' },
      { parameter: 'Peak torque', value: '350 lb-ft', status: 'reported', source: 'Nissan rating', url: 'https://www.autoblog.com/2022/07/14/2023-nissan-z-road-test/' },
      { parameter: 'Power / torque rpm', value: '6,400 / 1,600–5,600 rpm', status: 'reported', source: 'Nissan US brochure and Nissan press-kit specifications (retrieved via search summaries here; the 1,600–5,200 rpm torque band used before was a recalled figure)', url: 'https://www.nissanusa.com/content/dam/Nissan/us/vehicle-brochures/2023/2023-nissan-nissan-z-brochure-en.pdf' },
      { parameter: 'Curb mass', value: '3,602 lb (1,634 kg), Performance automatic', status: 'reported', source: 'Review specification', url: 'https://thedetroitbureau.com/reviews/a-week-with-2023-nissan-z-performance-a-t/' },
      { parameter: 'Tire size', value: '255/40 R19 F, 275/35 R19 R', status: 'reported', source: 'Nissan US Performance 19-in fitment (brochure / MY2023 specifications); the Car and Driver test car ran Bridgestone Potenza S007 in these sizes', url: 'https://www.nissanusa.com/content/dam/Nissan/us/vehicle-brochures/2023/2023-nissan-nissan-z-brochure-en.pdf' },
      { parameter: 'Speed limiter', value: 'None modelled (uncapped prediction)', status: 'estimated', source: 'Car and Driver lists a governed 155 mph (its estimate) for the test car; the production US limiter is not confirmed by a reachable Nissan document, so it is not substituted. The simulated top speed is an uncapped gearing/drag prediction, not a stock figure' },
    ],
  }),
};
