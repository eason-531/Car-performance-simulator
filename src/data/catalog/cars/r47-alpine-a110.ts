import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #47: 2018 Alpine A110 Première Édition (IT). */
export const entry: CatalogEntry = {
  id: "2018-alpine-a110-premiere-edition-it-coupe-rwd-7dct",
  roster: 47,
  section: "Sports cars",
  make: "Alpine",
  model: "A110",
  trim: "Première Édition",
  modelYear: 2018,
  market: "IT",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "AS1",
  aliases: [
    "A110",
    "Premiere Edition",
    "AS1"
  ],
  origin: "France",
  usage: [
    "Sports Car"
  ],
  drive: "RWD",
  transmission: "DCT",
  transmissionLabel: "7-speed DCT",
  powertrain: "Petrol",
  engineLabel: "1.8 turbo I4 (M5P)",
  modelPath: "Existing",
  factory: {
    power: "252 PS @ 6,000 rpm",
    torque: "320 Nm",
    curbMass: "1,103 kg DIN (1,080 kg without options)",
    sourceId: "src-alpine"
  },
  sources: [
    {
      id: "test",
      title: "Alpine A110 Première Édition Centro Prove test",
      publisher: "Quattroruote",
      url: "https://www.quattroruote.it/prove/2018/alpine_a110_la_prova_della_premiere_edition/_jcr_content/summaryParsys/article_attachment/file.res/Centro-Prove-Alpine-A110.pdf",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Alpine A110 2018 brochure",
      publisher: "Alpine",
      url: "https://www.auto-brochures.com/makes/alpine/Alpine_int%20A110_2018-2.pdf",
      kind: "manufacturer"
    },
    {
      id: "src-alpine",
      title: "Alpine A110 Première Édition launch dossier",
      publisher: "Alpine",
      url: "https://www.renaultownersclub.com/wp-content/uploads/vehicles/Alpine%20A110%20-%202017%20Launch.pdf",
      kind: "manufacturer"
    },
    {
      id: "src-au",
      title: "Alpine A110 technical specifications (2018)",
      publisher: "Alpine Australia",
      url: "https://www.australiancar.reviews/_pdfs/Alpine_A110_XEF_TechnicalSpecifications_201806.pdf",
      kind: "manufacturer"
    }
  ],
  benchmarks: [
    {
      id: "qr",
      sourceId: "test",
      publication: "Quattroruote",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo100KmhS: 4.9,
        metres400S: 13.0,
        metres400TrapKmh: 176.7,
        kilometerS: 23.7,
        kilometerTrapKmh: 220.7
      },
      conditions: {
        testMass: "1,205 kg in test condition (43/57)"
      },
      match: "exact",
      verification: "Original test as transcribed in the owner-supplied spec-sheet follow-up, 2026-11; Centro Prove test PDF; 400 m kept separate from the quarter mile.",
      date: "2018"
    }
  ],
  dataGaps: [
    "Individual 7DCT gear ratios and final drive (effective reductions derived)",
    "Torque rpm band",
    "Launch-control rpm"
  ],
  notes: [
    "Gearing is provisional: Alpine publishes road speed per 1,000 rpm, not individual ratios. Effective overall reductions are derived as 60 × C / (km/h per 1,000 rpm), with C = 1.966 m, the rolling circumference of the 235/40 R18 rear tire at the simulator’s dynamic radius (97 % of unloaded). Individual gear and final-drive values remain unknown."
  ],
  sim: buildSpec({
  id: "2018-alpine-a110-premiere-edition-it-coupe-rwd-7dct",
  make: "Alpine",
  model: "A110",
  trim: "Première Édition",
  modelYear: 2018,
  market: "IT",
  body: "Coupe",
  shortName: "Alpine A110 Première Édition"
}, {
    engine: { code: 'M5P', description: '1.8 L turbo I4', displacementCc: 1798, aspiration: 'turbo', idleRpm: 800, redlineRpm: 6800, revLimitRpm: 7000, power: { value: 252, unit: 'PS', rpm: [6000, 6000] }, torque: { value: 320, unit: 'Nm', rpm: [2000, 5000] }, peakBoostBar: 1.3 },
    transmission: { type: 'dual-clutch', name: '7-speed dual-clutch (effective reductions)', gearRatios: [13.701, 8.978, 6.418, 4.897, 3.926, 3.198, 2.681], finalDrive: 1, launchClutch: { launchRpm: 3500, brakeHoldRpmLimit: 3500 } },
    drivetrain: { layout: 'RWD', description: 'Rear-wheel drive, open differential with brake-based torque vectoring' },
    chassis: { curbMassKg: 1103, frontWeightFraction: 0.43, cgHeightM: 0.42, wheelbaseM: 2.42, lengthMm: 4180, widthMm: 1798, heightMm: 1252 },
    aero: { dragCoefficient: 0.338, frontalAreaM2: 1.918 },
    tires: { sizes: [staggered('r18', '205/40 R18 F · 235/40 R18 R', { widthMm: 205, aspectPct: 40, rimIn: 18 }, { widthMm: 235, aspectPct: 40, rimIn: 18 }, 'Michelin Pilot Sport 4 (assumed)')], compound: 'uhp', gripScale: 1.0 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.00', status: 'estimated', source: 'A grip fit to the Quattroruote 0–100 km/h 4.9 s needed no increase' },
      { parameter: 'Peak power', value: '252 PS @ 6,000 rpm', status: 'verified', source: 'Alpine Première Édition launch dossier (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.renaultownersclub.com/wp-content/uploads/vehicles/Alpine%20A110%20-%202017%20Launch.pdf' },
      { parameter: 'Peak torque', value: '320 Nm', status: 'verified', source: 'Alpine Première Édition launch dossier (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.renaultownersclub.com/wp-content/uploads/vehicles/Alpine%20A110%20-%202017%20Launch.pdf' },
      { parameter: 'Torque band', value: '2,000–5,000 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Gear ratios', value: '13.701 / 8.978 / 6.418 / 4.897 / 3.926 / 3.198 / 2.681 (effective overall)', status: 'estimated', source: 'Derived from Alpine Australia km/h per 1,000 rpm (8.61 / 13.14 / 18.38 / 24.09 / 30.05 / 36.89 / 44.01) with a fixed rolling circumference; individual ratios unknown (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.australiancar.reviews/_pdfs/Alpine_A110_XEF_TechnicalSpecifications_201806.pdf' },
      { parameter: 'Final drive', value: '1 (folded into the effective reductions)', status: 'estimated', source: 'Individual final drive unknown' },
      { parameter: 'Curb mass', value: '1,103 kg DIN', status: 'verified', source: 'Alpine Première Édition launch dossier (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.renaultownersclub.com/wp-content/uploads/vehicles/Alpine%20A110%20-%202017%20Launch.pdf' },
      { parameter: 'Weight distribution', value: '43/57 front/rear (as tested)', status: 'reported', source: 'Quattroruote test (owner-supplied spec-sheet follow-up, 2026-11)' },
      { parameter: 'Drag coefficient', value: 'Cd 0.338', status: 'reported', source: 'Quattroruote road figures (owner-supplied spec-sheet follow-up, 2026-11)' },
      { parameter: 'Frontal area', value: '1.918 m²', status: 'reported', source: 'Quattroruote road figures (owner-supplied spec-sheet follow-up, 2026-11)' },
      { parameter: 'Tire size', value: '205/40 R18 F · 235/40 R18 R', status: 'reported', source: 'Alpine Australia technical table (same generation) (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://www.australiancar.reviews/_pdfs/Alpine_A110_XEF_TechnicalSpecifications_201806.pdf' },
      { parameter: 'Dimensions', value: '4,180 × 1,798 × 1,252 mm, WB 2,420 mm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
