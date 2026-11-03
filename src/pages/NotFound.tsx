import { Link } from 'react-router-dom';
import { BRAND } from '../data/brand';
import { useTitle } from '../hooks/useReveal';

export function NotFound() {
  useTitle('404', BRAND.name);
  return (
    <div className="page">
      <section className="phead" style={{ minHeight: 480 }}>
        <h1 className="h1">No match</h1>
        <p>This page did not replay. Nothing here, byte for byte.</p>
        <div style={{ marginTop: 26 }}>
          <Link className="pill white" to="/">
            Back to the start
          </Link>
        </div>
      </section>
    </div>
  );
}
