'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ui, pick, fmt } from '@/lib/i18n';
import type { Lang, ResultKey } from '@/lib/types';
import { RESULTS, RESULT_DISCLAIMER, RESULT_KEYS } from '@/lib/results';
import { getStoredLang } from '@/lib/lang';
import { track } from '@/lib/tracking';
import { notify } from '@/lib/notify';
import { postMirrorEvent } from '@/lib/mirrorIngest';
import { sendCapi, mirrorCompletedEventId, shouldFireMirrorCompleted, readCapiUserHints } from '@/lib/capi';
import { loadSession, saveSession } from '@/lib/storage';
import type { SessionData } from '@/lib/storage';
import { newToken } from '@/lib/token';
import { OWNER_URL, openOwnerDirect, buildOwnerMessage } from '@/lib/openOwner';
import { OrbitMark } from '@/components/OrbitMark';
import { ShareCard } from '@/components/ShareCard';
import { StickyTelegramCta } from '@/components/StickyTelegramCta';
import IgBrowserBanner from '@/components/IgBrowserBanner';

const VALID = new Set<ResultKey>(RESULT_KEYS);

export default function ResultClient({ slug }: { slug: string }) {
  const slugKey = (VALID.has(slug as ResultKey) ? (slug as ResultKey) : 'tuman');
  const [lang, setLang] = useState<Lang>('ru');
  const [session, setSession] = useState<SessionData | null>(null);
  const [savingState, setSavingState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const cardRef = useRef<HTMLDivElement>(null);

  const primary: ResultKey = slugKey;
  const secondary: ResultKey | null = session?.secondary_result && session.secondary_result !== primary
    ? session.secondary_result
    : null;

  const data = RESULTS[primary];
  const secondaryData = secondary ? RESULTS[secondary] : null;
  const markers = data.markers[lang] || data.markers.ru;
  const prepQuestions = data.prepQuestions[lang] || data.prepQuestions.ru;
  const sessionPlan = data.sessionPlan[lang] || data.sessionPlan.ru;
  const whatsVisible = data.whatsVisible[lang] || data.whatsVisible.ru;
  const reassureChips = ui.result.reassureChips[lang];
  const meaningIsItems = ui.result.meaningIsItems[lang];
  const meaningIsNotItems = ui.result.meaningIsNotItems[lang];
  const factsItems = ui.result.factsItems[lang];

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

    // V6.4 — MirrorCompleted safety net for direct visits to /result/[slug]
    // (e.g. saved-link, browser back). Same event_id as /play finalize so
    // Meta dedupes browser + server fires.
    if (s.session_id && shouldFireMirrorCompleted(s.session_id)) {
      const mcEventId = mirrorCompletedEventId(s.session_id);
      track.mirrorCompleted(mcEventId);
      sendCapi('MirrorCompleted', mcEventId, {
        content_name: 'altyn_mirror_completed',
        content_category: 'mirror_completed',
        result_type: primary,
        secondary_result: s.secondary_result && s.secondary_result !== primary ? s.secondary_result : '',
        from: 'result_mount',
        lang: l,
        utm_source: s.utm_source || '',
        utm_campaign: s.utm_campaign || '',
        utm_content: s.utm_content || '',
        utm_term: s.utm_term || '',
        token_present: !!s.token,
        page_path: typeof window !== 'undefined' ? window.location.pathname : '',
        fbclid_present: !!s.fbclid,
      }, readCapiUserHints({ fbclid: s.fbclid, sessionId: s.session_id }));
    }

    // V6: notify the leads group that the map is complete (throttled per session)
    const secLabel = s.secondary_result ? pick(RESULTS[s.secondary_result].title, l) : '';
    notify('quiz_completed', {
      scenario: pick(data.title, l),
      secondary: secLabel,
      key_question: pick(data.keyQuestion, l),
      token_short: (s.token || '').replace(/^am_/, '').slice(0, 10),
      page: '/result',
    });

    const t1 = window.setTimeout(() => track.meaningBlockViewed(primary), 1200);
    const t2 = window.setTimeout(() => track.personalPrepViewed(primary), 1800);
    const t3 = window.setTimeout(() => track.personalizedOfferViewed(primary), 2400);
    const t4 = window.setTimeout(() => track.sessionPreviewViewed(primary), 2600);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); window.clearTimeout(t3); window.clearTimeout(t4); };
  }, [primary, data]);

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

  const scenarioLabel = pick(data.title, lang);
  const secondaryLabel = secondaryData ? pick(secondaryData.title, lang) : '';
  const keyQuestionLabel = pick(data.keyQuestion, lang);

  // V6.1 — Bot fallback still routes through the bridge (visible, not hidden).
  const botBridgeHref = useMemo(() => {
    const t = session?.token || '';
    return `/go/telegram/?target=bot&t=${encodeURIComponent(t)}&r=${primary}&from=bot_secondary`;
  }, [session?.token, primary]);

  // V6.1 — On-page copy-ready message + inline copy + Telegram-didn't-open helper
  const ownerMessage = useMemo(() => buildOwnerMessage({
    scenario: scenarioLabel,
    secondary: secondaryLabel,
    keyQuestion: keyQuestionLabel,
    lang,
  }), [scenarioLabel, secondaryLabel, keyQuestionLabel, lang]);

  const [msgCopyState, setMsgCopyState] = useState<'idle' | 'ok' | 'fail'>('idle');
  const [linkCopyState, setLinkCopyState] = useState<'idle' | 'ok' | 'fail'>('idle');
  const [showOpenHint, setShowOpenHint] = useState(false);
  // PR-1: dedicated state for the post-CTA-click toast so it doesn't fight
  // with the explicit "Copy message" button feedback (msgCopyState).
  const [showCtaToast, setShowCtaToast] = useState(false);
  const hintTimerRef = useRef<number | null>(null);
  const ctaToastTimerRef = useRef<number | null>(null);

  async function copyText(text: string, kind: 'msg' | 'link') {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
      }
      if (kind === 'msg') { setMsgCopyState('ok'); window.setTimeout(() => setMsgCopyState('idle'), 2400); }
      else { setLinkCopyState('ok'); window.setTimeout(() => setLinkCopyState('idle'), 2400); }
    } catch {
      if (kind === 'msg') { setMsgCopyState('fail'); window.setTimeout(() => setMsgCopyState('idle'), 3000); }
      else { setLinkCopyState('fail'); window.setTimeout(() => setLinkCopyState('idle'), 3000); }
    }
  }

  // V6.1 — One-click owner direct: fire side effects, then let anchor href open Telegram.
  function fireOwnerIntent(from: 'result_primary' | 'sticky_cta' | 'prep_block'): void {
    openOwnerDirect({
      resultType: primary,
      secondaryResult: session?.secondary_result || '',
      tokenPresent: !!session?.token,
      tokenShort: tokenShort === '——' ? '' : tokenShort,
      scenarioTitle: scenarioLabel,
      secondaryTitle: secondaryLabel,
      keyQuestion: keyQuestionLabel,
      from,
      lang,
    });

    // PR-1: visible confirmation that the prepared message has been copied.
    // Pure UI — no Pixel / CAPI / notify side-effects, no event_id, no value.
    // (Pixel Contact + OwnerDirectIntentClicked are still fired only by
    // openOwnerDirect on a real user click — unchanged.)
    setShowCtaToast(true);
    if (ctaToastTimerRef.current) window.clearTimeout(ctaToastTimerRef.current);
    ctaToastTimerRef.current = window.setTimeout(() => setShowCtaToast(false), 2400);

    // After ~1.6s show the "did Telegram open?" inline helper.
    // (mobile deep-links sometimes fail silently; this gives the user a fallback)
    if (hintTimerRef.current) window.clearTimeout(hintTimerRef.current);
    hintTimerRef.current = window.setTimeout(() => setShowOpenHint(true), 1800);
  }

  function fireBotIntent(): void {
    track.telegramIntentClicked({
      result_type: primary,
      secondary_result: session?.secondary_result || '',
      token_present: !!session?.token,
      from: 'bot_secondary',
    });
    notify('telegram_bot_intent', {
      scenario: scenarioLabel,
      secondary: secondaryLabel,
      token_short: tokenShort === '——' ? '' : tokenShort,
      from: 'bot_secondary',
      page: '/result',
    });
    // Phase 2.3 — Mirror ingest. Bot fallback intent.
    postMirrorEvent({
      event_name: 'telegram_bot_intent',
      result_type: primary,
      secondary_result: session?.secondary_result || undefined,
      from: 'bot_secondary',
    });
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

      <section className="px-5 pt-7 pb-56 max-w-[640px] mx-auto">
        {/* ── Above-fold zone ── */}
        <motion.p
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-[12px] uppercase tracking-[0.28em] text-gold/80"
        >
          {pick(ui.result.eyebrow, lang)}
        </motion.p>

        <motion.h1
          data-testid="result-title"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.1 }}
          className="serif mt-3 text-[34px] leading-[1.06] text-ivory" style={{ fontWeight: 500 }}
        >
          {scenarioLabel}
        </motion.h1>

        {secondaryData && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.3 }}
            className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/30 bg-ink-800/60"
            data-testid="nuance-badge"
          >
            <span className="text-[10px] uppercase tracking-[0.22em] text-gold/80">{pick(ui.result.nuanceBadge, lang)}</span>
            <span className="text-[12.5px] text-ivory/85">{secondaryLabel}</span>
          </motion.div>
        )}

        {/* V5: "Карта собрана по 7 маркерам · {date}" chip */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/25 bg-ink-800/40"
          data-testid="assembled-by-7-chip"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold" style={{ boxShadow: '0 0 8px rgba(206,160,58,0.7)' }} />
          <span className="text-[11.5px] text-gold/85">
            {fmt(pick(ui.result.assembledBy7, lang), { date: completedDate || '—' })}
          </span>
        </motion.div>

        {/* Orbit — reduced to ~140px on result page (V5) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 flex justify-center"
        >
          <OrbitMark className="w-[140px] h-[140px]" />
        </motion.div>

        {/* ── Scenario Passport ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.3 }}
          className="mt-7 card card-gold-edge p-5 relative overflow-hidden"
          data-testid="scenario-passport"
        >
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
            <MapRow label={pick(ui.result.cardPrimary, lang)} value={scenarioLabel} accent testid="map-row-primary" />
            {secondaryData && (
              <MapRow label={pick(ui.result.cardSecondary, lang)} value={secondaryLabel} testid="map-row-secondary" />
            )}
            <MapRow label={pick(ui.result.cardEntry, lang)} value={pick(data.map.start, lang)} testid="map-row-entry" />
            <MapRow label={pick(ui.result.cardHold, lang)}  value={pick(data.map.hold, lang)}  testid="map-row-hold" />
            <MapRow label={pick(ui.result.cardLoop, lang)}  value={pick(data.map.loop, lang)}  testid="map-row-loop" />
            <div className="pt-2 mt-2 border-t border-gold/15">
              <p className="text-[11px] uppercase tracking-[0.22em] text-gold/70">{pick(ui.result.cardKey, lang)}</p>
              <p data-testid="map-row-key" className="serif mt-1 text-[19px] italic leading-[1.3] text-ivory">
                “{keyQuestionLabel}”
              </p>
            </div>
          </div>

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

          <p className="mt-5 text-[10.5px] uppercase tracking-[0.18em] text-gold/45">
            {pick(ui.result.passportStamp, lang)}
          </p>
        </motion.section>

        {/* ──────────────────────────────────────────────────────────────
            PR-2 — Primary CTA cluster lifted above the explanatory blocks.
            The user can now act right after the Scenario Passport instead of
            scrolling through 12+ paragraphs. Analytics unchanged:
              - same data-testids (result-cta-altyn, ready-message-*, etc.)
              - same fireOwnerIntent('result_primary') trigger
              - same Contact / OwnerDirectIntentClicked event_ids
            ────────────────────────────────────────────────────────────── */}
        <div className="mt-7" data-testid="primary-cta-cluster">
          <p className="text-[14px] text-gold/90 leading-[1.55]" data-testid="continuation-promise">
            {pick(ui.result.continueWithAltyn, lang)}
          </p>

          {/* PR-3 — IG/FB/Line in-app browser fallback. Renders only when
              webview is detected. Pure add-on — does not replace primary CTA. */}
          <IgBrowserBanner
            lang={lang}
            resultType={primary}
            secondaryResult={session?.secondary_result || ''}
            tokenPresent={!!session?.token}
            tokenShort={tokenShort === '——' ? '' : tokenShort}
            scenarioTitle={scenarioLabel}
            secondaryTitle={secondaryLabel}
            keyQuestion={keyQuestionLabel}
          />

          {/* On-page ready-to-paste message */}
          <section
            className="mt-4 card p-4"
            style={{ background: 'rgba(20,20,25,0.55)' }}
            data-testid="ready-message-block"
          >
            <p className="text-[11px] uppercase tracking-[0.22em] text-gold/80">
              {pick(ui.result.msgTitle, lang)}
            </p>
            <p className="mt-1.5 text-[12.5px] text-ivory/60 leading-[1.5]">
              {pick(ui.result.msgSubtitle, lang)}
            </p>
            <p
              data-testid="ready-message-text"
              className="mt-3 text-[14px] text-ivory/90 leading-[1.55] whitespace-pre-wrap select-text"
            >
              {ownerMessage}
            </p>
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <button
                data-testid="ready-message-copy"
                onClick={() => copyText(ownerMessage, 'msg')}
                className="btn-ghost text-[13px] py-2 px-3.5"
              >
                {pick(ui.result.msgCopy, lang)}
              </button>
              {msgCopyState === 'ok' && (
                <span data-testid="ready-message-copied" className="text-[12.5px] text-gold/90">
                  {pick(ui.result.msgCopied, lang)}
                </span>
              )}
              {msgCopyState === 'fail' && (
                <span className="text-[12px] text-bordo-400">{pick(ui.result.msgCopyFail, lang)}</span>
              )}
            </div>
          </section>

          <div className="mt-5 flex flex-col gap-2">
            {/* PR-1 — 3-step instruction shown BEFORE the click. */}
            <div
              data-testid="cta-instruction-block"
              className="mb-1 rounded-2xl border border-gold/20 bg-ink-900/40 px-4 py-3 text-left"
            >
              <p className="text-[11.5px] uppercase tracking-[0.18em] text-gold/75 mb-2">
                {pick(ui.result.instructionTitle, lang)}
              </p>
              <ol className="space-y-1.5 text-[13px] text-ivory/80 leading-[1.45] list-none">
                <li className="flex gap-2" data-testid="cta-instruction-step-1">
                  <span className="text-gold/80 font-semibold tabular-nums shrink-0">1.</span>
                  <span>{pick(ui.result.instructionStep1, lang)}</span>
                </li>
                <li className="flex gap-2" data-testid="cta-instruction-step-2">
                  <span className="text-gold/80 font-semibold tabular-nums shrink-0">2.</span>
                  <span>{pick(ui.result.instructionStep2, lang)}</span>
                </li>
                <li className="flex gap-2" data-testid="cta-instruction-step-3">
                  <span className="text-gold/80 font-semibold tabular-nums shrink-0">3.</span>
                  <span>{pick(ui.result.instructionStep3, lang)}</span>
                </li>
              </ol>
            </div>

            {/* V6.1 — One-click owner-direct primary CTA */}
            <a
              data-testid="result-cta-altyn"
              href={OWNER_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => fireOwnerIntent('result_primary')}
              className="btn-gold text-[16px] w-full text-center"
            >
              {pick(ui.result.primaryCta, lang)}
            </a>
            <p className="text-[12.5px] text-ivory/55 leading-[1.5] text-center" data-testid="result-cta-hint">
              {pick(ui.result.primaryCtaHint, lang)}
            </p>

            {showOpenHint && (
              <motion.div
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="mt-1 text-center"
                data-testid="tg-not-opened-block"
              >
                <p className="text-[12.5px] text-ivory/60">{pick(ui.result.tgNotOpened, lang)}</p>
                <button
                  data-testid="copy-owner-link"
                  onClick={() => copyText(OWNER_URL, 'link')}
                  className="btn-ghost mt-2 text-[13px] py-2 px-3.5"
                >
                  {pick(ui.result.copyOwnerLink, lang)}
                </button>
                {linkCopyState === 'ok' && (
                  <p className="mt-2 text-[12.5px] text-gold/90">{pick(ui.bridge.copyOk, lang)}</p>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Poetic description */}
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

        {/* ── V6: «Что уже видно по карте» — per-scenario practical summary ── */}
        <motion.section
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.58 }}
          className="mt-9 card card-gold-edge p-5"
          data-testid="whats-visible-block"
        >
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold/80">
            {pick(ui.result.whatsVisibleTitle, lang)}
          </p>
          <p className="mt-2 text-[14.5px] text-ivory/85 leading-[1.55]">
            {pick(ui.result.whatsVisibleIntro, lang)}
          </p>
          <ol className="mt-3 space-y-2">
            {whatsVisible.map((line, i) => (
              <li
                key={i}
                className="flex gap-3 items-start"
                data-testid={`whats-visible-${i + 1}`}
              >
                <span className="serif text-gold text-[18px] leading-none mt-0.5 shrink-0" style={{ fontWeight: 500 }}>
                  {i + 1}.
                </span>
                <span className="text-[14.5px] text-ivory/90 leading-[1.55]">{line}</span>
              </li>
            ))}
          </ol>
        </motion.section>

        {/* ── V5: «Это значит / Это не значит» ── */}
        <motion.section
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.62 }}
          className="mt-9 card card-gold-edge p-5"
          data-testid="meaning-block"
        >
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold/80">
            {pick(ui.result.meaningTitle, lang)}
          </p>
          <div className="mt-4 grid sm:grid-cols-2 gap-5">
            <div data-testid="meaning-is">
              <p className="text-[12px] uppercase tracking-[0.22em] text-gold">
                {pick(ui.result.meaningIsHeading, lang)}
              </p>
              <ul className="mt-3 space-y-2">
                {meaningIsItems.map((it, i) => (
                  <li key={i} className="flex gap-2.5 items-start" data-testid={`meaning-is-${i + 1}`}>
                    <span className="text-gold mt-1 text-[12px] shrink-0">◆</span>
                    <span className="text-[14.5px] text-ivory/90 leading-[1.5]">{it}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div data-testid="meaning-is-not">
              <p className="text-[12px] uppercase tracking-[0.22em] text-ivory/55">
                {pick(ui.result.meaningIsNotHeading, lang)}
              </p>
              <ul className="mt-3 space-y-2">
                {meaningIsNotItems.map((it, i) => (
                  <li key={i} className="flex gap-2.5 items-start" data-testid={`meaning-is-not-${i + 1}`}>
                    <span className="text-ivory/55 mt-1 text-[12px] shrink-0">◇</span>
                    <span className="text-[14.5px] text-ivory/75 leading-[1.5]">{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        {/* ── V6: «Где проверить факты» — static helper before live talk ── */}
        <motion.section
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.66 }}
          className="mt-9"
          data-testid="facts-block"
        >
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold/80">
            {pick(ui.result.factsTitle, lang)}
          </p>
          <p className="mt-2 text-[14.5px] text-ivory/85 leading-[1.55]">
            {pick(ui.result.factsIntro, lang)}
          </p>
          <ol className="mt-4 space-y-2.5">
            {factsItems.map((q, i) => (
              <li
                key={i}
                className="flex gap-3 items-start card card-gold-edge px-4 py-3"
                data-testid={`facts-item-${i + 1}`}
              >
                <span className="serif text-gold text-[18px] leading-none mt-0.5 shrink-0" style={{ fontWeight: 500 }}>
                  {i + 1}.
                </span>
                <span className="text-[14.5px] text-ivory/90 leading-[1.5]">{q}</span>
              </li>
            ))}
          </ol>
        </motion.section>

        {/* ── V6: «Что лучше не делать сразу после карты» ── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-9 card p-5"
          style={{ background: 'rgba(20,20,25,0.55)' }}
          data-testid="dont-do-block"
        >
          <p className="text-[11px] uppercase tracking-[0.24em] text-bordo-400">
            {pick(ui.result.dontDoTitle, lang)}
          </p>
          <p className="mt-2 text-[14.5px] text-ivory/85 leading-[1.6]">
            {pick(ui.result.dontDoBody, lang)}
          </p>
        </motion.section>

        {/* ── V5: Personal Prep block (CTA now sends questions to Алтын directly) ── */}
        <motion.section
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.74 }}
          className="mt-9"
          data-testid="personal-prep"
        >
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold/80">
            {pick(ui.result.prepTitle, lang)}
          </p>
          <p className="mt-2 text-[14.5px] text-ivory/75 leading-[1.55]">
            {pick(ui.result.prepSubtitle, lang)}
          </p>
          <ol className="mt-4 space-y-3">
            {prepQuestions.map((q, i) => (
              <li
                key={i}
                className="card card-gold-edge px-4 py-3.5 flex gap-3 items-start"
                data-testid={`prep-q-${i + 1}`}
              >
                <span className="serif text-gold text-[20px] leading-none mt-0.5 shrink-0" style={{ fontWeight: 500 }}>
                  {i + 1}
                </span>
                <span className="text-[15px] text-ivory/90 leading-[1.5]">{q}</span>
              </li>
            ))}
          </ol>
          <div className="mt-4">
            <a
              data-testid="prep-telegram-cta"
              href={OWNER_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => fireOwnerIntent('prep_block')}
              className="inline-flex items-center gap-2 text-[14px] text-gold hover:text-gold-200 transition-colors"
            >
              <span className="underline-offset-2 underline decoration-gold/40">
                {pick(ui.result.prepCta, lang)}
              </span>
            </a>
          </div>
        </motion.section>

        {/* ── V5: First Calm Step (separate block) ── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.78 }}
          className="mt-9 card card-gold-edge p-5"
          data-testid="first-calm-step"
        >
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold/80">
            {pick(ui.result.firstStepHeading, lang)}
          </p>
          <p className="serif mt-2 text-[18px] leading-[1.45] text-ivory italic">
            {pick(data.firstStep, lang)}
          </p>
        </motion.section>

        {/* ── V5/V6: Personalized offer block per scenario ── */}
        <motion.section
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.86 }}
          className="mt-9"
          data-testid="personalized-offer"
        >
          <p className="text-[11px] uppercase tracking-[0.24em] text-gold/80">
            {fmt(pick(ui.result.personalizedOfferTitle, lang), { scenario: scenarioLabel })}
          </p>
          <ol className="mt-4 space-y-3">
            {sessionPlan.map((s, i) => (
              <li
                key={i}
                className="card card-gold-edge px-4 py-3.5"
                data-testid={`offer-step-${i + 1}`}
              >
                <p className="text-[12.5px] uppercase tracking-[0.16em] text-gold/90">{s.time}</p>
                <p className="mt-1 text-[14.5px] text-ivory/90 leading-[1.5]">{s.text}</p>
              </li>
            ))}
          </ol>
          {/* V6 — "You won't redo the test" reassurance */}
          <p className="mt-4 text-[14px] text-gold/90 leading-[1.55]" data-testid="offer-no-retest">
            {pick(ui.result.personalizedOfferNoRetest, lang)}
          </p>
          <div className="mt-3 text-[13px] text-ivory/70 leading-[1.55]" data-testid="offer-footer">
            <p>{pick(ui.result.personalizedOfferFooter, lang)}</p>
            <p className="mt-2 text-[12.5px] text-ivory/55">
              {pick(ui.result.personalizedOfferPayment, lang)}
            </p>
          </div>
        </motion.section>

        {/* Reassurance chips */}
        <motion.section
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.95 }}
          className="mt-8"
          data-testid="reassurance-block"
        >
          <ul className="flex flex-wrap gap-2">
            {reassureChips.map((c, i) => (
              <li key={i}
                className="px-3 py-1.5 rounded-full text-[12px] text-ivory/85 border border-gold/25 bg-ink-800/40"
                data-testid={`reassure-chip-${i + 1}`}>
                {c}
              </li>
            ))}
          </ul>
        </motion.section>

        {/* PR-2 — Bot fallback + save card moved below explanatory blocks.
            Primary CTA already presented above; this section is for users
            who want alternatives. Analytics unchanged. */}
        <div className="mt-9 flex flex-col gap-3" data-testid="secondary-cta-cluster">
          <Link
            data-testid="result-cta-bot"
            href={botBridgeHref}
            onClick={fireBotIntent}
            className="btn-ghost text-[14px] w-full text-center"
          >
            {pick(ui.result.secondaryBotCta, lang)}
          </Link>

          <button
            data-testid="result-save-btn"
            onClick={onSave}
            className="text-[13px] text-ivory/60 hover:text-gold transition-colors py-2"
            aria-live="polite"
          >
            {savingState === 'saving' ? pick(ui.result.saving, lang)
              : savingState === 'saved' ? pick(ui.result.saved, lang)
              : savingState === 'error' ? pick(ui.result.saveFail, lang)
              : pick(ui.result.save, lang)}
          </button>
        </div>

        {/* Hidden render target for share card export */}
        <div style={{ position: 'fixed', left: -99999, top: 0, pointerEvents: 'none' }} aria-hidden="true">
          <ShareCard
            ref={cardRef}
            title={scenarioLabel}
            secondary={secondaryData ? secondaryLabel : undefined}
            markers={markers}
            keyQuestion={keyQuestionLabel}
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

      {/* Sticky bottom CTA → Алтын direct one-click (V6.1) */}
      <StickyTelegramCta
        lang={lang}
        ownerUrl={OWNER_URL}
        resultType={primary}
        secondaryResult={session?.secondary_result || ''}
        tokenPresent={!!session?.token}
        onClick={() => fireOwnerIntent('sticky_cta')}
      />

      {/* PR-1 — Post-click toast confirming the prepared message was copied
          to clipboard. Sits above the sticky CTA, fades out after 2.4s.
          Pure UI — no Pixel / CAPI / notify side effects. */}
      <div
        data-testid="cta-copy-toast"
        aria-live="polite"
        aria-hidden={!showCtaToast}
        className={
          'fixed inset-x-0 z-50 px-4 pointer-events-none ' +
          'transition-all duration-300 ease-out ' +
          (showCtaToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2')
        }
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 80px)' }}
      >
        <div className="max-w-[420px] mx-auto px-4 py-3 rounded-2xl bg-ink-900/95 border border-gold/40 text-ivory text-[14px] text-center shadow-gold">
          {pick(ui.result.copyToast, lang)}
        </div>
      </div>
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
