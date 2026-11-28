import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Fitted to the MotorTrend Assetto Fiorano test (1-ft rollout). */
const GRIP = 1.15;
const EFF = 0.78;
/** 8-speed DCT: not published; geometric steps from ≈ 90 km/h in 1st to 340 km/h at ≈ 7,800 rpm in 8th. */
const RATIOS = [3.19, 2.63, 2.17, 1.79, 1.48, 1.22, 1.0, 0.83];


/** Roster #66: 2021 Ferrari SF90 Stradale Assetto Fiorano (US). */
export const entry: CatalogEntry = {
  id: "2021-ferrari-sf90-stradale-assetto-fiorano-us-coupe-awd-8dct",
  roster: 66,
  section: "Exotics",
  make: "Ferrari",
  model: "SF90 Stradale",
  trim: "Assetto Fiorano",
  modelYear: 2021,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "F173",
  aliases: [
    "SF90",
    "Assetto Fiorano"
  ],
  origin: "Italy",
  usage: [
    "Supercar",
    "Track"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "8-speed DCT + three motors",
  powertrain: "Plug-in hybrid",
  engineLabel: "4.0 twin-turbo V8 + 3 motors",
  modelPath: "Hybrid",
  factory: {
    power: "986 hp (1,000 CV, system)",
    curbMass: "≈1,570 kg (CarSales)",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2021 Ferrari SF90 Stradale Assetto Fiorano first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2021-ferrari-sf90-stradale-assetto-fiorano-first-test-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Ferrari SF90 Assetto Fiorano 2021 review",
      publisher: "CarSales (AU)",
      url: "https://www.carsales.com.au/editorial/details/ferrari-sf90-assetto-fiorano-2021-review-130922",
      kind: "reference"
    },
    {
      id: "src-cd",
      title: "Ferrari SF90 Stradale hits 60 mph in 2.0 s",
      publisher: "Carscoops (citing Car and Driver)",
      url: "https://www.carscoops.com/2021/07/ferrari-sf90-stradale-hits-60-mph-in-2-0-sec-becomes-c-ds-quickest-production-car-ever-tested/",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src-cd",
      publication: "Car and Driver (as cited by Carscoops)",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 2.0,
        quarterMileS: 9.5,
        quarterMileTrapMph: 148
      },
      conditions: {},
      match: "equivalent",
      verification: "Second-hand citation; original page not reachable.",
      date: "2021",
      deviation: "Assetto Fiorano package not confirmed for this test car."
    },
    {
      id: "mt",
      sourceId: "test",
      publication: "MotorTrend",
      timing: "rollout-1ft",
      timingNote: "MotorTrend subtracts a 1-ft rollout from its acceleration times.",
      results: {
        zeroTo60MphS: 2.1,
        quarterMileS: 9.6,
        quarterMileTrapMph: 145.2
      },
      conditions: {
        testMass: "3,839 lb as tested",
        other: [
          "Assetto Fiorano package"
        ]
      },
      match: "exact",
      verification: "Original MotorTrend Assetto Fiorano first test, checked in the Codex inspection of d6e2b40 (2026-11-24).",
      date: "2021"
    }
  ],
  dataGaps: [
    "Hybrid system power split",
    "8-speed DCT ratios",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "2021-ferrari-sf90-stradale-assetto-fiorano-us-coupe-awd-8dct",
  make: "Ferrari",
  model: "SF90 Stradale",
  trim: "Assetto Fiorano",
  modelYear: 2021,
  market: "US",
  body: "Coupe",
  shortName: "Ferrari SF90 Stradale AF"
}, {
    engine: { code: 'F154FA', description: '4.0 L twin-turbo V8', displacementCc: 3990, aspiration: 'twin-turbo', idleRpm: 900, redlineRpm: 8000, revLimitRpm: 8100, power: { value: 780, unit: 'PS', rpm: [7500, 7500] }, torque: { value: 800, unit: 'Nm', rpm: [6000, 6000] }, peakBoostBar: 1.4 },
    transmission: { type: 'dual-clutch', name: '8-speed DCT', gearRatios: RATIOS, finalDrive: 3.6, upshiftTimeS: 0.1, launchClutch: { launchRpm: 3500, brakeHoldRpmLimit: 3500 } },
    drivetrain: { layout: 'AWD', efficiency: EFF, frontShareRange: [0, 0.35], description: 'Engine and MGUK to the rear through the 8-speed DCT; two front motors (RAC-e) on the front axle' },
    chassis: { curbMassKg: 1741, frontWeightFraction: 0.45, wheelbaseM: 2.65, lengthMm: 4710, widthMm: 1972, heightMm: 1186 },
    aero: {},
    tires: { sizes: [staggered('r20', '255/35 R20 front, 315/30 R20 rear', { widthMm: 255, aspectPct: 35, rimIn: 20 }, { widthMm: 315, aspectPct: 30, rimIn: 20 }, 'Assumed standard size')], compound: 'uhp', gripScale: GRIP },
    speedLimiterKmh: 340,
    factory: { topSpeedKmh: 340 },
    hybrid: { description: 'Three motors: MGUK between engine and gearbox, two front motors (RAC-e) that decouple at speed', inputMotor: { peakPowerKw: 80, peakTorqueNm: 250, maxRpm: 8100 }, axleMotors: [{ axle: 'front', peakPowerKw: 45, peakTorqueNm: 120, maxRpm: 16300, reduction: 10 }, { axle: 'front', peakPowerKw: 45, peakTorqueNm: 120, maxRpm: 16300, reduction: 10 }], systemPowerKw: 735, batteryPowerKw: 162 },
    provenance: [
      { parameter: 'System output', value: '1,000 CV (986 hp, 735 kW)', status: 'reported', source: 'Ferrari system rating as transcribed in this entry' },
      { parameter: 'Peak power', value: 'Engine 780 CV @ 7,500 rpm (system rating in the row above)', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate)' },
      { parameter: 'Peak torque', value: 'Engine 800 Nm @ 6,000 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate)' },
      { parameter: 'Hybrid motors', value: 'MGUK 80 kW / 250 Nm on the engine shaft; front 2 × 45 kW / 120 Nm through 10:1, cut above ≈ 211 km/h; battery limit 162 kW (220 CV electric); system limit 735 kW', status: 'estimated', source: 'Ferrari gives 220 CV of electric output from three motors; the split, torques and reductions are assumptions. Hybrid model: full deployment on demand within the battery and system limits; charge state, temperature, regeneration and the manufacturer deployment strategy are not modelled' },
      { parameter: 'Gear ratios', value: `8-speed ${RATIOS.join(' / ')}, final drive 3.6`, status: 'estimated', source: 'Not published; geometric steps sized so 1st reaches ≈ 90 km/h and 8th 340 km/h at ≈ 7,800 rpm' },
      { parameter: 'Curb mass', value: '1,741 kg (3,839 lb MotorTrend test mass)', status: 'reported', source: 'MotorTrend test as transcribed in this entry' },
      { parameter: 'Weight distribution', value: '45 % front', status: 'estimated', source: 'Mid-engine with front motors; not published' },
      { parameter: 'AWD split', value: 'Front share 0–35 % (front motors only)', status: 'estimated', source: 'The front axle is driven only by its motors; one shared traction limit with the front share capped' },
      { parameter: 'Tire size', value: '255/35 R20 front, 315/30 R20 rear', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate)' },
      { parameter: 'Dimensions', value: '4,710 × 1,972 × 1,186 mm, WB 2,650 mm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate)' },
      { parameter: 'Top speed', value: '340 km/h', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate)' },
      { parameter: 'Tire grip calibration', value: `×${GRIP}`, status: 'estimated', source: 'Fitted to the MotorTrend 0–60 mph 2.1 s (1-ft rollout): sim 2.10 s' },
      { parameter: 'Drivetrain efficiency', value: `${Math.round(EFF * 1000) / 10} %`, status: 'estimated', source: 'Fitted to the MotorTrend ¼ mile 9.6 s @ 145.2 mph: sim 9.51 s @ 146.3 mph (rollout). Low because the assumed motor split and DCT ratios carry the uncertainty' },
    ],
  }),
};
