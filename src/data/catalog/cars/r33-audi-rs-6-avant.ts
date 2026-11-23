import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #33: 2021 Audi RS 6 Avant RS 6 Avant (US). */
export const entry: CatalogEntry = {
  id: "2021-audi-rs-6-avant-us-wagon-awd-8at",
  roster: 33,
  section: "Wagons",
  make: "Audi",
  model: "RS 6 Avant",
  trim: "RS 6 Avant",
  modelYear: 2021,
  market: "US",
  body: "Wagon",
  bodyLabel: "Wagon (Avant)",
  chassisCode: "C8",
  aliases: [
    "RS6",
    "C8",
    "quattro"
  ],
  origin: "Germany",
  usage: [
    "Wagon",
    "Grand Tourer",
    "Luxury"
  ],
  drive: "AWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic",
  powertrain: "Petrol",
  engineLabel: "4.0 twin-turbo V8 (EA825)",
  modelPath: "Existing",
  factory: {
    power: "591 hp",
    torque: "590 lb-ft",
    curbMass: "4,960 lb (CarBuzz); 4,575 lb (Motor1)",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2021 Audi RS6 Avant by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a34631077/2021-audi-rs6-avant-by-the-numbers/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "RS 6 0–60 times",
      publisher: "0-60specs",
      url: "https://www.0-60specs.com/audi/rs-6-0-60-times",
      kind: "reference"
    },
    {
      id: "src3",
      title: "Tested: 2021 Audi RS 6 is one fast wagon",
      publisher: "Edmunds",
      url: "https://edmunds.com/car-news/tested-2021-audi-rs-6-is-one-fast-wagon.html",
      kind: "road-test"
    },
    {
      id: "src4",
      title: "2021 Audi RS6 Avant",
      publisher: "CarBuzz",
      url: "https://carbuzz.com/cars/audi/rs6/2021",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "cd-agg",
      sourceId: "src2",
      publication: "Car and Driver (as listed by 0-60specs)",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 3.1,
        quarterMileS: 11.5,
        quarterMileTrapMph: 120
      },
      conditions: {
        testMass: "5,031 lb test car (per a Car and Driver-sourced description)"
      },
      match: "exact",
      verification: "Aggregator listing that attributes the run to the publication; original page not reachable.",
      date: "2020"
    },
    {
      id: "edmunds",
      sourceId: "src3",
      publication: "Edmunds",
      timing: "standing-start",
      timingNote: "Edmunds times from a standstill (\"zero should mean zero\"), no rollout.",
      results: {
        zeroTo60MphS: 3.3,
        quarterMileS: 11.4,
        quarterMileTrapMph: 118.6
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2020"
    }
  ],
  dataGaps: [
    "Car and Driver page itself",
    "Curb mass definition (sources span 4,575–4,960 lb)",
    "8-speed ratios and final drive",
    "Tire size",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "2021-audi-rs-6-avant-us-wagon-awd-8at",
  make: "Audi",
  model: "RS 6 Avant",
  trim: "RS 6 Avant",
  modelYear: 2021,
  market: "US",
  body: "Wagon",
  shortName: "Audi RS 6 Avant"
}, {
    engine: { code: 'EA825 (DJPB)', description: '4.0 TFSI twin-turbo V8, mild hybrid', displacementCc: 3996, aspiration: 'twin-turbo', idleRpm: 650, redlineRpm: 6800, revLimitRpm: 6900, power: { value: 591, unit: 'hp', rpm: [6000, 6250] }, torque: { value: 590, unit: 'lb-ft', rpm: [2050, 4500] }, peakBoostBar: 1.4, lowEndFraction: 0.55 },
    transmission: { type: 'torque-converter-automatic', name: '8-speed Tiptronic (ZF 8HP)', gearRatios: [4.714, 3.143, 2.106, 1.667, 1.285, 1.0, 0.839, 0.667], finalDrive: 3.204, upshiftTimeS: 0.22, shiftTorqueDip: 0.32, torqueConverter: { stallRpm: 2400 } },
    drivetrain: { layout: 'AWD', efficiency: 0.874, description: 'quattro with self-locking centre differential (nominal 40:60)', frontShareRange: [0.15, 0.7] },
    chassis: { curbMassKg: 2250, frontWeightFraction: 0.57, wheelbaseM: 2.927, lengthMm: 4995, widthMm: 1951, heightMm: 1460 },
    aero: {},
    tires: { sizes: [square('r21', '275/35 R21', 275, 35, 21, 'Standard US fitment (assumed)'), square('r22', '285/30 R22', 285, 30, 22, 'Optional 22-inch')], compound: 'uhp', gripScale: 1.04 },
    speedLimiterKmh: 250,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.04', status: 'estimated', source: 'Fitted to the Car and Driver 0–60 mph 3.1 s (1-ft rollout)' },
      { parameter: 'Drivetrain efficiency', value: '87.4 %', status: 'estimated', source: 'Fitted to the Car and Driver ¼-mile trap 120 mph' },
      { parameter: 'Peak power', value: '591 hp', status: 'reported', source: 'Audi rating (multiple sources)', url: 'https://www.motor1.com/reviews/493416/2021-audi-rs6-avant-review/' },
      { parameter: 'Peak torque', value: '590 lb-ft', status: 'reported', source: 'Audi rating (multiple sources)', url: 'https://www.motor1.com/reviews/493416/2021-audi-rs6-avant-review/' },
      { parameter: 'Power / torque bands', value: '6,000–6,250 / 2,050–4,500 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Gear ratios', value: '4.714/3.143/2.106/1.667/1.285/1.000/0.839/0.667 (ZF 8HP)', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Final drive', value: '3.204', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '4,960 lb (2,250 kg); Motor1 lists 4,575 lb, Car and Driver test car 5,031 lb', status: 'reported', source: 'CarBuzz specification listing', url: 'https://carbuzz.com/cars/audi/rs6/2021' },
      { parameter: 'Tire size', value: '275/35 R21', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
