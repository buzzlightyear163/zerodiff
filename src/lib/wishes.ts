import { useSyncExternalStore } from 'react';

/* Önskningar sparas lokalt i webbläsaren så att UI-flödet går att testa.
   TODO(backend): POST /api/wishes med signerat meddelande + verifiering mot mainnet. */

export interface Wish {
  id: string;
  program: string;
  price: number;
  wallet: string;
  signature: string;
  issued: string;
}

const KEY = 'zerodiff.wishes.v1';
const listeners = new Set<() => void>();
let cache: Wish[] | null = null;

function read(): Wish[] {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) || '[]') as Wish[];
  } catch {
    cache = [];
  }
  return cache;
}

export function addWish(w: Wish) {
  cache = [w, ...read()];
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* lagring otillgänglig: behåll i minnet */
  }
  listeners.forEach((l) => l());
}

export function useWishes(): Wish[] {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    read,
    () => [],
  );
}
