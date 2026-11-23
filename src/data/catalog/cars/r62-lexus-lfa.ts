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
  factory: {},
  sources: [
    {
      id: "test",
      title: "2012 Lexus LFA instrumented test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15127600/2012-lexus-lfa-instrumented-test/",
      kind: "road-test"
    }
  ],
  benchmarks: [],
  unsupportedReason: "Single-clutch automated manual (ASG) launch and shift model not added yet.",
  dataGaps: [
    "Factory specifications not yet researched",
    "Measured benchmark not yet transcribed"
  ]
};
