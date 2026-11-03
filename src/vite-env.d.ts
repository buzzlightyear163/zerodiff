/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BRAND_NAME?: string;
  readonly VITE_TICKER?: string;
  readonly VITE_TOKEN_CA?: string;
  readonly VITE_X_URL?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_VAULT_ADDRESS?: string;
  readonly VITE_ORPHAN_FUND_ADDRESS?: string;
  readonly VITE_KEEPER_ADDRESS?: string;
  readonly VITE_DEMO_WALLET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
