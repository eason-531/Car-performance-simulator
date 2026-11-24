import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #57: 2022 Hyundai Kona N Kona N (US). */
export const entry: CatalogEntry = {
  id: "2022-hyundai-kona-n-us-cuv-fwd-8dct",
  roster: 57,
  section: "SUVs and pickups",
  make: "Hyundai",
  model: "Kona N",
  trim: "Kona N",
  modelYear: 2022,
  market: "US",
  body: "Crossover",
  bodyLabel: "Crossover",
  chassisCode: "OS",
  aliases: [
    "Kona N",
    "OS"
  ],
  origin: "South Korea",
  usage: [
    "SUV",
    "Sport Compact"
  ],
  drive: "FWD",
  transmission: "DCT",
  transmissionLabel: "8-speed wet DCT",
  powertrain: "Petrol",
  engineLabel: "2.0 turbo I4 (Theta II)",
  modelPath: "Existing",
  factory: {
    power: "276 hp (286 hp overboost)",
    torque: "289 lb-ft",
    curbMass: "1,569 kg EU kerb (DCT); 3,340 lb US",
    zeroTo60MphS: 5.2,
    sourceId: "src3"
  },
  sources: [
    {
      id: "test",
      title: "2022 Hyundai Kona N first test",
      publisher: "MotorTrend",
      url: "https://www.motortrend.com/features/2022-hyundai-kona-n-0-60-mph-first-test-review",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "Tested: 2022 Hyundai Kona N",
      publisher: "Car and Driver (syndicated on Yahoo)",
      url: "https://autos.yahoo.com/tested-2022-hyundai-kona-n-110000366.html",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "Kona N technical specifications",
      publisher: "Hyundai Motor Europe",
      url: "https://cdn.uc.assets.prezly.com/de277550-9cc4-4278-9e71-b237625a0554/-/inline/no/KonaN-TechSpecs_ENG.pdf",
      kind: "manufacturer"
    },
    {
      id: "src4",
      title: "2022 Hyundai Kona N road test",
      publisher: "MotorWeek",
      url: "https://motorweek.org/road_tests/2022-hyundai-kona-n",
      kind: "road-test"
    },
    {
      id: "src5",
      title: "2022 Hyundai Kona N test drive review",
      publisher: "KSL Cars",
      url: "https://cars.ksl.com/resources/car-review/2022-hyundai-kona-n-test-drive-review",
      kind: "reference"
    },
    {
      id: "src-hyundai-eu",
      title: "Kona N technical specifications",
      publisher: "Hyundai Motor Europe",
      url: "https://www.hyundai.news/newsroom/dam/eu/models/20210715_kona_n_driving_experience/hyundai-kona-n-technical-specifications-0721.pdf",
      kind: "manufacturer"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src2",
      publication: "Car and Driver",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        quarterMileS: 13.4,
        quarterMileTrapMph: 105
      },
      conditions: {},
      match: "exact",
      verification: "Syndicated copy of the article (original page not reachable from this environment). The 0–60 time was not in the reachable text.",
      date: "2022"
    },
    {
      id: "cd-ksl",
      sourceId: "src5",
      publication: "Car and Driver (as cited by KSL Cars)",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 4.8
      },
      conditions: {},
      match: "exact",
      verification: "Second-hand citation in another review; not confirmed on the Car and Driver page.",
      date: "2022"
    },
    {
      id: "motorweek",
      sourceId: "src4",
      publication: "MotorWeek",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        quarterMileS: 13.7,
        quarterMileTrapMph: 107
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2022"
    }
  ],
  dataGaps: [
    "N DCT gear ratios 3rd–7th",
    "Weight distribution",
    "Drag coefficient",
    "Car and Driver 0–60 (only a second-hand citation)",
    "US gearbox code (to confirm the Hyundai Europe N DCT table applies)"
  ],
  notes: [
    "Hyundai Europe’s factory N DCT table gives 3.714/2.261/2.174/1.621/0.927/0.767/0.878/0.698 with 3.933 on 1st, 2nd, 5th, 6th and reverse and 2.810 on 3rd, 4th, 7th and 8th. Per the spec-sheet follow-up it is not applied until the US gearbox code is confirmed, so 3rd–7th remain interpolated here."
  ],
  sim: buildSpec({
  id: "2022-hyundai-kona-n-us-cuv-fwd-8dct",
  make: "Hyundai",
  model: "Kona N",
  trim: "Kona N",
  modelYear: 2022,
  market: "US",
  body: "Crossover",
  shortName: "Hyundai Kona N"
}, {
    engine: { code: 'Smartstream G2.0 T-GDi', description: '2.0 L turbo I4, flat power', displacementCc: 1998, aspiration: 'turbo', idleRpm: 750, redlineRpm: 6750, revLimitRpm: 6850, power: { value: 276, unit: 'hp', rpm: [5500, 6000] }, torque: { value: 289, unit: 'lb-ft', rpm: [2100, 4700] }, peakBoostBar: 1.4 },
    transmission: { type: 'dual-clutch', name: '8-speed wet N DCT', gearRatios: [3.71, 2.26, 2.46, 1.913, 1.063, 0.827, 0.9, 0.7], finalDrive: [3.933, 3.933, 2.81, 2.81, 3.933, 3.933, 2.81, 2.81], launchClutch: { launchRpm: 3300, brakeHoldRpmLimit: 3300 } },
    drivetrain: { layout: 'FWD', efficiency: 0.9, description: 'Front-wheel drive with electronic limited-slip differential (e-LSD)' },
    chassis: { curbMassKg: 1515, frontWeightFraction: 0.61, wheelbaseM: 2.6, lengthMm: 4215, widthMm: 1800, heightMm: 1565 },
    aero: {},
    tires: { sizes: [square('r19', '235/40 R19', 235, 40, 19, 'N fitment')], compound: 'uhp', gripScale: 1.24 },
    speedLimiterKmh: null,
    factory: { zeroTo60MphS: 5.2 },
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.24', status: 'estimated', source: 'Transferred from the Elantra N fit (same engine, N DCT and tire class)' },
      { parameter: 'Drivetrain efficiency', value: '90 %', status: 'estimated', source: 'Transferred from the Elantra N fit' },
      { parameter: 'Peak power', value: '276 hp @ 5,500–6,000 rpm (286 hp on overboost, not modelled)', status: 'reported', source: 'Hyundai rating (multiple reviews)', url: 'https://www.motor1.com/reviews/576275/2022-hyundai-kona-n-first-drive/' },
      { parameter: 'Peak torque', value: '289 lb-ft @ 2,100–4,700 rpm', status: 'reported', source: 'Hyundai rating (multiple reviews)', url: 'https://www.motor1.com/reviews/576275/2022-hyundai-kona-n-first-drive/' },
      { parameter: 'Final drives', value: '3.933 (1st, 2nd, 5th, 6th) / 2.810 (3rd, 4th, 7th, 8th)', status: 'reported', source: 'Hyundai Motor Europe technical specifications', url: 'https://cdn.uc.assets.prezly.com/de277550-9cc4-4278-9e71-b237625a0554/-/inline/no/KonaN-TechSpecs_ENG.pdf' },
      { parameter: 'Gear ratios', value: '3.71 / 2.26 / ≈0.70 (1st, 2nd, 8th)', status: 'reported', source: 'Hyundai Motor Europe technical specifications; Auto123 listing', url: 'https://cdn.uc.assets.prezly.com/de277550-9cc4-4278-9e71-b237625a0554/-/inline/no/KonaN-TechSpecs_ENG.pdf' },
      { parameter: 'Gear ratios 3rd–7th', value: '2.460/1.913/1.063/0.827/0.900', status: 'estimated', source: 'Overall ratios interpolated geometrically between 2nd and 8th — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '3,340 lb (1,515 kg)', status: 'reported', source: 'Car and Driver Lightning Lap listing', url: 'https://news.yahoo.com/2022-hyundai-kona-n-lightning-120000330.html' },
      { parameter: 'Tire size', value: '235/40 R19', status: 'reported', source: 'Auto Express / Cars.com specifications', url: 'https://www.cars.com/research/hyundai-kona_n-2022/specs' },
      { parameter: 'Weight distribution', value: '61 % front', status: 'estimated', source: 'Typical for this platform; no source found' },
    ],
  }),
};
