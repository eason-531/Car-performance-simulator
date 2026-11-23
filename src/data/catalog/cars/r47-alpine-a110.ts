import type { CatalogEntry } from '../types';

/** Roster #47: 2018 Alpine A110 Première Édition (IT). */
export const entry: CatalogEntry = {
  id: "2018-alpine-a110-premiere-edition-it-coupe-rwd-7dct",
  roster: 47,
  section: "Sports cars",
  make: "Alpine",
  model: "A110",
  trim: "Première Édition",
  modelYear: 2018,
  market: "IT",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "AS1",
  aliases: [
    "A110",
    "Premiere Edition",
    "AS1"
  ],
  origin: "France",
  usage: [
    "Sports Car"
  ],
  drive: "RWD",
  transmission: "DCT",
  transmissionLabel: "7-speed DCT",
  powertrain: "Petrol",
  engineLabel: "1.8 turbo I4 (M5P)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "Alpine A110 Première Édition Centro Prove test",
      publisher: "Quattroruote",
      url: "https://www.quattroruote.it/prove/2018/alpine_a110_la_prova_della_premiere_edition/_jcr_content/summaryParsys/article_attachment/file.res/Centro-Prove-Alpine-A110.pdf",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Alpine A110 2018 brochure",
      publisher: "Alpine",
      url: "https://www.auto-brochures.com/makes/alpine/Alpine_int%20A110_2018-2.pdf",
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
