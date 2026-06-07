'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ui, pick } from '@/lib/i18n';
import type { Lang } from '@/lib/types';
import { OrbitMark } from './OrbitMark';

export function MirrorIntro({ lang, onSkip }: { lang: Lang; onSkip: () => void }) {
  // Sprint 1 — auto-skip the ritual screen after 1500ms so users don't lose
  // an extra click between landing CTA and Q1. The "Войти в зеркало" button
  // and "пропустить ритуал" link remain visible and clickable for users who
  // arrive faster than the timer fires (both call onSkip in the same gesture).
  // prefers-reduced-motion skips even faster (350ms).
  const fired = useRef(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    const delay = reduce ? 350 : 1500;
    const t = window.setTimeout(() => {
      if (fired.current) return;
      fired.current = true;
      onSkip();
    }, delay);
    return () => window.clearTimeout(t);
  }, [onSkip]);

  const handleManualSkip = () => {
    if (fired.current) return;
    fired.current = true;
    onSkip();
  };

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
        style={{ fontWeight: 500 }}
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

      {/* V4: primary CTA is "Войти в зеркало →" — кликабелен для тех, кто
          опередил auto-skip. После 1.5s onSkip срабатывает автоматически. */}
      <motion.button
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.35 }}
        onClick={handleManualSkip}
        data-testid="intro-enter"
        className="btn-gold mt-6 text-[16px]"
      >
        {pick(ui.intro.enter, lang)} →
      </motion.button>

      {/* Optional small secondary "пропустить ритуал" — same action under the hood */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 1.55 }}
        onClick={handleManualSkip}
        data-testid="intro-skip"
        className="mt-4 text-[12px] text-ivory/45 hover:text-gold transition-colors"
      >
        {pick(ui.intro.skip, lang)}
      </motion.button>
    </motion.div>
  );
}
