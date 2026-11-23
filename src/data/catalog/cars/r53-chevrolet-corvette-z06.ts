import type { CatalogEntry } from '../types';

/** Roster #53: 2023 Chevrolet Corvette Z06 Z07 + Carbon Fiber Aero (US). */
export const entry: CatalogEntry = {
  id: "2023-chevrolet-corvette-z06-z07-carbon-fiber-aero-us-coupe-rwd-8dct",
  roster: 53,
  section: "American performance",
  make: "Chevrolet",
  model: "Corvette Z06",
  trim: "Z07 + Carbon Fiber Aero",
  modelYear: 2023,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "C8",
  aliases: [
    "Z06",
    "Z07",
    "C8",
    "Vette"
  ],
  origin: "United States",
  usage: [
    "Sports Car",
    "Track",
    "Supercar"
  ],
  drive: "RWD",
  transmission: "DCT",
  transmissionLabel: "8-speed DCT",
  powertrain: "Petrol",
  engineLabel: "5.5 flat-plane V8 (LT6)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2023 Chevrolet Corvette Z06 Z07 tested",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2023-chevrolet-corvette-z06-coupe-z07-package-0-60-mph-time-quarter-mile",
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
