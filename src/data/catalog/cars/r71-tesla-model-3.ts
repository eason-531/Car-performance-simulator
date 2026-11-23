import type { CatalogEntry } from '../types';

/** Roster #71: 2024 Tesla Model 3 Performance (US). */
export const entry: CatalogEntry = {
  id: "2024-tesla-model-3-performance-us-sedan-awd-ev",
  roster: 71,
  section: "Electric cars and trucks",
  make: "Tesla",
  model: "Model 3",
  trim: "Performance",
  modelYear: 2024,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "Highland",
  aliases: [
    "Model 3",
    "Highland"
  ],
  origin: "United States",
  usage: [
    "Sport Sedan",
    "Daily"
  ],
  drive: "AWD",
  transmission: "Direct drive",
  transmissionLabel: "Single-speed",
  powertrain: "Electric",
  engineLabel: "Dual-motor",
  modelPath: "EV",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2024 Tesla Model 3 Performance test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a62597386/2024-tesla-model-3-performance-test/",
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
