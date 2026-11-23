import type { CatalogEntry } from '../types';

/** Roster #61: 2021 Ford F-150 Raptor SuperCrew 37 Performance Package (US). */
export const entry: CatalogEntry = {
  id: "2021-ford-f-150-raptor-supercrew-37-performance-package-us-pickup-4wd-10at",
  roster: 61,
  section: "SUVs and pickups",
  make: "Ford",
  model: "F-150 Raptor",
  trim: "SuperCrew 37 Performance Package",
  modelYear: 2021,
  market: "US",
  body: "Pickup",
  bodyLabel: "Crew-cab pickup",
  chassisCode: "P702 (14th gen)",
  aliases: [
    "Raptor",
    "F150"
  ],
  origin: "United States",
  usage: [
    "Pickup",
    "Off-road"
  ],
  drive: "4WD",
  transmission: "AT",
  transmissionLabel: "10-speed automatic",
  powertrain: "Petrol",
  engineLabel: "3.5 twin-turbo V6 (EcoBoost HO)",
  modelPath: "4WD",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2021 Ford F-150 Raptor 37 Performance Package by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a40059355/2021-ford-f-150-raptor-37-performance-package-by-the-numbers/",
      kind: "road-test"
    }
  ],
  benchmarks: [],
  unsupportedReason: "Transfer-case 4WD test mode (4A/4H) not modeled yet.",
  dataGaps: [
    "Factory specifications not yet researched",
    "Measured benchmark not yet transcribed"
  ]
};
