import type { CatalogEntry } from '../types';

/** Roster #71: 2024 Tesla Model 3 Performance (US). */
export const entry: CatalogEntry = {
  id: "2024-tesla-model-3-performance-us-sedan-awd-ev",
  roster: 71,
  section: "Electric cars and trucks",
  make: "Tesla",
  model: "Model 3",
  trim: "Performance",
  modelYear: 2024,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "Highland",
  aliases: [
    "Model 3",
    "Highland"
  ],
  origin: "United States",
  usage: [
    "Sport Sedan",
    "Daily"
  ],
  drive: "AWD",
  transmission: "Direct drive",
  transmissionLabel: "Single-speed",
  powertrain: "Electric",
  engineLabel: "Dual-motor",
  modelPath: "EV",
  factory: {
    power: "510 hp",
    curbMass: "4,046 lb (Car and Driver)",
    zeroTo60MphS: 2.9,
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2024 Tesla Model 3 Performance test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a62597386/2024-tesla-model-3-performance-test/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "'Highland' Tesla Model 3 Performance Is 8.7 Seconds Quicker to 150 MPH",
      publisher: "Car and Driver (syndicated on Yahoo)",
      url: "https://autos.yahoo.com/highland-tesla-model-3-performance-200000182.html",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "2024 Tesla Model 3 Performance full rating",
      publisher: "Edmunds",
      url: "https://www.edmunds.com/car-news/2024-tesla-model-3-performance-full-rating.html",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src2",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 2.8,
        quarterMileS: 11.0,
        quarterMileTrapMph: 125
      },
      conditions: {
        testMass: "4,046 lb"
      },
      match: "exact",
      verification: "Syndicated copy of the article (original page not reachable from this environment).",
      date: "2024"
    },
    {
      id: "edmunds",
      sourceId: "src3",
      publication: "Edmunds",
      timing: "standing-start",
      timingNote: "Edmunds times from a standstill (\"zero should mean zero\"), no rollout.",
      results: {
        zeroTo60MphS: 3.0,
        quarterMileS: 11.0,
        quarterMileTrapMph: 123.7
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2024"
    }
  ],
  dataGaps: [
    "Motor ratings and battery limits",
    "Drag coefficient"
  ],
  notes: [
    "Tesla’s 2.9 s claim subtracts a 1-ft rollout."
  ],
  unsupportedReason: "EV motor torque, battery output limits and axle gearing need a dedicated model; not modeled yet."
};
