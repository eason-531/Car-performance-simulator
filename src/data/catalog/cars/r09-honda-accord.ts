import type { CatalogEntry } from '../types';

/** Roster #9: 2018 Honda Accord Touring 2.0T (US). */
export const entry: CatalogEntry = {
  id: "2018-honda-accord-touring-2-0t-us-sedan-fwd-10at",
  roster: 9,
  section: "Daily and sport compacts",
  make: "Honda",
  model: "Accord",
  trim: "Touring 2.0T",
  modelYear: 2018,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "10th gen (CV)",
  aliases: [
    "Accord 2.0T",
    "CV1"
  ],
  origin: "Japan",
  usage: [
    "Daily"
  ],
  drive: "FWD",
  transmission: "AT",
  transmissionLabel: "10-speed automatic",
  powertrain: "Petrol",
  engineLabel: "2.0 turbo I4 (K20C4)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2018 Honda Accord 2.0T automatic test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15079405/2018-honda-accord-20t-automatic-test-review/",
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
