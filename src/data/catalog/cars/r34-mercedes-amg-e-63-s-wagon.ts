import type { CatalogEntry } from '../types';

/** Roster #34: 2018 Mercedes-AMG E 63 S Wagon 4MATIC+ (US). */
export const entry: CatalogEntry = {
  id: "2018-mercedes-amg-e-63-s-wagon-4matic-us-wagon-awd-9mct",
  roster: 34,
  section: "Wagons",
  make: "Mercedes-AMG",
  model: "E 63 S Wagon",
  trim: "4MATIC+",
  modelYear: 2018,
  market: "US",
  body: "Wagon",
  bodyLabel: "Wagon",
  chassisCode: "S213",
  aliases: [
    "E63",
    "AMG",
    "S213",
    "Mercedes"
  ],
  origin: "Germany",
  usage: [
    "Wagon",
    "Grand Tourer"
  ],
  drive: "AWD",
  transmission: "MCT",
  transmissionLabel: "9-speed AMG MCT (wet start-off clutch)",
  powertrain: "Petrol",
  engineLabel: "4.0 twin-turbo V8 (M177)",
  modelPath: "MCT",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2018 Mercedes-AMG E63 S wagon test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a19056498/2018-mercedes-amg-e63-s-wagon-test-review/",
      kind: "road-test"
    }
  ],
  benchmarks: [],
  unsupportedReason: "AMG MCT (wet start-off clutch with a 9-speed planetary) needs its own launch and shift model; not modeled yet.",
  dataGaps: [
    "Factory specifications not yet researched",
    "Measured benchmark not yet transcribed"
  ]
};
