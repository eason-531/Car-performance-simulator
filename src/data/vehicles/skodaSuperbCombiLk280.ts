import type { VehicleSpec } from '../types';

/**
 * Škoda Superb Combi (B8 / 3V, pre-facelift) L&K 2.0 TSI 280 PS 4x4 DSG.
 *
 * The 280 PS version was sold 2015–2019 with the 6-speed wet dual-clutch
 * DQ250 (0D9 for 4x4). The 2019 facelift replaced it with a 272 PS / 7-speed
 * combination, so 280 PS identifies the pre-facelift car.
 *
 * Exact DQ250 ratios for this application were not found in public sources;
 * the ratios below are the MQB high-output DQ250 set (Golf R / S3) and are
 * marked as estimated.
 */
export const skodaSuperbCombiLk280: VehicleSpec = {
  id: 'skoda-superb-combi-lk-280',
  make: 'Škoda',
  model: 'Superb Combi',
  variant: 'L&K 2.0 TSI 280 4x4 DSG',
  modelYear: 2016,
  market: 'Taiwan / EU',
  shortName: 'Škoda Superb 280',
  colorSlot: 1,

  engine: {
    code: 'EA888 Gen 3',
    description: '2.0 TSI inline-4 turbo, direct + port injection, 206 kW',
    aspiration: 'turbo',
    displacementCc: 1984,
    idleRpm: 750,
    redlineRpm: 6500,
    revLimitRpm: 6700,
    torqueCurveNm: [
      [750, 145],
      [1000, 195],
      [1250, 255],
      [1500, 320],
      [1700, 350],
      [3000, 350],
      [4500, 350],
      [5600, 350],
      [5800, 339],
      [6000, 327.5],
      [6250, 314.5],
      [6500, 302],
      [6700, 284],
    ],
    boostCurveBar: [
      [750, 0.12],
      [1000, 0.3],
      [1250, 0.6],
      [1500, 1.0],
      [1700, 1.2],
      [2000, 1.25],
      [5000, 1.25],
      [5600, 1.2],
      [6000, 1.1],
      [6700, 1.0],
    ],
    spoolTimeConstantS: [
      [750, 1.1],
      [1000, 1.0],
      [1500, 0.6],
      [2000, 0.4],
      [3000, 0.27],
      [4000, 0.22],
      [6700, 0.18],
    ],
    inertiaKgM2: 0.17,
    friction: { baseNm: 12, perKrpmNm: 7 },
    rated: {
      powerPs: 280,
      powerRpm: [5600, 6500],
      torqueNm: 350,
      torqueRpm: [1700, 5600],
    },
  },

  transmission: {
    type: 'dual-clutch',
    name: '6-speed DSG (DQ250 / 0D9, wet clutches)',
    gearRatios: [2.923, 1.792, 1.143, 0.778, 0.8, 0.639],
    finalDrive: [4.769, 4.769, 4.769, 4.769, 3.444, 3.444],
    upshiftTimeS: 0.16,
    downshiftTimeS: 0.28,
    shiftTorqueDip: 0.18,
    maxAutoUpshiftRpm: 6550,
    ratedInputTorqueNm: 350,
    launchClutch: {
      launchRpm: 3200,
      brakeHoldRpmLimit: 3000,
      maxClutchTorqueNm: 500,
    },
  },

  drivetrain: {
    layout: 'AWD',
    description: '4x4 with Haldex (Gen 5) electro-hydraulic multi-plate coupling',
    efficiency: 0.84,
    maxRearShare: 0.5,
  },

  chassis: {
    curbMassKg: 1560,
    frontWeightFraction: 0.59,
    wheelbaseM: 2.841,
    cgHeightM: 0.56,
    lengthMm: 4856,
    widthMm: 1864,
    heightMm: 1477,
  },

  aero: {
    dragCoefficient: 0.3,
    frontalAreaM2: 2.32,
  },

  tires: {
    sizes: [
      {
        id: 'r17',
        label: '215/55 R17',
        front: { widthMm: 215, aspectPct: 55, rimIn: 17 },
        rear: { widthMm: 215, aspectPct: 55, rimIn: 17 },
        wheelInertiaKgM2: 1.05,
        note: 'Base 17-inch fitment',
      },
      {
        id: 'r18',
        label: '235/45 R18',
        front: { widthMm: 235, aspectPct: 45, rimIn: 18 },
        rear: { widthMm: 235, aspectPct: 45, rimIn: 18 },
        wheelInertiaKgM2: 1.15,
        note: 'L&K 18-inch fitment',
      },
      {
        id: 'r19',
        label: '235/40 R19',
        front: { widthMm: 235, aspectPct: 40, rimIn: 19 },
        rear: { widthMm: 235, aspectPct: 40, rimIn: 19 },
        wheelInertiaKgM2: 1.3,
        note: 'Optional 19-inch fitment',
      },
    ],
    defaultSizeId: 'r18',
    defaultCompoundId: 'oe-performance',
  },

  speedLimiterKmh: 250,
  factory: { zeroTo100S: 5.8, topSpeedKmh: 250 },

  stage1: {
    label: 'Stage 1 ECU remap',
    description:
      'Typical pump-fuel calibration for the EA888 Gen 3 (IS20 turbo): higher boost and torque ' +
      'limits. A matching DSG (TCU) calibration is strongly recommended above 350 Nm.',
    torqueMultiplier: [
      [750, 1.02],
      [1000, 1.05],
      [1500, 1.12],
      [2000, 1.28],
      [3500, 1.286],
      [4500, 1.28],
      [5600, 1.24],
      [6500, 1.24],
      [6700, 1.22],
    ],
    boostAddBar: [
      [750, 0.0],
      [1000, 0.05],
      [2000, 0.3],
      [5000, 0.35],
      [6700, 0.3],
    ],
    claimedPowerPs: 350,
    claimedTorqueNm: 450,
  },

  provenance: [
    { parameter: 'Engine', value: 'EA888 Gen 3, 1,984 cc turbo I4', status: 'verified', source: 'Škoda technical data', url: 'https://cdn.skoda-storyboard.com/2016/12/TD_SUPERB_COMBI_en.pdf' },
    { parameter: 'Peak power', value: '280 PS (206 kW) @ 5,600–6,500 rpm', status: 'verified', source: 'Škoda technical data; auto-data.net', url: 'https://www.auto-data.net/en/skoda-superb-iii-combi-2.0-tsi-280hp-4x4-dsg-21961' },
    { parameter: 'Peak torque', value: '350 Nm @ 1,700–5,600 rpm', status: 'verified', source: 'Škoda technical data; auto-data.net', url: 'https://www.auto-data.net/en/skoda-superb-iii-combi-2.0-tsi-280hp-4x4-dsg-21961' },
    {
      parameter: 'Torque curve shape',
      value: 'Plateau 1,700–5,600, constant power to 6,500',
      status: 'estimated',
      source: 'Derived from the rated torque band and 206 kW power band',
    },
    { parameter: 'Gearbox', value: '6-speed wet DSG (DQ250, 0D9 for 4x4)', status: 'verified', source: 'Pre-facelift 280 PS spec sheets list a 6-speed DSG' },
    {
      parameter: 'Gear ratios',
      value: '2.923 / 1.792 / 1.143 / 0.778 / 0.800 / 0.639',
      status: 'estimated',
      source: 'MQB high-output DQ250 set (Golf R / S3); Superb-specific ratios not published',
    },
    { parameter: 'Final drive', value: '4.769 (1–4) / 3.444 (5–6)', status: 'estimated', source: 'MQB high-output DQ250 set' },
    {
      parameter: 'Curb mass',
      value: '1,560 kg (+75 kg driver = 1,635 kg EU)',
      status: 'reported',
      source: 'EU kerb weight 1,635 kg incl. driver; L&K options add weight — adjust in Tuning',
      url: 'https://www.auto-data.net/en/skoda-superb-iii-combi-2.0-tsi-280hp-4x4-dsg-21961',
    },
    { parameter: 'Dimensions', value: '4,856 × 1,864 × 1,477 mm, WB 2,841 mm', status: 'reported', source: 'Škoda Superb III Combi technical data' },
    { parameter: 'Drag coefficient', value: 'Cd 0.30', status: 'reported', source: 'Škoda technical data lists 0.289–0.310 for Combi versions', url: 'https://cdn.skoda-storyboard.com/2016/12/TD_SUPERB_COMBI_en.pdf' },
    { parameter: 'Frontal area', value: '2.32 m²', status: 'estimated', source: '≈ 0.84 × width × height' },
    { parameter: 'Weight distribution', value: '59 % front', status: 'estimated', source: 'Typical for transverse-engine AWD estate' },
    { parameter: 'CG height', value: '0.56 m', status: 'estimated', source: 'Typical estate value' },
    { parameter: 'Boost curve', value: 'Peak ≈ 1.25 bar', status: 'estimated', source: 'Typical EA888 Gen 3 IS20 logs' },
    { parameter: 'AWD split', value: 'Up to 50 % rear', status: 'estimated', source: 'Haldex Gen 5 behaviour under acceleration' },
    { parameter: 'Launch rpm', value: '≈ 3,200 rpm', status: 'estimated', source: 'DSG launch behaviour, model calibration' },
    { parameter: 'Shift time', value: '0.16 s up / 0.28 s down', status: 'estimated', source: 'Model calibration (DSG torque handover is near-seamless)' },
    { parameter: 'Drivetrain efficiency', value: '84 %', status: 'estimated', source: 'Typical AWD dual-clutch losses (16 %)' },
    { parameter: 'Tire size (default)', value: '235/45 R18', status: 'estimated', source: 'Pick your car’s actual fitment in Tuning' },
    { parameter: 'DQ250 torque rating', value: '350 Nm', status: 'reported', source: 'Gearbox references; tuned cars typically get a TCU remap' },
    {
      parameter: 'Stage 1 output',
      value: '≈ 350 PS / 450 Nm',
      status: 'estimated',
      source: 'Typical aftermarket claims for 206 kW EA888 Gen 3 ECU remaps',
    },
  ],

  notes: [
    'Owner’s car: early six-speed DSG (DQ250) configuration, no adaptive cruise control (ACC).',
    'The 280 PS / 6-speed DSG combination identifies the pre-facelift Superb III (2015–2019).',
    'Speed limited to 250 km/h; unrestricted cars have been recorded at ≈ 260 km/h.',
  ],
};
