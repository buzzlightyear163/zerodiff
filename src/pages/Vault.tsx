import { PageHead } from '../components/PageHead';
import { BRAND } from '../data/brand';
import { useTitle } from '../hooks/useReveal';

export function Vault() {
  useTitle('Vault', BRAND.name);
  const addr = (a: string) => (
    <a href={`https://solscan.io/account/${a}`} target="_blank" rel="noopener">
      {a}
    </a>
  );
  return (
    <div className="page">
      <PageHead title="Vault" img="/assets/img/cube-lock.jpg">
        <p>
          The vault collects the pump.fun creator fees the team sends to it by hand. Every Monday at 00:30 UTC a cron job applies the rule below and records each leg with a Memo. This page lists every transfer and every leg.
        </p>
      </PageHead>
      <div className="inner">
        <div className="cols2">
          <div className="form">
            <div className="label">Addresses</div>
            {/* TODO(backend): saldon läses live från chain. Adresserna är platshållare (se brand.ts). */}
            <div className="kv">
              <div>Vault</div>
              <div>{addr(BRAND.vault)}</div>
              <div>Orphan fund</div>
              <div>{addr(BRAND.orphanFund)}</div>
              <div>Keeper</div>
              <div>{addr(BRAND.keeper)}</div>
              <div>Vault now</div>
              <div>0.0000 SOL</div>
              <div>Orphan fund now</div>
              <div>0.00 USDC</div>
            </div>
          </div>
          <div className="form">
            <div className="label">The rule, every Monday 00:30 UTC</div>
            <ol style={{ margin: 0, paddingLeft: 20, display: 'grid', gap: 10, fontSize: 15, lineHeight: '23px' }}>
              <li>Keep 0.05 SOL for fees.</li>
              <li>Half of the rest is swapped to USDC on Jupiter and sent to the orphan fund.</li>
              <li>The orphan fund buys the oldest unsold proofs that are past all their windows, at their price or 250 USDC, whichever is lower. The hunter gets 92%, 8% returns to the vault, and the source is published on the ticket.</li>
              <li>The other half is bought into ${BRAND.ticker} on Jupiter and burned, together with the 8% burn share of every unlock.</li>
            </ol>
          </div>
        </div>
        <div className="label" style={{ margin: '50px 0 14px' }}>
          Transfers in and out
        </div>
        <div className="empty">
          <p>No transfer yet: nothing has reached the vault.</p>
        </div>
        <div className="label" style={{ margin: '50px 0 14px' }}>
          Recorded legs
        </div>
        <div className="empty">
          <p>No leg recorded yet. The keeper posts its first Memo once it holds SOL for fees.</p>
        </div>
        <div className="label" style={{ margin: '50px 0 14px' }}>
          Cron runs
        </div>
        <div className="empty">
          <p>The first run is next Monday at 00:30 UTC.</p>
        </div>
      </div>
    </div>
  );
}
