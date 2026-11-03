// Datakälla för bevis och domar.
// TODO(backend): ersätt den statiska fixturen med fetch mot riktigt API
// (GET /api/v1/proofs, /api/v1/proofs/:id, /api/v1/wishes).
import fixture from '../data/fixtures/proofs.json';

export interface Diff {
  field: string;
  original: string;
  candidate: string;
}
export interface DiffCase {
  case: string;
  kind: string;
  accounts: string[];
  diffs: Diff[];
}
export interface Proof {
  id: string;
  status: string;
  program: string;
  calibration: { label: string; sourceUrl: string } | null;
  match: { matched: number; total: number; realCases: number; realOriginalOk: number; fuzzMatched: number; fuzzTotal: number };
  sourceCommitment: string;
  reportSha256: string;
  corpusSha256: string;
  binaries: { original: string; candidate: string };
  toolchain: string;
  memo: { pending: boolean; signature?: string };
  priceUsdc: number | null;
  passedAt: string;
}
export interface Verdict {
  id: string;
  verdict: 'FAIL' | 'PASS';
  program: string;
  label: string;
  sourceUrl: string;
  cases: { matched: number; total: number };
  fuzz: { matched: number; total: number };
  sourceCommitment: string;
  reportSha256: string;
  reason: string;
  firstDiffs: DiffCase[];
  report: Record<string, unknown>;
}

export const PROOFS: Proof[] = fixture.proofs as Proof[];
export const VERDICTS: Verdict[] = fixture.verdicts as Verdict[];

export const getProof = (id: string) => PROOFS.find((p) => p.id === id);
export const getVerdict = (id: string) => VERDICTS.find((v) => v.id === id);

export const fmt = (n: number) => n.toLocaleString('en-US');

/** Kort UTC-tid som i referensen: 2026-11-02 16:03 UTC */
export function utc(iso: string): string {
  const d = new Date(iso);
  const p = (x: number) => String(x).padStart(2, '0');
  return `${d.getUTCFullYear()}-${p(d.getUTCMonth() + 1)}-${p(d.getUTCDate())} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())} UTC`;
}

export async function sha256Hex(buf: ArrayBuffer): Promise<string> {
  const h = await crypto.subtle.digest('SHA-256', buf);
  return [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
