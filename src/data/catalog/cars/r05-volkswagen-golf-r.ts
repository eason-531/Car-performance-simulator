import type { CatalogEntry } from '../types';

/** Roster #5: 2022 Volkswagen Golf R Golf R (US). */
export const entry: CatalogEntry = {
  id: "2022-volkswagen-golf-r-us-hatch-awd-7dct",
  roster: 5,
  section: "Hot hatches",
  make: "Volkswagen",
  model: "Golf R",
  trim: "Golf R",
  modelYear: 2022,
  market: "US",
  body: "Hatchback",
  bodyLabel: "5-door hatchback",
  chassisCode: "Mk8",
  aliases: [
    "Golf R",
    "Mk8",
    "VW",
    "4Motion"
  ],
  origin: "Germany",
  usage: [
    "Hot Hatch",
    "Sport Compact",
    "Daily"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "7-speed DSG",
  powertrain: "Petrol",
  engineLabel: "2.0 turbo I4 (EA888 evo4)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2022 Volkswagen Golf R",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/volkswagen/golf-r-2022",
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
