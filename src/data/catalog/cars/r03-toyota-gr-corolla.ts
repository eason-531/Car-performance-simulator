import type { CatalogEntry } from '../types';

/** Roster #3: 2023 Toyota GR Corolla Circuit Edition (US). */
export const entry: CatalogEntry = {
  id: "2023-toyota-gr-corolla-circuit-edition-us-hatch-awd-6mt",
  roster: 3,
  section: "Hot hatches",
  make: "Toyota",
  model: "GR Corolla",
  trim: "Circuit Edition",
  modelYear: 2023,
  market: "US",
  body: "Hatchback",
  bodyLabel: "5-door hatchback",
  chassisCode: "GZEA14",
  aliases: [
    "GR Corolla",
    "GZEA14",
    "GR-Four"
  ],
  origin: "Japan",
  usage: [
    "Hot Hatch",
    "Sport Compact",
    "Track"
  ],
  drive: "AWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "1.6 turbo I3 (G16E-GTS)",
  modelPath: "MT",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2023 Toyota GR Corolla Circuit Edition first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/features/2023-toyota-gr-corolla-circuit-edition-first-test-review",
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
