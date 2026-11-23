import type { VehicleSpec } from '../types';

/**
 * 2016 Lexus IS 200t (XE30), Taiwan-market specification.
 *
 * Verified: rated output, torque band, gear ratios, wheelbase, dimensions.
 * Everything marked `estimated` in `provenance` is a modelling assumption
 * that can be overridden from the Tuning screen.
 */
export const lexusIs200t2016Tw: VehicleSpec = {
  id: 'lexus-is200t-2016-tw',
  make: 'Lexus',
  model: 'IS 200t',
  variant: '2.0 Turbo RWD 8AT',
  modelYear: 2016,
  market: 'Taiwan',
  shortName: 'Lexus IS200t',
  colorSlot: 0,

  engine: {
    code: '8AR-FTS',
    description: '2.0 L inline-4, twin-scroll turbo, D-4ST direct + port injection',
    displacementCc: 1998,
    idleRpm: 700,
    redlineRpm: 6200,
    revLimitRpm: 6300,
    torqueCurveNm: [
      [700, 135],
      [1000, 185],
      [1250, 245],
      [1500, 315],
      [1650, 350],
      [2500, 350],
      [3500, 350],
      [4400, 350],
      [4800, 338],
      [5200, 322],
      [5500, 308],
      [5800, 297],
      [6000, 282],
      [6200, 266],
      [6300, 256],
    ],
    boostCurveBar: [
      [700, 0.1],
      [1000, 0.25],
      [1250, 0.55],
      [1500, 0.95],
      [1650, 1.1],
      [2000, 1.15],
      [4400, 1.15],
      [5000, 1.08],
      [5800, 0.98],
      [6300, 0.92],
    ],
    spoolTimeConstantS: [
      [700, 1.2],
      [1000, 1.1],
      [1500, 0.7],
      [2000, 0.45],
      [3000, 0.3],
      [4000, 0.24],
      [6300, 0.2],
    ],
    inertiaKgM2: 0.2,
    friction: { baseNm: 12, perKrpmNm: 7 },
    rated: {
      powerPs: 245,
      powerRpm: [5800, 5800],
      torqueNm: 350,
      torqueRpm: [1650, 4400],
    },
  },

  transmission: {
    type: 'torque-converter-automatic',
    name: '8-speed automatic (Aisin AA8xE family, 8-Speed SPDS)',
    gearRatios: [4.596, 2.724, 1.863, 1.464, 1.231, 1.0, 0.824, 0.685],
    finalDrive: [3.133, 3.133, 3.133, 3.133, 3.133, 3.133, 3.133, 3.133],
    upshiftTimeS: 0.38,
    downshiftTimeS: 0.45,
    shiftTorqueDip: 0.5,
    maxAutoUpshiftRpm: 6100,
    ratedInputTorqueNm: 400,
    torqueConverter: {
      stallRpm: 2400,
      stallTorqueRatio: 1.85,
      couplingSpeedRatio: 0.85,
      lockupMinGear: 2,
    },
  },

  drivetrain: {
    layout: 'RWD',
    description: 'Rear-wheel drive, open differential with traction control',
    efficiency: 0.85,
  },

  chassis: {
    curbMassKg: 1680,
    frontWeightFraction: 0.53,
    wheelbaseM: 2.8,
    cgHeightM: 0.52,
    lengthMm: 4665,
    widthMm: 1810,
    heightMm: 1430,
  },

  aero: {
    dragCoefficient: 0.28,
    frontalAreaM2: 2.13,
  },

  tires: {
    sizes: [
      {
        id: 'r17',
        label: '225/45 R17 (square)',
        front: { widthMm: 225, aspectPct: 45, rimIn: 17 },
        rear: { widthMm: 225, aspectPct: 45, rimIn: 17 },
        wheelInertiaKgM2: 1.05,
        note: 'Standard-trim fitment',
      },
      {
        id: 'r18',
        label: '225/40 R18 (square)',
        front: { widthMm: 225, aspectPct: 40, rimIn: 18 },
        rear: { widthMm: 225, aspectPct: 40, rimIn: 18 },
        wheelInertiaKgM2: 1.15,
        note: 'Higher-trim 18-inch fitment',
      },
      {
        id: 'fsport',
        label: '225/40 R18 F · 255/35 R18 R',
        front: { widthMm: 225, aspectPct: 40, rimIn: 18 },
        rear: { widthMm: 255, aspectPct: 35, rimIn: 18 },
        wheelInertiaKgM2: 1.2,
        note: 'F SPORT staggered fitment',
      },
    ],
    defaultSizeId: 'r17',
    defaultCompoundId: 'oe-performance',
  },

  speedLimiterKmh: 230,
  factory: { zeroTo100S: 7.0, topSpeedKmh: 230 },

  benchmarks: [
    { label: '0–100 km/h', value: '7.0 s', source: 'Lexus factory claim (IS 200t)', kind: 'factory' },
    { label: 'Top speed', value: '230 km/h (limited)', source: 'Lexus factory claim', kind: 'factory' },
    {
      label: '0–100 km/h',
      value: '7.76 s',
      source: '8891 / P-Box road test, IS 200t F SPORT (Taiwan, 25 °C)',
      kind: 'measured',
    },
    {
      label: '¼ mile',
      value: '15.3 s @ 91 mph (146 km/h)',
      source: 'US press road test as cited by Motorway America (US-spec, 241 hp)',
      kind: 'measured',
    },
    { label: '0–60 mph', value: '6.8 s', source: 'Car and Driver, as cited by Motorway America', kind: 'measured' },
  ],

  stage1: {
    label: 'Stage 1 ECU remap',
    description:
      'Typical pump-fuel ECU calibration for the 8AR-FTS: more boost through the mid-range, ' +
      'revised ignition and torque limits. No hardware changes.',
    torqueMultiplier: [
      [700, 1.02],
      [1000, 1.04],
      [1500, 1.1],
      [2000, 1.2],
      [3500, 1.2],
      [4400, 1.18],
      [5000, 1.17],
      [5800, 1.16],
      [6300, 1.12],
    ],
    boostAddBar: [
      [700, 0.0],
      [1000, 0.05],
      [2000, 0.25],
      [4400, 0.25],
      [6300, 0.2],
    ],
    claimedPowerPs: 285,
    claimedTorqueNm: 420,
  },

  provenance: [
    { parameter: 'Engine', value: '8AR-FTS 1,998 cc turbo I4', status: 'verified', source: 'Lexus / Toyota engine designation' },
    {
      parameter: 'Peak power',
      value: '245 PS @ 5,800 rpm',
      status: 'verified',
      source: 'Taiwan launch coverage (U-CAR: 245 hp / 35.7 kgm); auto-data.net',
    },
    {
      parameter: 'Peak torque',
      value: '350 Nm @ 1,650–4,400 rpm',
      status: 'verified',
      source: '35.7 kgm (Taiwan spec); 350 Nm @ 1,650–4,400 rpm (auto-data.net)',
    },
    {
      parameter: 'Torque curve shape',
      value: 'Plateau 1,650–4,400, tapering to peak power',
      status: 'estimated',
      source: 'Shaped to hit the rated torque band and 245 PS at 5,800 rpm exactly',
    },
    {
      parameter: 'Gear ratios',
      value: '4.596 / 2.724 / 1.863 / 1.464 / 1.231 / 1.000 / 0.824 / 0.685',
      status: 'verified',
      source: 'Multiple spec sheets; Lexus IS product information',
    },
    { parameter: 'Final drive', value: '3.133', status: 'reported', source: 'Spec sheets (3.133 / 3.13)' },
    {
      parameter: 'Curb mass',
      value: '1,680 kg',
      status: 'reported',
      source: 'Taiwan spec sheet via U-CAR (JP-market 1,620 kg, US 1,625 kg). Adjust in Tuning if your trim differs.',
    },
    { parameter: 'Dimensions', value: '4,665 × 1,810 × 1,430 mm, WB 2,800 mm', status: 'verified', source: 'Taiwan spec sheet (U-CAR)' },
    { parameter: 'Drag coefficient', value: 'Cd 0.28', status: 'reported', source: 'Published XE30 figures range 0.28–0.29' },
    {
      parameter: 'Frontal area',
      value: '2.13 m²',
      status: 'reported',
      source: '22.9 ft² measured on a 2014 IS 350 F SPORT (Road & Track, second-hand citation)',
    },
    { parameter: 'Weight distribution', value: '53 % front', status: 'estimated', source: 'Typical for XE30 four-cylinder RWD' },
    { parameter: 'CG height', value: '0.52 m', status: 'estimated', source: 'Typical sedan value' },
    { parameter: 'Boost curve', value: 'Peak ≈ 1.15 bar', status: 'estimated', source: 'No published figure; plausible for 8AR-FTS output' },
    { parameter: 'Turbo response', value: 'τ ≈ 0.45 s @ 2,000 rpm', status: 'estimated', source: 'Model calibration' },
    { parameter: 'Redline / limiter', value: '6,200 / 6,300 rpm', status: 'estimated', source: 'Instrument-cluster reading, approximate' },
    { parameter: 'Torque converter', value: 'Stall ≈ 2,400 rpm, 1.85:1', status: 'estimated', source: 'Typical for 8-speed planetary automatics' },
    { parameter: 'Shift time', value: '0.38 s up / 0.45 s down', status: 'estimated', source: 'Model calibration against published 0–100 / ¼-mile times' },
    { parameter: 'Drivetrain efficiency', value: '85 %', status: 'estimated', source: 'Typical RWD torque-converter automatic losses (≈15 %), calibrated to ¼-mile trap speed' },
    { parameter: 'Tire size (default)', value: '225/45 R17', status: 'estimated', source: 'Pick your car’s actual fitment in Tuning' },
    {
      parameter: 'Stage 1 output',
      value: '≈ 285 PS / 420 Nm',
      status: 'estimated',
      source: 'Typical aftermarket claims for 8AR-FTS ECU remaps; varies by tuner and fuel',
    },
  ],

  notes: [
    'Taiwan-market IS 200t launched October 2015 (MY2016).',
    'US-spec cars are rated at 241 hp (SAE); Taiwan / EU cars at 245 PS.',
  ],
};
