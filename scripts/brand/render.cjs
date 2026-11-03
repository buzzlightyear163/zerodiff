// Renderar ZERO DIFF-grafiken med Playwright (kodad, ingen bildgenerator):
//   public/assets/brand: mark.svg, favicon.svg, icon-32/192/512.png, apple-touch-icon.png, og.png
//   branding/: logo.svg, pfp.png (1000x1000), banner.png (1500x500), og.png (1200x630)
// Kör: node scripts/brand/render.cjs   (kräver playwright: npm i -D playwright && npx playwright install chromium)

const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const { mark } = require('./mark.cjs');

const ROOT = path.resolve(__dirname, '..', '..');
const PUB = path.join(ROOT, 'public', 'assets', 'brand');
const OUT = path.join(ROOT, 'branding');
const TMP = path.join(ROOT, 'node_modules', '.brand-tmp');
[PUB, OUT, TMP].forEach((d) => fs.mkdirSync(d, { recursive: true }));

const FONT_DISPLAY = path.join(ROOT, 'node_modules/@fontsource-variable/martian-mono/files/martian-mono-latin-wdth-normal.woff2');
const FONT_MONO = path.join(ROOT, 'node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2');
const FONT_MONO6 = path.join(ROOT, 'node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-600-normal.woff2');

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const BASE_CSS = `
@font-face { font-family: 'MM'; src: url('file://${FONT_DISPLAY}') format('woff2'); font-weight: 100 800; font-stretch: 75% 112.5%; }
@font-face { font-family: 'PX'; src: url('file://${FONT_MONO}') format('woff2'); font-weight: 500; }
@font-face { font-family: 'PX'; src: url('file://${FONT_MONO6}') format('woff2'); font-weight: 600; }
* { box-sizing: border-box; margin: 0; }
body { background: #0e0e0e; color: #d9d9d9; font-family: 'PX', monospace; overflow: hidden; }
.grain { position: absolute; inset: 0; opacity: .07; background-image: ${GRAIN}; pointer-events: none; }
.disp { font-family: 'MM'; font-stretch: 75%; font-variation-settings: 'wdth' 75; text-transform: uppercase; }
`;

// Sfär av hex-bytes (samma algoritm som sajtens canvas), stillbild.
const SPHERE_JS = `
function drawSphere(cv, opts) {
  const o = Object.assign({ rows: 30, per: 50, t: 7.3, R: 0.42, band: 0.35 }, opts || {});
  const SRC = 'pub fn process_instruction(program_id: &Pubkey, accounts: &[AccountInfo], input: &[u8]) -> ProgramResult { let memo = from_utf8(input)?; msg!("diff {}", 0); Ok(()) }';
  const ctx = cv.getContext('2d'); const w = cv.width, h = cv.height;
  const R = o.R * Math.min(w, h), cx = w / 2, cy = h / 2;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const C = Math.cos(-0.32), S = Math.sin(-0.32); let idx = 0;
  const size = Math.max(8, R / 21);
  for (let i = 0; i < o.rows; i++) {
    const lat = -Math.PI / 2 + ((i + .5) / o.rows) * Math.PI;
    const n = Math.max(4, Math.round(Math.cos(lat) * o.per));
    for (let j = 0; j < n; j++) {
      const byte = (Math.imul(idx + 1, 0x9e3779b1) >>> 0) & 255; const off = (2 * idx) % SRC.length; idx++;
      const lon = (j / n) * Math.PI * 2 + 0.18 * o.t;
      const x = Math.cos(lat) * Math.sin(lon); let y = Math.sin(lat); let z = Math.cos(lat) * Math.cos(lon);
      const y2 = C * y - S * z; z = S * y + C * z; y = y2;
      if (z < -0.15) continue;
      const hot = Math.abs(lat - o.band) < 0.09;
      const light = 0.18 + 0.82 * Math.max(0, z);
      ctx.font = (hot ? 600 : 400) + ' ' + (size * (0.55 + 0.45 * Math.max(0, z))).toFixed(1) + 'px "PX", monospace';
      ctx.fillStyle = hot ? 'rgba(255,255,255,' + Math.min(1, light + .2) + ')' : 'rgba(217,217,217,' + (.85 * light) + ')';
      ctx.fillText(hot ? SRC.slice(off, off + 2) : byte.toString(16).toUpperCase().padStart(2, '0'), cx + x * R, cy + y * R);
    }
  }
  ctx.strokeStyle = 'rgba(217,217,217,0.3)'; ctx.lineWidth = 1.2; ctx.beginPath();
  ctx.moveTo(cx - 1.15 * R, cy - 1.05 * R); ctx.lineTo(cx + 1.15 * R, cy + 1.05 * R);
  ctx.moveTo(cx + .7 * R, cy - .35 * R); ctx.lineTo(cx + 1.18 * R, cy - .75 * R); ctx.stroke();
}`;

function barcode(seed, h = 64) {
  let x = 0, s = 2166136261; const bars = [];
  for (const c of seed) s = Math.imul(s ^ c.charCodeAt(0), 16777619) >>> 0;
  const r = () => { s = Math.imul(s ^ (s >>> 15), 2246822507) >>> 0; s = Math.imul(s ^ (s >>> 13), 3266489909) >>> 0; return ((s ^= s >>> 16) >>> 0) / 4294967296; };
  while (x < 194) { const w = 1 + Math.floor(r() * 4); bars.push(`<rect x="${x}" y="0" width="${w}" height="${h}" fill="#D9D9D9"/>`); x += w + 1 + Math.floor(r() * 2.4); }
  return `<svg viewBox="0 0 ${x} ${h}" preserveAspectRatio="none" width="100%" height="${h}">${bars.join('')}</svg>`;
}
const SEAL = `<svg viewBox="0 0 24 24" fill="none" width="30" height="30"><path d="M12 2.5 22 20.5H2L12 2.5Z" stroke="#d9d9d9" stroke-width="1.6"/><circle cx="12" cy="14.5" r="1.7" fill="#d9d9d9"/></svg>`;

const page = (body, css = '') => `<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}${css}</style></head><body>${body}<script>${SPHERE_JS}</script></body></html>`;

async function shot(browser, name, w, h, html, outs) {
  const file = path.join(TMP, name + '.html');
  fs.writeFileSync(file, html);
  const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.goto('file://' + file);
  await p.evaluate(async () => { await document.fonts.ready; if (window.afterFonts) window.afterFonts(); });
  await p.waitForTimeout(150);
  for (const o of outs) await p.screenshot({ path: o, type: 'png' });
  await p.close();
}

(async () => {
  // SVG-filer
  fs.writeFileSync(path.join(PUB, 'mark.svg'), mark());
  fs.writeFileSync(path.join(OUT, 'logo.svg'), mark());
  const fav = mark({ simple: true }).replace('viewBox="0 0 100 100" fill="none">', 'viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="20" fill="#0e0e0e"/>');
  fs.writeFileSync(path.join(PUB, 'favicon.svg'), fav);

  const browser = await chromium.launch();

  // Ikoner
  const icon = (simple, s) => page(`<div style="width:${s}px;height:${s}px;background:#0e0e0e;display:grid;place-items:center"><div style="width:${s * 0.92}px;height:${s * 0.92}px">${mark({ simple })}</div></div>`);
  await shot(browser, 'icon32', 32, 32, icon(true, 32), [path.join(PUB, 'icon-32.png')]);
  await shot(browser, 'icon180', 180, 180, icon(false, 180), [path.join(PUB, 'apple-touch-icon.png')]);
  await shot(browser, 'icon192', 192, 192, icon(false, 192), [path.join(PUB, 'icon-192.png')]);
  await shot(browser, 'icon512', 512, 512, icon(false, 512), [path.join(PUB, 'icon-512.png')]);

  // X-profilbild 1000x1000 (visas som cirkel)
  await shot(browser, 'pfp', 1000, 1000, page(`
    <div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 45%, #232323 0%, #171717 55%, #101010 100%)"></div>
    <div style="position:absolute;left:50%;top:50%;width:560px;height:560px;transform:translate(-50%,-50%)">${mark()}</div>
    <div class="grain" style="opacity:.09"></div>`), [path.join(OUT, 'pfp.png')]);

  // X-banner 1500x500: tre höga kort (sfär, diff, biljett) som i originalets stil
  const card = 'position:absolute;top:34px;width:262px;height:432px;border:1px solid #3a3a3a;border-radius:14px;background:#161616;overflow:hidden';
  await shot(browser, 'banner', 1500, 500, page(`
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,#151515,#0f0f0f)"></div>
    <div style="position:absolute;inset:0;display:grid;grid-template-columns:repeat(6,1fr)">${'<span style="border-right:1px solid #1a1a1a"></span>'.repeat(6)}</div>
    <div style="${card};left:592px">
      <canvas id="sph" width="262" height="432" style="position:absolute;inset:0"></canvas>
      <div style="position:absolute;left:18px;bottom:16px;font-size:10px;letter-spacing:.08em;color:#6e6e6e">SBPF FROM MAINNET</div>
    </div>
    <div style="${card};left:874px;padding:22px 20px;font-size:12px;line-height:20px">
      <div style="color:#6e6e6e">--- original.so</div>
      <div style="color:#6e6e6e">+++ candidate.so</div>
      <div style="margin-top:10px">@@ cases 1000/1000 @@</div>
      <div>@@ fuzz&nbsp; 9998/9998 @@</div>
      <div style="margin-top:10px;color:#6e6e6e">&nbsp;logs&nbsp;&nbsp;&nbsp;&nbsp;match</div>
      <div style="color:#6e6e6e">&nbsp;accounts match</div>
      <div style="color:#6e6e6e">&nbsp;return&nbsp;&nbsp;match</div>
      <div class="disp" style="position:absolute;left:20px;bottom:18px;font-size:58px;line-height:52px;font-weight:700;color:#fff">DIFF<br>0</div>
    </div>
    <div style="${card};left:1156px;padding:22px 20px;letter-spacing:.04em;font-size:11px;line-height:19px;text-transform:uppercase">
      ${barcode('zerodiff-0001')}
      <div class="disp" style="color:#fff;font-size:34px;line-height:34px;margin:16px 0 12px;letter-spacing:0">PROOF<br>#0001</div>
      ${[['Match', '1000/1000'], ['Fuzz', '9998/9998'], ['Diff', '0'], ['Source', 'sealed']].map(([k, v]) => `<div style="display:flex;justify-content:space-between;border-bottom:1px solid #2c2c2c;padding:5px 0"><span style="color:#6e6e6e">${k}</span><span>${v}</span></div>`).join('')}
      <div style="position:absolute;left:20px;right:20px;bottom:18px;display:flex;justify-content:space-between;align-items:flex-end"><span>Paid in USDC</span>${SEAL}</div>
    </div>
    <div class="grain"></div>
    <script>window.afterFonts = () => drawSphere(document.getElementById('sph'), { rows: 26, per: 40, R: 0.4 });</script>`), [path.join(OUT, 'banner.png')]);

  // OG-bild 1200x630 i heroens stil
  await shot(browser, 'og', 1200, 630, page(`
    <div style="position:absolute;inset:24px;border-radius:26px;background:#1e1e1e;overflow:hidden">
      <canvas id="sph" width="620" height="620" style="position:absolute;right:-60px;top:-6px;opacity:.95"></canvas>
      <div style="position:absolute;inset:0;background:linear-gradient(90deg,#1e1e1ef5 0%,#1e1e1ebf 45%,#1e1e1e10 80%)"></div>
      <div style="position:absolute;left:70px;top:118px">
        <div class="disp" style="font-weight:600;font-size:104px;line-height:96px;letter-spacing:-.02em;color:#fff"><span style="color:#6e6e6e">Zero diff,</span><br>full<br>payout.</div>
      </div>
      <div style="position:absolute;left:70px;bottom:46px;display:flex;align-items:center;gap:14px;font-size:20px;color:#d9d9d9">
        <div style="width:46px;height:46px">${mark()}</div>
        <span>Byte-exact rebuilds of closed Solana programs</span>
      </div>
      <div class="grain"></div>
    </div>
    <script>window.afterFonts = () => drawSphere(document.getElementById('sph'), { rows: 30, per: 50, R: 0.42 });</script>`), [path.join(OUT, 'og.png'), path.join(PUB, 'og.png')]);

  await browser.close();
  console.log('Klart:', fs.readdirSync(OUT).join(', '), '|', fs.readdirSync(PUB).join(', '));
})();
