// Frontend client for /api/notify with per-session throttling + tiny retry queue.
// All calls fail open — if the endpoint is missing or env vars are not set
// on the server, the site continues to work.

import { loadSession } from './storage';

export type NotifyEvent =
  | 'quiz_started'
  | 'quiz_completed'
  | 'owner_direct_intent'
  | 'telegram_bot_intent';

const FLAG_PREFIX = 'altyn.notified.';
const PENDING_KEY = 'altyn.notify.pending.v1';
const MAX_PENDING = 5;

function flagKey(event: NotifyEvent, sessionId: string): string {
  return `${FLAG_PREFIX}${event}.${sessionId || 'anon'}`;
}

function alreadyFired(event: NotifyEvent, sessionId: string): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return window.localStorage.getItem(flagKey(event, sessionId)) === '1';
  } catch {
    return false;
  }
}

function markFired(event: NotifyEvent, sessionId: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(flagKey(event, sessionId), '1');
  } catch {
    /* quota / private mode — ignore */
  }
}

export type NotifyExtras = {
  scenario?: string;
  secondary?: string;
  key_question?: string;
  token_short?: string;
  page?: string;
  from?: string;
  result_type?: string;
  secondary_result?: string;
};

function shortSession(id: string | undefined): string {
  if (!id) return '';
  return id.slice(-10);
}

type PendingPayload = Record<string, unknown> & { event: NotifyEvent; _id: string };

function loadPending(): PendingPayload[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(PENDING_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as PendingPayload[]) : [];
  } catch { return []; }
}

function savePending(list: PendingPayload[]): void {
  if (typeof window === 'undefined') return;
  try {
    if (list.length === 0) {
      window.localStorage.removeItem(PENDING_KEY);
    } else {
      window.localStorage.setItem(PENDING_KEY, JSON.stringify(list.slice(-MAX_PENDING)));
    }
  } catch { /* ignore */ }
}

function queueRetry(payload: PendingPayload): void {
  const list = loadPending();
  // dedupe by event+session+from
  const dupe = list.some(p =>
    p.event === payload.event
    && p.session_id === payload.session_id
    && (p.from || '') === (payload.from || '')
  );
  if (dupe) return;
  list.push(payload);
  savePending(list);
}

function postOnce(body: string): Promise<boolean> {
  return fetch('/api/notify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
    keepalive: true,
    credentials: 'omit',
  }).then(r => r.ok).catch(() => false);
}

/**
 * Replay any pending notifications saved by a previous click that died before
 * the request completed. Called from UtmCapture on every mount.
 * - Sends each payload at most once per page load.
 * - Removes the entry on success or after one attempt (best-effort, no spam).
 */
export async function replayPendingNotifications(): Promise<void> {
  if (typeof window === 'undefined') return;
  const list = loadPending();
  if (list.length === 0) return;
  // Drain optimistically: keep payload only on hard failure.
  const remaining: PendingPayload[] = [];
  for (const p of list) {
    // strip internal id from server payload
    const send = { ...p } as PendingPayload;
    delete (send as Record<string, unknown>)._id;
    try {
      const ok = await postOnce(JSON.stringify(send));
      if (!ok) {
        // give up after one retry — do NOT re-queue (would spam)
      }
    } catch {
      // network died again — drop. We prefer "lost one event" over "spam group forever".
    }
  }
  savePending(remaining);
}

/**
 * Send a notification to the leads group. Throttled to once per session per event.
 * Returns immediately; network errors are swallowed and queued for one retry.
 */
export function notify(event: NotifyEvent, extras: NotifyExtras = {}): void {
  if (typeof window === 'undefined') return;
  const s = loadSession();
  const sessionId = s?.session_id || '';
  if (alreadyFired(event, sessionId)) return;
  markFired(event, sessionId);

  const payload = {
    event,
    session_id: sessionId,
    session_short: shortSession(sessionId),
    scenario: extras.scenario || '',
    secondary: extras.secondary || '',
    key_question: extras.key_question || '',
    token_short: extras.token_short || (s?.token ? s.token.replace(/^am_/, '').slice(0, 12) : ''),
    utm_source: s?.utm_source || '',
    utm_campaign: s?.utm_campaign || '',
    utm_content: s?.utm_content || '',
    utm_term: s?.utm_term || '',
    fbclid_present: !!s?.fbclid,
    result_type: extras.result_type || s?.result_type || '',
    secondary_result: extras.secondary_result || s?.secondary_result || '',
    lang: s?.lang || 'ru',
    landing_path: s?.landing_path || '',
    referrer: s?.referrer || '',
    page: extras.page || (typeof window !== 'undefined' ? window.location.pathname : ''),
    from: extras.from || '',
  };

  const body = JSON.stringify(payload);
  // Prefer sendBeacon for events fired right before navigation; safe everywhere else too.
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' });
      const ok = navigator.sendBeacon('/api/notify', blob);
      if (!ok) {
        // beacon rejected (size or before-unload) — queue for next page
        queueRetry({ ...payload, _id: `${event}_${sessionId}` });
        // also try fetch keepalive opportunistically
        void postOnce(body);
      }
      return;
    }
    // Fallback: fetch keepalive
    void postOnce(body).then(ok => {
      if (!ok) queueRetry({ ...payload, _id: `${event}_${sessionId}` });
    });
  } catch {
    queueRetry({ ...payload, _id: `${event}_${sessionId}` });
  }
}
