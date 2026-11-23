import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #43: 2000 Honda S2000 S2000 (US). */
export const entry: CatalogEntry = {
  id: "2000-honda-s2000-us-conv-rwd-6mt",
  roster: 43,
  section: "Sports cars",
  make: "Honda",
  model: "S2000",
  trim: "S2000",
  modelYear: 2000,
  market: "US",
  body: "Convertible",
  bodyLabel: "Soft top",
  chassisCode: "AP1",
  aliases: [
    "S2K",
    "AP1",
    "F20C"
  ],
  origin: "Japan",
  usage: [
    "Sports Car",
    "Track"
  ],
  drive: "RWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "2.0 I4 (F20C)",
  modelPath: "MT",
  factory: {
    power: "240 hp",
    torque: "153 lb-ft",
    curbMass: "2,809 lb",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2000 Honda S2000 archived test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15142081/2000-honda-s2000-archived-test-review/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2000 Honda S2000",
      publisher: "supercars.net",
      url: "https://www.supercars.net/blog/2000-honda-s2000/",
      kind: "reference"
    },
    {
      id: "src3",
      title: "Honda S2000 0–60 times",
      publisher: "0-60specs",
      url: "https://www.0-60specs.com/honda/s2000-0-60-times",
      kind: "reference"
    },
    {
      id: "src4",
      title: "0–60 times thread",
      publisher: "S2Ki forum",
      url: "https://s2ki.com/forums/s2000-talk-1/0-60-times-352659/page3",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "cd-agg",
      sourceId: "src3",
      publication: "Car and Driver (as listed by 0-60specs)",
      timing: "unconfirmed",
      timingNote: "Car and Driver test published before its late-2019 move to a 1-ft rollout; the earlier procedure is not confirmed here, so both simulator bases are shown.",
      results: {
        zeroTo60MphS: 6.8,
        quarterMileS: 15.1,
        quarterMileTrapMph: 96
      },
      conditions: {},
      match: "exact",
      verification: "Aggregator listing that attributes the run to the publication; original page not reachable. The slowest S2000 result in that database; treat with caution.",
      date: "2000"
    },
    {
      id: "mt",
      sourceId: "src4",
      publication: "MotorTrend (as quoted on a forum)",
      timing: "rollout-1ft",
      timingNote: "MotorTrend subtracts a 1-ft rollout from its acceleration times.",
      results: {
        zeroTo60MphS: 5.2,
        quarterMileS: 13.8,
        quarterMileTrapMph: 100.5
      },
      conditions: {},
      match: "exact",
      verification: "Forum quote of the February 2000 issue; original not reached.",
      date: "2000"
    },
    {
      id: "rt",
      sourceId: "src4",
      publication: "Road & Track (as quoted on a forum)",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 5.5,
        zeroTo100MphS: 14.2,
        quarterMileS: 14.1,
        quarterMileTrapMph: 99.6
      },
      conditions: {},
      match: "exact",
      verification: "Forum quote of revised figures; original not reached.",
      date: "2000"
    }
  ],
  dataGaps: [
    "Car and Driver archived test (roster source)",
    "Power/torque rpm",
    "Tire size",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "2000-honda-s2000-us-conv-rwd-6mt",
  make: "Honda",
  model: "S2000",
  trim: "S2000",
  modelYear: 2000,
  market: "US",
  body: "Convertible",
  shortName: "Honda S2000 (AP1)"
}, {
    engine: { code: 'F20C', description: '2.0 L DOHC VTEC I4', displacementCc: 1997, aspiration: 'na', idleRpm: 800, redlineRpm: 8900, revLimitRpm: 9000, power: { value: 240, unit: 'hp', rpm: [8300, 8300] }, torque: { value: 153, unit: 'lb-ft', rpm: [7500, 7500] }, lowEndFraction: 0.65 },
    transmission: { type: 'manual', name: '6-speed manual', gearRatios: [3.133, 2.045, 1.481, 1.161, 0.97, 0.81], finalDrive: 4.1 },
    drivetrain: { layout: 'RWD', description: 'Rear-wheel drive, Torsen limited-slip differential' },
    chassis: { curbMassKg: 1274, frontWeightFraction: 0.5, wheelbaseM: 2.4, lengthMm: 4135, widthMm: 1750, heightMm: 1285 },
    aero: {},
    tires: { sizes: [staggered('r16', '205/55 R16 F · 225/50 R16 R', { widthMm: 205, aspectPct: 55, rimIn: 16 }, { widthMm: 225, aspectPct: 50, rimIn: 16 }, 'Bridgestone Potenza S-02 (assumed)')], compound: 'oe-performance', gripScale: 1.3 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.30', status: 'estimated', source: 'No defensible launch benchmark for this car (only an outlier aggregator listing and forum quotes): median of the fitted rear-drive cars (1.30, which is also the fit bound)' },
      { parameter: 'Peak power', value: '240 hp @ 8,300', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Peak torque', value: '153 lb-ft @ 7,500 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Gear ratios', value: '3.13/2.04/1.48/1.16/0.97/0.81', status: 'reported', source: 'Specification listing (rounded; 3.133/2.045 used)', url: 'https://www.supercars.net/blog/2000-honda-s2000/' },
      { parameter: 'Final drive', value: '4.10', status: 'reported', source: 'Specification listing', url: 'https://www.supercars.net/blog/2000-honda-s2000/' },
      { parameter: 'Curb mass', value: '2,809 lb (1,274 kg)', status: 'reported', source: 'Wikipedia (AP1)', url: 'https://en.wikipedia.com/wiki/Honda_S2000' },
      { parameter: 'Tire size', value: '205/55 R16 F · 225/50 R16 R', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
