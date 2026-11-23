import type { CatalogEntry } from '../types';

/** Roster #30: 2017 Alfa Romeo Giulia Quadrifoglio (US). */
export const entry: CatalogEntry = {
  id: "2017-alfa-romeo-giulia-quadrifoglio-us-sedan-rwd-8at",
  roster: 30,
  section: "Luxury and sport sedans",
  make: "Alfa Romeo",
  model: "Giulia",
  trim: "Quadrifoglio",
  modelYear: 2017,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "952",
  aliases: [
    "Giulia QV",
    "Quadrifoglio",
    "952",
    "Alfa"
  ],
  origin: "Italy",
  usage: [
    "Sport Sedan",
    "Track"
  ],
  drive: "RWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic",
  powertrain: "Petrol",
  engineLabel: "2.9 twin-turbo V6",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2017 Alfa Romeo Giulia Quadrifoglio test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15098913/2017-alfa-romeo-giulia-quadrifoglio-test-review/",
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
