'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ui, pick, fmt } from '@/lib/i18n';
import type { Lang, ResultKey } from '@/lib/types';
import { getStoredLang } from '@/lib/lang';
import { track } from '@/lib/tracking';
import { loadSession } from '@/lib/storage';
import { isValidToken } from '@/lib/token';
import { RESULTS, RESULT_KEYS } from '@/lib/results';

const VALID = new Set<ResultKey>(RESULT_KEYS);

export default function TelegramBridge() {
  const [lang, setLang] = useState<Lang>('ru');
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState<string>('');
  const [resultType, setResultType] = useState<ResultKey | ''>('');
  const [secondaryType, setSecondaryType] = useState<ResultKey | ''>('');

  useEffect(() => {
    setMounted(true);
    setLang(getStoredLang());

    const s = loadSession();
    const sp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const qToken = sp?.get('t') || '';
    const qResult = sp?.get('r') || '';

    const tk = isValidToken(qToken) ? qToken : (s?.token || '');
    const rt: ResultKey | '' =
      (VALID.has(qResult as ResultKey) ? (qResult as ResultKey) : '')
      || (s?.result_type && VALID.has(s.result_type) ? s.result_type : '');
    const sec: ResultKey | '' = (s?.secondary_result && VALID.has(s.secondary_result) && s.secondary_result !== rt)
      ? s.secondary_result : '';

    setToken(tk);
    setResultType(rt);
    setSecondaryType(sec);

    track.bridgeViewed(rt || '', !!tk);
    track.telegramOpenAttempt(rt || '', !!tk);

    /*
     * Lead-fallback hook — DISABLED by default.
     * Enable only when bot/CAPI confirmation is not yet wired AND owner approves.
     * Flip flag NEXT_PUBLIC_ENABLE_BRIDGE_LEAD=1 in Cloudflare Pages env to activate.
     *
     *   if (process.env.NEXT_PUBLIC_ENABLE_BRIDGE_LEAD === '1') {
     *     setTimeout(() => {
     *       if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
     *         (window as any).fbq('track', 'Lead', { content_name: 'altyn-mirror-bridge' });
     *       }
     *     }, 3500);
     *   }
     */
  }, []);

  const bot = process.env.NEXT_PUBLIC_TELEGRAM_BOT || 'altyntherapybot';
  const tgUrl = useMemo(() => `https://t.me/${bot}?start=${token || 'am_no_token'}`, [bot, token]);

  const hasMap = !!resultType && !!token;
  const data = hasMap ? RESULTS[resultType as ResultKey] : null;
  const secondaryData = secondaryType ? RESULTS[secondaryType] : null;

  // pre-mount placeholder to avoid hydration mismatch
  if (!mounted) {
    return <main className="min-h-[100dvh]" />;
  }

  return (
    <main className="relative min-h-[100dvh] overflow-hidden pb-safe">
      <header className="px-5 pt-5 flex items-center justify-between max-w-[560px] mx-auto">
        <Link href="/" className="serif text-[18px] tracking-[0.08em] text-ivory" data-testid="bridge-brand">
          <span className="text-gold">ALTYN</span> Mirror
        </Link>
      </header>

      <section className="px-5 pt-8 pb-[60px] pb-safe-extra max-w-[560px] mx-auto">
        {hasMap && data ? (
          <PersonalBridge
            lang={lang}
            tgUrl={tgUrl}
            token={token}
            resultType={resultType as ResultKey}
            scenario={pick(data.title, lang)}
            nuance={secondaryData ? pick(secondaryData.title, lang) : undefined}
            keyQuestion={pick(data.keyQuestion, lang)}
          />
        ) : (
          <GenericBridge lang={lang} tgUrl={tgUrl} hasToken={!!token} resultType={resultType || ''} />
        )}

        <div className="mt-10 divider-gold" />
        <p className="mt-5 text-[12.5px] text-ivory/45 text-center" data-testid="bridge-safe">
          {pick(ui.bridge.safe, lang)}
        </p>
      </section>
    </main>
  );
}

function PersonalBridge({
  lang, tgUrl, token, resultType, scenario, nuance, keyQuestion,
}: {
  lang: Lang;
  tgUrl: string;
  token: string;
  resultType: ResultKey;
  scenario: string;
  nuance?: string;
  keyQuestion: string;
}) {
  const steps = ui.bridge.steps[lang];

  return (
    <>
      <motion.p
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}
        className="text-[12px] uppercase tracking-[0.28em] text-gold/80 text-center"
        data-testid="bridge-eyebrow"
      >
        {pick(ui.bridge.eyebrow, lang)}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08 }}
        className="serif mt-3 text-[28px] leading-[1.1] text-ivory text-center" style={{ fontWeight: 500 }}
        data-testid="bridge-title"
      >
        {pick(ui.bridge.titlePersonal, lang)}
      </motion.h1>

      {/* Promise badge */}
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.22 }}
        className="mt-4 text-[14.5px] text-ivory/80 leading-[1.55] text-center"
        data-testid="bridge-promise"
      >
        {pick(ui.bridge.promise, lang)}
      </motion.p>

      {/* Mini scenario card (the actual personalization) */}
      <motion.section
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.32 }}
        className="mt-6 card card-gold-edge p-5"
        data-testid="bridge-card"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10.5px] uppercase tracking-[0.24em] text-gold/80">
            {fmt(pick(ui.bridge.cardLabel, lang), { token })}
          </p>
          <span className="text-[10.5px] uppercase tracking-[0.22em] text-gold/55" data-testid="bridge-result-type">
            {resultType}
          </span>
        </div>

        <div className="mt-3 space-y-3">
          <BRow label={pick(ui.bridge.rowScenario, lang)} value={scenario} accent testid="bridge-row-scenario" />
          {nuance && <BRow label={pick(ui.bridge.rowNuance, lang)} value={nuance} testid="bridge-row-nuance" />}
          <div className="pt-2 mt-1 border-t border-gold/15">
            <p className="text-[10.5px] uppercase tracking-[0.22em] text-gold/70">{pick(ui.bridge.rowKey, lang)}</p>
            <p data-testid="bridge-row-key" className="serif mt-1 text-[17px] italic leading-[1.3] text-ivory">
              “{keyQuestion}”
            </p>
          </div>
        </div>
      </motion.section>

      {/* What happens after click */}
      <motion.section
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45 }}
        className="mt-6"
        data-testid="bridge-steps"
      >
        <p className="text-[11px] uppercase tracking-[0.24em] text-gold/80">{pick(ui.bridge.stepsHeading, lang)}</p>
        <ol className="mt-3 space-y-2">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-3 items-start text-[14.5px] text-ivory/90 leading-[1.45]" data-testid={`bridge-step-${i + 1}`}>
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gold shrink-0" style={{ boxShadow: '0 0 8px rgba(206,160,58,0.6)' }} />
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </motion.section>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55 }}
        className="mt-7 flex flex-col gap-3"
      >
        <a
          data-testid="bridge-open-tg"
          href={tgUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold text-[17px] w-full"
          onClick={() => {
            track.telegramIntentClicked(resultType, 'bridge_personal', true);
            track.telegramOpenAttempt(resultType, true);
          }}
        >
          {pick(ui.bridge.open, lang)}
        </a>
        <p className="text-[12px] text-ivory/45 text-center">{pick(ui.bridge.fallback, lang)}</p>
      </motion.div>
    </>
  );
}

function GenericBridge({
  lang, tgUrl, hasToken, resultType,
}: {
  lang: Lang;
  tgUrl: string;
  hasToken: boolean;
  resultType: string;
}) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
        className="mx-auto w-[120px] h-[120px] rounded-full mb-7"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #fff5d0, #cea03a 55%, #4b3408 100%)',
          boxShadow: '0 0 80px rgba(206,160,58,0.45), inset 0 0 30px rgba(255,240,200,0.4)',
        }}
      />

      <motion.h1
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
        className="serif text-[28px] leading-[1.1] text-ivory text-center" style={{ fontWeight: 500 }}
        data-testid="bridge-title"
      >
        {pick(ui.bridge.titleGeneric, lang)}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.25 }}
        className="mt-4 text-[15px] text-ivory/80 leading-[1.55] text-center"
        data-testid="bridge-body"
      >
        {pick(ui.bridge.genericBody, lang)}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
        className="mt-8 flex flex-col gap-3"
      >
        <Link
          data-testid="bridge-collect-first"
          href="/play/"
          className="btn-gold text-[17px] text-center"
          onClick={() => track.startMirror()}
        >
          {pick(ui.bridge.openFirst, lang)}
        </Link>
        <a
          data-testid="bridge-open-tg"
          href={tgUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost text-[14.5px] w-full"
          onClick={() => {
            track.telegramIntentClicked(resultType, 'bridge_generic', hasToken);
            track.telegramOpenAttempt(resultType, hasToken);
          }}
        >
          {pick(ui.bridge.open, lang)}
        </a>
        <p className="text-[12px] text-ivory/45 text-center">{pick(ui.bridge.fallback, lang)}</p>
      </motion.div>
    </>
  );
}

function BRow({ label, value, accent, testid }: { label: string; value: string; accent?: boolean; testid: string }) {
  return (
    <div className="flex gap-3 items-start" data-testid={testid}>
      <span className={'mt-1.5 w-2 h-2 rounded-full shrink-0 ' + (accent ? 'bg-gold' : 'bg-gold/60')}
        style={accent ? { boxShadow: '0 0 10px rgba(206,160,58,0.7)' } : undefined} />
      <div className="flex-1">
        <p className="text-[11px] uppercase tracking-[0.18em] text-gold/70">{label}</p>
        <p className={'mt-0.5 leading-[1.4] ' + (accent ? 'text-ivory text-[17px] serif' : 'text-ivory/90 text-[14.5px]')}
           style={accent ? { fontWeight: 500 } : undefined}>
          {value}
        </p>
      </div>
    </div>
  );
}
