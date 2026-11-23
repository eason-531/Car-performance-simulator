import type { CatalogEntry } from '../types';

/** Roster #29: 2022 Audi RS 3 RS 3 (US). */
export const entry: CatalogEntry = {
  id: "2022-audi-rs-3-us-sedan-awd-7dct",
  roster: 29,
  section: "Luxury and sport sedans",
  make: "Audi",
  model: "RS 3",
  trim: "RS 3",
  modelYear: 2022,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "8Y",
  aliases: [
    "RS3",
    "8Y",
    "quattro"
  ],
  origin: "Germany",
  usage: [
    "Sport Compact",
    "Sport Sedan"
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
      title: "2022 Audi RS3 sedan US drive",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a40157829/2022-audi-rs3-sedan-us-drive/",
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
