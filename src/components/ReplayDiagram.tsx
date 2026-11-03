/** Diagram: original-binär och kandidat matas med samma instruktioner och jämförs. */
const ROWS = ['ix 0x02', 'ix 0x07', 'ix 0x02', 'fuzz', 'ix 0x0c', 'fuzz', 'ix 0x02'];

export function ReplayDiagram() {
  return (
    <svg viewBox="0 0 640 480" width="100%" height="100%" fill="none" aria-hidden="true" style={{ fontFamily: 'var(--mono)' }}>
      <rect x="0" y="0" width="320" height="480" fill="#1E1E1E" />
      <rect x="320" y="0" width="320" height="480" fill="#171717" />
      {ROWS.map((label, i) => {
        const y = 70 + i * 50;
        return (
          <g key={i}>
            <path d={`M40 ${y} H150`} stroke="#6E6E6E" strokeDasharray="2 6" />
            <circle cx="40" cy={y} r="3.5" fill="#D9D9D9" />
            <circle cx="150" cy={y} r="3.5" fill="#D9D9D9" />
            <path d={`M490 ${y} H600`} stroke="#6E6E6E" strokeDasharray="2 6" />
            <circle cx="490" cy={y} r="3.5" fill="#D9D9D9" />
            <circle cx="600" cy={y} r="3.5" fill="#D9D9D9" />
            <path d={`M150 ${y} C 220 ${y}, 230 220, 268 220`} stroke="#3a3a3a" />
            <path d={`M490 ${y} C 420 ${y}, 410 220, 372 220`} stroke="#3a3a3a" />
            <text x="160" y={y - 8} fill="#6E6E6E" fontSize="10">
              {label}
            </text>
          </g>
        );
      })}
      <rect x="262" y="196" width="116" height="48" rx="24" fill="#0E0E0E" stroke="#D9D9D9" />
      <text x="320" y="225" fill="#FFFFFF" fontSize="15" textAnchor="middle">
        compare
      </text>
      <text x="40" y="440" fill="#D9D9D9" fontSize="13">
        original .so (mainnet)
      </text>
      <text x="600" y="440" fill="#D9D9D9" fontSize="13" textAnchor="end">
        candidate .so (your crate)
      </text>
    </svg>
  );
}
