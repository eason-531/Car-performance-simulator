import type { VehicleSpec } from '../types';
import { lexusIs200t2016Tw } from './lexusIs200t2016Tw';
import { skodaSuperbCombiLk280 } from './skodaSuperbCombiLk280';

/**
 * The vehicle registry. To add a car, create a spec file next to this one and
 * append it here. Give it the next unused `colorSlot` so its chart colour stays
 * fixed everywhere in the app.
 */
export const VEHICLES: readonly VehicleSpec[] = [lexusIs200t2016Tw, skodaSuperbCombiLk280];

export function getVehicle(id: string): VehicleSpec {
  const v = VEHICLES.find((vehicle) => vehicle.id === id);
  if (!v) throw new Error(`Unknown vehicle id: ${id}`);
  return v;
}

export function findVehicle(id: string): VehicleSpec | undefined {
  return VEHICLES.find((vehicle) => vehicle.id === id);
}

export { lexusIs200t2016Tw, skodaSuperbCombiLk280 };
