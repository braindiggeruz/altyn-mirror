/**
 * Cloudflare Pages Function — POST /api/mirror-event
 *
 * Browser-side proxy for ALTYN Mirror analytics ingest.
 *
 * The browser calls /api/mirror-event with a small JSON payload (see
 * src/lib/mirrorIngest.ts). This function:
 *   1) Adds the Bearer token (MIRROR_INGEST_TOKEN) on the server side so the
 *      token never leaves Cloudflare and never lands in the JS bundle.
 *   2) Adds a server-side timestamp if the client omitted it.
 *   3) Forwards server-to-server to MIRROR_BACKEND_URL
 *      (default: https://bot.altyn-therapy.uz/api/mirror/event).
 *   4) Replies { ok: true } / { ok: false } — never blocks UX.
 *
 * Env vars (Cloudflare Pages → Settings → Environment variables):
 *   MIRROR_BACKEND_URL    — full URL of the backend endpoint
 *                            (default fallback is hardcoded below).
 *   MIRROR_INGEST_TOKEN   — shared secret with backend. NEVER expose.
 *   MIRROR_INGEST_ENABLED — 'true' to enable forwarding. Anything else =
 *                            silent no-op (returns 200 ok:false skipped:true).
 *
 * Safety:
 *   - This function NEVER touches Pixel/CAPI events.
 *   - This function NEVER fires Lead/Purchase/InitiateCheckout.
 *   - Failures here MUST NOT break the user flow on the Mirror site.
 *   - No PII is included in payloads from the client (see mirrorIngest.ts).
 */

type EventName =
  | 'mirror_session_started'
  | 'mirror_completed'
  | 'owner_direct_intent'
  | 'telegram_bot_intent';

type Payload = {
  event_name: EventName;
  event_id: string;
  session_id: string;
  am_token?: string;
  result_type?: string;
  secondary_result?: string;
  answers?: unknown;
  lang?: string;
  source?: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid_present?: boolean;
  page_path?: string;
  landing_path?: string;
  from?: string;
  prepared_message_present?: boolean;
  timestamp?: string;
};

type Env = {
  MIRROR_BACKEND_URL?: string;
  MIRROR_INGEST_TOKEN?: string;
  MIRROR_INGEST_ENABLED?: string;
};

const ALLOWED: ReadonlyArray<EventName> = [
  'mirror_session_started',
  'mirror_completed',
  'owner_direct_intent',
  'telegram_bot_intent',
];

const FALLBACK_BACKEND = 'https://bot.altyn-therapy.uz/api/mirror/event';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function isAllowedEvent(v: unknown): v is EventName {
  return typeof v === 'string' && (ALLOWED as ReadonlyArray<string>).includes(v);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // 1) Parse + lightweight validation (the backend re-validates strictly).
  let raw: Payload;
  try {
    raw = (await request.json()) as Payload;
  } catch {
    return jsonResponse({ ok: false, error: 'bad_json' }, 400);
  }
  if (!raw || !isAllowedEvent(raw.event_name) || !raw.session_id || !raw.event_id) {
    return jsonResponse({ ok: false, error: 'bad_payload' }, 400);
  }

  // 2) Feature flag — silently skip if disabled.
  const enabled = String(env.MIRROR_INGEST_ENABLED || '').toLowerCase() === 'true';
  if (!enabled) {
    return jsonResponse({ ok: false, skipped: true, reason: 'disabled' });
  }

  // 3) Token must be configured server-side.
  const token = env.MIRROR_INGEST_TOKEN;
  if (!token) {
    return jsonResponse({ ok: false, skipped: true, reason: 'no_token' });
  }

  // 4) Build outgoing payload. We trust raw fields but add a server timestamp.
  const payload: Payload = {
    ...raw,
    timestamp: raw.timestamp || new Date().toISOString(),
  };

  const url = env.MIRROR_BACKEND_URL || FALLBACK_BACKEND;

  try {
    // Use AbortController for a 4s hard cap — Mirror UX must never hang on us.
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    let upstream: Response;
    try {
      upstream = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      });
    } finally {
      clearTimeout(timer);
    }
    if (!upstream.ok) {
      return jsonResponse({ ok: false, upstream: upstream.status });
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
