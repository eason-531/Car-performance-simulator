import type { CatalogEntry } from '../types';

/** Roster #13: 2022 Honda Civic Sport Touring 1.5T (US). */
export const entry: CatalogEntry = {
  id: "2022-honda-civic-sport-touring-1-5t-us-hatch-fwd-cvt",
  roster: 13,
  section: "Daily and sport compacts",
  make: "Honda",
  model: "Civic",
  trim: "Sport Touring 1.5T",
  modelYear: 2022,
  market: "US",
  body: "Hatchback",
  bodyLabel: "5-door hatchback",
  chassisCode: "FL1",
  aliases: [
    "Civic hatchback",
    "FL1"
  ],
  origin: "Japan",
  usage: [
    "Daily"
  ],
  drive: "FWD",
  transmission: "CVT",
  transmissionLabel: "CVT",
  powertrain: "Petrol",
  engineLabel: "1.5 turbo I4 (L15CA)",
  modelPath: "CVT",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2022 Honda Civic Sport Touring hatchback first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2022-honda-civic-sport-touring-hatchback-cvt-automatic-first-test-review",
      kind: "road-test"
    }
  ],
  benchmarks: [],
  unsupportedReason: "Needs a continuously variable transmission model (ratio control with torque converter); not modeled yet.",
  dataGaps: [
    "Factory specifications not yet researched",
    "Measured benchmark not yet transcribed"
  ]
};
