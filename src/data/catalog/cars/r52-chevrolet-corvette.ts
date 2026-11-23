import type { CatalogEntry } from '../types';

/** Roster #52: 2020 Chevrolet Corvette Stingray Z51 (FE4) (US). */
export const entry: CatalogEntry = {
  id: "2020-chevrolet-corvette-stingray-z51-fe4-us-coupe-rwd-8dct",
  roster: 52,
  section: "American performance",
  make: "Chevrolet",
  model: "Corvette",
  trim: "Stingray Z51 (FE4)",
  modelYear: 2020,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "C8",
  aliases: [
    "C8",
    "Vette",
    "Stingray",
    "Z51"
  ],
  origin: "United States",
  usage: [
    "Sports Car",
    "Grand Tourer"
  ],
  drive: "RWD",
  transmission: "DCT",
  transmissionLabel: "8-speed DCT",
  powertrain: "Petrol",
  engineLabel: "6.2 V8 (LT2)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2020 Chevy Corvette by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a29462701/2020-chevy-corvette-by-the-numbers/",
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
