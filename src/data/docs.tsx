import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BRAND, MEMO_PREFIX } from './brand';

/* Docs-innehåll. Rubrikstrukturen följer referensen; texterna är omskrivna
   platshållare som beskriver samma mekanik. TODO(branding): granska och anpassa. */

export interface DocPage {
  slug: string;
  title: string;
  body: () => ReactNode;
}

const T = BRAND.ticker;

export const DOCS: DocPage[] = [
  {
    slug: 'overview',
    title: 'Overview',
    body: () => (
      <>
        <p>
          {BRAND.name} pays reverse engineers for the source of closed Solana programs, and buyers only pay once a machine has shown that the source works. No money is locked in advance. A hunter rebuilds a program as a Rust crate and submits it encrypted. The judge compiles it and replays real mainnet instructions against the original bytecode. A PASS becomes a public proof ticket, while the source stays encrypted until someone pays to decrypt it.
        </p>
        <h2>The loop</h2>
        <ol>
          <li>Anyone signs a wish for a program id with a price. No deposit.</li>
          <li>A hunter submits a crate for any program, with or without a wish, and sets an unlock price of at least 25 USDC.</li>
          <li>The judge builds and replays it and returns PASS or FAIL, with a report and its sha256.</li>
          <li>A buyer unlocks the proof in USDC inside the windows; the archive decrypts in their browser and its sha256 is checked against the commitment on the ticket.</li>
          <li>The hunter gets 92% straight away. 8% is bought into ${T} and burned once the token exists.</li>
        </ol>
        <h2>What it is for</h2>
        <p>
          Audit, interoperability and security research: teams integrating with a closed program, auditors who need to read the code that holds user funds, and researchers who need to know what an upgrade changed. Requesters confirm a legitimate interest when they sign a wish, and hunters confirm the work is their own when they submit.
        </p>
        <h2 id="takedown">Takedown</h2>
        <p>
          A program owner who believes a published source infringes their rights can request its removal with the program id, the proof number, a contact and the basis of the claim. Requests are answered within 7 days, and published archives covered by a valid request are removed.
        </p>
      </>
    ),
  },
  {
    slug: 'wishing',
    title: 'Wishing',
    body: () => (
      <>
        <p>A wish names a program and the price you would pay for its source. Your wallet signs a message rather than a transaction, so nothing is deposited and nothing is locked.</p>
        <div className="code">
          <code>{`${BRAND.name} wish\nprogram: <program id>\nprice: <n> USDC\nwallet: <your address>\nlegitimate interest: confirmed\nissued: <ISO time>`}</code>
        </div>
        <p>The site verifies the signature, reads the program from mainnet (loader, upgrade authority, ELF size and sha256, verified-build status) and lists the wish. A program whose source is already verified public is accepted and marked as such.</p>
        <h2>Your record</h2>
        <p>Every wish shows its requester's record, computed from the chain: paid is the number of unlocks that wallet bought, ignored is the number of passing proofs on its wishes whose 7-day window ended without a payment. Hunters check the record before spending a week on a wish.</p>
      </>
    ),
  },
  {
    slug: 'hunting',
    title: 'Hunting and submission rules',
    body: () => (
      <>
        <p>Hunters can submit for any program, with or without a wish. The payout wallet you connect signs the submission and receives 92% of the sale.</p>
        <h2>The archive</h2>
        <ul>
          <li>A Rust crate as .zip or .tar.gz, at most 5 MB, containing Cargo.toml, Cargo.lock and src/.</li>
          <li>
            Rust only. No <code>asm!</code> or <code>global_asm!</code>, no <code>include_bytes!</code> or <code>include_str!</code> of anything over 4 KB, and no build.rs.
          </li>
          <li>
            Proc-macro crates only from the allow-list (the solana-program family, borsh, bytemuck, thiserror, num-derive, anchor-lang and anchor-attribute-*, pinocchio). Dependencies from crates.io only; the build runs with <code>--locked</code>.
          </li>
          <li>
            Toolchain: one of the pinned <code>cargo build-sbf</code> versions listed in the judge's report.
          </li>
        </ul>
        <h2>In your browser</h2>
        <ol>
          <li>The archive is hashed; its sha256 is the source commitment and is public from the start.</li>
          <li>It is encrypted with AES-256-GCM under a random 32-byte key K.</li>
          <li>K is sealed to the judge's X25519 public key using a one-time key.</li>
          <li>You sign the submission (program, commitment, ciphertext hash, price, payout wallet, wish).</li>
          <li>The ciphertext uploads in 3 MB chunks and the job is queued.</li>
        </ol>
        <div className="code">
          <code>{`${BRAND.name} submission\nprogram: <program id>\ncommitment: <sha256 of the archive>\nciphertext: <sha256 of the ciphertext>\nprice: <n> USDC\npayout: <wallet>\nwish: <wish id or none>\nwork is mine: confirmed\nissued: <ISO time>`}</code>
        </div>
        <p>Keep your archive. Its sha256 is the commitment on your ticket, and the buyer's browser checks the decrypted file against it.</p>
      </>
    ),
  },
  {
    slug: 'judge',
    title: 'The judge',
    body: () => (
      <>
        <p>The judge decides without a human in the loop. It runs on its own machine, which starts for each batch of jobs and stops when they finish.</p>
        <h2>Build</h2>
        <p>The judge opens the sealed key with its X25519 secret, decrypts the archive, checks that its sha256 equals the commitment, checks the rules and compiles the crate itself on the pinned toolchain, with no secrets in the environment and a 10-minute limit. A submitted binary is never trusted.</p>
        <h2>Replay</h2>
        <p>The original binary, read from mainnet, and the candidate are loaded into two identical local SVMs (LiteSVM). Both get the same inputs: real instruction data from recent mainnet transactions, the same account states and sysvars, then fuzzed variants of those instructions. The corpus is frozen when the program is first snapshotted. Its target is 1,000 real instructions plus 10,000 fuzzed ones; when fewer real instructions are available, every page shows the real count.</p>
        <h2>Compare</h2>
        <p>
          For each case: success or the exact error (custom codes included), every byte of every account the instruction may write (data, lamports, owner), return data, and the logs with the <code>consumed N of M compute units</code> lines removed. CPI invocations and their order must match. Both binaries run under the same compute budget, taken from each case's own ComputeBudget instructions, so an interpreter wrapping the original bytecode cannot pass.
        </p>
        <h2>Verdict</h2>
        <p>PASS when every case matches and the corpus actually exercises the program: at least 100 cases where the original succeeds. The report is JSON, with its sha256, the source commitment, the corpus hash and both binary hashes. The keeper records every PASS on Solana as a Memo:</p>
        <div className="code">
          <code>{`${MEMO_PREFIX}:proof:<program>:<submission>:<source sha256>:<report sha256>:<matched>/<total>`}</code>
        </div>
        <p>Until the keeper is funded a ticket reads "Memo record pending"; the backfill then records every pending proof in one run.</p>
        <h2>Calibration</h2>
        <p>
          Before judging anything else, an instance proves its judge on a program whose source is already public: the correct source must PASS and a copy with one change must FAIL with the difference shown. Both appear on the proof wall, labelled calibration. Anyone can re-run any verdict with the <Link to="/verifier">verifier</Link>.
        </p>
      </>
    ),
  },
  {
    slug: 'unlocking',
    title: 'Unlocking and decrypting',
    body: () => (
      <>
        <ol>
          <li>
            Connect your wallet on the proof's unlock page and click Unlock. The site builds a USDC transfer from your wallet to the keeper's escrow with the Memo <code>{MEMO_PREFIX}:unlock:&lt;proof&gt;</code>, which your wallet signs and sends.
          </li>
          <li>The server reads the payment back from the chain. The first eligible payment wins and the ticket shows SOLD. A payment that lands after the sale, or outside its window, is returned by the keeper.</li>
          <li>You sign a login message. Your browser creates a one-time X25519 key; the server opens K with the judge key and returns it sealed to that key.</li>
          <li>Your browser fetches the ciphertext, decrypts it, computes its sha256, compares it with the commitment on the ticket and saves the archive.</li>
        </ol>
        <h2>Payout</h2>
        <p>
          The keeper pays 92% of the price to the hunter in the same run, with the Memo <code>{MEMO_PREFIX}:payout:&lt;proof&gt;:...</code>. The remaining 8% goes to the vault (<code>{BRAND.vault}</code>) and is bought into ${T} and burned once it exists.
        </p>
        <p>
          Keeper: <code>{BRAND.keeper}</code>. Keeper transfers wait until it holds SOL for fees; each proof's page shows the payout signature once it exists.
        </p>
      </>
    ),
  },
  {
    slug: 'windows',
    title: 'Windows and the orphan fund',
    body: () => (
      <>
        <p>Each proof sells once. Who may buy it depends on how long ago it passed:</p>
        <ul>
          <li>With a wish: only the requester, for 7 days.</li>
          <li>Then 24 hours for wallets holding at least 10,000 ${T}, once the token exists. Until then this window is skipped.</li>
          <li>Then anyone.</li>
        </ul>
        <p>Without a wish the proof goes straight to the holder window, then to anyone.</p>
        <h2>The orphan fund</h2>
        <p>
          Proofs that nobody buys still pay their hunters. Every Monday at 00:30 UTC the vault rule sends half of the vault's SOL above a 0.05 SOL reserve, swapped to USDC, to the orphan fund (<code>{BRAND.orphanFund}</code>). The fund buys the oldest unsold proofs past all their windows at their price or 250 USDC, whichever is lower, pays the hunter 92% (8% to the vault for the burn) and publishes the decrypted source on the ticket.
        </p>
      </>
    ),
  },
  {
    slug: 'api',
    title: 'API and MCP',
    body: () => (
      <>
        <p>Every read is public JSON, no key needed.</p>
        <div className="code">
          <code>{`curl ${BRAND.siteUrl}/api/v1/proofs\ncurl ${BRAND.siteUrl}/api/v1/proofs/0001\ncurl ${BRAND.siteUrl}/api/v1/wishes\ncurl -o proof.enc ${BRAND.siteUrl}/api/proofs/0001/ciphertext`}</code>
        </div>
        <p>
          <code>/api/v1/proofs/:id</code> returns the commitment, the full report, the windows, the status and the Memo signature. In this clone the data comes from the fixture <a href="/api/v1/proofs.json">/api/v1/proofs.json</a>.
        </p>
        <h2>MCP server</h2>
        <p>
          A read-only Model Context Protocol server over streamable HTTP at <code>{BRAND.siteUrl}/api/mcp</code>, with four tools: list_proofs, get_proof, list_wishes and verify_commitment. See <a href="/api/mcp.json">/api/mcp.json</a> for the mock descriptor.
        </p>
        <div className="code">
          <code>{`curl -s ${BRAND.siteUrl}/api/mcp -H 'content-type: application/json' \\\n  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"verify_commitment","arguments":{"id":"0001","sha256":"<sha256 of your archive>"}}}'`}</code>
        </div>
        <p>Add it to an MCP client as a remote server with that URL.</p>
      </>
    ),
  },
  {
    slug: 'token',
    title: `$${T}`,
    body: () => (
      <>
        <p>${T} is the protocol's token on pump.fun. Its utility switches on the day it exists:</p>
        <ul>
          <li>Holder window: 24 hours of early access to every new proof for wallets holding 10,000 ${T}, after any requester window.</li>
          <li>Burn on every unlock: 8% of each unlock is bought on Jupiter and burned.</li>
          <li>The vault: every Monday, half of the creator fees the team sends to the vault is bought into ${T} and burned; the other half feeds the orphan fund.</li>
        </ul>
        <p>
          Until the token exists, burn shares wait in the vault and the holder window is skipped. The <Link to="/vault">vault page</Link> lists every transfer and every recorded leg.
        </p>
      </>
    ),
  },
  {
    slug: 'trust',
    title: 'Trust model',
    body: () => (
      <>
        <p>What the chain proves: unlock payments, payouts, refunds, burns and proof records are Solana transactions anyone can read. The ticket's commitment is fixed before anyone pays, and the buyer's browser checks the decrypted archive against it.</p>
        <p>What the judge proves: the report and its hashes, and that the binary it built from the committed archive matched the original on every case in the corpus. Anyone can re-run a verdict with the published replayer and corpus.</p>
        <p>What you trust the operator with: the operator's server holds the judge's X25519 secret, so it can read K, and therefore any archive, at any time; the unlock step uses it to reseal K to the buyer. The encryption keeps archives away from everyone else, and the server is the gatekeeper of the key. Escrows and the vault are keys held by the operator, not a Solana program.</p>
        <p>What a PASS means: the rebuilt source behaves like the original on the corpus. It is not a formal proof of equivalence for inputs the corpus never reached.</p>
      </>
    ),
  },
];
