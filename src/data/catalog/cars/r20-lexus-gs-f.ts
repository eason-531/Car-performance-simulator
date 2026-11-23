import type { CatalogEntry } from '../types';

/** Roster #20: 2016 Lexus GS F GS F (US). */
export const entry: CatalogEntry = {
  id: "2016-lexus-gs-f-us-sedan-rwd-8at",
  roster: 20,
  section: "Luxury and sport sedans",
  make: "Lexus",
  model: "GS F",
  trim: "GS F",
  modelYear: 2016,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "L10",
  aliases: [
    "GSF",
    "L10"
  ],
  origin: "Japan",
  usage: [
    "Sport Sedan",
    "Luxury",
    "Track"
  ],
  drive: "RWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic",
  powertrain: "Petrol",
  engineLabel: "5.0 V8 (2UR-GSE)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2016 Lexus GS F test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15102088/2016-lexus-gs-f-test-review/",
      kind: "road-test"
    }
  ],
  benchmarks: [],
  unsupportedReason: "Research in progress — factory gearing, mass and output not yet modeled.",
  dataGaps: [
    "Factory specifications not yet researched",
    "Measured benchmark not yet transcribed"
  ]
};
