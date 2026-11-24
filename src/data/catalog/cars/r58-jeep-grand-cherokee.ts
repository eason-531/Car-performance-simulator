import { buildSpec, square } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #58: 2018 Jeep Grand Cherokee Trackhawk (US). */
export const entry: CatalogEntry = {
  id: "2018-jeep-grand-cherokee-trackhawk-us-suv-awd-8at",
  roster: 58,
  section: "SUVs and pickups",
  make: "Jeep",
  model: "Grand Cherokee",
  trim: "Trackhawk",
  modelYear: 2018,
  market: "US",
  body: "SUV",
  bodyLabel: "SUV",
  chassisCode: "WK2",
  aliases: [
    "Trackhawk",
    "WK2"
  ],
  origin: "United States",
  usage: [
    "SUV",
    "Muscle"
  ],
  drive: "AWD",
  transmission: "AT",
  transmissionLabel: "8-speed automatic",
  powertrain: "Petrol",
  engineLabel: "6.2 supercharged V8 (Hellcat)",
  modelPath: "Existing",
  factory: {
    power: "707 hp",
    torque: "645 lb-ft",
    zeroTo60MphS: 3.5,
    sourceId: "src2"
  },
  sources: [
    {
      id: "test",
      title: "2018 Jeep Grand Cherokee Trackhawk test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15078588/2018-jeep-grand-cherokee-trackhawk-full-test-review/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2018 Jeep Grand Cherokee Trackhawk",
      publisher: "Car and Driver (syndicated on Yahoo)",
      url: "https://autos.yahoo.com/2018-jeep-grand-cherokee-trackhawk-194500054.html",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "Trackhawk new-dad review",
      publisher: "The Drive",
      url: "https://www.thedrive.com/new-cars/24360/2018-jeep-grand-cherokee-trackhawk-new-dad-review-family-hauler-and-drag-strip-monster-all-in-one",
      kind: "reference"
    },
    {
      id: "src-fca",
      title: "2018 Grand Cherokee Trackhawk specifications",
      publisher: "FCA US",
      url: "https://s3.amazonaws.com/chryslermedia.iconicweb.com/mediasite/specs/2018_JP_GrCherokee_Trackhawk_SP10kge6g0tjfo0bkv87ru3cehu4.pdf",
      kind: "manufacturer"
    }
  ],
  benchmarks: [
    {
      id: "cd",
      sourceId: "src2",
      publication: "Car and Driver",
      timing: "unconfirmed",
      timingNote: "Car and Driver test published before its late-2019 move to a 1-ft rollout; the earlier procedure is not confirmed here, so both simulator bases are shown.",
      results: {
        quarterMileS: 12.0,
        quarterMileTrapMph: 115
      },
      conditions: {
        testMass: "5,258 lb"
      },
      match: "exact",
      verification: "Syndicated copy of the article (original page not reachable from this environment). Jeep claims 11.6 s.",
      date: "2017"
    },
    {
      id: "cd-drive",
      sourceId: "src3",
      publication: "Car and Driver (as cited by The Drive)",
      timing: "unconfirmed",
      timingNote: "Car and Driver test published before its late-2019 move to a 1-ft rollout; the earlier procedure is not confirmed here, so both simulator bases are shown.",
      results: {
        zeroTo60MphS: 3.5
      },
      conditions: {},
      match: "exact",
      verification: "Second-hand citation; the Car and Driver 0–60 time was not in the reachable text.",
      date: "2017"
    }
  ],
  dataGaps: [
    "Car and Driver 0–60 (only a second-hand citation)",
    "8HP95 ratios",
    "Power/torque rpm",
    "AWD split range",
    "Tire size",
    "Mode-specific torque splits (in the FCA sheet; not transcribed)"
  ],
  sim: buildSpec({
  id: "2018-jeep-grand-cherokee-trackhawk-us-suv-awd-8at",
  make: "Jeep",
  model: "Grand Cherokee",
  trim: "Trackhawk",
  modelYear: 2018,
  market: "US",
  body: "SUV",
  shortName: "Jeep Grand Cherokee Trackhawk"
}, {
    engine: { code: 'Hellcat HEMI', description: '6.2 L supercharged V8', displacementCc: 6166, aspiration: 'supercharged', idleRpm: 700, redlineRpm: 6200, revLimitRpm: 6400, power: { value: 707, unit: 'hp', rpm: [6000, 6000] }, torque: { value: 645, unit: 'lb-ft', rpm: [4800, 4800] }, peakBoostBar: 0.8, spoolScale: 0.25 },
    transmission: { type: 'torque-converter-automatic', name: 'TorqueFlite 8HP95 8-speed automatic', gearRatios: [4.71, 3.14, 2.1, 1.67, 1.29, 1.0, 0.84, 0.67], finalDrive: 3.7, upshiftTimeS: 0.25, shiftTorqueDip: 0.35, torqueConverter: { stallRpm: 2600 } },
    drivetrain: { layout: 'AWD', description: 'Quadra-Trac active transfer case (40:60 default, 30:70 Track)', frontShareRange: [0.3, 0.5] },
    chassis: { curbMassKg: 2385, frontWeightFraction: 0.55, wheelbaseM: 2.915, lengthMm: 4846, widthMm: 1954, heightMm: 1749 },
    aero: { dragCoefficient: 0.37, frontalAreaM2: 2.93 },
    tires: { sizes: [square('r20', '295/45 R20', 295, 45, 20, 'Pirelli P Zero (assumed)')], compound: 'uhp' },
    speedLimiterKmh: null,
    factory: { zeroTo60MphS: 3.5 },
    provenance: [
      { parameter: 'Final drive', value: '3.70 front and rear', status: 'verified', source: 'FCA US Trackhawk technical sheet (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://s3.amazonaws.com/chryslermedia.iconicweb.com/mediasite/specs/2018_JP_GrCherokee_Trackhawk_SP10kge6g0tjfo0bkv87ru3cehu4.pdf' },
      { parameter: 'Drag coefficient', value: 'Cd 0.37', status: 'verified', source: 'FCA US Trackhawk technical sheet (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://s3.amazonaws.com/chryslermedia.iconicweb.com/mediasite/specs/2018_JP_GrCherokee_Trackhawk_SP10kge6g0tjfo0bkv87ru3cehu4.pdf' },
      { parameter: 'Frontal area', value: '2.93 m²', status: 'verified', source: 'FCA US Trackhawk technical sheet (owner-supplied spec-sheet follow-up, 2026-11)', url: 'https://s3.amazonaws.com/chryslermedia.iconicweb.com/mediasite/specs/2018_JP_GrCherokee_Trackhawk_SP10kge6g0tjfo0bkv87ru3cehu4.pdf' },
      { parameter: 'Peak power', value: '707 hp', status: 'reported', source: 'Jeep rating (multiple reviews)', url: 'https://www.thedrive.com/new-cars/15607/2018-jeep-grand-cherokee-trackhawk-review-hellcat-suv-delivers-a-supercharged-street-beatdown' },
      { parameter: 'Peak torque', value: '645 lb-ft', status: 'reported', source: 'Jeep rating (multiple reviews)', url: 'https://www.thedrive.com/new-cars/15607/2018-jeep-grand-cherokee-trackhawk-review-hellcat-suv-delivers-a-supercharged-street-beatdown' },
      { parameter: 'Power / torque rpm', value: '6,000 / 4,800 rpm', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Gear ratios', value: '4.71/…/0.67 (8HP95)', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
      { parameter: 'Curb mass', value: '5,258 lb (2,385 kg) as tested', status: 'reported', source: 'Car and Driver test', url: 'https://autos.yahoo.com/2018-jeep-grand-cherokee-trackhawk-194500054.html' },
      { parameter: 'AWD split', value: 'Front share 0.30–0.50', status: 'estimated', source: 'Published mode splits (40:60 Auto, 30:70 Track, 50:50 Snow) recalled; not verified' },
      { parameter: 'Tire size', value: '295/45 R20', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
