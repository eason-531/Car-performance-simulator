import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #51: 2021 Porsche 911 Turbo S Turbo S coupe (US). */
export const entry: CatalogEntry = {
  id: "2021-porsche-911-turbo-s-turbo-s-coupe-us-coupe-awd-8dct",
  roster: 51,
  section: "Sports cars",
  make: "Porsche",
  model: "911 Turbo S",
  trim: "Turbo S coupe",
  modelYear: 2021,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "992.1",
  aliases: [
    "Turbo S",
    "992",
    "911"
  ],
  origin: "Germany",
  usage: [
    "Sports Car",
    "Grand Tourer",
    "Supercar"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "8-speed PDK",
  powertrain: "Petrol",
  engineLabel: "3.7 twin-turbo flat-6",
  modelPath: "Existing",
  factory: {
    power: "640 hp @ 6,750 rpm",
    torque: "590 lb-ft @ 2,500–4,000 rpm",
    zeroTo60MphS: 2.6,
    sourceId: "src2",
    curbMass: "3,636 lb (Porsche US)"
  },
  sources: [
    {
      id: "test",
      title: "2021 Porsche 911 Turbo S testing",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/news/a34359564/2021-porsche-911-turbo-s-testing-zero-to-60/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "640-HP Porsche 911 Turbo S Ties for the Second-Quickest Car We've Tested",
      publisher: "Car and Driver (syndicated on Yahoo)",
      url: "https://sports.yahoo.com/640-hp-2021-porsche-911-164900225.html",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "Car and Driver: 2021 Porsche 911 Turbo S is crazy, crazy fast",
      publisher: "Rennlist",
      url: "https://rennlist.com/articles/this-just-in-2021-porsche-911-turbo-s-is-crazy-crazy-fast",
      kind: "reference"
    },
    {
      id: "src-porsche",
      title: "MY2021 911 Turbo S US technical specifications",
      publisher: "Porsche",
      url: "https://newsroom.porsche.com/dam/jcr%3A887d7189-958d-4946-a189-e170e87b13e7/U.S.%20Technical%20Specifications%202021%20911%20Turbo%20S%20Coupe%20and%20Cabriolet.pdf",
      kind: "manufacturer"
    },
    {
      id: "src-cd",
      title: "2021 Porsche 911 Turbo S full test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a32065924/2021-porsche-911-turbo-s-drive/",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src-cd",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 2.2,
        quarterMileS: 10.1,
        quarterMileTrapMph: 137,
        zeroTo100MphS: 5.3,
        zeroTo130MphS: 8.9,
        rolloutS: 0.2
      },
      conditions: {
        testMass: "3,646 lb as tested",
        tires: "Factory 255/35 ZR20 F · 315/30 ZR21 R (tire model not transcribed)"
      },
      match: "exact",
      verification: "Original Car and Driver full test (regular coupe, not the Lightweight Package). 0–100 mph from the review text; 0–130 mph from a forum repost of the C/D table, which also states 0.2 s rollout omitted. The 0–100 and 0–130 mph splits are held out of calibration (grip and efficiency were fitted to 0–60 mph and trap speed only).",
      date: "2020"
    }
  ],
  dataGaps: [
    "PTM front/rear split map (variable; a range is assumed)",
    "Drag coefficient",
    "Weight distribution",
    "Launch-control rpm"
  ],
  simCaveats: [
    "Provisional AWD approximation: one averaged rolling radius ties engine speed to the rear axle; the 3.33 front axle ratio is display-only and PTM uses a generic 0–50 % front-share range."
  ],
  sim: buildSpec({
  id: "2021-porsche-911-turbo-s-turbo-s-coupe-us-coupe-awd-8dct",
  make: "Porsche",
  model: "911 Turbo S",
  trim: "Turbo S coupe",
  modelYear: 2021,
  market: "US",
  body: "Coupe",
  shortName: "Porsche 911 Turbo S"
}, {
    engine: { code: '9A2 Evo (3.8 TT)', description: '3.7 L twin-turbo flat-6', displacementCc: 3745, aspiration: 'twin-turbo', idleRpm: 750, redlineRpm: 7200, revLimitRpm: 7200, power: { value: 640, unit: 'hp', rpm: [6750, 6750] }, torque: { value: 590, unit: 'lb-ft', rpm: [2500, 4000] }, peakBoostBar: 1.2 },
    transmission: { type: 'dual-clutch', name: '8-speed PDK', gearRatios: [4.89, 3.17, 2.15, 1.56, 1.18, 0.94, 0.76, 0.61], finalDrive: 3.02, frontAxleRatio: 3.33, upshiftTimeS: 0.12, shiftTorqueDip: 0.12, launchClutch: { launchRpm: 4500, brakeHoldRpmLimit: 4500 } },
    drivetrain: { layout: 'AWD', efficiency: 0.88, description: 'Porsche Traction Management (variable front coupling)', frontShareRange: [0, 0.5] },
    chassis: { curbMassKg: 1649, frontWeightFraction: 0.39, cgHeightM: 0.45, wheelbaseM: 2.45, lengthMm: 4535, widthMm: 1900, heightMm: 1303 },
    aero: {},
    tires: { sizes: [staggered('r20r21', '255/35 ZR20 F · 315/30 ZR21 R', { widthMm: 255, aspectPct: 35, rimIn: 20 }, { widthMm: 315, aspectPct: 30, rimIn: 21 }, 'Factory fitment')], compound: 'uhp', gripScale: 1.18 },
    speedLimiterKmh: null,
    factory: { zeroTo60MphS: 2.6 },
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.18', status: 'estimated', source: 'Fitted to the Car and Driver 0–60 mph 2.2 s with efficiency held at the AWD bound (factory curb mass now used)' },
      { parameter: 'Drivetrain efficiency', value: '88 %', status: 'estimated', source: 'A trap fit asked for 92 %, above the AWD bound; 88 % kept and the ≈−3 mph trap residual left visible. 0–100 and 0–130 mph splits are held out as checks' },
      { parameter: 'Curb mass', value: '3,636 lb (1,649 kg) factory; Car and Driver weighed its test car at 3,646 lb', status: 'verified', source: 'Porsche MY2021 US technical specification', url: 'https://download.newsroom.porsche.com/dam/jcr%3A8b531ae3-48f0-4d00-bfb9-c29f2676959b/Copy%20of%20U.S.%20Technical%20Specifications%202021%20911%20Turbo%20S%20Coupe%20and%20Cabriolet.pdf' },
      { parameter: 'Peak power', value: '640 hp @ 6,750 rpm', status: 'verified', source: 'Porsche MY2021 US technical specification (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://newsroom.porsche.com/dam/jcr%3A887d7189-958d-4946-a189-e170e87b13e7/U.S.%20Technical%20Specifications%202021%20911%20Turbo%20S%20Coupe%20and%20Cabriolet.pdf' },
      { parameter: 'Peak torque', value: '590 lb-ft @ 2,500–4,000 rpm', status: 'verified', source: 'Porsche MY2021 US technical specification (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://newsroom.porsche.com/dam/jcr%3A887d7189-958d-4946-a189-e170e87b13e7/U.S.%20Technical%20Specifications%202021%20911%20Turbo%20S%20Coupe%20and%20Cabriolet.pdf' },
      { parameter: 'Gear ratios', value: '4.89/3.17/2.15/1.56/1.18/0.94/0.76/0.61', status: 'verified', source: 'Porsche MY2021 US technical specification (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://newsroom.porsche.com/dam/jcr%3A887d7189-958d-4946-a189-e170e87b13e7/U.S.%20Technical%20Specifications%202021%20911%20Turbo%20S%20Coupe%20and%20Cabriolet.pdf' },
      { parameter: 'Final drive', value: '3.02 rear; 3.33 front (reference — the model ties engine speed to the rear axle)', status: 'verified', source: 'Porsche MY2021 US technical specification (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://newsroom.porsche.com/dam/jcr%3A887d7189-958d-4946-a189-e170e87b13e7/U.S.%20Technical%20Specifications%202021%20911%20Turbo%20S%20Coupe%20and%20Cabriolet.pdf' },
      { parameter: 'Tire size', value: '255/35 ZR20 F · 315/30 ZR21 R', status: 'verified', source: 'Porsche MY2021 US technical specification (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://newsroom.porsche.com/dam/jcr%3A887d7189-958d-4946-a189-e170e87b13e7/U.S.%20Technical%20Specifications%202021%20911%20Turbo%20S%20Coupe%20and%20Cabriolet.pdf' },
      { parameter: 'AWD split', value: 'Front share 0–0.50', status: 'estimated', source: 'PTM is variable; no fixed split is implied, so a rear-biased range is assumed' },
      { parameter: 'Weight distribution', value: '39 % front', status: 'estimated', source: 'Typical for the rear-engine 911; not in the sheet' },
      { parameter: 'Launch rpm', value: '≈4,500 rpm', status: 'estimated', source: 'Typical launch-control hold; not published' },
      { parameter: 'Dimensions', value: '4,535 × 1,900 × 1,303 mm, WB 2,450 mm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
