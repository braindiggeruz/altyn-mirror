// V6.1 — One-click owner-direct path.
// Fires all side effects (Pixel, clipboard, notify) inside the user gesture
// and lets the surrounding <a href="https://t.me/Altyn2304"> follow through.
//
// IMPORTANT: callers must keep the anchor `href` pointing at OWNER_URL so the
// browser can navigate even if the user has third-party-storage limits or
// the clipboard / beacon path throws.

import { track } from './tracking';
import { loadSession } from './storage';

export const OWNER_HANDLE = 'Altyn2304';
export const OWNER_URL = `https://t.me/${OWNER_HANDLE}`;

export type OwnerDirectFrom =
  | 'result_primary'
  | 'sticky_cta'
  | 'prep_block'
  | 'returning_chip'
  | 'bridge_owner'
  | 'result_modal_primary';

export function buildOwnerMessage(args: {
  scenario: string;
  secondary?: string;
  keyQuestion: string;
  lang: 'ru' | 'uz';
}): string {
  const sec = (args.secondary && args.secondary.trim())
    || (args.lang === 'uz' ? 'aniqlanmagan' : 'не выделен');
  if (args.lang === 'uz') {
    return `Assalomu alaykum, Altyn. Men ALTYN Mirror'dan o'tdim. Mening xaritam: «${args.scenario}», tus: «${sec}». Asosiy savol: «${args.keyQuestion}». Shaxsiy 60 daqiqalik 10$ onlayn tahlil haqida bilmoqchiman.`;
  }
  return `Здравствуйте, Алтын. Я прошла ALTYN Mirror. Моя карта: «${args.scenario}», оттенок: «${sec}». Главный вопрос: «${args.keyQuestion}». Хочу узнать про личный онлайн-разбор 60 минут за 10$.`;
}

export type OpenOwnerArgs = {
  resultType: string;
  secondaryResult: string;
  tokenPresent: boolean;
  tokenShort: string;
  scenarioTitle: string;
  secondaryTitle: string;
  keyQuestion: string;
  from: OwnerDirectFrom;
  lang: 'ru' | 'uz';
};

const NOTIFY_FLAG_PREFIX = 'altyn.notified.owner_direct_intent.';

function shouldNotify(sessionId: string): boolean {
  if (typeof window === 'undefined') return false;
  const key = NOTIFY_FLAG_PREFIX + (sessionId || 'anon');
  try {
    if (window.localStorage.getItem(key) === '1') return false;
    window.localStorage.setItem(key, '1');
    return true;
  } catch {
    return true; // best effort if storage blocked
  }
}

/**
 * Run on the SAME user gesture that navigates to OWNER_URL.
 * Returns the prepared message so the caller can also surface it on-page.
 */
export function openOwnerDirect(args: OpenOwnerArgs): string {
  const message = buildOwnerMessage({
    scenario: args.scenarioTitle,
    secondary: args.secondaryTitle,
    keyQuestion: args.keyQuestion,
    lang: args.lang,
  });

  // 1) Pixel — synchronous trackCustom. Never Lead.
  try {
    track.ctaClick(args.resultType);
    track.ownerDirectIntentClicked({
      result_type: args.resultType,
      secondary_result: args.secondaryResult,
      token_present: args.tokenPresent,
      from: args.from,
    });
  } catch { /* swallow */ }

  // 2) Clipboard — best-effort, no awaiting
  if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
    try { navigator.clipboard.writeText(message).catch(() => { /* swallow */ }); } catch { /* swallow */ }
  }

  // 3) Notify — sendBeacon when available, fetch+keepalive otherwise.
  //    Throttled to once per session per intent.
  const s = loadSession();
  const sessionId = s?.session_id || '';
  if (shouldNotify(sessionId)) {
    const body = JSON.stringify({
      event: 'owner_direct_intent',
      session_id: sessionId,
      session_short: sessionId.slice(-10),
      scenario: args.scenarioTitle,
      secondary: args.secondaryTitle,
      key_question: args.keyQuestion,
      token_short: args.tokenShort,
      utm_source: s?.utm_source || '',
      utm_campaign: s?.utm_campaign || '',
      utm_content: s?.utm_content || '',
      utm_term: s?.utm_term || '',
      fbclid_present: !!s?.fbclid,
      result_type: args.resultType,
      secondary_result: args.secondaryResult,
      lang: s?.lang || args.lang,
      from: args.from,
      page: typeof window !== 'undefined' ? window.location.pathname : '',
    });
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon('/api/notify', blob);
      } else {
        fetch('/api/notify', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body,
          keepalive: true,
          credentials: 'omit',
        }).catch(() => { /* swallow */ });
      }
    } catch { /* swallow */ }
  }

  return message;
}
