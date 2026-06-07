/**
 * Cloudflare Pages Function — POST /api/capi
 *
 * Sends server-side events to Meta Conversions API.
 *
 * Allowed events:
 *   - MirrorCompleted          (custom)
 *   - OwnerDirectIntentClicked (custom)
 *   - Contact                  (standard — fired ONLY for the direct
 *                               @Altyn2304 click; never on PageView /
 *                               ResultViewed / MirrorCompleted / page load.)
 *
 * NEVER fires Lead / Purchase / InitiateCheckout.
 *
 * Env vars (Cloudflare Pages → Settings → Environment variables):
 *   META_CAPI_ACCESS_TOKEN   — long-lived CAPI access token from Events Manager
 *   META_PIXEL_ID            — optional, falls back to the production pixel id
 *   META_CAPI_TEST_EVENT_CODE— optional, forwards to test_event_code for QA
 *
 * If env vars are missing, the function returns 200 { ok:false, skipped:true }
 * so the frontend never blocks.
 *
 * PII policy:
 *   - NEVER forwards name, email, phone, telegram username, tokens, secrets.
 *   - user_data contains only: client_user_agent, client_ip_address,
 *     fbp, fbc, external_id (SHA-256 of anonymous session_id).
 *   - fbp / fbc are read from the request cookies first; payload hints are a
 *     fallback used only when the cookie header is missing.
 *
 * Deduplication:
 *   - Caller MUST send `event_id`. The browser Pixel uses the SAME `event_id`
 *     via fbq('track' | 'trackCustom', name, params, { eventID }).
 */

type CapiEventName = 'MirrorCompleted' | 'OwnerDirectIntentClicked' | 'Contact';

type CustomData = {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
  result_type?: string;
  secondary_result?: string;
  from?: string;
  lang?: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  token_present?: boolean;
  page_path?: string;
  fbclid_present?: boolean;
};

type UserDataHint = {
  fbp?: string;
  fbc?: string;
  fbclid?: string;
  external_id_raw?: string;
};

type Payload = {
  event_name: CapiEventName;
  event_id: string;
  event_time?: number;
  event_source_url?: string;
  custom_data?: CustomData;
  user_data_hint?: UserDataHint;
};

type Env = {
  META_CAPI_ACCESS_TOKEN?: string;
  META_PIXEL_ID?: string;
  META_CAPI_TEST_EVENT_CODE?: string;
};

const FALLBACK_PIXEL_ID = '2475663283169925';
const ALLOWED: CapiEventName[] = ['MirrorCompleted', 'OwnerDirectIntentClicked', 'Contact'];

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function readCookie(cookieHeader: string | null, name: string): string {
  if (!cookieHeader) return '';
  const parts = cookieHeader.split(';');
  const needle = name + '=';
  for (const raw of parts) {
    const part = raw.trim();
    if (part.startsWith(needle)) {
      try { return decodeURIComponent(part.slice(needle.length)); }
      catch { return part.slice(needle.length); }
    }
  }
  return '';
}

function stripPii<T extends CustomData>(input: T | undefined): CustomData {
  if (!input) return {};
  // Whitelist allowed keys so callers can't smuggle PII.
  const out: CustomData = {};
  if (typeof input.content_name === 'string') out.content_name = input.content_name.slice(0, 60);
  if (typeof input.content_category === 'string') out.content_category = input.content_category.slice(0, 60);
  if (typeof input.value === 'number' && Number.isFinite(input.value)) out.value = input.value;
  if (typeof input.currency === 'string') out.currency = input.currency.slice(0, 8);
  if (typeof input.result_type === 'string') out.result_type = input.result_type.slice(0, 32);
  if (typeof input.secondary_result === 'string') out.secondary_result = input.secondary_result.slice(0, 32);
  if (typeof input.from === 'string') out.from = input.from.slice(0, 40);
  if (typeof input.lang === 'string') out.lang = input.lang.slice(0, 8);
  if (typeof input.utm_source === 'string') out.utm_source = input.utm_source.slice(0, 60);
  if (typeof input.utm_campaign === 'string') out.utm_campaign = input.utm_campaign.slice(0, 60);
  if (typeof input.utm_content === 'string') out.utm_content = input.utm_content.slice(0, 60);
  if (typeof input.utm_term === 'string') out.utm_term = input.utm_term.slice(0, 60);
  if (typeof input.token_present === 'boolean') out.token_present = input.token_present;
  if (typeof input.page_path === 'string') out.page_path = input.page_path.slice(0, 80);
  if (typeof input.fbclid_present === 'boolean') out.fbclid_present = input.fbclid_present;
  return out;
}

/** Hex SHA-256 — used to hash anonymous session_id into external_id. */
async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(digest);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

/** `_fbc` format is `fb.1.<click_timestamp_ms>.<fbclid>`. */
function buildFbcFromFbclid(fbclid: string, eventTimeSec: number): string {
  if (!fbclid) return '';
  // Use event_time (sec) -> ms; Meta tolerates the click_time approximation.
  return `fb.1.${eventTimeSec * 1000}.${fbclid}`;
}

function safeString(v: unknown, max: number): string {
  return typeof v === 'string' ? v.slice(0, max) : '';
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return jsonResponse({ ok: false, error: 'bad_json' }, 400);
  }

  if (!payload || !ALLOWED.includes(payload.event_name) || !payload.event_id || typeof payload.event_id !== 'string') {
    return jsonResponse({ ok: false, error: 'bad_event' }, 400);
  }

  const token = env.META_CAPI_ACCESS_TOKEN;
  const pixel = env.META_PIXEL_ID || FALLBACK_PIXEL_ID;
  if (!token) {
    return jsonResponse({ ok: false, skipped: true });
  }

  const eventTime = typeof payload.event_time === 'number'
    ? Math.floor(payload.event_time)
    : Math.floor(Date.now() / 1000);

  const ua = request.headers.get('user-agent') || '';
  const ip = request.headers.get('cf-connecting-ip') || '';
  const cookieHeader = request.headers.get('cookie');
  const cookieFbp = readCookie(cookieHeader, '_fbp');
  const cookieFbc = readCookie(cookieHeader, '_fbc');

  const hint: UserDataHint = payload.user_data_hint || {};
  const hintFbp = safeString(hint.fbp, 120);
  const hintFbc = safeString(hint.fbc, 200);
  const hintFbclid = safeString(hint.fbclid, 200);
  const hintExternalIdRaw = safeString(hint.external_id_raw, 80);

  // Prefer cookies (set by Pixel itself) — fall back to client-provided hints.
  const fbp = cookieFbp || hintFbp;
  let fbc = cookieFbc || hintFbc;
  if (!fbc && hintFbclid) {
    fbc = buildFbcFromFbclid(hintFbclid, eventTime);
  }

  const userData: Record<string, string | string[]> = {};
  if (ua) userData.client_user_agent = ua;
  if (ip) userData.client_ip_address = ip;
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;
  if (hintExternalIdRaw) {
    try {
      // Meta accepts external_id as an array of SHA-256 hashes.
      const hashed = await sha256Hex(hintExternalIdRaw.toLowerCase());
      userData.external_id = [hashed];
    } catch { /* ignore — external_id is optional */ }
  }

  const event = {
    event_name: payload.event_name,
    event_id: payload.event_id.slice(0, 120),
    event_time: eventTime,
    action_source: 'website' as const,
    event_source_url: (payload.event_source_url || '').slice(0, 400),
    user_data: userData,
    custom_data: stripPii(payload.custom_data),
  };

  const url = `https://graph.facebook.com/v18.0/${encodeURIComponent(pixel)}/events`;

  const body: Record<string, unknown> = {
    data: [event],
    access_token: token,
  };
  if (env.META_CAPI_TEST_EVENT_CODE) {
    body.test_event_code = env.META_CAPI_TEST_EVENT_CODE;
  }

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
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
