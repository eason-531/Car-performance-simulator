/// <reference types="node" />
import { test } from 'vitest';
import { writeFileSync } from 'node:fs';
import { getEntry } from './data/catalog';
import { computeStockStats } from './data/catalog/stockStats';
import type { VehicleSpec } from './data/types';
import { computeDyno, topSpeedBreakdown } from './physics/dyno';
import { buildSimVehicle } from './tuning/buildSimVehicle';
import { defaultTuning } from './tuning/tuning';
test('ev', () => {
  const out: string[] = [];
  const id = process.env.ID!;
  const base = getEntry(id).sim!;
  const v = buildSimVehicle(base, defaultTuning(base));
  out.push(`radius ${v.wheelRadiusM.toFixed(5)} mass ${v.massKg} CdA ${v.dragAreaM2.toFixed(3)} topspeed ${JSON.stringify(topSpeedBreakdown(v))}`);
  const d = computeDyno(v);
  out.push(`dyno axis ${d.axis} peak ${d.peakPowerPs.toFixed(0)} PS @ ${d.peakPowerKmh} km/h, ${d.peakTorqueNm.toFixed(0)} Nm`);
  const with_ = (g: number, e: number): VehicleSpec => ({ ...base, tires: { ...base.tires, gripScale: g }, drivetrain: { ...base.drivetrain, efficiency: e } });
  for (const [g, e] of (process.env.GE ?? '1.1:0.95').split(',').map((x) => x.split(':').map(Number))) {
    const st = computeStockStats(with_(g, e));
    const f = (t: typeof st.brakeRelease) => `60 ${t.splits['60mph']} 100k ${t.zeroTo100KmhS} ¼ ${t.quarterMileS} @ ${(t.quarterMileTrapKmh! / 1.609344).toFixed(1)}`;
    out.push(`grip ${g} eff ${e}: BR ${f(st.brakeRelease)} | RO ${f(st.rollout)} | score ${st.score} ${st.cls}`);
  }
  writeFileSync(process.env.OUT!, out.join('\n'));
}, 300000);
