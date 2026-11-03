# Referensanalys – proofofdecompile.com

Analyserad 2026-11-03 via webbläsare (DOM, stylesheet, klientskript, sitemap).

## Teknik

- Next.js (App Router, Turbopack), en egen CSS-fil (~27 kB, ingen Tailwind).
- Typsnitt: Martian Mono (display, `font-stretch: 75%`, wdth 75) och IBM Plex Mono (brödtext).
- Klientkomponenter: `AsciiSphere` (canvas), `Reveal` (IntersectionObserver), `TokenPill`, `Records` (flikar), wallet-modal.
- `robots.txt` blockerar `/api/judge`, `/api/cron`, `/unlock`.

## Routes (från sitemap + länkar)

`/`, `/proofs`, `/proofs/:id`, `/proofs/v/:id`, `/wishes`, `/wish`, `/hunt`, `/verifier`, `/vault`, `/docs` (+ overview, wishing, hunting, judge, unlocking, windows, api, pod, trust), `/terms`, `/privacy`, `/cookies`, 404.
API: `/api/v1/proofs`, `/api/v1/proofs/:id`, `/api/v1/wishes`, `/api/mcp`, `/api/proofs/:id/ciphertext|source`, `/api/verifier/corpus/:sha`.

Klonens avvikelse: `/docs/pod` heter `/docs/token` (tickerneutralt), med omdirigering.

## Layout (startsida, 1280 px)

| Sektion | Höjd |
|---|---|
| Header (sticky, blur) | 70 |
| Hero (rundad 30px, foto 32 % opacitet, gradient, canvas-sfär 700px) | 796 |
| Tre kort (360px, gap 86, 3D-tilt på hover) | 900 |
| Hexfält (15 bobbande hexagoner, 6 integrationsplattor, stor hexagon) | 940 |
| Statistik (band, 3 kolumner med hex-ikoner) | 849 |
| Replay + Verdict (två paneler 480px) | 1103 |
| Bevisvägg (horisontell scroll-snap, dra-scroll) | ~900 |
| Flikar Wishes/Proofs/Verdicts (grid 4) | 663 |
| CTA | 269 |
| Tech-block (två kolumner, 752px) | 752 |
| Kub (CSS 3D, 26 s rotation) + tre stora pill-länkar | 740 |
| Footer (6 kolumner, jättetext 15.2vw) | 701 |

## Designsystem

- Färger: `--bg #0e0e0e`, `--card #1e1e1e`, `--card-2 #171717`, `--line #2c2c2c`, `--fg #d9d9d9`, `--white #fff`, `--muted #6e6e6e`, `--warn #9a9a9a`.
- Easing: `cubic-bezier(.4,0,.2,1)`, övergångar 0.3 s.
- Typografi: H1 108/100 (mobil 50/48), H2 40/44 (mobil 30/34), lead 22/30.25, brödtext 16/24, etiketter versaler 12–16.
- Radier: hero 30, kort/paneler 12, pills 40, fält 8.
- Komponenter: pill (white/dark/line/big), ticket (+fail streckad, photo), rec-kort, tabs, form/field/check/steps, kv-tabell, tbl, code, modal, docs-nav, legal.
- Effekter: fast rutnät (6 kolumner), animerat SVG-brus (grain), backdrop-blur i header, grayscale på foton.

## Breakpoints

- `≤1200px`: nav döljs → hamburgare med helskärmsmeny (44px Martian Mono), kort staplas (max 460px), tvåkolumnsblock blir en kolumn, grid4 → 2, footer 3 kolumner.
- `≤760px`: hero `min-height 900`, text i botten, sfär 330px överst; footer 2 kolumner; docs-nav blir horisontell scroll.

## Animationer

- `grain` 1.2 s steps(6), `bob` 6–7 s alternate (hexagoner/plattor), `spin-cube` 26 s linear.
- `.reveal`: opacity + translateY(24px) 0.9 s när elementet syns.
- Canvas-sfär: hex-bytes på roterande sfär (0.18 rad/s), lutning 0.32 rad, svepande latitudband och pekare byter bytes mot källkodstecken. 30 fps på mobil.
- Hover: kort 3D-tilt, pill-pil 3px, färgbyten.

## Funktioner

- Wallet-modal (Phantom, Solflare, Backpack, "install" om saknas).
- Kopiera kontraktsadress ("copied" i 1.5 s).
- Flikar med tomma lägen per flik.
- Formulär för önskan och inskick (signerade meddelanden, kryptering i webbläsaren).
- Commitment-kontroll av fil på bevissidan.

## Externa integrationer

Solana (wallets, Solscan-länkar), pump.fun, Jupiter (swap/burn, server-side), X (dela/följ), GitHub (kalibreringskälla), LiteSVM-baserad replayer på separat maskin.
