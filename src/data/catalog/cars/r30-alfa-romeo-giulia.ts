import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #30: 2017 Alfa Romeo Giulia Quadrifoglio (US). */
export const entry: CatalogEntry = {
  id: "2017-alfa-romeo-giulia-quadrifoglio-us-sedan-rwd-8at",
  roster: 30,
  section: "Luxury and sport sedans",
  make: "Alfa Romeo",
  model: "Giulia",
  trim: "Quadrifoglio",
  modelYear: 2017,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "952",
  aliases: [
    "Giulia QV",
    "Quadrifoglio",
    "952",
    "Alfa"
  ],
  origin: "Italy",
  usage: [
    "Sport Sedan",
    "Track"
  ],
  drive: "RWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic",
  powertrain: "Petrol",
  engineLabel: "2.9 twin-turbo V6",
  modelPath: "Existing",
  factory: {
    power: "505 hp",
    torque: "443 lb-ft",
    zeroTo60MphS: 3.8,
    topSpeed: "191 mph",
    sourceId: "test"
  },
  sources: [
    {
      id: "test",
      title: "2017 Alfa Romeo Giulia Quadrifoglio test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15098913/2017-alfa-romeo-giulia-quadrifoglio-test-review/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Giulia 0–60 times",
      publisher: "0-60specs",
      url: "https://www.0-60specs.com/alfa-romeo/giulia-0-60-times",
      kind: "reference"
    },
    {
      id: "src3",
      title: "2017 Giulia Quadrifoglio vs M3, ATS-V, C63 S (comparison)",
      publisher: "Car and Driver (Yahoo syndication)",
      url: "https://autos.yahoo.com/2017-alfa-romeo-giulia-quadrifoglio-223000324.html",
      kind: "road-test"
    },
    {
      id: "src-nhtsa",
      title: "Giulia technical submission",
      publisher: "Alfa Romeo (NHTSA archive)",
      url: "https://downloads.regulations.gov/NHTSA-2018-0067-12500/attachment_3.pdf",
      kind: "manufacturer"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src3",
      publication: "Car and Driver",
      timing: "unconfirmed",
      timingNote: "Car and Driver test published before its late-2019 move to a 1-ft rollout; the earlier procedure is not confirmed here, so both simulator bases are shown.",
      results: {
        zeroTo60MphS: 3.7,
        quarterMileS: 11.9
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment). An aggregator lists 3.6 s for a Car and Driver run; the comparison test gives 3.7 s.",
      date: "2017-03"
    }
  ],
  dataGaps: [
    "Car and Driver trap speed and test weight",
    "Power/torque rpm",
    "Tire size"
  ],
  sim: buildSpec({
  id: "2017-alfa-romeo-giulia-quadrifoglio-us-sedan-rwd-8at",
  make: "Alfa Romeo",
  model: "Giulia",
  trim: "Quadrifoglio",
  modelYear: 2017,
  market: "US",
  body: "Sedan",
  shortName: "Alfa Giulia Quadrifoglio"
}, {
    engine: { code: '690T', description: '2.9 L twin-turbo V6', displacementCc: 2891, aspiration: 'twin-turbo', idleRpm: 700, redlineRpm: 7000, revLimitRpm: 7200, power: { value: 505, unit: 'hp', rpm: [6500, 6500] }, torque: { value: 443, unit: 'lb-ft', rpm: [2500, 5500] }, peakBoostBar: 1.4 },
    transmission: { type: 'torque-converter-automatic', name: '8-speed automatic (ZF 8HP)', gearRatios: [5.0, 3.2, 2.143, 1.72, 1.313, 1.0, 0.823, 0.64], finalDrive: 3.09, upshiftTimeS: 0.18, downshiftTimeS: 0.28, shiftTorqueDip: 0.3, torqueConverter: { stallRpm: 2500 } },
    drivetrain: { layout: 'RWD', description: 'Rear-wheel drive with torque-vectoring differential' },
    chassis: { curbMassKg: 1734, frontWeightFraction: 0.5, wheelbaseM: 2.82, lengthMm: 4639, widthMm: 1873, heightMm: 1426 },
    aero: { dragCoefficient: 0.32 },
    tires: { sizes: [staggered('r19', '245/35 R19 F · 285/30 R19 R', { widthMm: 245, aspectPct: 35, rimIn: 19 }, { widthMm: 285, aspectPct: 30, rimIn: 19 }, 'Pirelli P Zero Corsa (assumed)')], compound: 'uhp', gripScale: 1.18 },
    speedLimiterKmh: 307,
    factory: { zeroTo60MphS: 3.8 },
    provenance: [
      { parameter: 'Final drive', value: '3.09', status: 'verified', source: 'Alfa Romeo US technical submission (NHTSA archive) (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://downloads.regulations.gov/NHTSA-2018-0067-12500/attachment_3.pdf' },
      { parameter: 'Drag coefficient', value: 'Cd 0.32', status: 'verified', source: 'Alfa Romeo US technical submission (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://downloads.regulations.gov/NHTSA-2018-0067-12500/attachment_3.pdf' },
      { parameter: 'Tire grip calibration', value: '×1.18', status: 'estimated', source: 'Fitted to the Car and Driver 0–60 mph 3.7 s' },
      { parameter: 'Peak power', value: '505 hp', status: 'reported', source: 'Alfa Romeo rating (reviews)', url: 'https://autos.yahoo.com/2017-alfa-romeo-giulia-quadrifoglio-164700328.html' },
      { parameter: 'Peak torque', value: '443 lb-ft', status: 'reported', source: 'Alfa Romeo rating (reviews)', url: 'https://autos.yahoo.com/2017-alfa-romeo-giulia-quadrifoglio-164700328.html' },
      { parameter: 'Power / torque rpm', value: '6,500 / 2,500–5,500 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Gear ratios', value: '5.000/3.200/2.143/1.720/1.313/1.000/0.823/0.640 (ZF 8HP)', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '3,822 lb (1,734 kg)', status: 'reported', source: 'Specification listing (not tied to the test)' },
      { parameter: 'Top speed', value: '307 km/h (191 mph)', status: 'estimated', source: 'Alfa Romeo claim as commonly cited' },
    ],
  }),
};
