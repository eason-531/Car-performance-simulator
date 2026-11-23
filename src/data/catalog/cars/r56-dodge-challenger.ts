import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #56: 2019 Dodge Challenger SRT Hellcat Redeye Widebody (US). */
export const entry: CatalogEntry = {
  id: "2019-dodge-challenger-srt-hellcat-redeye-widebody-us-coupe-rwd-8at",
  roster: 56,
  section: "American performance",
  make: "Dodge",
  model: "Challenger",
  trim: "SRT Hellcat Redeye Widebody",
  modelYear: 2019,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "LA",
  aliases: [
    "Redeye",
    "Hellcat",
    "Challenger"
  ],
  origin: "United States",
  usage: [
    "Muscle"
  ],
  drive: "RWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic",
  powertrain: "Petrol",
  engineLabel: "6.2 supercharged V8 (Hellcat HO)",
  modelPath: "Existing",
  factory: {
    power: "797 hp @ 6,300 rpm",
    torque: "707 lb-ft @ 4,500 rpm",
    zeroTo60MphS: 3.4,
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "Going for 10s: drag-strip testing the 2019 Challenger SRT Hellcat Redeye",
      publisher: "Cars.com",
      url: "https://www.cars.com/articles/going-for-10s-drag-strip-testing-the-2019-dodge-challenger-srt-hellcat-redeye-1420703398783/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2019 Dodge Challenger first drive: 797-hp Hellcat Redeye",
      publisher: "The Drive",
      url: "https://www.thedrive.com/new-cars/22708/2019-dodge-challenger-first-drive-review-797-hp-hellcat-redeye-hot-handling-scat-pack-widebody",
      kind: "reference"
    },
    {
      id: "src3",
      title: "Dodge Challenger SRT Hellcat Redeye",
      publisher: "FastestLaps",
      url: "https://fastestlaps.com/models/dodge-challenger-srt-hellcat-redeye",
      kind: "reference"
    },
    {
      id: "src4",
      title: "Going for 10s: drag-strip testing the 2019 Challenger SRT Hellcat Redeye",
      publisher: "Cars.com",
      url: "https://www.cars.com/articles/going-for-10s-drag-strip-testing-the-2019-dodge-challenger-srt-hellcat-redeye-1420703398783",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src3",
      publication: "Car and Driver (as relayed on FastestLaps)",
      timing: "unconfirmed",
      timingNote: "Car and Driver test published before its late-2019 move to a 1-ft rollout; the earlier procedure is not confirmed here, so both simulator bases are shown.",
      results: {
        zeroTo60MphS: 3.7,
        quarterMileS: 11.4,
        quarterMileTrapMph: 128
      },
      conditions: {},
      match: "exact",
      verification: "Relayed by a user post on FastestLaps; original article not reached — weak attribution.",
      date: "2019"
    },
    {
      id: "mt",
      sourceId: "src3",
      publication: "MotorTrend (as relayed on FastestLaps)",
      timing: "rollout-1ft",
      timingNote: "MotorTrend subtracts a 1-ft rollout from its acceleration times.",
      results: {
        zeroTo60MphS: 4.0,
        quarterMileS: 11.8,
        quarterMileTrapMph: 128
      },
      conditions: {},
      match: "exact",
      verification: "Relayed by a user post on FastestLaps; original article not reached — weak attribution.",
      date: "2019"
    },
    {
      id: "carscom",
      sourceId: "src4",
      publication: "Cars.com",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        quarterMileS: 10.8
      },
      conditions: {
        surface: "Drag strip"
      },
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2019",
      deviation: "Best of two to three passes at a drag strip; surface preparation not stated."
    }
  ],
  dataGaps: [
    "Car and Driver and MotorTrend original test pages",
    "Final drive (2.62 unconfirmed)",
    "8HP90 ratios",
    "Curb mass",
    "Drag coefficient"
  ],
  notes: [
    "Dodge quotes 3.4 s to 60 mph and 10.8 s @ 131 mph on a prepped drag strip treated with VHT traction compound; street-surface magazine tests are much slower, so no grip calibration is fitted against them."
  ],
  sim: buildSpec({
  id: "2019-dodge-challenger-srt-hellcat-redeye-widebody-us-coupe-rwd-8at",
  make: "Dodge",
  model: "Challenger",
  trim: "SRT Hellcat Redeye Widebody",
  modelYear: 2019,
  market: "US",
  body: "Coupe",
  shortName: "Dodge Challenger SRT Hellcat Redeye Widebody"
}, {
    engine: { code: 'Hellcat HEMI (Redeye)', description: '6.2 L supercharged V8', displacementCc: 6166, aspiration: 'supercharged', idleRpm: 700, redlineRpm: 6300, revLimitRpm: 6500, power: { value: 797, unit: 'hp', rpm: [6300, 6300] }, torque: { value: 707, unit: 'lb-ft', rpm: [4500, 4500] }, peakBoostBar: 1.0, spoolScale: 0.25 },
    transmission: { type: 'torque-converter-automatic', name: 'TorqueFlite 8HP90 8-speed automatic', gearRatios: [4.71, 3.14, 2.1, 1.67, 1.29, 1.0, 0.84, 0.67], finalDrive: 2.62, upshiftTimeS: 0.25, shiftTorqueDip: 0.35, torqueConverter: { stallRpm: 2600 } },
    drivetrain: { layout: 'RWD', description: 'Rear-wheel drive, limited-slip differential' },
    chassis: { curbMassKg: 2040, frontWeightFraction: 0.57, wheelbaseM: 2.946, lengthMm: 5027, widthMm: 2018, heightMm: 1450 },
    aero: {},
    tires: { sizes: [square('r20', '305/35 R20', 305, 35, 20, 'Widebody fitment, Pirelli P Zero (assumed)')], compound: 'uhp', gripScale: 1.3 },
    speedLimiterKmh: null,
    factory: { zeroTo60MphS: 3.4 },
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.30', status: 'estimated', source: 'No defensible launch benchmark for this car (only forum-relayed tests): median of the fitted rear-drive cars (1.30, which is also the fit bound)' },
      { parameter: 'Peak power', value: '797 hp @ 6,300 rpm', status: 'reported', source: 'Dodge rating (multiple reviews)', url: 'https://www.thedrive.com/new-cars/22708/2019-dodge-challenger-first-drive-review-797-hp-hellcat-redeye-hot-handling-scat-pack-widebody' },
      { parameter: 'Peak torque', value: '707 lb-ft @ 4,500 rpm', status: 'reported', source: 'Dodge rating (multiple reviews)', url: 'https://www.thedrive.com/new-cars/22708/2019-dodge-challenger-first-drive-review-797-hp-hellcat-redeye-hot-handling-scat-pack-widebody' },
      { parameter: 'Gear ratios', value: '4.71/3.14/2.10/1.67/1.29/1.00/0.84/0.67 (8HP90)', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Final drive', value: '2.62', status: 'estimated', source: 'Standard axle per a user forum post; not confirmed — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '≈2,040 kg (4,500 lb)', status: 'estimated', source: 'Aggregator estimate 2,038–2,054 kg; not confirmed — awaiting spec sheet' },
      { parameter: 'Tire size', value: '305/35 R20 (Widebody)', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
