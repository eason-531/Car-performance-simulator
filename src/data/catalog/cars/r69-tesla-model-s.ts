import type { CatalogEntry } from '../types';

/** Roster #69: 2021 Tesla Model S Plaid (US). */
export const entry: CatalogEntry = {
  id: "2021-tesla-model-s-plaid-us-liftback-awd-ev",
  roster: 69,
  section: "Electric cars and trucks",
  make: "Tesla",
  model: "Model S",
  trim: "Plaid",
  modelYear: 2021,
  market: "US",
  body: "Liftback",
  bodyLabel: "Liftback",
  chassisCode: "Refresh",
  aliases: [
    "Plaid",
    "Model S"
  ],
  origin: "United States",
  usage: [
    "Sport Sedan",
    "Luxury"
  ],
  drive: "AWD",
  transmission: "Direct drive",
  transmissionLabel: "Single-speed",
  powertrain: "Electric",
  engineLabel: "Tri-motor",
  modelPath: "EV",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2021 Tesla Model S Plaid performance test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/news/a38439509/2021-tesla-model-s-plaid-performance-test-comparison/",
      kind: "road-test"
    }
  ],
  benchmarks: [],
  unsupportedReason: "EV motor torque, battery output limits and axle gearing need a dedicated model; not modeled yet.",
  dataGaps: [
    "Factory specifications not yet researched",
    "Measured benchmark not yet transcribed"
  ]
};
