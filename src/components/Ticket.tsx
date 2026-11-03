import { Seal } from './Icons';

/** Deterministisk streckkod från en hash-sträng (samma hash ger samma kod). */
export function Barcode({ seed }: { seed: string }) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
  const rand = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    h = Math.imul(h ^ (h >>> 13), 3266489909) >>> 0;
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
  const bars: { x: number; w: number }[] = [];
  let x = 0;
  while (x < 194) {
    const w = 1 + Math.floor(rand() * 4);
    bars.push({ x, w });
    x += w + 1 + Math.floor(rand() * 2.4);
  }
  const width = x;
  return (
    <svg className="bar" viewBox={`0 0 ${width} 64`} preserveAspectRatio="none" width="100%" height="64" aria-hidden="true">
      {bars.map((b) => (
        <rect key={b.x} x={b.x} y="0" width={b.w} height="64" fill="#D9D9D9" />
      ))}
    </svg>
  );
}

export interface TicketRow {
  k: string;
  v: string;
}

export function Ticket({ title, rows, seed, fail, footLabel }: { title: string; rows: TicketRow[]; seed: string; fail?: boolean; footLabel: string }) {
  return (
    <div className={`ticket${fail ? ' fail' : ''}`}>
      <Barcode seed={seed} />
      <div className="big">{title}</div>
      {rows.map((r) => (
        <div className="row" key={r.k}>
          <span>{r.k}</span>
          <span>{r.v}</span>
        </div>
      ))}
      <div className="foot">
        <span>{footLabel}</span>
        <Seal className="" />
      </div>
    </div>
  );
}

export function PhotoTicket({ img, cap }: { img: string; cap: string }) {
  return (
    <div className="ticket photo">
      <div className="ph" style={{ backgroundImage: `url(${img})` }} />
      <div className="cap">{cap}</div>
    </div>
  );
}
