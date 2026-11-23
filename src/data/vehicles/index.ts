import { CATALOG, PLAYABLE } from '../catalog';
import type { VehicleSpec } from '../types';
import { lexusIs200t2016Tw } from './lexusIs200t2016Tw';
import { skodaSuperbCombiLk280 } from './skodaSuperbCombiLk280';

/**
 * Every car the simulator can run (owner cars first). The catalog
 * (src/data/catalog) is the single source of truth: to add a car, give its
 * catalog entry a `sim` spec.
 */
export const VEHICLES: readonly VehicleSpec[] = PLAYABLE;

const BY_ID = new Map(VEHICLES.map((v) => [v.id, v]));

export function getVehicle(id: string): VehicleSpec {
  const v = BY_ID.get(id);
  if (!v) throw new Error(`Unknown or non-playable vehicle id: ${id}`);
  return v;
}

export function findVehicle(id: string): VehicleSpec | undefined {
  return BY_ID.get(id);
}

export { CATALOG, lexusIs200t2016Tw, skodaSuperbCombiLk280 };
