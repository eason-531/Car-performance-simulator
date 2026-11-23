import { describe, expect, it } from 'vitest';
import { Curve } from '../curve';

describe('Curve', () => {
  const c = new Curve([
    [1000, 100],
    [2000, 300],
    [4000, 300],
    [6000, 200],
  ]);

  it('passes through control points', () => {
    expect(c.at(1000)).toBeCloseTo(100, 6);
    expect(c.at(2000)).toBeCloseTo(300, 1);
    expect(c.at(4000)).toBeCloseTo(300, 1);
    expect(c.at(6000)).toBeCloseTo(200, 6);
  });

  it('is monotone and does not overshoot a plateau', () => {
    for (let x = 2000; x <= 4000; x += 25) expect(c.at(x)).toBeLessThanOrEqual(300 + 1e-6);
    let prev = -Infinity;
    for (let x = 1000; x <= 2000; x += 10) {
      expect(c.at(x)).toBeGreaterThanOrEqual(prev - 1e-9);
      prev = c.at(x);
    }
  });

  it('holds end values outside its range', () => {
    expect(c.at(0)).toBeCloseTo(100, 6);
    expect(c.at(9000)).toBeCloseTo(200, 6);
  });

  it('supports scale, multiply and add', () => {
    expect(c.scale(2).at(3000)).toBeCloseTo(600, 1);
    const k = new Curve([
      [1000, 1.5],
      [6000, 1.5],
    ]);
    expect(c.multiply(k).at(3000)).toBeCloseTo(450, 1);
    expect(c.add(k).at(3000)).toBeCloseTo(301.5, 1);
  });

  it('rejects invalid input', () => {
    expect(() => new Curve([[1, 1]])).toThrow();
    expect(
      () =>
        new Curve([
          [2, 1],
          [1, 1],
        ]),
    ).toThrow();
  });
});
