import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #18: 2015 Mitsubishi Lancer Evolution Final Edition (US). */
export const entry: CatalogEntry = {
  id: "2015-mitsubishi-lancer-evolution-final-edition-us-sedan-awd-5mt",
  roster: 18,
  section: "Daily and sport compacts",
  make: "Mitsubishi",
  model: "Lancer Evolution",
  trim: "Final Edition",
  modelYear: 2015,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "CZ4A",
  aliases: [
    "Evo",
    "Evo X",
    "CZ4A",
    "S-AWC"
  ],
  origin: "Japan",
  usage: [
    "Sport Compact",
    "Track"
  ],
  drive: "AWD",
  transmission: "MT",
  transmissionLabel: "5-speed manual",
  powertrain: "Petrol",
  engineLabel: "2.0 turbo I4 (4B11T)",
  modelPath: "MT",
  factory: {
    power: "303 hp",
    torque: "305 lb-ft",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2015 Mitsubishi Lancer Evolution Final Edition test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15102392/2015-mitsubishi-lancer-evolution-final-edition-test-review/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2015 Lancer Evolution Final Edition: most powerful mass-production Evolution ever",
      publisher: "Mitsubishi Motors",
      url: "https://media.mitsubishicars.com/en-US/releases/2015-mitsubishi-lancer-evolution-final-edition-most-powerful-mass-production-evolution-ever",
      kind: "manufacturer"
    },
    {
      id: "src3",
      title: "2015 Lancer Evolution Final Edition specifications",
      publisher: "Motor Matchup",
      url: "https://www.motormatchup.com/catalog/Mitsubishi/Lancer-Evolution/2015/Final-Edition-4DR-Sedan",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "test",
      publication: "Car and Driver",
      timing: "unconfirmed",
      timingNote: "Car and Driver test published before its late-2019 move to a 1-ft rollout; the earlier procedure is not confirmed here, so both simulator bases are shown.",
      results: {
        zeroTo60MphS: 4.4,
        quarterMileS: 13.3,
        quarterMileTrapMph: 104
      },
      conditions: {
        testMass: "3,517 lb as tested"
      },
      match: "exact",
      verification: "Original Car and Driver Final Edition test, checked in the Codex inspection of d6e2b40 (2026-11-24). Timing basis not stated in the checked material (pre-2020 test), so both simulator bases are shown.",
      date: "2015"
    }
  ],
  dataGaps: [
    "Final drive (single source)",
    "Power/torque rpm",
    "AWD split range",
    "Drag coefficient"
  ],
  sim: buildSpec({
  id: "2015-mitsubishi-lancer-evolution-final-edition-us-sedan-awd-5mt",
  make: "Mitsubishi",
  model: "Lancer Evolution",
  trim: "Final Edition",
  modelYear: 2015,
  market: "US",
  body: "Sedan",
  shortName: "Mitsubishi Lancer Evolution Final Edition"
}, {
    engine: { code: '4B11T', description: '2.0 L turbo I4, MIVEC', displacementCc: 1998, aspiration: 'turbo', idleRpm: 800, redlineRpm: 7000, revLimitRpm: 7200, power: { value: 303, unit: 'hp', rpm: [6500, 6500] }, torque: { value: 305, unit: 'lb-ft', rpm: [4000, 4000] }, peakBoostBar: 1.4 },
    transmission: { type: 'manual', name: '5-speed manual', gearRatios: [2.86, 1.95, 1.44, 1.1, 0.76], finalDrive: 4.69 },
    drivetrain: { layout: 'AWD', efficiency: 0.9, description: 'S-AWC with Active Centre Differential', frontShareRange: [0.35, 0.55] },
    chassis: { curbMassKg: 1600, frontWeightFraction: 0.6, wheelbaseM: 2.65, lengthMm: 4505, widthMm: 1810, heightMm: 1480 },
    aero: {},
    tires: { sizes: [square('r18', '245/40 R18', 245, 40, 18, 'Yokohama Advan (assumed)')], compound: 'uhp', gripScale: 1.3 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.30 (fit bound)', status: 'estimated', source: 'Fit toward the aggregator-listed Car and Driver 0–60 mph 4.4 s stopped at the bound (sim ≈4.9 s); residual shown' },
      { parameter: 'Drivetrain efficiency', value: '90 %', status: 'estimated', source: 'Fitted toward the aggregator-listed trap 104 mph (asked 91.3 %; capped at the 90 % manual bound)' },
      { parameter: 'Peak power', value: '303 hp', status: 'reported', source: 'Mitsubishi press release', url: 'https://media.mitsubishicars.com/en-US/releases/2015-mitsubishi-lancer-evolution-final-edition-most-powerful-mass-production-evolution-ever' },
      { parameter: 'Peak torque', value: '305 lb-ft', status: 'reported', source: 'Mitsubishi press release', url: 'https://media.mitsubishicars.com/en-US/releases/2015-mitsubishi-lancer-evolution-final-edition-most-powerful-mass-production-evolution-ever' },
      { parameter: 'Power / torque rpm', value: '6,500 / 4,000 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Gear ratios', value: '2.86/1.95/1.44/1.10/0.76', status: 'reported', source: 'Motor Matchup (Carspecs agrees on 1st–3rd)', url: 'https://www.motormatchup.com/catalog/Mitsubishi/Lancer-Evolution/2015/Final-Edition-4DR-Sedan' },
      { parameter: 'Final drive', value: '4.69', status: 'reported', source: 'Motor Matchup (single source)', url: 'https://www.motormatchup.com/catalog/Mitsubishi/Lancer-Evolution/2015/Final-Edition-4DR-Sedan' },
      { parameter: 'Curb mass', value: '3,527 lb (1,600 kg)', status: 'reported', source: 'Motor Matchup', url: 'https://www.motormatchup.com/catalog/Mitsubishi/Lancer-Evolution/2015/Final-Edition-4DR-Sedan' },
      { parameter: 'AWD split', value: 'Front share 0.35–0.55', status: 'estimated', source: 'Active centre differential range (estimate)' },
      { parameter: 'Tire size', value: '245/40 R18', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
