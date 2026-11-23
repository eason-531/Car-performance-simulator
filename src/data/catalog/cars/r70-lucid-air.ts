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
  factory: {},
  sources: [
    {
      id: "test",
      title: "Lucid Air Sapphire quickest EV tested",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/news/a46992150/lucid-air-sapphire-quickest-ev-tested/",
      kind: "road-test"
    }
  ],
  benchmarks: [],
  unsupportedReason: "EV motor torque, battery output limits and axle gearing need a dedicated model; not modeled yet.",
  dataGaps: [
    "Factory specifications not yet researched",
    "Measured benchmark not yet transcribed"
  ]
};
