import type { CatalogEntry } from '../types';

/** Roster #40: 2022 Subaru BRZ Limited 6AT (US). */
export const entry: CatalogEntry = {
  id: "2022-subaru-brz-limited-6at-us-coupe-rwd-6at",
  roster: 40,
  section: "Sports cars",
  make: "Subaru",
  model: "BRZ",
  trim: "Limited 6AT",
  modelYear: 2022,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "ZD8",
  aliases: [
    "BRZ",
    "ZD8"
  ],
  origin: "Japan",
  usage: [
    "Sports Car"
  ],
  drive: "RWD",
  transmission: "AT",
  transmissionLabel: "6-speed automatic",
  powertrain: "Petrol",
  engineLabel: "2.4 flat-4 (FA24D)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2022 Subaru BRZ manual and automatic first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2022-subaru-brz-manual-automatic-first-test-review",
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
