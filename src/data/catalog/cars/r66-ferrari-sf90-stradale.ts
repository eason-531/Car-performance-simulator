import type { CatalogEntry } from '../types';

/** Roster #66: 2021 Ferrari SF90 Stradale Assetto Fiorano (US). */
export const entry: CatalogEntry = {
  id: "2021-ferrari-sf90-stradale-assetto-fiorano-us-coupe-awd-8dct",
  roster: 66,
  section: "Exotics",
  make: "Ferrari",
  model: "SF90 Stradale",
  trim: "Assetto Fiorano",
  modelYear: 2021,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "F173",
  aliases: [
    "SF90",
    "Assetto Fiorano"
  ],
  origin: "Italy",
  usage: [
    "Supercar",
    "Track"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "8-speed DCT + three motors",
  powertrain: "Plug-in hybrid",
  engineLabel: "4.0 twin-turbo V8 + 3 motors",
  modelPath: "Hybrid",
  factory: {
    power: "986 hp (1,000 CV, system)",
    curbMass: "≈1,570 kg (CarSales)",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2021 Ferrari SF90 Stradale Assetto Fiorano first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2021-ferrari-sf90-stradale-assetto-fiorano-first-test-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Ferrari SF90 Assetto Fiorano 2021 review",
      publisher: "CarSales (AU)",
      url: "https://www.carsales.com.au/editorial/details/ferrari-sf90-assetto-fiorano-2021-review-130922",
      kind: "reference"
    },
    {
      id: "src-cd",
      title: "Ferrari SF90 Stradale hits 60 mph in 2.0 s",
      publisher: "Carscoops (citing Car and Driver)",
      url: "https://www.carscoops.com/2021/07/ferrari-sf90-stradale-hits-60-mph-in-2-0-sec-becomes-c-ds-quickest-production-car-ever-tested/",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src-cd",
      publication: "Car and Driver (as cited by Carscoops)",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 2.0,
        quarterMileS: 9.5,
        quarterMileTrapMph: 148
      },
      conditions: {},
      match: "equivalent",
      verification: "Second-hand citation; original page not reachable.",
      date: "2021",
      deviation: "Assetto Fiorano package not confirmed for this test car."
    },
    {
      id: "mt",
      sourceId: "test",
      publication: "MotorTrend",
      timing: "rollout-1ft",
      timingNote: "MotorTrend subtracts a 1-ft rollout from its acceleration times.",
      results: {
        zeroTo60MphS: 2.1,
        quarterMileS: 9.6,
        quarterMileTrapMph: 145.2
      },
      conditions: {
        testMass: "3,839 lb as tested",
        other: [
          "Assetto Fiorano package"
        ]
      },
      match: "exact",
      verification: "Original MotorTrend Assetto Fiorano first test, checked in the Codex inspection of d6e2b40 (2026-11-24).",
      date: "2021"
    }
  ],
  dataGaps: [
    "Hybrid system power split",
    "8-speed DCT ratios",
    "Drag coefficient"
  ],
  unsupportedReason: "Hybrid deployment (engine plus motors, battery power limits) needs a dedicated model; not modeled yet."
};
