// V6.1 — One-click owner-direct path.
// Fires all side effects (Pixel, clipboard, notify) inside the user gesture
// and lets the surrounding <a href="https://t.me/Altyn2304"> follow through.
//
// IMPORTANT: callers must keep the anchor `href` pointing at OWNER_URL so the
// browser can navigate even if the user has third-party-storage limits or
// the clipboard / beacon path throws.

import { track } from './tracking';
import { loadSession } from './storage';
import {
  sendCapi,
  ownerDirectEventId,
  contactOwnerDirectEventId,
  readCapiUserHints,
} from './capi';
import { postMirrorEvent } from './mirrorIngest';

export const OWNER_HANDLE = 'Altyn2304';
export const OWNER_URL = `https://t.me/${OWNER_HANDLE}`;

export type OwnerDirectFrom =
  | 'result_primary'
  | 'sticky_cta'
  | 'prep_block'
  | 'returning_chip'
  | 'recovery_toast'
  | 'bridge_owner'
  | 'result_modal_primary'
  // PR-3 — In-app browser (Instagram / FBAV / FBAN / Line) fallback:
  // user explicitly chooses "copy link" path because the deep-link to
  // Telegram is unreliable inside the webview. This IS a real owner-direct
  // intent — included in `contactAllowed` so Meta still receives the signal.
  | 'ig_browser_copy';

export function buildOwnerMessage(args: {
  scenario: string;
  secondary?: string;
  keyQuestion: string;
  lang: 'ru' | 'uz';
  // Sprint 1 — optional scenario key for per-scenario tone. When provided,
  // the message uses a tighter 3-line personalised template instead of the
  // generic ALTYN Mirror summary. Signature stays backward-compatible —
  // callers without `scenarioKey` get the previous generic message.
  scenarioKey?: 'mayatnik' | 'tuman' | 'dogonyayu' | 'iskra' | 'dver';
}): string {
  // PR-1: gender-neutral, shorter, human. Drop the "оттенок: не выделен"
  // fallback — if there's no real secondary, just omit that line.
  const secondary = (args.secondary && args.secondary.trim()) || '';
  const hasSecondary = secondary && secondary !== args.scenario;

  // Sprint 1 — per-scenario short message rewritten in her inner voice.
  // 3 lines max. Begins with «Алтын» (not "Здравствуйте, Алтын" — warmer).
  // Names Mirror + scenario. Key question voiced as inner monologue.
  // Ends with an OPEN soft question, not a closed statement of intent.
  // Drops the "(60 минут, 10$)" — that suppresses send-through.
  if (args.scenarioKey) {
    const ru: Record<NonNullable<typeof args.scenarioKey>, string[]> = {
      mayatnik: [
        'Алтын, привет. Прошла Mirror — у меня «Маятник тепла».',
        'Внутри вопрос: где одна тёплая секунда становится сильнее фактов.',
        'Можем поговорить о моём круге?',
      ],
      dogonyayu: [
        'Алтын, здравствуйте. Mirror показал «Догоняю ответ».',
        'Тот вопрос, который я задаю каждый день — устала задавать.',
        'Можно поговорить?',
      ],
      tuman: [
        'Алтын, привет. Mirror — «Туман без ясности».',
        'Никак не назову, что между нами происходит.',
        'Хочу разложить.',
      ],
      iskra: [
        'Алтын, здравствуйте. У меня «Искра и пауза».',
        'Держусь не за него, а за себя из начала.',
        'Поговорим?',
      ],
      dver: [
        'Алтын, привет. Mirror — «Закрытая дверь».',
        'Стою у одной двери слишком давно.',
        'Хочу поговорить.',
      ],
    };
    const uz: Record<NonNullable<typeof args.scenarioKey>, string[]> = {
      mayatnik: [
        'Altyn, salom. Mirror‘dan o‘tdim — menda «Iliqlik mayatnigi».',
        'Ichimdagi savol: bir iliq soniya nima uchun faktlardan kuchli bo‘ladi.',
        'Aylanam haqida gaplashishimiz mumkinmi?',
      ],
      dogonyayu: [
        'Altyn, salom. Mirror «Javob ortidan quvaman» ko‘rsatdi.',
        'Har kuni beradigan savolimni berishdan charchadim.',
        'Suhbatlashishimiz mumkinmi?',
      ],
      tuman: [
        'Altyn, salom. Mirror — «Aniqliksiz tuman».',
        'Orangizda nima sodir bo‘layotganini nomlay olmayman.',
        'Tahlil qilmoqchiman.',
      ],
      iskra: [
        'Altyn, salom. Menda «Uchqun va pauza».',
        'Men unga emas, boshlanishidagi o‘zimga yopishganman.',
        'Gaplashamizmi?',
      ],
      dver: [
        'Altyn, salom. Mirror — «Yopiq eshik».',
        'Bitta eshik oldida juda uzoq turibman.',
        'Gaplashishni xohlayman.',
      ],
    };
    const lines = args.lang === 'uz' ? uz[args.scenarioKey] : ru[args.scenarioKey];
    return lines.join('\n');
  }

  // Legacy generic template (backward compat for callers without scenarioKey).
  if (args.lang === 'uz') {
    const scenarioLine = hasSecondary
      ? `Stsenariy: «${args.scenario}» (tus — «${secondary}»).`
      : `Stsenariy: «${args.scenario}».`;
    return [
      'Assalomu alaykum, Altyn. ALTYN Mirror natijasi bo‘yicha yozyapman.',
      '',
      scenarioLine,
      `Asosiy savol: «${args.keyQuestion}».`,
      '',
      'Buni shaxsiy onlayn tahlilda (60 daqiqa, 10$) ko‘rib chiqmoqchiman.',
    ].join('\n');
  }

  const scenarioLine = hasSecondary
    ? `Сценарий: «${args.scenario}» (оттенок — «${secondary}»).`
    : `Сценарий: «${args.scenario}».`;
  return [
    'Здравствуйте, Алтын. Пишу по итогам ALTYN Mirror.',
    '',
    scenarioLine,
    `Главный вопрос: «${args.keyQuestion}».`,
    '',
    'Хочу разобрать это на личном онлайн-разборе (60 минут, 10$).',
  ].join('\n');
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
  // PR-3: in IG/FB webview fallback we want to copy the bare OWNER_URL
  // so the user can paste it into Safari/Chrome. Default 'message'.
  copyTarget?: 'message' | 'url';
};

const NOTIFY_FLAG_PREFIX = 'altyn.notified.owner_direct_intent.';
const PENDING_KEY = 'altyn.notify.pending.v1';

// In-memory guard: collapses accidental double-clicks (touch devices, anchor
// re-emit) into a single set of fires. Same `from` within DEDUP_WINDOW_MS is
// treated as a duplicate and skips Pixel + CAPI to avoid event-id explosion.
const DEDUP_WINDOW_MS = 1500;
let lastFireAt = 0;
let lastFireFrom: OwnerDirectFrom | '' = '';

function queuePending(payload: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(PENDING_KEY);
    const list: unknown[] = raw ? (JSON.parse(raw) as unknown[]) : [];
    list.push(payload);
    window.localStorage.setItem(PENDING_KEY, JSON.stringify(list.slice(-5)));
  } catch { /* ignore */ }
}

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
    // Sprint 1 — pass scenarioKey so the prepared message stays personal.
    // resultType is the canonical key (mayatnik|tuman|dogonyayu|iskra|dver).
    scenarioKey: (args.resultType as 'mayatnik' | 'tuman' | 'dogonyayu' | 'iskra' | 'dver'),
  });

  // Double-click / repeated-tap guard. The surrounding <a href="https://t.me/
  // Altyn2304"> always navigates; we just skip the side effects so we don't
  // emit two browser+CAPI pairs for the same logical intent.
  const now = Date.now();
  if (now - lastFireAt < DEDUP_WINDOW_MS && lastFireFrom === args.from) {
    return message;
  }
  lastFireAt = now;
  lastFireFrom = args.from;

  // 1) Pixel — synchronous trackCustom with eventID for browser/CAPI dedupe.
  //    Never Lead.
  const s = loadSession();
  const sessionId = s?.session_id || '';
  const eventId = ownerDirectEventId(sessionId);
  const userHint = readCapiUserHints({ fbclid: s?.fbclid, sessionId });
  try {
    track.ctaClick(args.resultType);
    track.ownerDirectIntentClicked({
      result_type: args.resultType,
      secondary_result: args.secondaryResult,
      token_present: args.tokenPresent,
      from: args.from,
      event_id: eventId,
    });
  } catch { /* swallow */ }

  // 1a) Meta-ad compatibility shim — fire standard `Contact` Pixel event so
  //     the already-live Custom Conversion (Contact + URL /result) activates
  //     without changing the campaign. Fires ONLY here, inside a real user
  //     click. NEVER on PageView / ResultViewed / MirrorCompleted / load.
  //     NEVER `Lead`. Separate eventID from OwnerDirectIntent to avoid
  //     cross-event dedupe collisions. The SAME contactEventId is reused for
  //     the server-side Contact CAPI call below so Meta de-duplicates.
  const contactEventId = contactOwnerDirectEventId(sessionId);
  const contactAllowed: ReadonlyArray<OwnerDirectFrom> = [
    'result_primary',
    'sticky_cta',
    'prep_block',
    'returning_chip',
    'recovery_toast',
    'bridge_owner',
    'result_modal_primary',
    'ig_browser_copy', // PR-3 — IG/FB webview fallback is a real owner-direct intent
  ];
  const shouldFireContact = contactAllowed.includes(args.from);
  try {
    if (shouldFireContact) {
      track.contactOwnerDirect({
        result_type: args.resultType,
        secondary_result: args.secondaryResult,
        from: args.from,
        event_id: contactEventId,
      });
    }
  } catch { /* swallow */ }

  // 1b) CAPI — server-side dispatch with the SAME event_id for dedupe.
  //     Same-origin so _fbp / _fbc cookies are forwarded automatically.
  //     User-data hints (fbp/fbc/fbclid/session_id) are a safe fallback in
  //     case the cookie header is partitioned (ITP).
  try {
    sendCapi('OwnerDirectIntentClicked', eventId, {
      content_name: 'altyn_mirror_owner_direct',
      content_category: 'telegram_owner_intent',
      value: 10,
      currency: 'USD',
      result_type: args.resultType,
      secondary_result: args.secondaryResult,
      from: args.from,
      lang: s?.lang || args.lang,
      utm_source: s?.utm_source || '',
      utm_campaign: s?.utm_campaign || '',
      utm_content: s?.utm_content || '',
      utm_term: s?.utm_term || '',
      token_present: args.tokenPresent,
      page_path: typeof window !== 'undefined' ? window.location.pathname : '',
      fbclid_present: !!s?.fbclid,
    }, userHint);
  } catch { /* swallow */ }

  // 1c) Contact CAPI — mirrors the browser `Contact` event with the SAME
  //     contactEventId so Meta de-duplicates browser + server. Fires only on
  //     real owner-direct clicks; never on ResultViewed / MirrorCompleted /
  //     PageView / load. Never Lead.
  try {
    if (shouldFireContact) {
      sendCapi('Contact', contactEventId, {
        content_name: 'altyn_mirror_owner_direct',
        content_category: 'telegram_owner_intent',
        value: 10,
        currency: 'USD',
        result_type: args.resultType,
        secondary_result: args.secondaryResult,
        from: args.from,
        lang: s?.lang || args.lang,
        utm_source: s?.utm_source || '',
        utm_campaign: s?.utm_campaign || '',
        utm_content: s?.utm_content || '',
        utm_term: s?.utm_term || '',
        token_present: args.tokenPresent,
        page_path: typeof window !== 'undefined' ? window.location.pathname : '',
        fbclid_present: !!s?.fbclid,
      }, userHint);
    }
  } catch { /* swallow */ }

  // 2) Clipboard — best-effort, no awaiting.
  //    PR-3: when called from IG/FB webview fallback we copy the bare OWNER_URL
  //    instead of the prepared message so the user can paste it into Safari/Chrome.
  const textToCopy = args.copyTarget === 'url' ? OWNER_URL : message;
  if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
    try { navigator.clipboard.writeText(textToCopy).catch(() => { /* swallow */ }); } catch { /* swallow */ }
  }

  // 3) Notify — sendBeacon when available, fetch+keepalive otherwise.
  //    Throttled to once per session per intent. Failure queues a single retry
  //    that the next page load will replay (UtmCapture → replayPendingNotifications).
  if (shouldNotify(sessionId)) {
    const payload = {
      event: 'owner_direct_intent' as const,
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
      landing_path: s?.landing_path || '',
      referrer: s?.referrer || '',
      from: args.from,
      page: typeof window !== 'undefined' ? window.location.pathname : '',
    };
    const body = JSON.stringify(payload);
    let beaconOk = false;
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([body], { type: 'application/json' });
        beaconOk = navigator.sendBeacon('/api/notify', blob);
      }
    } catch { beaconOk = false; }
    if (!beaconOk) {
      // Try fetch keepalive; if THAT also fails synchronously, queue for retry.
      try {
        fetch('/api/notify', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body,
          keepalive: true,
          credentials: 'omit',
        }).catch(() => queuePending(payload));
      } catch {
        queuePending(payload);
      }
    }
  }

  // 4) Phase 2.3 — Mirror ingest. Sends to /api/mirror-event (Cloudflare
  //    Pages Function) which forwards server-to-server to the backend with
  //    MIRROR_INGEST_TOKEN. NEVER blocks the Telegram navigation. Failure
  //    is silent. shouldNotify above only throttles the legacy /api/notify
  //    Telegram-group ping; mirror ingest is throttled at backend level via
  //    event_id idempotency, so we fire it on every real click.
  postMirrorEvent({
    event_name: 'owner_direct_intent',
    event_id: eventId, // shared with Pixel/CAPI OwnerDirectIntent for correlation
    result_type: args.resultType,
    secondary_result: args.secondaryResult,
    from: args.from,
    prepared_message_present: true,
  });

  return message;
}
