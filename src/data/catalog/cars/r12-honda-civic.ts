import type { CatalogEntry } from '../types';

/** Roster #12: 2022 Honda Civic Si (US). */
export const entry: CatalogEntry = {
  id: "2022-honda-civic-si-us-sedan-fwd-6mt",
  roster: 12,
  section: "Daily and sport compacts",
  make: "Honda",
  model: "Civic",
  trim: "Si",
  modelYear: 2022,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "FE1",
  aliases: [
    "Civic Si",
    "FE1"
  ],
  origin: "Japan",
  usage: [
    "Sport Compact",
    "Daily"
  ],
  drive: "FWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "1.5 turbo I4 (L15B7)",
  modelPath: "MT",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2022 Honda Civic Si",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/honda/civic-si-2022",
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
