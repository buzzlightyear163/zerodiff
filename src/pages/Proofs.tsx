import { PageHead } from '../components/PageHead';
import { AllTickets } from '../components/ProofTickets';
import { BRAND } from '../data/brand';
import { useTitle } from '../hooks/useReveal';
import { PROOFS, VERDICTS } from '../lib/api';

export function Proofs() {
  useTitle('Proof wall', BRAND.name);
  return (
    <div className="page">
      <PageHead title="Proof wall" img="/assets/img/wall-tape.jpg">
        <p>
          Every verdict the judge has posted on this instance. A PASS is a ticket carrying its source commitment, and the source stays encrypted until someone pays to decrypt it. {PROOFS.length} passing, {VERDICTS.length} not.
        </p>
      </PageHead>
      <div className="inner">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'center' }}>
          <AllTickets />
        </div>
      </div>
    </div>
  );
}
