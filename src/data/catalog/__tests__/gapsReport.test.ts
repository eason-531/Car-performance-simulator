/// <reference types="node" />
import { readFileSync, writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildGapsReport } from '../gapsReport';

const FILE = new URL('../../../../docs/DATA_GAPS.md', import.meta.url);

describe('data gaps report', () => {
  const fresh = buildGapsReport();
  if (process.env.UPDATE_GENERATED) {
    it('writes docs/DATA_GAPS.md', () => {
      writeFileSync(FILE, fresh);
      expect(fresh.length).toBeGreaterThan(0);
    });
    return;
  }
  it('is up to date (run `npm run generate:gaps`)', () => {
    expect(readFileSync(FILE, 'utf8')).toBe(fresh);
  });
});
