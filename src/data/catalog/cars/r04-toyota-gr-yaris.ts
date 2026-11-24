import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #4: 2021 Toyota GR Yaris Circuit Pack (UK). */
export const entry: CatalogEntry = {
  id: "2021-toyota-gr-yaris-circuit-pack-uk-hatch-awd-6mt",
  roster: 4,
  section: "Hot hatches",
  make: "Toyota",
  model: "GR Yaris",
  trim: "Circuit Pack",
  modelYear: 2021,
  market: "UK",
  body: "Hatchback",
  bodyLabel: "3-door hatchback",
  chassisCode: "GXPA16",
  aliases: [
    "GR Yaris",
    "GXPA16",
    "GR-Four"
  ],
  origin: "Japan",
  usage: [
    "Hot Hatch",
    "Track"
  ],
  drive: "AWD",
  transmission: "MT",
  transmissionLabel: "6-speed manual",
  powertrain: "Petrol",
  engineLabel: "1.6 turbo I3 (G16E-GTS)",
  modelPath: "MT",
  factory: {
    power: "261 PS",
    torque: "360 Nm",
    curbMass: "1,280 kg",
    sourceId: "src-toy-ie"
  },
  sources: [
    {
      id: "test",
      title: "Toyota GR Yaris 2020–2024 road test",
      publisher: "Autocar",
      url: "https://d2km96w3x5blkf.cloudfront.net/car-review/toyota/gr-yaris-2020-2024",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "GR Yaris technical release",
      publisher: "Toyota GB",
      url: "https://media.toyota.co.uk/wp-content/uploads/sites/5/2021/03/1605890847201029MGRYarisFullRelease.pdf",
      kind: "manufacturer"
    },
    {
      id: "src-toy-ie",
      title: "GR Yaris specifications",
      publisher: "Toyota Ireland",
      url: "https://www.toyota.ie/discover-toyota/toyota-gazoo-racing/gr-yaris/specifications",
      kind: "manufacturer"
    },
    {
      id: "src3",
      title: "GR Yaris technical specifications",
      publisher: "Toyota UK",
      url: "https://media.toyota.co.uk/wp-content/uploads/sites/5/pdf/240704-GR-Yaris-Tech-Specs.pdf",
      kind: "manufacturer"
    },
    {
      id: "src4",
      title: "Toyota GR Yaris road test data",
      publisher: "The Citizen (ZA)",
      url: "https://www.citizen.co.za/wp-content/uploads/2021/10/Toyota-GR-Yaris-road-test-data.pdf",
      kind: "road-test"
    },
    {
      id: "src5",
      title: "Toyota GR Yaris review",
      publisher: "WhichCar (AU)",
      url: "https://www.whichcar.com.au/?p=524752",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "citizen",
      sourceId: "src4",
      publication: "The Citizen (ZA)",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo100KmhS: 5.32
      },
      conditions: {},
      match: "equivalent",
      verification: "Road-test data sheet (PDF) as summarised by search; not opened here.",
      date: "2021",
      deviation: "South African-market car; its rated output may differ from the UK 261 PS car."
    },
    {
      id: "whichcar",
      sourceId: "src5",
      publication: "WhichCar (AU)",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo100KmhS: 5.14
      },
      conditions: {},
      match: "equivalent",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      deviation: "Australian-market car (200 kW / 370 Nm rating), stronger than the UK 261 PS car; best run."
    },
    {
      id: "autocar",
      sourceId: "test",
      publication: "Autocar",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 5.2
      },
      conditions: {
        testMass: "1,283 kg as tested (kerb with fuel)",
        occupants: "Two",
        fuel: "Full tank",
        launchControl: "None (per the handoff; not confirmed in the reachable text)"
      },
      match: "equivalent",
      verification: "Original Autocar road test as summarised in the Codex inspection handoff, 2026-11 and by search; 0–60 mph is kept distinct from the 0–100 km/h tests.",
      date: "2020",
      deviation: "UK car; Circuit Pack fitment is not confirmed in the reachable text."
    }
  ],
  dataGaps: [
    "Gear ratios",
    "Torque rpm band",
    "AWD split range",
    "Drag coefficient",
    "Pre-facelift Toyota GB release: gear table, final drives and the 360 Nm band",
    "Autocar timing basis and Circuit Pack confirmation"
  ],
  notes: [
    "Market ratings differ (UK/IE 261 PS; other markets up to 272 PS); only the UK identity is modelled here."
  ],
  sim: buildSpec({
  id: "2021-toyota-gr-yaris-circuit-pack-uk-hatch-awd-6mt",
  make: "Toyota",
  model: "GR Yaris",
  trim: "Circuit Pack",
  modelYear: 2021,
  market: "UK",
  body: "Hatchback",
  shortName: "Toyota GR Yaris Circuit Pack"
}, {
    engine: { code: 'G16E-GTS', description: '1.6 L turbo I3', displacementCc: 1618, aspiration: 'turbo', idleRpm: 800, redlineRpm: 7000, revLimitRpm: 7200, power: { value: 261, unit: 'PS', rpm: [6500, 6500] }, torque: { value: 360, unit: 'Nm', rpm: [3000, 4600] }, peakBoostBar: 1.3 },
    transmission: { type: 'manual', name: '6-speed manual', gearRatios: [3.538, 2.238, 1.535, 1.162, 1.081, 0.902], finalDrive: [3.941, 3.941, 3.941, 3.941, 3.35, 3.35] },
    drivetrain: { layout: 'AWD', efficiency: 0.873, description: 'GR-Four coupling AWD with front and rear Torsen LSDs (Circuit Pack)', frontShareRange: [0.3, 0.6] },
    chassis: { curbMassKg: 1280, frontWeightFraction: 0.61, wheelbaseM: 2.56, lengthMm: 3995, widthMm: 1805, heightMm: 1455 },
    aero: {},
    tires: { sizes: [square('r18', '225/40 R18', 225, 40, 18, 'Michelin Pilot Sport 4S (Circuit Pack)')], compound: 'uhp', gripScale: 1.0 },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Final drive', value: '3.941 (1st–4th) / 3.350 (5th–6th)', status: 'estimated', source: 'From a 2024 (facelift-era) Toyota UK document; the pre-facelift Toyota GB release has not been checked', url: 'https://media.toyota.co.uk/wp-content/uploads/sites/5/pdf/240704-GR-Yaris-Tech-Specs.pdf' },
      { parameter: 'Tire grip calibration', value: '×1.00', status: 'estimated', source: 'Transferred from the GR Corolla fit (same engine, gearbox, AWD system and tire class)' },
      { parameter: 'Drivetrain efficiency', value: '87.3 %', status: 'estimated', source: 'Transferred from the GR Corolla fit' },
      { parameter: 'Peak power', value: '261 PS (DIN)', status: 'reported', source: 'Toyota Ireland specifications', url: 'https://www.toyota.ie/discover-toyota/toyota-gazoo-racing/gr-yaris/specifications' },
      { parameter: 'Peak torque', value: '360 Nm @ 3,000–4,600 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Gear ratios', value: '3.538/2.238/1.535/1.162/1.081/0.902', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '1,280 kg', status: 'reported', source: 'Toyota Ireland specifications', url: 'https://www.toyota.ie/discover-toyota/toyota-gazoo-racing/gr-yaris/specifications' },
      { parameter: 'AWD split', value: 'Front share 0.30–0.60', status: 'estimated', source: 'Published GR-Four mode splits (recalled)' },
      { parameter: 'Tire size', value: '225/40 R18', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
