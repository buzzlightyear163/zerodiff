import { Link } from 'react-router-dom';
import { BRAND, short } from '../data/brand';
import { XIcon } from './Icons';

const COLS: { h: string; links: { to: string; label: string; ext?: boolean }[] }[] = [
  {
    h: 'Product',
    links: [
      { to: '/proofs', label: 'Proof wall' },
      { to: '/wishes', label: 'Wishes' },
      { to: '/vault', label: 'Vault' },
      { to: '/verifier', label: 'Verifier' },
    ],
  },
  {
    h: 'Hunters',
    links: [
      { to: '/hunt', label: 'Submit a crate' },
      { to: '/docs/hunting', label: 'Submission rules' },
      { to: '/docs/judge', label: 'The judge' },
      { to: '/docs/windows', label: 'Orphan fund' },
    ],
  },
  {
    h: 'Buyers',
    links: [
      { to: '/wish', label: 'Sign a wish' },
      { to: '/docs/unlocking', label: 'Unlock and decrypt' },
      { to: '/docs/windows', label: 'Windows' },
      { to: '/docs/trust', label: 'Trust model' },
    ],
  },
  {
    h: 'Developers',
    links: [
      { to: '/docs/api', label: 'API' },
      { to: '/api/mcp.json', label: 'MCP server', ext: true },
      { to: '/api/v1/proofs.json', label: 'Proofs JSON', ext: true },
      { to: '/docs', label: 'Docs' },
    ],
  },
  {
    h: 'Legal',
    links: [
      { to: '/terms', label: 'Terms' },
      { to: '/privacy', label: 'Privacy' },
      { to: '/cookies', label: 'Cookies' },
      { to: '/docs/overview#takedown', label: 'Takedown' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="ftr">
      <div className="cols">
        <div className="brand">
          <img src={BRAND.mark} alt="" width={72} height={72} />
          <div className="nm">{BRAND.name}</div>
          <a className="pill white" href={BRAND.xUrl} target="_blank" rel="noopener">
            <XIcon /> Follow on X
          </a>
          {BRAND.token && (
            <p className="gdpr">
              ${BRAND.ticker}{' '}
              <a href={`https://solscan.io/token/${BRAND.token}`} target="_blank" rel="noopener">
                {short(BRAND.token, 6, 6)}
              </a>
            </p>
          )}
          <p className="gdpr">
            GDPR: the site keeps the wallet addresses, signed messages and encrypted archives you send it, nothing more. No tracking, no optional cookies. Access or erasure via the privacy page.
          </p>
        </div>
        {COLS.map((c) => (
          <div className="col" key={c.h}>
            <h5>{c.h}</h5>
            {c.links.map((l) =>
              l.ext ? (
                <a key={l.label} href={l.to}>
                  {l.label}
                </a>
              ) : (
                <Link key={l.label} to={l.to}>
                  {l.label}
                </Link>
              ),
            )}
          </div>
        ))}
      </div>
      <div className="giant" aria-hidden="true">
        {BRAND.name}
      </div>
      <div className="base">
        <span>{BRAND.tagline}</span>
        <span>Times in UTC</span>
      </div>
    </footer>
  );
}
