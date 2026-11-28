import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

const MBUSA = 'https://media.mbusa.com/releases/amg-e-class-wagon-an-american-tradition';

/** Roster #34: 2018 Mercedes-AMG E 63 S Wagon 4MATIC+ (US). */
export const entry: CatalogEntry = {
  id: "2018-mercedes-amg-e-63-s-wagon-4matic-us-wagon-awd-9mct",
  roster: 34,
  section: "Wagons",
  make: "Mercedes-AMG",
  model: "E 63 S Wagon",
  trim: "4MATIC+",
  modelYear: 2018,
  market: "US",
  body: "Wagon",
  bodyLabel: "Wagon",
  chassisCode: "S213",
  aliases: [
    "E63",
    "AMG",
    "S213",
    "Mercedes"
  ],
  origin: "Germany",
  usage: [
    "Wagon",
    "Grand Tourer"
  ],
  drive: "AWD",
  transmission: "MCT",
  transmissionLabel: "9-speed AMG MCT (wet start-off clutch)",
  powertrain: "Petrol",
  engineLabel: "4.0 twin-turbo V8 (M177)",
  modelPath: "MCT",
  factory: {
    power: "603 hp",
    torque: "627 lb-ft",
    curbMass: "4,669 lb (listing)",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2018 Mercedes-AMG E63 S wagon test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a19056498/2018-mercedes-amg-e63-s-wagon-test-review/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2018 Mercedes-AMG E 63 S Wagon quick spin",
      publisher: "Autoblog",
      url: "https://www.autoblog.com/2018/06/29/2018-mercedes-amg-e-63-s-wagon-review-quick-spin/",
      kind: "reference"
    },
    {
      id: "src3",
      title: "AMG E-Class Wagon: An American Tradition",
      publisher: "Mercedes-Benz USA",
      url: "https://media.mbusa.com/releases/amg-e-class-wagon-an-american-tradition",
      kind: "manufacturer"
    }
  ],
  benchmarks: [],
  dataGaps: [
    "Car and Driver 2018 E 63 S wagon test (roster source) — the model is uncalibrated without it",
    "MCT launch rpm and shift timing (estimated)",
    "Power and torque rpm bands, dimensions (recalled)",
    "Curb mass",
    "Tire size",
    "Drag coefficient"
  ],
  notes: [
    "A Mercedes-Benz USA release quotes Car and Driver at 4.1 s to 60 mph and 12.5 s @ 114 mph, but that page may describe an earlier-generation wagon (C/D measured 3.0 s for the 2018 E 63 S sedan), so it is not transcribed.",
    "Mercedes-Benz USA: 9-speed MCT 5.35/3.24/2.25/1.64/1.21/1.00/0.86/0.72/0.60, final drive 3.06.",
    "Playable on estimates with no benchmark: no instrumented test of this exact wagon is transcribed, so grip and drivetrain efficiency stay at their defaults and the result is uncalibrated. The MCT runs as a planetary automatic with a wet start-off clutch (clutch-slip launch and creep, power-on shifts)."
  ],
  sim: buildSpec({
  id: "2018-mercedes-amg-e-63-s-wagon-4matic-us-wagon-awd-9mct",
  make: "Mercedes-AMG",
  model: "E 63 S Wagon",
  trim: "4MATIC+",
  modelYear: 2018,
  market: "US",
  body: "Wagon",
  shortName: "AMG E 63 S Wagon"
}, {
    engine: { code: 'M177', description: '4.0 L twin-turbo V8', displacementCc: 3982, aspiration: 'twin-turbo', idleRpm: 700, redlineRpm: 6500, revLimitRpm: 7000, power: { value: 603, unit: 'hp', rpm: [5750, 6500] }, torque: { value: 627, unit: 'lb-ft', rpm: [2500, 4500] }, peakBoostBar: 1.3 },
    transmission: { type: 'multi-clutch', name: 'AMG SPEEDSHIFT MCT 9G (wet start-off clutch)', gearRatios: [5.35, 3.24, 2.25, 1.64, 1.21, 1.0, 0.86, 0.72, 0.6], finalDrive: 3.06, launchClutch: { launchRpm: 3500, brakeHoldRpmLimit: 3500 } },
    drivetrain: { layout: 'AWD', frontShareRange: [0, 0.5], description: '4MATIC+ fully variable AWD (rear-biased, electromechanical front clutch)' },
    chassis: { curbMassKg: 2118, wheelbaseM: 2.939, lengthMm: 4995, widthMm: 1907, heightMm: 1469 },
    aero: {},
    tires: { sizes: [staggered('r20', '265/35 R20 front, 295/30 R20 rear', { widthMm: 265, aspectPct: 35, rimIn: 20 }, { widthMm: 295, aspectPct: 30, rimIn: 20 }, 'Assumed standard 20-inch fitment')], compound: 'uhp' },
    speedLimiterKmh: 250,
    factory: {},
    provenance: [
      { parameter: 'Peak power', value: '603 hp; rpm band 5,750–6,500 assumed', status: 'reported', source: 'US rating as transcribed in this entry (Autoblog); the rpm band is recalled, not verified' },
      { parameter: 'Peak torque', value: '627 lb-ft; 2,500–4,500 rpm assumed', status: 'reported', source: 'US rating as transcribed in this entry; the rpm band is recalled, not verified' },
      { parameter: 'Gear ratios', value: '5.35/3.24/2.25/1.64/1.21/1.00/0.86/0.72/0.60', status: 'reported', source: 'Mercedes-Benz USA release as transcribed in this entry; the page returned HTTP 404 on 2026-11-28', url: MBUSA },
      { parameter: 'Final drive', value: '3.06', status: 'reported', source: 'Mercedes-Benz USA release as transcribed in this entry (404 on 2026-11-28)', url: MBUSA },
      { parameter: 'MCT behaviour', value: 'Clutch-slip launch at ≈ 3,500 rpm and creep; power-on shifts 0.20 s up / 0.30 s down with the torque held at 35 % during the change', status: 'estimated', source: 'AMG publishes a wet start-off clutch in place of a torque converter but no launch or shift timing' },
      { parameter: 'Curb mass', value: '2,118 kg (4,669 lb listing)', status: 'reported', source: 'Listing as transcribed in this entry' },
      { parameter: 'AWD split', value: 'Front share 0–50 % (rear-biased)', status: 'estimated', source: '4MATIC+ is fully variable; the range is not published' },
      { parameter: 'Tire size', value: '265/35 R20 front, 295/30 R20 rear', status: 'estimated', source: 'Recalled; not verified from a reachable source' },
      { parameter: 'Dimensions', value: '4,995 × 1,907 × 1,469 mm, WB 2,939 mm', status: 'estimated', source: 'Recalled published figures; not verified from a reachable source' },
      { parameter: 'Speed limiter', value: '250 km/h', status: 'estimated', source: 'Typical AMG governed speed; the US limit by package is not transcribed' },
      { parameter: 'Calibration', value: 'Grip ×1.0 and default drivetrain efficiency (not fitted)', status: 'estimated', source: 'No instrumented test of this exact configuration is transcribed (the Car and Driver wagon test page was not reachable on 2026-11-28)' },
    ],
  }),
};
