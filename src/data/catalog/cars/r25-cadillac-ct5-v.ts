import type { CatalogEntry } from '../types';

/** Roster #25: 2022 Cadillac CT5-V Blackwing 10AT (US). */
export const entry: CatalogEntry = {
  id: "2022-cadillac-ct5-v-blackwing-10at-us-sedan-rwd-10at",
  roster: 25,
  section: "Luxury and sport sedans",
  make: "Cadillac",
  model: "CT5-V",
  trim: "Blackwing 10AT",
  modelYear: 2022,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "A2LL",
  aliases: [
    "CT5 Blackwing",
    "CT5-V"
  ],
  origin: "United States",
  usage: [
    "Sport Sedan",
    "Muscle",
    "Track"
  ],
  drive: "RWD",
  transmission: "AT",
  transmissionLabel: "10-speed automatic",
  powertrain: "Petrol",
  engineLabel: "6.2 supercharged V8 (LT4)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2022 Cadillac CT5-V Blackwing manual vs automatic test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/features/2022-cadillac-ct5v-blackwing-test-0-60-quarter-mile-manual-vs-automatic-review",
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
