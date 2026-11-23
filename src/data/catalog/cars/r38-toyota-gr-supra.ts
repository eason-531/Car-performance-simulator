import type { CatalogEntry } from '../types';

/** Roster #38: 2023 Toyota GR Supra A91-MT Edition (US). */
export const entry: CatalogEntry = {
  id: "2023-toyota-gr-supra-a91-mt-edition-us-coupe-rwd-6mt",
  roster: 38,
  section: "Sports cars",
  make: "Toyota",
  model: "GR Supra",
  trim: "A91-MT Edition",
  modelYear: 2023,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "A90",
  aliases: [
    "Supra",
    "A90",
    "A91-MT",
    "GR Supra 3.0"
  ],
  origin: "Japan",
  usage: [
    "Sports Car"
  ],
  drive: "RWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "3.0 turbo I6 (B58)",
  modelPath: "MT",
  factory: {},
  sources: [
    {
      id: "test",
      title: "2023 Toyota GR Supra manual drive",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a41096194/2023-toyota-gr-supra-manual-drive/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "GR Supra adds manual transmission for 2023",
      publisher: "Toyota USA",
      url: "https://pressroom.toyota.com/toyota-gr-supra-adds-manual-transmission-and-enhanced-drive-dynamics-for-2023/",
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
