import type { CatalogEntry } from '../types';

/** Roster #69: 2021 Tesla Model S Plaid (US). */
export const entry: CatalogEntry = {
  id: "2021-tesla-model-s-plaid-us-liftback-awd-ev",
  roster: 69,
  section: "Electric cars and trucks",
  make: "Tesla",
  model: "Model S",
  trim: "Plaid",
  modelYear: 2021,
  market: "US",
  body: "Liftback",
  bodyLabel: "Liftback",
  chassisCode: "Refresh",
  aliases: [
    "Plaid",
    "Model S"
  ],
  origin: "United States",
  usage: [
    "Sport Sedan",
    "Luxury"
  ],
  drive: "AWD",
  transmission: "Direct drive",
  transmissionLabel: "Single-speed",
  powertrain: "Electric",
  engineLabel: "Tri-motor",
  modelPath: "EV",
  factory: {
    power: "1,020 hp",
    torque: "1,050 lb-ft",
    curbMass: "4,766 lb (Tesla, 19-inch wheels)",
    sourceId: "src3"
  },
  sources: [
    {
      id: "test",
      title: "2021 Tesla Model S Plaid performance test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/news/a38439509/2021-tesla-model-s-plaid-performance-test-comparison/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Tested: 2021 Tesla Model S Plaid Is Absurdly Quick but Also Has a Few Key Flaws",
      publisher: "Car and Driver (syndicated on Yahoo)",
      url: "https://autos.yahoo.com/tested-2021-tesla-model-plaid-140000565.html",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "2021 Tesla Model S Plaid track tested",
      publisher: "Edmunds",
      url: "https://www.edmunds.com/car-news/2021-tesla-model-s-plaid-track-tested.html",
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
        zeroTo100MphS: 4.3,
        quarterMileS: 9.4
      },
      conditions: {
        surface: "Non-prepped asphalt (Car and Driver method)"
      },
      match: "exact",
      verification: "Syndicated copy of the article (original page not reachable from this environment). The 0–60 time was not in the reachable text.",
      date: "2021"
    },
    {
      id: "edmunds",
      sourceId: "src3",
      publication: "Edmunds",
      timing: "standing-start",
      timingNote: "Edmunds times from a standstill (\"zero should mean zero\"), no rollout.",
      results: {
        zeroTo60MphS: 2.3,
        quarterMileS: 9.4,
        quarterMileTrapMph: 150.8
      },
      conditions: {
        testMass: "4,842 lb",
        surface: "Unprepped"
      },
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2021"
    }
  ],
  dataGaps: [
    "Car and Driver 0–60 and trap speed",
    "Motor ratings and battery limits",
    "Drag coefficient (published but not verified here)"
  ],
  notes: [
    "Tesla’s sub-2-second claim subtracts a 1-ft rollout and was set on a prepared drag strip; magazine tests on ordinary pavement are slower. The two must not be compared directly."
  ],
  unsupportedReason: "EV motor torque, battery output limits and axle gearing need a dedicated model; not modeled yet."
};
