import { useWallet, WALLETS } from '../lib/wallet';

export function WalletModal() {
  const { modalOpen, closeModal, connect, status, error } = useWallet();
  if (!modalOpen) return null;
  return (
    <div className="modal-back" onClick={closeModal}>
      <div className="modal" role="dialog" aria-label="Connect a wallet" onClick={(e) => e.stopPropagation()}>
        <h3>Connect a Solana wallet</h3>
        {WALLETS.map((w) => {
          const installed = !!w.get();
          return (
            <button key={w.id} className="w" type="button" disabled={status === 'connecting'} onClick={() => connect(w)}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* TODO(branding): lägg officiella wallet-logotyper i public/assets/logos/ */}
                <span className="wmono" aria-hidden="true">
                  {w.mono}
                </span>
                {w.name}
              </span>
              <span className="muted" style={{ fontSize: 12 }}>
                {status === 'connecting' && installed ? '...' : installed ? (w.id === 'demo' ? 'demo' : 'detected') : 'install'}
              </span>
            </button>
          );
        })}
        {error && (
          <div className="err" style={{ marginTop: 6 }}>
            {error}
          </div>
        )}
        <p className="muted" style={{ fontSize: 12, margin: '14px 0 0' }}>
          The wallet only opens after you pick one. Nothing is signed without a second click.
        </p>
      </div>
    </div>
  );
}
