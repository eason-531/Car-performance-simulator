import type { CatalogEntry } from '../types';

/** Roster #17: 2019 Subaru WRX STI S209 (US). */
export const entry: CatalogEntry = {
  id: "2019-subaru-wrx-sti-s209-us-sedan-awd-6mt",
  roster: 17,
  section: "Daily and sport compacts",
  make: "Subaru",
  model: "WRX STI",
  trim: "S209",
  modelYear: 2019,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "VA",
  aliases: [
    "STI",
    "S209",
    "VA"
  ],
  origin: "Japan",
  usage: [
    "Sport Compact",
    "Track"
  ],
  drive: "AWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "2.5 turbo flat-4 (EJ257)",
  modelPath: "MT",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2019 Subaru WRX STI S209 first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2019-subaru-wrx-sti-s209-first-test-makes-special",
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
