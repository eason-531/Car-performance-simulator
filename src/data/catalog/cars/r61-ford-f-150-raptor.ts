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
  factory: {
    power: "450 hp",
    torque: "510 lb-ft",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2021 Ford F-150 Raptor 37 Performance Package by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a40059355/2021-ford-f-150-raptor-37-performance-package-by-the-numbers/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2021 Ford Raptor first drive",
      publisher: "Motor1",
      url: "https://www.motor1.com/reviews/529834/2021-ford-raptor-first-drive/",
      kind: "reference"
    },
    {
      id: "src3",
      title: "Tested: 2021 Ford Raptor slower than F-150 Hybrid",
      publisher: "Edmunds (via Carscoops)",
      url: "https://www.carscoops.com/2022/05/want-a-fast-ford-f-150-buy-the-hybrid-not-the-raptor/",
      kind: "road-test"
    },
    {
      id: "src4",
      title: "2021 Ford F-150 (Raptor)",
      publisher: "MotorTrend (via Magzter)",
      url: "https://www.magzter.com/ja/stories/Automotive/Motor-Trend/2021-Ford-F-150",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "edmunds",
      sourceId: "src3",
      publication: "Edmunds",
      timing: "standing-start",
      timingNote: "Edmunds times from a standstill (\"zero should mean zero\"), no rollout.",
      results: {
        zeroTo60MphS: 5.8,
        quarterMileS: 14.3
      },
      conditions: {
        tires: "37-inch tires"
      },
      match: "exact",
      verification: "Second-hand citation; the original page was not reachable.",
      date: "2022"
    },
    {
      id: "mt",
      sourceId: "src4",
      publication: "MotorTrend",
      timing: "rollout-1ft",
      timingNote: "MotorTrend subtracts a 1-ft rollout from its acceleration times.",
      results: {
        zeroTo60MphS: 5.6
      },
      conditions: {
        tires: "37-inch tires"
      },
      match: "exact",
      verification: "Magazine excerpt.",
      date: "2021"
    },
    {
      id: "cd",
      sourceId: "test",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 5.2
      },
      conditions: {
        testMass: "5,971 lb",
        tires: "37-inch tires",
        other: [
          "Transfer-case mode as stated in the test (not transcribed)"
        ]
      },
      match: "exact",
      verification: "Original test as transcribed in the owner-supplied spec-sheet follow-up, 2026-11; exact 37 Performance Package truck.",
      date: "2021"
    }
  ],
  dataGaps: [
    "4WD torque split",
    "Drag coefficient"
  ],
  notes: [
    "Ford confirms 4.10 front and rear axle ratios."
  ],
  unsupportedReason: "Transfer-case 4WD test mode (4A/4H) not modeled yet."
};
