import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #9: 2018 Honda Accord Touring 2.0T (US). */
export const entry: CatalogEntry = {
  id: "2018-honda-accord-touring-2-0t-us-sedan-fwd-10at",
  roster: 9,
  section: "Daily and sport compacts",
  make: "Honda",
  model: "Accord",
  trim: "Touring 2.0T",
  modelYear: 2018,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "10th gen (CV)",
  aliases: [
    "Accord 2.0T",
    "CV1"
  ],
  origin: "Japan",
  usage: [
    "Daily"
  ],
  drive: "FWD",
  transmission: "AT",
  transmissionLabel: "10-speed automatic",
  powertrain: "Petrol",
  engineLabel: "2.0 turbo I4 (K20C4)",
  modelPath: "Existing",
  factory: {
    power: "252 hp (SAE net) @ 6,500 rpm",
    torque: "273 lb-ft @ 1,500 rpm",
    curbMass: "3,428 lb (Touring 2.0T listing)",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2018 Honda Accord 2.0T automatic test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15079405/2018-honda-accord-20t-automatic-test-review/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2018 Honda Accord press kit — powertrain",
      publisher: "Honda",
      url: "https://hondanews.com/en-US/releases/2018-honda-accord-press-kit-powertrain",
      kind: "manufacturer"
    },
    {
      id: "src3",
      title: "2018 Honda Accord 2.0T specifications",
      publisher: "carspecs.us",
      url: "https://www.carspecs.us/cars/2018/honda/accord/55706",
      kind: "reference"
    },
    {
      id: "src4",
      title: "2018 Accord Touring 2.0T specs",
      publisher: "Autoblog",
      url: "https://www.autoblog.com/buy/2018-Honda-Accord-Touring_2.0T__4dr_Sedan/specs/",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "cd-2017",
      sourceId: "test",
      publication: "Car and Driver",
      timing: "unconfirmed",
      timingNote: "Car and Driver test published before its late-2019 move to a 1-ft rollout; the earlier procedure is not confirmed here, so both simulator bases are shown.",
      results: {
        zeroTo60MphS: 5.5,
        quarterMileS: 14.1
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment). Trap speed not in the summary (a 102 mph figure appears in an unattributed review and is not used).",
      date: "2017"
    }
  ],
  dataGaps: [
    "Quarter-mile trap speed from the Car and Driver test",
    "Torque band upper rpm",
    "Tire size of the Touring 2.0T (235/40 R19 assumed)",
    "Wheelbase/dimensions (recalled)",
    "Drag coefficient",
    "Top-speed governor"
  ],
  sim: buildSpec({
  id: "2018-honda-accord-touring-2-0t-us-sedan-fwd-10at",
  make: "Honda",
  model: "Accord",
  trim: "Touring 2.0T",
  modelYear: 2018,
  market: "US",
  body: "Sedan",
  shortName: "Honda Accord 2.0T"
}, {
    engine: {
      code: 'K20C4', description: '2.0 L turbo I4, direct injection', displacementCc: 1996, aspiration: 'turbo',
      idleRpm: 700, redlineRpm: 6800, revLimitRpm: 6900,
      power: { value: 252, unit: 'hp', rpm: [6500, 6500] },
      torque: { value: 273, unit: 'lb-ft', rpm: [1500, 4000] },
      peakBoostBar: 1.4,
    },
    transmission: {
      type: 'torque-converter-automatic', name: '10-speed automatic (Honda 10AT)',
      gearRatios: [5.25, 3.27, 2.19, 1.6, 1.3, 1.0, 0.78, 0.65, 0.581, 0.517], finalDrive: 3.55,
      upshiftTimeS: 0.28, downshiftTimeS: 0.38,
    },
    drivetrain: { layout: 'FWD', description: 'Front-wheel drive, open differential with brake-based traction control' },
    chassis: { curbMassKg: 1555, wheelbaseM: 2.83, lengthMm: 4882, widthMm: 1862, heightMm: 1450 },
    aero: {},
    tires: { sizes: [square('r19', '235/40 R19', 235, 40, 19, 'Touring 2.0T fitment (assumed)')], compound: 'oe-performance', gripScale: 1.3 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.30 (upper bound)', status: 'estimated', source: 'Fitted to Car and Driver 0–60 mph 5.5 s (sim 5.64 s on the midpoint of both timing bases); held-out ¼-mile 14.24 s vs 14.1 s' },
      { parameter: 'Peak power', value: '252 hp (SAE) @ 6,500 rpm', status: 'reported', source: 'Honda press kit; Gear Patrol review', url: 'https://hondanews.com/en-US/releases/2018-honda-accord-press-kit-powertrain' },
      { parameter: 'Peak torque', value: '273 lb-ft @ 1,500 rpm (band end assumed 4,000)', status: 'reported', source: 'Honda press kit', url: 'https://hondanews.com/en-US/releases/2018-honda-accord-press-kit-powertrain' },
      { parameter: 'Gear ratios', value: '5.25/3.27/2.19/1.60/1.30/1.00/0.78/0.65/0.581/0.517', status: 'reported', source: '1st–8th carspecs.us; 9th–10th Honda ratio table', url: 'https://www.carspecs.us/cars/2018/honda/accord/55706' },
      { parameter: 'Final drive', value: '3.55', status: 'reported', source: 'carspecs.us; Honda 2021 Accord specifications', url: 'https://www.carspecs.us/cars/2018/honda/accord/55706' },
      { parameter: 'Curb mass', value: '3,428 lb (1,555 kg)', status: 'reported', source: 'Autoblog Touring 2.0T specification listing', url: 'https://www.autoblog.com/buy/2018-Honda-Accord-Touring_2.0T__4dr_Sedan/specs/' },
      { parameter: 'Dimensions', value: '4,882 × 1,862 × 1,450 mm, WB 2,830 mm', status: 'estimated', source: 'Recalled Honda figures; not verified from a reachable source' },
      { parameter: 'Tire size', value: '235/40 R19', status: 'estimated', source: 'Touring 2.0T fitment as commonly listed; not verified' },
      { parameter: 'Redline / limiter', value: '6,800 / 6,900 rpm', status: 'estimated', source: 'K20C4 tachometer region; not verified' },
    ],
  }),
};
