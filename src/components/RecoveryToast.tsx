'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { pick } from '@/lib/i18n';
import type { Lang, ResultKey } from '@/lib/types';
import { loadSession } from '@/lib/storage';
import { isValidToken } from '@/lib/token';
import { RESULT_KEYS, RESULTS } from '@/lib/results';
import { OWNER_URL, openOwnerDirect } from '@/lib/openOwner';
import { getStoredLang } from '@/lib/lang';

const VALID = new Set<ResultKey>(RESULT_KEYS);
const SHOWN_KEY = 'altyn.recovery_toast.shown_at';
const INTENT_FLAG_PREFIX = 'altyn.notified.owner_direct_intent.';
const TWENTY_FOUR_H = 24 * 60 * 60 * 1000;

const TEXT = {
  body: {
    ru: 'Карта № {token} уже собрана — можно продолжить с Алтын',
    uz: 'Xarita № {token} yig‘ilgan — Altyn bilan davom etish mumkin',
  },
  cta: { ru: 'Написать Алтын →', uz: 'Altyn’ga yozish →' },
  close: { ru: 'Закрыть', uz: 'Yopish' },
} as const;

/**
 * V6.4 — Warm-lead recovery toast.
 * Renders only when:
 *   • localStorage has a completed map (result_type + token)
 *   • OwnerDirectIntentClicked has NOT fired yet for that session
 *   • toast has NOT been shown in the last 24h
 *   • current path is the homepage `/`
 *
 * Positioned above the safe-area, does not cover the result page sticky CTA.
 * Click → openOwnerDirect (fires Pixel + CAPI + notify + opens @Altyn2304).
 */
export function RecoveryToast() {
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);
  const [token, setToken] = useState('');
  const [shortToken, setShortToken] = useState('');
  const [resultType, setResultType] = useState<ResultKey | ''>('');
  const [secondary, setSecondary] = useState<ResultKey | ''>('');
  const [lang, setLang] = useState<Lang>('ru');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only on the homepage. (Result page already shows 3 owner CTAs.)
    if (window.location.pathname !== '/') return;

    const s = loadSession();
    if (!s || !s.result_type || !VALID.has(s.result_type)) return;
    if (!s.token || !isValidToken(s.token)) return;

    // Already clicked "Написать Алтын" for this session — never show.
    try {
      if (window.localStorage.getItem(INTENT_FLAG_PREFIX + (s.session_id || 'anon')) === '1') {
        return;
      }
    } catch { /* allow if blocked */ }

    // 24h cooldown — measured against the LAST time the toast was shown.
    try {
      const last = Number(window.localStorage.getItem(SHOWN_KEY) || '0');
      if (last > 0 && Date.now() - last < TWENTY_FOUR_H) return;
    } catch { /* allow if blocked */ }

    setLang(getStoredLang());
    setToken(s.token);
    setShortToken(s.token.replace(/^am_/, '').slice(0, 8));
    setResultType(s.result_type as ResultKey);
    if (s.secondary_result && VALID.has(s.secondary_result) && s.secondary_result !== s.result_type) {
      setSecondary(s.secondary_result as ResultKey);
    }

    // Appear after 1.6s so it never races with hero LCP.
    const t = window.setTimeout(() => {
      setVisible(true);
      try { window.localStorage.setItem(SHOWN_KEY, String(Date.now())); } catch { /* */ }
    }, 1600);
    return () => window.clearTimeout(t);
  }, []);

  if (!resultType || closed) return null;

  const data = RESULTS[resultType as ResultKey];
  const secondaryData = secondary ? RESULTS[secondary] : null;
  const scenarioTitle = pick(data.title, lang);
  const secondaryTitle = secondaryData ? pick(secondaryData.title, lang) : '';
  const keyQuestion = pick(data.keyQuestion, lang);
  const bodyText = pick(TEXT.body, lang).replace('{token}', shortToken);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          data-testid="recovery-toast"
          className="fixed inset-x-3 z-30 pointer-events-none"
          style={{ bottom: 'max(env(safe-area-inset-bottom), 14px)' }}
        >
          <div className="max-w-[560px] mx-auto pointer-events-auto">
            <div
              className="card card-gold-edge px-4 py-3 flex items-start gap-3"
              style={{
                background: 'linear-gradient(180deg, rgba(20,20,25,0.92), rgba(7,7,8,0.95))',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 18px 50px -12px rgba(0,0,0,0.65), 0 0 28px -10px rgba(206,160,58,0.35)',
              }}
            >
              <div className="flex-1 min-w-0">
                <p data-testid="recovery-toast-text" className="text-[12.5px] text-ivory/90 leading-[1.5]">
                  {bodyText}
                </p>
                <a
                  data-testid="recovery-toast-cta"
                  href={OWNER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center mt-1.5 text-[13px] text-gold underline-offset-2 underline decoration-gold/40 hover:text-gold-200 transition-colors"
                  onClick={() => {
                    openOwnerDirect({
                      resultType: resultType as ResultKey,
                      secondaryResult: secondary || '',
                      tokenPresent: !!token,
                      tokenShort: shortToken,
                      scenarioTitle,
                      secondaryTitle,
                      keyQuestion,
                      from: 'recovery_toast',
                      lang,
                    });
                  }}
                >
                  {pick(TEXT.cta, lang)}
                </a>
              </div>
              <button
                data-testid="recovery-toast-close"
                aria-label={pick(TEXT.close, lang)}
                onClick={() => setClosed(true)}
                className="text-ivory/55 hover:text-ivory transition-colors text-[18px] leading-none px-1.5 -mt-0.5"
              >
                ×
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
