import type { CatalogEntry } from '../types';

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
    power: "553 hp",
    torque: "354 lb-ft",
    sourceId: "src2"
  },
  sources: [
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
    "Drag coefficient",
    "Where the 1.259 counter gear acts in the ASG driveline"
  ],
  unsupportedReason: "Single-clutch automated manual (ASG) launch and shift model not added yet.",
  notes: [
    "Lexus press dossier: ASG 3.231/2.188/1.609/1.233/0.970/0.795, front counter gear 1.259, final drive 3.417. Where the counter gear acts must be confirmed before the ratios are combined."
  ]
};
