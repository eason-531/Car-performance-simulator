import type { CatalogEntry } from '../types';

/** Roster #70: 2024 Lucid Air Sapphire (US). */
export const entry: CatalogEntry = {
  id: "2024-lucid-air-sapphire-us-sedan-awd-ev",
  roster: 70,
  section: "Electric cars and trucks",
  make: "Lucid",
  model: "Air",
  trim: "Sapphire",
  modelYear: 2024,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "Air",
  aliases: [
    "Air Sapphire",
    "Lucid"
  ],
  origin: "United States",
  usage: [
    "Sport Sedan",
    "Luxury",
    "Supercar"
  ],
  drive: "AWD",
  transmission: "Direct drive",
  transmissionLabel: "Single-speed",
  powertrain: "Electric",
  engineLabel: "Tri-motor",
  modelPath: "EV",
  factory: {
    power: "1,234 hp",
    curbMass: "5,356 lb (Edmunds)",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "Lucid Air Sapphire quickest EV tested",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/news/a46992150/lucid-air-sapphire-quickest-ev-tested/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Lucid Air Sapphire vs Tesla Model S Plaid",
      publisher: "Edmunds",
      url: "https://www.edmunds.com/car-news/lucid-air-sapphire-vs-tesla-model-s-plaid.html",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "Lucid Air Sapphire is the quickest car MotorTrend has ever tested",
      publisher: "Jalopnik (citing MotorTrend)",
      url: "https://jalopnik.com/1984093/lucid-air-sapphite-quickest-car-motortrend/",
      kind: "reference"
    },
    {
      id: "src4",
      title: "Final production specs: Sapphire",
      publisher: "Lucid Motors",
      url: "https://www.lucidmotors.com/stories/final-production-specs-sapphire",
      kind: "manufacturer"
    }
  ],
  benchmarks: [
    {
      id: "mt",
      sourceId: "src3",
      publication: "MotorTrend (as cited by Jalopnik)",
      timing: "rollout-1ft",
      timingNote: "MotorTrend subtracts a 1-ft rollout from its acceleration times.",
      results: {
        zeroTo60MphS: 2.1,
        zeroTo100MphS: 4.2,
        quarterMileS: 9.3,
        quarterMileTrapMph: 153
      },
      conditions: {
        testMass: "5,342 lb"
      },
      match: "exact",
      verification: "Second-hand citation; the original page was not reachable.",
      date: "2024"
    },
    {
      id: "edmunds",
      sourceId: "src2",
      publication: "Edmunds",
      timing: "standing-start",
      timingNote: "Edmunds times from a standstill (\"zero should mean zero\"), no rollout.",
      results: {
        zeroTo60MphS: 2.2,
        quarterMileS: 9.2,
        quarterMileTrapMph: 149.6
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2024"
    }
  ],
  dataGaps: [
    "Car and Driver test (roster source)",
    "Motor ratings and battery limits",
    "Drag coefficient"
  ],
  notes: [
    "Lucid claims 1.89 s to 60 mph, 3.84 s to 100 mph and an 8.95 s quarter mile. A later MotorTrend run on the optional track tires (1.88 s, 9.0 s @ 154.8 mph) is a different tire fitment and is not used."
  ],
  unsupportedReason: "EV motor torque, battery output limits and axle gearing need a dedicated model; not modeled yet."
};
