import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #11: 2021 Mazda Mazda3 2.5 Turbo Premium Plus (US). */
export const entry: CatalogEntry = {
  id: "2021-mazda-mazda3-2-5-turbo-premium-plus-us-hatch-awd-6at",
  roster: 11,
  section: "Daily and sport compacts",
  make: "Mazda",
  model: "Mazda3",
  trim: "2.5 Turbo Premium Plus",
  modelYear: 2021,
  market: "US",
  body: "Hatchback",
  bodyLabel: "5-door hatchback",
  chassisCode: "BP",
  aliases: [
    "Mazda 3",
    "Mazda3 Turbo",
    "BP"
  ],
  origin: "Japan",
  usage: [
    "Daily",
    "Sport Compact"
  ],
  drive: "AWD",
  transmission: "AT",
  transmissionLabel: "6-speed automatic",
  powertrain: "Petrol",
  engineLabel: "2.5 turbo I4 (Skyactiv-G 2.5T)",
  modelPath: "Existing",
  factory: {
    power: "250 hp @ 5,000 rpm on 93 octane (227 hp on 87)",
    torque: "320 lb-ft @ 2,500 rpm on 93 octane (310 lb-ft on 87)",
    curbMass: "3,374 lb",
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2021 Mazda 3 2.5T by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a34734612/2021-mazda-3-25t-by-the-numbers/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2021 Mazda3 2.5 Turbo press kit",
      publisher: "Mazda USA",
      url: "https://filecache.mediaroom.com/mr5mr_mazdausa2/219459/download/2021%20Mazda3%202.5%20Turbo%20Press%20Kit%5B2%5D.pdf",
      kind: "manufacturer"
    },
    {
      id: "src3",
      title: "2021 Mazda3 2.5 Turbo AWD hatchback",
      publisher: "Motor Matchup",
      url: "https://www.motormatchup.com/catalog/Mazda/Mazda3/2021/2.5-Turbo-AWD-Hatchback-(Basic-Fuel)",
      kind: "reference"
    },
    {
      id: "src4",
      title: "Review: 2021 Mazda 3 2.5T AWD",
      publisher: "Hagerty",
      url: "https://www.hagerty.com/media/?p=127816",
      kind: "road-test"
    },
    {
      id: "src5",
      title: "2021 Mazda3 2.5 T AWD Hatch review",
      publisher: "Motorway America",
      url: "https://www.motorwayamerica.com/editorial/2021-mazda3-25-t-awd-hatch-%E2%80%94-lots-missing-feel-alive-charm",
      kind: "road-test"
    }
  ],
  benchmarks: [
    {
      id: "cd-0-60",
      sourceId: "src4",
      publication: "Car and Driver (via Hagerty)",
      timing: "rollout-1ft",
      timingNote: "Car and Driver results since late 2019 subtract a 1-ft rollout.",
      results: {
        zeroTo60MphS: 5.6
      },
      conditions: {},
      match: "equivalent",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2020",
      deviation: "Figure quoted second-hand by Hagerty; body style and trim of the Car and Driver test car not confirmed."
    },
    {
      id: "mwa",
      sourceId: "src5",
      publication: "Motorway America",
      timing: "unconfirmed",
      timingNote: "Timing procedure of this publication is not confirmed.",
      results: {
        zeroTo60MphS: 5.9,
        quarterMileS: 14.5
      },
      conditions: {},
      match: "exact",
      verification: "Search-result summary of the article (page itself not reachable from this environment).",
      date: "2021",
      deviation: "Independent replacement for the unreachable Car and Driver page; AWD hatchback."
    }
  ],
  dataGaps: [
    "Car and Driver test page (quarter mile, trap, test weight)",
    "Tire size (215/45 R18 assumed)",
    "Redline",
    "Drag coefficient",
    "Wheelbase/dimensions (recalled)"
  ],
  sim: buildSpec({
  id: "2021-mazda-mazda3-2-5-turbo-premium-plus-us-hatch-awd-6at",
  make: "Mazda",
  model: "Mazda3",
  trim: "2.5 Turbo Premium Plus",
  modelYear: 2021,
  market: "US",
  body: "Hatchback",
  shortName: "Mazda3 Turbo AWD"
}, {
    engine: {
      code: 'Skyactiv-G 2.5T (PY-VPTS)', description: '2.5 L turbo I4, cylinder deactivation', displacementCc: 2488, aspiration: 'turbo',
      idleRpm: 650, redlineRpm: 6000, revLimitRpm: 6200,
      power: { value: 250, unit: 'hp', rpm: [5000, 5000] },
      torque: { value: 320, unit: 'lb-ft', rpm: [2500, 2500] },
      peakBoostBar: 1.2, lowEndFraction: 0.6, topEndPowerFraction: 0.88,
    },
    transmission: {
      type: 'torque-converter-automatic', name: '6-speed Skyactiv-Drive automatic',
      gearRatios: [3.49, 1.99, 1.45, 1.0, 0.71, 0.6], finalDrive: 3.58,
      torqueConverter: { stallRpm: 2600, lockupMinGear: 2 },
    },
    drivetrain: { layout: 'AWD', description: 'i-Activ AWD (on-demand, front-biased)', frontShareRange: [0.5, 1] },
    chassis: { curbMassKg: 1530, wheelbaseM: 2.725, lengthMm: 4460, widthMm: 1795, heightMm: 1435 },
    aero: {},
    tires: { sizes: [square('r18', '215/45 R18', 215, 45, 18, 'Premium Plus fitment (assumed)')], compound: 'oe-performance' },
    speedLimiterKmh: null,
    provenance: [
      { parameter: 'Peak power', value: '250 hp @ 5,000 rpm (93 octane)', status: 'reported', source: 'Mazda press kit; Motor Matchup', url: 'https://filecache.mediaroom.com/mr5mr_mazdausa2/219459/download/2021%20Mazda3%202.5%20Turbo%20Press%20Kit%5B2%5D.pdf' },
      { parameter: 'Peak torque', value: '320 lb-ft @ 2,500 rpm (93 octane)', status: 'reported', source: 'Mazda press kit', url: 'https://filecache.mediaroom.com/mr5mr_mazdausa2/219459/download/2021%20Mazda3%202.5%20Turbo%20Press%20Kit%5B2%5D.pdf' },
      { parameter: 'Fuel', value: '93 octane rating modelled', status: 'reported', source: 'Mazda rates 227 hp / 310 lb-ft on 87 octane', url: 'https://filecache.mediaroom.com/mr5mr_mazdausa2/219459/download/2021%20Mazda3%202.5%20Turbo%20Press%20Kit%5B2%5D.pdf' },
      { parameter: 'Gear ratios', value: '3.49/1.99/1.45/1.00/0.71/0.60', status: 'reported', source: 'Motor Matchup specification table', url: 'https://www.motormatchup.com/catalog/Mazda/Mazda3/2021/2.5-Turbo-AWD-Hatchback-(Basic-Fuel)' },
      { parameter: 'Final drive', value: '3.58', status: 'reported', source: 'Motor Matchup; auto123', url: 'https://www.motormatchup.com/catalog/Mazda/Mazda3/2021/2.5-Turbo-AWD-Hatchback-(Basic-Fuel)' },
      { parameter: 'Curb mass', value: '3,374 lb (1,530 kg)', status: 'reported', source: 'Motor Matchup AWD hatchback listing', url: 'https://www.motormatchup.com/catalog/Mazda/Mazda3/2021/2.5-Turbo-AWD-Hatchback-(Basic-Fuel)' },
      { parameter: 'Dimensions', value: '4,460 × 1,795 × 1,435 mm, WB 2,725 mm', status: 'estimated', source: 'Recalled Mazda figures; not verified' },
      { parameter: 'Tire size', value: '215/45 R18', status: 'estimated', source: 'Turbo hatchback fitment as commonly listed; not verified' },
    ],
  }),
};
