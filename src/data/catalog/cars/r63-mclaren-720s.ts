import type { CatalogEntry } from '../types';

/** Roster #63: 2018 McLaren 720S Coupe (US). */
export const entry: CatalogEntry = {
  id: "2018-mclaren-720s-coupe-us-coupe-rwd-7dct",
  roster: 63,
  section: "Exotics",
  make: "McLaren",
  model: "720S",
  trim: "Coupe",
  modelYear: 2018,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "P14",
  aliases: [
    "720S",
    "P14"
  ],
  origin: "United Kingdom",
  usage: [
    "Supercar",
    "Track"
  ],
  drive: "RWD",
  transmission: "DCT",
  transmissionLabel: "7-speed DCT",
  powertrain: "Petrol",
  engineLabel: "4.0 twin-turbo V8 (M840T)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2018 McLaren 720S instrumented test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a19862504/2018-mclaren-720s-instrumented-test-review/",
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
