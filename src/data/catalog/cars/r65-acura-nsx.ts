import type { CatalogEntry } from '../types';

/** Roster #65: 2017 Acura NSX NSX (US). */
export const entry: CatalogEntry = {
  id: "2017-acura-nsx-us-coupe-awd-9dct",
  roster: 65,
  section: "Exotics",
  make: "Acura",
  model: "NSX",
  trim: "NSX",
  modelYear: 2017,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "NC1",
  aliases: [
    "NSX",
    "NC1"
  ],
  origin: "Japan",
  usage: [
    "Supercar"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "9-speed DCT + three motors",
  powertrain: "Hybrid",
  engineLabel: "3.5 twin-turbo V6 + 3 motors (Sport Hybrid SH-AWD)",
  modelPath: "Hybrid",
  factory: {
    power: "573 hp (system)",
    torque: "476 lb-ft (system)",
    curbMass: "3,803 lb",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2017 Acura NSX test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15098793/2017-acura-nsx-supercar-full-test-review/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2017 Acura NSX review",
      publisher: "Autoblog",
      url: "https://www.autoblog.com/buy/2017-Acura-NSX/review/",
      kind: "reference"
    },
    {
      id: "src3",
      title: "2017 Acura NSX",
      publisher: "Car and Driver (syndicated on Yahoo)",
      url: "https://autos.yahoo.com/2017-acura-nsx-203000488.html",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src3",
      publication: "Car and Driver",
      timing: "unconfirmed",
      timingNote: "Car and Driver test published before its late-2019 move to a 1-ft rollout; the earlier procedure is not confirmed here, so both simulator bases are shown.",
      results: {
        zeroTo60MphS: 3.1,
        quarterMileS: 11.2,
        quarterMileTrapMph: 126
      },
      conditions: {
        testMass: "3,868 lb"
      },
      match: "exact",
      verification: "Syndicated copy of the article (original page not reachable from this environment). The 0–60 time comes from a newspaper spec sheet crediting Car and Driver.",
      date: "2016"
    }
  ],
  dataGaps: [
    "Motor outputs and battery limits",
    "Front-axle torque-vectoring split",
    "Drag coefficient"
  ],
  notes: [
    "A MotorTrend comparison recorded 3.1 s and 11.3 s.",
    "Acura power-unit press kit: 9DCT 3.838/2.433/1.778/1.428/1.211/1.038/0.881/0.747/0.634, rear axle 3.583; the front Twin Motor Unit is described separately."
  ],
  unsupportedReason: "Hybrid deployment (engine plus motors, battery power limits) needs a dedicated model; not modeled yet."
};
