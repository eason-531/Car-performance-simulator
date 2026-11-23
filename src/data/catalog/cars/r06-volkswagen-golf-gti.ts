import type { CatalogEntry } from '../types';

/** Roster #6: 2022 Volkswagen Golf GTI Autobahn (US). */
export const entry: CatalogEntry = {
  id: "2022-volkswagen-golf-gti-autobahn-us-hatch-fwd-7dct",
  roster: 6,
  section: "Hot hatches",
  make: "Volkswagen",
  model: "Golf GTI",
  trim: "Autobahn",
  modelYear: 2022,
  market: "US",
  body: "Hatchback",
  bodyLabel: "5-door hatchback",
  chassisCode: "Mk8",
  aliases: [
    "GTI",
    "Mk8",
    "VW"
  ],
  origin: "Germany",
  usage: [
    "Hot Hatch",
    "Sport Compact",
    "Daily"
  ],
  drive: "FWD",
  transmission: "DCT",
  transmissionLabel: "7-speed DSG",
  powertrain: "Petrol",
  engineLabel: "2.0 turbo I4 (EA888 evo4)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2022 Volkswagen GTI first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2022-volkswagen-gti-first-test-first-drive-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2023 Volkswagen GTI 0-60 mph tested",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/features/2023-volkswagen-gti-0-60-mph-tested",
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
