import type { CatalogEntry } from '../types';

/** Roster #35: 2020 Volvo V60 T8 Polestar Engineered (US). */
export const entry: CatalogEntry = {
  id: "2020-volvo-v60-t8-polestar-engineered-us-wagon-awd-8at",
  roster: 35,
  section: "Wagons",
  make: "Volvo",
  model: "V60",
  trim: "T8 Polestar Engineered",
  modelYear: 2020,
  market: "US",
  body: "Wagon",
  bodyLabel: "Wagon",
  chassisCode: "SPA",
  aliases: [
    "V60 Polestar",
    "T8"
  ],
  origin: "Sweden",
  usage: [
    "Wagon",
    "Daily"
  ],
  drive: "AWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic (front) + electric rear axle",
  powertrain: "Plug-in hybrid",
  engineLabel: "2.0 turbo+supercharged I4 + rear motor",
  modelPath: "Hybrid",
  factory: {
    power: "415 hp (combined)",
    torque: "494 lb-ft (combined)",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2020 Volvo V60 T8 Polestar by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a30529509/2020-volvo-v60-t8-polestar-by-the-numbers/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Volvo V60 0–60 times",
      publisher: "0-60specs",
      url: "https://www.0-60specs.com/volvo/v60-0-60-times",
      kind: "reference"
    },
    {
      id: "src3",
      title: "2020 Volvo V60 T8 Polestar Engineered first drive",
      publisher: "Autoblog (via Yahoo)",
      url: "https://www.yahoo.com/entertainment/2020-volvo-v60-t8-polestar-135500248.html",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "agg",
      sourceId: "src2",
      publication: "Instrumented test listed by 0-60specs (publication unclear)",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 4.4,
        quarterMileS: 12.9,
        quarterMileTrapMph: 107.0
      },
      conditions: {},
      match: "exact",
      verification: "Aggregator listing whose source label is ambiguous for this run.",
      date: "2020"
    }
  ],
  dataGaps: [
    "Car and Driver test (roster source)",
    "Curb mass",
    "Electric rear-axle output and gearing",
    "Tire size",
    "Drag coefficient"
  ],
  notes: [
    "Autoblog lists 4.9 s to 60 mph, apparently a manufacturer figure."
  ],
  unsupportedReason: "Hybrid deployment (engine plus motors, battery power limits) needs a dedicated model; not modeled yet."
};
