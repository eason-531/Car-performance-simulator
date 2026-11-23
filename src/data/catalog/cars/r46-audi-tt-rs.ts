import type { CatalogEntry } from '../types';

/** Roster #46: 2018 Audi TT RS Coupe (US). */
export const entry: CatalogEntry = {
  id: "2018-audi-tt-rs-coupe-us-coupe-awd-7dct",
  roster: 46,
  section: "Sports cars",
  make: "Audi",
  model: "TT RS",
  trim: "Coupe",
  modelYear: 2018,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "8S",
  aliases: [
    "TTRS",
    "8S",
    "quattro"
  ],
  origin: "Germany",
  usage: [
    "Sports Car"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "7-speed S tronic",
  powertrain: "Petrol",
  engineLabel: "2.5 turbo I5 (EA855 evo)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2018 Audi TT RS test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a14516384/2018-audi-tt-rs-test-review/",
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
