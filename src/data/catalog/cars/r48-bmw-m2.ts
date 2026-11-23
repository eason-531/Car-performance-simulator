import type { CatalogEntry } from '../types';

/** Roster #48: 2023 BMW M2 Carbon Package 6MT (US). */
export const entry: CatalogEntry = {
  id: "2023-bmw-m2-carbon-package-6mt-us-coupe-rwd-6mt",
  roster: 48,
  section: "Sports cars",
  make: "BMW",
  model: "M2",
  trim: "Carbon Package 6MT",
  modelYear: 2023,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "G87",
  aliases: [
    "M2",
    "G87"
  ],
  origin: "Germany",
  usage: [
    "Sports Car",
    "Track"
  ],
  drive: "RWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "3.0 twin-turbo I6 (S58)",
  modelPath: "MT",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2023 BMW M2 drive",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a43452901/2023-bmw-m2-drive/",
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
