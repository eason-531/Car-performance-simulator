import { StrictMode } from 'react';
import { App } from './App';
import { AppProvider } from './state/AppState';
import type { KeyValueStore } from './storage/kv';

/**
 * The app exactly as `main.tsx` mounts it, StrictMode included. Tests render
 * this too, so development-only effect replay is exercised the same way.
 */
export function Root({ store }: { store?: KeyValueStore }) {
  return (
    <StrictMode>
      <AppProvider store={store}>
        <App />
      </AppProvider>
    </StrictMode>
  );
}
