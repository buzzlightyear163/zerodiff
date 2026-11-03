# Branding TODO – ZERO DIFF

## Klart
- [x] Namn: **Zero Diff**, ticker **$ZERODIFF**, tagline "Zero diff, full payout."
- [x] Logga `[Ø]` (`public/assets/brand/mark.svg`, `branding/logo.svg`)
- [x] Favicon, app-ikoner, manifest, titel och meta-taggar
- [x] X-profilbild `branding/pfp.png` (1000×1000) och banner `branding/banner.png` (1500×500)
- [x] OG-bild `public/assets/brand/og.png` (1200×630)
- [x] Hero-rubrik och lead, footer-jättetext, docs och wish/submit-meddelanden använder namnet automatiskt

## Kvar före launch
- [ ] Kontraktsadress – `VITE_TOKEN_CA` (nu `XXXX…pump`; tom sträng döljer token-pillen)
- [ ] X-handle – förslag `@zerodiffsol` (kolla att det är ledigt), sätt `VITE_X_URL`
- [ ] Domän – förslag `zerodiff.fun` (kolla att den är ledig), sätt `VITE_SITE_URL`
- [ ] `VITE_VAULT_ADDRESS`, `VITE_ORPHAN_FUND_ADDRESS`, `VITE_KEEPER_ADDRESS`

## Kan förbättras
- [ ] Fotona i `public/assets/img/` är enkla genererade platshållare (gråskala). Byt till riktiga bilder med samma filnamn och format.
- [ ] Partner- och wallet-logotyper visas som monogram; lägg officiella logotyper i `public/assets/logos/` vid behov.
- [ ] Juridiska texter (`src/pages/Legal.tsx`) är mallar med `[...]`-luckor.
- [ ] Docs-texterna (`src/data/docs.tsx`) beskriver referensens mekanik; justera om ni ändrar regler, procent eller fönster.
