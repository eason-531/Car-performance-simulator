import type { CatalogEntry } from '../types';

/** Roster #51: 2021 Porsche 911 Turbo S Turbo S coupe (US). */
export const entry: CatalogEntry = {
  id: "2021-porsche-911-turbo-s-turbo-s-coupe-us-coupe-awd-8dct",
  roster: 51,
  section: "Sports cars",
  make: "Porsche",
  model: "911 Turbo S",
  trim: "Turbo S coupe",
  modelYear: 2021,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "992.1",
  aliases: [
    "Turbo S",
    "992",
    "911"
  ],
  origin: "Germany",
  usage: [
    "Sports Car",
    "Grand Tourer",
    "Supercar"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "8-speed PDK",
  powertrain: "Petrol",
  engineLabel: "3.7 twin-turbo flat-6",
  modelPath: "Existing",
  factory: {
    power: "640 hp",
    torque: "590 lb-ft",
    curbMass: "3,636 lb (2020 specification listing)",
    zeroTo60MphS: 2.6,
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2021 Porsche 911 Turbo S testing",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/news/a34359564/2021-porsche-911-turbo-s-testing-zero-to-60/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "640-HP Porsche 911 Turbo S Ties for the Second-Quickest Car We've Tested",
      publisher: "Car and Driver (syndicated on Yahoo)",
      url: "https://sports.yahoo.com/640-hp-2021-porsche-911-164900225.html",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "Car and Driver: 2021 Porsche 911 Turbo S is crazy, crazy fast",
      publisher: "Rennlist",
      url: "https://rennlist.com/articles/this-just-in-2021-porsche-911-turbo-s-is-crazy-crazy-fast",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src2",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 2.2,
        quarterMileS: 10.1,
        quarterMileTrapMph: 137
      },
      conditions: {},
      match: "exact",
      verification: "Syndicated copy of the article (original page not reachable from this environment). Porsche claimed 2.6 s and 10.5 s for comparison.",
      date: "2020"
    }
  ],
  dataGaps: [
    "8-speed PDK gear ratios and final drive",
    "Curb mass of the Car and Driver test car",
    "Power/torque rpm bands",
    "Tire size",
    "Drag coefficient",
    "Front-axle torque split range"
  ],
  unsupportedReason: "Awaiting spec sheet: 8-speed PDK gear ratios and final drive for the 992 Turbo S not found in any reachable source, so the car is not routed through the physics model."
};
