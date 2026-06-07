// Client for /api/capi (Meta Conversions API server-side dispatch).
// All calls fail open — if env vars are missing the function returns
// { ok:false, skipped:true } and the site continues to work.
//
// Event IDs are shared with the browser Pixel via fbq('trackCustom', name,
// params, { eventID }) so Meta de-duplicates browser + server events.

export type CapiEventName =
  | 'MirrorCompleted'
  | 'OwnerDirectIntentClicked'
  | 'Contact';

export type CapiCustomData = {
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

/**
 * Optional user-data hints the browser can forward to enrich CAPI match
 * quality when cookies are blocked / partitioned (ITP, third-party-storage
 * limits). Server still re-reads _fbp / _fbc from cookies and uses these
 * only as fallback.
 *
 * NEVER pass PII here: no email, phone, name, telegram username, tokens.
 *  - `fbp`           — `_fbp` cookie value if readable.
 *  - `fbc`           — `_fbc` cookie value if readable.
 *  - `fbclid`        — raw fbclid from URL; server builds fbc if no cookie.
 *  - `external_id_raw` — stable anonymous session id; server SHA-256s it.
 */
export type CapiUserDataHint = {
  fbp?: string;
  fbc?: string;
  fbclid?: string;
  external_id_raw?: string;
};

const MIRROR_COMPLETED_FLAG_PREFIX = 'altyn.mirror_completed.fired.';

/** Stable per-session id so duplicate fires from /play and /result share dedupe. */
export function mirrorCompletedEventId(sessionId: string): string {
  return `mirror_completed_${sessionId || 'anon'}`;
}

/** One id per click — dedupes a single click across browser+server. */
export function ownerDirectEventId(sessionId: string): string {
  return `owner_direct_${sessionId || 'anon'}_${Date.now().toString(36)}`;
}

/** One id per Contact click — dedupes a single click across browser+server. */
export function contactOwnerDirectEventId(sessionId: string): string {
  return `contact_owner_direct_${sessionId || 'anon'}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Returns true the FIRST time MirrorCompleted should fire for this session. */
export function shouldFireMirrorCompleted(sessionId: string): boolean {
  if (typeof window === 'undefined') return false;
  const key = MIRROR_COMPLETED_FLAG_PREFIX + (sessionId || 'anon');
  try {
    if (window.localStorage.getItem(key) === '1') return false;
    window.localStorage.setItem(key, '1');
    return true;
  } catch {
    return true; // best effort if storage blocked
  }
}

/** Best-effort read of a cookie value from document.cookie. */
function readCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  try {
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    const needle = name + '=';
    for (const part of cookies) {
      if (part.startsWith(needle)) {
        try { return decodeURIComponent(part.slice(needle.length)); }
        catch { return part.slice(needle.length); }
      }
    }
  } catch { /* ignore */ }
  return '';
}

/**
 * Read fbp / fbc from document.cookie as a fallback for the server in case
 * the cookie header is partitioned. Returns only safe, non-PII values.
 */
export function readCapiUserHints(args?: { fbclid?: string; sessionId?: string }): CapiUserDataHint {
  const hint: CapiUserDataHint = {};
  const fbp = readCookie('_fbp');
  if (fbp) hint.fbp = fbp;
  const fbc = readCookie('_fbc');
  if (fbc) hint.fbc = fbc;
  if (args?.fbclid) hint.fbclid = args.fbclid;
  if (args?.sessionId) hint.external_id_raw = args.sessionId;
  return hint;
}

/**
 * POST a CAPI event. Uses navigator.sendBeacon first (so the request survives
 * navigation), falls back to fetch with keepalive. Never throws.
 *
 * NOTE: same-origin so _fbp / _fbc cookies are forwarded automatically. The
 * optional `userHint` is a safe fallback used by the server only when the
 * cookie header is missing.
 */
export function sendCapi(
  eventName: CapiEventName,
  eventId: string,
  customData: CapiCustomData,
  userHint?: CapiUserDataHint,
): void {
  if (typeof window === 'undefined') return;
  const payload: Record<string, unknown> = {
    event_name: eventName,
    event_id: eventId,
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: window.location.href,
    custom_data: customData,
  };
  if (userHint && (userHint.fbp || userHint.fbc || userHint.fbclid || userHint.external_id_raw)) {
    payload.user_data_hint = userHint;
  }
  const body = JSON.stringify(payload);
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' });
      const ok = navigator.sendBeacon('/api/capi', blob);
      if (ok) return;
    }
  } catch { /* ignore, fall through */ }
  try {
    void fetch('/api/capi', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
      credentials: 'same-origin', // forward _fbp / _fbc cookies
    }).catch(() => { /* swallow */ });
  } catch { /* swallow */ }
}
