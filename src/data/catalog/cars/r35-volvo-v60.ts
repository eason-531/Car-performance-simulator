import type { CatalogEntry } from '../types';

/** Roster #35: 2020 Volvo V60 T8 Polestar Engineered (US). */
export const entry: CatalogEntry = {
  id: "2020-volvo-v60-t8-polestar-engineered-us-wagon-awd-8at",
  roster: 35,
  section: "Wagons",
  make: "Volvo",
  model: "V60",
  trim: "T8 Polestar Engineered",
  modelYear: 2020,
  market: "US",
  body: "Wagon",
  bodyLabel: "Wagon",
  chassisCode: "SPA",
  aliases: [
    "V60 Polestar",
    "T8"
  ],
  origin: "Sweden",
  usage: [
    "Wagon",
    "Daily"
  ],
  drive: "AWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic (front) + electric rear axle",
  powertrain: "Plug-in hybrid",
  engineLabel: "2.0 turbo+supercharged I4 + rear motor",
  modelPath: "Hybrid",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2020 Volvo V60 T8 Polestar by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a30529509/2020-volvo-v60-t8-polestar-by-the-numbers/",
      kind: "road-test"
    }
  ],
  benchmarks: [],
  unsupportedReason: "Hybrid deployment (engine plus motors, battery power limits) needs a dedicated model; not modeled yet.",
  dataGaps: [
    "Factory specifications not yet researched",
    "Measured benchmark not yet transcribed"
  ]
};
