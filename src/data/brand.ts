// ZERO DIFF – all branding på ett ställe.
// Kan även sättas via .env (se .env.example).

const env = import.meta.env;

export const BRAND = {
  name: env.VITE_BRAND_NAME || 'Zero Diff',
  ticker: env.VITE_TICKER || 'ZERODIFF',
  /** Token-mint (pump.fun). Tom sträng döljer token-pillen. */
  token: env.VITE_TOKEN_CA ?? '8MYvD5S3tTBiEYMCwWS94YMUaMRtDsh7CneCvvNwpump',
  xUrl: env.VITE_X_URL || 'https://x.com/zerodiffsol',
  siteUrl: env.VITE_SITE_URL || 'https://zerodiff.fun',
  tagline: 'Zero diff, full payout. Byte-exact rebuilds of closed Solana programs.',
  mark: '/assets/brand/mark.svg',
  /** Protokollets adresser (platshållare). */
  vault: env.VITE_VAULT_ADDRESS || 'VAULT_ADDRESS_PLACEHOLDER_XXXXXXXXXXXXXXXXXX',
  orphanFund: env.VITE_ORPHAN_FUND_ADDRESS || 'ORPHAN_FUND_ADDRESS_PLACEHOLDER_XXXXXXXXXXX',
  keeper: env.VITE_KEEPER_ADDRESS || 'KEEPER_ADDRESS_PLACEHOLDER_XXXXXXXXXXXXXXXXX',
};

/** Prefix för Memo-poster, härlett från tickern (t.ex. "pod:proof:..."). */
export const MEMO_PREFIX = BRAND.ticker.toLowerCase();

export function short(s: string, a = 6, b = 6): string {
  if (!s || s.length <= a + b + 3) return s;
  return `${s.slice(0, a)}...${s.slice(-b)}`;
}
