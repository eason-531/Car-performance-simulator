import type { CatalogEntry } from '../types';

/** Roster #64: 2018 Lamborghini Huracán Performante LP 640-4 (US). */
export const entry: CatalogEntry = {
  id: "2018-lamborghini-huracan-performante-lp-640-4-us-coupe-awd-7dct",
  roster: 64,
  section: "Exotics",
  make: "Lamborghini",
  model: "Huracán",
  trim: "Performante LP 640-4",
  modelYear: 2018,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "LB724",
  aliases: [
    "Huracan",
    "Performante",
    "LP640-4"
  ],
  origin: "Italy",
  usage: [
    "Supercar",
    "Track"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "7-speed DCT",
  powertrain: "Petrol",
  engineLabel: "5.2 V10",
  modelPath: "Existing",
  factory: {
    power: "640 hp",
    torque: "442 lb-ft",
    curbMass: "3,048 lb dry (Lamborghini)",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2018 Lamborghini Huracan Performante test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a18665738/2018-lamborghini-huracan-performante-test-review/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2018 Lamborghini Huracán Performante",
      publisher: "Car and Driver (syndicated on Yahoo)",
      url: "https://autos.yahoo.com/2018-lamborghini-huracan-performante-153500211.html",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "2018 Lamborghini Huracán Performante road test",
      publisher: "MotorWeek",
      url: "https://motorweek.org/road_tests/2018-lambroghini-huracan-performante",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src2",
      publication: "Car and Driver",
      timing: "unconfirmed",
      timingNote: "Car and Driver test published before its late-2019 move to a 1-ft rollout; the earlier procedure is not confirmed here, so both simulator bases are shown.",
      results: {
        zeroTo60MphS: 2.3,
        zeroTo100MphS: 5.4,
        quarterMileS: 10.2,
        quarterMileTrapMph: 136
      },
      conditions: {
        testMass: "3,429 lb"
      },
      match: "exact",
      verification: "Syndicated copy of the article (original page not reachable from this environment). March 2018 issue.",
      date: "2018"
    },
    {
      id: "motorweek",
      sourceId: "src3",
      publication: "MotorWeek",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 2.9,
        quarterMileS: 10.7,
        quarterMileTrapMph: 132
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2018"
    }
  ],
  dataGaps: [
    "7-speed LDF gear ratios and final drive",
    "Power/torque rpm",
    "AWD split range",
    "Tire size",
    "Drag coefficient"
  ],
  unsupportedReason: "Awaiting spec sheet: 7-speed LDF dual-clutch gear ratios and final drive not found in any reachable source, so the car is not routed through the physics model."
};
