import type { CatalogEntry } from '../types';

/** Roster #32: 2021 Škoda Octavia Combi RS 2.0 TSI DSG (DE). */
export const entry: CatalogEntry = {
  id: "2021-skoda-octavia-combi-rs-2-0-tsi-dsg-de-wagon-fwd-7dct",
  roster: 32,
  section: "Wagons",
  make: "Škoda",
  model: "Octavia Combi",
  trim: "RS 2.0 TSI DSG",
  modelYear: 2021,
  market: "DE",
  body: "Wagon",
  bodyLabel: "Wagon (Combi)",
  chassisCode: "NX",
  aliases: [
    "Octavia RS",
    "vRS",
    "NX",
    "Skoda"
  ],
  origin: "Czechia",
  usage: [
    "Wagon",
    "Daily",
    "Sport Compact"
  ],
  drive: "FWD",
  transmission: "DCT",
  transmissionLabel: "7-speed DSG",
  powertrain: "Petrol",
  engineLabel: "2.0 turbo I4 (EA888 evo4, 180 kW)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "Škoda Octavia Combi RS test",
      publisher: "Auto Zeitung",
      url: "https://www.autozeitung.de/skoda-octavia-combi-rs-test-199702.html",
      kind: "road-test"
    }
  ],
  benchmarks: [],
  unsupportedReason: "Research in progress — factory gearing, mass and output not yet modeled.",
  dataGaps: [
    "Factory specifications not yet researched",
    "Measured benchmark not yet transcribed"
  ]
};
