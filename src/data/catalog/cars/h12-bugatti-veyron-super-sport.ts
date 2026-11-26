import { buildSpec, staggered } from '../build';
import type { CatalogEntry } from '../types';

const EPA = 'https://www.autonocion.com/wp-content/uploads/2015/10/Certificado-EPA-Bugatti-Veyron.pdf';
const OEM = 'https://newsroom.bugatti.com/en/press-releases/bugatti-presents-veyron-16-4-super-sport-to-public';
const RECORD = 'https://newsroom.bugatti.com/en/press-releases/landspeed-worldrecord-with-the-bugatti-veyron-16-4-super-sport';

/** Hypercar extension #12: 2010 Bugatti Veyron 16.4 Super Sport (US). */
export const entry: CatalogEntry = {
  id: "2010-bugatti-veyron-16-4-super-sport-us-coupe-awd-7dct",
  extension: { set: 'Hypercars', order: 12 },
  section: "Hypercars",
  make: "Bugatti",
  model: "Veyron 16.4",
  trim: "Super Sport",
  modelYear: 2010,
  market: "US",
  body: "Coupe",
  bodyLabel: "Coupé",
  aliases: [
    "Veyron Super Sport",
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
    power: "1,200 hp (882 kW)",
    torque: "1,500 Nm",
    curbMass: "4,513 lb (EPA certification curb, Super Sport)",
    topSpeed: "415 km/h (limited to protect the tires); 431.072 km/h record run listed separately",
    sourceId: "src-bugatti-ss"
  },
  sources: [
    {
      id: "src-bugatti-ss",
      title: "Bugatti presents Veyron 16.4 Super Sport to public",
      publisher: "Bugatti",
      url: OEM,
      kind: "manufacturer",
      date: "2010-08"
    },
    {
      id: "src-bugatti-record",
      title: "Land speed world record with the Bugatti Veyron 16.4 Super Sport",
      publisher: "Bugatti",
      url: RECORD,
      kind: "manufacturer",
      date: "2010"
    },
    {
      id: "src-epa",
      title: "Certification Summary Information Report, test group EBGTV08.0V16 (MY2014 filing, mirrored)",
      publisher: "US EPA / Bugatti",
      url: EPA,
      kind: "manufacturer"
    }
  ],
  benchmarks: [],
  dataGaps: [
    "Measured road test",
    "Rev limit and redline",
    "Dimensions, wheelbase and drag coefficient (EPA road-load target identical to the 16.4 coupé)",
    "Weight distribution",
    "Launch-control rpm",
    "Speed-per-gear cross-check against the EPA N/V (as the 16.4 coupé)"
  ],
  simCaveats: [
    "Provisional AWD approximation: one averaged rolling radius (0.337 m) ties engine speed to both axles; the EPA N/V of 24.85 rpm/mph implies 0.353 m, so modelled road speed per rpm runs about 4.7 % low and 7th cannot reach the 415 km/h limit before the estimated rev limit.",
    "No measured benchmark: grip is the calibrated-AWD median and efficiency is transferred from the Veyron 16.4's trap fit (same driveline and tires)."
  ],
  notes: [
    "The 431.072 km/h land-speed record (July 2010, Ehra-Lessien) is a separate run with the limiter removed; production cars are limited to 415 km/h."
  ],
  sim: buildSpec({
  id: "2010-bugatti-veyron-16-4-super-sport-us-coupe-awd-7dct",
  make: "Bugatti",
  model: "Veyron 16.4",
  trim: "Super Sport",
  modelYear: 2010,
  market: "US",
  body: "Coupe",
  shortName: "Bugatti Veyron Super Sport"
}, {
    engine: { code: 'W16 (CBLA)', description: '8.0 L quad-turbo W16 (larger turbochargers and intercoolers)', displacementCc: 7993, aspiration: 'twin-turbo', idleRpm: 840, redlineRpm: 6600, revLimitRpm: 6700, power: { value: 882, unit: 'kW', rpm: [6400, 6400] }, torque: { value: 1500, unit: 'Nm', rpm: [3000, 5000] } },
    transmission: { type: 'dual-clutch', name: '7-speed DSG dual-clutch', gearRatios: [3.176, 2.263, 1.667, 1.29, 1.057, 0.878, 0.795], finalDrive: 2.585, launchClutch: { creepTorqueNm: 40 } },
    drivetrain: { layout: 'AWD', efficiency: 0.84, description: 'Permanent AWD with a controlled front coupling (rear-biased)', frontShareRange: [0, 0.5] },
    chassis: { curbMassKg: 2047, frontWeightFraction: 0.44, wheelbaseM: 2.71, lengthMm: 4463, widthMm: 1999, heightMm: 1204 },
    aero: { dragCoefficient: 0.339, frontalAreaM2: 2.02 },
    tires: { sizes: [staggered('pax', 'PAX 265-680 ZR500A F · 365-710 ZR540A R', { widthMm: 265, aspectPct: 33.96, rimIn: 19.685 }, { widthMm: 365, aspectPct: 23.29, rimIn: 21.26 }, 'Michelin PAX run-flat fitment (EPA filing)')], compound: 'uhp', gripScale: 1.11 },
    speedLimiterKmh: 415,
    factory: { topSpeedKmh: 415 },
    provenance: [
      { parameter: 'Peak power', value: '882 kW (1,200 hp) @ 6,400 rpm', status: 'verified', source: 'Bugatti release (1,200 hp / 882 kW); EPA filing carline row (1200 @ 6400)', url: OEM },
      { parameter: 'Peak torque', value: '1,500 Nm @ 3,000–5,000 rpm', status: 'verified', source: 'Bugatti release (1,500 Nm); EPA filing carline row (1500 Nm @ 3000 to 5000)', url: EPA },
      { parameter: 'Gear ratios', value: '3.176/2.263/1.667/1.290/1.057/0.878/0.795', status: 'verified', source: 'EPA filing section 12 p. 2: transmission code AD71C001 covers the Super Sport carline (CBLA engine) with the same ratios and N/V 24.85', url: EPA },
      { parameter: 'Final drive', value: '2.585 effective axle (applied once)', status: 'verified', source: 'EPA filing axle ratio 2.585', url: EPA },
      { parameter: 'Tire size', value: 'PAX 265-680 ZR500A F · 365-710 ZR540A R', status: 'verified', source: 'EPA filing carline table (Super Sport row)', url: EPA },
      { parameter: 'Curb mass', value: '4,513 lb (2,047 kg)', status: 'reported', source: 'EPA filing carline row (MY2014 certification, applied to the 2010 car via the carried-over test group)', url: EPA },
      { parameter: 'Idle speed', value: '840 rpm', status: 'verified', source: 'EPA filing (840 ± 40 rpm)', url: EPA },
      { parameter: 'Speed limiter', value: '415 km/h', status: 'verified', source: 'Bugatti release: top speed limited to 415 km/h to protect the tyres; the 431 km/h record run is separate', url: OEM },
      { parameter: 'Drag coefficient', value: 'Cd 0.339 × 2.02 m² (CdA ≈ 0.684 m²)', status: 'estimated', source: 'EPA target road-load coefficients for the Super Sport test vehicle (A 60 lbf, B 0.59, C 0.0185) equal the 16.4 coupé, so the coupé CdA derivation is reused', url: EPA },
      { parameter: 'Rev limit', value: '6,600 rpm redline / 6,700 rpm limit', status: 'estimated', source: 'Not published; the 431 km/h record in 7th corresponds to ≈ 6,660 rpm at the EPA N/V of 24.85 rpm/mph, so the engine reaches at least that' },
      { parameter: 'Dimensions', value: '4,463 × 1,999 × 1,204 mm, WB 2,710 mm (16.4 coupé values)', status: 'estimated', source: 'Super Sport-specific dimensions not in the reachable sources; the 16.4 coupé figures are used' },
      { parameter: 'Model year', value: '2010', status: 'reported', source: 'Bugatti release (August 2010): production begins in the autumn at Molsheim', url: OEM },
      { parameter: 'Weight distribution', value: '44 % front', status: 'estimated', source: 'As the 16.4 coupé; not published' },
      { parameter: 'AWD split', value: 'Front share 0–0.50', status: 'estimated', source: 'Controlled front coupling; no fixed split published' },
      { parameter: 'Creep torque', value: '40 Nm clutch torque off the brake', status: 'estimated', source: 'As the 16.4 coupé; idle creep only' },
      { parameter: 'Tire grip calibration', value: '×1.11', status: 'estimated', source: 'Median of the calibrated AWD cars in the original roster; no measured benchmark' },
      { parameter: 'Drivetrain efficiency', value: '84 %', status: 'estimated', source: 'Transferred from the Veyron 16.4 trap fit (held at the plausible AWD floor); same gearbox, axle and tires' },
    ],
  }),
};
