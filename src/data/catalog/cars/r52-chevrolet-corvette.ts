import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

/** Roster #52: 2020 Chevrolet Corvette Stingray Z51 (FE4) (US). */
export const entry: CatalogEntry = {
  id: "2020-chevrolet-corvette-stingray-z51-fe4-us-coupe-rwd-8dct",
  roster: 52,
  section: "American performance",
  make: "Chevrolet",
  model: "Corvette",
  trim: "Stingray Z51 (FE4)",
  modelYear: 2020,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupe",
  chassisCode: "C8",
  aliases: [
    "C8",
    "Vette",
    "Stingray",
    "Z51"
  ],
  origin: "United States",
  usage: [
    "Sports Car",
    "Grand Tourer"
  ],
  drive: "RWD",
  transmission: "DCT",
  transmissionLabel: "8-speed DCT",
  powertrain: "Petrol",
  engineLabel: "6.2 V8 (LT2)",
  modelPath: "Existing",
  factory: {
    power: "495 hp @ 6,450 rpm",
    torque: "470 lb-ft @ 5,150 rpm",
    curbMass: "3,366 lb dry (specification listing)",
    zeroTo60MphS: 2.9,
    sourceId: "src3"
  },
  sources: [
    {
      id: "test",
      title: "2020 Chevy Corvette by the numbers",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a29462701/2020-chevy-corvette-by-the-numbers/",
      kind: "road-test"
    },
    {
      id: "src2",
      title: "2020 Chevy Corvette Hits 60 MPH in 2.8 Seconds",
      publisher: "Car and Driver (syndicated on Yahoo)",
      url: "https://autos.yahoo.com/2020-chevy-corvette-hits-60-203000416.html",
      kind: "road-test"
    },
    {
      id: "src3",
      title: "2020 Corvette specifications",
      publisher: "CorvSport",
      url: "https://www.corvsport.com/2020-corvette-specifications/",
      kind: "reference"
    },
    {
      id: "src4",
      title: "Official: 2020 Corvette Stingray 0–60 in 2.9 s, ¼ mile 11.2 @ 121",
      publisher: "CorvetteBlogger (GM figures)",
      url: "https://www.corvetteblogger.com/2019/11/06/official-the-2020-corvette-stingray-goes-0-60-mph-in-2-9-seconds-runs-quarter-mile-in-11-2-121-mph/",
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
        zeroTo60MphS: 2.8,
        quarterMileS: 11.2,
        quarterMileTrapMph: 122
      },
      conditions: {
        other: [
          "Z51 package with Magnetic Ride Control"
        ]
      },
      match: "exact",
      verification: "Syndicated copy of the article (original page not reachable from this environment). The ¼-mile figures come from a specification page citing the same test.",
      date: "2020"
    }
  ],
  dataGaps: [
    "Curb mass (wet, as tested)",
    "Tire size",
    "Drag coefficient",
    "Launch-control rpm"
  ],
  notes: [
    "Chevrolet’s MY2023 brochure lists the Z51 axle as 5.20; the 5.17 used here is SAE’s figure (3.55 ring and pinion × 1.46 transfer ≈ 5.18), so both are roundings of the same ratio."
  ],
  sim: buildSpec({
  id: "2020-chevrolet-corvette-stingray-z51-fe4-us-coupe-rwd-8dct",
  make: "Chevrolet",
  model: "Corvette",
  trim: "Stingray Z51 (FE4)",
  modelYear: 2020,
  market: "US",
  body: "Coupe",
  shortName: "Chevrolet Corvette Stingray Z51"
}, {
    engine: { code: 'LT2', description: '6.2 L pushrod V8, dry sump', displacementCc: 6162, aspiration: 'na', idleRpm: 600, redlineRpm: 6500, revLimitRpm: 6600, power: { value: 495, unit: 'hp', rpm: [6450, 6450] }, torque: { value: 470, unit: 'lb-ft', rpm: [5150, 5150] }, lowEndFraction: 0.78 },
    transmission: { type: 'dual-clutch', name: 'Tremec TR-9080 8-speed DCT (M1L)', gearRatios: [2.91, 1.76, 1.22, 0.88, 0.65, 0.51, 0.4, 0.33], finalDrive: 5.17, upshiftTimeS: 0.1, shiftTorqueDip: 0.12 },
    drivetrain: { layout: 'RWD', efficiency: 0.844, description: 'Rear-wheel drive, electronic limited-slip differential (Z51)' },
    chassis: { curbMassKg: 1640, frontWeightFraction: 0.4, wheelbaseM: 2.722, lengthMm: 4630, widthMm: 1933, heightMm: 1234 },
    aero: {},
    tires: { sizes: [staggered('r19r20', '245/35 R19 F · 305/30 R20 R', { widthMm: 245, aspectPct: 35, rimIn: 19 }, { widthMm: 305, aspectPct: 30, rimIn: 20 }, 'Z51 fitment, Michelin Pilot Sport 4S (assumed)')], compound: 'uhp', gripScale: 1.3 },
    speedLimiterKmh: null,
    factory: { zeroTo60MphS: 2.9 },
    provenance: [
      { parameter: 'Tire grip calibration', value: '×1.30 (fit bound)', status: 'estimated', source: 'Fit toward the Car and Driver 0–60 mph 2.8 s stopped at the 1.30 bound (sim 3.04 s); residual shown rather than widening the bound' },
      { parameter: 'Drivetrain efficiency', value: '84.4 %', status: 'estimated', source: 'Fitted to the Car and Driver ¼-mile trap 122 mph' },
      { parameter: 'Peak power', value: '495 hp @ 6,450 rpm (Z51 performance exhaust)', status: 'reported', source: 'Chevrolet rating (specification listing)', url: 'https://www.corvsport.com/2020-corvette-specifications/' },
      { parameter: 'Peak torque', value: '470 lb-ft @ 5,150 rpm', status: 'reported', source: 'Chevrolet rating (specification listing)', url: 'https://www.corvsport.com/2020-corvette-specifications/' },
      { parameter: 'Gear ratios', value: '2.91/1.76/1.22/0.88/0.65/0.51/0.40 (1st–7th)', status: 'reported', source: 'National Corvette Museum', url: 'https://www.corvettemuseum.org/chevrolet-confirms-2020-stingray-is-quickest-in-its-history/' },
      { parameter: 'Gear ratio 8th', value: '0.33', status: 'reported', source: 'TREMEC TR-9080 specification sheet (forum copy)', url: 'https://www.gt40s.com/goto/post?id=561809' },
      { parameter: 'Final drive', value: '5.17 (Z51 eLSD; TREMEC rounds to 5.2)', status: 'reported', source: 'SAE Mobility Engineering', url: 'https://www.mobilityengineeringtech.com/component/content/article/40895-sae-ma-00017' },
      { parameter: 'Curb mass', value: '≈1,640 kg (3,615 lb)', status: 'estimated', source: '3,366 lb dry is reported; fluids and a typical Z51 option load added — awaiting spec sheet' },
      { parameter: 'Weight distribution', value: '≈40/60 front/rear', status: 'reported', source: 'Specification listing (≈60 % over the rear axle)', url: 'https://www.corvsport.com/2020-corvette-specifications/' },
      { parameter: 'Tire size', value: '245/35 R19 F · 305/30 R20 R', status: 'estimated', source: 'Recalled published figure; not verified from a reachable source — awaiting spec sheet' },
    ],
  }),
};
