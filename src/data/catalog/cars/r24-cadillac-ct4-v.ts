import type { CatalogEntry } from '../types';

/** Roster #24: 2022 Cadillac CT4-V Blackwing (US). */
export const entry: CatalogEntry = {
  id: "2022-cadillac-ct4-v-blackwing-us-sedan-rwd-6mt",
  roster: 24,
  section: "Luxury and sport sedans",
  make: "Cadillac",
  model: "CT4-V",
  trim: "Blackwing",
  modelYear: 2022,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "A2LL",
  aliases: [
    "CT4 Blackwing",
    "CT4-V"
  ],
  origin: "United States",
  usage: [
    "Sport Sedan",
    "Track"
  ],
  drive: "RWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "3.6 twin-turbo V6 (LF4)",
  modelPath: "MT",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2022 Cadillac CT4-V Blackwing manual first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/features/2022-cadillac-ct4-v-blackwing-manual-first-test-review",
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
