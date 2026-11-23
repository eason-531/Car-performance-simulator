import type { CatalogEntry } from '../types';

/** Roster #4: 2021 Toyota GR Yaris Circuit Pack (UK). */
export const entry: CatalogEntry = {
  id: "2021-toyota-gr-yaris-circuit-pack-uk-hatch-awd-6mt",
  roster: 4,
  section: "Hot hatches",
  make: "Toyota",
  model: "GR Yaris",
  trim: "Circuit Pack",
  modelYear: 2021,
  market: "UK",
  body: "Hatchback",
  bodyLabel: "3-door hatchback",
  chassisCode: "GXPA16",
  aliases: [
    "GR Yaris",
    "GXPA16",
    "GR-Four"
  ],
  origin: "Japan",
  usage: [
    "Hot Hatch",
    "Track"
  ],
  drive: "AWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "1.6 turbo I3 (G16E-GTS)",
  modelPath: "MT",
  factory: {},
  sources: [
    {
      id: "test",
      title: "Toyota GR Yaris 2020–2024 road test",
      publisher: "Autocar",
      url: "https://d2km96w3x5blkf.cloudfront.net/car-review/toyota/gr-yaris-2020-2024",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "GR Yaris technical release",
      publisher: "Toyota GB",
      url: "https://media.toyota.co.uk/wp-content/uploads/sites/5/2021/03/1605890847201029MGRYarisFullRelease.pdf",
      kind: "manufacturer"
    }
  ],
  benchmarks: [],
  unsupportedReason: "Research in progress — factory gearing, mass and output not yet modeled.",
  dataGaps: [
    "Factory specifications not yet researched",
    "Measured benchmark not yet transcribed"
  ]
};
