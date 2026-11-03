import { Link } from 'react-router-dom';
import { AsciiSphere } from '../components/AsciiSphere';
import { Arrow, StatIcon } from '../components/Icons';
import { Records } from '../components/Records';
import { ReplayDiagram } from '../components/ReplayDiagram';
import { PhotoTicket } from '../components/Ticket';
import { AllTickets } from '../components/ProofTickets';
import { TokenPill } from '../components/TokenPill';
import { BRAND } from '../data/brand';
import { useDragScroll } from '../hooks/useDragScroll';
import { useTitle } from '../hooks/useReveal';
import { PROOFS } from '../lib/api';

const IMG = '/assets/img';

const CARDS = [
  {
    img: `${IMG}/card-wish.jpg`,
    title: 'Wish for a program',
    text: 'Sign a wish for any Solana program id and name the price you would pay. No transaction and no deposit. Your record stays with you on the list: every proof you bought and every one you skipped.',
    cta: 'Sign a wish',
    to: '/wish',
  },
  {
    img: `${IMG}/card-hunt.jpg`,
    title: 'Prove it on spec',
    text: 'Rebuild a closed program as a Rust crate, with or without a wish. Your browser encrypts it, and the judge compiles it and replays real mainnet instructions against the original bytecode. You set the price, from 25 USDC.',
    cta: 'Submit a crate',
    to: '/hunt',
  },
  {
    img: `${IMG}/card-unlock.jpg`,
    title: 'Pay to decrypt',
    text: 'A proof goes public the moment the judge passes it. The buyer pays in USDC, gets the key sealed to their own browser, and the archive is checked against its commitment before the download starts.',
    cta: 'Open the proof wall',
    to: '/proofs',
  },
];

// TODO(branding): monogram-plattor. Lägg officiella logotyper i public/assets/logos/ vid behov.
const MARKS = [
  { name: 'Solana', mono: 'SOL', left: 14, top: 18 },
  { name: 'USDC', mono: '$', left: 30, top: 8 },
  { name: 'Jupiter', mono: 'JUP', left: 72, top: 10 },
  { name: 'Phantom', mono: 'P', left: 84, top: 40 },
  { name: 'Solflare', mono: 'S', left: 78, top: 76 },
  { name: 'Rust', mono: 'R', left: 12, top: 70 },
];

const DOTS: [number, number][] = [
  [22, 34], [40, 22], [58, 16], [66, 30], [88, 18], [8, 46], [26, 54], [92, 60],
  [70, 88], [34, 90], [18, 88], [50, 94], [86, 92], [4, 26], [62, 4],
];

const STATS = [
  { icon: 'grid' as const, n: '92%', t: 'to the hunter at once', src: '/docs/unlocking', p: 'Sent by the keeper once the unlock payment lands, recorded with a Memo on Solana.' },
  { icon: 'clock' as const, n: '7 days', t: 'for the requester', src: '/docs/windows', p: 'The wish signer gets first right to buy a proof made on it, then the proof opens to everyone.' },
  { icon: 'cube' as const, n: '8%', t: 'bought and burned', src: '/docs/token', p: `Of every unlock, swapped into $${BRAND.ticker} on Jupiter and burned.` },
];

const WALL_PHOTOS = [
  { img: `${IMG}/wall-scope.jpg`, cap: 'Original and candidate run side by side' },
  { img: `${IMG}/wall-tape.jpg`, cap: 'Real mainnet instructions first, fuzzed ones after' },
  { img: `${IMG}/wall-cards.jpg`, cap: 'Compute-unit lines stripped, every other log line compared' },
  { img: `${IMG}/wall-fiche.jpg`, cap: 'The corpus freezes when the target is snapshotted' },
];

export function Home() {
  useTitle(null, BRAND.name);
  const wallRef = useDragScroll<HTMLDivElement>();
  const p = PROOFS[0];

  return (
    <>
      <section className="hero">
        <div className="photo" style={{ backgroundImage: `url(${IMG}/hero-room.jpg)` }} />
        <AsciiSphere />
        <div className="copy">
          <h1 className="h1">
            <span className="dim">Zero diff,</span>
            <br />
            full
            <br />
            payout.
          </h1>
          <p className="lead">
            Rebuild a closed program until it diffs to zero against mainnet. The proof goes public, the source stays sealed, and whoever wants it pays you in USDC to unlock it.
          </p>
          <div className="ctas">
            <Link className="pill white" to="/hunt">
              Hunt a program
            </Link>
            <Link className="pill dark" to="/wish">
              Sign a wish
            </Link>
          </div>
          <TokenPill />
        </div>
      </section>

      <section className="sec">
        <div className="cards3">
          {CARDS.map((c) => (
            <article className="c3 reveal" key={c.title}>
              <div className="img" style={{ backgroundImage: `url(${c.img})` }} role="img" aria-label="" />
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <Link className="pill line" to={c.to}>
                {c.cta} <Arrow />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="hexfield" aria-label="Integrations">
        {DOTS.map(([l, t], i) => (
          <span key={i} className="dot" style={{ left: `${l}%`, top: `${t}%`, animationDelay: `${-0.7 * i}s` }} />
        ))}
        {MARKS.map((m, i) => (
          <div key={m.name} className="mark" style={{ left: `${m.left}%`, top: `${m.top}%`, animationDelay: `${-1.1 * i}s` }}>
            <span className="tile">
              <span style={{ fontWeight: 600, color: 'var(--white)', fontSize: m.mono.length > 1 ? 13 : 20 }}>{m.mono}</span>
            </span>
            {m.name}
          </div>
        ))}
        <div className="bighex">
          <svg viewBox="0 0 470 540" fill="none" preserveAspectRatio="none" aria-hidden="true">
            <path d="M235 2 L468 136 L468 404 L235 538 L2 404 L2 136 Z" stroke="#D9D9D9" strokeWidth="2.5" />
          </svg>
          <p>Any closed Solana program, rebuilt as source and replayed against mainnet.</p>
          <Link className="pill line" style={{ position: 'relative' }} to="/docs/judge">
            How the judge works <Arrow />
          </Link>
        </div>
      </section>

      <section className="sec band">
        <div className="wrap center">
          <h2 className="h2 reveal">The rules in numbers</h2>
          <div className="stats">
            {STATS.map((s) => (
              <div className="stat reveal" key={s.n}>
                <StatIcon kind={s.icon} />
                <div className="n">{s.n}</div>
                <div className="t">{s.t}</div>
                <Link className="src" to={s.src}>
                  Source
                </Link>
                <p>{s.p}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 60 }}>
            <Link className="pill dark" style={{ background: '#0e0e0e' }} to="/proofs">
              See every proof <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <h2 className="h2 center reveal">Submit a crate, get a verdict</h2>
          <div className="two">
            <div className="reveal">
              <div className="panel">
                <ReplayDiagram />
              </div>
              <span className="label">Replay</span>
              <p className="body">The judge builds your crate itself on a pinned toolchain, then runs the original and your binary in two identical SVMs on the same mainnet instructions and account states.</p>
              <Link className="pill line" to="/docs/hunting">
                Submission rules <Arrow />
              </Link>
            </div>
            <div className="reveal">
              <div className="panel">
                <div className="report">
                  {[
                    ['verdict', 'PASS'],
                    ['program', 'MemoSq4g...DLGmfcHr'],
                    ['cases', `${p.match.matched}/${p.match.total}`],
                    ['fuzz', `${p.match.fuzzMatched}/${p.match.fuzzTotal}`],
                    ['original', p.binaries.original.slice(0, 24)],
                    ['candidate', p.binaries.candidate.slice(0, 24)],
                    ['corpus', p.corpusSha256.slice(0, 24)],
                    ['source', p.sourceCommitment.slice(0, 24)],
                    ['report', p.reportSha256.slice(0, 24)],
                    ['toolchain', p.toolchain],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <b>{k.padEnd(10, ' ')}</b>
                      {v}
                    </div>
                  ))}
                </div>
              </div>
              <span className="label">Verdict</span>
              <p className="body">Every case has to match: result, error code, each writable account byte, return data and logs. A single difference means FAIL, and the report points to it.</p>
              <Link className="pill line" to="/verifier">
                Re-run a verdict <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="sec band" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <h2 className="h2 center reveal" style={{ marginBottom: 50 }}>
          The proof wall
        </h2>
        <div className="wall" ref={wallRef}>
          <AllTickets />
          {WALL_PHOTOS.map((w) => (
            <PhotoTicket key={w.img} img={w.img} cap={w.cap} />
          ))}
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <h2 className="h2 center reveal">Wanted, proven, sold</h2>
          <Records />
          <div className="center" style={{ marginTop: 44 }}>
            <Link className="pill line" to="/wishes">
              Every wish <Arrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="sec center" style={{ paddingTop: 40 }}>
        <h2 className="h2 reveal">Want a closed program opened?</h2>
        <div style={{ marginTop: 26 }}>
          <Link className="pill white" to="/wish">
            Sign a wish <Arrow />
          </Link>
        </div>
      </section>

      <section className="tech reveal">
        <div className="art" style={{ backgroundImage: `url(${IMG}/ascii-sphere.jpg)` }} role="img" aria-label="A sphere drawn in hexadecimal bytes" />
        <div className="txt">
          <h2 className="h2">The judge builds the crate itself</h2>
          <p>
            Submitted binaries are never trusted. The judge compiles your Rust crate with a pinned cargo build-sbf on its own machine, with no secrets and a ten-minute limit, then replays the corpus against both binaries under the same compute budget. A PASS needs at least 100 cases where the original succeeds.
          </p>
          <Link className="pill white" to="/docs/judge">
            Read the judge docs <Arrow />
          </Link>
        </div>
      </section>

      <section className="final">
        <div className="cubebox" aria-hidden="true">
          <div className="cube">
            {['cube-barcode', 'card-hunt', 'cube-lock', 'wall-fiche', 'card-unlock', 'stairwell'].map((img, i) => (
              <div key={img} className={`f f${i + 1}`} style={{ backgroundImage: `url(${IMG}/${img}.jpg)` }} />
            ))}
          </div>
        </div>
        <div className="bigpills">
          <Link className="bigpill hot" to="/hunt">
            Start hunting <span>→</span>
          </Link>
          <Link className="bigpill" to="/wish">
            Sign a wish <span>→</span>
          </Link>
          <a className="bigpill" href={BRAND.xUrl} target="_blank" rel="noopener">
            Follow on X <span>→</span>
          </a>
        </div>
      </section>
    </>
  );
}
