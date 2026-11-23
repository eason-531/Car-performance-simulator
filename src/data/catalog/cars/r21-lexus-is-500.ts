import type { CatalogEntry } from '../types';

/** Roster #21: 2022 Lexus IS 500 F Sport Performance Premium (US). */
export const entry: CatalogEntry = {
  id: "2022-lexus-is-500-f-sport-performance-premium-us-sedan-rwd-8at",
  roster: 21,
  section: "Luxury and sport sedans",
  make: "Lexus",
  model: "IS 500",
  trim: "F Sport Performance Premium",
  modelYear: 2022,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "XE30",
  aliases: [
    "IS500",
    "XE30"
  ],
  origin: "Japan",
  usage: [
    "Sport Sedan",
    "Luxury"
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
      title: "2022 Lexus IS500 F Sport Performance by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a37418797/2022-lexus-is500-f-sport-performance-by-the-numbers/",
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
