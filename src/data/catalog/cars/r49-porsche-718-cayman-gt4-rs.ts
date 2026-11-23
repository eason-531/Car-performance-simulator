import type { CatalogEntry } from '../types';

/** Roster #49: 2022 Porsche 718 Cayman GT4 RS GT4 RS (US). */
export const entry: CatalogEntry = {
  id: "2022-porsche-718-cayman-gt4-rs-us-coupe-rwd-7dct",
  roster: 49,
  section: "Sports cars",
  make: "Porsche",
  model: "718 Cayman GT4 RS",
  trim: "GT4 RS",
  modelYear: 2022,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "982",
  aliases: [
    "GT4RS",
    "Cayman",
    "982"
  ],
  origin: "Germany",
  usage: [
    "Sports Car",
    "Track"
  ],
  drive: "RWD",
  transmission: "DCT",
  transmissionLabel: "7-speed PDK",
  powertrain: "Petrol",
  engineLabel: "4.0 flat-6 (MA1.75 GT)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2022 Porsche 718 Cayman GT4 RS tested",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/news/a39725088/2022-porsche-718-cayman-gt4-rs-tested/",
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
