import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #27: 2023 BMW M3 Competition xDrive Edition 50 Jahre BMW M (US). */
export const entry: CatalogEntry = {
  id: "2023-bmw-m3-competition-xdrive-edition-50-jahre-bmw-m-us-sedan-awd-8at",
  roster: 27,
  section: "Luxury and sport sedans",
  make: "BMW",
  model: "M3",
  trim: "Competition xDrive Edition 50 Jahre BMW M",
  modelYear: 2023,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "G80",
  aliases: [
    "M3",
    "G80",
    "M xDrive",
    "50 Jahre"
  ],
  origin: "Germany",
  usage: [
    "Sport Sedan",
    "Track"
  ],
  drive: "AWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic",
  powertrain: "Petrol",
  engineLabel: "3.0 twin-turbo I6 (S58)",
  modelPath: "Existing",
  factory: {
    power: "503 hp",
    torque: "479 lb-ft",
    curbMass: "3,990 lb",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2023 BMW M3 Competition xDrive Edition 50 Jahre by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a43389602/2023-bmw-m3-competition-xdrive-edition-50-jahre-by-the-numbers/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2023 BMW M3 Competition xDrive",
      publisher: "Motor Matchup",
      url: "https://www.motormatchup.com/catalog/BMW/M3/2023/Competition-xDrive-Sedan",
      kind: "reference"
    },
    {
      id: "src3",
      title: "C&D test summary",
      publisher: "Carscoops",
      url: "https://carscoops.com/?p=2654760",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "test",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 2.8,
        zeroTo100MphS: 7.0,
        quarterMileS: 11.0,
        quarterMileTrapMph: 124
      },
      conditions: {
        launchControl: "Launch Control"
      },
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment). Secondary reports disagree on whether the 2.8 s includes rollout; C&D policy since late 2019 subtracts it.",
      date: "2023"
    }
  ],
  dataGaps: [
    "Car and Driver page itself (test weight, conditions)",
    "8-speed ratios and final drive",
    "Tire size",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "2023-bmw-m3-competition-xdrive-edition-50-jahre-bmw-m-us-sedan-awd-8at",
  make: "BMW",
  model: "M3",
  trim: "Competition xDrive Edition 50 Jahre BMW M",
  modelYear: 2023,
  market: "US",
  body: "Sedan",
  shortName: "BMW M3 Comp xDrive"
}, {
    engine: { code: 'S58B30T0', description: '3.0 L twin-turbo I6', displacementCc: 2993, aspiration: 'twin-turbo', idleRpm: 650, redlineRpm: 7200, revLimitRpm: 7200, power: { value: 503, unit: 'hp', rpm: [6250, 6250] }, torque: { value: 479, unit: 'lb-ft', rpm: [2750, 5500] }, peakBoostBar: 1.7, lowEndFraction: 0.55 },
    transmission: { type: 'torque-converter-automatic', name: '8-speed M Steptronic (ZF 8HP)', gearRatios: [5.0, 3.2, 2.143, 1.72, 1.313, 1.0, 0.823, 0.64], finalDrive: 3.154, upshiftTimeS: 0.2, downshiftTimeS: 0.28, shiftTorqueDip: 0.3, torqueConverter: { stallRpm: 2600 } },
    drivetrain: { layout: 'AWD', efficiency: 0.85, description: 'M xDrive (rear-biased)', frontShareRange: [0, 0.5] },
    chassis: { curbMassKg: 1810, frontWeightFraction: 0.53, wheelbaseM: 2.857, lengthMm: 4794, widthMm: 1903, heightMm: 1433 },
    aero: {},
    tires: { sizes: [staggered('r19r20', '275/35 R19 F · 285/30 R20 R', { widthMm: 275, aspectPct: 35, rimIn: 19 }, { widthMm: 285, aspectPct: 30, rimIn: 20 }, 'Competition fitment (assumed)')], compound: 'uhp', gripScale: 1.14 },
    speedLimiterKmh: 250,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.14', status: 'estimated', source: 'Fitted to the Car and Driver 0–60 mph 2.8 s' },
      { parameter: 'Drivetrain efficiency', value: '85 %', status: 'estimated', source: 'A trap-speed fit asked for 91.6 % (implausible for AWD losses — the S58 is widely reported to exceed its rating); 85 % kept and the residual shown' },
      { parameter: 'Peak power', value: '503 hp', status: 'reported', source: 'BMW rating', url: 'https://www.motormatchup.com/catalog/BMW/M3/2023/Competition-xDrive-Sedan' },
      { parameter: 'Peak torque', value: '479 lb-ft @ 2,750 rpm', status: 'reported', source: 'BMW rating', url: 'https://www.motormatchup.com/catalog/BMW/M3/2023/Competition-xDrive-Sedan' },
      { parameter: 'Power rpm / torque band end', value: '6,250 rpm / 5,500 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Gear ratios', value: '5.000/3.200/2.143/1.720/1.313/1.000/0.823/0.640 (ZF 8HP M)', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Final drive', value: '3.154', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '3,990 lb (1,810 kg)', status: 'reported', source: 'Motor Matchup Competition xDrive listing', url: 'https://www.motormatchup.com/catalog/BMW/M3/2023/Competition-xDrive-Sedan' },
      { parameter: 'Tire size', value: '275/35 R19 F, 285/30 R20 R', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
