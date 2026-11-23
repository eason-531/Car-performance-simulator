import type { CatalogEntry } from '../types';

/** Roster #28: 2020 BMW M340i xDrive (US). */
export const entry: CatalogEntry = {
  id: "2020-bmw-m340i-xdrive-us-sedan-awd-8at",
  roster: 28,
  section: "Luxury and sport sedans",
  make: "BMW",
  model: "M340i",
  trim: "xDrive",
  modelYear: 2020,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "G20",
  aliases: [
    "340i",
    "G20",
    "3 Series"
  ],
  origin: "Germany",
  usage: [
    "Sport Sedan",
    "Daily"
  ],
  drive: "AWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic",
  powertrain: "Petrol",
  engineLabel: "3.0 turbo I6 (B58)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2020 BMW M340i xDrive by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a32250088/2020-bmw-m340i-xdrive-by-the-numbers/",
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
