import type { CatalogEntry } from '../types';

/** Roster #33: 2021 Audi RS 6 Avant RS 6 Avant (US). */
export const entry: CatalogEntry = {
  id: "2021-audi-rs-6-avant-us-wagon-awd-8at",
  roster: 33,
  section: "Wagons",
  make: "Audi",
  model: "RS 6 Avant",
  trim: "RS 6 Avant",
  modelYear: 2021,
  market: "US",
  body: "Wagon",
  bodyLabel: "Wagon (Avant)",
  chassisCode: "C8",
  aliases: [
    "RS6",
    "C8",
    "quattro"
  ],
  origin: "Germany",
  usage: [
    "Wagon",
    "Grand Tourer",
    "Luxury"
  ],
  drive: "AWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic",
  powertrain: "Petrol",
  engineLabel: "4.0 twin-turbo V8 (EA825)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2021 Audi RS6 Avant by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a34631077/2021-audi-rs6-avant-by-the-numbers/",
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
