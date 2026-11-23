import type { CatalogEntry } from '../types';

/** Roster #31: 2024 Acura TLX Type S (US). */
export const entry: CatalogEntry = {
  id: "2024-acura-tlx-type-s-us-sedan-awd-10at",
  roster: 31,
  section: "Luxury and sport sedans",
  make: "Acura",
  model: "TLX",
  trim: "Type S",
  modelYear: 2024,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "UB facelift",
  aliases: [
    "TLX Type S",
    "SH-AWD"
  ],
  origin: "Japan",
  usage: [
    "Sport Sedan",
    "Luxury"
  ],
  drive: "AWD",
  transmission: "AT",
  transmissionLabel: "10-speed automatic",
  powertrain: "Petrol",
  engineLabel: "3.0 turbo V6 (J30AC)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2024 Acura TLX Type S drive",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a46362532/2024-acura-tlx-type-s-drive/",
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
