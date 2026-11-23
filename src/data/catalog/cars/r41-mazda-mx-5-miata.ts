import type { CatalogEntry } from '../types';

/** Roster #41: 2016 Mazda MX-5 Miata Club (US). */
export const entry: CatalogEntry = {
  id: "2016-mazda-mx-5-miata-club-us-conv-rwd-6mt",
  roster: 41,
  section: "Sports cars",
  make: "Mazda",
  model: "MX-5 Miata",
  trim: "Club",
  modelYear: 2016,
  market: "US",
  body: "Convertible",
  bodyLabel: "Soft top",
  chassisCode: "ND1",
  aliases: [
    "Miata",
    "MX5",
    "ND",
    "Roadster"
  ],
  origin: "Japan",
  usage: [
    "Sports Car"
  ],
  drive: "RWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "2.0 I4 (Skyactiv-G PE-VPS)",
  modelPath: "MT",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2016 Mazda MX-5 Miata Club test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15105840/2016-mazda-mx-5-miata-club-test-review/",
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
