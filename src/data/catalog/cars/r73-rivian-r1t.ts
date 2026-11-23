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
  factory: {
    power: "835 hp",
    torque: "908 lb-ft",
    curbMass: "≈7,148 lb (Edmunds scales)",
    sourceId: "src4"
  },
  sources: [
    {
      id: "test",
      title: "2022 Rivian R1T 60-mph acceleration",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/news/a38943455/2022-rivian-r1t-60-mph-acceleration/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Rivian R1T: quickest pickup truck ever tested by Car and Driver",
      publisher: "InsideEVs (citing Car and Driver)",
      url: "https://insideevs.com/news/564834/rivian-r1t-quickest-truck-ever/",
      kind: "reference"
    },
    {
      id: "src3",
      title: "2022 Rivian R1T road test",
      publisher: "MotorWeek",
      url: "https://motorweek.org/road_tests/2022-rivian-r1t/",
      kind: "road-test"
    },
    {
      id: "src4",
      title: "Tested: 2023 Rivian R1T",
      publisher: "Edmunds",
      url: "https://edmunds.com/car-news/tested-2023-rivian-r1t.html",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src2",
      publication: "Car and Driver (as cited by InsideEVs)",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 3.3,
        quarterMileS: 11.9,
        quarterMileTrapMph: 110
      },
      conditions: {},
      match: "exact",
      verification: "Second-hand citation; the original page was not reachable.",
      date: "2022"
    },
    {
      id: "motorweek",
      sourceId: "src3",
      publication: "MotorWeek",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 3.2,
        quarterMileS: 11.8,
        quarterMileTrapMph: 111
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2022"
    },
    {
      id: "edmunds",
      sourceId: "src4",
      publication: "Edmunds",
      timing: "standing-start",
      timingNote: "Edmunds times from a standstill (\"zero should mean zero\"), no rollout.",
      results: {
        zeroTo60MphS: 3.5,
        quarterMileS: 11.9,
        quarterMileTrapMph: 109.9
      },
      conditions: {},
      match: "equivalent",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2023",
      deviation: "2023 quad-motor truck (same powertrain); 3.3 s with a 1-ft rollout."
    }
  ],
  dataGaps: [
    "Car and Driver original page",
    "Motor ratings and battery limits",
    "Drag coefficient"
  ],
  unsupportedReason: "EV motor torque, battery output limits and axle gearing need a dedicated model; not modeled yet."
};
