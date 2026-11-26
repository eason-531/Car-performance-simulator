import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

const SHEET = 'https://www.allcarcentral.com/McLaren_pdf/McLAREN_F1_ROADCAR-SPECIFICATION.pdf';
const OEM = 'https://www.mclaren.com/cars/gl_en/ultimate-models/mclaren-f1';

/**
 * Effective overall reductions from the sheet's road speed per 1,000 rpm
 * (8.7/12.7/16.7/20.0/24.0/30.0 mph) with the simulator rolling radius of the
 * 315/45 ZR17 rear (0.34692 m): overall = 1000 × 2πr ÷ (60 × v).
 */
const F1_REDUCTIONS = [9.341, 6.399, 4.866, 4.063, 3.386, 2.709] as const;

/** Hypercar extension #20: 1994 McLaren F1 road car (UK). */
export const entry: CatalogEntry = {
  id: "1994-mclaren-f1-uk-coupe-rwd-6mt",
  extension: { set: 'Hypercars', order: 20 },
  section: "Hypercars",
  make: "McLaren",
  model: "F1",
  trim: "Road car",
  modelYear: 1994,
  market: "UK",
  body: "Coupe",
  bodyLabel: "Coupé (central driving position)",
  aliases: [
    "F1",
    "S70/2"
  ],
  origin: "United Kingdom",
  usage: [
    "Hypercar"
  ],
  drive: "RWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "6.1 V12 (BMW S70/2)",
  modelPath: "MT",
  factory: {
    power: "461 kW / 627 PS @ 7,500 rpm",
    torque: "651 Nm @ 5,600 rpm",
    curbMass: "1,140 kg (kerb)",
    zeroTo60MphS: 3.2,
    topSpeed: "386 km/h (240.1 mph) as listed; the record figure, not the road car's rev-limited speed",
    sourceId: "src-mclaren-sheet"
  },
  sources: [
    {
      id: "src-mclaren-sheet",
      title: "McLaren F1 road car specification (McLaren Automotive, mirrored)",
      publisher: "McLaren Automotive (mirror)",
      url: SHEET,
      kind: "manufacturer"
    },
    {
      id: "src-mclaren",
      title: "McLaren F1",
      publisher: "McLaren",
      url: OEM,
      kind: "manufacturer"
    }
  ],
  benchmarks: [],
  dataGaps: [
    "Road-car rev limit (7,500 rpm from secondary leads; the record run used a raised limit)",
    "Model year of the represented car (production 1993–1998)",
    "Measured road test with timing basis (the sheet's 0–60 mph 3.2 s and ¼ mile 11.1 s @ 138 mph are listed without conditions)",
    "Frontal area",
    "Gearbox internal stages (listed ratios × 2.37 are ≈ 23 % taller than the sheet's speed-per-1,000-rpm column)"
  ],
  simCaveats: [
    "Gearing uses overall reductions from the sheet's road speed per 1,000 rpm; the listed ratios with the 2.37 final would be ≈ 23 % taller, consistent with the unlisted bevel stage, so the final-drive entry is 1.000.",
    "No measured benchmark: grip is the RWD calibration median, which runs quicker than the sheet's own figures (≈ 2.7 s to 60 mph and 10.4 s @ 142.5 mph from brake release vs 3.2 s and 11.1 s @ 138 mph). The road car is modelled at a 7,500 rpm cut, so 6th tops out near 362 km/h; the sheet's 386 km/h is the raised-limit record figure."
  ],
  notes: [
    "McLaren's sheet lists 0–60 mph 3.2 s, 0–100 mph 6.3 s, 0–150 mph 12.8 s, ¼ mile 11.1 s @ 138 mph and standing km 19.6 s @ 177 mph without test conditions; they are kept as factory figures, not measurements.",
    "F1 LM, F1 GT and the 1998 record-run configuration are separate cars and are not represented here."
  ],
  sim: buildSpec({
  id: "1994-mclaren-f1-uk-coupe-rwd-6mt",
  make: "McLaren",
  model: "F1",
  trim: "Road car",
  modelYear: 1994,
  market: "UK",
  body: "Coupe",
  shortName: "McLaren F1"
}, {
    engine: { code: 'BMW S70/2', description: '6.1 L naturally aspirated 60° V12', displacementCc: 6064, aspiration: 'na', idleRpm: 900, redlineRpm: 7500, revLimitRpm: 7500, power: { value: 461, unit: 'kW', rpm: [7500, 7500] }, torque: { value: 651, unit: 'Nm', rpm: [5600, 5600] } },
    transmission: { type: 'manual', name: '6-speed manual (transverse, bevel and spur final drive; effective reductions)', gearRatios: F1_REDUCTIONS, finalDrive: 1 },
    drivetrain: { layout: 'RWD', description: 'Rear-wheel drive with limited-slip differential' },
    chassis: { curbMassKg: 1140, frontWeightFraction: 0.412, wheelbaseM: 2.718, lengthMm: 4287, widthMm: 1820, heightMm: 1140 },
    aero: { dragCoefficient: 0.32 },
    tires: { sizes: [staggered('r17', '235/45 ZR17 F · 315/45 ZR17 R', { widthMm: 235, aspectPct: 45, rimIn: 17 }, { widthMm: 315, aspectPct: 45, rimIn: 17 }, 'Factory fitment (9 × 17 F, 11.5 × 17 R)')], compound: 'uhp', gripScale: 1.3 },
    speedLimiterKmh: null,
    factory: { zeroTo60MphS: 3.2 },
    provenance: [
      { parameter: 'Peak power', value: '461 kW (627 PS) @ 7,500 rpm', status: 'verified', source: 'McLaren F1 road car specification', url: SHEET },
      { parameter: 'Peak torque', value: '651 Nm @ 5,600 rpm', status: 'verified', source: 'McLaren F1 road car specification', url: SHEET },
      { parameter: 'Gear ratios', value: 'Effective 9.341/6.399/4.866/4.063/3.386/2.709', status: 'estimated', source: 'Derived from the sheet’s road speed per 1,000 rpm (8.7/12.7/16.7/20.0/24.0/30.0 mph) with the simulator rolling radius 0.34692 m. The sheet also lists 3.23/2.19/1.71/1.39/1.16/0.93 with a 2.37 final; those products are ≈ 23 % taller in every gear (consistent with an unlisted bevel stage), so the speed column is used', url: SHEET },
      { parameter: 'Final drive', value: '1.000 (folded into the effective reductions); 2.37 listed', status: 'estimated', source: 'McLaren lists a 2.37 spur final drive after high-speed bevel gears; the bevel ratio is not listed', url: SHEET },
      { parameter: 'Tire size', value: '235/45 ZR17 F · 315/45 ZR17 R', status: 'verified', source: 'McLaren F1 road car specification', url: SHEET },
      { parameter: 'Curb mass', value: '1,140 kg (kerb)', status: 'verified', source: 'McLaren F1 road car specification', url: SHEET },
      { parameter: 'Weight distribution', value: '41.2 % front', status: 'verified', source: 'McLaren F1 road car specification (41.2/58.8)', url: SHEET },
      { parameter: 'Dimensions', value: '4,287 × 1,820 × 1,140 mm, WB 2,718 mm', status: 'verified', source: 'McLaren F1 road car specification', url: SHEET },
      { parameter: 'Drag coefficient', value: 'Cd 0.32', status: 'verified', source: 'McLaren F1 road car specification', url: SHEET },
      { parameter: 'Rev limit', value: '7,500 rpm', status: 'estimated', source: 'Secondary leads give a 7,500 rpm road-car limiter (the 1998 record car ran a raised limit); not in the McLaren sheet, which lists peak power at 7,500 rpm' },
      { parameter: 'Model year', value: '1994', status: 'estimated', source: 'Production ran 1993–1998 per secondary leads; the McLaren sheet carries no date' },
      { parameter: 'Fuel', value: '95–98 RON unleaded', status: 'verified', source: 'McLaren F1 road car specification', url: SHEET },
      { parameter: 'Idle speed', value: '900 rpm', status: 'estimated', source: 'Not published' },
      { parameter: 'Tire grip calibration', value: '×1.30', status: 'estimated', source: 'No measured benchmark with a timing basis; RWD layout median of the calibrated cars' },
    ],
  }),
};
