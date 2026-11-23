import type { CatalogEntry } from '../types';

/** Roster #23: 2022 Genesis G70 3.3T AWD (US). */
export const entry: CatalogEntry = {
  id: "2022-genesis-g70-3-3t-awd-us-sedan-awd-8at",
  roster: 23,
  section: "Luxury and sport sedans",
  make: "Genesis",
  model: "G70",
  trim: "3.3T AWD",
  modelYear: 2022,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "IK facelift",
  aliases: [
    "G70",
    "IK"
  ],
  origin: "South Korea",
  usage: [
    "Sport Sedan",
    "Luxury"
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
      title: "2022 Genesis G70 3.3T AWD first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2022-genesis-g70-33t-awd-first-test-review",
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
