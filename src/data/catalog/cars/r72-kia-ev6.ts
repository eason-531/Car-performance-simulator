import type { CatalogEntry } from '../types';

/** Roster #72: 2023 Kia EV6 GT (US). */
export const entry: CatalogEntry = {
  id: "2023-kia-ev6-gt-us-cuv-awd-ev",
  roster: 72,
  section: "Electric cars and trucks",
  make: "Kia",
  model: "EV6",
  trim: "GT",
  modelYear: 2023,
  market: "US",
  body: "Crossover",
  bodyLabel: "Crossover",
  chassisCode: "CV",
  aliases: [
    "EV6 GT",
    "CV"
  ],
  origin: "South Korea",
  usage: [
    "SUV",
    "Sport Compact"
  ],
  drive: "AWD",
  transmission: "Direct drive",
  transmissionLabel: "Single-speed",
  powertrain: "Electric",
  engineLabel: "Dual-motor",
  modelPath: "EV",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2023 Kia EV6 GT by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a42097092/2023-kia-ev6-gt-by-the-numbers/",
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
