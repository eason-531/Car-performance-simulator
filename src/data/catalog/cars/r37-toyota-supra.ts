import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #37: 1993 Toyota Supra Turbo (US). */
export const entry: CatalogEntry = {
  id: "1993-toyota-supra-turbo-us-coupe-rwd-6mt",
  roster: 37,
  section: "Sports cars",
  make: "Toyota",
  model: "Supra",
  trim: "Turbo",
  modelYear: 1993,
  market: "US",
  body: "Coupe",
  bodyLabel: "Liftback coupe",
  chassisCode: "A80",
  aliases: [
    "Supra Mk4",
    "A80",
    "JZA80",
    "2JZ"
  ],
  origin: "Japan",
  usage: [
    "Sports Car",
    "Grand Tourer"
  ],
  drive: "RWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "3.0 twin-turbo I6 (2JZ-GTE)",
  modelPath: "MT",
  factory: {
    power: "320 hp",
    torque: "315 lb-ft",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "Toyota Supra Turbo instrumented test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15142755/toyota-supra-turbo-instrumented-test/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "1993 Toyota Supra Turbo",
      publisher: "supercars.net",
      url: "https://www.supercars.net/blog/1993-toyota-supra-turbo/",
      kind: "reference"
    },
    {
      id: "src3",
      title: "1993 Toyota Supra Turbo — archived road test",
      publisher: "ClubLexus forum (Car and Driver reprint)",
      url: "https://www.clublexus.com/forums/car-chat/725595-1993-toyota-supra-turbo-archived-road-test-2.html",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src3",
      publication: "Car and Driver (as reprinted on a forum)",
      timing: "unconfirmed",
      timingNote: "Car and Driver test published before its late-2019 move to a 1-ft rollout; the earlier procedure is not confirmed here, so both simulator bases are shown.",
      results: {
        zeroTo60MphS: 4.6,
        quarterMileS: 13.1,
        quarterMileTrapMph: 109
      },
      conditions: {},
      match: "exact",
      verification: "Forum reprint of the archived test; original page not reached.",
      date: "1993"
    }
  ],
  dataGaps: [
    "Final drive (3.133 vs 3.27 conflict)",
    "Curb mass",
    "Power/torque rpm",
    "Tire size",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "1993-toyota-supra-turbo-us-coupe-rwd-6mt",
  make: "Toyota",
  model: "Supra",
  trim: "Turbo",
  modelYear: 1993,
  market: "US",
  body: "Coupe",
  shortName: "Toyota Supra Turbo (1993)"
}, {
    engine: { code: '2JZ-GTE', description: '3.0 L sequential twin-turbo I6', displacementCc: 2997, aspiration: 'twin-turbo', idleRpm: 700, redlineRpm: 6800, revLimitRpm: 6800, power: { value: 320, unit: 'hp', rpm: [5600, 5600] }, torque: { value: 315, unit: 'lb-ft', rpm: [4000, 4000] }, peakBoostBar: 0.85 },
    transmission: { type: 'manual', name: 'Getrag V160 6-speed manual', gearRatios: [3.827, 2.36, 1.685, 1.312, 1.0, 0.793], finalDrive: 3.133 },
    drivetrain: { layout: 'RWD', description: 'Rear-wheel drive, Torsen limited-slip differential' },
    chassis: { curbMassKg: 1564, frontWeightFraction: 0.53, wheelbaseM: 2.55, lengthMm: 4515, widthMm: 1810, heightMm: 1275 },
    aero: {},
    tires: { sizes: [staggered('r17', '235/45 R17 F · 255/40 R17 R', { widthMm: 235, aspectPct: 45, rimIn: 17 }, { widthMm: 255, aspectPct: 40, rimIn: 17 }, 'Period fitment (assumed)')], compound: 'oe-performance', gripScale: 1.3 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.30', status: 'estimated', source: 'No defensible launch benchmark for this car (only a forum reprint): median of the fitted rear-drive cars (1.30, which is also the fit bound)' },
      { parameter: 'Peak power', value: '320 hp @ 5,600', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Peak torque', value: '315 lb-ft @ 4,000 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Gear ratios', value: '3.83/…/0.79 (V160)', status: 'reported', source: 'supercars.net specification table (rounded)', url: 'https://www.supercars.net/blog/1993-toyota-supra-turbo/' },
      { parameter: 'Final drive', value: '3.133', status: 'estimated', source: 'Recalled US 6-speed figure; supercars.net lists 3.27 — conflict, awaiting spec sheet' },
      { parameter: 'Curb mass', value: '≈3,447 lb (1,564 kg); Parkers lists 1,620 kg for the UK car', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Tire size', value: '235/45 R17 F · 255/40 R17 R', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
