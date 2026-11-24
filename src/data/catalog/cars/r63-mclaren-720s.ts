import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #63: 2018 McLaren 720S Coupe (US). */
export const entry: CatalogEntry = {
  id: "2018-mclaren-720s-coupe-us-coupe-rwd-7dct",
  roster: 63,
  section: "Exotics",
  make: "McLaren",
  model: "720S",
  trim: "Coupe",
  modelYear: 2018,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "P14",
  aliases: [
    "720S",
    "P14"
  ],
  origin: "United Kingdom",
  usage: [
    "Supercar",
    "Track"
  ],
  drive: "RWD",
  transmission: "DCT",
  transmissionLabel: "7-speed DCT",
  powertrain: "Petrol",
  engineLabel: "4.0 twin-turbo V8 (M840T)",
  modelPath: "Existing",
  factory: {
    power: "710 PS (700 hp) @ 7,500 rpm",
    torque: "770 Nm (568 lb-ft) @ 5,500 rpm",
    zeroTo60MphS: 2.8,
    sourceId: "src3"
  },
  sources: [
    {
      id: "test",
      title: "2018 McLaren 720S instrumented test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a19862504/2018-mclaren-720s-instrumented-test-review/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "McLaren 720S 0–60 times",
      publisher: "0-60specs",
      url: "https://www.0-60specs.com/mclaren/720s-0-60-times",
      kind: "reference"
    },
    {
      id: "src3",
      title: "2018 McLaren 720S review",
      publisher: "Motor1",
      url: "https://www.motor1.com/reviews/225841/2018-mclaren-720s/",
      kind: "reference"
    },
    {
      id: "src-mclaren",
      title: "Super Series owner handbook (US), page 7.5",
      publisher: "McLaren",
      url: "https://mclaren-web.s3.eu-west-2.amazonaws.com/files/Owner%20Manual%20-%20Super%20Series%20-%20US%20-%20English.pdf",
      kind: "manufacturer"
    },
    {
      id: "src-cd",
      title: "2018 McLaren 720S instrumented test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a19862504/2018-mclaren-720s-instrumented-test-review/",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src-cd",
      publication: "Car and Driver",
      timing: "unconfirmed",
      timingNote: "Car and Driver test published before its late-2019 move to a 1-ft rollout; the earlier procedure is not confirmed here, so both simulator bases are shown.",
      results: {
        zeroTo60MphS: 2.7,
        quarterMileS: 10.2,
        quarterMileTrapMph: 145
      },
      conditions: {
        testMass: "3,161 lb",
        tires: "Pirelli P Zero Corsa"
      },
      match: "exact",
      verification: "Original test as transcribed in the owner-supplied spec-sheet follow-up, 2026-11; instrumented test.",
      date: "2018"
    }
  ],
  dataGaps: [
    "Drag coefficient",
    "Tire sizes",
    "Weight distribution",
    "Power/torque rpm detail"
  ],
  sim: buildSpec({
  id: "2018-mclaren-720s-coupe-us-coupe-rwd-7dct",
  make: "McLaren",
  model: "720S",
  trim: "Coupe",
  modelYear: 2018,
  market: "US",
  body: "Coupe",
  shortName: "McLaren 720S"
}, {
    engine: { code: 'M840T', description: '4.0 L twin-turbo flat-plane V8', displacementCc: 3994, aspiration: 'twin-turbo', idleRpm: 800, redlineRpm: 8100, revLimitRpm: 8500, power: { value: 710, unit: 'PS', rpm: [7500, 7500] }, torque: { value: 770, unit: 'Nm', rpm: [5500, 5500] }, peakBoostBar: 1.5 },
    transmission: { type: 'dual-clutch', name: '7-speed SSG dual-clutch', gearRatios: [3.982, 2.612, 1.905, 1.479, 1.16, 0.906, 0.686], finalDrive: 3.308, upshiftTimeS: 0.1, shiftTorqueDip: 0.12, launchClutch: { launchRpm: 4500, brakeHoldRpmLimit: 4500 } },
    drivetrain: { layout: 'RWD', efficiency: 0.9, description: 'Rear-wheel drive, open differential with brake steer' },
    chassis: { curbMassKg: 1434, frontWeightFraction: 0.42, cgHeightM: 0.42, wheelbaseM: 2.67, lengthMm: 4543, widthMm: 1930, heightMm: 1196 },
    aero: {},
    tires: { sizes: [staggered('r19r20', '245/35 R19 F · 305/30 R20 R', { widthMm: 245, aspectPct: 35, rimIn: 19 }, { widthMm: 305, aspectPct: 30, rimIn: 20 }, 'Pirelli P Zero Corsa (Car and Driver test car)')], compound: 'semi-slick', gripScale: 1.13 },
    speedLimiterKmh: null,
    factory: { zeroTo60MphS: 2.8 },
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.13', status: 'estimated', source: 'Fitted to the Car and Driver 0–60 mph 2.7 s' },
      { parameter: 'Drivetrain efficiency', value: '90 %', status: 'estimated', source: 'Fitted to the Car and Driver ¼-mile trap 145 mph (fit asked 90.2 %; capped at the 90 % bound)' },
      { parameter: 'Peak power', value: '710 PS (700 hp) @ 7,500 rpm', status: 'reported', source: 'McLaren rating (Motor1 listing)', url: 'https://www.motor1.com/reviews/225841/2018-mclaren-720s/' },
      { parameter: 'Peak torque', value: '770 Nm (568 lb-ft) @ 5,500 rpm', status: 'reported', source: 'McLaren rating (Motor1 listing)', url: 'https://www.motor1.com/reviews/225841/2018-mclaren-720s/' },
      { parameter: 'Gear ratios', value: '3.982/2.612/1.905/1.479/1.160/0.906/0.686', status: 'verified', source: 'McLaren US Super Series owner handbook, p. 7.5 (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://mclaren-web.s3.eu-west-2.amazonaws.com/files/Owner%20Manual%20-%20Super%20Series%20-%20US%20-%20English.pdf' },
      { parameter: 'Final drive', value: '3.308', status: 'verified', source: 'McLaren US Super Series owner handbook, p. 7.5 (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://mclaren-web.s3.eu-west-2.amazonaws.com/files/Owner%20Manual%20-%20Super%20Series%20-%20US%20-%20English.pdf' },
      { parameter: 'Curb mass', value: '3,161 lb (1,434 kg) as tested (factory dry weight is a different measure)', status: 'reported', source: 'Car and Driver test (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.caranddriver.com/reviews/a19862504/2018-mclaren-720s-instrumented-test-review/' },
      { parameter: 'Tire size', value: '245/35 R19 F · 305/30 R20 R', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Tire compound', value: 'Track semi-slick class', status: 'estimated', source: 'Pirelli P Zero Corsa on the test car' },
      { parameter: 'Weight distribution', value: '42 % front', status: 'estimated', source: 'Typical mid-engine figure; not published here' },
      { parameter: 'Launch rpm', value: '≈4,500 rpm', status: 'estimated', source: 'Typical launch-control hold; not published' },
      { parameter: 'Dimensions', value: '4,543 × 1,930 × 1,196 mm, WB 2,670 mm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
