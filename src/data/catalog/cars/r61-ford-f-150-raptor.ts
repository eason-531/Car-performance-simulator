import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

const MOTOR1 = 'https://www.motor1.com/reviews/529834/2021-ford-raptor-first-drive/';
const CD = 'https://www.caranddriver.com/reviews/a40059355/2021-ford-f-150-raptor-37-performance-package-by-the-numbers/';
/** Fitted to Car and Driver's 0–60 mph (1-ft rollout) and Edmunds' standing-start ¼ mile. */
const GRIP = 0.8;
const EFF = 0.8;

/** Roster #61: 2021 Ford F-150 Raptor SuperCrew 37 Performance Package (US). */
export const entry: CatalogEntry = {
  id: "2021-ford-f-150-raptor-supercrew-37-performance-package-us-pickup-4wd-10at",
  roster: 61,
  section: "SUVs and pickups",
  make: "Ford",
  model: "F-150 Raptor",
  trim: "SuperCrew 37 Performance Package",
  modelYear: 2021,
  market: "US",
  body: "Pickup",
  bodyLabel: "Crew-cab pickup",
  chassisCode: "P702 (14th gen)",
  aliases: [
    "Raptor",
    "F150"
  ],
  origin: "United States",
  usage: [
    "Pickup",
    "Off-road"
  ],
  drive: "4WD",
  transmission: "AT",
  transmissionLabel: "10-speed automatic",
  powertrain: "Petrol",
  engineLabel: "3.5 twin-turbo V6 (EcoBoost HO)",
  modelPath: "4WD",
  factory: {
    power: "450 hp",
    torque: "510 lb-ft",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2021 Ford F-150 Raptor 37 Performance Package by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a40059355/2021-ford-f-150-raptor-37-performance-package-by-the-numbers/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2021 Ford Raptor first drive",
      publisher: "Motor1",
      url: "https://www.motor1.com/reviews/529834/2021-ford-raptor-first-drive/",
      kind: "reference"
    },
    {
      id: "src3",
      title: "Tested: 2021 Ford Raptor slower than F-150 Hybrid",
      publisher: "Edmunds (via Carscoops)",
      url: "https://www.carscoops.com/2022/05/want-a-fast-ford-f-150-buy-the-hybrid-not-the-raptor/",
      kind: "road-test"
    },
    {
      id: "src4",
      title: "2021 Ford F-150 (Raptor)",
      publisher: "MotorTrend (via Magzter)",
      url: "https://www.magzter.com/ja/stories/Automotive/Motor-Trend/2021-Ford-F-150",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "edmunds",
      sourceId: "src3",
      publication: "Edmunds",
      timing: "standing-start",
      timingNote: "Edmunds times from a standstill (\"zero should mean zero\"), no rollout.",
      results: {
        zeroTo60MphS: 5.8,
        quarterMileS: 14.3
      },
      conditions: {
        tires: "37-inch tires"
      },
      match: "exact",
      verification: "Second-hand citation; the original page was not reachable.",
      date: "2022"
    },
    {
      id: "mt",
      sourceId: "src4",
      publication: "MotorTrend",
      timing: "rollout-1ft",
      timingNote: "MotorTrend subtracts a 1-ft rollout from its acceleration times.",
      results: {
        zeroTo60MphS: 5.6
      },
      conditions: {
        tires: "37-inch tires"
      },
      match: "exact",
      verification: "Magazine excerpt.",
      date: "2021"
    },
    {
      id: "cd",
      sourceId: "test",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 5.2
      },
      conditions: {
        testMass: "5,971 lb",
        tires: "37-inch tires",
        other: [
          "Transfer-case mode as stated in the test (not transcribed)"
        ]
      },
      match: "exact",
      verification: "Original test as transcribed in the owner-supplied spec-sheet follow-up, 2026-11; exact 37 Performance Package truck.",
      date: "2021"
    }
  ],
  dataGaps: [
    "4WD torque split and the transfer-case mode of the published tests (4A / 4H modelled)",
    "Power and torque rpm, 10R80 ratios and dimensions (recalled, not re-read)",
    "Car and Driver original page (not reachable on 2026-11-28)",
    "Drag coefficient"
  ],
  notes: [
    "Ford confirms 4.10 front and rear axle ratios.",
    "Playable on a bounded estimate: the transfer-case mode of the published tests is not transcribed, so the model drives both axles as 4A or 4H would (front share free between 0 and 50 %). In 2H (rear only) launches would be slower."
  ],
  sim: buildSpec({
  id: "2021-ford-f-150-raptor-supercrew-37-performance-package-us-pickup-4wd-10at",
  make: "Ford",
  model: "F-150 Raptor",
  trim: "SuperCrew 37 Performance Package",
  modelYear: 2021,
  market: "US",
  body: "Pickup",
  shortName: "Ford F-150 Raptor 37"
}, {
    engine: { code: '3.5 EcoBoost HO', description: '3.5 L twin-turbo V6', displacementCc: 3496, aspiration: 'twin-turbo', idleRpm: 650, redlineRpm: 6000, revLimitRpm: 6200, power: { value: 450, unit: 'hp', rpm: [5000, 5850] }, torque: { value: 510, unit: 'lb-ft', rpm: [3500, 3500] }, peakBoostBar: 1.2 },
    transmission: { type: 'torque-converter-automatic', name: '10-speed automatic (10R80)', gearRatios: [4.696, 2.985, 2.146, 1.769, 1.52, 1.275, 1.0, 0.854, 0.689, 0.636], finalDrive: 4.1 },
    drivetrain: { layout: '4WD', efficiency: EFF, frontShareRange: [0, 0.5], description: 'Two-speed transfer case (2H / 4A / 4H / 4L) with 4.10 front and rear axles; modelled as 4A or 4H' },
    chassis: { curbMassKg: 2708, frontWeightFraction: 0.57, wheelbaseM: 3.686, lengthMm: 5895, widthMm: 2184, heightMm: 2027 },
    aero: {},
    tires: { sizes: [square('lt37', '37x12.50R17 BFGoodrich All-Terrain KO2', 318, 80, 17, '37-inch package tires')], compound: 'touring', gripScale: GRIP },
    speedLimiterKmh: 190,
    factory: {},
    provenance: [
      { parameter: 'Peak power', value: '450 hp; rpm band 5,000–5,850 assumed', status: 'reported', source: 'Motor1 first drive spec box "450 Horsepower / 510 Pound-Feet" (read 2026-11-28); rpm not stated there, the band is recalled', url: MOTOR1 },
      { parameter: 'Peak torque', value: '510 lb-ft; peak rpm 3,500 assumed', status: 'reported', source: 'Motor1 first drive (read 2026-11-28); rpm recalled, not verified', url: MOTOR1 },
      { parameter: 'Gear ratios', value: '4.696/2.985/2.146/1.769/1.520/1.275/1.000/0.854/0.689/0.636', status: 'estimated', source: 'Ford 10R80 ratios as recalled; not re-read from a reachable source' },
      { parameter: 'Final drive', value: '4.10 front and rear', status: 'reported', source: 'Ford (as transcribed in this entry); Motor1 "4.10 rear end" (read 2026-11-28)', url: MOTOR1 },
      { parameter: 'Tire size', value: '37-inch BFGoodrich All-Terrain KO2 (37x12.50R17)', status: 'reported', source: 'Motor1: "37-inch BFGoodrich All-Terrain KO2 tires" (read 2026-11-28); the 12.50R17 size is recalled', url: MOTOR1 },
      { parameter: 'Curb mass', value: '2,708 kg (5,971 lb Car and Driver test mass); Motor1 lists 5,851 lb', status: 'reported', source: 'Car and Driver test mass as transcribed in this entry; Motor1 spec box', url: CD },
      { parameter: 'Speed limiter', value: '190 km/h (118 mph)', status: 'reported', source: 'Motor1 spec box "Maximum speed 118 MPH" (read 2026-11-28)', url: MOTOR1 },
      { parameter: '4WD test mode', value: 'Both axles driven, front share 0–50 % (4A / 4H)', status: 'estimated', source: 'Assumption: the transfer-case mode of the Car and Driver, MotorTrend and Edmunds tests is not transcribed' },
      { parameter: 'Dimensions', value: '5,895 × 2,184 × 2,027 mm, WB 3,686 mm', status: 'estimated', source: 'Recalled published figures; not verified from a reachable source' },
      { parameter: 'Weight distribution', value: '57 % front', status: 'estimated', source: 'Typical crew-cab pickup; not published' },
      { parameter: 'Tire grip calibration', value: `×${GRIP}`, status: 'estimated', source: 'Touring compound class (no all-terrain class exists) scaled to fit the Car and Driver 0–60 mph 5.2 s (1-ft rollout)' },
      { parameter: 'Drivetrain efficiency', value: `${Math.round(EFF * 1000) / 10} %`, status: 'estimated', source: 'Fitted with grip to Car and Driver 0–60 mph 5.2 s (1-ft rollout; sim 5.22 s) and Edmunds\' standing-start ¼ mile 14.3 s (sim 14.21 s brake-release). MotorTrend\'s 5.6 s 0–60 mph is slower; no trap speed is transcribed' },
    ],
  }),
};
