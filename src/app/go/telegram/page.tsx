'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ui, pick, fmt } from '@/lib/i18n';
import type { Lang, ResultKey } from '@/lib/types';
import { getStoredLang } from '@/lib/lang';
import { track } from '@/lib/tracking';
import { notify } from '@/lib/notify';
import { loadSession } from '@/lib/storage';
import { isValidToken } from '@/lib/token';
import { RESULTS, RESULT_KEYS } from '@/lib/results';

const VALID = new Set<ResultKey>(RESULT_KEYS);
const OWNER_HANDLE = 'Altyn2304';
const OWNER_URL = `https://t.me/${OWNER_HANDLE}`;

type Target = 'owner' | 'bot';

export default function TelegramBridge() {
  const [lang, setLang] = useState<Lang>('ru');
  const [mounted, setMounted] = useState(false);
  const [target, setTarget] = useState<Target>('owner');
  const [from, setFrom] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [resultType, setResultType] = useState<ResultKey | ''>('');
  const [secondaryType, setSecondaryType] = useState<ResultKey | ''>('');
  const [showFallback, setShowFallback] = useState(false);
  const [copyMsg, setCopyMsg] = useState<'' | 'link-ok' | 'link-fail' | 'msg-ok' | 'msg-fail'>('');

  useEffect(() => {
    setMounted(true);
    setLang(getStoredLang());

    const s = loadSession();
    const sp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const qTarget = sp?.get('target') === 'bot' ? 'bot' : 'owner';
    const qToken = sp?.get('t') || '';
    const qResult = sp?.get('r') || '';
    const qFrom = sp?.get('from') || (qTarget === 'owner' ? 'bridge_owner' : 'bridge_bot');

    const tk = isValidToken(qToken) ? qToken : (s?.token || '');
    const rt: ResultKey | '' =
      (VALID.has(qResult as ResultKey) ? (qResult as ResultKey) : '')
      || (s?.result_type && VALID.has(s.result_type) ? s.result_type : '');
    const sec: ResultKey | '' = (s?.secondary_result && VALID.has(s.secondary_result) && s.secondary_result !== rt)
      ? s.secondary_result : '';

    setTarget(qTarget);
    setFrom(qFrom);
    setToken(tk);
    setResultType(rt);
    setSecondaryType(sec);

    track.bridgeViewed({ result_type: rt || '', token_present: !!tk, target: qTarget });

    // V5: copy-link fallback appears after 3.5s
    const timer = window.setTimeout(() => setShowFallback(true), 3500);
    return () => window.clearTimeout(timer);
  }, []);

  const botHandle = process.env.NEXT_PUBLIC_TELEGRAM_BOT || 'altyntherapybot';
  const tgBotUrl = useMemo(() => `https://t.me/${botHandle}?start=${token || 'am_no_token'}`, [botHandle, token]);

  const hasMap = !!resultType;
  const data = hasMap ? RESULTS[resultType as ResultKey] : null;
  const secondaryData = secondaryType ? RESULTS[secondaryType] : null;

  // Always destination on this page: pre-built copy message
  const scenarioTitle = data ? pick(data.title, lang) : '';
  const secondaryTitle = secondaryData ? pick(secondaryData.title, lang) : (lang === 'uz' ? 'aniqlanmagan' : 'не выделен');
  const keyQuestionStr = data ? pick(data.keyQuestion, lang) : '';
  const copyMessage = useMemo(() => {
    if (!data) return '';
    return fmt(pick(ui.bridge.messageTemplate, lang), {
      scenario: scenarioTitle,
      secondary: secondaryTitle,
      keyQuestion: keyQuestionStr,
    });
  }, [data, lang, scenarioTitle, secondaryTitle, keyQuestionStr]);

  async function copyText(text: string, kind: 'link' | 'msg') {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopyMsg(kind === 'link' ? 'link-ok' : 'msg-ok');
      window.setTimeout(() => setCopyMsg(''), 2400);
    } catch {
      setCopyMsg(kind === 'link' ? 'link-fail' : 'msg-fail');
      window.setTimeout(() => setCopyMsg(''), 3000);
    }
  }

  // pre-mount placeholder
  if (!mounted) return <main className="min-h-[100dvh]" />;

  return (
    <main className="relative min-h-[100dvh] overflow-hidden pb-safe">
      <header className="px-5 pt-5 flex items-center justify-between max-w-[560px] mx-auto">
        <Link href="/" className="serif text-[18px] tracking-[0.08em] text-ivory" data-testid="bridge-brand">
          <span className="text-gold">ALTYN</span> Mirror
        </Link>
      </header>

      <section className="px-5 pt-8 pb-[60px] pb-safe-extra max-w-[560px] mx-auto">
        {target === 'owner' && hasMap && data ? (
          <OwnerBridge
            lang={lang}
            token={token}
            resultType={resultType as ResultKey}
            scenario={scenarioTitle}
            nuance={secondaryData ? pick(secondaryData.title, lang) : undefined}
            keyQuestion={keyQuestionStr}
            tgBotUrl={tgBotUrl}
            from={from}
            copyMessage={copyMessage}
            onCopyMsg={() => copyText(copyMessage, 'msg')}
            copyMsg={copyMsg}
          />
        ) : target === 'owner' && !hasMap ? (
          <OwnerGenericBridge lang={lang} from={from} />
        ) : hasMap && data ? (
          <PersonalBotBridge
            lang={lang}
            tgUrl={tgBotUrl}
            token={token}
            resultType={resultType as ResultKey}
            scenario={scenarioTitle}
            nuance={secondaryData ? pick(secondaryData.title, lang) : undefined}
            keyQuestion={keyQuestionStr}
            from={from}
          />
        ) : (
          <GenericBotBridge lang={lang} tgUrl={tgBotUrl} hasToken={!!token} resultType={resultType || ''} from={from} />
        )}

        {/* V5/V6: Copy-Алтын-link fallback after 3.5s — owner mode only */}
        {showFallback && target === 'owner' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mt-6 text-center"
            data-testid="bridge-copy-block"
          >
            <p className="text-[13px] text-ivory/65">{pick(ui.bridge.notOpened, lang)}</p>
            <button
              onClick={() => copyText(OWNER_URL, 'link')}
              data-testid="bridge-copy-link"
              className="btn-ghost mt-2 text-[14px]"
            >
              {pick(ui.bridge.copyLink, lang)}
            </button>
            {copyMsg === 'link-ok' && (
              <p data-testid="bridge-copy-ok" className="mt-2 text-[12.5px] text-gold/90">{pick(ui.bridge.copyOk, lang)}</p>
            )}
            {copyMsg === 'link-fail' && (
              <p data-testid="bridge-copy-fail" className="mt-2 text-[12px] text-bordo-400">{pick(ui.bridge.copyFail, lang)}</p>
            )}
          </motion.div>
        )}

        <div className="mt-10 divider-gold" />
        <p className="mt-5 text-[12.5px] text-ivory/45 text-center" data-testid="bridge-safe">
          {pick(ui.bridge.safe, lang)}
        </p>
      </section>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────
// V6 — Owner direct bridge (primary path)
// ─────────────────────────────────────────────────────────────
function OwnerBridge({
  lang, token, resultType, scenario, nuance, keyQuestion, tgBotUrl, from, copyMessage, onCopyMsg, copyMsg,
}: {
  lang: Lang;
  token: string;
  resultType: ResultKey;
  scenario: string;
  nuance?: string;
  keyQuestion: string;
  tgBotUrl: string;
  from: string;
  copyMessage: string;
  onCopyMsg: () => void;
  copyMsg: '' | 'link-ok' | 'link-fail' | 'msg-ok' | 'msg-fail';
}) {
  const shortToken = (token || '').replace(/^am_/, '').slice(0, 10) || '——';

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
        {pick(ui.bridge.titleOwner, lang)}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.22 }}
        className="mt-4 text-[14.5px] text-ivory/80 leading-[1.55] text-center"
        data-testid="bridge-body"
      >
        {pick(ui.bridge.bodyOwner, lang)}
      </motion.p>

      <motion.section
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.32 }}
        className="mt-6 card card-gold-edge p-5"
        data-testid="bridge-card"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10.5px] uppercase tracking-[0.24em] text-gold/80">
            {fmt(pick(ui.bridge.cardLabel, lang), { token: shortToken })}
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

      <motion.section
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.42 }}
        className="mt-6 card p-5"
        style={{ background: 'rgba(20,20,25,0.55)' }}
        data-testid="bridge-message"
      >
        <p className="text-[11px] uppercase tracking-[0.22em] text-gold/80">
          {pick(ui.bridge.messageHeading, lang)}
        </p>
        <p
          data-testid="bridge-message-text"
          className="mt-3 text-[14.5px] text-ivory/90 leading-[1.55] whitespace-pre-wrap select-text"
        >
          {copyMessage}
        </p>
        <div className="mt-4 flex items-center gap-3 flex-wrap">
          <button
            data-testid="bridge-copy-message"
            onClick={onCopyMsg}
            className="btn-ghost text-[13.5px] py-2.5 px-4"
          >
            {pick(ui.bridge.copyMessage, lang)}
          </button>
          {copyMsg === 'msg-ok' && (
            <span data-testid="bridge-copy-message-ok" className="text-[12.5px] text-gold/90">
              {pick(ui.bridge.copiedMessage, lang)}
            </span>
          )}
          {copyMsg === 'msg-fail' && (
            <span className="text-[12px] text-bordo-400">{pick(ui.bridge.copyFail, lang)}</span>
          )}
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.55 }}
        className="mt-7 flex flex-col gap-3"
      >
        <a
          data-testid="bridge-open-owner"
          href={OWNER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold text-[17px] w-full"
          onClick={() => {
            track.ownerDirectIntentClicked({
              result_type: resultType,
              secondary_result: nuance ? (nuance as string) : '',
              token_present: !!token,
              from: 'bridge_owner',
            });
            notify('owner_direct_intent', {
              scenario,
              secondary: nuance || '',
              key_question: keyQuestion,
              token_short: shortToken,
              from: from || 'bridge_owner',
            });
          }}
        >
          {pick(ui.bridge.primaryOwner, lang)}
        </a>
        <a
          data-testid="bridge-open-bot-instead"
          href={tgBotUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost text-[14px] w-full"
          onClick={() => {
            track.telegramIntentClicked({
              result_type: resultType,
              secondary_result: nuance || '',
              token_present: !!token,
              from: 'bridge_bot',
            });
            notify('telegram_bot_intent', {
              scenario,
              secondary: nuance || '',
              token_short: shortToken,
              from: 'bridge_bot',
            });
          }}
        >
          {pick(ui.bridge.openBotInstead, lang)}
        </a>
        <p className="text-[12px] text-ivory/45 text-center">{pick(ui.bridge.fallback, lang)}</p>
      </motion.div>
    </>
  );
}

// V6 — Owner bridge for users who arrive without a completed map yet.
function OwnerGenericBridge({ lang, from }: { lang: Lang; from: string }) {
  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="serif text-[28px] leading-[1.1] text-ivory text-center" style={{ fontWeight: 500 }}
        data-testid="bridge-title"
      >
        {pick(ui.bridge.titleOwner, lang)}
      </motion.h1>
      <p className="mt-4 text-[15px] text-ivory/80 leading-[1.55] text-center" data-testid="bridge-body">
        {pick(ui.bridge.genericBody, lang)}
      </p>
      <div className="mt-8 flex flex-col gap-3">
        <Link
          href="/play/"
          className="btn-gold text-[17px] text-center"
          data-testid="bridge-collect-first"
          onClick={() => track.startMirror()}
        >
          {pick(ui.bridge.openFirst, lang)}
        </Link>
        <a
          data-testid="bridge-open-owner"
          href={OWNER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost text-[14.5px] w-full"
          onClick={() => {
            track.ownerDirectIntentClicked({
              result_type: '',
              secondary_result: '',
              token_present: false,
              from: 'bridge_owner',
            });
            notify('owner_direct_intent', { from: from || 'bridge_owner' });
          }}
        >
          {pick(ui.bridge.primaryOwner, lang)}
        </a>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Legacy / fallback — bot bridge with a completed map
// ─────────────────────────────────────────────────────────────
function PersonalBotBridge({
  lang, tgUrl, token, resultType, scenario, nuance, keyQuestion, from,
}: {
  lang: Lang;
  tgUrl: string;
  token: string;
  resultType: ResultKey;
  scenario: string;
  nuance?: string;
  keyQuestion: string;
  from: string;
}) {
  const steps = ui.bridge.steps[lang];
  const shortToken = (token || '').replace(/^am_/, '').slice(0, 10) || '——';

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

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.22 }}
        className="mt-4 text-[14.5px] text-ivory/80 leading-[1.55] text-center"
        data-testid="bridge-promise"
      >
        {pick(ui.bridge.promise, lang)}
      </motion.p>

      <motion.section
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.32 }}
        className="mt-6 card card-gold-edge p-5"
        data-testid="bridge-card"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10.5px] uppercase tracking-[0.24em] text-gold/80">
            {fmt(pick(ui.bridge.cardLabel, lang), { token: shortToken })}
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
            track.telegramIntentClicked({
              result_type: resultType,
              secondary_result: nuance || '',
              token_present: !!token,
              from: 'bridge_bot',
            });
            notify('telegram_bot_intent', {
              scenario,
              secondary: nuance || '',
              token_short: shortToken,
              from: from || 'bridge_bot',
            });
          }}
        >
          {pick(ui.bridge.open, lang)}
        </a>
        <p className="text-[12px] text-ivory/45 text-center">{pick(ui.bridge.fallback, lang)}</p>
      </motion.div>
    </>
  );
}

function GenericBotBridge({
  lang, tgUrl, hasToken, resultType, from,
}: {
  lang: Lang;
  tgUrl: string;
  hasToken: boolean;
  resultType: string;
  from: string;
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
            track.telegramIntentClicked({
              result_type: resultType,
              secondary_result: '',
              token_present: hasToken,
              from: 'bridge_bot',
            });
            notify('telegram_bot_intent', { from: from || 'bridge_bot' });
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
