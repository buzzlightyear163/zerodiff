import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Note, PageHead } from '../components/PageHead';
import { BRAND } from '../data/brand';
import { useTitle } from '../hooks/useReveal';
import { sha256Hex } from '../lib/api';
import { useWallet } from '../lib/wallet';
import { useWishes } from '../lib/wishes';

const B58 = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const MAX = 5 * 1024 * 1024;

const STEPS = ['Hash the archive (source commitment)', 'Encrypt with AES-256-GCM under a random key', 'Seal the key to the judge', 'Sign the submission', 'Upload the ciphertext and queue the job'];

export function Hunt() {
  useTitle('Hunt', BRAND.name);
  const { status, address, openModal, signMessage } = useWallet();
  const wishes = useWishes();
  const [program, setProgram] = useState('');
  const [wish, setWish] = useState('');
  const [price, setPrice] = useState('250');
  const [file, setFile] = useState<File | null>(null);
  const [mine, setMine] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [step, setStep] = useState(-1);
  const [result, setResult] = useState<{ commitment: string; cipher: string } | null>(null);

  const matching = wishes.filter((w) => w.program === program.trim());

  const submit = async () => {
    setErr(null);
    if (!B58.test(program.trim())) return setErr('Enter the program id you rebuilt.');
    if (!(Number(price) >= 25)) return setErr('The minimum unlock price is 25 USDC.');
    if (!file) return setErr('Choose your crate archive.');
    if (file.size > MAX) return setErr('The archive is larger than 5 MB.');
    if (!mine) return setErr('Confirm the work is yours and accept the terms.');
    if (!address) return openModal();
    try {
      setStep(0);
      const buf = await file.arrayBuffer();
      const commitment = await sha256Hex(buf);
      setStep(1);
      const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt']);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, buf);
      const cipher = await sha256Hex(ct);
      setStep(2);
      // TODO(backend): försegla nyckeln K till domarens X25519-nyckel (t.ex. tweetnacl box).
      await new Promise((r) => setTimeout(r, 300));
      setStep(3);
      const msg = `${BRAND.name} submission\nprogram: ${program.trim()}\ncommitment: ${commitment}\nciphertext: ${cipher}\nprice: ${Number(price)} USDC\npayout: ${address}\nwish: ${wish || 'none'}\nwork is mine: confirmed\nissued: ${new Date().toISOString()}`;
      await signMessage(msg);
      setStep(4);
      // TODO(backend): ladda upp ciphertext i 3 MB-delar och köa domarjobbet.
      await new Promise((r) => setTimeout(r, 500));
      setStep(5);
      setResult({ commitment, cipher });
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Submission was cancelled.');
      setStep(-1);
    }
  };

  return (
    <div className="page">
      <PageHead title="Submit a crate" img="/assets/img/card-hunt.jpg">
        <p>
          Upload the Rust crate you rebuilt. Your browser hashes it, encrypts it and seals the key to the judge before anything leaves your machine. The judge builds it, replays mainnet against the original, and a PASS turns into a public ticket with your price on it.
        </p>
        <div style={{ marginTop: 22, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link className="pill line" to="/docs/hunting">
            Submission rules
          </Link>
          <Link className="pill line" to="/verifier">
            Run the replayer locally
          </Link>
        </div>
      </PageHead>
      <div className="inner" style={{ maxWidth: 760 }}>
        <div className="form">
          <div className="field">
            <label htmlFor="program">Program id</label>
            <input id="program" placeholder="the closed program you rebuilt" spellCheck={false} autoComplete="off" value={program} onChange={(e) => setProgram(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="wish">Wish</label>
            <select id="wish" value={wish} onChange={(e) => setWish(e.target.value)}>
              <option value="">No wish: on spec (holder window, then anyone)</option>
              {matching.map((w) => (
                <option key={w.id} value={w.id}>
                  Wish {w.id.slice(0, 8)}, {w.price} USDC
                </option>
              ))}
            </select>
            <div className="hint">{matching.length ? `${matching.length} wish(es) on this program.` : 'No wish on this program yet: you can still submit on spec.'}</div>
          </div>
          <div className="field">
            <label htmlFor="price">Unlock price, USDC</label>
            <input id="price" type="number" min={25} step={1} value={price} onChange={(e) => setPrice(e.target.value)} />
            <div className="hint">You get 92% at once when it sells. Minimum 25 USDC.</div>
          </div>
          <div className="field">
            <label htmlFor="file">Rust crate (.zip or .tar.gz, 5 MB at most)</label>
            <input id="file" type="file" accept=".zip,.tar.gz,.tgz,application/zip,application/gzip" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <div className="hint">Cargo.toml, Cargo.lock and src/. No build.rs, no asm!, crates.io dependencies only. The archive never leaves this browser unencrypted.</div>
          </div>
          <label className="check">
            <input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} />
            <span>The work is mine, made for audit, interoperability or security research, and I accept the terms.</span>
          </label>
          {step >= 0 && (
            <ul className="steps">
              {STEPS.map((s, i) => (
                <li key={s} className={i < step ? 'done' : i === step ? 'now' : ''}>
                  {s}
                </li>
              ))}
            </ul>
          )}
          {result && (
            <div className="note">
              Queued (demo). Source commitment: <code style={{ wordBreak: 'break-all' }}>{result.commitment}</code>
              <br />
              <span className="muted">TODO(backend): upload and judge are not connected yet.</span>
            </div>
          )}
          {err && <div className="err">{err}</div>}
          <Note>
            {status === 'connected' && address ? (
              <>
                <span>Payout wallet {address.slice(0, 4)}...{address.slice(-4)} signs and receives 92% of the sale.</span>
                <button type="button" className="pill white" onClick={submit} disabled={step >= 0 && step < 5}>
                  {step >= 0 && step < 5 ? 'Working...' : 'Submit the crate'}
                </button>
              </>
            ) : (
              <>
                <span>Connect the payout wallet: it signs the submission and receives 92% of the sale.</span>
                <button type="button" className="pill white" onClick={openModal}>
                  Connect wallet
                </button>
              </>
            )}
          </Note>
        </div>
      </div>
    </div>
  );
}
