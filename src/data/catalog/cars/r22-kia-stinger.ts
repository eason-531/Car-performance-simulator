import type { CatalogEntry } from '../types';

/** Roster #22: 2018 Kia Stinger GT2 3.3T AWD (US). */
export const entry: CatalogEntry = {
  id: "2018-kia-stinger-gt2-3-3t-awd-us-liftback-awd-8at",
  roster: 22,
  section: "Luxury and sport sedans",
  make: "Kia",
  model: "Stinger",
  trim: "GT2 3.3T AWD",
  modelYear: 2018,
  market: "US",
  body: "Liftback",
  bodyLabel: "Liftback",
  chassisCode: "CK",
  aliases: [
    "Stinger GT",
    "CK"
  ],
  origin: "South Korea",
  usage: [
    "Sport Sedan",
    "Grand Tourer"
  ],
  drive: "AWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic",
  powertrain: "Petrol",
  engineLabel: "3.3 twin-turbo V6 (Lambda II)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2018 Kia Stinger GT 3.3T AWD test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15078969/2018-kia-stinger-gt-33t-awd-test-review/",
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
