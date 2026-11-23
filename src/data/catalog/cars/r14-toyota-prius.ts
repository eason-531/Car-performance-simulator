import type { CatalogEntry } from '../types';

/** Roster #14: 2023 Toyota Prius Limited AWD (US). */
export const entry: CatalogEntry = {
  id: "2023-toyota-prius-limited-awd-us-liftback-awd-ecvt",
  roster: 14,
  section: "Daily and sport compacts",
  make: "Toyota",
  model: "Prius",
  trim: "Limited AWD",
  modelYear: 2023,
  market: "US",
  body: "Liftback",
  bodyLabel: "Liftback",
  chassisCode: "XW60",
  aliases: [
    "Prius",
    "XW60",
    "E-Four"
  ],
  origin: "Japan",
  usage: [
    "Daily"
  ],
  drive: "AWD",
  transmission: "e-CVT",
  transmissionLabel: "Power-split e-CVT",
  powertrain: "Hybrid",
  engineLabel: "2.0 I4 hybrid (M20A-FXS) + E-Four",
  modelPath: "Hybrid",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2023 Toyota Prius Limited AWD first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2023-toyota-prius-limited-awd-first-test-review",
      kind: "road-test"
    }
  ],
  benchmarks: [],
  unsupportedReason: "Hybrid deployment (engine plus motors, battery power limits) needs a dedicated model; not modeled yet.",
  dataGaps: [
    "Factory specifications not yet researched",
    "Measured benchmark not yet transcribed"
  ]
};
