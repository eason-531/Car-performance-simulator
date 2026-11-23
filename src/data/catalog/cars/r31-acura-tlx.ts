import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #31: 2024 Acura TLX Type S (US). */
export const entry: CatalogEntry = {
  id: "2024-acura-tlx-type-s-us-sedan-awd-10at",
  roster: 31,
  section: "Luxury and sport sedans",
  make: "Acura",
  model: "TLX",
  trim: "Type S",
  modelYear: 2024,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "UB facelift",
  aliases: [
    "TLX Type S",
    "SH-AWD"
  ],
  origin: "Japan",
  usage: [
    "Sport Sedan",
    "Luxury"
  ],
  drive: "AWD",
  transmission: "AT",
  transmissionLabel: "10-speed automatic",
  powertrain: "Petrol",
  engineLabel: "3.0 turbo V6 (J30AC)",
  modelPath: "Existing",
  factory: {
    power: "355 hp",
    torque: "354 lb-ft",
    curbMass: "4,221 lb",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2024 Acura TLX Type S drive",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a46362532/2024-acura-tlx-type-s-drive/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2024 Acura TLX & TLX Type S specifications",
      publisher: "Acura",
      url: "https://acuranews.com/en-US/releases/2024-acura-tlx-tlx-type-s-specifications-features",
      kind: "manufacturer"
    },
    {
      id: "src3",
      title: "Acura TLX 0–60 times",
      publisher: "0-60specs",
      url: "https://www.0-60specs.com/acura-tlx-0-60-times",
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
        zeroTo60MphS: 4.6,
        quarterMileS: 13.3,
        quarterMileTrapMph: 105
      },
      conditions: {},
      match: "equivalent",
      verification: "Aggregator listing that attributes the run to the publication; original page not reachable.",
      deviation: "Model year of the listed run not confirmed (may be the 2021 pre-facelift Type S)."
    }
  ],
  dataGaps: [
    "Car and Driver 2024 test page",
    "10-speed ratios and final drive for the TLX",
    "Power/torque rpm",
    "Tire size",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "2024-acura-tlx-type-s-us-sedan-awd-10at",
  make: "Acura",
  model: "TLX",
  trim: "Type S",
  modelYear: 2024,
  market: "US",
  body: "Sedan",
  shortName: "Acura TLX Type S"
}, {
    engine: { code: 'J30AC', description: '3.0 L turbo V6', displacementCc: 2995, aspiration: 'turbo', idleRpm: 650, redlineRpm: 6500, revLimitRpm: 6600, power: { value: 355, unit: 'hp', rpm: [5500, 5500] }, torque: { value: 354, unit: 'lb-ft', rpm: [1400, 5000] }, peakBoostBar: 1.1, lowEndFraction: 0.55 },
    transmission: { type: 'torque-converter-automatic', name: '10-speed automatic', gearRatios: [5.25, 3.27, 2.19, 1.6, 1.3, 1.0, 0.78, 0.65, 0.581, 0.517], finalDrive: 3.39, torqueConverter: { stallRpm: 2400 } },
    drivetrain: { layout: 'AWD', description: 'SH-AWD with rear torque vectoring (up to 70 % rear)', frontShareRange: [0.3, 1] },
    chassis: { curbMassKg: 1915, frontWeightFraction: 0.58, wheelbaseM: 2.87, lengthMm: 4943, widthMm: 1910, heightMm: 1433 },
    aero: {},
    tires: { sizes: [square('r20', '255/35 R20', 255, 35, 20, 'Type S fitment (assumed)')], compound: 'uhp' },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Curb mass', value: '4,221 lb (1,915 kg)', status: 'verified', source: 'Acura 2024 TLX specifications', url: 'https://acuranews.com/en-US/releases/2024-acura-tlx-tlx-type-s-specifications-features' },
      { parameter: 'Peak power', value: '355 hp', status: 'reported', source: 'Acura rating', url: 'https://www.motor1.com/reviews/704727/2024-acura-tlx-type-s-review/' },
      { parameter: 'Peak torque', value: '354 lb-ft', status: 'reported', source: 'Acura rating', url: 'https://www.motor1.com/reviews/704727/2024-acura-tlx-type-s-review/' },
      { parameter: 'Power / torque rpm', value: '5,500 / 1,400–5,000 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Gear ratios', value: 'Honda 10-speed family (Accord set)', status: 'estimated', source: 'Same 10-speed family as the Accord; TLX application not confirmed — awaiting spec sheet' },
      { parameter: 'Final drive', value: '3.39', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Tire size', value: '255/35 R20', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
