'use client';

import { motion } from 'framer-motion';
import { ui, pick } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

/** Closing transition before result page. ~1.5s of cinematic beat. */
export function MapAssembled({ lang }: { lang: Lang }) {
  return (
    <motion.div
      key="assembled"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-[100dvh] flex flex-col items-center justify-center px-5"
      data-testid="map-assembled"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-[0.28em]
                   text-ink-950 bg-gold-200 shadow-gold"
      >
        {pick(ui.assembled.badge, lang)}
      </motion.div>

      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.7, delay: 0.05 }}
        className="mt-7 w-[120px] h-[120px] rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #fff5d0, #cea03a 55%, #4b3408 100%)',
          boxShadow: '0 0 80px rgba(206,160,58,0.55), inset 0 0 30px rgba(255,240,200,0.4)',
        }}
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="serif mt-8 text-[26px] text-ivory text-center" style={{fontWeight:500}}
      >
        {pick(ui.assembled.line1, lang)}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="serif text-[26px] text-gold text-center" style={{fontWeight:500}}
      >
        {pick(ui.assembled.line2, lang)}
      </motion.p>
    </motion.div>
  );
}
