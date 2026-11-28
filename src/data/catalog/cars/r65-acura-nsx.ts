import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Fitted to the Car and Driver 0–60 mph and ¼-mile trap (timing basis unconfirmed; rollout basis used). */
const GRIP = 0.85;
const EFF = 0.81;


/** Roster #65: 2017 Acura NSX NSX (US). */
export const entry: CatalogEntry = {
  id: "2017-acura-nsx-us-coupe-awd-9dct",
  roster: 65,
  section: "Exotics",
  make: "Acura",
  model: "NSX",
  trim: "NSX",
  modelYear: 2017,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "NC1",
  aliases: [
    "NSX",
    "NC1"
  ],
  origin: "Japan",
  usage: [
    "Supercar"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "9-speed DCT + three motors",
  powertrain: "Hybrid",
  engineLabel: "3.5 twin-turbo V6 + 3 motors (Sport Hybrid SH-AWD)",
  modelPath: "Hybrid",
  factory: {
    power: "573 hp (system)",
    torque: "476 lb-ft (system)",
    curbMass: "3,803 lb",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2017 Acura NSX test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15098793/2017-acura-nsx-supercar-full-test-review/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2017 Acura NSX review",
      publisher: "Autoblog",
      url: "https://www.autoblog.com/buy/2017-Acura-NSX/review/",
      kind: "reference"
    },
    {
      id: "src3",
      title: "2017 Acura NSX",
      publisher: "Car and Driver (syndicated on Yahoo)",
      url: "https://autos.yahoo.com/2017-acura-nsx-203000488.html",
      kind: "road-test"
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
        zeroTo60MphS: 3.1,
        quarterMileS: 11.2,
        quarterMileTrapMph: 126
      },
      conditions: {
        testMass: "3,868 lb"
      },
      match: "exact",
      verification: "Syndicated copy of the article (original page not reachable from this environment). The 0–60 time comes from a newspaper spec sheet crediting Car and Driver.",
      date: "2016"
    }
  ],
  dataGaps: [
    "Motor outputs and battery limits",
    "Front-axle torque-vectoring split",
    "Drag coefficient"
  ],
  notes: [
    "A MotorTrend comparison recorded 3.1 s and 11.3 s.",
    "Acura power-unit press kit: 9DCT 3.838/2.433/1.778/1.428/1.211/1.038/0.881/0.747/0.634, rear axle 3.583; the front Twin Motor Unit is described separately.",
    "Playable on bounded estimates: the hybrid drive model adds the direct-drive motor to the engine shaft and the front Twin Motor Unit as axle motors, within battery and system limits. Motor ratings, engine rpm bands, tires and dimensions are recalled, not re-read."
  ],
  sim: buildSpec({
  id: "2017-acura-nsx-us-coupe-awd-9dct",
  make: "Acura",
  model: "NSX",
  trim: "NSX",
  modelYear: 2017,
  market: "US",
  body: "Coupe",
  shortName: "Acura NSX"
}, {
    engine: { code: 'JNC1', description: '3.5 L twin-turbo V6', displacementCc: 3493, aspiration: 'twin-turbo', idleRpm: 800, redlineRpm: 7500, revLimitRpm: 7600, power: { value: 500, unit: 'hp', rpm: [6500, 7500] }, torque: { value: 406, unit: 'lb-ft', rpm: [2000, 6000] }, peakBoostBar: 1.05 },
    transmission: { type: 'dual-clutch', name: '9-speed DCT', gearRatios: [3.838, 2.433, 1.778, 1.428, 1.211, 1.038, 0.881, 0.747, 0.634], finalDrive: 3.583, launchClutch: { launchRpm: 3500, brakeHoldRpmLimit: 3500 } },
    drivetrain: { layout: 'AWD', efficiency: EFF, frontShareRange: [0, 0.3], description: 'Engine and direct-drive motor to the rear through the 9DCT; Twin Motor Unit (two motors) on the front axle' },
    chassis: { curbMassKg: 1755, frontWeightFraction: 0.42, wheelbaseM: 2.63, lengthMm: 4487, widthMm: 1939, heightMm: 1204 },
    aero: {},
    tires: { sizes: [staggered('r19r20', '245/35 R19 front, 305/30 R20 rear', { widthMm: 245, aspectPct: 35, rimIn: 19 }, { widthMm: 305, aspectPct: 30, rimIn: 20 }, 'Assumed standard fitment')], compound: 'uhp', gripScale: GRIP },
    speedLimiterKmh: 307,
    factory: { topSpeedKmh: 307 },
    hybrid: { description: 'Sport Hybrid SH-AWD: direct-drive motor between engine and 9DCT; Twin Motor Unit on the front axle', inputMotor: { peakPowerKw: 35, peakTorqueNm: 148, maxRpm: 7600 }, axleMotors: [{ axle: 'front', peakPowerKw: 27, peakTorqueNm: 73, maxRpm: 16000, reduction: 8.05 }, { axle: 'front', peakPowerKw: 27, peakTorqueNm: 73, maxRpm: 16000, reduction: 8.05 }], systemPowerKw: 427, batteryPowerKw: 89 },
    provenance: [
      { parameter: 'System output', value: '573 hp (427 kW), 476 lb-ft', status: 'reported', source: 'Acura system rating as transcribed in this entry' },
      { parameter: 'Gear ratios', value: '9DCT 3.838/2.433/1.778/1.428/1.211/1.038/0.881/0.747/0.634, rear axle 3.583', status: 'reported', source: 'Acura power-unit press kit as transcribed in this entry' },
      { parameter: 'Peak power', value: 'Engine 500 hp @ 6,500–7,500 rpm (system rating in the row above)', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate)' },
      { parameter: 'Peak torque', value: 'Engine 406 lb-ft @ 2,000–6,000 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate)' },
      { parameter: 'Hybrid motors', value: 'Direct-drive motor 35 kW / 148 Nm on the engine shaft; front Twin Motor Unit 2 × 27 kW / 73 Nm through ≈ 8.05:1 (cut above ≈ 16,000 motor rpm); battery limit 89 kW (sum of motor ratings); system limit 427 kW', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate). Hybrid model: full deployment on demand within the battery and system limits; charge state, temperature, regeneration and the manufacturer deployment strategy are not modelled' },
      { parameter: 'AWD split', value: 'Front share 0–30 % (front motors only)', status: 'estimated', source: 'The front axle is driven only by the Twin Motor Unit; modelled as one shared traction limit with the front share capped' },
      { parameter: 'Curb mass', value: '1,755 kg (3,868 lb Car and Driver test mass), 42 % front', status: 'reported', source: 'Car and Driver test mass as transcribed in this entry; distribution estimated' },
      { parameter: 'Tire size', value: '245/35 R19 front, 305/30 R20 rear', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate)' },
      { parameter: 'Dimensions', value: '4,487 × 1,939 × 1,204 mm, WB 2,630 mm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate)' },
      { parameter: 'Top speed', value: '307 km/h (191 mph)', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate)' },
      { parameter: 'Tire grip calibration', value: `×${GRIP}`, status: 'estimated', source: 'Fitted to the Car and Driver 0–60 mph 3.1 s (rollout basis; the test\'s basis is unconfirmed): sim 3.09 s rollout, 3.36 s brake-release' },
      { parameter: 'Drivetrain efficiency', value: `${Math.round(EFF * 1000) / 10} %`, status: 'estimated', source: 'Fitted to the Car and Driver ¼ mile 11.2 s @ 126 mph: sim 11.18 s @ 126.4 mph (rollout)' },
    ],
  }),
};
