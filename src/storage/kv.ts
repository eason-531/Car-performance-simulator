/**
 * Minimal key/value store over localStorage that never throws: Safari private
 * mode, disabled storage or quota errors fall back to an in-memory map so the
 * app keeps working (data then lasts for the session only).
 */
export interface KeyValueStore {
  get(key: string): string | null;
  set(key: string, value: string): boolean;
  remove(key: string): void;
}

export function createMemoryStore(): KeyValueStore {
  const map = new Map<string, string>();
  return {
    get: (k) => map.get(k) ?? null,
    set: (k, v) => {
      map.set(k, v);
      return true;
    },
    remove: (k) => {
      map.delete(k);
    },
  };
}

export function createBrowserStore(): KeyValueStore {
  const memory = createMemoryStore();
  const ls = (): Storage | null => {
    try {
      return typeof window !== 'undefined' && window.localStorage ? window.localStorage : null;
    } catch {
      return null;
    }
  };
  return {
    get(key) {
      try {
        return ls()?.getItem(key) ?? memory.get(key);
      } catch {
        return memory.get(key);
      }
    },
    set(key, value) {
      memory.set(key, value);
      try {
        const s = ls();
        if (!s) return false;
        s.setItem(key, value);
        return true;
      } catch {
        return false;
      }
    },
    remove(key) {
      memory.remove(key);
      try {
        ls()?.removeItem(key);
      } catch {
        /* ignore */
      }
    },
  };
}

export function readJson(store: KeyValueStore, key: string): unknown {
  const raw = store.get(key);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}
