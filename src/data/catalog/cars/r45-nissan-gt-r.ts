import type { CatalogEntry } from '../types';

/** Roster #45: 2018 Nissan GT-R Track Edition (US). */
export const entry: CatalogEntry = {
  id: "2018-nissan-gt-r-track-edition-us-coupe-awd-6dct",
  roster: 45,
  section: "Sports cars",
  make: "Nissan",
  model: "GT-R",
  trim: "Track Edition",
  modelYear: 2018,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "R35",
  aliases: [
    "GTR",
    "R35",
    "Godzilla",
    "ATTESA"
  ],
  origin: "Japan",
  usage: [
    "Sports Car",
    "Grand Tourer",
    "Track"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "6-speed DCT",
  powertrain: "Petrol",
  engineLabel: "3.8 twin-turbo V6 (VR38DETT)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2018 Nissan GT-R by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a23405694/2018-nissan-gt-r-by-the-numbers/",
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
