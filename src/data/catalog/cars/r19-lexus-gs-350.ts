import type { CatalogEntry } from '../types';

/** Roster #19: 2016 Lexus GS 350 F Sport RWD (US). */
export const entry: CatalogEntry = {
  id: "2016-lexus-gs-350-f-sport-rwd-us-sedan-rwd-8at",
  roster: 19,
  section: "Luxury and sport sedans",
  make: "Lexus",
  model: "GS 350",
  trim: "F Sport RWD",
  modelYear: 2016,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "L10 facelift",
  aliases: [
    "GS350",
    "L10"
  ],
  origin: "Japan",
  usage: [
    "Sport Sedan",
    "Luxury"
  ],
  drive: "RWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic",
  powertrain: "Petrol",
  engineLabel: "3.5 V6 (2GR-FKS)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2016 Lexus GS350 F Sport test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15104392/2016-lexus-gs350-f-sport-test-review/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "MY16 Lexus GS brochure (US)",
      publisher: "Lexus",
      url: "https://www.lexus.com/content/dam/lexus/documents/brochures/models/2016/MY16-Lexus-GS-and-Lexus-GS-Hybrid-Brochure.pdf",
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
