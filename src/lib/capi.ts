// Client for /api/capi (Meta Conversions API server-side dispatch).
// All calls fail open — if env vars are missing the function returns
// { ok:false, skipped:true } and the site continues to work.
//
// Event IDs are shared with the browser Pixel via fbq('trackCustom', name,
// params, { eventID }) so Meta de-duplicates browser + server events.

export type CapiEventName = 'MirrorCompleted' | 'OwnerDirectIntentClicked';

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

/**
 * POST a CAPI event. Uses navigator.sendBeacon first (so the request survives
 * navigation), falls back to fetch with keepalive. Never throws.
 *
 * NOTE: same-origin so _fbp / _fbc cookies are forwarded automatically.
 */
export function sendCapi(eventName: CapiEventName, eventId: string, customData: CapiCustomData): void {
  if (typeof window === 'undefined') return;
  const payload = {
    event_name: eventName,
    event_id: eventId,
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: window.location.href,
    custom_data: customData,
  };
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
