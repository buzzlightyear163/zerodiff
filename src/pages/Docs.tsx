import { Link, NavLink, useParams } from 'react-router-dom';
import { BRAND } from '../data/brand';
import { DOCS } from '../data/docs';
import { useTitle } from '../hooks/useReveal';
import { NotFound } from './NotFound';

export function Docs() {
  const { slug = 'overview' } = useParams();
  const i = DOCS.findIndex((d) => d.slug === slug);
  const doc = DOCS[i];
  useTitle(doc ? `Docs: ${doc.title}` : 'Not found', BRAND.name);
  if (!doc) return <NotFound />;
  const prev = DOCS[i - 1];
  const next = DOCS[i + 1];
  return (
    <div className="docs">
      <nav aria-label="Docs">
        {DOCS.map((d) => (
          <NavLink key={d.slug} to={`/docs/${d.slug}`} className={() => (d.slug === doc.slug ? 'on' : '')}>
            {d.title}
          </NavLink>
        ))}
      </nav>
      <article>
        <h1>{doc.title}</h1>
        {doc.body()}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 60, gap: 12, flexWrap: 'wrap' }}>
          {prev ? (
            <Link className="pill line" style={{ textDecoration: 'none' }} to={`/docs/${prev.slug}`}>
              {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link className="pill line" style={{ textDecoration: 'none' }} to={`/docs/${next.slug}`}>
              {next.title}
            </Link>
          )}
        </div>
      </article>
    </div>
  );
}
