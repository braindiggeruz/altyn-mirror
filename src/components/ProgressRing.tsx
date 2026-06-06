'use client';

export function ProgressRing({ progress, size = 34 }: { progress: number; size?: number }) {
  const r = (size - 4) / 2;
  const c = 2 * Math.PI * r;
  const off = c - Math.max(0, Math.min(1, progress)) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <defs>
        <linearGradient id="goldStroke" x1="0" x2="1">
          <stop offset="0%" stopColor="#f3e3b0" />
          <stop offset="100%" stopColor="#cea03a" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="ring-track" strokeWidth={2} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={2}
        className="ring-fill" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={off}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}
