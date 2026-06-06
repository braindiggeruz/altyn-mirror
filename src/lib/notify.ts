// Frontend client for /api/notify with per-session throttling.
// All calls fail open — if the endpoint is missing or env vars are not set
// on the server, the site continues to work.

import { loadSession } from './storage';

export type NotifyEvent =
  | 'quiz_started'
  | 'quiz_completed'
  | 'owner_direct_intent'
  | 'telegram_bot_intent';

const FLAG_PREFIX = 'altyn.notified.';

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
};

function shortSession(id: string | undefined): string {
  if (!id) return '';
  // keep last 10 chars — enough to disambiguate without exposing full id
  return id.slice(-10);
}

/**
 * Send a notification to the leads group. Throttled to once per session per event.
 * Returns immediately; network errors are swallowed.
 */
export function notify(event: NotifyEvent, extras: NotifyExtras = {}): void {
  if (typeof window === 'undefined') return;
  const s = loadSession();
  const sessionId = s?.session_id || '';
  if (alreadyFired(event, sessionId)) return;
  markFired(event, sessionId);

  const payload = {
    event,
    session_short: shortSession(sessionId),
    scenario: extras.scenario || '',
    secondary: extras.secondary || '',
    key_question: extras.key_question || '',
    token_short: extras.token_short || (s?.token ? s.token.replace(/^am_/, '').slice(0, 12) : ''),
    utm_source: s?.utm_source || '',
    utm_campaign: s?.utm_campaign || '',
    utm_content: s?.utm_content || '',
    lang: s?.lang || 'ru',
    page: extras.page || (typeof window !== 'undefined' ? window.location.pathname : ''),
    from: extras.from || '',
  };

  // Fire-and-forget. keepalive ensures it survives an immediate navigation
  // (critical when this is called right before opening Telegram).
  try {
    fetch('/api/notify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
      credentials: 'omit',
    }).catch(() => { /* swallow */ });
  } catch {
    /* swallow */
  }
}
