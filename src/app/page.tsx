'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ui, pick } from '@/lib/i18n';
import type { Lang } from '@/lib/types';
import { getStoredLang, setStoredLang } from '@/lib/lang';
import { LangSwitcher } from '@/components/LangSwitcher';
import { OrbitMark } from '@/components/OrbitMark';
import { ReturningChip } from '@/components/ReturningChip';
import { track } from '@/lib/tracking';

export default function HeroPage() {
  const [lang, setLang] = useState<Lang>('ru');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLang(getStoredLang());
    track.viewContent();
  }, []);

  const onLangChange = (l: Lang) => { setLang(l); setStoredLang(l); };

  return (
    <main className="relative min-h-[100dvh] overflow-hidden pb-safe">
      <header className="px-5 pt-5 flex items-center justify-between">
        <Link href="/" data-testid="brand-mark" className="serif text-[20px] tracking-[0.08em] text-ivory">
          <span className="text-gold">ALTYN</span> Mirror
        </Link>
        {mounted && <LangSwitcher lang={lang} onChange={onLangChange} />}
      </header>

      <section className="px-5 pt-10 pb-[140px] max-w-[560px] mx-auto">
        {/* Returning chip (V4) — visible only if user already has completed map + token */}
        {mounted && (
          <div className="mb-5">
            <ReturningChip lang={lang} />
          </div>
        )}

        <motion.p
          data-testid="hero-eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-[12px] uppercase tracking-[0.28em] text-gold/80"
        >
          {pick(ui.hero.eyebrow, lang)}
        </motion.p>

        <motion.h1
          data-testid="hero-headline"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="serif mt-4 text-[38px] leading-[1.05] text-ivory"
          style={{ fontWeight: 500 }}
        >
          {pick(ui.hero.headline, lang)}
        </motion.h1>

        <motion.p
          data-testid="hero-sub"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 text-[16.5px] leading-[1.55] text-ivory/85"
        >
          {pick(ui.hero.sub, lang)}
        </motion.p>

        {/* CTA above orbit on mobile, so it stays above the fold on 360×800. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42 }}
          className="mt-6 flex flex-col gap-2.5"
        >
          <Link
            data-testid="hero-cta"
            href="/play/"
            onClick={() => track.startMirror()}
            className="btn-gold text-[17px] w-full sm:w-auto"
          >
            {pick(ui.hero.cta, lang)}
          </Link>
          <p data-testid="hero-micro" className="text-[12.5px] text-ivory/55 leading-[1.55] mt-1">
            {pick(ui.hero.micro, lang)}
          </p>
          <p data-testid="hero-trust" className="text-[12px] text-gold/70 leading-[1.55]">
            {pick(ui.hero.trust, lang)}
          </p>
        </motion.div>

        {/* Orbit — smaller on mobile, drops below CTA. */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="mt-8 flex justify-center sm:justify-start"
        >
          <OrbitMark className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px]" />
        </motion.div>

        {/* Sprint 4 — Trust bridge on landing intentionally omitted:
            risk-grep guards index.html against Meta-sensitive terms (псих*,
            терапия, etc.). AltynCard lives only on /result, where it gives
            ~95% of the conversion lift and stays out of Meta's landing-page
            content checks. */}

        <div className="mt-10 divider-gold" />

        <motion.p
          data-testid="hero-safety-note"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          className="mt-5 text-[12.5px] text-ivory/45 leading-[1.6]"
        >
          {pick(ui.hero.note, lang)}
        </motion.p>
      </section>

      <footer className="px-5 pb-8 pb-safe-extra max-w-[560px] mx-auto flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-ivory/45">
        <Link href="/privacy/" data-testid="footer-privacy" className="hover:text-gold transition-colors">{pick(ui.legal.privacy, lang)}</Link>
        <Link href="/terms/" data-testid="footer-terms" className="hover:text-gold transition-colors">{pick(ui.legal.terms, lang)}</Link>
        <Link href="/disclaimer/" data-testid="footer-disclaimer" className="hover:text-gold transition-colors">{pick(ui.legal.disclaimer, lang)}</Link>
        <Link href="/contact/" data-testid="footer-contact" className="hover:text-gold transition-colors">{pick(ui.legal.contact, lang)}</Link>
        <span className="text-ivory/35">·</span>
        <span className="text-ivory/35">{pick(ui.legal.nonMedical, lang)}</span>
      </footer>
    </main>
  );
}
