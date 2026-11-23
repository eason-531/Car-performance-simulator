import type { CatalogEntry } from '../types';

/** Roster #51: 2021 Porsche 911 Turbo S Turbo S coupe (US). */
export const entry: CatalogEntry = {
  id: "2021-porsche-911-turbo-s-turbo-s-coupe-us-coupe-awd-8dct",
  roster: 51,
  section: "Sports cars",
  make: "Porsche",
  model: "911 Turbo S",
  trim: "Turbo S coupe",
  modelYear: 2021,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "992.1",
  aliases: [
    "Turbo S",
    "992",
    "911"
  ],
  origin: "Germany",
  usage: [
    "Sports Car",
    "Grand Tourer",
    "Supercar"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "8-speed PDK",
  powertrain: "Petrol",
  engineLabel: "3.7 twin-turbo flat-6",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2021 Porsche 911 Turbo S testing",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/news/a34359564/2021-porsche-911-turbo-s-testing-zero-to-60/",
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
