import type { CatalogEntry } from '../types';

/** Roster #18: 2015 Mitsubishi Lancer Evolution Final Edition (US). */
export const entry: CatalogEntry = {
  id: "2015-mitsubishi-lancer-evolution-final-edition-us-sedan-awd-5mt",
  roster: 18,
  section: "Daily and sport compacts",
  make: "Mitsubishi",
  model: "Lancer Evolution",
  trim: "Final Edition",
  modelYear: 2015,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "CZ4A",
  aliases: [
    "Evo",
    "Evo X",
    "CZ4A",
    "S-AWC"
  ],
  origin: "Japan",
  usage: [
    "Sport Compact",
    "Track"
  ],
  drive: "AWD",
  transmission: "MT",
  transmissionLabel: "5-speed manual",
  powertrain: "Petrol",
  engineLabel: "2.0 turbo I4 (4B11T)",
  modelPath: "MT",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2015 Mitsubishi Lancer Evolution Final Edition test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15102392/2015-mitsubishi-lancer-evolution-final-edition-test-review/",
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
