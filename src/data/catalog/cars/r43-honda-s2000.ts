import type { CatalogEntry } from '../types';

/** Roster #43: 2000 Honda S2000 S2000 (US). */
export const entry: CatalogEntry = {
  id: "2000-honda-s2000-us-conv-rwd-6mt",
  roster: 43,
  section: "Sports cars",
  make: "Honda",
  model: "S2000",
  trim: "S2000",
  modelYear: 2000,
  market: "US",
  body: "Convertible",
  bodyLabel: "Soft top",
  chassisCode: "AP1",
  aliases: [
    "S2K",
    "AP1",
    "F20C"
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
  engineLabel: "2.0 I4 (F20C)",
  modelPath: "MT",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2000 Honda S2000 archived test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15142081/2000-honda-s2000-archived-test-review/",
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
