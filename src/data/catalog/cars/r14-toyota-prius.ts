import type { CatalogEntry } from '../types';

/** Roster #14: 2023 Toyota Prius Limited AWD (US). */
export const entry: CatalogEntry = {
  id: "2023-toyota-prius-limited-awd-us-liftback-awd-ecvt",
  roster: 14,
  section: "Daily and sport compacts",
  make: "Toyota",
  model: "Prius",
  trim: "Limited AWD",
  modelYear: 2023,
  market: "US",
  body: "Liftback",
  bodyLabel: "Liftback",
  chassisCode: "XW60",
  aliases: [
    "Prius",
    "XW60",
    "E-Four"
  ],
  origin: "Japan",
  usage: [
    "Daily"
  ],
  drive: "AWD",
  transmission: "e-CVT",
  transmissionLabel: "Power-split e-CVT",
  powertrain: "Hybrid",
  engineLabel: "2.0 I4 hybrid (M20A-FXS) + E-Four",
  modelPath: "Hybrid",
  factory: {
    power: "196 hp (system)",
    curbMass: "3,340 lb (Motor Matchup)",
    zeroTo60MphS: 7.0,
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2023 Toyota Prius Limited AWD first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2023-toyota-prius-limited-awd-first-test-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2023 Toyota Prius first drive",
      publisher: "Motor1",
      url: "https://www.motor1.com/reviews/626466/2023-toyota-prius-first-drive/",
      kind: "reference"
    },
    {
      id: "src3",
      title: "2023 Toyota Prius Limited review",
      publisher: "The Auto Channel (citing Car and Driver)",
      url: "https://www.theautochannel.com/news/2023/05/29/1288731-2023-toyota-prius-limited-review-by-david-colman-video.html",
      kind: "reference"
    },
    {
      id: "src4",
      title: "Intake: 2023 Toyota Prius Prime",
      publisher: "MotorTrend (via Magzter)",
      url: "https://magzter.com/fr/stories/automotive/Motor-Trend/INTAKE-2023-TOYOTA-PRIUS-PRIME",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src3",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 7.1,
        quarterMileS: 15.5,
        quarterMileTrapMph: 92
      },
      conditions: {},
      match: "equivalent",
      verification: "Second-hand citation; the original page was not reachable.",
      date: "2023",
      deviation: "Front-drive Limited (194 hp), not the AWD car."
    },
    {
      id: "mt",
      sourceId: "src4",
      publication: "MotorTrend",
      timing: "rollout-1ft",
      timingNote: "MotorTrend subtracts a 1-ft rollout from its acceleration times.",
      results: {
        zeroTo60MphS: 7.2,
        quarterMileS: 15.5,
        quarterMileTrapMph: 91.7
      },
      conditions: {},
      match: "equivalent",
      verification: "Magazine excerpt.",
      date: "2023",
      deviation: "Standard (front-drive) Prius quoted in a Prius Prime story."
    }
  ],
  dataGaps: [
    "MotorTrend Limited AWD first test (roster source)",
    "Power-split gearing and motor ratings",
    "Tire size",
    "Drag coefficient"
  ],
  unsupportedReason: "Hybrid deployment (engine plus motors, battery power limits) needs a dedicated model; not modeled yet."
};
