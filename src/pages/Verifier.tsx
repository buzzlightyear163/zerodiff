import { Link } from 'react-router-dom';
import { PageHead } from '../components/PageHead';
import { BRAND } from '../data/brand';
import { useTitle } from '../hooks/useReveal';
import { PROOFS, VERDICTS } from '../lib/api';

export function Verifier() {
  useTitle('Verifier', BRAND.name);
  const rows = [
    ...PROOFS.map((p) => ({ label: `#${p.id}`, program: p.program, corpus: p.corpusSha256, cases: p.match.realCases })),
    ...VERDICTS.map((v) => ({ label: v.verdict, program: v.program, corpus: String(v.report.corpus_sha256 ?? ''), cases: v.cases.total })),
  ];
  return (
    <div className="page">
      <PageHead title="Verifier" img="/assets/img/wall-scope.jpg">
        <p>
          Anyone can re-run any verdict. The replayer source, a ready-made script and every corpus bundle by hash are served from this site, so there is nothing to clone and nothing to install from us.
        </p>
      </PageHead>
      <div className="inner">
        <div className="cols2">
          <div className="form">
            <div className="label">Files</div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>File</th>
                  <th>sha256</th>
                  <th>Size</th>
                </tr>
              </thead>
              <tbody>
                {/* TODO(backend): riktiga filer + hashar från byggservern. */}
                <tr>
                  <td>
                    <a href="/verifier/replayer-src.tar.gz">replayer-src.tar.gz</a>
                  </td>
                  <td>placeholder</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>
                    <a href="/verifier/verify.sh">verify.sh</a>
                  </td>
                  <td>placeholder</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
            <p className="muted" style={{ margin: 0, fontSize: 13 }}>
              Engine build: placeholder (TODO(backend)).
            </p>
          </div>
          <div className="form">
            <div className="label">Re-run a verdict</div>
            <div className="code">{`curl -sO ${BRAND.siteUrl}/verifier/replayer-src.tar.gz\ncurl -sO ${BRAND.siteUrl}/verifier/verify.sh\nsh verify.sh <proof number>`}</div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: '22px' }}>
              The script fetches the proof's corpus bundle and report, checks their hashes, builds the replayer with cargo and replays the original binary against the candidate the judge built. Re-running a PASS needs the source: for a proof you bought, pass the decrypted archive as the second argument.
            </p>
            <Link className="pill line" style={{ alignSelf: 'start' }} to="/docs/judge">
              How the judge works
            </Link>
          </div>
        </div>
        <div className="label" style={{ margin: '50px 0 14px' }}>
          Corpus bundles
        </div>
        <table className="tbl">
          <thead>
            <tr>
              <th>Verdict</th>
              <th>Program</th>
              <th>Corpus sha256</th>
              <th>Cases</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.label}</td>
                <td>{r.program}</td>
                <td>{r.corpus.slice(0, 24)}</td>
                <td>{r.cases}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
