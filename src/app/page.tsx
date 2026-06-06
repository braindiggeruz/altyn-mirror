'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ui, pick } from '@/lib/i18n';
import type { Lang } from '@/lib/types';
import { getStoredLang, setStoredLang } from '@/lib/lang';
import { LangSwitcher } from '@/components/LangSwitcher';
import { OrbitMark } from '@/components/OrbitMark';
import { track } from '@/lib/tracking';
import { readUtmFromUrl } from '@/lib/utm';
import { loadSession, saveSession, makeSessionId } from '@/lib/storage';
import type { SessionData } from '@/lib/storage';

export default function HeroPage() {
  const [lang, setLang] = useState<Lang>('ru');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLang(getStoredLang());

    // Capture UTM/fbclid once on landing and seed the session.
    const utm = readUtmFromUrl();
    const existing = loadSession();
    const session: SessionData = existing ?? {
      session_id: makeSessionId(),
      lang: getStoredLang(),
      answer_path: [],
      created_at: new Date().toISOString(),
    };
    const merged: SessionData = { ...session, ...utm };
    saveSession(merged);

    // ViewContent fires on hero load. PageView is fired in layout.
    track.viewContent();
  }, []);

  const onLangChange = (l: Lang) => {
    setLang(l);
    setStoredLang(l);
  };

  return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      <header className="px-5 pt-5 flex items-center justify-between">
        <Link href="/" data-testid="brand-mark" className="serif text-[20px] tracking-[0.08em] text-ivory">
          <span className="text-gold">ALTYN</span> Mirror
        </Link>
        {mounted && <LangSwitcher lang={lang} onChange={onLangChange} />}
      </header>

      <section className="px-5 pt-12 pb-[120px] max-w-[560px] mx-auto">
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
          className="serif mt-5 text-[40px] leading-[1.04] text-ivory"
          style={{ fontWeight: 500 }}
        >
          {pick(ui.hero.headline, lang)}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 text-[17px] leading-[1.55] text-ivory/85 max-w-[34ch]"
        >
          {pick(ui.hero.sub, lang)}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.42 }}
          className="mt-9 flex justify-start"
        >
          <OrbitMark className="w-[210px] h-[210px]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-9 flex flex-col gap-3"
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
        </motion.div>

        <div className="mt-12 divider-gold" />

        <motion.p
          data-testid="hero-safety-note"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.9 }}
          className="mt-6 text-[12.5px] text-ivory/45 leading-[1.6]"
        >
          {pick(ui.hero.note, lang)}
        </motion.p>
      </section>

      <footer className="px-5 pb-8 max-w-[560px] mx-auto flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-ivory/45">
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
