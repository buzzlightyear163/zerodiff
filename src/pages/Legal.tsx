import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../data/brand';
import { useTitle } from '../hooks/useReveal';

/* TODO(branding): juridiska texter är neutrala platshållare med referensens rubrikstruktur.
   Låt en jurist granska innan lansering. */

const UPDATED = 'Last updated: [date].';

function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  useTitle(title, BRAND.name);
  return (
    <div className="legal">
      <h1>{title}</h1>
      {children}
    </div>
  );
}

export function Terms() {
  return (
    <LegalPage title="Terms">
      <p>{UPDATED} These terms cover your use of {BRAND.name}: the site, its API and the services behind them. By using them you accept these terms.</p>
      <h2>Purpose</h2>
      <p>{BRAND.name} is a venue for audit, interoperability and security research on Solana programs. [Describe the permitted purposes and what the service is not for.]</p>
      <h2>Requesters</h2>
      <p>When you sign a wish you confirm a legitimate interest in the program's source. [Describe the requester's obligations and how records are computed.]</p>
      <h2>Hunters</h2>
      <p>When you submit you confirm that the crate is your own work and that you have the right to offer it. [Describe originality requirements, prohibited content and payout terms.]</p>
      <h2>Buyers</h2>
      <p>An unlock is final once the sale is recorded. [Describe refunds for late or ineligible payments and permitted use of a decrypted source.]</p>
      <h2>Money and keys</h2>
      <p>Payments are made in USDC on Solana. [Describe escrow, vault and keeper accounts, who holds the keys and what that means for users.]</p>
      <h2>Takedown and abuse</h2>
      <p>
        Program owners can request removal of a published source as described in the <Link to="/docs/overview#takedown">takedown section</Link>. [Describe the process and response times.]
      </p>
      <h2>Liability</h2>
      <p>The service is provided as is. [Insert a limitation of liability reviewed by counsel.]</p>
      <h2>Changes</h2>
      <p>We may update these terms, and the date above changes when we do. [Describe how changes affect existing proofs, sales and records.]</p>
    </LegalPage>
  );
}

export function Privacy() {
  return (
    <LegalPage title="Privacy">
      <p>{UPDATED} This page explains what {BRAND.name} stores about you, why, where, for how long, and how to exercise your rights.</p>
      <h2>What we keep</h2>
      <ul>
        <li>Wallet addresses and the messages you sign (wishes, submissions, unlock logins), with their signatures.</li>
        <li>Encrypted archives you upload, and public protocol records (proofs, verdicts, sales).</li>
        <li>[Add any contact data collected through the takedown form.]</li>
      </ul>
      <p>We do not keep names, email addresses (other than a takedown contact), IP logs for profiling or analytics. [Adjust to the actual setup.]</p>
      <h2>Why</h2>
      <p>To run the protocol you chose to use: show wishes and records, judge submissions, process unlocks and keep public records. [State the legal basis.]</p>
      <h2>Where</h2>
      <p>[List hosting providers, storage regions and the judge machine provider.]</p>
      <h2>How long</h2>
      <p>Protocol records are kept as long as the proofs they belong to. [State retention for takedown requests and other data.]</p>
      <h2>Your rights (GDPR)</h2>
      <p>You can ask for access, correction, erasure, restriction or portability of data linked to your wallet, and you can object to processing. [Add contact details and the supervisory authority.]</p>
    </LegalPage>
  );
}

export function Cookies() {
  return (
    <LegalPage title="Cookies">
      <p>{UPDATED}</p>
      <p>{BRAND.name} sets no cookies of its own and runs no analytics, advertising or tracking. That is why there is no cookie banner: there is nothing optional to accept or decline.</p>
      <h2>Local storage</h2>
      <p>When you connect a mobile wallet through its app, the page may keep a one-time encryption key and the wallet session in your browser's local storage so it can read the wallet's reply. It stays on your device and is deleted when you disconnect. This demo also keeps signed wishes in local storage.</p>
      <h2>Third parties</h2>
      <p>Your wallet extension or app may keep its own data under its own policy. Links to Solscan, Jupiter, pump.fun or X lead to sites with their own policies.</p>
    </LegalPage>
  );
}
