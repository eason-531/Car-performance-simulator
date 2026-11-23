import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #32: 2021 Škoda Octavia Combi RS 2.0 TSI DSG (DE). */
export const entry: CatalogEntry = {
  id: "2021-skoda-octavia-combi-rs-2-0-tsi-dsg-de-wagon-fwd-7dct",
  roster: 32,
  section: "Wagons",
  make: "Škoda",
  model: "Octavia Combi",
  trim: "RS 2.0 TSI DSG",
  modelYear: 2021,
  market: "DE",
  body: "Wagon",
  bodyLabel: "Wagon (Combi)",
  chassisCode: "NX",
  aliases: [
    "Octavia RS",
    "vRS",
    "NX",
    "Skoda"
  ],
  origin: "Czechia",
  usage: [
    "Wagon",
    "Daily",
    "Sport Compact"
  ],
  drive: "FWD",
  transmission: "DCT",
  transmissionLabel: "7-speed DSG",
  powertrain: "Petrol",
  engineLabel: "2.0 turbo I4 (EA888 evo4, 180 kW)",
  modelPath: "Existing",
  factory: {
    power: "245 PS (180 kW)",
    torque: "370 Nm",
    zeroTo100KmhS: 6.7,
    topSpeed: "250 km/h",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "Škoda Octavia Combi RS test",
      publisher: "Auto Zeitung",
      url: "https://www.autozeitung.de/skoda-octavia-combi-rs-test-199702.html",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Škoda Octavia Combi RS 2.0 TSI DSG data",
      publisher: "ADAC Autokatalog",
      url: "https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/skoda/octavia/4generation/315157",
      kind: "reference"
    },
    {
      id: "src3",
      title: "DQ381 transmission specs",
      publisher: "Arteon Forums",
      url: "https://www.arteonforums.com/threads/vw-arteon-dsg381-transmission-specs-usa-builds.1510/",
      kind: "reference"
    }
  ],
  benchmarks: [
    {
      id: "az",
      sourceId: "test",
      publication: "Auto Zeitung",
      timing: "standing-start",
      timingNote: "European instrumented test from standstill (no rollout).",
      results: {
        zeroTo100KmhS: 6.4
      },
      conditions: {
        testMass: "1,553 kg measured curb weight (517 kg payload)"
      },
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2021-03"
    }
  ],
  dataGaps: [
    "Auto Zeitung intermediate splits and conditions",
    "DSG gear ratios and final drives (DQ381 family set used)",
    "Power/torque rpm bands",
    "Tire size (225/40 R18 assumed)",
    "Drag coefficient (Škoda publishes one; not reachable)"
  ],
  sim: buildSpec({
  id: "2021-skoda-octavia-combi-rs-2-0-tsi-dsg-de-wagon-fwd-7dct",
  make: "Škoda",
  model: "Octavia Combi",
  trim: "RS 2.0 TSI DSG",
  modelYear: 2021,
  market: "DE",
  body: "Wagon",
  shortName: "Škoda Octavia RS Combi"
}, {
    engine: {
      code: 'EA888 evo4 (DNPA)', description: '2.0 TSI turbo I4, 180 kW', displacementCc: 1984, aspiration: 'turbo',
      idleRpm: 750, redlineRpm: 6500, revLimitRpm: 6700,
      power: { value: 245, unit: 'PS', rpm: [5000, 6500] },
      torque: { value: 370, unit: 'Nm', rpm: [1600, 4300] },
      peakBoostBar: 1.2,
    },
    transmission: {
      type: 'dual-clutch', name: '7-speed DSG (DQ381 family)',
      gearRatios: [3.188, 2.19, 1.517, 1.057, 0.738, 0.557, 0.433], finalDrive: 4.176,
      launchClutch: { launchRpm: 3200, brakeHoldRpmLimit: 3200 },
    },
    drivetrain: { layout: 'FWD', description: 'Front-wheel drive with VAQ electronic limited-slip differential' },
    chassis: { curbMassKg: 1553, frontWeightFraction: 0.6, wheelbaseM: 2.686, lengthMm: 4689, widthMm: 1829, heightMm: 1457 },
    aero: { dragCoefficient: 0.3 },
    tires: { sizes: [square('r18', '225/40 R18', 225, 40, 18, 'RS standard fitment (assumed)'), square('r19', '225/35 R19', 225, 35, 19, 'Optional 19-inch')], compound: 'oe-performance', gripScale: 1.26 },
    speedLimiterKmh: 250,
    factory: { zeroTo100S: 6.7, topSpeedKmh: 250 },
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.26', status: 'estimated', source: 'Fitted to the Auto Zeitung measured 0–100 km/h of 6.4 s (sim 6.39 s); no held-out metric published' },
      { parameter: 'Peak power', value: '245 PS (180 kW)', status: 'verified', source: 'ADAC data sheet; Auto Zeitung test', url: 'https://www.adac.de/rund-ums-fahrzeug/autokatalog/marken-modelle/skoda/octavia/4generation/315157' },
      { parameter: 'Peak torque', value: '370 Nm', status: 'verified', source: 'Auto Zeitung test data', url: 'https://www.autozeitung.de/skoda-octavia-combi-rs-test-199702.html' },
      { parameter: 'Power / torque bands', value: '5,000–6,500 / 1,600–4,300 rpm', status: 'estimated', source: 'Recalled Škoda figures; not verified' },
      { parameter: 'Gear ratios', value: '3.188/2.190/1.517/1.057/0.738/0.557/0.433', status: 'estimated', source: 'DQ381 (0GC) family ratios from a forum spec table; the application-specific set is not published in a reachable source — awaiting spec sheet', url: 'https://www.arteonforums.com/threads/vw-arteon-dsg381-transmission-specs-usa-builds.1510/' },
      { parameter: 'Final drive', value: '4.176', status: 'estimated', source: 'DQ381 family value (3.611 or 4.176 by model); application not confirmed', url: 'https://www.arteonforums.com/threads/vw-arteon-dsg381-transmission-specs-usa-builds.1510/' },
      { parameter: 'Curb mass', value: '1,553 kg (measured)', status: 'verified', source: 'Auto Zeitung measured curb weight', url: 'https://www.autozeitung.de/skoda-octavia-combi-rs-test-199702.html' },
      { parameter: 'Drag coefficient', value: 'Cd 0.30', status: 'estimated', source: 'Typical for the NX Combi; Škoda figure not reachable' },
      { parameter: 'Dimensions', value: '4,689 × 1,829 × 1,457 mm, WB 2,686 mm', status: 'estimated', source: 'Recalled Škoda figures; not verified' },
    ],
  }),
};
