import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #22: 2018 Kia Stinger GT2 3.3T AWD (US). */
export const entry: CatalogEntry = {
  id: "2018-kia-stinger-gt2-3-3t-awd-us-liftback-awd-8at",
  roster: 22,
  section: "Luxury and sport sedans",
  make: "Kia",
  model: "Stinger",
  trim: "GT2 3.3T AWD",
  modelYear: 2018,
  market: "US",
  body: "Liftback",
  bodyLabel: "Liftback",
  chassisCode: "CK",
  aliases: [
    "Stinger GT",
    "CK"
  ],
  origin: "South Korea",
  usage: [
    "Sport Sedan",
    "Grand Tourer"
  ],
  drive: "AWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic",
  powertrain: "Petrol",
  engineLabel: "3.3 twin-turbo V6 (Lambda II)",
  modelPath: "Existing",
  factory: {
    power: "365 hp @ 6,000 rpm",
    torque: "376 lb-ft @ 1,300–4,500 rpm",
    curbMass: "4,023 lb (GT2 listing)",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2018 Kia Stinger GT 3.3T AWD test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15078969/2018-kia-stinger-gt-33t-awd-test-review/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2020 Kia Stinger specifications",
      publisher: "Kia Media (US)",
      url: "https://kiamedia.com/us/es/models/stinger/2020/specifications",
      kind: "manufacturer"
    },
    {
      id: "src3",
      title: "2018 Kia Stinger GT 3.3T AWD test (syndicated)",
      publisher: "Car and Driver (Yahoo syndication)",
      url: "https://autos.yahoo.com/2018-kia-stinger-gt-3-180500168.html",
      kind: "road-test"
    },
    {
      id: "src4",
      title: "Track test: 2018 Kia Stinger GT",
      publisher: "MotorWeek",
      url: "https://motorweek.org/reviews/road_tests/2018-kia-stinger-gt",
      kind: "road-test"
    },
    {
      id: "src5",
      title: "2022 Kia Stinger GT2 specs",
      publisher: "Cars.com",
      url: "https://www.cars.com/research/kia-stinger-2022/specs/419584",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src3",
      publication: "Car and Driver",
      timing: "unconfirmed",
      timingNote: "Car and Driver test published before its late-2019 move to a 1-ft rollout; the earlier procedure is not confirmed here, so both simulator bases are shown.",
      results: {
        zeroTo60MphS: 4.6,
        zeroTo100MphS: 11.3,
        quarterMileS: 13.2,
        quarterMileTrapMph: 108
      },
      conditions: {
        other: [
          "Rolling 5–60 mph: 5.3 s"
        ]
      },
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2018"
    },
    {
      id: "motorweek",
      sourceId: "src4",
      publication: "MotorWeek",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 4.5,
        quarterMileS: 13.1,
        quarterMileTrapMph: 108
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2018"
    }
  ],
  dataGaps: [
    "Exact trim of the Car and Driver test car (GT vs GT2)",
    "Curb mass of the 2018 car (2022 GT2 figure used)",
    "Drag coefficient",
    "AWD torque-split limits"
  ],
  sim: buildSpec({
  id: "2018-kia-stinger-gt2-3-3t-awd-us-liftback-awd-8at",
  make: "Kia",
  model: "Stinger",
  trim: "GT2 3.3T AWD",
  modelYear: 2018,
  market: "US",
  body: "Liftback",
  shortName: "Kia Stinger GT2 AWD"
}, {
    engine: {
      code: 'Lambda II 3.3 T-GDi', description: '3.3 L twin-turbo V6', displacementCc: 3342, aspiration: 'twin-turbo',
      idleRpm: 650, redlineRpm: 6250, revLimitRpm: 6500,
      power: { value: 365, unit: 'hp', rpm: [6000, 6000] },
      torque: { value: 376, unit: 'lb-ft', rpm: [1300, 4500] },
      peakBoostBar: 1.0, lowEndFraction: 0.55,
    },
    transmission: {
      type: 'torque-converter-automatic', name: '8-speed automatic',
      gearRatios: [3.665, 2.396, 1.61, 1.19, 1.0, 0.826, 0.643, 0.556], finalDrive: 3.538,
      torqueConverter: { stallRpm: 2300 },
    },
    drivetrain: { layout: 'AWD', efficiency: 0.84, description: 'Rear-biased AWD with dynamic torque vectoring', frontShareRange: [0, 0.5] },
    chassis: { curbMassKg: 1825, frontWeightFraction: 0.53, wheelbaseM: 2.905, lengthMm: 4830, widthMm: 1870, heightMm: 1400 },
    aero: {},
    tires: { sizes: [staggered('r19', '225/40 R19 F · 255/35 R19 R', { widthMm: 225, aspectPct: 40, rimIn: 19 }, { widthMm: 255, aspectPct: 35, rimIn: 19 }, 'GT fitment')], compound: 'oe-performance' },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Drivetrain efficiency', value: '84 %', status: 'estimated', source: 'Typical AWD automatic; a trap-speed fit (87 %) would make 0–60 and ET too quick, so the published trap residual (≈−2 mph) is left visible' },
      { parameter: 'Peak power', value: '365 hp @ 6,000 rpm', status: 'reported', source: 'Kia US specifications', url: 'https://kiamedia.com/us/es/models/stinger/2020/specifications' },
      { parameter: 'Peak torque', value: '376 lb-ft @ 1,300–4,500 rpm', status: 'reported', source: 'Kia US specifications', url: 'https://kiamedia.com/us/es/models/stinger/2020/specifications' },
      { parameter: 'Gear ratios', value: '3.665/2.396/1.610/1.190/1.000/0.826/0.643/0.556', status: 'reported', source: 'Kia US spec sheet (1st, 7th, 8th); auto123 (2nd–6th, rounded)', url: 'https://kiamedia.com/us/es/models/stinger/2020/specifications' },
      { parameter: 'Final drive', value: '3.538', status: 'verified', source: 'Kia US spec sheet for GT/GT1/GT2', url: 'https://kiamedia.com/us/es/models/stinger/2020/specifications' },
      { parameter: 'Curb mass', value: '4,023 lb (1,825 kg)', status: 'reported', source: 'Cars.com 2022 GT2 listing (2018 not found)', url: 'https://www.cars.com/research/kia-stinger-2022/specs/419584' },
      { parameter: 'Tire size', value: '225/40 R19 F, 255/35 R19 R', status: 'verified', source: 'Kia US spec sheet', url: 'https://kiamedia.com/us/es/models/stinger/2020/specifications' },
      { parameter: 'Dimensions', value: '4,830 × 1,870 × 1,400 mm, WB 2,905 mm', status: 'estimated', source: 'Recalled Kia figures; not verified' },
    ],
  }),
};
