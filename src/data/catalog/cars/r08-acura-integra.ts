import type { CatalogEntry } from '../types';

/** Roster #8: 1997 Acura Integra Type R (US). */
export const entry: CatalogEntry = {
  id: "1997-acura-integra-type-r-us-liftback-fwd-5mt",
  roster: 8,
  section: "Hot hatches",
  make: "Acura",
  model: "Integra",
  trim: "Type R",
  modelYear: 1997,
  market: "US",
  body: "Liftback",
  bodyLabel: "3-door liftback",
  chassisCode: "DC2",
  aliases: [
    "ITR",
    "Integra Type R",
    "DC2"
  ],
  origin: "Japan",
  usage: [
    "Hot Hatch",
    "Sport Compact",
    "Track"
  ],
  drive: "FWD",
  transmission: "MT",
  transmissionLabel: "5-speed manual",
  powertrain: "Petrol",
  engineLabel: "1.8 I4 (B18C5)",
  modelPath: "MT",
  factory: {},
  sources: [
    {
      id: "test",
      title: "1997 Acura Integra Type R archived test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15141504/1997-acura-integra-type-r-archived-test-review/",
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
