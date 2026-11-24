import type { CatalogEntry } from '../types';

/** Roster #29: 2022 Audi RS 3 RS 3 (US). */
export const entry: CatalogEntry = {
  id: "2022-audi-rs-3-us-sedan-awd-7dct",
  roster: 29,
  section: "Luxury and sport sedans",
  make: "Audi",
  model: "RS 3",
  trim: "RS 3",
  modelYear: 2022,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "8Y",
  aliases: [
    "RS3",
    "8Y",
    "quattro"
  ],
  origin: "Germany",
  usage: [
    "Sport Compact",
    "Sport Sedan"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "7-speed S tronic",
  powertrain: "Petrol",
  engineLabel: "2.5 turbo I5 (EA855 evo)",
  modelPath: "Existing",
  factory: {
    power: "401 hp",
    torque: "369 lb-ft",
    curbMass: "3,649 lb (Autoblog / The Drive listing)",
    zeroTo60MphS: 3.6,
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2022 Audi RS3 sedan US drive",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a40157829/2022-audi-rs3-sedan-us-drive/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2022 Audi RS3 review",
      publisher: "Motor1",
      url: "https://www.motor1.com/reviews/634277/2022-audi-rs3-review/",
      kind: "reference"
    },
    {
      id: "src3",
      title: "Tested: 2022 Audi RS3 Hits 60 MPH in 3.3 Seconds",
      publisher: "Yahoo Autos (syndicated)",
      url: "https://autos.yahoo.com/2022-audi-rs3-focused-track-140000020.html",
      kind: "road-test"
    },
    {
      id: "src-audi-eu",
      title: "RS 3 Sedan TFSI technical data (pre-facelift)",
      publisher: "Audi",
      url: "https://www.audi.com/system/production/car_motorizations/468/file_en/1d135b0858d0dbde3c70b0690ae8652197730017/eTD-Audi-RS3-Sedan-TFSI_231027.pdf?1698933729=&disposition=attachment",
      kind: "manufacturer"
    }
  ],
  benchmarks: [
    {
      id: "motor1",
      sourceId: "src2",
      publication: "Motor1",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 3.8
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment). Single first-drive run, not a full instrumented test.",
      date: "2022"
    },
    {
      id: "cd",
      sourceId: "test",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 3.3,
        quarterMileS: 11.8,
        quarterMileTrapMph: 117,
        rolloutS: 0.3
      },
      conditions: {
        testMass: "3,639 lb"
      },
      match: "exact",
      verification: "Original test as transcribed in the owner-supplied spec-sheet follow-up, 2026-11; original test; it lists the wheel and tire options.",
      date: "2022"
    }
  ],
  dataGaps: [
    "Gearbox code and per-gear output-ratio assignment",
    "Power/torque rpm bands",
    "US tire size",
    "Front/rear weight distribution"
  ],
  unsupportedReason: "Awaiting the S tronic shaft assignment: Audi publishes the forward ratios and two output ratios (4.059 and 3.45) but not which gears use which in this US gearbox, so the car is not routed through the physics model.",
  notes: [
    "Forward ratios 3.560/2.530/1.680/1.020/0.790/0.760/0.630 (Audi, agreeing with the 2022 US listing to rounding). Output ratios 4.059 (EU table) and 3.45 (US database) suggest two output shafts; the TT RS mapping is not assumed.",
    "Audi EU aero: Cd 0.32, 2.22 m². The EU power rating is kept separate from the US 401 hp."
  ]
};
