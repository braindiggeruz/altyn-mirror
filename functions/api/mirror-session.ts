/**
 * Cloudflare Pages Function — /api/mirror-session
 *
 * Phase 3 — bridge between Mirror frontend (write) and @altyntherapybot
 * (read). Spec: /architecture/mirror-session-kv.md.
 *
 * POST  /api/mirror-session            — called from /result/[slug] on mount.
 *                                        Writes scenario snapshot to KV under
 *                                        key `<am_token>` with TTL 7 days.
 * GET   /api/mirror-session?t=am_XXXX  — called by the bot on `/start am_XXXX`.
 *                                        Requires header `X-Altyn-Bot: <secret>`
 *                                        to match env BOT_SHARED_SECRET.
 *                                        Returns { ok: true, session: {...} }
 *                                        or 404 if not found.
 *
 * Safety:
 *   - Feature-flagged. Disabled until MIRROR_SESSION_KV_ENABLED=true is set in
 *     Cloudflare Pages env. While disabled, POST returns { ok:false, skipped }.
 *   - GET requires a shared secret. Without it, returns 401.
 *   - Never touches Pixel/CAPI. No PII forwarded — scenario data only.
 *   - Failures here MUST NOT break the result page UX (the client uses
 *     fire-and-forget sendBeacon).
 *   - KV is bound to ALTYN_MIRROR_SESSIONS (see wrangler / pages dashboard).
 */

type SessionPayload = {
  am_token: string;
  session_id?: string;
  lang?: string;
  scenario_key: string;
  scenario_title_ru: string;
  scenario_title_uz: string;
  secondary_key?: string;
  secondary_title_ru?: string;
  secondary_title_uz?: string;
  nuance_title_ru?: string;
  nuance_title_uz?: string;
  key_question_ru: string;
  key_question_uz: string;
  what_repeats_ru?: string;
  what_repeats_uz?: string;
  mini_scene_ru?: string;
  mini_scene_uz?: string;
  altyn_line_ru?: string;
  altyn_line_uz?: string;
  prep_question_ru?: string;
  prep_question_uz?: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  timestamp?: string;
};

type Env = {
  ALTYN_MIRROR_SESSIONS?: KVNamespace;
  MIRROR_SESSION_KV_ENABLED?: string;
  BOT_SHARED_SECRET?: string;
};

// 7 days. Bot reads usually happen within minutes of POST, but we keep the
// window long enough so a woman who clicks Bot Save on day 1 and types /start
// on day 6 still gets her personalised greeting.
const TTL_SECONDS = 60 * 60 * 24 * 7;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function isValidToken(t: unknown): t is string {
  return typeof t === 'string' && /^am_[A-Za-z0-9_-]{4,64}$/.test(t);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let raw: SessionPayload;
  try {
    raw = (await request.json()) as SessionPayload;
  } catch {
    return jsonResponse({ ok: false, error: 'bad_json' }, 400);
  }

  if (!raw || !isValidToken(raw.am_token) || !raw.scenario_key || !raw.scenario_title_ru) {
    return jsonResponse({ ok: false, error: 'bad_payload' }, 400);
  }

  const enabled = String(env.MIRROR_SESSION_KV_ENABLED || '').toLowerCase() === 'true';
  if (!enabled) {
    return jsonResponse({ ok: false, skipped: true, reason: 'disabled' });
  }

  if (!env.ALTYN_MIRROR_SESSIONS) {
    return jsonResponse({ ok: false, skipped: true, reason: 'kv_unbound' });
  }

  const record = {
    ...raw,
    saved_at: new Date().toISOString(),
  };

  try {
    await env.ALTYN_MIRROR_SESSIONS.put(raw.am_token, JSON.stringify(record), {
      expirationTtl: TTL_SECONDS,
    });
    return jsonResponse({ ok: true });
  } catch {
    return jsonResponse({ ok: false, error: 'kv_write_failed' });
  }
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get('t');

  // Bot-only endpoint. Without a matching shared secret we 401, so a random
  // visitor cannot enumerate Mirror sessions even if they guess a token.
  const provided = request.headers.get('x-altyn-bot') || '';
  const expected = env.BOT_SHARED_SECRET || '';
  if (!expected || provided !== expected) {
    return jsonResponse({ ok: false, error: 'unauthorized' }, 401);
  }

  if (!isValidToken(token)) {
    return jsonResponse({ ok: false, error: 'bad_token' }, 400);
  }

  if (!env.ALTYN_MIRROR_SESSIONS) {
    return jsonResponse({ ok: false, error: 'kv_unbound' }, 503);
  }

  try {
    const raw = await env.ALTYN_MIRROR_SESSIONS.get(token);
    if (!raw) return jsonResponse({ ok: false, error: 'not_found' }, 404);
    try {
      const session = JSON.parse(raw);
      return jsonResponse({ ok: true, session });
    } catch {
      return jsonResponse({ ok: false, error: 'corrupt_record' }, 500);
    }
  } catch {
    return jsonResponse({ ok: false, error: 'kv_read_failed' }, 500);
  }
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, GET, OPTIONS',
      'access-control-allow-headers': 'content-type, x-altyn-bot',
      'access-control-max-age': '86400',
    },
  });
};
