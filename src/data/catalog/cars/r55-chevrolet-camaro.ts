import type { CatalogEntry } from '../types';

/** Roster #55: 2018 Chevrolet Camaro ZL1 1LE (US). */
export const entry: CatalogEntry = {
  id: "2018-chevrolet-camaro-zl1-1le-us-coupe-rwd-6mt",
  roster: 55,
  section: "American performance",
  make: "Chevrolet",
  model: "Camaro",
  trim: "ZL1 1LE",
  modelYear: 2018,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "6th gen",
  aliases: [
    "ZL1",
    "1LE",
    "Camaro"
  ],
  origin: "United States",
  usage: [
    "Muscle",
    "Track"
  ],
  drive: "RWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "6.2 supercharged V8 (LT4)",
  modelPath: "MT",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2018 Chevrolet Camaro ZL1 1LE first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/features/2018-chevrolet-camaro-zl1-1le-first-test-review",
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
