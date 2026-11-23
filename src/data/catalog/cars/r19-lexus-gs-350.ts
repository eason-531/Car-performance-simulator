import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #19: 2016 Lexus GS 350 F Sport RWD (US). */
export const entry: CatalogEntry = {
  id: "2016-lexus-gs-350-f-sport-rwd-us-sedan-rwd-8at",
  roster: 19,
  section: "Luxury and sport sedans",
  make: "Lexus",
  model: "GS 350",
  trim: "F Sport RWD",
  modelYear: 2016,
  market: "US",
  body: "Sedan",
  bodyLabel: "Sedan",
  chassisCode: "L10 facelift",
  aliases: [
    "GS350",
    "L10"
  ],
  origin: "Japan",
  usage: [
    "Sport Sedan",
    "Luxury"
  ],
  drive: "RWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic",
  powertrain: "Petrol",
  engineLabel: "3.5 V6 (2GR-FKS)",
  modelPath: "Existing",
  factory: {
    power: "311 hp @ 6,400 rpm",
    torque: "280 lb-ft @ 4,800 rpm",
    curbMass: "3,726 lb",
    sourceId: "src3"
  },
  sources: [
    {
      id: "test",
      title: "2016 Lexus GS350 F Sport test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15104392/2016-lexus-gs350-f-sport-test-review/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "MY16 Lexus GS brochure (US)",
      publisher: "Lexus",
      url: "https://www.lexus.com/content/dam/lexus/documents/brochures/models/2016/MY16-Lexus-GS-and-Lexus-GS-Hybrid-Brochure.pdf",
      kind: "manufacturer"
    },
    {
      id: "src3",
      title: "2016 Lexus GS 200t and GS 350 product information",
      publisher: "Lexus (via Club Lexus)",
      url: "https://clublexus.com/forums/attachments/gs-4th-gen-2013-2020/371825d1444954104-finally-refresh-2016-gs-pics-2016_lexus_gs_200t_and_gs_350_product_information.pdf",
      kind: "manufacturer"
    },
    {
      id: "src4",
      title: "GS 350 F Sport RWD specifications",
      publisher: "TrueCar",
      url: "https://www.truecar.com/lexus/gs/2018/gs-350-f-sport-rwd/specs/",
      kind: "reference"
    },
    {
      id: "src5",
      title: "Car and Driver test of 2016 GS350 F Sport (forum quote)",
      publisher: "Club Lexus",
      url: "https://clublexus.com/forums/gs-4th-gen-2013-2020/816735-car-and-driver-test-2016-gs350-f-sport.html",
      kind: "road-test"
    },
    {
      id: "src6",
      title: "GS 350 0–60 times",
      publisher: "0-60specs",
      url: "https://www.0-60specs.com/lexus/gs-350-0-60-times",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "cd-2015",
      sourceId: "src5",
      publication: "Car and Driver (quoted)",
      timing: "unconfirmed",
      timingNote: "Car and Driver test published before its late-2019 move to a 1-ft rollout; the earlier procedure is not confirmed here, so both simulator bases are shown.",
      results: {
        zeroTo60MphS: 5.8
      },
      conditions: {
        other: [
          "Test car had about 600 miles on it"
        ]
      },
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment). Quoted on a forum, not read from Car and Driver directly.",
      date: "2015"
    },
    {
      id: "cd-quarter",
      sourceId: "src6",
      publication: "Car and Driver (as listed by 0-60specs)",
      timing: "unconfirmed",
      timingNote: "Car and Driver test published before its late-2019 move to a 1-ft rollout; the earlier procedure is not confirmed here, so both simulator bases are shown.",
      results: {
        quarterMileS: 14.3,
        quarterMileTrapMph: 101
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2015",
      deviation: "Attribution to Car and Driver comes from an aggregator and is not confirmed."
    }
  ],
  dataGaps: [
    "Car and Driver page itself (results only via forum/aggregator)",
    "8-speed gear ratios (AA80E family set used)",
    "Redline",
    "Drag coefficient",
    "Weight distribution"
  ],
  sim: buildSpec({
  id: "2016-lexus-gs-350-f-sport-rwd-us-sedan-rwd-8at",
  make: "Lexus",
  model: "GS 350",
  trim: "F Sport RWD",
  modelYear: 2016,
  market: "US",
  body: "Sedan",
  shortName: "Lexus GS 350 F Sport"
}, {
    engine: {
      code: '2GR-FKS', description: '3.5 L V6, D-4S direct + port injection', displacementCc: 3456, aspiration: 'na',
      idleRpm: 650, redlineRpm: 6600, revLimitRpm: 6800,
      power: { value: 311, unit: 'hp', rpm: [6400, 6400] },
      torque: { value: 280, unit: 'lb-ft', rpm: [4800, 4800] },
      lowEndFraction: 0.72,
    },
    transmission: {
      type: 'torque-converter-automatic', name: '8-speed automatic (Aisin AA80E family)',
      gearRatios: [4.596, 2.724, 1.863, 1.464, 1.231, 1.0, 0.824, 0.685], finalDrive: 2.937,
      upshiftTimeS: 0.35, torqueConverter: { stallRpm: 2300 },
    },
    drivetrain: { layout: 'RWD', efficiency: 0.838, description: 'Rear-wheel drive, open differential with VDIM' },
    chassis: { curbMassKg: 1690, frontWeightFraction: 0.52, wheelbaseM: 2.85, lengthMm: 4880, widthMm: 1840, heightMm: 1455 },
    aero: { dragCoefficient: 0.27 },
    tires: { sizes: [staggered('fsport', '235/40 R19 F · 265/35 R19 R', { widthMm: 235, aspectPct: 40, rimIn: 19 }, { widthMm: 265, aspectPct: 35, rimIn: 19 }, 'F Sport fitment')], compound: 'oe-performance' },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Drivetrain efficiency', value: '83.8 %', status: 'estimated', source: 'Fitted to the quoted ¼-mile trap 101 mph; 0–60 (5.70 vs 5.8 s) and ET (14.30 vs 14.3 s) held out' },
      { parameter: 'Peak power', value: '311 hp @ 6,400 rpm', status: 'reported', source: 'TrueCar, Edmunds', url: 'https://www.truecar.com/lexus/gs/2018/gs-350-f-sport-rwd/specs/' },
      { parameter: 'Peak torque', value: '280 lb-ft @ 4,800 rpm', status: 'reported', source: 'TrueCar, Edmunds', url: 'https://www.truecar.com/lexus/gs/2018/gs-350-f-sport-rwd/specs/' },
      { parameter: 'Gear ratios', value: '4.596/2.724/1.863/1.464/1.231/1.000/0.824/0.685', status: 'estimated', source: 'AA80E family ratios (verified on the IS); GS 350 application not confirmed — awaiting spec sheet' },
      { parameter: 'Final drive', value: '2.937', status: 'reported', source: 'Motor Matchup lists 2.94', url: 'https://www.motormatchup.com/catalog/Lexus/GS-350/2016/F-Sport-4DR-RWD-Sedan' },
      { parameter: 'Curb mass', value: '3,726 lb (1,690 kg)', status: 'verified', source: 'Lexus 2016 GS product information (GVWR 4,830 lb)', url: 'https://clublexus.com/forums/attachments/gs-4th-gen-2013-2020/371825d1444954104-finally-refresh-2016-gs-pics-2016_lexus_gs_200t_and_gs_350_product_information.pdf' },
      { parameter: 'Tire size', value: '235/40 R19 F, 265/35 R19 R', status: 'verified', source: 'Lexus 2016 GS product information', url: 'https://clublexus.com/forums/attachments/gs-4th-gen-2013-2020/371825d1444954104-finally-refresh-2016-gs-pics-2016_lexus_gs_200t_and_gs_350_product_information.pdf' },
      { parameter: 'Drag coefficient', value: 'Cd 0.27', status: 'estimated', source: 'Lexus has quoted ≈0.27 for this body; not verified' },
      { parameter: 'Dimensions', value: '4,880 × 1,840 × 1,455 mm, WB 2,850 mm', status: 'estimated', source: 'Recalled Lexus figures; not verified' },
    ],
  }),
};
