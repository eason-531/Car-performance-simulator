import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #17: 2019 Subaru WRX STI S209 (US). */
export const entry: CatalogEntry = {
  id: "2019-subaru-wrx-sti-s209-us-sedan-awd-6mt",
  roster: 17,
  section: "Daily and sport compacts",
  make: "Subaru",
  model: "WRX STI",
  trim: "S209",
  modelYear: 2019,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "VA",
  aliases: [
    "STI",
    "S209",
    "VA"
  ],
  origin: "Japan",
  usage: [
    "Sport Compact",
    "Track"
  ],
  drive: "AWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "2.5 turbo flat-4 (EJ257)",
  modelPath: "MT",
  factory: {
    power: "341 hp",
    torque: "330 lb-ft",
    curbMass: "3,485 lb",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2019 Subaru WRX STI S209 first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2019-subaru-wrx-sti-s209-first-test-makes-special",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2019 Subaru STI S209 review",
      publisher: "Autoblog",
      url: "https://www.autoblog.com/buy/2019-Subaru-STI+S209/review/",
      kind: "reference"
    },
    {
      id: "src3",
      title: "Subaru WRX 0–60 times",
      publisher: "0-60specs",
      url: "https://www.0-60specs.com/subaru/wrx-0-60-times",
      kind: "reference"
    },
    {
      id: "src-s209",
      title: "STI S209 specifications",
      publisher: "Subaru of America",
      url: "https://subarumedia.iconicweb.com/mediasite/attachments/STI_S209_specs-FINAL_10919.pdf",
      kind: "manufacturer"
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
        zeroTo60MphS: 4.4,
        quarterMileS: 13.0,
        quarterMileTrapMph: 107
      },
      conditions: {},
      match: "exact",
      verification: "Aggregator listing that attributes the run to the publication; original page not reachable.",
      date: "2019"
    },
    {
      id: "motorweek",
      sourceId: "src3",
      publication: "MotorWeek (as listed by 0-60specs)",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 4.7,
        quarterMileS: 13.4,
        quarterMileTrapMph: 105
      },
      conditions: {},
      match: "exact",
      verification: "Aggregator listing that attributes the run to the publication; original page not reachable. Listed as a 2020 S209 (same car).",
      date: "2020"
    }
  ],
  dataGaps: [
    "MotorTrend first test (roster source) figures",
    "Power/torque rpm",
    "AWD split range",
    "Drag coefficient"
  ],
  notes: [
    "A MotorTrend video summary quotes a 14.1 s quarter mile; it conflicts with the other tests and is not transcribed."
  ],
  sim: buildSpec({
  id: "2019-subaru-wrx-sti-s209-us-sedan-awd-6mt",
  make: "Subaru",
  model: "WRX STI",
  trim: "S209",
  modelYear: 2019,
  market: "US",
  body: "Sedan",
  shortName: "Subaru WRX STI S209"
}, {
    engine: { code: 'EJ257', description: '2.5 L turbo flat-4 (S209 large turbo)', displacementCc: 2457, aspiration: 'turbo', idleRpm: 750, redlineRpm: 6700, revLimitRpm: 6900, power: { value: 341, unit: 'hp', rpm: [6400, 6400] }, torque: { value: 330, unit: 'lb-ft', rpm: [3600, 3600] }, peakBoostBar: 1.3 },
    transmission: { type: 'manual', name: '6-speed manual', gearRatios: [3.636, 2.235, 1.591, 1.138, 0.971, 0.756], finalDrive: 3.9 },
    drivetrain: { layout: 'AWD', efficiency: 0.868, description: 'Symmetrical AWD with Driver Controlled Centre Differential (41:59 base)', frontShareRange: [0.3, 0.5] },
    chassis: { curbMassKg: 1581, frontWeightFraction: 0.6, wheelbaseM: 2.65, lengthMm: 4640, widthMm: 1840, heightMm: 1475 },
    aero: {},
    tires: { sizes: [square('r19', '265/35 R19', 265, 35, 19, 'Dunlop SP Sport Maxx GT600A (assumed)')], compound: 'uhp', gripScale: 1.3 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.30 (fit bound)', status: 'estimated', source: 'Fit toward the aggregator-listed Car and Driver 0–60 mph 4.4 s stopped at the bound (sim 4.73 s) with the S209-specific gearing' },
      { parameter: 'Drivetrain efficiency', value: '86.8 %', status: 'estimated', source: 'Fitted to the aggregator-listed Car and Driver ¼-mile trap 107 mph' },
      { parameter: 'Gear ratios', value: '3.636/2.235/1.591/1.138/0.971/0.756 (S209-specific)', status: 'verified', source: 'Subaru S209 specifications (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://subarumedia.iconicweb.com/mediasite/attachments/STI_S209_specs-FINAL_10919.pdf' },
      { parameter: 'Final drive', value: '3.900', status: 'verified', source: 'Subaru S209 specifications (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://subarumedia.iconicweb.com/mediasite/attachments/STI_S209_specs-FINAL_10919.pdf' },
      { parameter: 'Peak power', value: '341 hp', status: 'reported', source: 'Subaru rating (Autoblog, Motor1)', url: 'https://www.motor1.com/reviews/442134/2019-subaru-sti-s209-pros-cons/' },
      { parameter: 'Peak torque', value: '330 lb-ft', status: 'reported', source: 'Subaru rating (Autoblog, Motor1)', url: 'https://www.motor1.com/reviews/442134/2019-subaru-sti-s209-pros-cons/' },
      { parameter: 'Power / torque rpm', value: '6,400 / 3,600 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '3,485 lb (1,581 kg)', status: 'reported', source: 'Autoblog and Motor1 listings', url: 'https://www.autoblog.com/buy/2019-Subaru-STI+S209/review/' },
      { parameter: 'AWD split', value: 'Front share 0.30–0.50', status: 'estimated', source: 'DCCD range around the 41:59 base split (recalled)' },
      { parameter: 'Tire size', value: '265/35 R19', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
