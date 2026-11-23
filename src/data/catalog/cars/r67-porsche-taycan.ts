import type { CatalogEntry } from '../types';

/** Roster #67: 2020 Porsche Taycan Turbo S (US). */
export const entry: CatalogEntry = {
  id: "2020-porsche-taycan-turbo-s-us-sedan-awd-ev2",
  roster: 67,
  section: "Electric cars and trucks",
  make: "Porsche",
  model: "Taycan",
  trim: "Turbo S",
  modelYear: 2020,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "J1",
  aliases: [
    "Taycan",
    "J1"
  ],
  origin: "Germany",
  usage: [
    "Sport Sedan",
    "Luxury"
  ],
  drive: "AWD",
  transmission: "Two-speed",
  transmissionLabel: "Two-speed rear axle",
  powertrain: "Electric",
  engineLabel: "Dual-motor",
  modelPath: "EV",
  factory: {
    power: "750 hp (overboost)",
    curbMass: "2,355 kg as weighed by Autocar (60 kg over claim)",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2020 Porsche Taycan Turbo S acceleration testing",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a30688949/2020-porsche-taycan-turbo-s-testing-acceleration-zero-to-60/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Porsche Taycan Turbo S review",
      publisher: "Autocar",
      url: "https://autocar.co.uk/node/99423",
      kind: "road-test"
    }
  ],
  benchmarks: [],
  dataGaps: [
    "Car and Driver acceleration test (roster source)",
    "Motor ratings and battery limits",
    "Two-speed rear gear ratios",
    "Drag coefficient"
  ],
  unsupportedReason: "EV motor torque, battery output limits and axle gearing need a dedicated model; not modeled yet."
};
