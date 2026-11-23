import type { CatalogEntry } from '../types';

/** Roster #65: 2017 Acura NSX NSX (US). */
export const entry: CatalogEntry = {
  id: "2017-acura-nsx-us-coupe-awd-9dct",
  roster: 65,
  section: "Exotics",
  make: "Acura",
  model: "NSX",
  trim: "NSX",
  modelYear: 2017,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "NC1",
  aliases: [
    "NSX",
    "NC1"
  ],
  origin: "Japan",
  usage: [
    "Supercar"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "9-speed DCT + three motors",
  powertrain: "Hybrid",
  engineLabel: "3.5 twin-turbo V6 + 3 motors (Sport Hybrid SH-AWD)",
  modelPath: "Hybrid",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2017 Acura NSX test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15098793/2017-acura-nsx-supercar-full-test-review/",
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
