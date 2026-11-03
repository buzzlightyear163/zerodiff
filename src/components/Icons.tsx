export function Seal({ className = 'seal' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2.5 22 20.5H2L12 2.5Z" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="14.5" r="1.7" fill="currentColor" />
    </svg>
  );
}

export function Arrow() {
  return (
    <svg className="arr" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function XIcon() {
  return (
    <svg className="icon-x" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/** Hexagon-ikoner till statistiksektionen. */
export function StatIcon({ kind }: { kind: 'grid' | 'clock' | 'cube' }) {
  const hex = 'M75 6 L138 42 L138 108 L75 144 L12 108 L12 42 Z';
  return (
    <svg viewBox="0 0 150 150" fill="none" stroke="#D9D9D9" strokeWidth="1.4" aria-hidden="true">
      <path d={hex} />
      {kind === 'grid' &&
        [52, 75, 98].flatMap((y) =>
          [40, 63, 86, 109].map((x) =>
            x === 109 && y === 98 ? (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="2" fill="none" />
            ) : (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#D9D9D9" />
            ),
          ),
        )}
      {kind === 'clock' && (
        <>
          <circle cx="75" cy="75" r="36" />
          <path d="M75 50 V75 L92 86" />
          {Array.from({ length: 7 }, (_, i) => {
            const a = (i / 7) * Math.PI * 2;
            return <circle key={i} cx={75 + Math.sin(a) * 46} cy={75 - Math.cos(a) * 46} r="2.6" fill="#D9D9D9" />;
          })}
        </>
      )}
      {kind === 'cube' && (
        <>
          <path d="M45 58 L75 40 L105 58 L105 92 L75 110 L45 92 Z" />
          <path d="M45 58 L75 76 L105 58 M75 76 V110" strokeDasharray="3 4" />
          <circle cx="75" cy="40" r="3" fill="#D9D9D9" />
          <circle cx="45" cy="58" r="3" fill="#D9D9D9" />
          <circle cx="105" cy="58" r="3" fill="#D9D9D9" />
        </>
      )}
    </svg>
  );
}
