import type { CatalogEntry } from '../types';

/** Roster #13: 2022 Honda Civic Sport Touring 1.5T (US). */
export const entry: CatalogEntry = {
  id: "2022-honda-civic-sport-touring-1-5t-us-hatch-fwd-cvt",
  roster: 13,
  section: "Daily and sport compacts",
  make: "Honda",
  model: "Civic",
  trim: "Sport Touring 1.5T",
  modelYear: 2022,
  market: "US",
  body: "Hatchback",
  bodyLabel: "5-door hatchback",
  chassisCode: "FL1",
  aliases: [
    "Civic hatchback",
    "FL1"
  ],
  origin: "Japan",
  usage: [
    "Daily"
  ],
  drive: "FWD",
  transmission: "CVT",
  transmissionLabel: "CVT",
  powertrain: "Petrol",
  engineLabel: "1.5 turbo I4 (L15CA)",
  modelPath: "CVT",
  factory: {
    power: "180 hp @ 6,000 rpm",
    curbMass: "3,102 lb (Honda)",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2022 Honda Civic Sport Touring hatchback first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2022-honda-civic-sport-touring-hatchback-cvt-automatic-first-test-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Tested: 2022 Honda Civic hatchback loses speed but wins our hearts",
      publisher: "Edmunds",
      url: "https://www.edmunds.com/car-news/tested-2022-honda-civic-hatchback-loses-speed-but-wins-our-hearts.html",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "edmunds",
      sourceId: "src2",
      publication: "Edmunds",
      timing: "standing-start",
      timingNote: "Edmunds times from a standstill (\"zero should mean zero\"), no rollout.",
      results: {
        zeroTo60MphS: 7.9
      },
      conditions: {
        temperatureC: 19
      },
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2021"
    }
  ],
  dataGaps: [
    "MotorTrend first test (roster source)",
    "Torque figure",
    "Tire size",
    "Drag coefficient"
  ],
  unsupportedReason: "Needs a continuously variable transmission model (ratio control with torque converter); not modeled yet.",
  notes: [
    "Honda US specifications: CVT ratio range 2.645–0.405, final drive 4.81, weight distribution 60.2/39.8."
  ]
};
