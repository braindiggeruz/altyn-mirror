/**
 * Cloudflare Pages Function — POST /api/notify
 *
 * Forwards a small, sanitized lead-status notification into the internal
 * Telegram leads group. Used by the ALTYN Mirror frontend to surface:
 *   - quiz_started
 *   - quiz_completed
 *   - owner_direct_intent (clicked "Написать Алтын")
 *   - telegram_bot_intent (clicked bot fallback)
 *
 * Env vars (Cloudflare Pages → Settings → Environment variables):
 *   TELEGRAM_BOT_TOKEN     — bot used only for internal notifications
 *   TELEGRAM_LEADS_CHAT_ID — internal group chat id (e.g. -1001234567890)
 *
 * If env vars are missing, the function NEVER crashes the site:
 *   returns 200 { ok: false, skipped: true }
 *
 * Site never knows the real Telegram username of the visitor. Only
 * session id + scenario + utm/lang are forwarded. No PII.
 */

type EventKind =
  | 'quiz_started'
  | 'quiz_completed'
  | 'owner_direct_intent'
  | 'telegram_bot_intent';

type NotifyPayload = {
  event: EventKind;
  session_short?: string;       // already shortened on the client
  scenario?: string;            // e.g. "Туман без ясности"
  secondary?: string;           // e.g. "Маятник тепла"
  key_question?: string;        // primary scenario keyQuestion
  token_short?: string;         // shortened am_ token, optional
  utm_source?: string;
  utm_campaign?: string;
  utm_content?: string;
  lang?: string;                // 'ru' | 'uz'
  page?: string;                // e.g. '/play'
  from?: string;                // CTA source label, e.g. 'result_primary'
};

type Env = {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_LEADS_CHAT_ID?: string;
};

const ALLOWED: EventKind[] = [
  'quiz_started',
  'quiz_completed',
  'owner_direct_intent',
  'telegram_bot_intent',
];

const HEX_RE = /[^\p{L}\p{N}\s.,:;!?@#·«»"'()/+\-=*–—_…/]/gu;

function clean(v: unknown, max = 160): string {
  if (v == null) return '';
  let s = String(v);
  // remove control chars + unusual symbols + html-ish brackets
  s = s.replace(/[<>]/g, '');
  s = s.replace(HEX_RE, '');
  s = s.replace(/\s+/g, ' ').trim();
  if (s.length > max) s = s.slice(0, max - 1) + '…';
  return s;
}

function escapeMd(s: string): string {
  // Plain text — no Markdown parsing on send, but still strip backticks/asterisks
  // that could be visually noisy in the chat.
  return s.replace(/[`*_~|]/g, '');
}

function buildMessage(p: NotifyPayload): string {
  const session = escapeMd(clean(p.session_short, 24)) || '—';
  const scenario = escapeMd(clean(p.scenario, 80)) || '—';
  const secondary = escapeMd(clean(p.secondary, 80)) || '—';
  const keyQ = escapeMd(clean(p.key_question, 200)) || '—';
  const utmSrc = escapeMd(clean(p.utm_source, 40)) || '—';
  const utmCamp = escapeMd(clean(p.utm_campaign, 60)) || '—';
  const lang = escapeMd(clean(p.lang, 8)) || '—';
  const page = escapeMd(clean(p.page, 40)) || '—';
  const token = escapeMd(clean(p.token_short, 24)) || '—';
  const from = escapeMd(clean(p.from, 40)) || '—';
  const src = `${utmSrc} / ${utmCamp}`;

  switch (p.event) {
    case 'quiz_started':
      return [
        '🟡 ALTYN Mirror: старт карты',
        '',
        `Сессия: ${session}`,
        `Источник: ${src}`,
        `Язык: ${lang}`,
        `Страница: ${page}`,
      ].join('\n');

    case 'quiz_completed':
      return [
        '🟢 ALTYN Mirror: карта собрана',
        '',
        `Сессия: ${session}`,
        `Сценарий: ${scenario}`,
        `Оттенок: ${secondary}`,
        `Источник: ${src}`,
        'Следующий шаг: ждём Telegram',
      ].join('\n');

    case 'owner_direct_intent':
      return [
        '🔥 ALTYN Mirror: хочет написать Алтын',
        '',
        `Сессия: ${session}`,
        `Сценарий: ${scenario}`,
        `Оттенок: ${secondary}`,
        `Главный вопрос: ${keyQ}`,
        `Источник: ${src}`,
        `Кнопка: ${from}`,
        'Открывает: @Altyn2304',
      ].join('\n');

    case 'telegram_bot_intent':
      return [
        '🔵 ALTYN Mirror: переход в бот',
        '',
        `Сессия: ${session}`,
        `Сценарий: ${scenario}`,
        `Оттенок: ${secondary}`,
        `Start token: ${token}`,
        `Источник: ${src}`,
      ].join('\n');
  }
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // Parse + validate
  let payload: NotifyPayload;
  try {
    const raw = await request.json();
    payload = raw as NotifyPayload;
  } catch {
    return jsonResponse({ ok: false, error: 'bad_json' }, 400);
  }

  if (!payload || !ALLOWED.includes(payload.event)) {
    return jsonResponse({ ok: false, error: 'bad_event' }, 400);
  }

  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_LEADS_CHAT_ID;
  if (!token || !chatId) {
    // Safe no-op — site keeps working without secrets.
    return jsonResponse({ ok: false, skipped: true });
  }

  const text = buildMessage(payload);

  try {
    const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const tgRes = await fetch(tgUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
        disable_notification: payload.event === 'quiz_started',
      }),
    });

    if (!tgRes.ok) {
      // Don't leak the bot token or full URL.
      return jsonResponse({ ok: false, upstream: tgRes.status });
    }
    return jsonResponse({ ok: true });
  } catch {
    return jsonResponse({ ok: false, error: 'upstream_failed' });
  }
};

// CORS / preflight — same-origin in production but keep tolerant for previews.
export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
      'access-control-max-age': '86400',
    },
  });
};
