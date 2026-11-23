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
  benchmarks: [],
  dataGaps: [
    "Car and Driver test results (roster source)",
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
    drivetrain: { layout: 'AWD', description: 'S-AWC with Active Centre Differential', frontShareRange: [0.35, 0.55] },
    chassis: { curbMassKg: 1600, frontWeightFraction: 0.6, wheelbaseM: 2.65, lengthMm: 4505, widthMm: 1810, heightMm: 1480 },
    aero: {},
    tires: { sizes: [square('r18', '245/40 R18', 245, 40, 18, 'Yokohama Advan (assumed)')], compound: 'uhp' },
    speedLimiterKmh: null,
    provenance: [
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
