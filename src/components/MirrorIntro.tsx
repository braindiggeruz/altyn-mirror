'use client';

import { motion } from 'framer-motion';
import { ui, pick } from '@/lib/i18n';
import type { Lang } from '@/lib/types';
import { OrbitMark } from './OrbitMark';

export function MirrorIntro({ lang, onSkip }: { lang: Lang; onSkip: () => void }) {
  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[100dvh] flex flex-col items-center justify-center px-5"
      data-testid="mirror-intro"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <OrbitMark className="w-[180px] h-[180px]" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.45 }}
        className="serif mt-8 text-[24px] text-center leading-[1.2] text-ivory max-w-[28ch]"
        style={{fontWeight: 500}}
      >
        {pick(ui.intro.line1, lang)}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.85 }}
        className="mt-3 text-[14.5px] text-center text-ivory/65 max-w-[32ch]"
      >
        {pick(ui.intro.line2, lang)}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1.2 }}
        className="mt-8 text-[11px] uppercase tracking-[0.28em] text-gold/70"
      >
        {pick(ui.intro.cue, lang)}
      </motion.p>

      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1.4 }}
        onClick={onSkip}
        data-testid="intro-skip"
        className="mt-6 text-[12.5px] text-ivory/45 hover:text-gold transition-colors"
      >
        {pick(ui.intro.skip, lang)} →
      </motion.button>
    </motion.div>
  );
}
