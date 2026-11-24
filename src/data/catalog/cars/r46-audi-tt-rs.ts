import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #46: 2018 Audi TT RS Coupe (US). */
export const entry: CatalogEntry = {
  id: "2018-audi-tt-rs-coupe-us-coupe-awd-7dct",
  roster: 46,
  section: "Sports cars",
  make: "Audi",
  model: "TT RS",
  trim: "Coupe",
  modelYear: 2018,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "8S",
  aliases: [
    "TTRS",
    "8S",
    "quattro"
  ],
  origin: "Germany",
  usage: [
    "Sports Car"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "7-speed S tronic",
  powertrain: "Petrol",
  engineLabel: "2.5 turbo I5 (EA855 evo)",
  modelPath: "Existing",
  factory: {
    power: "400 hp (US); 400 PS / 294 kW (EU)",
    torque: "354 lb-ft / 480 Nm @ 1,700–5,850 rpm",
    sourceId: "src-audi-eu"
  },
  sources: [
    {
      id: "test",
      title: "2018 Audi TT RS test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a14516384/2018-audi-tt-rs-test-review/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Audi TT RS Coupé technical data (eTD)",
      publisher: "Audi MediaCenter",
      url: "https://uploads.audi-mediacenter.com/system/production/car_motorizations/837/file_en/ab1a688414eda4f444a9a7fad976f57fbe0061a8/eTD_Audi_TTRS_Coupe_TFSI_221102.pdf",
      kind: "manufacturer"
    },
    {
      id: "src3",
      title: "Audi TT RS drivetrain",
      publisher: "Audi MediaCenter",
      url: "https://www.audi-mediacenter.com/en/the-audi-tt-rs-2924/drivetrain-2940",
      kind: "manufacturer"
    },
    {
      id: "src-audi-eu",
      title: "TT RS Coupé 2.5 TFSI 294 kW technical data (launch era)",
      publisher: "Audi",
      url: "https://sport-auto.ch/essais/wp-content/uploads/2016/09/etd-TT-RS-Coup%C3%A9-2.5-TFSI-294-kW_0716.pdf",
      kind: "manufacturer"
    },
    {
      id: "src-cd-specs",
      title: "2018 Audi TT RS coupe specifications",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/audi/tt-rs/specs/2018/audi_tt-rs_audi-tt-rs-coupe_2018",
      kind: "reference"
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
        zeroTo60MphS: 3.4,
        quarterMileS: 11.9,
        quarterMileTrapMph: 117
      },
      conditions: {
        testMass: "3,270 lb"
      },
      match: "exact",
      verification: "Original test as transcribed in the owner-supplied spec-sheet follow-up, 2026-11; original test.",
      date: "2017"
    }
  ],
  dataGaps: [
    "US tire size (assumed)",
    "Power rpm band for the US rating",
    "Haldex split range",
    "Weight distribution"
  ],
  sim: buildSpec({
  id: "2018-audi-tt-rs-coupe-us-coupe-awd-7dct",
  make: "Audi",
  model: "TT RS",
  trim: "Coupe",
  modelYear: 2018,
  market: "US",
  body: "Coupe",
  shortName: "Audi TT RS"
}, {
    engine: { code: 'DAZA', description: '2.5 L turbo I5', displacementCc: 2480, aspiration: 'turbo', idleRpm: 750, redlineRpm: 7000, revLimitRpm: 7200, power: { value: 400, unit: 'hp', rpm: [5850, 7000] }, torque: { value: 354, unit: 'lb-ft', rpm: [1700, 5850] }, peakBoostBar: 1.35 },
    transmission: { type: 'dual-clutch', name: '7-speed S tronic (DQ500)', gearRatios: [3.563, 2.526, 1.679, 1.022, 0.788, 0.761, 0.635], finalDrive: [4.059, 3.45, 3.45, 4.059, 4.059, 3.45, 3.45], upshiftTimeS: 0.12, launchClutch: { launchRpm: 4000, brakeHoldRpmLimit: 4000 } },
    drivetrain: { layout: 'AWD', efficiency: 0.845, description: 'quattro with multi-plate front-biased coupling' },
    chassis: { curbMassKg: 1483, frontWeightFraction: 0.59, wheelbaseM: 2.505, lengthMm: 4191, widthMm: 1832, heightMm: 1344 },
    aero: { dragCoefficient: 0.32, frontalAreaM2: 2.09 },
    tires: { sizes: [square('r19', '255/35 R19', 255, 35, 19, 'US standard fitment (assumed)'), square('r20', '255/30 R20', 255, 30, 20, 'Optional 20-inch')], compound: 'uhp', gripScale: 1.12 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.12', status: 'estimated', source: 'Fitted to the Car and Driver 0–60 mph 3.4 s' },
      { parameter: 'Drivetrain efficiency', value: '84.5 %', status: 'estimated', source: 'Fitted to the Car and Driver ¼-mile trap 117 mph' },
      { parameter: 'Peak power', value: '400 hp @ 5,850–7,000 rpm (US rating; rpm band from the EU sheet)', status: 'reported', source: 'US rating with Audi EU rpm band (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.caranddriver.com/audi/tt-rs/specs/2018/audi_tt-rs_audi-tt-rs-coupe_2018' },
      { parameter: 'Peak torque', value: '354 lb-ft (480 Nm) @ 1,700–5,850 rpm', status: 'verified', source: 'Audi launch-era technical sheet (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://sport-auto.ch/essais/wp-content/uploads/2016/09/etd-TT-RS-Coup%C3%A9-2.5-TFSI-294-kW_0716.pdf' },
      { parameter: 'Gear ratios', value: '3.563/2.526/1.679/1.022/0.788/0.761/0.635', status: 'verified', source: 'Audi technical sheet; US specifications corroborate to rounding (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://sport-auto.ch/essais/wp-content/uploads/2016/09/etd-TT-RS-Coup%C3%A9-2.5-TFSI-294-kW_0716.pdf' },
      { parameter: 'Final drive', value: '4.059 (1st, 4th, 5th, R) / 3.450 (2nd, 3rd, 6th, 7th)', status: 'reported', source: 'Factory EU per-gear mapping with US corroboration of one final drive (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://sport-auto.ch/essais/wp-content/uploads/2016/09/etd-TT-RS-Coup%C3%A9-2.5-TFSI-294-kW_0716.pdf' },
      { parameter: 'Drag coefficient', value: 'Cd 0.32', status: 'reported', source: 'Audi EU technical sheet (same body) (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://sport-auto.ch/essais/wp-content/uploads/2016/09/etd-TT-RS-Coup%C3%A9-2.5-TFSI-294-kW_0716.pdf' },
      { parameter: 'Frontal area', value: '2.09 m²', status: 'reported', source: 'Audi EU technical sheet (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://sport-auto.ch/essais/wp-content/uploads/2016/09/etd-TT-RS-Coup%C3%A9-2.5-TFSI-294-kW_0716.pdf' },
      { parameter: 'Curb mass', value: '3,270 lb (1,483 kg) as tested', status: 'reported', source: 'Car and Driver test (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.caranddriver.com/reviews/a14516384/2018-audi-tt-rs-test-review/' },
      { parameter: 'Tire size', value: '255/35 R19', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Weight distribution', value: '59 % front', status: 'estimated', source: 'Typical for the front-engined TT; not in the sheet' },
      { parameter: 'Dimensions', value: '4,191 × 1,832 × 1,344 mm, WB 2,505 mm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
