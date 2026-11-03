import type { ReactNode } from 'react';

export function PageHead({ title, img, children, minHeight }: { title: string; img?: string; children?: ReactNode; minHeight?: number }) {
  return (
    <section className="phead" style={minHeight ? { minHeight } : undefined}>
      {img && <div className="photo" style={{ backgroundImage: `url(${img})` }} />}
      <h1 className="h1">{title}</h1>
      <div>{children}</div>
    </section>
  );
}

/** Rad i formulär med wallet-anslutning eller signeringsknapp. */
export function Note({ children }: { children: ReactNode }) {
  return (
    <div className="note" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
      {children}
    </div>
  );
}
