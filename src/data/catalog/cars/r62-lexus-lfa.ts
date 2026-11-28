import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

const DOSSIER = 'https://prensa.lexusauto.es/wp-content/uploads/2009/10/Dossier%20Lexus_LFA%20ingles.pdf';

/** Roster #62: 2012 Lexus LFA LFA (US). */
export const entry: CatalogEntry = {
  id: "2012-lexus-lfa-us-coupe-rwd-6amt",
  roster: 62,
  section: "Exotics",
  make: "Lexus",
  model: "LFA",
  trim: "LFA",
  modelYear: 2012,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "LFA10",
  aliases: [
    "LFA",
    "LFA10"
  ],
  origin: "Japan",
  usage: [
    "Supercar"
  ],
  drive: "RWD",
  transmission: "AMT",
  transmissionLabel: "6-speed single-clutch automated manual (ASG)",
  powertrain: "Petrol",
  engineLabel: "4.8 V10 (1LR-GUE)",
  modelPath: "AMT",
  factory: {
    power: "553 hp (US); 412 kW / 560 PS @ 8,700 rpm (EEC net)",
    torque: "354 lb-ft (US); 480 Nm @ 6,800 rpm (EEC net)",
    curbMass: "1,480–1,580 kg kerb (Lexus Europe range)",
    zeroTo100KmhS: 3.7,
    topSpeed: "325 km/h",
    sourceId: "src-lexus-dossier"
  },
  sources: [
    {
      id: "src-lexus-dossier",
      title: "Lexus LFA press dossier (vehicle specifications)",
      publisher: "Lexus Europe",
      url: DOSSIER,
      kind: "manufacturer",
      date: "2009-10"
    },
    {
      id: "test",
      title: "2012 Lexus LFA instrumented test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15127600/2012-lexus-lfa-instrumented-test/",
      kind: "road-test"
    },
    {
      id: "src-cd-cmp",
      title: "2011 Ferrari 599 HGTE vs. 2012 Lexus LFA (comparison test, December 2010 issue)",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/comparison-test/a15128593/2011-ferrari-599-hgte-vs-2012-lexus-lfa-comparison-test/",
      kind: "road-test",
      date: "2010-12"
    },
    {
      id: "src-cd-procedure",
      title: "Acceleration testing procedure change (rollout)",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/features/a30085446/acceleration-testing-procedure-change-rollout/",
      kind: "reference",
      date: "2019"
    },
    {
      id: "src-lexus-om",
      title: "2012 LFA owner's manual (OM77006U), launch control (printed p. 174)",
      publisher: "Lexus (mirror)",
      url: "https://www.carmanualsonline.info/lexus-lfa-2012-owner-s-manual-lexus-2012-lfa-owners-manual-om77006u/?srch=clutch",
      kind: "manufacturer"
    },
    {
      id: "src-lexus-inside",
      title: "Inside the LFA (printed p. 36)",
      publisher: "Lexus (mirror)",
      url: "https://www.carmanualsonline.info/lexus-lfa-2012-owner-s-manual-lexus-2012-lfa-inside-the-lfa/?srch=ESP",
      kind: "manufacturer"
    }
  ],
  benchmarks: [
    {
      id: "cd-comparo",
      sourceId: "src-cd-cmp",
      publication: "Car and Driver (comparison test)",
      date: "2010-12",
      timing: "unconfirmed",
      timingNote: "Car and Driver documents a legacy 3 mph timing convention for results before December 2019. How it maps onto the simulator's brake-release and 1-ft-rollout bases is uncertain, so both bases are shown and no timed split is fitted to this run.",
      results: {
        zeroTo60MphS: 3.6,
        quarterMileS: 11.7,
        quarterMileTrapMph: 125
      },
      conditions: {
        testMass: "3,569 lb as tested",
        tires: "Bridgestone 265/35ZR20 F / 305/30ZR20 R",
        launchControl: "Launch control used",
        other: [
          "Tested in England and Wales"
        ]
      },
      match: "equivalent",
      deviation: "Comparison car tested in England and Wales; its market and delivery specification are not established, while this entry is the US car.",
      verification: "Original comparison test (December 2010 issue) as verified in the Codex review of eb8c295 (2026-11); replaces a forum quote dated 2011. The Car and Driver site refuses automated fetches from this session. Provisional efficiency calibration uses this run at its measured 3,569 lb."
    },
    {
      id: "cd",
      sourceId: "test",
      publication: "Car and Driver (short take)",
      date: "2010",
      timing: "unconfirmed",
      timingNote: "Car and Driver documents a legacy 3 mph timing convention for results before December 2019. How it maps onto the simulator's brake-release and 1-ft-rollout bases is uncertain, so both bases are shown and no timed split is fitted to this run.",
      results: {
        zeroTo60MphS: 3.7,
        quarterMileS: 11.8,
        quarterMileTrapMph: 124
      },
      conditions: {
        testMass: "3,583 lb (measured curb)",
        driveMode: "Manual SPORT, fastest shift setting",
        launchControl: "None (prototype); ≈ 3,800 rpm neutral engagement"
      },
      match: "equivalent",
      deviation: "Prototype test car without launch control, launched by a ≈ 3,800 rpm neutral engagement in manual SPORT at the fastest shift setting.",
      verification: "Original short-take test as verified in the Codex review of eb8c295 (2026-11). Not used for calibration (prototype, no launch control)."
    }
  ],
  dataGaps: [
    "How Car and Driver's legacy 3 mph timing maps onto the simulator's bases (needed before fitting grip)",
    "An exact test of a US production LFA (both Car and Driver runs are equivalent: prototype short take; UK-based comparison car)",
    "High-speed drag with the active rear wing raised (it rises from 80 km/h depending on mode; only the retracted Cd 0.31 is published)",
    "Frontal area",
    "US curb mass basis (Lexus Europe gives a 1,480–1,580 kg range; Car and Driver weighed 3,583 lb and 3,569 lb)",
    "A hard fuel cut distinct from the published 9,000 rpm maximum engine speed",
    "ASG idle creep behaviour"
  ],
  simCaveats: [
    "Grip is the RWD calibration median, not fitted: both Car and Driver runs are equivalent (prototype short take; UK-based comparison car) and use the legacy timing convention. Efficiency is a provisional fit to the comparison run's trap at its measured 3,569 lb (trap does not depend on the start convention); the stock run uses the factory 1,480 kg kerb, so it traps higher than either test.",
    "The ASG is modelled as a single-clutch automated manual: TCU launch clutch at the production 4,000 rpm launch-control setting, no idle creep (estimated), and clutch-open upshifts in 0.2 s (drive torque ramps out over the first 12 %, is zero while the clutch is open and returns over the last 20 %).",
    "Aero uses the published Cd 0.31 with the rear wing retracted at every speed. The wing rises from 80 km/h depending on mode, adding unpublished drag: the simulated 332 km/h exceeds Lexus's 325 km/h, which about 11 % more drag area would match, so the gap is not attributed to one cause."
  ],
  notes: [
    "Lexus dossier: ASG 3.231/2.188/1.609/1.233/0.970/0.795, front counter gear 1.259, final drive 3.417. The counter gear acts in series with every gear: Lexus's maximum speed per gear at 9,000 rpm (83/123/167/218/277 km/h) matches gear × 1.259 × 3.417 within 1.5–1.7 % (rolling-radius convention), while gear × 3.417 alone would give 103 km/h in 1st."
  ],
  sim: buildSpec({
  id: "2012-lexus-lfa-us-coupe-rwd-6amt",
  make: "Lexus",
  model: "LFA",
  trim: "LFA",
  modelYear: 2012,
  market: "US",
  body: "Coupe",
  shortName: "Lexus LFA"
}, {
    engine: { code: '1LR-GUE', description: '4.8 L naturally aspirated 72° V10', displacementCc: 4805, aspiration: 'na', idleRpm: 900, redlineRpm: 9000, revLimitRpm: 9000, power: { value: 412, unit: 'kW', rpm: [8700, 8700] }, torque: { value: 480, unit: 'Nm', rpm: [6800, 6800] } },
    transmission: { type: 'automated-manual', name: '6-speed ASG (single-clutch automated manual)', gearRatios: [3.231, 2.188, 1.609, 1.233, 0.97, 0.795], finalDrive: 4.302, upshiftTimeS: 0.2, launchClutch: { launchRpm: 4000, brakeHoldRpmLimit: 4000 } },
    drivetrain: { layout: 'RWD', efficiency: 0.883, description: 'Rear transaxle via torque tube, torque-sensing limited-slip differential' },
    chassis: { curbMassKg: 1480, frontWeightFraction: 0.48, wheelbaseM: 2.605, lengthMm: 4505, widthMm: 1895, heightMm: 1220 },
    aero: { dragCoefficient: 0.31 },
    tires: { sizes: [staggered('r20', '265/35 R20 F · 305/30 R20 R', { widthMm: 265, aspectPct: 35, rimIn: 20 }, { widthMm: 305, aspectPct: 30, rimIn: 20 }, 'Factory fitment (Y-rated)')], compound: 'uhp', gripScale: 1.3 },
    speedLimiterKmh: null,
    factory: { zeroTo100S: 3.7, topSpeedKmh: 325 },
    provenance: [
      { parameter: 'Peak power', value: '412 kW (560 PS, EEC net) @ 8,700 rpm; 553 hp (US)', status: 'verified', source: 'Lexus LFA dossier specifications', url: DOSSIER },
      { parameter: 'Peak torque', value: '480 Nm (EEC net) @ 6,800 rpm; 354 lb-ft (US)', status: 'verified', source: 'Lexus LFA dossier specifications', url: DOSSIER },
      { parameter: 'Maximum engine speed', value: '9,000 rpm (also the redline)', status: 'verified', source: 'Lexus LFA dossier (maximum engine speed)', url: DOSSIER },
      { parameter: 'Rev limit', value: 'Hard cut modelled at 9,000 rpm', status: 'estimated', source: 'Not published: the model places its hard fuel cut at the sourced 9,000 rpm maximum engine speed; a distinct cut rpm and its behaviour are unknown' },
      { parameter: 'Gear ratios', value: '3.231/2.188/1.609/1.233/0.970/0.795', status: 'verified', source: 'Lexus LFA dossier specifications (6-speed ASG)', url: DOSSIER },
      { parameter: 'Final drive', value: '4.302 = front counter gear 1.259 × final drive 3.417', status: 'verified', source: "Lexus dossier lists both stages; its maximum speed per gear at 9,000 rpm (83/123/167/218/277 km/h) confirms they act in series for every gear (within 1.5–1.7 %)", url: DOSSIER },
      { parameter: 'Shift time', value: '0.2 s upshift (fastest of seven stages); 0.35 s down (estimated)', status: 'verified', source: 'Lexus dossier: upshifts in 0.2 s, adjustable in seven stages', url: DOSSIER },
      { parameter: 'Tire size', value: '265/35 R20 F · 305/30 R20 R', status: 'verified', source: 'Lexus LFA dossier specifications', url: DOSSIER },
      { parameter: 'Curb mass', value: '1,480 kg (lower end of the 1,480–1,580 kg kerb range); test cars 3,583 lb (short take) and 3,569 lb (comparison), kept separate', status: 'reported', source: 'Lexus LFA dossier (kerb weight range); US curb basis not published', url: DOSSIER },
      { parameter: 'Weight distribution', value: '48 % front', status: 'verified', source: 'Lexus LFA dossier (48:52)', url: DOSSIER },
      { parameter: 'Dimensions', value: '4,505 × 1,895 × 1,220 mm, WB 2,605 mm', status: 'verified', source: 'Lexus LFA dossier specifications', url: DOSSIER },
      { parameter: 'Drag coefficient', value: 'Cd 0.31 (rear wing retracted)', status: 'verified', source: 'Lexus LFA dossier', url: DOSSIER },
      { parameter: 'Gearbox model', value: 'Single-clutch automated manual: TCU launch clutch, clutch-open shifts (torque ramps out over 12 % of the shift, zero while open, back in over the last 20 %), no idle creep', status: 'estimated', source: 'Lexus describes a single-clutch ASG chosen over a double-clutch box; the torque envelope and idle creep are not documented', url: DOSSIER },
      { parameter: 'Launch rpm', value: '4,000 rpm (production launch control)', status: 'reported', source: "Lexus US owner's manual OM77006U (printed p. 174) and Inside the LFA (printed p. 36), as verified in the Codex review of eb8c295. The prototype short-take run used a ≈ 3,800 rpm neutral engagement instead (kept in its test conditions)", url: 'https://www.carmanualsonline.info/lexus-lfa-2012-owner-s-manual-lexus-2012-lfa-owners-manual-om77006u/?srch=clutch' },
      { parameter: 'Idle speed', value: '900 rpm', status: 'estimated', source: 'Not published' },
      { parameter: 'Tire grip calibration', value: '×1.30', status: 'estimated', source: 'RWD layout median of the calibrated cars; not fitted because both Car and Driver runs have an unconfirmed timing basis' },
      { parameter: 'Drivetrain efficiency', value: '88.3 % (provisional)', status: 'estimated', source: 'Trap fit to the Car and Driver comparison run (125 mph, launch control) with the model at that car\'s measured 3,569 lb plus driver. Sensitivity: the prototype short take (124 mph at 3,583 lb) asks for 86.7 %; fitting at the factory 1,480 kg kerb would ask for 82.3 % (the previous value), i.e. the mass mismatch, not driveline loss' },
    ],
  }),
};
