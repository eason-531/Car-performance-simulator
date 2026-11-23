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
  factory: {
    power: "603 hp",
    torque: "627 lb-ft",
    curbMass: "4,669 lb (listing)",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2018 Mercedes-AMG E63 S wagon test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a19056498/2018-mercedes-amg-e63-s-wagon-test-review/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2018 Mercedes-AMG E 63 S Wagon quick spin",
      publisher: "Autoblog",
      url: "https://www.autoblog.com/2018/06/29/2018-mercedes-amg-e-63-s-wagon-review-quick-spin/",
      kind: "reference"
    },
    {
      id: "src3",
      title: "AMG E-Class Wagon: An American Tradition",
      publisher: "Mercedes-Benz USA",
      url: "https://media.mbusa.com/releases/amg-e-class-wagon-an-american-tradition",
      kind: "manufacturer"
    }
  ],
  benchmarks: [],
  dataGaps: [
    "Car and Driver 2018 E 63 S wagon test (roster source)",
    "9-speed MCT ratios and final drive",
    "Curb mass",
    "Tire size",
    "Drag coefficient"
  ],
  notes: [
    "A Mercedes-Benz USA release quotes Car and Driver at 4.1 s to 60 mph and 12.5 s @ 114 mph, but that page may describe an earlier-generation wagon (C/D measured 3.0 s for the 2018 E 63 S sedan), so it is not transcribed."
  ],
  unsupportedReason: "AMG MCT (wet start-off clutch with a 9-speed planetary) needs its own launch and shift model; not modeled yet."
};
