# ZERO DIFF ($ZERODIFF)

**Zero diff, full payout.** Bygg om ett stängt Solana-program tills det matchar mainnet byte för byte, och sälj källkoden i USDC.

Rebrand av klonen av https://www.proofofdecompile.com/ (samma layout, designsystem och funktioner, eget namn och egna loggor). Det som fortfarande är platshållare står i `BRANDING_TODO.md`.

## Varumärke

- Namn: **Zero Diff** · ticker **$ZERODIFF** · tagline "Zero diff, full payout."
- Logga: `[Ø]`, hakparenteser runt en randig, snedstreckad nolla (= noll skillnad). Kodad som SVG i `scripts/brand/mark.cjs`.
- Grafik i `branding/`: `pfp.png` (1000×1000), `banner.png` (1500×500), `og.png` (1200×630), `logo.svg`.
- Sajtens ikoner i `public/assets/brand/`: `mark.svg`, `favicon.svg`, `icon-32/192/512.png`, `apple-touch-icon.png`, `og.png`.
- Rendera om all grafik: `npm i -D playwright && npx playwright install chromium && node scripts/brand/render.cjs`.

## Starta

**Windows:** dubbelklicka `start.bat` (installerar dependencies första gången och startar dev-servern på http://localhost:5173).

Manuellt:

```bash
npm install
npm run dev        # utveckling
npm run build      # tsc -b + vite build -> dist/
npm run preview    # testa produktionsbuilden
```

Kräver Node 18+.

## Routes (25)

| Route | Innehåll |
|---|---|
| `/` | Startsida: hero med canvas-sfär, tre kort, hexfält, statistik, replay/verdict, bevisvägg, flikar, tech-block, kub + stora knappar |
| `/proofs` | Bevisväggen (alla biljetter) |
| `/proofs/:id` | Godkänt bevis (t.ex. `/proofs/0001`) med kv-tabell och commitment-kontroll |
| `/proofs/v/:id` | Underkänd dom (t.ex. `/proofs/v/s04ecafd77b`) med första diff och rapport |
| `/wishes` | Lista över önskningar |
| `/wish` | Signera en önskan (wallet-signerat meddelande) |
| `/hunt` | Skicka in en crate (hash + AES-GCM i webbläsaren) |
| `/verifier` | Filer, kommandon och corpus-tabell |
| `/vault` | Adresser, regel och tomma loggar |
| `/docs`, `/docs/:slug` | Docs med sidomeny: overview, wishing, hunting, judge, unlocking, windows, api, token, trust (`/docs/pod` omdirigeras till `/docs/token`) |
| `/terms`, `/privacy`, `/cookies` | Juridiska sidor (platshållartext) |
| `*` | 404 i samma stil ("No match") |

## Projektstruktur

```
src/
  components/   Header, Footer, WalletModal, AsciiSphere, Ticket, Records, ReplayDiagram, TokenPill, PageHead, Icons
  layouts/      RootLayout (gridlines, grain, header, footer, modal, scroll)
  pages/        Home, Proofs, ProofDetail (+ VerdictDetail), Wishes, Wish, Hunt, Verifier, Vault, Docs, Legal, NotFound
  routes/       AppRoutes (react-router)
  hooks/        useReveal, useTitle, useDragScroll
  lib/          api (fixture + sha256), wallet (Solana-providers), wishes (lokal lagring)
  data/         brand.ts (all branding), docs.tsx, fixtures/proofs.json
  styles/       global.css (designsystemet)
public/
  assets/img    platshållarbilder (genereras av scripts/generate_placeholders.py)
  assets/brand  mark.svg, og.png
  api/          mcp.json (mock)
  verifier/     verify.sh + replayer-src.tar.gz (platshållare)
```

## Dependencies

- `react`, `react-dom`, `react-router-dom`
- `@fontsource-variable/martian-mono` (display, variabel bredd 75 %) och `@fontsource/ibm-plex-mono` (brödtext) – samma typsnitt som referensen, open source (OFL)
- Inga UI- eller animationsbibliotek: all CSS är handskriven, sfären är ren canvas.

## Responsivitet

Samma brytpunkter som referensen: **1200px** (nav → hamburgermeny, kort/kolumner staplas) och **760px** (mobil hero, typskala, footer i två kolumner). Verifierat på 390, 768 och 1280 px. Sektionshöjderna på startsidan matchar referensen exakt på 390 px och inom några pixlar på 1280 px.

Känd egenhet som är kopierad från referensen: på mobil gör token-pillen (`.ca`) att hero-texten blir bredare än skärmen och klipps i högerkanten. Vill du rätta det, lägg till `.hero .copy { min-width: 0 }` och `.ca { flex-wrap: wrap }` i mobil-mediaqueryn.

## API och mock-data

- Bevis och domar: `src/data/fixtures/proofs.json` (kalibreringsdata från referensens publika sida). Samma fil serveras som `/api/v1/proofs.json` i dev och kopieras till `dist/` vid build (Vite-plugin i `vite.config.ts`).
- `/api/mcp.json`: beskrivning av MCP-verktygen (mock).
- Önskningar sparas i `localStorage` så att hela flödet går att testa.

## Wallet / auth

`src/lib/wallet.tsx` ansluter till injicerade Solana-wallets (Phantom, Solflare, Backpack) utan extra paket: connect, disconnect, signMessage och återanslutning efter omladdning. Saknas wallet länkar knappen till installationssidan. I dev finns även **Demo wallet** (eller `VITE_DEMO_WALLET=true`) som ger states: utloggad → ansluter → ansluten → fel.

## Web3

- Kedja: Solana. Token-pill med Solscan- och pump.fun-länkar (adress från `VITE_TOKEN_CA`).
- Inga transaktioner skickas. Inga privata nycklar eller hemligheter används.
- `/hunt` räknar sha256 och krypterar arkivet med AES-256-GCM i webbläsaren (WebCrypto). `/proofs/:id` kan kontrollera en fil mot commitment.

## TODO(backend)

Sök efter `TODO(backend)` i koden. Det som saknas:

- Riktigt API för bevis, domar och önskningar (just nu fixture + localStorage)
- Verifiering av signerade önskningar och läsning av program från mainnet
- Försegling av nyckeln till domarens X25519-nyckel, uppladdning i delar och domarjobbet
- Unlock-flöde (USDC-betalning, escrow, återförsegling av nyckel), ciphertext-nedladdning
- Live-saldon och cron-loggar på `/vault`, riktiga verifier-filer och hashar
- MCP-server på `/api/mcp`

## Ersatta element

Namn, ticker, logga, favicon, og-bild och hero-rubrik är ZERO DIFF. Fortfarande platshållare: kontraktsadress, protokolladresser, fotona i `public/assets/img/`, partnerlogotyper (monogram) och juridiska texter.

## Ändra branding

1. Fyll i `.env` (kopiera `.env.example`) eller ändra `src/data/brand.ts` – CA:n läggs i `VITE_TOKEN_CA` vid launch.
2. Logga och ikoner genereras av `scripts/brand/render.cjs`; titel/meta finns i `index.html` och `public/manifest.webmanifest`.
3. Byt bilderna i `public/assets/img/` (behåll filnamnen, eller ändra i `Home.tsx` och sidorna).
4. Justera texter i `src/pages/Home.tsx`, `src/data/docs.tsx` och `src/pages/Legal.tsx`.
5. Deploy: `vercel.json` innehåller SPA-rewrite.
