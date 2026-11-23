import type { CatalogEntry } from '../types';

/** Roster #11: 2021 Mazda Mazda3 2.5 Turbo Premium Plus (US). */
export const entry: CatalogEntry = {
  id: "2021-mazda-mazda3-2-5-turbo-premium-plus-us-hatch-awd-6at",
  roster: 11,
  section: "Daily and sport compacts",
  make: "Mazda",
  model: "Mazda3",
  trim: "2.5 Turbo Premium Plus",
  modelYear: 2021,
  market: "US",
  body: "Hatchback",
  bodyLabel: "5-door hatchback",
  chassisCode: "BP",
  aliases: [
    "Mazda 3",
    "Mazda3 Turbo",
    "BP"
  ],
  origin: "Japan",
  usage: [
    "Daily",
    "Sport Compact"
  ],
  drive: "AWD",
  transmission: "AT",
  transmissionLabel: "6-speed automatic",
  powertrain: "Petrol",
  engineLabel: "2.5 turbo I4 (Skyactiv-G 2.5T)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2021 Mazda 3 2.5T by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a34734612/2021-mazda-3-25t-by-the-numbers/",
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
