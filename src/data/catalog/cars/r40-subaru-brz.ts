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
    }
  ],
  benchmarks: [],
  dataGaps: [
    "MotorTrend automatic test results (linked page unreachable)",
    "Car and Driver automatic test numbers (syndicated page found, figures not in summary)",
    "Final drive (4.10 vs 3.91 conflict; 4.10 used)",
    "Tire size and model (215/40 R18 Michelin Pilot Sport 4 assumed for Limited)",
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
      gearRatios: [3.538, 2.06, 1.404, 1.0, 0.713, 0.582], finalDrive: 4.1,
      upshiftTimeS: 0.32, torqueConverter: { stallRpm: 2300 },
    },
    drivetrain: { layout: 'RWD', description: 'Rear-wheel drive with Torsen limited-slip differential' },
    chassis: { curbMassKg: 1299, frontWeightFraction: 0.54, cgHeightM: 0.46, wheelbaseM: 2.576, lengthMm: 4265, widthMm: 1775, heightMm: 1310 },
    aero: {},
    tires: { sizes: [square('r18', '215/40 R18', 215, 40, 18, 'Limited fitment (assumed)'), square('r17', '215/45 R17', 215, 45, 17, 'Premium fitment')], compound: 'uhp' },
    speedLimiterKmh: null,
    factory: { zeroTo60MphS: 6.5 },
    provenance: [
      { parameter: 'Peak power', value: '228 hp @ 7,000 rpm', status: 'reported', source: 'Subaru US rating', url: 'https://www.auto123.com/en/specs/subaru/brz/subaru-brz-2022-auto-424879' },
      { parameter: 'Peak torque', value: '184 lb-ft @ 3,700 rpm', status: 'reported', source: 'Subaru US rating', url: 'https://www.auto123.com/en/specs/subaru/brz/subaru-brz-2022-auto-424879' },
      { parameter: 'Gear ratios', value: '3.538/2.060/1.404/1.000/0.713/0.582', status: 'reported', source: 'Specification listings (1st, 2nd, 3rd, 6th confirmed; 5th recalled)', url: 'https://www.auto123.com/en/specs/subaru/brz/subaru-brz-2022-auto-424879' },
      { parameter: 'Final drive', value: '4.10', status: 'reported', source: 'One listing gives 4.10, another 3.91', url: 'https://www.auto123.com/en/specs/subaru/brz/subaru-brz-2022-auto-424879' },
      { parameter: 'Curb mass', value: '≈2,864 lb (1,299 kg)', status: 'reported', source: 'Specification listings and comparison test (2,863 lb)' },
      { parameter: 'Tire compound', value: 'Ultra-high-performance class', status: 'estimated', source: 'Limited ships on Michelin Pilot Sport 4 (not confirmed in a reachable source)' },
      { parameter: 'Dimensions', value: '4,265 × 1,775 × 1,310 mm, WB 2,576 mm', status: 'estimated', source: 'Recalled Subaru figures; not verified' },
    ],
  }),
};
