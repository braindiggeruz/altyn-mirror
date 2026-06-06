'use client';

import { motion } from 'framer-motion';
import type { ResultKey } from '@/lib/types';

type Node = { result: ResultKey; sceneIndex: number };

const COLOR: Record<ResultKey, string> = {
  mayatnik:  '#e9cf80',
  tuman:     '#cea03a',
  dogonyayu: '#f3e3b0',
  iskra:     '#dcb654',
  dver:      '#7a2231',
};

/** Mini orbit map that visibly assembles itself as the user answers. */
export function LiveMapPreview({
  filled, total, lastResult, size = 168,
}: {
  filled: Node[]; total: number; lastResult?: ResultKey; size?: number;
}) {
  const r = size / 2 - 8;
  const cx = size / 2;
  const cy = size / 2;

  // 7 evenly distributed angles, starting at the top
  const angle = (i: number) => (-Math.PI / 2) + (i / total) * Math.PI * 2;
  const filledByScene = new Map<number, ResultKey>();
  for (const n of filled) filledByScene.set(n.sceneIndex, n.result);

  return (
    <div className="relative" style={{ width: size, height: size }} aria-hidden="true">
      {/* soft glow that gets stronger as map fills */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ opacity: 0.35 + Math.min(0.55, filled.length * 0.08) }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'radial-gradient(closest-side, rgba(206,160,58,0.45), rgba(206,160,58,0) 70%)',
          filter: 'blur(18px)',
        }}
      />

      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="relative">
        <defs>
          <linearGradient id="lmpRing" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%"   stopColor="#f3e3b0" stopOpacity="0.95" />
            <stop offset="55%"  stopColor="#cea03a" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#5e1822" stopOpacity="0.65" />
          </linearGradient>
        </defs>

        {/* orbit ring */}
        <circle cx={cx} cy={cy} r={r} stroke="url(#lmpRing)" strokeWidth="1" fill="none" opacity={0.7} />
        <circle cx={cx} cy={cy} r={r - 14} stroke="url(#lmpRing)" strokeWidth="0.6" fill="none" opacity={0.35} />

        {/* center mirror */}
        <circle cx={cx} cy={cy} r={11} fill="url(#lmpCenter)" />
        <defs>
          <radialGradient id="lmpCenter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff5d0" />
            <stop offset="60%" stopColor="#cea03a" />
            <stop offset="100%" stopColor="#3a2807" />
          </radialGradient>
        </defs>

        {/* connecting filaments between consecutive filled nodes */}
        {(() => {
          const lines: React.ReactNode[] = [];
          for (let i = 1; i <= total; i++) {
            const cur = filledByScene.get(i);
            const prev = filledByScene.get(i - 1);
            if (cur && prev) {
              const a1 = angle(i - 2);
              const a2 = angle(i - 1);
              lines.push(
                <line key={`l${i}`}
                  x1={cx + r * Math.cos(a1)} y1={cy + r * Math.sin(a1)}
                  x2={cx + r * Math.cos(a2)} y2={cy + r * Math.sin(a2)}
                  stroke="rgba(206,160,58,0.55)" strokeWidth="0.8" strokeDasharray="2 3" />
              );
            }
          }
          return lines;
        })()}

        {/* the 7 dots */}
        {Array.from({ length: total }).map((_, i) => {
          const idx = i + 1;
          const a = angle(i);
          const x = cx + r * Math.cos(a);
          const y = cy + r * Math.sin(a);
          const res = filledByScene.get(idx);
          const color = res ? COLOR[res] : 'rgba(206,160,58,0.18)';
          const isLast = res && lastResult && idx === Math.max(...filled.map(n => n.sceneIndex));
          return (
            <g key={i}>
              {res ? (
                <motion.circle
                  cx={x} cy={y}
                  initial={{ r: 0, opacity: 0 }}
                  animate={{ r: isLast ? 6.5 : 5, opacity: 1 }}
                  transition={{ duration: 0.45, ease: [0.16,1,0.3,1] }}
                  fill={color}
                  style={{ filter: `drop-shadow(0 0 6px ${color})` }}
                />
              ) : (
                <circle cx={x} cy={y} r={3} fill={color} />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
