import type { CatalogEntry } from '../types';

/** Roster #73: 2022 Rivian R1T Launch Edition (US). */
export const entry: CatalogEntry = {
  id: "2022-rivian-r1t-launch-edition-us-pickup-awd-ev",
  roster: 73,
  section: "Electric cars and trucks",
  make: "Rivian",
  model: "R1T",
  trim: "Launch Edition",
  modelYear: 2022,
  market: "US",
  body: "Pickup",
  bodyLabel: "Crew-cab pickup",
  chassisCode: "R1T",
  aliases: [
    "R1T",
    "Rivian"
  ],
  origin: "United States",
  usage: [
    "Pickup",
    "Off-road"
  ],
  drive: "AWD",
  transmission: "Direct drive",
  transmissionLabel: "Single-speed",
  powertrain: "Electric",
  engineLabel: "Quad-motor, Large Pack",
  modelPath: "EV",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2022 Rivian R1T 60-mph acceleration",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/news/a38943455/2022-rivian-r1t-60-mph-acceleration/",
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
