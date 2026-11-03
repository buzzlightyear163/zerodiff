import { Link } from 'react-router-dom';
import { fmt, PROOFS, VERDICTS, type Proof, type Verdict } from '../lib/api';
import { short } from '../data/brand';
import { Ticket } from './Ticket';

export function ProofTicket({ p }: { p: Proof }) {
  return (
    <Ticket
      title={`PROOF #${p.id}`}
      seed={p.sourceCommitment}
      footLabel={p.status}
      rows={[
        { k: 'Program', v: short(p.program, 6, 6) },
        { k: 'Match', v: `${fmt(p.match.matched)}/${fmt(p.match.total)}` },
        { k: 'Fuzz', v: `${fmt(p.match.fuzzMatched)}/${fmt(p.match.fuzzTotal)}` },
        { k: 'Source', v: p.calibration ? 'public' : 'encrypted' },
        { k: 'Commit', v: p.sourceCommitment.slice(0, 16) },
        { k: 'Report', v: p.reportSha256.slice(0, 16) },
        { k: 'Memo', v: p.memo.pending ? 'record pending' : 'recorded' },
      ]}
    />
  );
}

export function VerdictTicket({ v }: { v: Verdict }) {
  return (
    <Ticket
      fail
      title={`VERDICT ${v.verdict}`}
      seed={v.sourceCommitment}
      footLabel="calibration"
      rows={[
        { k: 'Program', v: short(v.program, 6, 6) },
        { k: 'Match', v: `${fmt(v.cases.matched)}/${fmt(v.cases.total)}` },
        { k: 'Fuzz', v: `${fmt(v.fuzz.matched)}/${fmt(v.fuzz.total)}` },
        { k: 'Source', v: 'public' },
        { k: 'Commit', v: v.sourceCommitment.slice(0, 16) },
        { k: 'Report', v: v.reportSha256.slice(0, 16) },
        { k: 'Memo', v: 'record pending' },
      ]}
    />
  );
}

/** Alla biljetter som länkar, i referensens ordning: godkända först, sedan domar. */
export function AllTickets() {
  return (
    <>
      {PROOFS.map((p) => (
        <Link key={p.id} to={`/proofs/${p.id}`} aria-label={`Proof ${p.id}`}>
          <ProofTicket p={p} />
        </Link>
      ))}
      {VERDICTS.map((v) => (
        <Link key={v.id} to={`/proofs/v/${v.id}`} aria-label="Verdict">
          <VerdictTicket v={v} />
        </Link>
      ))}
    </>
  );
}
