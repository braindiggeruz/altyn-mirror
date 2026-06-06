'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ui, pick } from '@/lib/i18n';
import type { Lang, ResultKey } from '@/lib/types';
import { RESULTS, RESULT_DISCLAIMER, RESULT_KEYS } from '@/lib/results';
import { getStoredLang } from '@/lib/lang';
import { track } from '@/lib/tracking';
import { loadSession, saveSession } from '@/lib/storage';
import type { SessionData } from '@/lib/storage';
import { newToken } from '@/lib/token';
import { OrbitMark } from '@/components/OrbitMark';
import { ShareCard } from '@/components/ShareCard';

const VALID = new Set<ResultKey>(RESULT_KEYS);

export default function ResultClient({ slug }: { slug: string }) {
  const slugKey = (VALID.has(slug as ResultKey) ? (slug as ResultKey) : 'tuman');
  const [lang, setLang] = useState<Lang>('ru');
  const [session, setSession] = useState<SessionData | null>(null);
  const [savingState, setSavingState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const cardRef = useRef<HTMLDivElement>(null);

  // The primary key shown is the URL slug. The secondary nuance comes from session if it matches a different key.
  const primary: ResultKey = slugKey;
  const secondary: ResultKey | null = session?.secondary_result && session.secondary_result !== primary
    ? session.secondary_result
    : null;

  const data = RESULTS[primary];
  const secondaryData = secondary ? RESULTS[secondary] : null;

  useEffect(() => {
    const l = getStoredLang();
    setLang(l);
    let s = loadSession();
    // If user lands directly on /result/<slug> via shared link without a session, create a minimal one.
    if (!s) {
      s = {
        session_id: 'direct_' + Date.now().toString(36),
        lang: l,
        result_type: primary,
        secondary_result: undefined,
        answer_path: [],
        token: newToken(),
        created_at: new Date().toISOString(),
      };
      saveSession(s);
    } else if (!s.token) {
      s = { ...s, token: newToken() };
      saveSession(s);
    }
    setSession(s);
    track.resultViewed(primary, s.secondary_result || '');
  }, [primary]);

  const tgUrl = useMemo(() => {
    const bot = process.env.NEXT_PUBLIC_TELEGRAM_BOT || 'altyntherapybot';
    const token = session?.token || '';
    return `https://t.me/${bot}?start=${token}`;
  }, [session?.token]);

  function onCtaClick() {
    track.ctaClick(primary);
    // We hop through /go/telegram for transparent bridge (no cloaking).
  }

  async function onSave() {
    if (savingState === 'saving') return;
    setSavingState('saving');
    try {
      const node = cardRef.current;
      if (!node) throw new Error('no node');
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true, backgroundColor: '#070708' });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `altyn-mirror-${primary}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setSavingState('saved');
      setTimeout(() => setSavingState('idle'), 1800);
    } catch {
      setSavingState('error');
      setTimeout(() => setSavingState('idle'), 2200);
    }
  }

  return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      <header className="px-5 pt-5 flex items-center justify-between max-w-[640px] mx-auto">
        <Link href="/" data-testid="result-brand" className="serif text-[18px] tracking-[0.08em] text-ivory">
          <span className="text-gold">ALTYN</span> Mirror
        </Link>
        <Link href="/play/" data-testid="result-retake" className="text-[12px] text-ivory/55 hover:text-gold transition-colors">
          {pick(ui.result.retake, lang)}
        </Link>
      </header>

      <section className="px-5 pt-8 pb-16 max-w-[640px] mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-[12px] uppercase tracking-[0.28em] text-gold/80">
          {pick(ui.result.eyebrow, lang)}
        </motion.p>

        <div className="mt-4 flex items-start gap-4">
          <motion.h1
            data-testid="result-title"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.1 }}
            className="serif text-[36px] leading-[1.06] text-ivory" style={{fontWeight:500}}>
            {pick(data.title, lang)}
          </motion.h1>
        </div>

        {secondaryData && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.35 }}
            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/30 bg-ink-800/60"
            data-testid="nuance-badge"
          >
            <span className="text-[10px] uppercase tracking-[0.22em] text-gold/80">{pick(ui.result.nuanceBadge, lang)}</span>
            <span className="text-[12.5px] text-ivory/85">{pick(secondaryData.title, lang)}</span>
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-5 text-[15.5px] leading-[1.6] text-ivory/85"
          data-testid="result-description"
        >
          {pick(data.description, lang)}
        </motion.p>

        {/* Animated golden orbit / map */}
        <div className="mt-8 flex justify-center">
          <OrbitMark className="w-[200px] h-[200px]" />
        </div>

        <h2 className="serif mt-8 text-[22px] text-ivory" style={{fontWeight:500}}>
          {pick(ui.result.mapHeading, lang)}
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-3" data-testid="result-map">
          <MapNode label={pick(ui.result.nodes.start, lang)} value={pick(data.map.start, lang)} tone="start" testid="map-node-start" />
          <MapNode label={pick(ui.result.nodes.hold, lang)}  value={pick(data.map.hold, lang)}  tone="hold"  testid="map-node-hold" />
          <MapNode label={pick(ui.result.nodes.loop, lang)}  value={pick(data.map.loop, lang)}  tone="loop"  testid="map-node-loop" />
        </div>

        <div className="mt-7 card card-gold-edge p-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold/75">{pick(ui.result.keyQuestion, lang)}</p>
          <p data-testid="key-question" className="serif mt-2 text-[22px] leading-[1.25] text-ivory" style={{fontWeight:500}}>
            “{pick(data.keyQuestion, lang)}”
          </p>
        </div>

        <p data-testid="result-disclaimer" className="mt-5 text-[12.5px] text-ivory/45 leading-[1.6]">
          {pick(RESULT_DISCLAIMER, lang)}
        </p>

        {/* Offer block */}
        <div className="mt-9 card card-gold-edge p-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold/75">{pick(ui.result.offerTitle, lang)}</p>
          <p className="serif mt-2 text-[22px] leading-[1.22] text-ivory" style={{fontWeight:500}}>
            {pick(ui.result.offerLine, lang)}
          </p>
          <p className="mt-2 text-[13px] text-ivory/65">{pick(ui.result.offerMeta, lang)}</p>
          <ul className="mt-4 space-y-2">
            {ui.result.offerBullets[lang].map((b, i) => (
              <li key={i} className="flex gap-2 text-[14px] text-ivory/85">
                <span className="text-gold mt-1">◆</span><span>{b}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-3">
            <Link
              data-testid="result-cta-telegram"
              href={{ pathname: '/go/telegram/', query: { r: primary, t: session?.token || '' } }}
              onClick={onCtaClick}
              className="btn-gold text-[16px] w-full"
            >
              {pick(ui.result.primaryCta, lang)}
            </Link>
            <button
              data-testid="result-save-btn"
              onClick={onSave}
              className="btn-ghost text-[14px] w-full"
              aria-live="polite"
            >
              {savingState === 'saving' ? pick(ui.result.saving, lang)
                : savingState === 'saved' ? pick(ui.result.saved, lang)
                : savingState === 'error' ? pick(ui.result.saveFail, lang)
                : pick(ui.result.save, lang)}
            </button>
          </div>
        </div>

        {/* Hidden render target for share card */}
        <div style={{ position: 'fixed', left: -99999, top: 0, pointerEvents: 'none' }} aria-hidden="true">
          <ShareCard ref={cardRef} title={pick(data.title, lang)} keyQuestion={pick(data.keyQuestion, lang)} lang={lang} />
        </div>
      </section>

      <footer className="px-5 pb-8 max-w-[640px] mx-auto flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-ivory/45">
        <Link href="/privacy/" className="hover:text-gold transition-colors">{pick(ui.legal.privacy, lang)}</Link>
        <Link href="/terms/" className="hover:text-gold transition-colors">{pick(ui.legal.terms, lang)}</Link>
        <Link href="/disclaimer/" className="hover:text-gold transition-colors">{pick(ui.legal.disclaimer, lang)}</Link>
        <Link href="/contact/" className="hover:text-gold transition-colors">{pick(ui.legal.contact, lang)}</Link>
      </footer>
    </main>
  );
}

function MapNode({ label, value, tone, testid }: { label: string; value: string; tone: 'start' | 'hold' | 'loop'; testid: string }) {
  const dot = tone === 'start' ? '#e9cf80' : tone === 'hold' ? '#cea03a' : '#7a2231';
  return (
    <div className="card card-gold-edge p-4 flex gap-3 items-start" data-testid={testid}>
      <span className="mt-1.5 w-2.5 h-2.5 rounded-full" style={{ background: dot, boxShadow: `0 0 12px ${dot}` }} />
      <div className="flex-1">
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold/70">{label}</p>
        <p className="mt-1 text-[15px] text-ivory/90 leading-[1.45]">{value}</p>
      </div>
    </div>
  );
}
