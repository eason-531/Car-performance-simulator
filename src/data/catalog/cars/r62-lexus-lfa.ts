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
      id: "src2",
      title: "2012 Lexus LFA tested — short take road test (reprint)",
      publisher: "PakWheels forum (Car and Driver reprint)",
      url: "https://www.pakwheels.com/forums/t/lexus-fan-club/119439?page=8",
      kind: "reference"
    },
    {
      id: "src3",
      title: "C/D comparison: Lexus LFA vs Ferrari 599 HGTE",
      publisher: "ClubLexus forum (quote)",
      url: "https://clublexus.com/forums/lfa-model-2012/533844-hell-has-frozen-over-c-and-d-comparo-lexus-lfa-vs-ferrari-599-hgte-spoiler-2.html",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "cd-comparo",
      sourceId: "src3",
      publication: "Car and Driver comparison (forum quote)",
      timing: "unconfirmed",
      timingNote: "Car and Driver test published before its late-2019 move to a 1-ft rollout; the earlier procedure is not confirmed here, so both simulator bases are shown.",
      results: {
        zeroTo60MphS: 3.6,
        quarterMileS: 11.7,
        quarterMileTrapMph: 125
      },
      conditions: {
        launchControl: "Launch control"
      },
      match: "exact",
      verification: "Forum quote; an aggregator attributes the same run to Car and Driver.",
      date: "2011"
    },
    {
      id: "cd",
      sourceId: "test",
      publication: "Car and Driver",
      timing: "unconfirmed",
      timingNote: "Car and Driver test published before its late-2019 move to a 1-ft rollout; the earlier procedure is not confirmed here, so both simulator bases are shown.",
      results: {
        zeroTo60MphS: 3.7,
        quarterMileS: 11.8,
        quarterMileTrapMph: 124
      },
      conditions: {
        testMass: "3,583 lb"
      },
      match: "exact",
      verification: "Original test as transcribed in the owner-supplied spec-sheet follow-up, 2026-11; instrumented test.",
      date: "2010"
    }
  ],
  dataGaps: [
    "Car and Driver timing procedure for the 2010/2011 runs (needed before fitting grip)",
    "Launch-control rpm",
    "Frontal area",
    "US curb mass basis (Lexus Europe gives a 1,480–1,580 kg range; Car and Driver weighed 3,583 lb)"
  ],
  simCaveats: [
    "Grip is the RWD calibration median, not fitted: both Car and Driver runs have an unconfirmed timing basis. Efficiency is fitted to the trap speed, which does not depend on the start convention.",
    "The ASG is modelled as a single-clutch automated manual: TCU launch clutch, no idle creep (estimated), and drive torque fully interrupted for the 0.2 s upshift."
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
    transmission: { type: 'automated-manual', name: '6-speed ASG (single-clutch automated manual)', gearRatios: [3.231, 2.188, 1.609, 1.233, 0.97, 0.795], finalDrive: 4.302, upshiftTimeS: 0.2, launchClutch: { launchRpm: 4500, brakeHoldRpmLimit: 4500 } },
    drivetrain: { layout: 'RWD', efficiency: 0.823, description: 'Rear transaxle via torque tube, torque-sensing limited-slip differential' },
    chassis: { curbMassKg: 1480, frontWeightFraction: 0.48, wheelbaseM: 2.605, lengthMm: 4505, widthMm: 1895, heightMm: 1220 },
    aero: { dragCoefficient: 0.31 },
    tires: { sizes: [staggered('r20', '265/35 R20 F · 305/30 R20 R', { widthMm: 265, aspectPct: 35, rimIn: 20 }, { widthMm: 305, aspectPct: 30, rimIn: 20 }, 'Factory fitment (Y-rated)')], compound: 'uhp', gripScale: 1.3 },
    speedLimiterKmh: null,
    factory: { zeroTo100S: 3.7, topSpeedKmh: 325 },
    provenance: [
      { parameter: 'Peak power', value: '412 kW (560 PS, EEC net) @ 8,700 rpm; 553 hp (US)', status: 'verified', source: 'Lexus LFA dossier specifications', url: DOSSIER },
      { parameter: 'Peak torque', value: '480 Nm (EEC net) @ 6,800 rpm; 354 lb-ft (US)', status: 'verified', source: 'Lexus LFA dossier specifications', url: DOSSIER },
      { parameter: 'Rev limit', value: '9,000 rpm', status: 'verified', source: 'Lexus LFA dossier (maximum engine speed)', url: DOSSIER },
      { parameter: 'Gear ratios', value: '3.231/2.188/1.609/1.233/0.970/0.795', status: 'verified', source: 'Lexus LFA dossier specifications (6-speed ASG)', url: DOSSIER },
      { parameter: 'Final drive', value: '4.302 = front counter gear 1.259 × final drive 3.417', status: 'verified', source: "Lexus dossier lists both stages; its maximum speed per gear at 9,000 rpm (83/123/167/218/277 km/h) confirms they act in series for every gear (within 1.5–1.7 %)", url: DOSSIER },
      { parameter: 'Shift time', value: '0.2 s upshift (fastest of seven stages); 0.35 s down (estimated)', status: 'verified', source: 'Lexus dossier: upshifts in 0.2 s, adjustable in seven stages', url: DOSSIER },
      { parameter: 'Tire size', value: '265/35 R20 F · 305/30 R20 R', status: 'verified', source: 'Lexus LFA dossier specifications', url: DOSSIER },
      { parameter: 'Curb mass', value: '1,480 kg (lower end of the 1,480–1,580 kg kerb range); Car and Driver weighed 3,583 lb', status: 'reported', source: 'Lexus LFA dossier (kerb weight range); test mass kept separately', url: DOSSIER },
      { parameter: 'Weight distribution', value: '48 % front', status: 'verified', source: 'Lexus LFA dossier (48:52)', url: DOSSIER },
      { parameter: 'Dimensions', value: '4,505 × 1,895 × 1,220 mm, WB 2,605 mm', status: 'verified', source: 'Lexus LFA dossier specifications', url: DOSSIER },
      { parameter: 'Drag coefficient', value: 'Cd 0.31 (rear wing retracted)', status: 'verified', source: 'Lexus LFA dossier', url: DOSSIER },
      { parameter: 'Gearbox model', value: 'Single-clutch automated manual: TCU launch clutch, clutch-open (interrupt) shifts, no idle creep', status: 'estimated', source: 'Lexus describes a single-clutch ASG chosen over a double-clutch box; idle creep behaviour is not documented', url: DOSSIER },
      { parameter: 'Launch rpm', value: '≈ 4,500 rpm', status: 'estimated', source: 'Typical launch-control hold; not published' },
      { parameter: 'Idle speed', value: '900 rpm', status: 'estimated', source: 'Not published' },
      { parameter: 'Tire grip calibration', value: '×1.30', status: 'estimated', source: 'RWD layout median of the calibrated cars; not fitted because both Car and Driver runs have an unconfirmed timing basis' },
      { parameter: 'Drivetrain efficiency', value: '82.3 %', status: 'estimated', source: 'Trap fit (independent of the start convention): the 125 mph comparison run gives 82.3 %; the original 124 mph test asks for ≈ 80 %, below the plausible range, so 82.3 % (the lowest value accepted elsewhere in the catalog, Lexus GS F / IS 500) is held and the ≈ +1 mph residual to the original test left visible. The model uses the lower 1,480 kg kerb while the test car weighed 3,583 lb; no cause is attributed' },
    ],
  }),
};
