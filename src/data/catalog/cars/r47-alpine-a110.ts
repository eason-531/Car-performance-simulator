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
  factory: {
    power: "252 CV (185 kW)",
    sourceId: "test"
  },
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
  dataGaps: [
    "Quattroruote measured 0–100 km/h, 0–400 m and 0–1000 m",
    "7-speed DCT (Getrag 7DCT300) gear ratios and final drive",
    "Curb mass (DIN/EU)",
    "Torque figure and rpm bands",
    "Tire size",
    "Drag coefficient"
  ],
  notes: [
    "Quattroruote road test from the September 2018 issue (no. 757); the acceleration table labels were scrambled in the reachable text, so no figure is transcribed."
  ],
  unsupportedReason: "Awaiting spec sheet: the 7-speed DCT ratios and the Quattroruote measured figures (the reachable text of the test table is garbled) not found in any reachable source, so the car is not routed through the physics model."
};
