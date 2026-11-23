import type { TireCompound } from './types';

/**
 * Generic tire compound classes. Friction values are dry-asphalt peak
 * longitudinal coefficients typical for each class — estimates, not
 * measurements of a specific tire.
 */
export const TIRE_COMPOUNDS: readonly TireCompound[] = [
  {
    id: 'winter',
    label: 'Winter',
    description: 'Studless winter tire on dry, warm tarmac.',
    mu: 0.8,
    rollingResistance: 0.012,
  },
  {
    id: 'touring',
    label: 'Touring / all-season',
    description: 'Comfort-oriented touring or all-season tire.',
    mu: 0.92,
    rollingResistance: 0.0105,
  },
  {
    id: 'oe-performance',
    label: 'OE performance summer',
    description: 'Factory-fitted summer performance tire (stock).',
    mu: 1.0,
    rollingResistance: 0.011,
  },
  {
    id: 'uhp',
    label: 'Ultra-high-performance',
    description: 'Max-performance summer tire (e.g. Pilot Sport 4S class).',
    mu: 1.1,
    rollingResistance: 0.0115,
  },
  {
    id: 'semi-slick',
    label: 'Track semi-slick',
    description: 'Street-legal semi-slick (e.g. Cup 2 class), warm.',
    mu: 1.25,
    rollingResistance: 0.013,
  },
];

export function getTireCompound(id: string): TireCompound {
  return TIRE_COMPOUNDS.find((c) => c.id === id) ?? TIRE_COMPOUNDS[2];
}
