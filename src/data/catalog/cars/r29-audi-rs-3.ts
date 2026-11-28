import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

const AUDI_PDF = 'https://www.audi.com/system/production/car_motorizations/468/file_en/1d135b0858d0dbde3c70b0690ae8652197730017/eTD-Audi-RS3-Sedan-TFSI_231027.pdf?1698933729=&disposition=attachment';
const TTRS = 'https://sport-auto.ch/essais/wp-content/uploads/2016/09/etd-TT-RS-Coup%C3%A9-2.5-TFSI-294-kW_0716.pdf';
const CD_RS3 = 'https://www.caranddriver.com/reviews/a40157829/2022-audi-rs3-sedan-us-drive/';
/** Fitted to the Car and Driver 0–60 mph (rollout) and ¼-mile trap. */
const GRIP_RS3 = 1.15;
const EFF_RS3 = 0.91;

/** Roster #29: 2022 Audi RS 3 RS 3 (US). */
export const entry: CatalogEntry = {
  id: "2022-audi-rs-3-us-sedan-awd-7dct",
  roster: 29,
  section: "Luxury and sport sedans",
  make: "Audi",
  model: "RS 3",
  trim: "RS 3",
  modelYear: 2022,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "8Y",
  aliases: [
    "RS3",
    "8Y",
    "quattro"
  ],
  origin: "Germany",
  usage: [
    "Sport Compact",
    "Sport Sedan"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "7-speed S tronic",
  powertrain: "Petrol",
  engineLabel: "2.5 turbo I5 (EA855 evo)",
  modelPath: "Existing",
  factory: {
    power: "401 hp",
    torque: "369 lb-ft",
    curbMass: "3,649 lb (Autoblog / The Drive listing)",
    zeroTo60MphS: 3.6,
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2022 Audi RS3 sedan US drive",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a40157829/2022-audi-rs3-sedan-us-drive/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2022 Audi RS3 review",
      publisher: "Motor1",
      url: "https://www.motor1.com/reviews/634277/2022-audi-rs3-review/",
      kind: "reference"
    },
    {
      id: "src3",
      title: "Tested: 2022 Audi RS3 Hits 60 MPH in 3.3 Seconds",
      publisher: "Yahoo Autos (syndicated)",
      url: "https://autos.yahoo.com/2022-audi-rs3-focused-track-140000020.html",
      kind: "road-test"
    },
    {
      id: "src-audi-eu",
      title: "RS 3 Sedan TFSI technical data (pre-facelift)",
      publisher: "Audi",
      url: "https://www.audi.com/system/production/car_motorizations/468/file_en/1d135b0858d0dbde3c70b0690ae8652197730017/eTD-Audi-RS3-Sedan-TFSI_231027.pdf?1698933729=&disposition=attachment",
      kind: "manufacturer"
    }
  ],
  benchmarks: [
    {
      id: "motor1",
      sourceId: "src2",
      publication: "Motor1",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 3.8
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment). Single first-drive run, not a full instrumented test.",
      date: "2022"
    },
    {
      id: "cd",
      sourceId: "test",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 3.3,
        quarterMileS: 11.8,
        quarterMileTrapMph: 117,
        rolloutS: 0.3
      },
      conditions: {
        testMass: "3,639 lb"
      },
      match: "exact",
      verification: "Original test as transcribed in the owner-supplied spec-sheet follow-up, 2026-11; original test; it lists the wheel and tire options.",
      date: "2022"
    }
  ],
  dataGaps: [
    "Gearbox code and per-gear output-ratio assignment (TT RS DQ500 mapping modelled)",
    "Power/torque rpm bands",
    "US tire size",
    "Front/rear weight distribution"
  ],
  notes: [
    "Forward ratios 3.560/2.530/1.680/1.020/0.790/0.760/0.630 (Audi, agreeing with the 2022 US listing to rounding). Output ratios 4.059 (EU table) and 3.45 (US database) suggest two output shafts; the TT RS mapping is not assumed.",
    "Audi EU aero: Cd 0.32, 2.22 m². The EU power rating is kept separate from the US 401 hp.",
    "Playable on a bounded estimate: the per-gear output ratios follow the TT RS's factory DQ500 mapping (same 2.5 TFSI, forward ratios equal to three decimals). Audi's RS 3 sheet itself lists one final drive (4.059) with the second output blank."
  ],
  sim: buildSpec({
  id: "2022-audi-rs-3-us-sedan-awd-7dct",
  make: "Audi",
  model: "RS 3",
  trim: "RS 3",
  modelYear: 2022,
  market: "US",
  body: "Sedan",
  shortName: "Audi RS 3"
}, {
    engine: { code: 'EA855 evo (DNWA)', description: '2.5 L turbo I5', displacementCc: 2480, aspiration: 'turbo', idleRpm: 750, redlineRpm: 7000, revLimitRpm: 7200, power: { value: 401, unit: 'hp', rpm: [5600, 7000] }, torque: { value: 369, unit: 'lb-ft', rpm: [2250, 5600] }, peakBoostBar: 1.35 },
    transmission: { type: 'dual-clutch', name: '7-speed S tronic', gearRatios: [3.56, 2.53, 1.68, 1.02, 0.79, 0.76, 0.63], finalDrive: [4.059, 3.45, 3.45, 4.059, 4.059, 3.45, 3.45], upshiftTimeS: 0.12, launchClutch: { launchRpm: 4000, brakeHoldRpmLimit: 4000 } },
    drivetrain: { layout: 'AWD', efficiency: EFF_RS3, description: 'quattro with a multi-plate front-biased coupling and the RS Torque Splitter rear axle' },
    chassis: { curbMassKg: 1651, frontWeightFraction: 0.59, wheelbaseM: 2.631, lengthMm: 4542, widthMm: 1851, heightMm: 1412 },
    aero: { dragCoefficient: 0.32, frontalAreaM2: 2.22 },
    tires: { sizes: [staggered('r19', '265/30 R19 front, 245/35 R19 rear', { widthMm: 265, aspectPct: 30, rimIn: 19 }, { widthMm: 245, aspectPct: 35, rimIn: 19 }, 'Audi basic fitment (EU sheet); US fitment assumed the same')], compound: 'uhp', gripScale: GRIP_RS3 },
    speedLimiterKmh: 250,
    factory: { zeroTo100S: 3.8, topSpeedKmh: 250 },
    provenance: [
      { parameter: 'Peak power', value: '401 hp (US rating) @ 5,600–7,000 rpm (EU sheet: 294 kW / 400 PS @ 5,600–7,000)', status: 'reported', source: 'US rating (catalog factory figure, Motor1) with the rpm band from the Audi RS 3 Sedan TFSI technical data (read 2026-11-28)', url: AUDI_PDF },
      { parameter: 'Peak torque', value: '369 lb-ft (500 Nm) @ 2,250–5,600 rpm', status: 'verified', source: 'Audi RS 3 Sedan TFSI technical data: "500 (368.8) / 2250 - 5600" (read 2026-11-28)', url: AUDI_PDF },
      { parameter: 'Gear ratios', value: '3.560/2.530/1.680/1.020/0.790/0.760/0.630', status: 'verified', source: 'Audi RS 3 Sedan TFSI technical data (read 2026-11-28); the 2022 US listing agrees to rounding', url: AUDI_PDF },
      { parameter: 'Final drive', value: '4.059 (1st, 4th, 5th) / 3.450 (2nd, 3rd, 6th, 7th)', status: 'estimated', source: 'Bounded estimate. The RS 3 sheet gives "final drive ratio 1-2 / 2-3: 4.059 / -" (one output listed) and a US database 3.45; the per-gear assignment is the TT RS factory DQ500 mapping (same engine, forward ratios equal to 3 decimals), not an RS 3 document. Bounds in the efficiency row', url: TTRS },
      { parameter: 'Curb mass', value: '1,651 kg (3,639 lb, Car and Driver test mass); Audi EU unladen 1,570 kg without driver', status: 'reported', source: 'Car and Driver test mass as transcribed in the catalog benchmark; Audi EU sheet for the unladen figure', url: CD_RS3 },
      { parameter: 'Tire size', value: '265/30 ZR19 front, 245/35 ZR19 rear', status: 'reported', source: 'Audi RS 3 Sedan TFSI technical data, basic tires (EU); the US fitment is not confirmed', url: AUDI_PDF },
      { parameter: 'Dimensions', value: '4,542 × 1,851 × 1,412 mm, WB 2,631 mm', status: 'verified', source: 'Audi RS 3 Sedan TFSI technical data (read 2026-11-28)', url: AUDI_PDF },
      { parameter: 'Drag coefficient', value: 'Cd 0.32 × 2.22 m²', status: 'verified', source: 'Audi RS 3 Sedan TFSI technical data (read 2026-11-28)', url: AUDI_PDF },
      { parameter: 'Speed limiter', value: '250 km/h (governed, EU sheet); US top speed depends on the option package', status: 'reported', source: 'Audi RS 3 Sedan TFSI technical data', url: AUDI_PDF },
      { parameter: 'Weight distribution', value: '59 % front', status: 'estimated', source: 'Typical transverse-engine quattro (as the TT RS); not published' },
      { parameter: 'Tire grip calibration', value: `×${GRIP_RS3}`, status: 'estimated', source: 'Fitted to the Car and Driver 0–60 mph 3.3 s (1-ft rollout)' },
      { parameter: 'Drivetrain efficiency', value: `${Math.round(EFF_RS3 * 1000) / 10} %`, status: 'estimated', source: 'Fitted to the Car and Driver ¼-mile trap 117 mph (sim 11.73 s @ 117.1 mph, 0–60 3.29 s, 1-ft rollout). High for an AWD dual-clutch, so the US 401 hp rating is probably conservative. Output-ratio bounds at this calibration: all gears on 4.059 → 11.80 s @ 116.1 mph (0–60 3.32 s); all on 3.45 → 11.89 s @ 114.0 mph (3.35 s)' },
    ],
  }),
};
