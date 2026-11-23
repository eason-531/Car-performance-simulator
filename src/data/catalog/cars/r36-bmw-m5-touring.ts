import type { CatalogEntry } from '../types';

/** Roster #36: 2025 BMW M5 Touring M5 Touring (US). */
export const entry: CatalogEntry = {
  id: "2025-bmw-m5-touring-us-wagon-awd-8at",
  roster: 36,
  section: "Wagons",
  make: "BMW",
  model: "M5 Touring",
  trim: "M5 Touring",
  modelYear: 2025,
  market: "US",
  body: "Wagon",
  bodyLabel: "Wagon (Touring)",
  chassisCode: "G99",
  aliases: [
    "M5 Touring",
    "G99"
  ],
  origin: "Germany",
  usage: [
    "Wagon",
    "Grand Tourer",
    "Luxury"
  ],
  drive: "AWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic with integrated motor",
  powertrain: "Plug-in hybrid",
  engineLabel: "4.4 twin-turbo V8 (S68) + motor",
  modelPath: "Hybrid",
  factory: {
    power: "717 hp (system)",
    torque: "738 lb-ft (system)",
    curbMass: "5,530 lb (Motor1 listing)",
    sourceId: "src3"
  },
  sources: [
    {
      id: "test",
      title: "2025 BMW M5 Touring test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a69239467/2025-bmw-m5-touring-test/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "BMW M5 Touring",
      publisher: "FastestLaps (quoting the Car and Driver spec box)",
      url: "https://fastestlaps.com/models/bmw-m5-touring-g99",
      kind: "reference"
    },
    {
      id: "src3",
      title: "2025 BMW M5 Touring review",
      publisher: "Motor1",
      url: "https://www.motor1.com/reviews/769433/2025-bmw-m5-touring-review/",
      kind: "reference"
    },
    {
      id: "src4",
      title: "2025 BMW M5 Touring vs Audi RS 6 Avant track test",
      publisher: "Edmunds",
      url: "https://edmunds.com/car-news/2025-bmw-m5-touring-audi-rs6-avant-track-test-feature.html",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src2",
      publication: "Car and Driver (as quoted by FastestLaps)",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 3.1,
        quarterMileS: 11.0,
        quarterMileTrapMph: 129
      },
      conditions: {
        testMass: "5,481 lb"
      },
      match: "exact",
      verification: "Second-hand citation; the original page was not reachable.",
      date: "2025"
    },
    {
      id: "edmunds",
      sourceId: "src4",
      publication: "Edmunds",
      timing: "standing-start",
      timingNote: "Edmunds times from a standstill (\"zero should mean zero\"), no rollout.",
      results: {
        zeroTo60MphS: 3.4,
        quarterMileS: 11.3,
        quarterMileTrapMph: 124.7
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2025"
    }
  ],
  dataGaps: [
    "Car and Driver original page",
    "Hybrid system power split and battery limits",
    "8-speed ratios and final drive",
    "Tire size",
    "Drag coefficient"
  ],
  unsupportedReason: "Hybrid deployment (engine plus motors, battery power limits) needs a dedicated model; not modeled yet."
};
