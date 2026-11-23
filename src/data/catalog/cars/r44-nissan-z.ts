import type { CatalogEntry } from '../types';

/** Roster #44: 2023 Nissan Z Performance 9AT (US). */
export const entry: CatalogEntry = {
  id: "2023-nissan-z-performance-9at-us-coupe-rwd-9at",
  roster: 44,
  section: "Sports cars",
  make: "Nissan",
  model: "Z",
  trim: "Performance 9AT",
  modelYear: 2023,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "RZ34",
  aliases: [
    "400Z",
    "Fairlady Z",
    "RZ34"
  ],
  origin: "Japan",
  usage: [
    "Sports Car",
    "Grand Tourer"
  ],
  drive: "RWD",
  transmission: "AT",
  transmissionLabel: "9-speed automatic",
  powertrain: "Petrol",
  engineLabel: "3.0 twin-turbo V6 (VR30DDTT)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2023 Nissan Z Performance first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2023-nissan-z-performance-first-test-review",
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
