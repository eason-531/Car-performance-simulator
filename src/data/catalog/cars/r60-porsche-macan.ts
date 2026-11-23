import type { CatalogEntry } from '../types';

/** Roster #60: 2021 Porsche Macan GTS (US). */
export const entry: CatalogEntry = {
  id: "2021-porsche-macan-gts-us-suv-awd-7dct",
  roster: 60,
  section: "SUVs and pickups",
  make: "Porsche",
  model: "Macan",
  trim: "GTS",
  modelYear: 2021,
  market: "US",
  body: "SUV",
  bodyLabel: "SUV",
  chassisCode: "95B facelift",
  aliases: [
    "Macan GTS",
    "95B"
  ],
  origin: "Germany",
  usage: [
    "SUV"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "7-speed PDK",
  powertrain: "Petrol",
  engineLabel: "2.9 twin-turbo V6",
  modelPath: "Existing",
  factory: {
    power: "434 hp",
    torque: "405 lb-ft",
    curbMass: "4,400 lb (Autoblog listing, 2022)",
    zeroTo60MphS: 4.5,
    sourceId: "src3"
  },
  sources: [
    {
      id: "test",
      title: "2021 Porsche Macan GTS first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2021-porsche-macan-gts-first-test-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2021 Porsche Macan GTS first test (reproduced data table)",
      publisher: "ccstartup.com (MotorTrend repost)",
      url: "https://ccstartup.com/blog/2021/02/15/2021-porsche-macan-gts-first-test-porsches-compact-cannon/",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "Porsche Macan GTS technical data",
      publisher: "Porsche Newsroom",
      url: "https://download.newsroom.porsche.com/dam/jcr:2d37daf0-4a15-4a3b-810b-f3c4b4a72c76/PAG_MacanGTS_TD_EN.pdf",
      kind: "manufacturer"
    },
    {
      id: "src4",
      title: "Tested: 2022 Porsche Macan GTS Is the One to Get",
      publisher: "Car and Driver (syndicated on Yahoo)",
      url: "https://autos.yahoo.com/2022-porsche-macan-gts-one-220100188.html",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "mt",
      sourceId: "src2",
      publication: "MotorTrend",
      timing: "rollout-1ft",
      timingNote: "MotorTrend subtracts a 1-ft rollout from its acceleration times.",
      results: {
        zeroTo60MphS: 3.9,
        quarterMileS: 12.6,
        quarterMileTrapMph: 107.8
      },
      conditions: {},
      match: "exact",
      verification: "Reproduction of the MotorTrend data table on a third-party site; original page not reachable.",
      date: "2021"
    },
    {
      id: "cd-2022",
      sourceId: "src4",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 3.5,
        quarterMileS: 12.1
      },
      conditions: {},
      match: "equivalent",
      verification: "Syndicated copy of the article (original page not reachable from this environment).",
      deviation: "2022 model year with the same 2.9 twin-turbo V6 and PDK; not the exact roster car."
    }
  ],
  dataGaps: [
    "7-speed PDK gear ratios and final drive",
    "Torque figure (sources give 405 and 406 lb-ft)",
    "MotorTrend original page",
    "Weight distribution",
    "Tire size",
    "Drag coefficient"
  ],
  unsupportedReason: "Awaiting spec sheet: 7-speed PDK gear ratios and final drive for the 2021 Macan GTS not found in any reachable source, so the car is not routed through the physics model."
};
