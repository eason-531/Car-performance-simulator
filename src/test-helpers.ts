import { VEHICLES, lexusIs200t2016Tw, skodaSuperbCombiLk280 } from './data/vehicles';
import type { VehicleSpec } from './data/types';
import { buildSimVehicle } from './tuning/buildSimVehicle';
import { defaultTuning, type TuningConfig } from './tuning/tuning';

export { VEHICLES, lexusIs200t2016Tw as lexus, skodaSuperbCombiLk280 as skoda };

export function sim(spec: VehicleSpec, patch: Partial<TuningConfig> = {}) {
  return buildSimVehicle(spec, { ...defaultTuning(spec), ...patch });
}
