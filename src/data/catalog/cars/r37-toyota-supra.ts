import type { CatalogEntry } from '../types';

/** Roster #37: 1993 Toyota Supra Turbo (US). */
export const entry: CatalogEntry = {
  id: "1993-toyota-supra-turbo-us-coupe-rwd-6mt",
  roster: 37,
  section: "Sports cars",
  make: "Toyota",
  model: "Supra",
  trim: "Turbo",
  modelYear: 1993,
  market: "US",
  body: "Coupe",
  bodyLabel: "Liftback coupe",
  chassisCode: "A80",
  aliases: [
    "Supra Mk4",
    "A80",
    "JZA80",
    "2JZ"
  ],
  origin: "Japan",
  usage: [
    "Sports Car",
    "Grand Tourer"
  ],
  drive: "RWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "3.0 twin-turbo I6 (2JZ-GTE)",
  modelPath: "MT",
  factory: {},
  sources: [
    {
      id: "test",
      title: "Toyota Supra Turbo instrumented test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15142755/toyota-supra-turbo-instrumented-test/",
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
