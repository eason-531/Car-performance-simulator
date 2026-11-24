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
      id: "src-cd-cmp",
      title: "2020 Porsche Taycan Turbo S vs. 2020 Tesla Model S Performance (comparison test)",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/comparison-test/a30799498/2020-porsche-taycan-turbo-s-vs-2020-tesla-model-s-performance/",
      kind: "road-test",
      date: "2020"
    },
    {
      id: "src2",
      title: "Porsche Taycan Turbo S review",
      publisher: "Autocar",
      url: "https://autocar.co.uk/node/99423",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src-cd-cmp",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "The original Car and Driver comparison table (2020) lists a 0.2 s one-foot rollout, subtracted from the published times (procedure in use since late 2019).",
      results: {
        zeroTo60MphS: 2.4,
        quarterMileS: 10.5,
        quarterMileTrapMph: 130,
        rolloutS: 0.2
      },
      conditions: {},
      match: "exact",
      verification: "Elapsed times unchanged; source moved to the original comparison table, whose 0.2 s rollout entry sets the timing basis, per the Codex inspection of 358661b (2026-11-24). The January 2020 acceleration story remains listed as a reference.",
      date: "2020"
    }
  ],
  dataGaps: [
    "Motor ratings and battery limits",
    "Two-speed rear gear ratios",
    "Drag coefficient"
  ],
  unsupportedReason: "EV motor torque, battery output limits and axle gearing need a dedicated model; not modeled yet."
};
