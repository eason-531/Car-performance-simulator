import type { CatalogEntry } from '../types';

/** Roster #27: 2023 BMW M3 Competition xDrive Edition 50 Jahre BMW M (US). */
export const entry: CatalogEntry = {
  id: "2023-bmw-m3-competition-xdrive-edition-50-jahre-bmw-m-us-sedan-awd-8at",
  roster: 27,
  section: "Luxury and sport sedans",
  make: "BMW",
  model: "M3",
  trim: "Competition xDrive Edition 50 Jahre BMW M",
  modelYear: 2023,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "G80",
  aliases: [
    "M3",
    "G80",
    "M xDrive",
    "50 Jahre"
  ],
  origin: "Germany",
  usage: [
    "Sport Sedan",
    "Track"
  ],
  drive: "AWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic",
  powertrain: "Petrol",
  engineLabel: "3.0 twin-turbo I6 (S58)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2023 BMW M3 Competition xDrive Edition 50 Jahre by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a43389602/2023-bmw-m3-competition-xdrive-edition-50-jahre-by-the-numbers/",
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
