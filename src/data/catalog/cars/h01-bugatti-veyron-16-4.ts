import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

const EPA = 'https://www.autonocion.com/wp-content/uploads/2015/10/Certificado-EPA-Bugatti-Veyron.pdf';
const OEM = 'https://newsroom.bugatti.com/en/press-releases/the-bugatti-veyron-on-the-track-of-the-targa-florio';
const OEM_RATING = 'https://newsroom.bugatti.com/api/en/press-releases/pdf/final-bugatti-veyron-16-4-sold-to-a-customer-in-europe';

/** Hypercar extension #1: 2008 Bugatti Veyron 16.4 coupé (US). */
export const entry: CatalogEntry = {
  id: "2008-bugatti-veyron-16-4-us-coupe-awd-7dct",
  extension: { set: 'Hypercars', order: 1 },
  section: "Hypercars",
  make: "Bugatti",
  model: "Veyron 16.4",
  trim: "Coupé",
  modelYear: 2008,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupé",
  aliases: [
    "Veyron",
    "EB 16.4",
    "W16"
  ],
  origin: "France",
  usage: [
    "Hypercar",
    "Grand Tourer"
  ],
  drive: "AWD",
  transmission: "DCT",
  transmissionLabel: "7-speed dual-clutch",
  powertrain: "Petrol",
  engineLabel: "8.0 quad-turbo W16",
  modelPath: "Existing",
  factory: {
    power: "1,001 PS (736 kW) @ 6,000 rpm",
    torque: "1,250 Nm @ 2,200–5,500 rpm",
    curbMass: "4,512 lb (EPA certification curb, coupé)",
    topSpeed: "253 mph (407 km/h) with the Top Speed key; 375 km/h otherwise",
    sourceId: "src-bugatti-rating"
  },
  sources: [
    {
      id: "src-bugatti-targa",
      title: "The Bugatti Veyron on the track of the Targa Florio",
      publisher: "Bugatti",
      url: OEM,
      kind: "manufacturer"
    },
    {
      id: "src-bugatti-rating",
      title: "Final Bugatti Veyron 16.4 sold to a customer in Europe",
      publisher: "Bugatti",
      url: OEM_RATING,
      kind: "manufacturer"
    },
    {
      id: "src-epa",
      title: "Certification Summary Information Report, test group EBGTV08.0V16 (MY2014 filing, mirrored)",
      publisher: "US EPA / Bugatti",
      url: EPA,
      kind: "manufacturer"
    },
    {
      id: "src-cd-2008",
      title: "Bugatti Veyron 16.4 road test",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a15152105/bugatti-veyron-164-road-test/",
      kind: "road-test",
      date: "2008"
    },
    {
      id: "src-cd-2006",
      title: "2006 Bugatti Veyron 16.4 road test (estimated figures, not used)",
      publisher: "Car and Driver",
      url: "https://www.caranddriver.com/reviews/a18201251/2006-bugatti-veyron-164-road-test-review/",
      kind: "reference",
      date: "2006"
    }
  ],
  benchmarks: [
    {
      id: "cd-2008",
      sourceId: "src-cd-2008",
      publication: "Car and Driver",
      date: "2008",
      timing: "unconfirmed",
      timingNote: "Car and Driver instrumented test from 2008, under its legacy (pre-late-2019) procedure. The period timing method is not confirmed here, so both simulator bases are shown and launch grip is not fitted to this run.",
      results: {
        zeroTo60MphS: 2.5,
        quarterMileS: 10.1,
        quarterMileTrapMph: 142
      },
      conditions: {
        testMass: "4,486 lb as tested"
      },
      match: "exact",
      verification: "Instrumented results as verified in the Codex hypercar handoff (main 62eca11, 2026-11); the Car and Driver page refuses automated fetches from this session. The earlier 2006 Car and Driver figures (2.9 s, 10.8 s @ 140 mph) are explicitly estimates and are not used."
    }
  ],
  dataGaps: [
    "Rev limit and redline (not in the OEM release or EPA filing)",
    "Dimensions and wheelbase",
    "Weight distribution",
    "Drag coefficient and frontal area split (only the EPA road-load CdA is sourced)",
    "Speed-per-gear table cross-check (period test spec-table scan unreachable)",
    "Period Car and Driver timing procedure (needed before fitting launch grip)",
    "Launch-control rpm"
  ],
  simCaveats: [
    "Provisional AWD approximation: one averaged rolling radius (0.337 m from the PAX front and rear sizes) ties engine speed to both axles. The EPA N/V of 24.85 rpm/mph implies 0.353 m, so modelled road speed per rpm runs about 4.7 % low in every gear.",
    "Launch grip is bounded by the 2008 result rather than fitted to a timing basis (unconfirmed), and efficiency is held at the plausible floor with the trap residual left visible."
  ],
  sim: buildSpec({
  id: "2008-bugatti-veyron-16-4-us-coupe-awd-7dct",
  make: "Bugatti",
  model: "Veyron 16.4",
  trim: "Coupé",
  modelYear: 2008,
  market: "US",
  body: "Coupe",
  shortName: "Bugatti Veyron 16.4"
}, {
    engine: { code: 'W16 (BNN / CBXA)', description: '8.0 L quad-turbo W16', displacementCc: 7993, aspiration: 'twin-turbo', idleRpm: 840, redlineRpm: 6400, revLimitRpm: 6500, power: { value: 736, unit: 'kW', rpm: [6000, 6000] }, torque: { value: 1250, unit: 'Nm', rpm: [2200, 5500] } },
    transmission: { type: 'dual-clutch', name: '7-speed DSG dual-clutch', gearRatios: [3.176, 2.263, 1.667, 1.29, 1.057, 0.878, 0.795], finalDrive: 2.585, launchClutch: { creepTorqueNm: 40 } },
    drivetrain: { layout: 'AWD', efficiency: 0.84, description: 'Permanent AWD with a controlled front coupling (rear-biased)', frontShareRange: [0, 0.5] },
    chassis: { curbMassKg: 2047, frontWeightFraction: 0.44, wheelbaseM: 2.71, lengthMm: 4462, widthMm: 1998, heightMm: 1204 },
    aero: { dragCoefficient: 0.339, frontalAreaM2: 2.02 },
    tires: { sizes: [staggered('pax', 'PAX 265-680 ZR500A F · 365-710 ZR540A R', { widthMm: 265, aspectPct: 33.96, rimIn: 19.685 }, { widthMm: 365, aspectPct: 23.29, rimIn: 21.26 }, 'Michelin PAX run-flat fitment (EPA filing); metric 680/710 mm diameters on 500/540 mm rims')], compound: 'uhp', gripScale: 1 },
    speedLimiterKmh: 375,
    factory: { topSpeedKmh: 407 },
    provenance: [
      { parameter: 'Peak power', value: '736 kW (1,001 PS) @ 6,000 rpm', status: 'verified', source: 'Bugatti (kW/PS basis preferred over the hp label); the EPA filing lists 1001 @ 6000', url: OEM_RATING },
      { parameter: 'Peak torque', value: '1,250 Nm @ 2,200–5,500 rpm', status: 'verified', source: 'Bugatti release and EPA filing (1250 Nm @ 2200 to 5500)', url: OEM },
      { parameter: 'Gear ratios', value: '3.176/2.263/1.667/1.290/1.057/0.878/0.795', status: 'verified', source: 'EPA filing section 12 p. 2, transmission code AD71C001 (L7, 4WD); the filing carries over the 2005 tests of test group EBGTV08.0V16 and lists the same code and N/V for the coupé, Grand Sport and Super Sport', url: EPA },
      { parameter: 'Final drive', value: '2.585 effective axle (3.64 final × 0.71 transfer, applied once)', status: 'verified', source: 'EPA filing axle ratio 2.585; the period road-test table gives 3.64 × 0.71 ≈ 2.584', url: EPA },
      { parameter: 'Tire size', value: 'PAX 265-680 ZR500A F · 365-710 ZR540A R', status: 'verified', source: 'EPA filing section 12 p. 2 (tire size rear/front)', url: EPA },
      { parameter: 'Curb mass', value: '4,512 lb (2,047 kg) EPA curb; Car and Driver weighed its 2008 test car at 4,486 lb', status: 'reported', source: 'EPA filing carline table (MY2014 coupé row); applied to the 2008 car because the filing carries over the same test group', url: EPA },
      { parameter: 'Idle speed', value: '840 rpm', status: 'verified', source: 'EPA filing (840 ± 40 rpm)', url: EPA },
      { parameter: 'Speed limiter', value: '375 km/h (normal); above 375 km/h only with the Top Speed key (407 km/h claimed)', status: 'verified', source: 'Bugatti: access to the speed range above 375 km/h needs the second key; 253 mph top speed', url: OEM },
      { parameter: 'Drag coefficient', value: 'Cd 0.339 × 2.02 m² (CdA ≈ 0.684 m²)', status: 'estimated', source: 'CdA from the EPA target road-load C coefficient 0.0185 lbf/mph² at 1.204 kg/m³; split using area ≈ 0.84 × width × height. Normal ride level (up to 220 km/h)', url: EPA },
      { parameter: 'Creep torque', value: '40 Nm clutch torque off the brake', status: 'estimated', source: 'Dual-clutch creep sized for a ≈ 2-tonne car (the generic 25 Nm barely moves it); affects idle creep only, not launches' },
      { parameter: 'Rev limit', value: '6,400 rpm redline / 6,500 rpm limit', status: 'estimated', source: 'Not published in the reachable sources; set just above the 6,000 rpm power peak' },
      { parameter: 'Dimensions', value: '4,462 × 1,998 × 1,204 mm, WB 2,710 mm', status: 'estimated', source: 'Commonly published figures; not confirmed from a fetched Bugatti document' },
      { parameter: 'Weight distribution', value: '44 % front', status: 'estimated', source: 'Mid-engine layout; secondary sources only' },
      { parameter: 'AWD split', value: 'Front share 0–0.50', status: 'estimated', source: 'Controlled front coupling; no fixed split published, so a rear-biased range is assumed' },
      { parameter: 'Tire grip calibration', value: '×1.00', status: 'estimated', source: 'Bounded, not basis-fitted: the 2008 result (2.5 s to 60 mph) needs grip ≤ 1.03 on a brake-release basis and the 1.00 floor on a rollout basis; the unconfirmed-basis convention (mean of both) lands on the 1.00 floor. The calibrated-AWD median (1.11) would run 2.27 s / 2.15 s' },
      { parameter: 'Drivetrain efficiency', value: '84 %', status: 'estimated', source: 'A trap fit to 142 mph asked for less than 80 %, below the plausible AWD range; held at 84 % (the lowest accepted AWD value) and the ≈ +3 mph trap residual left visible with no cause attributed' },
      { parameter: 'Turbocharging', value: 'Four turbochargers', status: 'verified', source: 'Bugatti release; modelled with the twin-turbo spool class', url: OEM },
    ],
  }),
};
