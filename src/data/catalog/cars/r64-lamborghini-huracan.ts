import type { CatalogEntry } from '../types';

/** Roster #64: 2018 Lamborghini Huracán Performante LP 640-4 (US). */
export const entry: CatalogEntry = {
  id: "2018-lamborghini-huracan-performante-lp-640-4-us-coupe-awd-7dct",
  roster: 64,
  section: "Exotics",
  make: "Lamborghini",
  model: "Huracán",
  trim: "Performante LP 640-4",
  modelYear: 2018,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "LB724",
  aliases: [
    "Huracan",
    "Performante",
    "LP640-4"
  ],
  origin: "Italy",
  usage: [
    "Supercar",
    "Track"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "7-speed DCT",
  powertrain: "Petrol",
  engineLabel: "5.2 V10",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2018 Lamborghini Huracan Performante test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a18665738/2018-lamborghini-huracan-performante-test-review/",
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
