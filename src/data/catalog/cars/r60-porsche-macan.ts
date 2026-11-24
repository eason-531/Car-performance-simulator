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
    power: "375 hp",
    torque: "383 lb-ft @ 1,750–5,000 rpm",
    zeroTo60MphS: 4.5,
    sourceId: "src-porsche-us"
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
    },
    {
      id: "src-porsche-us",
      title: "Macan technical data (pre-facelift, US)",
      publisher: "Porsche",
      url: "https://download.newsroom.porsche.com/dam/jcr%3A345230e8-84c0-47c8-9c9f-864353db1751/2020_Macan_Technical_Data.pdf",
      kind: "manufacturer"
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
      conditions: {
        testMass: "4,479 lb (55/45)"
      },
      match: "exact",
      verification: "Original test as transcribed in the owner-supplied spec-sheet follow-up, 2026-11; the 375 hp GTS.",
      date: "2021"
    }
  ],
  dataGaps: [
    "US axle ratio (4.67 EU vs 4.13 US listing)",
    "Tire size",
    "Drag coefficient"
  ],
  unsupportedReason: "Awaiting the US axle ratio: Porsche EU lists 4.67 and a US MY2021 specification database 4.13, so the car is not routed through the physics model until the conflict is resolved.",
  notes: [
    "PDK ratios 3.69/2.15/1.41/1.03/0.79/0.63/0.52 (Porsche US and EU pre-facelift sheets agree).",
    "The 2022 facelift GTS (440 PS) is a different engine rating, so its tests and data are not used for this MY2021 car."
  ]
};
