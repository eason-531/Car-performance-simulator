import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Calibrated to the front-drive Limited test (equivalent, not the AWD car). */
const GRIP = 1;
const EFF = 0.86;


/** Roster #14: 2023 Toyota Prius Limited AWD (US). */
export const entry: CatalogEntry = {
  id: "2023-toyota-prius-limited-awd-us-liftback-awd-ecvt",
  roster: 14,
  section: "Daily and sport compacts",
  make: "Toyota",
  model: "Prius",
  trim: "Limited AWD",
  modelYear: 2023,
  market: "US",
  body: "Liftback",
  bodyLabel: "Liftback",
  chassisCode: "XW60",
  aliases: [
    "Prius",
    "XW60",
    "E-Four"
  ],
  origin: "Japan",
  usage: [
    "Daily"
  ],
  drive: "AWD",
  transmission: "e-CVT",
  transmissionLabel: "Power-split e-CVT",
  powertrain: "Hybrid",
  engineLabel: "2.0 I4 hybrid (M20A-FXS) + E-Four",
  modelPath: "Hybrid",
  factory: {
    power: "196 hp (system)",
    curbMass: "3,340 lb (Motor Matchup)",
    zeroTo60MphS: 7.0,
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2023 Toyota Prius Limited AWD first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2023-toyota-prius-limited-awd-first-test-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2023 Toyota Prius first drive",
      publisher: "Motor1",
      url: "https://www.motor1.com/reviews/626466/2023-toyota-prius-first-drive/",
      kind: "reference"
    },
    {
      id: "src3",
      title: "2023 Toyota Prius Limited review",
      publisher: "The Auto Channel (citing Car and Driver)",
      url: "https://www.theautochannel.com/news/2023/05/29/1288731-2023-toyota-prius-limited-review-by-david-colman-video.html",
      kind: "reference"
    },
    {
      id: "src4",
      title: "Intake: 2023 Toyota Prius Prime",
      publisher: "MotorTrend (via Magzter)",
      url: "https://magzter.com/fr/stories/automotive/Motor-Trend/INTAKE-2023-TOYOTA-PRIUS-PRIME",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src3",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 7.1,
        quarterMileS: 15.5,
        quarterMileTrapMph: 92
      },
      conditions: {},
      match: "equivalent",
      verification: "Second-hand citation; the original page was not reachable.",
      date: "2023",
      deviation: "Front-drive Limited (194 hp), not the AWD car."
    },
    {
      id: "mt",
      sourceId: "src4",
      publication: "MotorTrend",
      timing: "rollout-1ft",
      timingNote: "MotorTrend subtracts a 1-ft rollout from its acceleration times.",
      results: {
        zeroTo60MphS: 7.2,
        quarterMileS: 15.5,
        quarterMileTrapMph: 91.7
      },
      conditions: {},
      match: "equivalent",
      verification: "Magazine excerpt.",
      date: "2023",
      deviation: "Standard (front-drive) Prius quoted in a Prius Prime story."
    }
  ],
  dataGaps: [
    "MotorTrend Limited AWD first test (roster source)",
    "Power-split gearing and motor ratings",
    "Tire size",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "2023-toyota-prius-limited-awd-us-liftback-awd-ecvt",
  make: "Toyota",
  model: "Prius",
  trim: "Limited AWD",
  modelYear: 2023,
  market: "US",
  body: "Liftback",
  shortName: "Toyota Prius AWD"
}, {
    engine: { code: 'M20A-FXS', description: '2.0 L Atkinson-cycle I4', displacementCc: 1987, aspiration: 'na', idleRpm: 950, redlineRpm: 5800, revLimitRpm: 6000, power: { value: 150, unit: 'hp', rpm: [6000, 6000] }, torque: { value: 139, unit: 'lb-ft', rpm: [4400, 5200] } },
    transmission: {
      type: 'cvt', name: 'Power-split e-CVT (approximated by the CVT model)',
      gearRatios: [2.6, 1.8, 1.3, 1.0, 0.75, 0.55], finalDrive: 3.218,
      upshiftTimeS: 0.3, downshiftTimeS: 0.3, maxAutoUpshiftRpm: 5800,
      torqueConverter: { stallRpm: 3000, stallTorqueRatio: 1.5, couplingSpeedRatio: 0.85, lockupMinGear: 1 },
      cvt: { ratioLow: 2.6, ratioHigh: 0.55, ratioRatePerS: 1.0, stepRatePerS: 2.0, stepThrottle: 1.5, stepUpshiftRpm: 5800, holdRpm: 5900, partThrottleRpm: [1200, 5900], brakingRpm: 2000 },
    },
    drivetrain: { layout: 'AWD', efficiency: EFF, frontShareRange: [0.6, 1], description: 'Engine and MG2 to the front through the power-split device; E-Four rear motor' },
    chassis: { curbMassKg: 1515, frontWeightFraction: 0.6, wheelbaseM: 2.75, lengthMm: 4600, widthMm: 1780, heightMm: 1430 },
    aero: {},
    tires: { sizes: [square('r19', '195/50 R19', 195, 50, 19, 'Assumed Limited fitment')], compound: 'touring', gripScale: GRIP },
    speedLimiterKmh: null,
    factory: { zeroTo60MphS: 7.0 },
    hybrid: { description: 'MG2 on the front axle beside the power-split engine path; E-Four rear motor', axleMotors: [{ axle: 'front', peakPowerKw: 83, peakTorqueNm: 206, maxRpm: 17000, reduction: 10 }, { axle: 'rear', peakPowerKw: 30, peakTorqueNm: 84, maxRpm: 13000, reduction: 10.5 }], systemPowerKw: 146, batteryPowerKw: 45 },
    provenance: [
      { parameter: 'System output', value: '196 hp (146 kW)', status: 'reported', source: 'Toyota system rating as transcribed in this entry (factory figure)' },
      { parameter: 'Power split', value: 'The planetary power-split e-CVT is approximated by the simulator\'s CVT model (engine path with a soft converter for the launch) plus MG2 as a front axle motor', status: 'estimated', source: 'Modelling assumption: the power-split kinematics, MG1 generation and the battery\'s charge state are not modelled' },
      { parameter: 'Peak power', value: 'Engine 150 hp @ 6,000 rpm (system rating in the row above)', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate)' },
      { parameter: 'Peak torque', value: 'Engine 139 lb-ft @ 4,400–5,200 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate)' },
      { parameter: 'Hybrid motors', value: 'MG2 83 kW / 206 Nm through ≈ 10:1 to the front; rear motor 30 kW / 84 Nm through ≈ 10.5:1; battery limit 45 kW; system limit 146 kW', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate). Hybrid model: full deployment on demand within the battery and system limits; charge state, temperature, regeneration and the manufacturer deployment strategy are not modelled' },
      { parameter: 'Gear ratios', value: 'Effective span 2.60–0.55 with final drive 3.218 (CVT model)', status: 'estimated', source: 'A power-split device has no fixed ratios; the span is chosen so the engine can reach its peak-power speed from rest to top speed' },
      { parameter: 'Curb mass', value: '1,515 kg (3,340 lb)', status: 'reported', source: 'Motor Matchup listing as transcribed in this entry' },
      { parameter: 'Tire size', value: '195/50 R19', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate)' },
      { parameter: 'Dimensions', value: '4,600 × 1,780 × 1,430 mm, WB 2,750 mm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate)' },
      { parameter: 'Tire grip calibration', value: `×${GRIP}`, status: 'estimated', source: 'Not fitted (touring compound at ×1)' },
      { parameter: 'Drivetrain efficiency', value: `${Math.round(EFF * 1000) / 10} %`, status: 'estimated', source: 'Set against the front-drive Limited (Car and Driver 7.1 s, 15.5 s @ 92 mph; equivalent, not this AWD car): sim 6.89 s, 15.32 s @ 88.3 mph (rollout). The trap residual (−3.7 mph) reflects the power-split approximation' },
    ],
  }),
};
