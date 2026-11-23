import type { CatalogEntry } from '../types';

/** Roster #16: 2022 Subaru WRX Limited (US). */
export const entry: CatalogEntry = {
  id: "2022-subaru-wrx-limited-us-sedan-awd-6mt",
  roster: 16,
  section: "Daily and sport compacts",
  make: "Subaru",
  model: "WRX",
  trim: "Limited",
  modelYear: 2022,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "VB",
  aliases: [
    "WRX",
    "VB"
  ],
  origin: "Japan",
  usage: [
    "Sport Compact",
    "Daily"
  ],
  drive: "AWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "2.4 turbo flat-4 (FA24F)",
  modelPath: "MT",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2022 Subaru WRX Limited by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a40026459/2022-subaru-wrx-limited-by-the-numbers/",
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
