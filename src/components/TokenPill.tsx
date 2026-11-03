import { useState } from 'react';
import { BRAND, short } from '../data/brand';

export function TokenPill() {
  const [copied, setCopied] = useState(false);
  if (!BRAND.token) return null;
  const copy = () =>
    navigator.clipboard
      ?.writeText(BRAND.token)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => undefined);
  return (
    <div className="ca">
      <span>${BRAND.ticker}</span>
      <a href={`https://solscan.io/token/${BRAND.token}`} target="_blank" rel="noopener">
        {short(BRAND.token, 6, 6)}
      </a>
      <button type="button" onClick={copy}>
        {copied ? 'copied' : 'copy'}
      </button>
      <a className="pill white" style={{ padding: '3px 14px', fontSize: 12 }} href={`https://pump.fun/coin/${BRAND.token}`} target="_blank" rel="noopener">
        Trade on pump.fun
      </a>
    </div>
  );
}
