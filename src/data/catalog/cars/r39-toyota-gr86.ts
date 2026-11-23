import type { CatalogEntry } from '../types';

/** Roster #39: 2022 Toyota GR86 Premium (US). */
export const entry: CatalogEntry = {
  id: "2022-toyota-gr86-premium-us-coupe-rwd-6mt",
  roster: 39,
  section: "Sports cars",
  make: "Toyota",
  model: "GR86",
  trim: "Premium",
  modelYear: 2022,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "ZN8",
  aliases: [
    "GR86",
    "86",
    "ZN8"
  ],
  origin: "Japan",
  usage: [
    "Sports Car",
    "Track"
  ],
  drive: "RWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "2.4 flat-4 (FA24D)",
  modelPath: "MT",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2022 Toyota GR86 drive",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a37322814/2022-toyota-gr86-drive/",
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
