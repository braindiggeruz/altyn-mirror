'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ui, pick } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

/** Closing transition before result page. ~900ms (reduced motion: ~250ms). */
export function MapAssembled({ lang }: { lang: Lang }) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  // Reduced motion: shorten dramatically.
  const d = (full: number, mini = 0.001) => (reduced ? mini : full);

  return (
    <motion.div
      key="assembled"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: d(0.25) }}
      className="min-h-[100dvh] flex flex-col items-center justify-center px-5"
      data-testid="map-assembled"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: d(0.35) }}
        className="px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-[0.28em]
                   text-ink-950 bg-gold-200 shadow-gold"
      >
        {pick(ui.assembled.badge, lang)}
      </motion.div>

      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ duration: d(0.4), delay: d(0.05) }}
        className="mt-7 w-[120px] h-[120px] rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #fff5d0, #cea03a 55%, #4b3408 100%)',
          boxShadow: '0 0 80px rgba(206,160,58,0.55), inset 0 0 30px rgba(255,240,200,0.4)',
        }}
      />

      <motion.p
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: d(0.35), delay: d(0.25) }}
        className="serif mt-8 text-[26px] text-ivory text-center" style={{ fontWeight: 500 }}
      >
        {pick(ui.assembled.line1, lang)}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: d(0.35), delay: d(0.4) }}
        className="serif text-[26px] text-gold text-center" style={{ fontWeight: 500 }}
      >
        {pick(ui.assembled.line2, lang)}
      </motion.p>
    </motion.div>
  );
}
