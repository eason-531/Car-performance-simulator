import type { CatalogEntry } from '../types';

/** Roster #36: 2025 BMW M5 Touring M5 Touring (US). */
export const entry: CatalogEntry = {
  id: "2025-bmw-m5-touring-us-wagon-awd-8at",
  roster: 36,
  section: "Wagons",
  make: "BMW",
  model: "M5 Touring",
  trim: "M5 Touring",
  modelYear: 2025,
  market: "US",
  body: "Wagon",
  bodyLabel: "Wagon (Touring)",
  chassisCode: "G99",
  aliases: [
    "M5 Touring",
    "G99"
  ],
  origin: "Germany",
  usage: [
    "Wagon",
    "Grand Tourer",
    "Luxury"
  ],
  drive: "AWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic with integrated motor",
  powertrain: "Plug-in hybrid",
  engineLabel: "4.4 twin-turbo V8 (S68) + motor",
  modelPath: "Hybrid",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2025 BMW M5 Touring test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a69239467/2025-bmw-m5-touring-test/",
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
