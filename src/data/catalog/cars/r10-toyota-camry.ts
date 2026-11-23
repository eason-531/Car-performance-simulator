import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #10: 2020 Toyota Camry TRD V6 (US). */
export const entry: CatalogEntry = {
  id: "2020-toyota-camry-trd-v6-us-sedan-fwd-8at",
  roster: 10,
  section: "Daily and sport compacts",
  make: "Toyota",
  model: "Camry",
  trim: "TRD V6",
  modelYear: 2020,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "XV70",
  aliases: [
    "Camry TRD",
    "XV70"
  ],
  origin: "Japan",
  usage: [
    "Daily",
    "Sport Sedan"
  ],
  drive: "FWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic",
  powertrain: "Petrol",
  engineLabel: "3.5 V6 (2GR-FKS)",
  modelPath: "Existing",
  factory: {
    power: "301 hp @ 6,600 rpm",
    torque: "267 lb-ft @ 4,700 rpm",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2020 Toyota Camry TRD by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a30762981/2020-toyota-camry-trd-by-the-numbers/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2020 Toyota Camry and Avalon TRD road test",
      publisher: "MotorWeek",
      url: "https://motorweek.org/road_tests/2020-toyota-camry-and-avalon-trd-2",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "Toyota Camry 0–60 times",
      publisher: "0-60specs",
      url: "https://www.0-60specs.com/toyota-camry-0-60-times/",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "cd-agg",
      sourceId: "src3",
      publication: "Car and Driver (as listed by 0-60specs)",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 5.6,
        quarterMileS: 14.2,
        quarterMileTrapMph: 101
      },
      conditions: {},
      match: "exact",
      verification: "Aggregator listing that attributes the run to the publication; original page not reachable. Another source quotes 5.9 s, apparently the same run without rollout.",
      date: "2020"
    },
    {
      id: "motorweek",
      sourceId: "src2",
      publication: "MotorWeek",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        quarterMileS: 15.0,
        quarterMileTrapMph: 98
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2020"
    }
  ],
  dataGaps: [
    "Car and Driver page itself",
    "8-speed ratios and final drive",
    "Curb mass",
    "Tire size",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "2020-toyota-camry-trd-v6-us-sedan-fwd-8at",
  make: "Toyota",
  model: "Camry",
  trim: "TRD V6",
  modelYear: 2020,
  market: "US",
  body: "Sedan",
  shortName: "Toyota Camry TRD V6"
}, {
    engine: { code: '2GR-FKS', description: '3.5 L V6, D-4S', displacementCc: 3456, aspiration: 'na', idleRpm: 650, redlineRpm: 6800, revLimitRpm: 6900, power: { value: 301, unit: 'hp', rpm: [6600, 6600] }, torque: { value: 267, unit: 'lb-ft', rpm: [4700, 4700] }, lowEndFraction: 0.72 },
    transmission: { type: 'torque-converter-automatic', name: '8-speed automatic (UA80E)', gearRatios: [5.519, 3.184, 2.05, 1.492, 1.235, 1.0, 0.801, 0.673], finalDrive: 2.796, torqueConverter: { stallRpm: 2400 } },
    drivetrain: { layout: 'FWD', efficiency: 0.871, description: 'Front-wheel drive, open differential' },
    chassis: { curbMassKg: 1622, wheelbaseM: 2.825, lengthMm: 4910, widthMm: 1840, heightMm: 1445 },
    aero: {},
    tires: { sizes: [square('r19', '235/40 R19', 235, 40, 19, 'TRD fitment (assumed)')], compound: 'oe-performance', gripScale: 1.15 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.15', status: 'estimated', source: 'Fitted to Car and Driver 0–60 mph 5.6 s (aggregator-listed)' },
      { parameter: 'Drivetrain efficiency', value: '87.1 %', status: 'estimated', source: 'Fitted to the 101 mph trap; held-out ET 14.09 s vs 14.2 s' },
      { parameter: 'Peak power', value: '301 hp @ 6,600 rpm', status: 'reported', source: 'MotorWeek road-test specifications', url: 'https://motorweek.org/road_tests/2020-toyota-camry-and-avalon-trd-2' },
      { parameter: 'Peak torque', value: '267 lb-ft @ 4,700 rpm', status: 'reported', source: 'MotorWeek road-test specifications', url: 'https://motorweek.org/road_tests/2020-toyota-camry-and-avalon-trd-2' },
      { parameter: 'Gear ratios', value: '5.519/3.184/2.050/1.492/1.235/1.000/0.801/0.673', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Final drive', value: '2.796', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '≈3,575 lb (1,622 kg)', status: 'estimated', source: 'Approximate figure (one review quotes "roughly 3,600 lb"); exact TRD figure not reached' },
      { parameter: 'Tire size', value: '235/40 R19', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
