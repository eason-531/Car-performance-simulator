import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #8: 1997 Acura Integra Type R (US). */
export const entry: CatalogEntry = {
  id: "1997-acura-integra-type-r-us-liftback-fwd-5mt",
  roster: 8,
  section: "Hot hatches",
  make: "Acura",
  model: "Integra",
  trim: "Type R",
  modelYear: 1997,
  market: "US",
  body: "Liftback",
  bodyLabel: "3-door liftback",
  chassisCode: "DC2",
  aliases: [
    "ITR",
    "Integra Type R",
    "DC2"
  ],
  origin: "Japan",
  usage: [
    "Hot Hatch",
    "Sport Compact",
    "Track"
  ],
  drive: "FWD",
  transmission: "MT",
  transmissionLabel: "5-speed manual",
  powertrain: "Petrol",
  engineLabel: "1.8 I4 (B18C5)",
  modelPath: "MT",
  factory: {
    power: "195 hp (SAE) @ 8,000 rpm",
    torque: "130 lb-ft @ 7,500 rpm",
    sourceId: "src-acura"
  },
  sources: [
    {
      id: "test",
      title: "1997 Acura Integra Type R archived test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15141504/1997-acura-integra-type-r-archived-test-review/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Honda Integra Type-R (1997–2001) specs",
      publisher: "Parkers",
      url: "https://parkers.co.uk/honda/integra-type-r/coupe-1997/specs",
      kind: "reference"
    },
    {
      id: "src-acura",
      title: "Acura Integra Type R US specifications (1997)",
      publisher: "Acura (brochure archive)",
      url: "https://www.auto-brochures.com/makes/acura/integra/Acura_US%20Integra-R_1997.pdf",
      kind: "manufacturer"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "test",
      publication: "Car and Driver",
      timing: "unconfirmed",
      timingNote: "Car and Driver test published before its late-2019 move to a 1-ft rollout; the earlier procedure is not confirmed here, so both simulator bases are shown.",
      results: {
        zeroTo60MphS: 6.6,
        quarterMileS: 15.2,
        quarterMileTrapMph: 93
      },
      conditions: {
        testMass: "2,560 lb"
      },
      match: "exact",
      verification: "Original test as transcribed in the owner-supplied spec-sheet follow-up, 2026-11; archived test.",
      date: "1997"
    }
  ],
  dataGaps: [
    "Factory curb mass (2,560 lb is Car and Driver’s scale weight)",
    "Drag coefficient",
    "Weight distribution",
    "Dimensions"
  ],
  notes: [
    "Car and Driver describes a drag reduction relative to the GS-R but gives no absolute Cd."
  ],
  sim: buildSpec({
  id: "1997-acura-integra-type-r-us-liftback-fwd-5mt",
  make: "Acura",
  model: "Integra",
  trim: "Type R",
  modelYear: 1997,
  market: "US",
  body: "Liftback",
  shortName: "Acura Integra Type R (1997)"
}, {
    engine: { code: 'B18C5', description: '1.8 L DOHC VTEC I4', displacementCc: 1797, aspiration: 'na', idleRpm: 750, redlineRpm: 8400, revLimitRpm: 8500, power: { value: 195, unit: 'hp', rpm: [8000, 8000] }, torque: { value: 130, unit: 'lb-ft', rpm: [7500, 7500] }, lowEndFraction: 0.62 },
    transmission: { type: 'manual', name: '5-speed manual', gearRatios: [3.25, 2.105, 1.458, 1.107, 0.848], finalDrive: 4.4 },
    drivetrain: { layout: 'FWD', efficiency: 0.854, description: 'Front-wheel drive, helical limited-slip differential' },
    chassis: { curbMassKg: 1161, frontWeightFraction: 0.62, wheelbaseM: 2.57, lengthMm: 4380, widthMm: 1710, heightMm: 1335 },
    aero: {},
    tires: { sizes: [square('r15', '195/55 R15', 195, 55, 15, 'Bridgestone Potenza RE010 (OE)')], compound: 'oe-performance', gripScale: 1.3 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.30 (fit bound)', status: 'estimated', source: 'Fit toward the Car and Driver 0–60 mph 6.6 s stopped at the bound (sim 6.67 s)' },
      { parameter: 'Drivetrain efficiency', value: '85.4 %', status: 'estimated', source: 'Fitted to the Car and Driver ¼-mile trap 93 mph' },
      { parameter: 'Peak power', value: '195 hp (SAE) @ 8,000 rpm', status: 'verified', source: 'Acura US Type R specifications (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.auto-brochures.com/makes/acura/integra/Acura_US%20Integra-R_1997.pdf' },
      { parameter: 'Peak torque', value: '130 lb-ft @ 7,500 rpm', status: 'verified', source: 'Acura US Type R specifications (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.auto-brochures.com/makes/acura/integra/Acura_US%20Integra-R_1997.pdf' },
      { parameter: 'Redline / fuel cut', value: '8,400 / 8,500 rpm', status: 'verified', source: 'Acura US Type R specifications (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.auto-brochures.com/makes/acura/integra/Acura_US%20Integra-R_1997.pdf' },
      { parameter: 'Gear ratios', value: '3.250/2.105/1.458/1.107/0.848', status: 'verified', source: 'Acura US Type R specifications (not the general Integra/GS-R table) (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.auto-brochures.com/makes/acura/integra/Acura_US%20Integra-R_1997.pdf' },
      { parameter: 'Final drive', value: '4.400', status: 'verified', source: 'Acura US Type R specifications (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.auto-brochures.com/makes/acura/integra/Acura_US%20Integra-R_1997.pdf' },
      { parameter: 'Curb mass', value: '2,560 lb (1,161 kg) as weighed by Car and Driver', status: 'reported', source: 'Car and Driver test (factory curb not in the sheet) (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.caranddriver.com/reviews/a15141504/1997-acura-integra-type-r-archived-test-review/' },
      { parameter: 'Tire size', value: '195/55 R15 Bridgestone RE010', status: 'verified', source: 'Acura US Type R specifications (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.auto-brochures.com/makes/acura/integra/Acura_US%20Integra-R_1997.pdf' },
      { parameter: 'Weight distribution', value: '62 % front', status: 'estimated', source: 'Typical for this platform; no source found' },
      { parameter: 'Dimensions', value: '4,380 × 1,710 × 1,335 mm, WB 2,570 mm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
