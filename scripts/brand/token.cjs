// Token-bilder för $ZERODIFF (1000x1000), kodade och renderade med Playwright.
// Kör: node scripts/brand/token.cjs  -> branding/token/*.png + preview.png
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { mark } = require('./mark.cjs');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'branding', 'token');
const TMP = path.join(ROOT, 'node_modules', '.brand-tmp');
[OUT, TMP].forEach((d) => fs.mkdirSync(d, { recursive: true }));
const F = (p) => 'file://' + path.join(ROOT, 'node_modules', p);

const CSS = `
@font-face { font-family: 'MM'; src: url('${F('@fontsource-variable/martian-mono/files/martian-mono-latin-wdth-normal.woff2')}') format('woff2'); font-weight: 100 800; font-stretch: 75% 112.5%; }
@font-face { font-family: 'PX'; src: url('${F('@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2')}') format('woff2'); font-weight: 500; }
@font-face { font-family: 'PX'; src: url('${F('@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-600-normal.woff2')}') format('woff2'); font-weight: 600; }
* { margin: 0; box-sizing: border-box; } html, body { width: 1000px; height: 1000px; overflow: hidden; background: #0e0e0e; }
.grain { position: absolute; inset: 0; pointer-events: none; opacity: .08; background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>"); }
.disp { font-family: 'MM'; font-stretch: 75%; font-variation-settings: 'wdth' 75; }
`;

// 1) BYTES: ett snedstreckat Ø i hakparenteser byggt av byte-pixlar, på ett fält av dimmiga hex-bytes.
const BYTES = `<canvas id="c" width="1000" height="1000"></canvas><div class="grain"></div>
<script>
window.draw = () => {
  const c = document.getElementById('c'), x = c.getContext('2d');
  const g = x.createRadialGradient(500, 470, 60, 500, 500, 720);
  g.addColorStop(0, '#1e1e1e'); g.addColorStop(1, '#0a0a0a');
  x.fillStyle = g; x.fillRect(0, 0, 1000, 1000);
  const S = 40, N = 25;
  const on = new Set();
  const add = (q, r) => on.add(q + ',' + r);
  // Nolla: handritad pixel-oval (kolumn 8–16, rad 4–20), 2 celler tjock
  const spans = { 4: [[10, 14]], 5: [[9, 15]], 6: [[8, 10], [14, 16]], 18: [[8, 10], [14, 16]], 19: [[9, 15]], 20: [[10, 14]] };
  for (let r = 4; r <= 20; r++) for (const [a, b] of spans[r] || [[8, 9], [15, 16]]) for (let q = a; q <= b; q++) add(q, r);
  // Snedstreck "/" som går en cell utanför ovalen i båda ändar
  for (let r = 3; r <= 21; r++) { const q = 15 - Math.floor((r - 3) / 3); add(q, r); add(q + 1, r); }
  // Hakparenteser
  for (let r = 4; r <= 20; r++) { add(3, r); add(21, r); }
  for (const r of [4, 20]) { add(4, r); add(5, r); add(20, r); add(19, r); }
  x.textAlign = 'center'; x.textBaseline = 'middle';
  let k = 11;
  for (let r = 0; r < N; r++) for (let q = 0; q < N; q++) {
    const px = q * S + S / 2, py = r * S + S / 2;
    k = Math.imul(k + 1, 0x9e3779b1) >>> 0;
    const hx = (k & 255).toString(16).toUpperCase().padStart(2, '0');
    if (on.has(q + ',' + r)) {
      x.fillStyle = '#ededed';
      x.beginPath(); x.roundRect(px - S / 2 + 2.5, py - S / 2 + 2.5, S - 5, S - 5, 4); x.fill();
      x.fillStyle = '#8a8a8a'; x.font = '600 15px PX, monospace'; x.fillText(hx, px, py + 1);
    } else {
      const d = Math.hypot(px - 500, py - 500) / 720;
      x.fillStyle = 'rgba(217,217,217,' + Math.max(0.03, 0.17 - d * 0.13).toFixed(3) + ')';
      x.font = '500 15px PX, monospace'; x.fillText(hx, px, py + 1);
    }
  }
};
</script>`;

// 2) INVERT: svart [Ø] på ljus botten – sticker ut i mörka listor.
const HEAVY = mark({ fg: '#0e0e0e' })
  .replace(/stroke-width="3"/g, 'stroke-width="5"')
  .replace(/stroke-width="2.2"/g, 'stroke-width="3.4"')
  .replace(/stroke-width="1.35"/g, 'stroke-width="1.9"')
  .replace(/stroke-width="1.7"/g, 'stroke-width="2.6"')
  .replace(/stroke-width="5.4"/g, 'stroke-width="7.5"');
const INVERT = `<div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 42%,#f4f4f2 0%,#dcdcd8 100%)"></div>
<div style="position:absolute;left:50%;top:50%;width:700px;height:700px;transform:translate(-50%,-50%)">${HEAVY}</div>
<div class="grain" style="opacity:.12;mix-blend-mode:multiply;filter:invert(1)"></div>`;

// 3) TERMINAL: diff mellan original och kandidat ger exit-kod 0.
const TERMINAL = `<div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 40%,#1d1d1d,#0a0a0a)"></div>
<div style="position:absolute;left:80px;top:100px;width:840px;height:800px;border:2px solid #343434;border-radius:28px;background:#131313;overflow:hidden;box-shadow:0 40px 90px #000a">
  <div style="height:70px;border-bottom:2px solid #262626;display:flex;align-items:center;gap:14px;padding:0 30px">
    <span style="width:18px;height:18px;border-radius:50%;background:#3c3c3c"></span><span style="width:18px;height:18px;border-radius:50%;background:#3c3c3c"></span><span style="width:18px;height:18px;border-radius:50%;background:#3c3c3c"></span>
    <span style="margin-left:auto;font:500 22px PX,monospace;color:#6e6e6e">judge</span>
  </div>
  <div style="padding:42px 50px;font:500 36px/54px PX,monospace;color:#d9d9d9">
    <div><span style="color:#6e6e6e">$</span> diff original.so candidate.so</div>
    <div><span style="color:#6e6e6e">$</span> echo $?</div>
  </div>
  <div style="position:absolute;left:48px;bottom:46px;display:flex;align-items:flex-end;gap:26px">
    <span class="disp" style="font-weight:700;font-size:500px;line-height:430px;color:#fff">0</span>
    <span style="width:110px;height:190px;background:#fff;margin-bottom:22px"></span>
  </div>
</div>
<div class="grain"></div>`;

(async () => {
  const b = await chromium.launch();
  const variants = { bytes: BYTES, invert: INVERT, terminal: TERMINAL };
  for (const [name, body] of Object.entries(variants)) {
    const file = path.join(TMP, `token-${name}.html`);
    fs.writeFileSync(file, `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>${body}</body></html>`);
    const p = await b.newPage({ viewport: { width: 1000, height: 1000 } });
    await p.goto('file://' + file);
    await p.evaluate(async () => { await Promise.all(['500 15px PX', '600 15px PX', '700 100px MM'].map((f) => document.fonts.load(f))); await document.fonts.ready; if (window.draw) window.draw(); });
    await p.waitForTimeout(150);
    await p.screenshot({ path: path.join(OUT, `token-${name}.png`) });
    await p.close();
  }
  // Förhandsvisning: full storlek + rund thumbnail i 128 och 56 px, som i pump.fun-listor
  const names = Object.keys(variants);
  const p = await b.newPage({ viewport: { width: 1260, height: 560 } });
  const img = (n) => 'file://' + path.join(OUT, `token-${n}.png`);
  const prev = path.join(TMP, 'token-preview.html');
  fs.writeFileSync(prev, `<body style="margin:0;background:#151515;font-family:monospace;color:#888;display:flex;gap:30px;padding:30px">
    ${names.map((n) => `<div style="display:grid;gap:14px;justify-items:center"><img src="${img(n)}" width="360" height="360" style="border-radius:16px">
      <div style="display:flex;gap:18px;align-items:center"><img src="${img(n)}" width="128" height="128" style="border-radius:50%"><img src="${img(n)}" width="56" height="56" style="border-radius:50%"><img src="${img(n)}" width="32" height="32" style="border-radius:50%"></div><div>${n}</div></div>`).join('')}
  </body>`);
  await p.goto('file://' + prev);
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(OUT, 'preview.png') });
  await b.close();
  console.log('Klart:', fs.readdirSync(OUT).join(', '));
})();
