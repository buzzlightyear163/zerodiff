import { useState } from 'react';
import { Link } from 'react-router-dom';
import { short } from '../data/brand';
import { PROOFS, VERDICTS } from '../lib/api';
import { useWishes } from '../lib/wishes';

type Tab = 'wishes' | 'proofs' | 'verdicts';

interface Rec {
  href: string;
  tag: string;
  title: string;
  text: string;
}

const EMPTY: Record<Tab, { text: string; href: string; cta: string }> = {
  wishes: { text: 'No wish signed yet. A wish is free: a program id, the price you would pay, and a signature.', href: '/wish', cta: 'Sign the first wish' },
  proofs: { text: 'No proof has passed the judge on this instance yet.', href: '/hunt', cta: 'Submit a crate' },
  verdicts: { text: 'No verdict yet. The judge runs its calibration first.', href: '/docs/judge', cta: 'How the judge works' },
};

export function Records() {
  const [tab, setTab] = useState<Tab>('wishes');
  const wishes = useWishes();

  const data: Record<Tab, Rec[]> = {
    wishes: wishes.map((w) => ({ href: '/wishes', tag: `${w.price} USDC`, title: w.program, text: `Signed by ${short(w.wallet, 4, 4)}` })),
    proofs: PROOFS.map((p) => ({ href: `/proofs/${p.id}`, tag: `#${p.id}`, title: p.program, text: `Match ${p.match.matched}/${p.match.total}, ${p.status}` })),
    verdicts: [
      ...PROOFS.map((p) => ({ href: `/proofs/${p.id}`, tag: 'PASS', title: p.program, text: `${p.match.matched}/${p.match.total} cases matched, ${p.status}` })),
      ...VERDICTS.map((v) => ({ href: `/proofs/v/${v.id}`, tag: v.verdict, title: v.program, text: `${v.cases.matched}/${v.cases.total} cases matched, calibration` })),
    ],
  };
  const list = data[tab];
  const empty = EMPTY[tab];

  return (
    <>
      <div className="tabs" role="tablist">
        {(['wishes', 'proofs', 'verdicts'] as Tab[]).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} className={`tab${tab === t ? ' on' : ''}`} onClick={() => setTab(t)} type="button">
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <div className="grid4">
        {list.length === 0 ? (
          <div className="empty">
            <p>{empty.text}</p>
            <Link className="pill white" to={empty.href}>
              {empty.cta}
            </Link>
          </div>
        ) : (
          list.slice(0, 8).map((r) => (
            <Link className="rec" to={r.href} key={r.href + r.tag + r.title}>
              <div className="top">
                <span className="label" style={{ fontSize: 13 }}>
                  {r.tag}
                </span>
                <span className="more">
                  Open <b className="box">&gt;</b>
                </span>
              </div>
              <h4>{r.title.length > 30 ? short(r.title, 8, 8) : r.title}</h4>
              <p>{r.text}</p>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
