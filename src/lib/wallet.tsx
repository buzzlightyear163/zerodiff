import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

/* Lättviktig Solana-wallet-anslutning utan beroenden.
   Läser injicerade providers (Phantom, Solflare, Backpack) och ansluter read-only.
   Inga transaktioner skickas härifrån. TODO(backend): server-side verifiering av signaturer. */

type Status = 'idle' | 'connecting' | 'connected' | 'error';

interface PublicKeyLike { toString(): string }
interface InjectedProvider {
  publicKey?: PublicKeyLike | null;
  connect: () => Promise<unknown>;
  disconnect?: () => Promise<void>;
  signMessage?: (msg: Uint8Array, enc?: string) => Promise<{ signature: Uint8Array } | Uint8Array>;
}

declare global {
  interface Window {
    phantom?: { solana?: InjectedProvider & { isPhantom?: boolean } };
    solflare?: InjectedProvider & { isSolflare?: boolean };
    backpack?: InjectedProvider;
  }
}

export interface WalletOption {
  id: 'phantom' | 'solflare' | 'backpack' | 'demo';
  name: string;
  mono: string;
  installUrl?: string;
  get: () => InjectedProvider | undefined;
}

const DEMO_ADDRESS = 'DemoWa11et1111111111111111111111111111111111';
const LAST_KEY = 'zerodiff.wallet.last';
const remember = (id: string | null) => {
  try {
    if (id) localStorage.setItem(LAST_KEY, id);
    else localStorage.removeItem(LAST_KEY);
  } catch {
    /* ingen lagring */
  }
};

const demoProvider: InjectedProvider = {
  publicKey: { toString: () => DEMO_ADDRESS },
  connect: () => new Promise((r) => setTimeout(r, 600)),
  signMessage: async (msg: Uint8Array) => {
    const h = await crypto.subtle.digest('SHA-256', msg);
    return { signature: new Uint8Array(h) };
  },
};

export const DEMO_ENABLED = import.meta.env.DEV || import.meta.env.VITE_DEMO_WALLET === 'true';

export const WALLETS: WalletOption[] = [
  { id: 'phantom', name: 'Phantom', mono: 'P', installUrl: 'https://phantom.com/download', get: () => window.phantom?.solana },
  { id: 'solflare', name: 'Solflare', mono: 'S', installUrl: 'https://solflare.com/download', get: () => window.solflare },
  { id: 'backpack', name: 'Backpack', mono: 'B', installUrl: 'https://backpack.app/downloads', get: () => window.backpack },
  ...(DEMO_ENABLED ? [{ id: 'demo' as const, name: 'Demo wallet', mono: 'D', get: () => demoProvider }] : []),
];

interface WalletCtx {
  status: Status;
  address: string | null;
  walletName: string | null;
  error: string | null;
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  connect: (w: WalletOption) => Promise<void>;
  disconnect: () => void;
  signMessage: (text: string) => Promise<string>;
}

const Ctx = createContext<WalletCtx | null>(null);

const toHex = (b: Uint8Array) => [...b].map((x) => x.toString(16).padStart(2, '0')).join('');

export function WalletProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('idle');
  const [address, setAddress] = useState<string | null>(null);
  const [active, setActive] = useState<WalletOption | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const connect = useCallback(async (w: WalletOption) => {
    const p = w.get();
    if (!p) {
      if (w.installUrl) window.open(w.installUrl, '_blank', 'noopener');
      return;
    }
    setStatus('connecting');
    setError(null);
    try {
      const res = (await p.connect()) as { publicKey?: PublicKeyLike } | undefined;
      const pk = res?.publicKey ?? p.publicKey;
      if (!pk) throw new Error('The wallet returned no address.');
      setAddress(pk.toString());
      setActive(w);
      setStatus('connected');
      setModalOpen(false);
      remember(w.id);
    } catch (e) {
      setStatus('error');
      setError(e instanceof Error ? e.message : 'Connection was rejected.');
    }
  }, []);

  const disconnect = useCallback(() => {
    active?.get()?.disconnect?.().catch(() => undefined);
    setAddress(null);
    setActive(null);
    setStatus('idle');
    remember(null);
  }, [active]);

  const signMessage = useCallback(
    async (text: string) => {
      const p = active?.get();
      if (!p?.signMessage) throw new Error('This wallet cannot sign messages.');
      const res = await p.signMessage(new TextEncoder().encode(text), 'utf8');
      const sig = res instanceof Uint8Array ? res : res.signature;
      return toHex(sig);
    },
    [active],
  );

  // Återanslut senast använda wallet efter omladdning (endast om den redan är betrodd).
  useEffect(() => {
    let id: string | null = null;
    try {
      id = localStorage.getItem(LAST_KEY);
    } catch {
      /* ingen lagring */
    }
    const w = WALLETS.find((x) => x.id === id);
    const p = w?.get();
    if (!w || !p) return;
    (p.connect as (o?: { onlyIfTrusted: boolean }) => Promise<unknown>)({ onlyIfTrusted: true })
      .then((res) => {
        const pk = (res as { publicKey?: PublicKeyLike } | undefined)?.publicKey ?? p.publicKey;
        if (!pk) return;
        setAddress(pk.toString());
        setActive(w);
        setStatus('connected');
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setModalOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen]);

  const value = useMemo<WalletCtx>(
    () => ({
      status,
      address,
      walletName: active?.name ?? null,
      error,
      modalOpen,
      openModal: () => {
        setError(null);
        setModalOpen(true);
      },
      closeModal: () => setModalOpen(false),
      connect,
      disconnect,
      signMessage,
    }),
    [status, address, active, error, modalOpen, connect, disconnect, signMessage],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWallet(): WalletCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error('useWallet must be used inside WalletProvider');
  return c;
}
