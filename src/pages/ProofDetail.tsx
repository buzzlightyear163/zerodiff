import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProofTicket, VerdictTicket } from '../components/ProofTickets';
import { BRAND } from '../data/brand';
import { useTitle } from '../hooks/useReveal';
import { getProof, getVerdict, sha256Hex, utc } from '../lib/api';
import { NotFound } from './NotFound';

const H1_STYLE = { fontSize: 56, lineHeight: '56px', fontFamily: 'var(--display)', fontStretch: '75%', textTransform: 'uppercase' } as const;

function CommitmentCheck({ commitment }: { commitment: string }) {
  const [res, setRes] = useState<string | null>(null);
  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setRes('Hashing...');
    const h = await sha256Hex(await f.arrayBuffer());
    setRes(h === commitment ? `Match: ${h}` : `No match: ${h}`);
  };
  return (
    <div className="field">
      <label htmlFor="vf">Check an archive against this commitment</label>
      <input id="vf" type="file" onChange={(e) => onFile(e.target.files?.[0])} />
      {res && <div className="hint" style={{ wordBreak: 'break-all' }}>{res}</div>}
    </div>
  );
}

export function ProofDetail() {
  const { id = '' } = useParams();
  const p = getProof(id);
  useTitle(p ? `Proof #${p.id}` : 'Not found', BRAND.name);
  if (!p) return <NotFound />;
  const share = `https://x.com/intent/post?url=${encodeURIComponent(`${BRAND.siteUrl}/proofs/${p.id}`)}`;
  return (
    <div className="page">
      <div className="inner" style={{ paddingTop: 20 }}>
        <div className="cols2 tk">
          <ProofTicket p={p} />
          <div style={{ display: 'grid', gap: 22 }}>
            <h1 className="h2" style={H1_STYLE}>
              Proof #{p.id}
            </h1>
            {p.calibration && (
              <div className="note">
                {p.calibration.label} Source:{' '}
                <a href={p.calibration.sourceUrl} target="_blank" rel="noopener" style={{ textDecoration: 'underline' }}>
                  {p.calibration.sourceUrl}
                </a>
              </div>
            )}
            <div className="kv">
              <div>Program</div>
              <div>
                <a href={`https://solscan.io/account/${p.program}`} target="_blank" rel="noopener">
                  {p.program}
                </a>
              </div>
              <div>Match</div>
              <div>
                {p.match.matched}/{p.match.total} cases, {p.match.realCases} from mainnet, {p.match.realOriginalOk} where the original succeeds
              </div>
              <div>Fuzz</div>
              <div>
                {p.match.fuzzMatched}/{p.match.fuzzTotal}
              </div>
              <div>Source commitment</div>
              <div>{p.sourceCommitment}</div>
              <div>Report sha256</div>
              <div>
                <a href="/api/v1/proofs.json">{p.reportSha256}</a>
              </div>
              <div>Corpus sha256</div>
              <div>{p.corpusSha256}</div>
              <div>Original ELF</div>
              <div>{p.binaries.original}</div>
              <div>Candidate ELF</div>
              <div>{p.binaries.candidate}</div>
              <div>Toolchain</div>
              <div>{p.toolchain}</div>
              <div>Memo record</div>
              <div>{p.memo.pending ? 'Memo record pending (posted once the keeper is funded)' : p.memo.signature}</div>
              <div>Passed</div>
              <div>{utc(p.passedAt)}</div>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {p.calibration ? (
                <a className="pill white" href={p.calibration.sourceUrl} target="_blank" rel="noopener">
                  Download the source
                </a>
              ) : (
                <button className="pill white" type="button" disabled title="TODO(backend)">
                  Unlock
                </button>
              )}
              <button className="pill line" type="button" disabled title="TODO(backend): /api/proofs/:id/ciphertext">
                Ciphertext
              </button>
              <a className="pill line" href="/api/v1/proofs.json">
                Report JSON
              </a>
              <a className="pill line" href={share} target="_blank" rel="noopener">
                Post on X
              </a>
            </div>
            <CommitmentCheck commitment={p.sourceCommitment} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function VerdictDetail() {
  const { id = '' } = useParams();
  const v = getVerdict(id);
  useTitle(v ? 'Verdict' : 'Not found', BRAND.name);
  if (!v) return <NotFound />;
  return (
    <div className="page">
      <div className="inner" style={{ paddingTop: 20 }}>
        <div className="cols2 tk">
          <VerdictTicket v={v} />
          <div style={{ display: 'grid', gap: 20 }}>
            <h1 className="h2" style={H1_STYLE}>
              Verdict {v.verdict}
            </h1>
            <div className="note">
              {v.label} Source:{' '}
              <a href={v.sourceUrl} style={{ textDecoration: 'underline' }} target="_blank" rel="noopener">
                {v.sourceUrl}
              </a>
            </div>
            <div className="kv">
              <div>Program</div>
              <div>{v.program}</div>
              <div>Cases</div>
              <div>
                {v.cases.matched}/{v.cases.total}
              </div>
              <div>Fuzz</div>
              <div>
                {v.fuzz.matched}/{v.fuzz.total}
              </div>
              <div>Source commitment</div>
              <div>{v.sourceCommitment}</div>
              <div>Report sha256</div>
              <div>{v.reportSha256}</div>
              <div>Reason</div>
              <div>{v.reason}</div>
            </div>
            <div className="label">First difference</div>
            <div className="code">{JSON.stringify(v.firstDiffs, null, 2)}</div>
            <div className="label">Report</div>
            <div className="code" style={{ maxHeight: 520 }}>
              {JSON.stringify(v.report, null, 2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
