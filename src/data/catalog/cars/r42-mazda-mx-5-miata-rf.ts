import type { CatalogEntry } from '../types';

/** Roster #42: 2024 Mazda MX-5 Miata RF Club (US). */
export const entry: CatalogEntry = {
  id: "2024-mazda-mx-5-miata-rf-club-us-conv-rwd-6mt",
  roster: 42,
  section: "Sports cars",
  make: "Mazda",
  model: "MX-5 Miata RF",
  trim: "Club",
  modelYear: 2024,
  market: "US",
  body: "Convertible",
  bodyLabel: "Retractable fastback",
  chassisCode: "ND3",
  aliases: [
    "Miata RF",
    "MX5 RF",
    "ND3",
    "Roadster RF"
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
      title: "2024 Mazda MX-5 Miata RF Club first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2024-mazda-mx-5-miata-rf-club-first-test-review",
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
