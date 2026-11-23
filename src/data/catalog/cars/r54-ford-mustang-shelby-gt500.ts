import type { CatalogEntry } from '../types';

/** Roster #54: 2020 Ford Mustang Shelby GT500 Carbon Fiber Track Package (US). */
export const entry: CatalogEntry = {
  id: "2020-ford-mustang-shelby-gt500-carbon-fiber-track-package-us-coupe-rwd-7dct",
  roster: 54,
  section: "American performance",
  make: "Ford",
  model: "Mustang Shelby GT500",
  trim: "Carbon Fiber Track Package",
  modelYear: 2020,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "S550",
  aliases: [
    "GT500",
    "Shelby",
    "S550",
    "Mustang"
  ],
  origin: "United States",
  usage: [
    "Muscle",
    "Track"
  ],
  drive: "RWD",
  transmission: "DCT",
  transmissionLabel: "7-speed DCT",
  powertrain: "Petrol",
  engineLabel: "5.2 supercharged V8 (Predator)",
  modelPath: "Existing",
  factory: {
    power: "760 hp @ 7,300 rpm",
    torque: "625 lb-ft @ 5,000 rpm",
    curbMass: "≈4,225 lb base (approx.)",
    zeroTo60MphS: 3.3,
    sourceId: "src3"
  },
  sources: [
    {
      id: "test",
      title: "2020 Ford Mustang Shelby GT500 first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2020-ford-mustang-shelby-gt500-first-test",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2020 Ford Shelby GT500 review",
      publisher: "Edmunds",
      url: "https://edmunds.com/ford/shelby-gt500/2020/review",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "2020 GT500 details & specs",
      publisher: "CJ Pony Parts",
      url: "https://www.cjponyparts.com/resources/news/2020-shelby-gt500",
      kind: "reference"
    },
    {
      id: "src4",
      title: "The Shelby GT500's Carbon Track Pack makes it slower",
      publisher: "CarBuzz (citing Car and Driver)",
      url: "https://carbuzz.com/news/the-shelby-gt500s-18500-carbon-track-pack-makes-it-slower",
      kind: "reference"
    },
    {
      id: "src5",
      title: "Mustang Shelby GT500 is quicker without the Carbon Fiber Track Pack",
      publisher: "Ford Authority (citing Car and Driver)",
      url: "https://fordauthority.com/2021/01/ford-mustang-shelby-gt500-is-quicker-without-the-carbon-fiber-track-pack",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "edmunds",
      sourceId: "src2",
      publication: "Edmunds",
      timing: "standing-start",
      timingNote: "Edmunds times from a standstill (\"zero should mean zero\"), no rollout.",
      results: {
        zeroTo60MphS: 3.8,
        quarterMileS: 11.3,
        quarterMileTrapMph: 130.7
      },
      conditions: {
        other: [
          "Carbon Fiber Track Package"
        ]
      },
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2020"
    },
    {
      id: "cd",
      sourceId: "src4",
      publication: "Car and Driver (as cited by CarBuzz)",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 3.6,
        zeroTo100MphS: 7.1
      },
      conditions: {
        other: [
          "Carbon Fiber Track Package"
        ]
      },
      match: "exact",
      verification: "Second-hand citation. Ford Authority quotes the same test as 3.4 s and 11.4 s, which conflicts.",
      date: "2020"
    }
  ],
  dataGaps: [
    "TR-9070 7-speed DCT gear ratios and final drive",
    "CFTP curb mass",
    "Car and Driver original test page (conflicting citations)",
    "MotorTrend test",
    "Tire size",
    "Drag coefficient"
  ],
  notes: [
    "Ford claims 3.3 s to 60 mph and a 10.7 s quarter mile; the Track Package deletes the rear seat, so its mass differs from the base car."
  ],
  unsupportedReason: "Awaiting spec sheet: TR-9070 7-speed DCT gear ratios and final drive not found in any reachable source, so the car is not routed through the physics model."
};
