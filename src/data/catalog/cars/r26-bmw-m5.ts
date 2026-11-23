import type { CatalogEntry } from '../types';

/** Roster #26: 2018 BMW M5 Standard (US). */
export const entry: CatalogEntry = {
  id: "2018-bmw-m5-standard-us-sedan-awd-8at",
  roster: 26,
  section: "Luxury and sport sedans",
  make: "BMW",
  model: "M5",
  trim: "Standard",
  modelYear: 2018,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "F90",
  aliases: [
    "M5",
    "F90",
    "M xDrive"
  ],
  origin: "Germany",
  usage: [
    "Sport Sedan",
    "Luxury"
  ],
  drive: "AWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic",
  powertrain: "Petrol",
  engineLabel: "4.4 twin-turbo V8 (S63)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2018 BMW M5 first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/features/2018-bmw-m5-first-test-review",
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
