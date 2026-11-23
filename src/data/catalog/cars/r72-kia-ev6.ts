import type { CatalogEntry } from '../types';

/** Roster #72: 2023 Kia EV6 GT (US). */
export const entry: CatalogEntry = {
  id: "2023-kia-ev6-gt-us-cuv-awd-ev",
  roster: 72,
  section: "Electric cars and trucks",
  make: "Kia",
  model: "EV6",
  trim: "GT",
  modelYear: 2023,
  market: "US",
  body: "Crossover",
  bodyLabel: "Crossover",
  chassisCode: "CV",
  aliases: [
    "EV6 GT",
    "CV"
  ],
  origin: "South Korea",
  usage: [
    "SUV",
    "Sport Compact"
  ],
  drive: "AWD",
  transmission: "Direct drive",
  transmissionLabel: "Single-speed",
  powertrain: "Electric",
  engineLabel: "Dual-motor",
  modelPath: "EV",
  factory: {
    power: "576 hp",
    torque: "545 lb-ft",
    zeroTo60MphS: 3.4,
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2023 Kia EV6 GT by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a42097092/2023-kia-ev6-gt-by-the-numbers/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2023 Kia EV6 GT review",
      publisher: "Gear Patrol (citing Car and Driver)",
      url: "https://gearpatrol.com/cars/g42261748/2023-kia-ev6-gt-review/",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src2",
      publication: "Car and Driver (as cited by Gear Patrol)",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 3.2
      },
      conditions: {},
      match: "exact",
      verification: "Second-hand citation; the original page was not reachable.",
      date: "2023"
    }
  ],
  dataGaps: [
    "Car and Driver quarter-mile and trap speed (roster source)",
    "Curb mass",
    "Motor ratings and battery limits",
    "Drag coefficient"
  ],
  notes: [
    "Drag-strip runs by other outlets (11.2–11.5 s) used prepared surfaces and are not transcribed; Kia claims 3.4 s to 60 mph."
  ],
  unsupportedReason: "EV motor torque, battery output limits and axle gearing need a dedicated model; not modeled yet."
};
