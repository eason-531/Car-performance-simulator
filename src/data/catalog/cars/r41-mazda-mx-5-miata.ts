import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #41: 2016 Mazda MX-5 Miata Club (US). */
export const entry: CatalogEntry = {
  id: "2016-mazda-mx-5-miata-club-us-conv-rwd-6mt",
  roster: 41,
  section: "Sports cars",
  make: "Mazda",
  model: "MX-5 Miata",
  trim: "Club",
  modelYear: 2016,
  market: "US",
  body: "Convertible",
  bodyLabel: "Soft top",
  chassisCode: "ND1",
  aliases: [
    "Miata",
    "MX5",
    "ND",
    "Roadster"
  ],
  origin: "Japan",
  usage: [
    "Sports Car"
  ],
  drive: "RWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "2.0 I4 (Skyactiv-G PE-VPS)",
  modelPath: "MT",
  factory: {
    power: "155 hp",
    torque: "148 lb-ft",
    curbMass: "2,332 lb (Autoblog listing)",
    sourceId: "src4"
  },
  sources: [
    {
      id: "test",
      title: "2016 Mazda MX-5 Miata Club test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15105840/2016-mazda-mx-5-miata-club-test-review/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2016 Mazda MX-5 Miata",
      publisher: "Car and Driver (syndicated on Yahoo)",
      url: "https://autos.yahoo.com/2016-mazda-mx-5-miata-205000131.html",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "2016 Mazda MX-5 road test",
      publisher: "MotorWeek",
      url: "https://motorweek.org/road_tests/2016-mazda-mx-51",
      kind: "road-test"
    },
    {
      id: "src4",
      title: "2016 Mazda MX-5 Miata review",
      publisher: "Autoblog",
      url: "https://www.autoblog.com/buy/2016-Mazda-MX_5+Miata/review/",
      kind: "reference"
    },
    {
      id: "src-mazda",
      title: "MX-5 spec deck",
      publisher: "Mazda USA",
      url: "https://news.mazdausa.com/download/2016-Mazda-MX-5-Spec-Deck.pdf",
      kind: "manufacturer"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src2",
      publication: "Car and Driver",
      timing: "unconfirmed",
      timingNote: "Car and Driver test published before its late-2019 move to a 1-ft rollout; the earlier procedure is not confirmed here, so both simulator bases are shown.",
      results: {
        zeroTo60MphS: 5.8,
        quarterMileS: 14.6,
        quarterMileTrapMph: 94
      },
      conditions: {
        testMass: "2,324 lb"
      },
      match: "exact",
      verification: "Syndicated copy of the article (original page not reachable from this environment).",
      date: "2015"
    },
    {
      id: "motorweek",
      sourceId: "src3",
      publication: "MotorWeek",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 5.9,
        quarterMileS: 14.6,
        quarterMileTrapMph: 94
      },
      conditions: {
        other: [
          "Club specification"
        ]
      },
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2016"
    }
  ],
  dataGaps: [
    "Power/torque rpm",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "2016-mazda-mx-5-miata-club-us-conv-rwd-6mt",
  make: "Mazda",
  model: "MX-5 Miata",
  trim: "Club",
  modelYear: 2016,
  market: "US",
  body: "Convertible",
  shortName: "Mazda MX-5 Miata Club (2016)"
}, {
    engine: { code: 'PE-VPS', description: '2.0 L I4, Skyactiv-G', displacementCc: 1998, aspiration: 'na', idleRpm: 700, redlineRpm: 6800, revLimitRpm: 6800, power: { value: 155, unit: 'hp', rpm: [6000, 6000] }, torque: { value: 148, unit: 'lb-ft', rpm: [4600, 4600] }, lowEndFraction: 0.78 },
    transmission: { type: 'manual', name: '6-speed manual', gearRatios: [5.087, 2.991, 2.035, 1.594, 1.286, 1.0], finalDrive: 2.866 },
    drivetrain: { layout: 'RWD', description: 'Rear-wheel drive, limited-slip differential (Club)' },
    chassis: { curbMassKg: 1054, frontWeightFraction: 0.5, wheelbaseM: 2.31, lengthMm: 3915, widthMm: 1735, heightMm: 1235 },
    aero: {},
    tires: { sizes: [square('r17', '205/45 R17', 205, 45, 17, 'Bridgestone Potenza S001 (Club, assumed)')], compound: 'uhp', gripScale: 1.3 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Gear ratios', value: '5.087/2.991/2.035/1.594/1.286/1.000', status: 'verified', source: 'Mazda US spec deck (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://news.mazdausa.com/download/2016-Mazda-MX-5-Spec-Deck.pdf' },
      { parameter: 'Final drive', value: '2.866 (6MT)', status: 'verified', source: 'Mazda US spec deck (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://news.mazdausa.com/download/2016-Mazda-MX-5-Spec-Deck.pdf' },
      { parameter: 'Tire grip calibration', value: '×1.30 (fit bound)', status: 'estimated', source: 'Fit toward the Car and Driver 0–60 mph 5.8 s stopped at the bound (sim ≈6.4 s); residual shown' },
      { parameter: 'Drivetrain efficiency', value: '88 %', status: 'estimated', source: 'Default for a rear-drive manual; a trap fit asked for 92 %, above the manual bound' },
      { parameter: 'Peak power', value: '155 hp @ 6,000', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Peak torque', value: '148 lb-ft @ 4,600 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '2,324 lb (1,054 kg) as tested', status: 'reported', source: 'Car and Driver test (syndicated)', url: 'https://autos.yahoo.com/2016-mazda-mx-5-miata-205000131.html' },
      { parameter: 'Tire size', value: '205/45 R17', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
