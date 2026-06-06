'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ui, pick, fmt } from '@/lib/i18n';
import type { Lang, ResultKey } from '@/lib/types';
import { RESULTS, RESULT_DISCLAIMER, RESULT_KEYS } from '@/lib/results';
import { getStoredLang } from '@/lib/lang';
import { track } from '@/lib/tracking';
import { loadSession, saveSession } from '@/lib/storage';
import type { SessionData } from '@/lib/storage';
import { newToken } from '@/lib/token';
import { OrbitMark } from '@/components/OrbitMark';
import { ShareCard } from '@/components/ShareCard';
import { TelegramReadyModal } from '@/components/TelegramReadyModal';

const VALID = new Set<ResultKey>(RESULT_KEYS);

export default function ResultClient({ slug }: { slug: string }) {
  const slugKey = (VALID.has(slug as ResultKey) ? (slug as ResultKey) : 'tuman');
  const [lang, setLang] = useState<Lang>('ru');
  const [session, setSession] = useState<SessionData | null>(null);
  const [savingState, setSavingState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [modalOpen, setModalOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const primary: ResultKey = slugKey;
  const secondary: ResultKey | null = session?.secondary_result && session.secondary_result !== primary
    ? session.secondary_result
    : null;

  const data = RESULTS[primary];
  const secondaryData = secondary ? RESULTS[secondary] : null;
  const markers = data.markers[lang] || data.markers.ru;
  const bring = data.bring[lang] || data.bring.ru;
  const sessionSteps = ui.result.sessionSteps[lang];
  const reassureChips = ui.result.reassureChips[lang];

  useEffect(() => {
    const l = getStoredLang();
    setLang(l);
    let s = loadSession();
    if (!s) {
      s = {
        session_id: 'direct_' + Date.now().toString(36),
        lang: l, result_type: primary, secondary_result: undefined,
        answer_path: [], token: newToken(), created_at: new Date().toISOString(),
      };
      saveSession(s);
    } else if (!s.token) {
      s = { ...s, token: newToken() };
      saveSession(s);
    }
    setSession(s);
    track.resultViewed(primary, s.secondary_result || '');
    track.resultMapViewed(primary, s.secondary_result || '');
    track.scenarioPassportViewed(primary);

    // Session-preview gets its own event once user has had a beat to see the page.
    const t = window.setTimeout(() => track.sessionPreviewViewed(primary), 1800);
    return () => window.clearTimeout(t);
  }, [primary]);

  const tokenShort = (session?.token || '').replace(/^am_/, '').slice(0, 10) || '——';
  const completedDate = useMemo(() => {
    const iso = session?.completed_at || session?.created_at;
    if (!iso) return '';
    try {
      const d = new Date(iso);
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yy = String(d.getFullYear()).slice(-2);
      return `${dd}.${mm}.${yy}`;
    } catch { return ''; }
  }, [session?.completed_at, session?.created_at]);

  const telegramHref = useMemo(() => {
    const bot = process.env.NEXT_PUBLIC_TELEGRAM_BOT || 'altyntherapybot';
    return `https://t.me/${bot}?start=${session?.token || 'am_no_token'}`;
  }, [session?.token]);

  function openTgModal() {
    track.telegramModalOpened(primary);
    track.ctaClick(primary);
    track.telegramIntentClicked(primary, 'result_primary_cta', !!session?.token);
    setModalOpen(true);
  }

  async function onSave() {
    if (savingState === 'saving') return;
    track.saveCardClicked(primary);
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
      track.saveCardSuccess(primary);
      setSavingState('saved');
      setTimeout(() => setSavingState('idle'), 2200);
    } catch {
      setSavingState('error');
      setTimeout(() => setSavingState('idle'), 2600);
    }
  }

  return (
    <main className="relative min-h-[100dvh] overflow-hidden pb-safe">
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

        <motion.h1
          data-testid="result-title"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.1 }}
          className="serif mt-4 text-[36px] leading-[1.06] text-ivory" style={{ fontWeight: 500 }}
        >
          {pick(data.title, lang)}
        </motion.h1>

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

        {/* Crystallization reveal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-7 flex justify-center"
        >
          <OrbitMark className="w-[200px] h-[200px]" />
        </motion.div>

        {/* === SCENARIO PASSPORT (premium artifact) === */}
        <motion.section
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.3 }}
          className="mt-8 card card-gold-edge p-5 relative overflow-hidden"
          data-testid="scenario-passport"
        >
          {/* corner stamp */}
          <div
            aria-hidden="true"
            className="absolute -right-6 -top-6 w-[120px] h-[120px] rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,245,208,0.35), rgba(206,160,58,0.12) 55%, transparent 75%)' }}
          />
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10.5px] uppercase tracking-[0.28em] text-gold/85">
              {pick(ui.result.passportEyebrow, lang)}
            </p>
            <p className="text-[10.5px] uppercase tracking-[0.20em] text-gold/55" data-testid="passport-serial">
              {fmt(pick(ui.result.passportSerial, lang), { token: tokenShort, date: completedDate || '—' })}
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <MapRow label={pick(ui.result.cardPrimary, lang)} value={pick(data.title, lang)} accent testid="map-row-primary" />
            {secondaryData && (
              <MapRow label={pick(ui.result.cardSecondary, lang)} value={pick(secondaryData.title, lang)} testid="map-row-secondary" />
            )}
            <MapRow label={pick(ui.result.cardEntry, lang)} value={pick(data.map.start, lang)} testid="map-row-entry" />
            <MapRow label={pick(ui.result.cardHold, lang)}  value={pick(data.map.hold, lang)}  testid="map-row-hold" />
            <MapRow label={pick(ui.result.cardLoop, lang)}  value={pick(data.map.loop, lang)}  testid="map-row-loop" />
            <div className="pt-2 mt-2 border-t border-gold/15">
              <p className="text-[11px] uppercase tracking-[0.22em] text-gold/70">{pick(ui.result.cardKey, lang)}</p>
              <p data-testid="map-row-key" className="serif mt-1 text-[19px] italic leading-[1.3] text-ivory">
                “{pick(data.keyQuestion, lang)}”
              </p>
            </div>
          </div>

          {/* 3 markers */}
          <div className="mt-5 pt-4 border-t border-gold/15">
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold/70">{pick(ui.result.markersHeading, lang)}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {markers.map((m, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.5 + i * 0.08 }}
                  className="flex gap-3 items-start"
                  data-testid={`marker-${i + 1}`}
                >
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" style={{ boxShadow: '0 0 8px rgba(206,160,58,0.7)' }} />
                  <span className="text-[14.5px] text-ivory/90 leading-[1.4]">{m}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* What to bring */}
          <div className="mt-5 pt-4 border-t border-gold/15" data-testid="passport-bring">
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold/70">{pick(ui.result.bringHeading, lang)}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {bring.map((b, i) => (
                <li key={i} className="flex gap-3 items-start" data-testid={`bring-${i + 1}`}>
                  <span className="mt-1.5 text-gold text-[12px]">◆</span>
                  <span className="text-[14.5px] text-ivory/90 leading-[1.45]">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* First calm step */}
          <div className="mt-5 pt-4 border-t border-gold/15" data-testid="passport-first-step">
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold/70">{pick(ui.result.firstStepHeading, lang)}</p>
            <p className="serif mt-2 text-[17.5px] leading-[1.4] text-ivory italic">
              {pick(data.firstStep, lang)}
            </p>
          </div>

          <p className="mt-5 text-[10.5px] uppercase tracking-[0.18em] text-gold/45">
            {pick(ui.result.passportStamp, lang)}
          </p>
        </motion.section>

        {/* Long description (poetic copy) */}
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-7 text-[15.5px] leading-[1.6] text-ivory/85"
          data-testid="result-description"
        >
          {pick(data.description, lang)}
        </motion.p>

        <p data-testid="result-disclaimer" className="mt-4 text-[12.5px] text-ivory/45 leading-[1.6]">
          {pick(RESULT_DISCLAIMER, lang)}
        </p>

        {/* === SESSION PREVIEW (persuasive) === */}
        <motion.section
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-9"
          data-testid="session-preview"
        >
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold/80">{pick(ui.result.sessionTitle, lang)}</p>
          <ol className="mt-4 flex flex-col gap-3">
            {sessionSteps.map((s, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }}
                className="card card-gold-edge px-4 py-3"
                data-testid={`session-step-${i + 1}`}
              >
                <p className="text-[12.5px] uppercase tracking-[0.16em] text-gold/85">{s.t}</p>
                <p className="mt-1 text-[14.5px] text-ivory/90 leading-[1.45]">{s.d}</p>
              </motion.li>
            ))}
          </ol>
        </motion.section>

        {/* === REASSURANCE CHIPS === */}
        <motion.section
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.95 }}
          className="mt-7"
          data-testid="reassurance-block"
        >
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold/75">{pick(ui.result.reassureTitle, lang)}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {reassureChips.map((c, i) => (
              <li key={i}
                className="px-3 py-1.5 rounded-full text-[12px] text-ivory/85 border border-gold/25 bg-ink/40"
                data-testid={`reassure-chip-${i + 1}`}>
                {c}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* === OFFER + CTA === */}
        <div className="mt-9 card card-gold-edge p-5" data-testid="offer-block">
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold/75">{pick(ui.result.offerTitle, lang)}</p>
          <p className="serif mt-2 text-[22px] leading-[1.22] text-ivory" style={{ fontWeight: 500 }}>
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

          <p className="mt-5 text-[13.5px] text-gold/85 leading-[1.45]" data-testid="continuation-promise">
            {pick(ui.result.continuation, lang)}
          </p>

          <div className="mt-4 flex flex-col gap-3">
            <button
              data-testid="result-cta-telegram"
              onClick={openTgModal}
              className="btn-gold text-[16px] w-full"
            >
              {pick(ui.result.primaryCta, lang)}
            </button>
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

        {/* Hidden render target for share card export */}
        <div style={{ position: 'fixed', left: -99999, top: 0, pointerEvents: 'none' }} aria-hidden="true">
          <ShareCard
            ref={cardRef}
            title={pick(data.title, lang)}
            secondary={secondaryData ? pick(secondaryData.title, lang) : undefined}
            markers={markers}
            keyQuestion={pick(data.keyQuestion, lang)}
            lang={lang}
            firstStep={pick(data.firstStep, lang)}
            tokenShort={tokenShort}
          />
        </div>
      </section>

      <footer className="px-5 pb-8 pb-safe-extra max-w-[640px] mx-auto flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-ivory/45">
        <Link href="/privacy/" className="hover:text-gold transition-colors">{pick(ui.legal.privacy, lang)}</Link>
        <Link href="/terms/" className="hover:text-gold transition-colors">{pick(ui.legal.terms, lang)}</Link>
        <Link href="/disclaimer/" className="hover:text-gold transition-colors">{pick(ui.legal.disclaimer, lang)}</Link>
        <Link href="/contact/" className="hover:text-gold transition-colors">{pick(ui.legal.contact, lang)}</Link>
      </footer>

      <TelegramReadyModal
        open={modalOpen}
        lang={lang}
        scenario={pick(data.title, lang)}
        nuance={secondaryData ? pick(secondaryData.title, lang) : undefined}
        keyQuestion={pick(data.keyQuestion, lang)}
        telegramHref={telegramHref}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          track.telegramOpenAttempt(primary, !!session?.token);
          track.telegramIntentClicked(primary, 'result_modal_primary', !!session?.token);
        }}
      />
    </main>
  );
}

function MapRow({ label, value, accent, testid }: { label: string; value: string; accent?: boolean; testid: string }) {
  return (
    <div className="flex gap-3 items-start" data-testid={testid}>
      <span className={'mt-1.5 w-2 h-2 rounded-full shrink-0 ' + (accent ? 'bg-gold' : 'bg-gold/60')}
        style={accent ? { boxShadow: '0 0 10px rgba(206,160,58,0.7)' } : undefined} />
      <div className="flex-1">
        <p className="text-[11px] uppercase tracking-[0.18em] text-gold/70">{label}</p>
        <p className={'mt-0.5 leading-[1.4] ' + (accent ? 'text-ivory text-[18px] serif' : 'text-ivory/90 text-[15px]')}
          style={accent ? { fontWeight: 500 } : undefined}>
          {value}
        </p>
      </div>
    </div>
  );
}
