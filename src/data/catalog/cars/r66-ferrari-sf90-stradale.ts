import type { CatalogEntry } from '../types';

/** Roster #66: 2021 Ferrari SF90 Stradale Assetto Fiorano (US). */
export const entry: CatalogEntry = {
  id: "2021-ferrari-sf90-stradale-assetto-fiorano-us-coupe-awd-8dct",
  roster: 66,
  section: "Exotics",
  make: "Ferrari",
  model: "SF90 Stradale",
  trim: "Assetto Fiorano",
  modelYear: 2021,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "F173",
  aliases: [
    "SF90",
    "Assetto Fiorano"
  ],
  origin: "Italy",
  usage: [
    "Supercar",
    "Track"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "8-speed DCT + three motors",
  powertrain: "Plug-in hybrid",
  engineLabel: "4.0 twin-turbo V8 + 3 motors",
  modelPath: "Hybrid",
  factory: {
    power: "986 hp (1,000 CV, system)",
    curbMass: "≈1,570 kg (CarSales)",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2021 Ferrari SF90 Stradale Assetto Fiorano first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2021-ferrari-sf90-stradale-assetto-fiorano-first-test-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Ferrari SF90 Assetto Fiorano 2021 review",
      publisher: "CarSales (AU)",
      url: "https://www.carsales.com.au/editorial/details/ferrari-sf90-assetto-fiorano-2021-review-130922",
      kind: "reference"
    }
  ],
  benchmarks: [],
  dataGaps: [
    "MotorTrend first test results (roster source)",
    "Hybrid system power split",
    "8-speed DCT ratios",
    "Drag coefficient"
  ],
  unsupportedReason: "Hybrid deployment (engine plus motors, battery power limits) needs a dedicated model; not modeled yet."
};
