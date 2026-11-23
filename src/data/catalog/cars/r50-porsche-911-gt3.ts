import type { CatalogEntry } from '../types';

/** Roster #50: 2022 Porsche 911 GT3 GT3 PDK (US). */
export const entry: CatalogEntry = {
  id: "2022-porsche-911-gt3-gt3-pdk-us-coupe-rwd-7dct",
  roster: 50,
  section: "Sports cars",
  make: "Porsche",
  model: "911 GT3",
  trim: "GT3 PDK",
  modelYear: 2022,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "992.1",
  aliases: [
    "GT3",
    "992",
    "911"
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
  engineLabel: "4.0 flat-6 (MA1.76 GT)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2022 Porsche 911 GT3 drive",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a36164987/2022-porsche-911-gt3-drive/",
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
