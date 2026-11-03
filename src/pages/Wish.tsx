import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Note, PageHead } from '../components/PageHead';
import { BRAND } from '../data/brand';
import { useTitle } from '../hooks/useReveal';
import { useWallet } from '../lib/wallet';
import { addWish } from '../lib/wishes';

const B58 = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export function Wish() {
  useTitle('Sign a wish', BRAND.name);
  const { status, address, openModal, signMessage } = useWallet();
  const [program, setProgram] = useState('');
  const [price, setPrice] = useState('500');
  const [legit, setLegit] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const sign = async () => {
    setErr(null);
    if (!B58.test(program.trim())) return setErr('Enter a valid Solana program address.');
    if (!(Number(price) >= 25)) return setErr('The price must be at least 25 USDC.');
    if (!legit) return setErr('Confirm your legitimate interest first.');
    if (!address) return openModal();
    const issued = new Date().toISOString();
    const msg = `${BRAND.name} wish\nprogram: ${program.trim()}\nprice: ${Number(price)} USDC\nwallet: ${address}\nlegitimate interest: confirmed\nissued: ${issued}`;
    setBusy(true);
    try {
      const signature = await signMessage(msg);
      // TODO(backend): POST /api/wishes { msg, signature } och läs programmet från mainnet.
      addWish({ id: signature.slice(0, 16), program: program.trim(), price: Number(price), wallet: address, signature, issued });
      setDone(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Signing was cancelled.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page">
      <PageHead title="Sign a wish" img="/assets/img/card-wish.jpg">
        <p>
          Name a Solana program and the price you would pay for its source once a machine has shown that the source works. Nothing is locked up: you sign a message, and a proof made on your wish gives you 7 days to buy it before anyone else.
        </p>
      </PageHead>
      <div className="inner" style={{ maxWidth: 760 }}>
        <div className="form">
          {done ? (
            <>
              <div className="label">Wish signed</div>
              <p style={{ margin: 0 }}>Your wish is on the list. Hunters can now see the program and your price.</p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link className="pill white" to="/wishes">
                  See every wish
                </Link>
                <button
                  type="button"
                  className="pill line"
                  onClick={() => {
                    setDone(false);
                    setProgram('');
                  }}
                >
                  Sign another
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="field">
                <label htmlFor="program">Program id</label>
                <input id="program" placeholder="Solana program address" spellCheck={false} autoComplete="off" value={program} onChange={(e) => setProgram(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="price">Asking price, USDC</label>
                <input id="price" type="number" min={25} step={1} value={price} onChange={(e) => setPrice(e.target.value)} />
                <div className="hint">What you would pay to decrypt a passing source. You pay nothing now, and a proof made on your wish gives you 7 days to buy it first.</div>
              </div>
              <label className="check">
                <input type="checkbox" checked={legit} onChange={(e) => setLegit(e.target.checked)} />
                <span>I have a legitimate interest in this program's source (audit, interoperability or security research) as described in the terms.</span>
              </label>
              {err && <div className="err">{err}</div>}
              <Note>
                {status === 'connected' && address ? (
                  <>
                    <span>Signing as {address.slice(0, 4)}...{address.slice(-4)}. A message only, no transaction.</span>
                    <button type="button" className="pill white" onClick={sign} disabled={busy}>
                      {busy ? 'Signing...' : 'Sign the wish'}
                    </button>
                  </>
                ) : (
                  <>
                    <span>Connect the wallet that will sign the wish. There is no transaction, only a signed message.</span>
                    <button type="button" className="pill white" onClick={openModal}>
                      Connect wallet
                    </button>
                  </>
                )}
              </Note>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
