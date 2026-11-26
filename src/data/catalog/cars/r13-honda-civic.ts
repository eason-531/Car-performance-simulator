import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

const HONDA = 'https://www.hondainfocenter.com/2022/Civic-Hatchback/Feature-Guide/Civic-Hatchback-Specifications/';
const PRESS = 'https://hondanews.com/en-US/releases/release-20c92b0d934f0bc63982bd3eee0149e9-2022-honda-civic-hatchback-press-kit';
const EPA = 'https://www.epa.gov/system/files/documents/2023-06/22-testcar-2023-06-13.xlsx';
const MT = 'https://www.motortrend.com/reviews/2022-honda-civic-sport-touring-hatchback-cvt-automatic-first-test-review';

/**
 * Simulated Step Shift / paddle steps (pulley ratios, estimated): seven steps
 * (EPA lists the paddle CVT with 7 gears) from the 2.645 launch ratio, each
 * 1.19× taller, so a change at 6,200 rpm drops the engine to ≈ 5,200 rpm.
 */
const STEPS = [2.645, 2.223, 1.868, 1.57, 1.319, 1.108, 0.931];

/** Roster #13: 2022 Honda Civic Sport Touring 1.5T (US). */
export const entry: CatalogEntry = {
  id: "2022-honda-civic-sport-touring-1-5t-us-hatch-fwd-cvt",
  roster: 13,
  section: "Daily and sport compacts",
  make: "Honda",
  model: "Civic",
  trim: "Sport Touring 1.5T",
  modelYear: 2022,
  market: "US",
  body: "Hatchback",
  bodyLabel: "5-door hatchback",
  chassisCode: "FL1",
  aliases: [
    "Civic hatchback",
    "FL1"
  ],
  origin: "Japan",
  usage: [
    "Daily"
  ],
  drive: "FWD",
  transmission: "CVT",
  transmissionLabel: "CVT",
  powertrain: "Petrol",
  engineLabel: "1.5 turbo I4 (L15CA)",
  modelPath: "CVT",
  factory: {
    power: "180 hp @ 6,000 rpm",
    torque: "177 lb-ft @ 1,700–4,500 rpm",
    curbMass: "3,102 lb (Honda, Sport Touring CVT)",
    sourceId: "src-honda"
  },
  sources: [
    {
      id: "src-honda",
      title: "2022 Civic Hatchback specifications",
      publisher: "American Honda (Honda Info Center)",
      url: HONDA,
      kind: "manufacturer"
    },
    {
      id: "src-press",
      title: "2022 Honda Civic Hatchback press kit",
      publisher: "American Honda (Honda News)",
      url: PRESS,
      kind: "manufacturer",
      date: "2021"
    },
    {
      id: "src-epa",
      title: "Data on cars used for testing fuel economy, model year 2022 (Civic 5DR 180 hp CVT rows)",
      publisher: "US EPA",
      url: EPA,
      kind: "manufacturer",
      date: "2023-06"
    },
    {
      id: "test",
      title: "2022 Honda Civic Sport Touring hatchback first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2022-honda-civic-sport-touring-hatchback-cvt-automatic-first-test-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Tested: 2022 Honda Civic hatchback loses speed but wins our hearts",
      publisher: "Edmunds",
      url: "https://www.edmunds.com/car-news/tested-2022-honda-civic-hatchback-loses-speed-but-wins-our-hearts.html",
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
        zeroTo60MphS: 7.7,
        quarterMileS: 15.9,
        quarterMileTrapMph: 89.8
      },
      conditions: {
        testMass: "3,075 lb curb (61/39 %)",
        driveMode: "Not stated (ECON, Normal and Sport are selectable)"
      },
      match: "exact",
      verification: "Original MotorTrend first test (fetched): CVT Sport Touring hatchback, 7.7 s to 60 mph, 15.9 s @ 89.8 mph, 3,075 lb (61/39). Drive mode, weather and correction are not stated.",
      date: "2021-11-25"
    },
    {
      id: "edmunds",
      sourceId: "src2",
      publication: "Edmunds",
      timing: "standing-start",
      timingNote: "Edmunds times from a standstill (\"zero should mean zero\"), no rollout.",
      results: {
        zeroTo60MphS: 7.9
      },
      conditions: {
        temperatureC: 19
      },
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2021"
    }
  ],
  dataGaps: [
    "Step Shift step ratios, change points and ratio-change rates (Honda describes the behaviour only)",
    "Torque converter stall speed and multiplication",
    "Drag coefficient",
    "MotorTrend test drive mode"
  ],
  simCaveats: [
    "CVT model: the pulley ratio moves continuously within Honda's 2.645–0.405 span at an estimated rate; under hard acceleration an estimated seven-step Step Shift program changes at 6,200 rpm and then holds 6,000 rpm past the last step. Honda publishes no step ratios, change points or rates.",
    "Torque converter launch and lock-up use estimated converter data (stall 2,600 rpm, 2.0:1); Honda only says the converter was improved."
  ],
  notes: [
    "Honda US specifications: CVT ratio range 2.645–0.405, final drive 4.81, weight distribution 60.2/39.8.",
    "Honda describes revised Step-Shift programming that simulates gear changes under hard acceleration and early downshifts under braking (press kit, read through a search summary; the page refuses automated requests)."
  ],
  sim: buildSpec({
  id: "2022-honda-civic-sport-touring-1-5t-us-hatch-fwd-cvt",
  make: "Honda",
  model: "Civic",
  trim: "Sport Touring 1.5T",
  modelYear: 2022,
  market: "US",
  body: "Hatchback",
  shortName: "Honda Civic 1.5T CVT"
}, {
    engine: {
      code: 'L15CA', description: '1.5 L turbo I4, direct injection, VTEC', displacementCc: 1498, aspiration: 'turbo',
      idleRpm: 700, redlineRpm: 6600, revLimitRpm: 6700,
      power: { value: 180, unit: 'hp', rpm: [6000, 6000] },
      torque: { value: 177, unit: 'lb-ft', rpm: [1700, 4500] },
      peakBoostBar: 1.14,
    },
    transmission: {
      type: 'cvt', name: 'LL-CVT with torque converter and Step Shift (7 simulated steps)',
      gearRatios: STEPS, finalDrive: 4.81,
      upshiftTimeS: 0.25, downshiftTimeS: 0.3, maxAutoUpshiftRpm: 6200,
      torqueConverter: { stallRpm: 2600, stallTorqueRatio: 2.0, couplingSpeedRatio: 0.85, lockupMinGear: 1 },
      cvt: {
        ratioLow: 2.645, ratioHigh: 0.405,
        ratioRatePerS: 0.8, stepRatePerS: 2.0,
        stepThrottle: 0.8, stepUpshiftRpm: 6200, holdRpm: 6000,
        partThrottleRpm: [1400, 4500], brakingRpm: 2500,
      },
    },
    drivetrain: { layout: 'FWD', description: 'Front-wheel drive, open differential with brake-based traction control', efficiency: 0.84 },
    chassis: { curbMassKg: 1395, frontWeightFraction: 0.61, wheelbaseM: 2.736, lengthMm: 4547, widthMm: 1801, heightMm: 1415 },
    aero: {},
    tires: { sizes: [square('r18', '235/40 R18 91W', 235, 40, 18, 'All-season (Sport Touring)')], compound: 'touring', gripScale: 1 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Peak power', value: '180 hp @ 6,000 rpm', status: 'verified', source: 'Honda specifications', url: HONDA },
      { parameter: 'Peak torque', value: '177 lb-ft @ 1,700–4,500 rpm', status: 'verified', source: 'Honda specifications', url: HONDA },
      { parameter: 'Redline', value: '6,600 rpm (limiter 6,700 estimated)', status: 'verified', source: 'Honda specifications', url: HONDA },
      { parameter: 'Peak boost', value: '16.5 psi (1.14 bar)', status: 'verified', source: 'Honda specifications', url: HONDA },
      { parameter: 'Gear ratios', value: 'CVT span 2.645–0.405, final drive 4.81; simulated steps ' + STEPS.join(' / '), status: 'verified', source: 'Honda specifications (span and final drive). The seven steps are estimated: EPA lists the paddle CVT with 7 gears; their ratios are not published', url: HONDA },
      { parameter: 'Step Shift', value: 'Hard acceleration (throttle ≥ 80 %): steps change at 6,200 rpm at 2.0 ratio/s, then 6,000 rpm is held past the last step; braking targets 2,500 rpm (early downshifts)', status: 'estimated', source: 'Honda describes Step-Shift programming that simulates gear changes under hard acceleration and early downshifts under braking; thresholds, rpm points and rates are not published', url: PRESS },
      { parameter: 'Ratio control', value: 'Part throttle targets 1,400–4,500 rpm; ratio changes at up to 0.8 per second', status: 'estimated', source: 'Typical belt-CVT control; not published' },
      { parameter: 'Torque converter', value: 'Stall 2,600 rpm, 2.0:1, lock-up from the first step once the speed ratio passes 0.9', status: 'estimated', source: 'Honda states only that the converter was improved', url: PRESS },
      { parameter: 'Paddle steps', value: '7', status: 'reported', source: 'EPA test-car data lists the 180 hp Civic 5DR paddle CVT with 7 gears', url: EPA },
      { parameter: 'Curb mass', value: '1,395 kg (3,075 lb as tested by MotorTrend; Honda lists 3,102 lb)', status: 'reported', source: 'MotorTrend test (calibration at measured test mass)', url: MT },
      { parameter: 'Weight distribution', value: '61 % front (MotorTrend); Honda 60.2 %', status: 'reported', source: 'MotorTrend test', url: MT },
      { parameter: 'Tire size', value: '235/40 R18 91W all-season', status: 'verified', source: 'Honda specifications', url: HONDA },
      { parameter: 'Dimensions', value: '179.0 × 70.9 × 55.7 in, WB 107.7 in', status: 'verified', source: 'Honda specifications', url: HONDA },
      { parameter: 'Tire grip calibration', value: '×1.00', status: 'estimated', source: 'Held at the 1.00 floor: the simulation is already quicker than MotorTrend to 60 mph (7.31 s against 7.7 s, 1-ft rollout); the launch residual points at the estimated converter and Step Shift data or an unstated drive mode' },
      { parameter: 'Drivetrain efficiency', value: '84 %', status: 'estimated', source: 'Trap fit to MotorTrend 89.8 mph (sim 15.69 s @ 89.9 mph, rollout); belt CVT and converter losses included' },
    ],
  }),
};
