import type { CatalogEntry } from '../types';

/** Roster #2: 2024 Acura Integra Type S (US). */
export const entry: CatalogEntry = {
  id: "2024-acura-integra-type-s-us-liftback-fwd-6mt",
  roster: 2,
  section: "Hot hatches",
  make: "Acura",
  model: "Integra",
  trim: "Type S",
  modelYear: 2024,
  market: "US",
  body: "Liftback",
  bodyLabel: "5-door liftback",
  chassisCode: "DE5",
  aliases: [
    "Integra Type S",
    "DE5"
  ],
  origin: "Japan",
  usage: [
    "Hot Hatch",
    "Sport Compact"
  ],
  drive: "FWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "2.0 turbo I4 (K20C1)",
  modelPath: "MT",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2024 Acura Integra Type S drive",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a44212736/2024-acura-integra-type-s-drive/",
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
