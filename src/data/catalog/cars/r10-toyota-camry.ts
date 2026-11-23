import type { CatalogEntry } from '../types';

/** Roster #10: 2020 Toyota Camry TRD V6 (US). */
export const entry: CatalogEntry = {
  id: "2020-toyota-camry-trd-v6-us-sedan-fwd-8at",
  roster: 10,
  section: "Daily and sport compacts",
  make: "Toyota",
  model: "Camry",
  trim: "TRD V6",
  modelYear: 2020,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "XV70",
  aliases: [
    "Camry TRD",
    "XV70"
  ],
  origin: "Japan",
  usage: [
    "Daily",
    "Sport Sedan"
  ],
  drive: "FWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic",
  powertrain: "Petrol",
  engineLabel: "3.5 V6 (2GR-FKS)",
  modelPath: "Existing",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2020 Toyota Camry TRD by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a30762981/2020-toyota-camry-trd-by-the-numbers/",
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
