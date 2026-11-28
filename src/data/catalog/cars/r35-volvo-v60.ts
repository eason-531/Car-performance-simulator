import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Fitted to the aggregator-listed test (timing unconfirmed; rollout basis used). */
const GRIP = 0.9;
const EFF = 0.82;


/** Roster #35: 2020 Volvo V60 T8 Polestar Engineered (US). */
export const entry: CatalogEntry = {
  id: "2020-volvo-v60-t8-polestar-engineered-us-wagon-awd-8at",
  roster: 35,
  section: "Wagons",
  make: "Volvo",
  model: "V60",
  trim: "T8 Polestar Engineered",
  modelYear: 2020,
  market: "US",
  body: "Wagon",
  bodyLabel: "Wagon",
  chassisCode: "SPA",
  aliases: [
    "V60 Polestar",
    "T8"
  ],
  origin: "Sweden",
  usage: [
    "Wagon",
    "Daily"
  ],
  drive: "AWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic (front) + electric rear axle",
  powertrain: "Plug-in hybrid",
  engineLabel: "2.0 turbo+supercharged I4 + rear motor",
  modelPath: "Hybrid",
  factory: {
    power: "415 hp (combined)",
    torque: "494 lb-ft (combined)",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2020 Volvo V60 T8 Polestar by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a30529509/2020-volvo-v60-t8-polestar-by-the-numbers/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Volvo V60 0–60 times",
      publisher: "0-60specs",
      url: "https://www.0-60specs.com/volvo/v60-0-60-times",
      kind: "reference"
    },
    {
      id: "src3",
      title: "2020 Volvo V60 T8 Polestar Engineered first drive",
      publisher: "Autoblog (via Yahoo)",
      url: "https://www.yahoo.com/entertainment/2020-volvo-v60-t8-polestar-135500248.html",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "agg",
      sourceId: "src2",
      publication: "Instrumented test listed by 0-60specs (publication unclear)",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 4.4,
        quarterMileS: 12.9,
        quarterMileTrapMph: 107.0
      },
      conditions: {},
      match: "exact",
      verification: "Aggregator listing whose source label is ambiguous for this run.",
      date: "2020"
    }
  ],
  dataGaps: [
    "Car and Driver test (roster source)",
    "Curb mass",
    "Electric rear-axle output and gearing",
    "Tire size",
    "Drag coefficient"
  ],
  notes: [
    "Autoblog lists 4.9 s to 60 mph, apparently a manufacturer figure.",
    "Playable on bounded estimates: the engine drives the front through the 8-speed automatic with its starter-generator, the rear motor drives the rear axle, within battery and system limits. Curb mass, motor ratings, ratios, tires and dimensions are estimates."
  ],
  sim: buildSpec({
  id: "2020-volvo-v60-t8-polestar-engineered-us-wagon-awd-8at",
  make: "Volvo",
  model: "V60",
  trim: "T8 Polestar Engineered",
  modelYear: 2020,
  market: "US",
  body: "Wagon",
  shortName: "Volvo V60 T8 Polestar"
}, {
    engine: { code: 'B4204T34', description: '2.0 L turbocharged and supercharged I4', displacementCc: 1969, aspiration: 'turbo', idleRpm: 750, redlineRpm: 6500, revLimitRpm: 6600, power: { value: 328, unit: 'hp', rpm: [6000, 6000] }, torque: { value: 317, unit: 'lb-ft', rpm: [3000, 5400] }, peakBoostBar: 1.6 },
    transmission: { type: 'torque-converter-automatic', name: '8-speed automatic (front)', gearRatios: [5.25, 3.03, 1.95, 1.46, 1.22, 1.0, 0.81, 0.67], finalDrive: 3.25 },
    drivetrain: { layout: 'AWD', efficiency: EFF, frontShareRange: [0.5, 1], description: 'Engine to the front wheels through the 8-speed automatic; electric rear axle (ERAD)' },
    chassis: { curbMassKg: 2050, frontWeightFraction: 0.55, wheelbaseM: 2.872, lengthMm: 4761, widthMm: 1850, heightMm: 1432 },
    aero: {},
    tires: { sizes: [square('r19', '235/40 R19', 235, 40, 19, 'Assumed Polestar Engineered fitment')], compound: 'uhp', gripScale: GRIP },
    speedLimiterKmh: 180,
    factory: {},
    hybrid: { description: 'Crank-mounted starter-generator on the engine plus an electric rear axle (ERAD)', inputMotor: { peakPowerKw: 34, peakTorqueNm: 150, maxRpm: 6600 }, axleMotors: [{ axle: 'rear', peakPowerKw: 65, peakTorqueNm: 240, maxRpm: 12000, reduction: 9.2 }], systemPowerKw: 309, batteryPowerKw: 70 },
    provenance: [
      { parameter: 'System output', value: '415 hp (309 kW), 494 lb-ft combined', status: 'reported', source: 'Combined rating as transcribed in this entry (0-60specs)' },
      { parameter: 'Peak power', value: 'Engine 328 hp @ 6,000 rpm (system rating in the row above)', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate)' },
      { parameter: 'Peak torque', value: 'Engine 317 lb-ft @ 3,000–5,400 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate)' },
      { parameter: 'Hybrid motors', value: 'Crank starter-generator 34 kW / 150 Nm; rear motor 65 kW / 240 Nm through ≈ 9.2:1 (cut above ≈ 165 km/h); battery limit 70 kW; system limit 309 kW', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate). Hybrid model: full deployment on demand within the battery and system limits; charge state, temperature, regeneration and the manufacturer deployment strategy are not modelled' },
      { parameter: 'Gear ratios', value: '5.25/3.03/1.95/1.46/1.22/1.00/0.81/0.67, final drive 3.25', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate)' },
      { parameter: 'Curb mass', value: '2,050 kg', status: 'estimated', source: 'Curb mass is a listed data gap; typical for the T8 wagon' },
      { parameter: 'AWD split', value: 'Front share 50–100 % (rear motor only at the rear)', status: 'estimated', source: 'The rear axle is driven only by its motor; one shared traction limit with the front share bounded' },
      { parameter: 'Tire size', value: '235/40 R19', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate)' },
      { parameter: 'Dimensions', value: '4,761 × 1,850 × 1,432 mm, WB 2,872 mm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source (bounded estimate)' },
      { parameter: 'Speed limiter', value: '180 km/h (112 mph)', status: 'estimated', source: 'Volvo limits its MY2020+ cars to 180 km/h (recalled; not re-read)' },
      { parameter: 'Tire grip calibration', value: `×${GRIP}`, status: 'estimated', source: 'Fitted to the aggregator-listed 0–60 mph 4.4 s (publication and timing unconfirmed; rollout basis): sim 4.37 s' },
      { parameter: 'Drivetrain efficiency', value: `${Math.round(EFF * 1000) / 10} %`, status: 'estimated', source: 'Fitted to the aggregator-listed ¼ mile 12.9 s @ 107 mph: sim 12.88 s @ 106.8 mph (rollout)' },
    ],
  }),
};
