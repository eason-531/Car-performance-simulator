import type { CatalogEntry } from '../types';

/** Roster #67: 2020 Porsche Taycan Turbo S (US). */
export const entry: CatalogEntry = {
  id: "2020-porsche-taycan-turbo-s-us-sedan-awd-ev2",
  roster: 67,
  section: "Electric cars and trucks",
  make: "Porsche",
  model: "Taycan",
  trim: "Turbo S",
  modelYear: 2020,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "J1",
  aliases: [
    "Taycan",
    "J1"
  ],
  origin: "Germany",
  usage: [
    "Sport Sedan",
    "Luxury"
  ],
  drive: "AWD",
  transmission: "Two-speed",
  transmissionLabel: "Two-speed rear axle",
  powertrain: "Electric",
  engineLabel: "Dual-motor",
  modelPath: "EV",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2020 Porsche Taycan Turbo S acceleration testing",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a30688949/2020-porsche-taycan-turbo-s-testing-acceleration-zero-to-60/",
      kind: "road-test"
    }
  ],
  benchmarks: [],
  unsupportedReason: "EV motor torque, battery output limits and axle gearing need a dedicated model; not modeled yet.",
  dataGaps: [
    "Factory specifications not yet researched",
    "Measured benchmark not yet transcribed"
  ]
};
