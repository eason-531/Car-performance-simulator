import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #12: 2022 Honda Civic Si (US). */
export const entry: CatalogEntry = {
  id: "2022-honda-civic-si-us-sedan-fwd-6mt",
  roster: 12,
  section: "Daily and sport compacts",
  make: "Honda",
  model: "Civic",
  trim: "Si",
  modelYear: 2022,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "FE1",
  aliases: [
    "Civic Si",
    "FE1"
  ],
  origin: "Japan",
  usage: [
    "Sport Compact",
    "Daily"
  ],
  drive: "FWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "1.5 turbo I4 (L15B7)",
  modelPath: "MT",
  factory: {
    power: "200 hp @ 6,000 rpm",
    torque: "192 lb-ft @ 1,800 rpm",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2022 Honda Civic Si",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/honda/civic-si-2022",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2022 Honda Civic Si",
      publisher: "TopSpeed (citing Car and Driver)",
      url: "https://www.topspeed.com/cars/honda/2022-honda-civic-si-ar195286.html",
      kind: "reference"
    },
    {
      id: "src3",
      title: "Tested: Honda Civic Si is slower but great to drive",
      publisher: "Edmunds",
      url: "https://www.edmunds.com/car-news/tested-honda-civic-si-is-slower-but-great-to-drive.html",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src2",
      publication: "Car and Driver (as cited by TopSpeed)",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 6.8,
        quarterMileS: 15.1
      },
      conditions: {},
      match: "exact",
      verification: "Second-hand citation; another site quotes 6.7 s.",
      date: "2021"
    },
    {
      id: "edmunds",
      sourceId: "src3",
      publication: "Edmunds",
      timing: "standing-start",
      timingNote: "Edmunds times from a standstill (\"zero should mean zero\"), no rollout.",
      results: {
        zeroTo60MphS: 7.2,
        quarterMileS: 15.1,
        quarterMileTrapMph: 92.8
      },
      conditions: {
        testMass: "2,944 lb"
      },
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2021"
    }
  ],
  dataGaps: [
    "Gear ratios and final drive",
    "Curb mass",
    "Tire size",
    "Drag coefficient",
    "Car and Driver trap speed"
  ],
  sim: buildSpec({
  id: "2022-honda-civic-si-us-sedan-fwd-6mt",
  make: "Honda",
  model: "Civic",
  trim: "Si",
  modelYear: 2022,
  market: "US",
  body: "Sedan",
  shortName: "Honda Civic Si"
}, {
    engine: { code: 'L15B7', description: '1.5 L turbo I4', displacementCc: 1498, aspiration: 'turbo', idleRpm: 750, redlineRpm: 6500, revLimitRpm: 6500, power: { value: 200, unit: 'hp', rpm: [6000, 6000] }, torque: { value: 192, unit: 'lb-ft', rpm: [1800, 5000] }, peakBoostBar: 1.4 },
    transmission: { type: 'manual', name: '6-speed manual', gearRatios: [3.643, 2.08, 1.361, 1.024, 0.83, 0.686], finalDrive: 4.35 },
    drivetrain: { layout: 'FWD', efficiency: 0.89, description: 'Front-wheel drive, helical limited-slip differential' },
    chassis: { curbMassKg: 1318, frontWeightFraction: 0.61, wheelbaseM: 2.735, lengthMm: 4674, widthMm: 1802, heightMm: 1410 },
    aero: {},
    tires: { sizes: [square('r18', '235/40 R18', 235, 40, 18, 'Standard fitment (assumed)')], compound: 'oe-performance', gripScale: 1.11 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.11', status: 'estimated', source: 'Fitted to the Edmunds 0–60 mph 7.2 s with efficiency held at 89 % (also matches the cited Car and Driver 6.8 s)' },
      { parameter: 'Drivetrain efficiency', value: '89 %', status: 'estimated', source: 'Default for a front-drive manual; a trap fit asked for 83 %, implausibly low, so the ≈+2 mph trap residual is left visible' },
      { parameter: 'Peak power', value: '200 hp @ 6,000', status: 'reported', source: 'Honda rating (TopSpeed)', url: 'https://www.topspeed.com/cars/honda/2022-honda-civic-si-ar195286.html' },
      { parameter: 'Peak torque', value: '192 lb-ft @ 1,800–5,000 rpm', status: 'reported', source: 'Honda rating (TopSpeed)', url: 'https://www.topspeed.com/cars/honda/2022-honda-civic-si-ar195286.html' },
      { parameter: 'Gear ratios', value: '3.643/2.080/1.361/1.024/0.830/0.686', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Final drive', value: '4.35', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '≈2,906 lb (1,318 kg); Edmunds weighed its test car at 2,944 lb', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Tire size', value: '235/40 R18', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
