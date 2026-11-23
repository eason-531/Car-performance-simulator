import type { CatalogEntry } from '../types';

/** Roster #66: 2021 Ferrari SF90 Stradale Assetto Fiorano (US). */
export const entry: CatalogEntry = {
  id: "2021-ferrari-sf90-stradale-assetto-fiorano-us-coupe-awd-8dct",
  roster: 66,
  section: "Exotics",
  make: "Ferrari",
  model: "SF90 Stradale",
  trim: "Assetto Fiorano",
  modelYear: 2021,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "F173",
  aliases: [
    "SF90",
    "Assetto Fiorano"
  ],
  origin: "Italy",
  usage: [
    "Supercar",
    "Track"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "8-speed DCT + three motors",
  powertrain: "Plug-in hybrid",
  engineLabel: "4.0 twin-turbo V8 + 3 motors",
  modelPath: "Hybrid",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2021 Ferrari SF90 Stradale Assetto Fiorano first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2021-ferrari-sf90-stradale-assetto-fiorano-first-test-review",
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
