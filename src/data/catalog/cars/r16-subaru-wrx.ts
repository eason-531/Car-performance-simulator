import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #16: 2022 Subaru WRX Limited (US). */
export const entry: CatalogEntry = {
  id: "2022-subaru-wrx-limited-us-sedan-awd-6mt",
  roster: 16,
  section: "Daily and sport compacts",
  make: "Subaru",
  model: "WRX",
  trim: "Limited",
  modelYear: 2022,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "VB",
  aliases: [
    "WRX",
    "VB"
  ],
  origin: "Japan",
  usage: [
    "Sport Compact",
    "Daily"
  ],
  drive: "AWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "2.4 turbo flat-4 (FA24F)",
  modelPath: "MT",
  factory: {
    power: "271 hp",
    torque: "258 lb-ft",
    curbMass: "3,390 lb (Limited, manual)",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2022 Subaru WRX Limited by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a40026459/2022-subaru-wrx-limited-by-the-numbers/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2022 WRX specifications",
      publisher: "Subaru of America",
      url: "https://s3.amazonaws.com/subarumedia.iconicweb.com/mediasite/attachments/2022_WRX_Specs-FINAL.pdf",
      kind: "manufacturer"
    },
    {
      id: "src3",
      title: "Tested: 2022 Subaru WRX Limited Is True to Form",
      publisher: "Car and Driver (syndicated on Yahoo)",
      url: "https://news.yahoo.com/tested-2022-subaru-wrx-limited-110000024.html",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src3",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 5.5,
        quarterMileS: 13.9,
        quarterMileTrapMph: 101
      },
      conditions: {},
      match: "exact",
      verification: "Syndicated copy of the article (original page not reachable from this environment).",
      date: "2022"
    }
  ],
  dataGaps: [
    "Final drive (single listing)",
    "Tire size",
    "Drag coefficient",
    "Power/torque rpm detail"
  ],
  sim: buildSpec({
  id: "2022-subaru-wrx-limited-us-sedan-awd-6mt",
  make: "Subaru",
  model: "WRX",
  trim: "Limited",
  modelYear: 2022,
  market: "US",
  body: "Sedan",
  shortName: "Subaru WRX Limited"
}, {
    engine: { code: 'FA24F', description: '2.4 L turbo flat-4', displacementCc: 2387, aspiration: 'turbo', idleRpm: 750, redlineRpm: 6000, revLimitRpm: 6200, power: { value: 271, unit: 'hp', rpm: [5600, 5600] }, torque: { value: 258, unit: 'lb-ft', rpm: [2000, 5200] }, peakBoostBar: 1.2 },
    transmission: { type: 'manual', name: '6-speed manual', gearRatios: [3.455, 1.947, 1.367, 1.029, 0.825, 0.667], finalDrive: 4.111 },
    drivetrain: { layout: 'AWD', efficiency: 0.895, description: 'Symmetrical AWD, viscous-coupling centre differential (50:50 nominal)', frontShareRange: [0.4, 0.6] },
    chassis: { curbMassKg: 1538, frontWeightFraction: 0.6, wheelbaseM: 2.67, lengthMm: 4669, widthMm: 1826, heightMm: 1468 },
    aero: {},
    tires: { sizes: [square('r18', '245/40 R18', 245, 40, 18, 'Limited fitment (assumed)')], compound: 'oe-performance', gripScale: 1.0 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.00', status: 'estimated', source: 'A grip fit to the Car and Driver 0–60 mph 5.5 s needed no increase' },
      { parameter: 'Drivetrain efficiency', value: '89.5 %', status: 'estimated', source: 'Fitted to the Car and Driver ¼-mile trap 101 mph (manual gearboxes lose less than automatics)' },
      { parameter: 'Peak power', value: '271 hp @ 5,600', status: 'reported', source: 'Subaru specifications', url: 'https://s3.amazonaws.com/subarumedia.iconicweb.com/mediasite/attachments/2022_WRX_Specs-FINAL.pdf' },
      { parameter: 'Peak torque', value: '258 lb-ft @ 2,000–5,200 rpm', status: 'reported', source: 'Subaru specifications', url: 'https://s3.amazonaws.com/subarumedia.iconicweb.com/mediasite/attachments/2022_WRX_Specs-FINAL.pdf' },
      { parameter: 'Gear ratios', value: '3.455/1.947/1.367/1.029/0.825/0.667', status: 'verified', source: 'Subaru specifications', url: 'https://s3.amazonaws.com/subarumedia.iconicweb.com/mediasite/attachments/2022_WRX_Specs-FINAL.pdf' },
      { parameter: 'Final drive', value: '4.111', status: 'reported', source: 'Motor Matchup (4.11)', url: 'https://www.motormatchup.com/catalog/Subaru/WRX/2022/Limited-Manual' },
      { parameter: 'Curb mass', value: '3,390 lb (1,538 kg), Limited manual', status: 'reported', source: 'Subaru specifications', url: 'https://s3.amazonaws.com/subarumedia.iconicweb.com/mediasite/attachments/2022_WRX_Specs-FINAL.pdf' },
      { parameter: 'AWD split', value: 'Front share 0.40–0.60', status: 'estimated', source: 'Viscous centre coupling around a 50:50 split' },
      { parameter: 'Tire size', value: '245/40 R18', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
