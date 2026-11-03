import { Link } from 'react-router-dom';
import { PageHead } from '../components/PageHead';
import { BRAND, short } from '../data/brand';
import { useTitle } from '../hooks/useReveal';
import { utc } from '../lib/api';
import { useWishes } from '../lib/wishes';

export function Wishes() {
  useTitle('Wishes', BRAND.name);
  const wishes = useWishes();
  return (
    <div className="page">
      <PageHead title="Wishes" img="/assets/img/card-wish.jpg">
        <p>
          Programs someone wants opened, with the price they would pay. A wish is a signed message, so there is no deposit. Each requester's record is read from the chain: paid counts the unlocks they bought, ignored counts passing proofs on their wishes whose window they let run out.
        </p>
        <div style={{ marginTop: 26 }}>
          <Link className="pill white" to="/wish">
            Sign a wish
          </Link>
        </div>
      </PageHead>
      <div className="inner">
        {wishes.length === 0 ? (
          <div className="empty">
            <p>No wish yet. The first one needs a program id, a price and a signature.</p>
            <Link className="pill white" to="/wish">
              Sign the first wish
            </Link>
          </div>
        ) : (
          <>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Program</th>
                  <th>Price</th>
                  <th>Requester</th>
                  <th>Record</th>
                  <th>Signed</th>
                </tr>
              </thead>
              <tbody>
                {wishes.map((w) => (
                  <tr key={w.id}>
                    <td>{w.program}</td>
                    <td>{w.price} USDC</td>
                    <td>{short(w.wallet, 4, 4)}</td>
                    <td>paid 0, ignored 0</td>
                    <td>{utc(w.issued)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="muted" style={{ fontSize: 12, marginTop: 14 }}>
              {/* TODO(backend): önskningar lagras just nu bara lokalt i webbläsaren. */}
              Stored locally in this browser (demo). Records are computed from the chain once a backend is connected.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
