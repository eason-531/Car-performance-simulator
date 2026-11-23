import type { CatalogEntry } from '../types';

/** Roster #68: 2025 Hyundai Ioniq 5 N Ioniq 5 N (US). */
export const entry: CatalogEntry = {
  id: "2025-hyundai-ioniq-5-n-us-cuv-awd-ev",
  roster: 68,
  section: "Electric cars and trucks",
  make: "Hyundai",
  model: "Ioniq 5 N",
  trim: "Ioniq 5 N",
  modelYear: 2025,
  market: "US",
  body: "Crossover",
  bodyLabel: "Crossover",
  chassisCode: "NE",
  aliases: [
    "Ioniq5N",
    "N Grin Boost"
  ],
  origin: "South Korea",
  usage: [
    "SUV",
    "Track"
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
      title: "2025 Hyundai Ioniq 5 N first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2025-hyundai-ioniq-5-n-first-test-review",
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
