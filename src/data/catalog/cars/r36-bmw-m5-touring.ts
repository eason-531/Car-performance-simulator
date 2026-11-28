import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Fitted to the Car and Driver test (1-ft rollout). */
const GRIP = 0.82;
const EFF = 0.94;


/** Roster #36: 2025 BMW M5 Touring M5 Touring (US). */
export const entry: CatalogEntry = {
  id: "2025-bmw-m5-touring-us-wagon-awd-8at",
  roster: 36,
  section: "Wagons",
  make: "BMW",
  model: "M5 Touring",
  trim: "M5 Touring",
  modelYear: 2025,
  market: "US",
  body: "Wagon",
  bodyLabel: "Wagon (Touring)",
  chassisCode: "G99",
  aliases: [
    "M5 Touring",
    "G99"
  ],
  origin: "Germany",
  usage: [
    "Wagon",
    "Grand Tourer",
    "Luxury"
  ],
  drive: "AWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic with integrated motor",
  powertrain: "Plug-in hybrid",
  engineLabel: "4.4 twin-turbo V8 (S68) + motor",
  modelPath: "Hybrid",
  factory: {
    power: "717 hp (system)",
    torque: "738 lb-ft (system)",
    curbMass: "5,530 lb (Motor1 listing)",
    sourceId: "src3"
  },
  sources: [
    {
      id: "test",
      title: "2025 BMW M5 Touring test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a69239467/2025-bmw-m5-touring-test/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "BMW M5 Touring",
      publisher: "FastestLaps (quoting the Car and Driver spec box)",
      url: "https://fastestlaps.com/models/bmw-m5-touring-g99",
      kind: "reference"
    },
    {
      id: "src3",
      title: "2025 BMW M5 Touring review",
      publisher: "Motor1",
      url: "https://www.motor1.com/reviews/769433/2025-bmw-m5-touring-review/",
      kind: "reference"
    },
    {
      id: "src4",
      title: "2025 BMW M5 Touring vs Audi RS 6 Avant track test",
      publisher: "Edmunds",
      url: "https://edmunds.com/car-news/2025-bmw-m5-touring-audi-rs6-avant-track-test-feature.html",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src2",
      publication: "Car and Driver (as quoted by FastestLaps)",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 3.1,
        quarterMileS: 11.0,
        quarterMileTrapMph: 129
      },
      conditions: {
        testMass: "5,481 lb"
      },
      match: "exact",
      verification: "Second-hand citation; the original page was not reachable.",
      date: "2025"
    },
    {
      id: "edmunds",
      sourceId: "src4",
      publication: "Edmunds",
      timing: "standing-start",
      timingNote: "Edmunds times from a standstill (\"zero should mean zero\"), no rollout.",
      results: {
        zeroTo60MphS: 3.4,
        quarterMileS: 11.3,
        quarterMileTrapMph: 124.7
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2025"
    }
  ],
  dataGaps: [
    "Car and Driver original page",
    "Hybrid system power split and battery limits",
    "8-speed ratios and final drive",
    "Tire size",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "2025-bmw-m5-touring-us-wagon-awd-8at",
  make: "BMW",
  model: "M5 Touring",
  trim: "M5 Touring",
  modelYear: 2025,
  market: "US",
  body: "Wagon",
  shortName: "BMW M5 Touring"
}, {
    engine: { code: 'S68', description: '4.4 L twin-turbo V8', displacementCc: 4395, aspiration: 'twin-turbo', idleRpm: 650, redlineRpm: 7200, revLimitRpm: 7300, power: { value: 577, unit: 'hp', rpm: [5600, 6500] }, torque: { value: 553, unit: 'lb-ft', rpm: [1800, 5400] }, peakBoostBar: 1.5 },
    transmission: { type: 'torque-converter-automatic', name: '8-speed M Steptronic with integrated motor', gearRatios: [5.0, 3.2, 2.143, 1.72, 1.314, 1.0, 0.822, 0.64], finalDrive: 3.15, upshiftTimeS: 0.25 },
    drivetrain: { layout: 'AWD', efficiency: EFF, frontShareRange: [0, 0.5], description: 'M xDrive, rear-biased with a multi-plate front clutch' },
    chassis: { curbMassKg: 2486, frontWeightFraction: 0.51, wheelbaseM: 3.006, lengthMm: 5096, widthMm: 1970, heightMm: 1516 },
    aero: {},
    tires: { sizes: [staggered('r20r21', '285/40 R20 front, 295/35 R21 rear', { widthMm: 285, aspectPct: 40, rimIn: 20 }, { widthMm: 295, aspectPct: 35, rimIn: 21 }, 'Assumed standard fitment')], compound: 'uhp', gripScale: GRIP },
    speedLimiterKmh: 250,
    factory: {},
    hybrid: { description: 'P2 motor integrated in the 8-speed automatic', inputMotor: { peakPowerKw: 145, peakTorqueNm: 450, maxRpm: 7300 }, systemPowerKw: 535, batteryPowerKw: 145 },
    provenance: [
      { parameter: 'System output', value: '717 hp (535 kW), 738 lb-ft', status: 'reported', source: 'BMW system rating as transcribed in this entry (Motor1)' },
      { parameter: 'Peak power', value: 'Engine 577 hp @ 5,600–6,500 rpm (system rating in the row above)', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate)' },
      { parameter: 'Peak torque', value: 'Engine 553 lb-ft @ 1,800–5,400 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate)' },
      { parameter: 'Hybrid motor', value: 'P2 motor 145 kW, 450 Nm at the gearbox input; battery limit 145 kW; system limit 535 kW', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate). Hybrid model: full deployment on demand within the battery and system limits; charge state, temperature, regeneration and the manufacturer deployment strategy are not modelled' },
      { parameter: 'Gear ratios', value: '5.000/3.200/2.143/1.720/1.314/1.000/0.822/0.640, final drive 3.15', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate)' },
      { parameter: 'Curb mass', value: '2,486 kg (5,481 lb Car and Driver test mass); Motor1 lists 5,530 lb', status: 'reported', source: 'Car and Driver test mass as quoted by FastestLaps, transcribed in this entry' },
      { parameter: 'Weight distribution', value: '51 % front', status: 'estimated', source: 'Not published' },
      { parameter: 'AWD split', value: 'Front share 0–50 %', status: 'estimated', source: 'M xDrive is rear-biased; the range is not published' },
      { parameter: 'Tire size', value: '285/40 R20 front, 295/35 R21 rear', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate)' },
      { parameter: 'Dimensions', value: '5,096 × 1,970 × 1,516 mm, WB 3,006 mm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate)' },
      { parameter: 'Speed limiter', value: '250 km/h', status: 'estimated', source: 'Standard governed speed; the M Driver\'s Package limit is not modelled' },
      { parameter: 'Tire grip calibration', value: `×${GRIP}`, status: 'estimated', source: 'Fitted to the Car and Driver 0–60 mph 3.1 s (1-ft rollout): sim 3.09 s, ¼ mile 11.09 s @ 128.4 mph (C/D 11.0 @ 129). Brake-release 3.36 s / 11.36 s against Edmunds\' standing-start 3.4 s / 11.3 s @ 124.7 mph' },
      { parameter: 'Drivetrain efficiency', value: `${Math.round(EFF * 1000) / 10} %`, status: 'estimated', source: 'Fitted to the Car and Driver ¼-mile trap 129 mph. At the 94 % ceiling for a geared driveline (implausibly high for a converter AWD): the rated 717 hp with the assumed split under-delivers against the test, so read it as a lumped calibration (sim 3.09 s, 11.09 s @ 128.4 mph rollout)' },
    ],
  }),
};
