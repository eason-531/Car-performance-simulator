import type { CatalogEntry } from '../types';

/** Roster #63: 2018 McLaren 720S Coupe (US). */
export const entry: CatalogEntry = {
  id: "2018-mclaren-720s-coupe-us-coupe-rwd-7dct",
  roster: 63,
  section: "Exotics",
  make: "McLaren",
  model: "720S",
  trim: "Coupe",
  modelYear: 2018,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "P14",
  aliases: [
    "720S",
    "P14"
  ],
  origin: "United Kingdom",
  usage: [
    "Supercar",
    "Track"
  ],
  drive: "RWD",
  transmission: "DCT",
  transmissionLabel: "7-speed DCT",
  powertrain: "Petrol",
  engineLabel: "4.0 twin-turbo V8 (M840T)",
  modelPath: "Existing",
  factory: {
    power: "710 PS (700 hp) @ 7,500 rpm",
    torque: "770 Nm (568 lb-ft) @ 5,500 rpm",
    curbMass: "3,128 lb (Motor1 listing)",
    zeroTo60MphS: 2.8,
    sourceId: "src3"
  },
  sources: [
    {
      id: "test",
      title: "2018 McLaren 720S instrumented test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a19862504/2018-mclaren-720s-instrumented-test-review/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "McLaren 720S 0–60 times",
      publisher: "0-60specs",
      url: "https://www.0-60specs.com/mclaren/720s-0-60-times",
      kind: "reference"
    },
    {
      id: "src3",
      title: "2018 McLaren 720S review",
      publisher: "Motor1",
      url: "https://www.motor1.com/reviews/225841/2018-mclaren-720s/",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "cd-agg",
      sourceId: "src2",
      publication: "Car and Driver (as listed by 0-60specs)",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 2.7,
        quarterMileS: 10.2,
        quarterMileTrapMph: 145
      },
      conditions: {},
      match: "equivalent",
      verification: "Aggregator listing that attributes the run to the publication; original page not reachable. Another listing gives 9.9 s @ 148.2 mph with inconsistent attribution, so it is not transcribed.",
      deviation: "Listed for the 2019 model year (same car)."
    }
  ],
  dataGaps: [
    "7-speed SSG gear ratios and final drive",
    "Car and Driver original test page",
    "Curb mass (sources span 3,128–3,158 lb)",
    "Tire size",
    "Drag coefficient"
  ],
  unsupportedReason: "Awaiting spec sheet: 7-speed SSG gear ratios and final drive not found in any reachable source, so the car is not routed through the physics model."
};
