import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #28: 2020 BMW M340i xDrive (US). */
export const entry: CatalogEntry = {
  id: "2020-bmw-m340i-xdrive-us-sedan-awd-8at",
  roster: 28,
  section: "Luxury and sport sedans",
  make: "BMW",
  model: "M340i",
  trim: "xDrive",
  modelYear: 2020,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "G20",
  aliases: [
    "340i",
    "G20",
    "3 Series"
  ],
  origin: "Germany",
  usage: [
    "Sport Sedan",
    "Daily"
  ],
  drive: "AWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic",
  powertrain: "Petrol",
  engineLabel: "3.0 turbo I6 (B58)",
  modelPath: "Existing",
  factory: {
    power: "382 hp",
    torque: "369 lb-ft",
    curbMass: "3,968 lb",
    zeroTo60MphS: 4.1,
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2020 BMW M340i xDrive by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a32250088/2020-bmw-m340i-xdrive-by-the-numbers/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "BMW M340i xDrive technical data",
      publisher: "BMW Group PressClub",
      url: "https://www.press.bmwgroup.com/spain/article/attachment/T0302174ES/440751",
      kind: "manufacturer"
    },
    {
      id: "src3",
      title: "2020 BMW M340i (Car and Driver long-term, syndicated)",
      publisher: "Car and Driver (Yahoo syndication)",
      url: "https://news.yahoo.com/2020-bmw-m340i-good-engine-131100555.html",
      kind: "road-test"
    },
    {
      id: "src4",
      title: "2020 BMW M340i specs",
      publisher: "Cars.com",
      url: "https://www.cars.com/research/bmw-m340-2020/specs/406020",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "cd-rwd",
      sourceId: "src3",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 3.8,
        quarterMileS: 12.3,
        quarterMileTrapMph: 114
      },
      conditions: {},
      match: "equivalent",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2020",
      deviation: "Rear-wheel-drive M340i (the linked xDrive test page was not reachable); xDrive is heavier but launches harder."
    }
  ],
  dataGaps: [
    "Car and Driver M340i xDrive results (linked page)",
    "Power/torque rpm bands (recalled)",
    "Tire size (18-inch staggered assumed)",
    "US top-speed governor",
    "Drag coefficient (published by BMW; not reachable)"
  ],
  sim: buildSpec({
  id: "2020-bmw-m340i-xdrive-us-sedan-awd-8at",
  make: "BMW",
  model: "M340i",
  trim: "xDrive",
  modelYear: 2020,
  market: "US",
  body: "Sedan",
  shortName: "BMW M340i xDrive"
}, {
    engine: {
      code: 'B58B30O1', description: '3.0 L turbo I6', displacementCc: 2998, aspiration: 'turbo',
      idleRpm: 650, redlineRpm: 7000, revLimitRpm: 7000,
      power: { value: 382, unit: 'hp', rpm: [5800, 6500] },
      torque: { value: 369, unit: 'lb-ft', rpm: [1850, 5000] },
      peakBoostBar: 1.3, lowEndFraction: 0.6,
    },
    transmission: {
      type: 'torque-converter-automatic', name: '8-speed Steptronic Sport (ZF 8HP)',
      gearRatios: [5.25, 3.36, 2.172, 1.72, 1.316, 1.0, 0.822, 0.64], finalDrive: 2.813,
      upshiftTimeS: 0.22, downshiftTimeS: 0.3, shiftTorqueDip: 0.35, torqueConverter: { stallRpm: 2400 },
    },
    drivetrain: { layout: 'AWD', efficiency: 0.85, description: 'xDrive (rear-biased, electronically controlled clutch)', frontShareRange: [0, 0.6] },
    chassis: { curbMassKg: 1800, frontWeightFraction: 0.53, wheelbaseM: 2.851, lengthMm: 4709, widthMm: 1827, heightMm: 1442 },
    aero: { dragCoefficient: 0.27 },
    tires: { sizes: [staggered('r18', '225/40 R18 F · 255/35 R18 R', { widthMm: 225, aspectPct: 40, rimIn: 18 }, { widthMm: 255, aspectPct: 35, rimIn: 18 }, 'M Sport 18-inch (assumed)'), staggered('r19', '225/40 R19 F · 255/35 R19 R', { widthMm: 225, aspectPct: 40, rimIn: 19 }, { widthMm: 255, aspectPct: 35, rimIn: 19 }, 'Optional 19-inch')], compound: 'oe-performance' },
    speedLimiterKmh: 250,
    factory: { zeroTo60MphS: 4.1 },
    provenance: [
      { parameter: 'Drivetrain efficiency', value: '85 %', status: 'estimated', source: 'Typical modern AWD ZF 8-speed; not fitted (only an RWD-car benchmark is available)' },
      { parameter: 'Peak power', value: '382 hp (US)', status: 'reported', source: 'BMW US rating; reviews', url: 'https://www.cars.com/research/bmw-m340-2020/specs/406020' },
      { parameter: 'Peak torque', value: '369 lb-ft (500 Nm)', status: 'reported', source: 'BMW US rating; reviews' },
      { parameter: 'Power / torque bands', value: '5,800–6,500 / 1,850–5,000 rpm', status: 'estimated', source: 'Recalled BMW figures; not verified' },
      { parameter: 'Gear ratios', value: '5.250/3.360/2.172/1.720/1.316/1.000/0.822/0.640', status: 'verified', source: 'BMW press kit technical data', url: 'https://www.press.bmwgroup.com/spain/article/attachment/T0302174ES/440751' },
      { parameter: 'Final drive', value: '2.813', status: 'verified', source: 'BMW press kit technical data', url: 'https://www.press.bmwgroup.com/spain/article/attachment/T0302174ES/440751' },
      { parameter: 'Curb mass', value: '3,968 lb (1,800 kg)', status: 'reported', source: 'Cars.com; Edmunds', url: 'https://www.cars.com/research/bmw-m340-2020/specs/406020' },
      { parameter: 'Drag coefficient', value: 'Cd 0.27', status: 'estimated', source: 'BMW quotes ≈0.26–0.27 for the G20; exact M340i figure not reachable' },
      { parameter: 'Speed limiter', value: '250 km/h (155 mph)', status: 'estimated', source: 'Electronic limiter with performance tires; US default may be 130 mph' },
    ],
  }),
};
