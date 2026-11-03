import { useEffect, useRef } from 'react';

/* Roterande sfär av hex-bytes på canvas. Under pekaren och längs ett svepande
   latitudband byts bytes mot källkodstecken. Beteende rekonstruerat från referensen. */

const SOURCE =
  'pub fn process_instruction(program_id: &Pubkey, accounts: &[AccountInfo], input: &[u8]) -> ProgramResult { let memo = from_utf8(input).map_err(|_| ProgramError::InvalidInstructionData)?; for a in accounts { if !a.is_signer { return Err(ProgramError::MissingRequiredSignature); } } msg!("Memo (len {}): {:?}", memo.len(), memo); Ok(()) }'.replace(
    /\s+/g,
    ' ',
  );

interface Glyph {
  lat: number;
  lon: number;
  hex: string;
  ch: string;
}

const TILT_COS = Math.cos(-0.32);
const TILT_SIN = Math.sin(-0.32);

export function AsciiSphere({ className = 'sphere' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const mobile = window.matchMedia('(max-width: 760px)').matches;
    const rows = mobile ? 22 : 30;
    const glyphs: Glyph[] = [];
    let idx = 0;
    for (let i = 0; i < rows; i++) {
      const lat = -Math.PI / 2 + ((i + 0.5) / rows) * Math.PI;
      const n = Math.max(4, Math.round(Math.cos(lat) * (mobile ? 34 : 50)));
      for (let j = 0; j < n; j++) {
        const byte = (Math.imul(idx + 1, 0x9e3779b1) >>> 0) & 255;
        const o = (2 * idx) % SOURCE.length;
        glyphs.push({ lat, lon: (j / n) * Math.PI * 2, hex: byte.toString(16).toUpperCase().padStart(2, '0'), ch: SOURCE.slice(o, o + 2) });
        idx++;
      }
    }

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = w * dpr;
      cv.height = h * dpr;
    };
    resize();

    const ptr = { x: -1e4, y: -1e4 };
    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
    };
    const onLeave = () => {
      ptr.x = -1e4;
      ptr.y = -1e4;
    };
    cv.addEventListener('pointermove', onMove);
    cv.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', resize);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(cv);

    let raf = 0;
    let last = 0;
    const t0 = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden || (mobile && now - last < 33)) return;
      last = now;
      const t = (now - t0) / 1000;
      const R = 0.42 * Math.min(w, h);
      const cx = w / 2;
      const cy = h / 2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const spin = 0.18 * t;
      const band = 1.1 * Math.sin(0.35 * t);
      const size = Math.max(8, R / (mobile ? 15 : 21));
      for (const g of glyphs) {
        const lon = g.lon + spin;
        const x = Math.cos(g.lat) * Math.sin(lon);
        let y = Math.sin(g.lat);
        let z = Math.cos(g.lat) * Math.cos(lon);
        const y2 = TILT_COS * y - TILT_SIN * z;
        z = TILT_SIN * y + TILT_COS * z;
        y = y2;
        if (z < -0.15) continue;
        const px = cx + x * R;
        const py = cy + y * R;
        const near = Math.max(Math.max(0, 1 - Math.hypot(px - ptr.x, py - ptr.y) / (0.45 * R)), 0.9 * Math.max(0, 1 - Math.abs(g.lat - band) / 0.18));
        const light = 0.18 + 0.82 * Math.max(0, z);
        const fs = size * (0.55 + 0.45 * Math.max(0, z));
        const hot = near > 0.5;
        ctx.font = `${hot ? 600 : 400} ${fs.toFixed(1)}px ui-monospace, Menlo, monospace`;
        ctx.fillStyle = hot ? `rgba(255,255,255,${Math.min(1, light + 0.2).toFixed(3)})` : `rgba(217,217,217,${(0.85 * light).toFixed(3)})`;
        ctx.fillText(hot ? g.ch : g.hex, px, py);
      }
      ctx.strokeStyle = 'rgba(217,217,217,0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 1.15 * R, cy - 1.05 * R);
      ctx.lineTo(cx + 1.15 * R, cy + 1.05 * R);
      ctx.moveTo(cx + 0.7 * R, cy - 0.35 * R);
      ctx.lineTo(cx + 1.18 * R, cy - 0.75 * R);
      ctx.stroke();
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      cv.removeEventListener('pointermove', onMove);
      cv.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-label="A sphere of bytecode that resolves into source under the pointer" role="img" />;
}
