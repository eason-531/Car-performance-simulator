import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

const MT = 'https://www.motortrend.com/reviews/2021-porsche-macan-gts-first-test-review';
const PUS = 'https://download.newsroom.porsche.com/dam/jcr%3A345230e8-84c0-47c8-9c9f-864353db1751/2020_Macan_Technical_Data.pdf';
/** Not traction-limited in the model, so grip stays at 1; efficiency fitted to the MotorTrend trap. */
const GRIP_MACAN = 1;
const EFF_MACAN = 0.92;
const SENS_MACAN = '0–60 mph 3.96 s, ¼ mile 12.62 s @ 107.6 mph (1-ft rollout) against 3.96 s and 12.53 s @ 108.0 mph with 4.67 — the MotorTrend test cannot tell the two apart';

/** Roster #60: 2021 Porsche Macan GTS (US). */
export const entry: CatalogEntry = {
  id: "2021-porsche-macan-gts-us-suv-awd-7dct",
  roster: 60,
  section: "SUVs and pickups",
  make: "Porsche",
  model: "Macan",
  trim: "GTS",
  modelYear: 2021,
  market: "US",
  body: "SUV",
  bodyLabel: "SUV",
  chassisCode: "95B facelift",
  aliases: [
    "Macan GTS",
    "95B"
  ],
  origin: "Germany",
  usage: [
    "SUV"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "7-speed PDK",
  powertrain: "Petrol",
  engineLabel: "2.9 twin-turbo V6",
  modelPath: "Existing",
  factory: {
    power: "375 hp",
    torque: "383 lb-ft @ 1,750–5,000 rpm",
    zeroTo60MphS: 4.5,
    sourceId: "src-porsche-us"
  },
  sources: [
    {
      id: "test",
      title: "2021 Porsche Macan GTS first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/reviews/2021-porsche-macan-gts-first-test-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2021 Porsche Macan GTS first test (reproduced data table)",
      publisher: "ccstartup.com (MotorTrend repost)",
      url: "https://ccstartup.com/blog/2021/02/15/2021-porsche-macan-gts-first-test-porsches-compact-cannon/",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "Porsche Macan GTS technical data",
      publisher: "Porsche Newsroom",
      url: "https://download.newsroom.porsche.com/dam/jcr:2d37daf0-4a15-4a3b-810b-f3c4b4a72c76/PAG_MacanGTS_TD_EN.pdf",
      kind: "manufacturer"
    },
    {
      id: "src4",
      title: "Tested: 2022 Porsche Macan GTS Is the One to Get",
      publisher: "Car and Driver (syndicated on Yahoo)",
      url: "https://autos.yahoo.com/2022-porsche-macan-gts-one-220100188.html",
      kind: "road-test"
    },
    {
      id: "src-porsche-us",
      title: "Macan technical data (pre-facelift, US)",
      publisher: "Porsche",
      url: "https://download.newsroom.porsche.com/dam/jcr%3A345230e8-84c0-47c8-9c9f-864353db1751/2020_Macan_Technical_Data.pdf",
      kind: "manufacturer"
    }
  ],
  benchmarks: [
    {
      id: "mt",
      sourceId: "src2",
      publication: "MotorTrend",
      timing: "rollout-1ft",
      timingNote: "MotorTrend subtracts a 1-ft rollout from its acceleration times.",
      results: {
        zeroTo60MphS: 3.9,
        quarterMileS: 12.6,
        quarterMileTrapMph: 107.8
      },
      conditions: {
        testMass: "4,479 lb (55/45)"
      },
      match: "exact",
      verification: "Original test as transcribed in the owner-supplied spec-sheet follow-up, 2026-11; the 375 hp GTS.",
      date: "2021"
    }
  ],
  dataGaps: [
    "US axle ratio (4.67 EU vs 4.13 US listing; 4.67 modelled)",
    "Power rpm band, tire size and dimensions (recalled; Porsche sheets not re-read)",
    "Tire size",
    "Drag coefficient"
  ],
  notes: [
    "PDK ratios 3.69/2.15/1.41/1.03/0.79/0.63/0.52 (Porsche US and EU pre-facelift sheets agree).",
    "The 2022 facelift GTS (440 PS) is a different engine rating, so its tests and data are not used for this MY2021 car.",
    "Playable on a bounded estimate: the axle ratio follows Porsche's EU sheet (4.67); the US database's 4.13 is the other bound (see the final-drive row). The Porsche download host was not reachable on 2026-11-28, so the sheets were not re-read."
  ],
  sim: buildSpec({
  id: "2021-porsche-macan-gts-us-suv-awd-7dct",
  make: "Porsche",
  model: "Macan",
  trim: "GTS",
  modelYear: 2021,
  market: "US",
  body: "SUV",
  shortName: "Porsche Macan GTS"
}, {
    engine: { code: 'DCU (EA839 2.9 TT)', description: '2.9 L twin-turbo V6', displacementCc: 2894, aspiration: 'twin-turbo', idleRpm: 700, redlineRpm: 6700, revLimitRpm: 6800, power: { value: 375, unit: 'hp', rpm: [5200, 6700] }, torque: { value: 383, unit: 'lb-ft', rpm: [1750, 5000] }, peakBoostBar: 1.2 },
    transmission: { type: 'dual-clutch', name: '7-speed PDK', gearRatios: [3.69, 2.15, 1.41, 1.03, 0.79, 0.63, 0.52], finalDrive: 4.67, launchClutch: { launchRpm: 4000, brakeHoldRpmLimit: 4000 } },
    drivetrain: { layout: 'AWD', efficiency: EFF_MACAN, frontShareRange: [0, 0.5], description: 'Porsche Traction Management: rear drive with an electronically controlled multi-plate front clutch' },
    chassis: { curbMassKg: 2032, frontWeightFraction: 0.55, wheelbaseM: 2.807, lengthMm: 4686, widthMm: 1926, heightMm: 1609 },
    aero: {},
    tires: { sizes: [staggered('r20', '265/45 R20 front, 295/40 R20 rear', { widthMm: 265, aspectPct: 45, rimIn: 20 }, { widthMm: 295, aspectPct: 40, rimIn: 20 }, 'Assumed standard 20-inch GTS fitment')], compound: 'uhp', gripScale: GRIP_MACAN },
    speedLimiterKmh: null,
    factory: { zeroTo60MphS: 4.5, topSpeedKmh: 261 },
    provenance: [
      { parameter: 'Peak power', value: '375 hp; rpm band 5,200–6,700 assumed', status: 'estimated', source: 'US rating (Porsche US sheet, as transcribed in this entry); the rpm band is recalled, not re-read (Porsche download host not reachable 2026-11-28)', url: PUS },
      { parameter: 'Peak torque', value: '383 lb-ft @ 1,750–5,000 rpm', status: 'reported', source: 'Porsche US pre-facelift technical data, as transcribed in this entry (not re-read 2026-11-28)', url: PUS },
      { parameter: 'Gear ratios', value: '3.69/2.15/1.41/1.03/0.79/0.63/0.52', status: 'reported', source: 'Porsche US and EU pre-facelift sheets (agreeing), as transcribed in this entry; not re-read 2026-11-28', url: PUS },
      { parameter: 'Final drive', value: '4.67 (EU sheet); 4.13 in a US MY2021 database', status: 'estimated', source: `Bounded estimate: the manufacturer's EU value is modelled for the US car. Sensitivity with 4.13: ${SENS_MACAN}` },
      { parameter: 'Curb mass', value: '2,032 kg (4,479 lb MotorTrend test mass, 55/45)', status: 'reported', source: 'MotorTrend test as transcribed in this entry', url: MT },
      { parameter: 'Weight distribution', value: '55 % front', status: 'reported', source: 'MotorTrend test mass split', url: MT },
      { parameter: 'Tire size', value: '265/45 R20 front, 295/40 R20 rear', status: 'estimated', source: 'Recalled standard GTS fitment; not verified from a reachable source' },
      { parameter: 'Dimensions', value: '4,686 × 1,926 × 1,609 mm, WB 2,807 mm', status: 'estimated', source: 'Recalled published figures; not verified from a reachable source' },
      { parameter: 'AWD split', value: 'Front share 0–50 % (rear-biased)', status: 'estimated', source: 'Porsche Traction Management sends drive to the rear and adds the front through a clutch; the exact range is not published' },
      { parameter: 'Tire grip calibration', value: `×${GRIP_MACAN}`, status: 'estimated', source: 'Not fitted: the modelled launch is not traction-limited (0–60 mph 3.94–3.96 s against MotorTrend 3.9 s at any grip from 1.0 to 1.2)' },
      { parameter: 'Drivetrain efficiency', value: `${Math.round(EFF_MACAN * 1000) / 10} %`, status: 'estimated', source: 'Fitted to the MotorTrend ¼-mile trap 107.8 mph (sim 12.53 s @ 108.0 mph, 0–60 3.96 s, 1-ft rollout). High for an AWD dual-clutch, so the 375 hp rating is probably conservative' },
    ],
  }),
};
