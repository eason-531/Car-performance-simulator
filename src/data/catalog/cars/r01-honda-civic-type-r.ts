import type { CatalogEntry } from '../types';

/** Roster #1: 2023 Honda Civic Type R Type R (US). */
export const entry: CatalogEntry = {
  id: "2023-honda-civic-type-r-us-hatch-fwd-6mt",
  roster: 1,
  section: "Hot hatches",
  make: "Honda",
  model: "Civic Type R",
  trim: "Type R",
  modelYear: 2023,
  market: "US",
  body: "Hatchback",
  bodyLabel: "5-door hatchback",
  chassisCode: "FL5",
  aliases: [
    "CTR",
    "Type R",
    "FL5"
  ],
  origin: "Japan",
  usage: [
    "Hot Hatch",
    "Sport Compact",
    "Track"
  ],
  drive: "FWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "2.0 turbo I4 (K20C1)",
  modelPath: "MT",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2023 Honda Civic Type R by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a41952459/2023-honda-civic-type-r-by-the-numbers/",
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
