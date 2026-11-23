import type { CatalogEntry } from '../types';

/** Roster #58: 2018 Jeep Grand Cherokee Trackhawk (US). */
export const entry: CatalogEntry = {
  id: "2018-jeep-grand-cherokee-trackhawk-us-suv-awd-8at",
  roster: 58,
  section: "SUVs and pickups",
  make: "Jeep",
  model: "Grand Cherokee",
  trim: "Trackhawk",
  modelYear: 2018,
  market: "US",
  body: "SUV",
  bodyLabel: "SUV",
  chassisCode: "WK2",
  aliases: [
    "Trackhawk",
    "WK2"
  ],
  origin: "United States",
  usage: [
    "SUV",
    "Muscle"
  ],
  drive: "AWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic",
  powertrain: "Petrol",
  engineLabel: "6.2 supercharged V8 (Hellcat)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2018 Jeep Grand Cherokee Trackhawk test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15078588/2018-jeep-grand-cherokee-trackhawk-full-test-review/",
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
