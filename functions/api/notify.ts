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
  session_id?: string;
  session_short?: string;
  scenario?: string;
  secondary?: string;
  key_question?: string;
  token_short?: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid_present?: boolean;
  result_type?: string;
  secondary_result?: string;
  lang?: string;
  landing_path?: string;
  referrer?: string;
  page?: string;
  from?: string;
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
  s = s.replace(/[<>]/g, '');
  s = s.replace(HEX_RE, '');
  s = s.replace(/\s+/g, ' ').trim();
  if (s.length > max) s = s.slice(0, max - 1) + '…';
  return s;
}

function escapeMd(s: string): string {
  return s.replace(/[`*_~|]/g, '');
}

function fallback(value: string, alt: string): string {
  const v = value.trim();
  return v && v !== '—' ? v : alt;
}

// Human-readable labels for CTA source so the group sees "основная кнопка
// результата" instead of "stickycta" or "result_primary".
const FROM_LABEL_RU: Record<string, string> = {
  result_primary:       'основная кнопка результата',
  sticky_cta:           'липкая кнопка',
  prep_block:           'блок вопросов',
  returning_chip:       'повторный вход',
  bridge_owner:         'bridge owner',
  bridge_bot:           'bridge bot',
  bot_secondary:        'бот fallback',
  result_modal_primary: 'модалка результата',
};

function humanFrom(raw: string): string {
  const key = raw.trim().toLowerCase().replace(/[\s-]+/g, '_');
  if (FROM_LABEL_RU[key]) return FROM_LABEL_RU[key];
  return key || '—';
}

function buildMessage(p: NotifyPayload): string {
  const session       = escapeMd(clean(p.session_short, 24)) || '—';
  const sessionFull   = escapeMd(clean(p.session_id, 64)) || '—';
  const scenario      = fallback(escapeMd(clean(p.scenario, 80)),       '—');
  const secondary     = fallback(escapeMd(clean(p.secondary, 80)),      '—');
  const keyQ          = fallback(escapeMd(clean(p.key_question, 200)),  '—');
  const utmSrc        = fallback(escapeMd(clean(p.utm_source, 40)),     'direct');
  const utmCamp       = fallback(escapeMd(clean(p.utm_campaign, 60)),   'no_campaign');
  const utmCont       = fallback(escapeMd(clean(p.utm_content, 60)),    '—');
  const fbclid        = p.fbclid_present ? 'yes' : 'no';
  const resultType    = fallback(escapeMd(clean(p.result_type, 32)),    '—');
  const secondaryRes  = fallback(escapeMd(clean(p.secondary_result,32)),'—');
  const lang          = fallback(escapeMd(clean(p.lang, 8)),            '—');
  const landingPath   = fallback(escapeMd(clean(p.landing_path, 80)),   '—');
  const pagePath      = fallback(escapeMd(clean(p.page, 80)),           '—');
  const token         = fallback(escapeMd(clean(p.token_short, 24)),    '—');
  const fromHuman     = humanFrom(clean(p.from, 40));
  const src           = `${utmSrc} / ${utmCamp}`;

  switch (p.event) {
    case 'quiz_started':
      return [
        '🟡 ALTYN Mirror: старт карты',
        '',
        `Сессия: ${session}`,
        `Источник: ${src}`,
        `Креатив: ${utmCont}`,
        `Язык: ${lang}`,
        `Страница входа: ${landingPath}`,
        `Текущая страница: ${pagePath}`,
      ].join('\n');

    case 'quiz_completed':
      return [
        '🟢 ALTYN Mirror: карта собрана',
        '',
        `Сессия: ${session}`,
        `Сценарий: ${scenario}`,
        `Оттенок: ${secondary}`,
        `Источник: ${src}`,
        `Креатив: ${utmCont}`,
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
        `Кнопка: ${fromHuman}`,
        `Источник: ${src}`,
        `Креатив: ${utmCont}`,
        `fbclid: ${fbclid}`,
        'Открывает: @Altyn2304',
        '',
        '— debug —',
        `result_type: ${resultType}`,
        `secondary_result: ${secondaryRes}`,
        `lang: ${lang}`,
        `page: ${pagePath}`,
        `session_id: ${sessionFull}`,
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
        `Креатив: ${utmCont}`,
        `fbclid: ${fbclid}`,
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
      return jsonResponse({ ok: false, upstream: tgRes.status });
    }
    return jsonResponse({ ok: true });
  } catch {
    return jsonResponse({ ok: false, error: 'upstream_failed' });
  }
};

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
