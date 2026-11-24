import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #40: 2022 Subaru BRZ Limited 6AT (US). */
export const entry: CatalogEntry = {
  id: "2022-subaru-brz-limited-6at-us-coupe-rwd-6at",
  roster: 40,
  section: "Sports cars",
  make: "Subaru",
  model: "BRZ",
  trim: "Limited 6AT",
  modelYear: 2022,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "ZD8",
  aliases: [
    "BRZ",
    "ZD8"
  ],
  origin: "Japan",
  usage: [
    "Sports Car"
  ],
  drive: "RWD",
  transmission: "AT",
  transmissionLabel: "6-speed automatic",
  powertrain: "Petrol",
  engineLabel: "2.4 flat-4 (FA24D)",
  modelPath: "Existing",
  factory: {
    power: "228 hp @ 7,000 rpm",
    torque: "184 lb-ft @ 3,700 rpm",
    curbMass: "≈2,864 lb (automatic)",
    zeroTo60MphS: 6.5,
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2022 Subaru BRZ manual and automatic first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2022-subaru-brz-manual-automatic-first-test-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2022 Subaru BRZ automatic specifications",
      publisher: "auto123",
      url: "https://www.auto123.com/en/specs/subaru/brz/subaru-brz-2022-auto-424879",
      kind: "reference"
    },
    {
      id: "src3",
      title: "2022 Subaru BRZ review",
      publisher: "Motor1",
      url: "https://www.motor1.com/reviews/582197/2022-subaru-brz-review/",
      kind: "reference"
    },
    {
      id: "src4",
      title: "Tested: 2022 Subaru BRZ Automatic Makes Fun Easy",
      publisher: "Car and Driver (Yahoo syndication)",
      url: "https://news.yahoo.com/tested-2022-subaru-brz-automatic-210100923.html",
      kind: "road-test"
    },
    {
      id: "src-sub22",
      title: "MY2022 BRZ specifications",
      publisher: "Subaru of America",
      url: "https://s3.amazonaws.com/subarumedia.iconicweb.com/mediasite/attachments/22MY_BRZ_-_Specs_-FINAL.pdf",
      kind: "manufacturer"
    },
    {
      id: "src-cd-premium",
      title: "2022 Subaru BRZ Premium automatic by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a41284636/2022-subaru-brz-premium-automatic-by-the-numbers/",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "mt",
      sourceId: "test",
      publication: "MotorTrend",
      timing: "rollout-1ft",
      timingNote: "MotorTrend subtracts a 1-ft rollout from its acceleration times.",
      results: {
        zeroTo60MphS: 6.6,
        quarterMileS: 14.9,
        quarterMileTrapMph: 97.0
      },
      conditions: {
        testMass: "2,878 lb as tested (56/44)",
        tires: "Michelin Pilot Sport 4, 215/40 R18",
        launchControl: "Best launch brake-torqued with both pedals at about 2,200 rpm"
      },
      match: "exact",
      verification: "Original MotorTrend automatic-column result, as transcribed in the Codex inspection handoff, 2026-11.",
      date: "2021"
    }
  ],
  dataGaps: [
    "Car and Driver Premium automatic numbers (different trim and tires; equivalent only)",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "2022-subaru-brz-limited-6at-us-coupe-rwd-6at",
  make: "Subaru",
  model: "BRZ",
  trim: "Limited 6AT",
  modelYear: 2022,
  market: "US",
  body: "Coupe",
  shortName: "Subaru BRZ 6AT"
}, {
    engine: {
      code: 'FA24D', description: '2.4 L flat-4, D-4S direct + port injection', displacementCc: 2387, aspiration: 'na',
      idleRpm: 700, redlineRpm: 7500, revLimitRpm: 7500,
      power: { value: 228, unit: 'hp', rpm: [7000, 7000] },
      torque: { value: 184, unit: 'lb-ft', rpm: [3700, 3700] },
      lowEndFraction: 0.75, topEndPowerFraction: 0.97,
    },
    transmission: {
      type: 'torque-converter-automatic', name: '6-speed automatic (Aisin)',
      gearRatios: [3.538, 2.06, 1.405, 1.0, 0.713, 0.582], finalDrive: 3.909,
      upshiftTimeS: 0.32, torqueConverter: { stallRpm: 2300 },
    },
    drivetrain: { layout: 'RWD', efficiency: 0.865, description: 'Rear-wheel drive with Torsen limited-slip differential' },
    chassis: { curbMassKg: 1299, frontWeightFraction: 0.56, cgHeightM: 0.456, wheelbaseM: 2.576, lengthMm: 4265, widthMm: 1775, heightMm: 1310 },
    aero: {},
    tires: { sizes: [square('r18', '215/40 R18', 215, 40, 18, 'Limited fitment, Michelin Pilot Sport 4'), square('r17', '215/45 R17', 215, 45, 17, 'Premium fitment')], compound: 'uhp', gripScale: 1.0 },
    speedLimiterKmh: null,
    factory: { zeroTo60MphS: 6.5 },
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.00', status: 'estimated', source: 'Grip at its 1.00 floor: the MotorTrend Limited automatic took 6.6 s (1-ft rollout) where the simulation reaches 60 mph in ≈5.95 s; the converter-launch model (estimated 2,300 rpm stall, 1.9:1 multiplication) likely overstates low-speed thrust, so the residual is left visible' },
      { parameter: 'Drivetrain efficiency', value: '86.5 %', status: 'estimated', source: 'Fitted to the MotorTrend ¼-mile trap 97.0 mph' },
      { parameter: 'Tire size', value: '215/40 R18 Michelin Pilot Sport 4 (Limited)', status: 'reported', source: 'MotorTrend Limited automatic test car', url: 'https://www.motortrend.com/reviews/2022-subaru-brz-manual-automatic-first-test-review' },
      { parameter: 'Weight distribution', value: '56/44 front/rear (as tested)', status: 'reported', source: 'MotorTrend Limited automatic test car', url: 'https://www.motortrend.com/reviews/2022-subaru-brz-manual-automatic-first-test-review' },
      { parameter: 'Gear ratios', value: '3.538/2.060/1.405/1.000/0.713/0.582 (6AT)', status: 'verified', source: 'Subaru US MY2022 engineering sheet (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://s3.amazonaws.com/subarumedia.iconicweb.com/mediasite/attachments/22MY_BRZ_-_Specs_-FINAL.pdf' },
      { parameter: 'Final drive', value: '3.909 (6AT; 4.100 is the 6MT)', status: 'verified', source: 'Subaru US MY2022 engineering sheet (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://s3.amazonaws.com/subarumedia.iconicweb.com/mediasite/attachments/22MY_BRZ_-_Specs_-FINAL.pdf' },
      { parameter: 'CG height', value: '17.95 in (0.456 m)', status: 'verified', source: 'Subaru US MY2022 engineering sheet (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://s3.amazonaws.com/subarumedia.iconicweb.com/mediasite/attachments/22MY_BRZ_-_Specs_-FINAL.pdf' },
      { parameter: 'Peak power', value: '228 hp @ 7,000 rpm', status: 'reported', source: 'Subaru US rating', url: 'https://www.auto123.com/en/specs/subaru/brz/subaru-brz-2022-auto-424879' },
      { parameter: 'Peak torque', value: '184 lb-ft @ 3,700 rpm', status: 'reported', source: 'Subaru US rating', url: 'https://www.auto123.com/en/specs/subaru/brz/subaru-brz-2022-auto-424879' },
      { parameter: 'Curb mass', value: '≈2,864 lb (1,299 kg)', status: 'reported', source: 'Specification listings and comparison test (2,863 lb)' },
      { parameter: 'Dimensions', value: '4,265 × 1,775 × 1,310 mm, WB 2,576 mm', status: 'estimated', source: 'Recalled Subaru figures; not verified' },
    ],
  }),
};
