import type { CatalogEntry } from '../types';

/** Roster #68: 2025 Hyundai Ioniq 5 N Ioniq 5 N (US). */
export const entry: CatalogEntry = {
  id: "2025-hyundai-ioniq-5-n-us-cuv-awd-ev",
  roster: 68,
  section: "Electric cars and trucks",
  make: "Hyundai",
  model: "Ioniq 5 N",
  trim: "Ioniq 5 N",
  modelYear: 2025,
  market: "US",
  body: "Crossover",
  bodyLabel: "Crossover",
  chassisCode: "NE",
  aliases: [
    "Ioniq5N",
    "N Grin Boost"
  ],
  origin: "South Korea",
  usage: [
    "SUV",
    "Track"
  ],
  drive: "AWD",
  transmission: "Direct drive",
  transmissionLabel: "Single-speed",
  powertrain: "Electric",
  engineLabel: "Dual-motor",
  modelPath: "EV",
  factory: {
    power: "601 hp (641 hp with N Grin Boost)",
    curbMass: "4,861 lb (Motor1 listing)",
    zeroTo60MphS: 3.25,
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2025 Hyundai Ioniq 5 N first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2025-hyundai-ioniq-5-n-first-test-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2025 Hyundai Ioniq 5 N review",
      publisher: "The Drive (citing MotorTrend)",
      url: "https://www.thedrive.com/car-reviews/2025-hyundai-ioniq-5-n-review-a-racing-sim-you-can-drive-on-the-road",
      kind: "reference"
    },
    {
      id: "src3",
      title: "2025 Hyundai Ioniq 5 N Is the Quickest Korean Car We've Ever Tested",
      publisher: "Car and Driver (syndicated on Yahoo)",
      url: "https://uk.news.yahoo.com/2025-hyundai-ioniq-5-n-180000719.html",
      kind: "road-test"
    },
    {
      id: "src4",
      title: "Is the 2025 Hyundai Ioniq 5 N an EV car enthusiasts can embrace?",
      publisher: "Cars.com",
      url: "https://www.cars.com/articles/is-the-2025-hyundai-ioniq-5-n-an-ev-car-enthusiasts-can-embrace-488233",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "mt",
      sourceId: "src2",
      publication: "MotorTrend (as cited by The Drive)",
      timing: "rollout-1ft",
      timingNote: "MotorTrend subtracts a 1-ft rollout from its acceleration times.",
      results: {
        zeroTo60MphS: 2.8,
        quarterMileS: 11.0
      },
      conditions: {
        other: [
          "N Grin Boost use not stated"
        ]
      },
      match: "exact",
      verification: "Second-hand citation; the original page was not reachable.",
      date: "2024"
    },
    {
      id: "cd",
      sourceId: "src3",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 3.0,
        quarterMileS: 11.1,
        quarterMileTrapMph: 123
      },
      conditions: {
        other: [
          "N Grin Boost use not stated"
        ]
      },
      match: "exact",
      verification: "Syndicated copy of the article (original page not reachable from this environment).",
      date: "2024"
    },
    {
      id: "carscom",
      sourceId: "src4",
      publication: "Cars.com",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 3.3,
        quarterMileS: 11.2,
        quarterMileTrapMph: 124
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2024"
    }
  ],
  dataGaps: [
    "MotorTrend trap speed and test mass",
    "Motor ratings and battery limits",
    "Drag coefficient"
  ],
  notes: [
    "N Grin Boost raises output to 641 hp for 10 s; tests rarely state whether it was used, so results are compared against the boosted rating with that caveat."
  ],
  unsupportedReason: "EV motor torque, battery output limits and axle gearing need a dedicated model; not modeled yet."
};
