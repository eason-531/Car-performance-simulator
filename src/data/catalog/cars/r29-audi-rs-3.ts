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
    }
  ],
  benchmarks: [
    {
      id: "synd-test",
      sourceId: "src3",
      publication: "Instrumented test syndicated on Yahoo Autos (outlet not named; likely Car and Driver)",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 3.3
      },
      conditions: {
        testMass: "3,639 lb as tested",
        launchControl: "Launch control"
      },
      match: "exact",
      verification: "Syndicated copy of the article (original page not reachable from this environment). Quarter-mile time and trap speed were not in the reachable text.",
      date: "2022"
    },
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
    }
  ],
  dataGaps: [
    "7-speed DQ500 gear ratios and final drive",
    "Power/torque rpm bands",
    "Quarter-mile time and trap speed",
    "Tire size",
    "Drag coefficient",
    "Front/rear weight distribution"
  ],
  unsupportedReason: "Awaiting spec sheet: 7-speed S tronic (DQ500) gear ratios and final drive for the 8Y RS 3 not found in any reachable source, so the car is not routed through the physics model."
};
