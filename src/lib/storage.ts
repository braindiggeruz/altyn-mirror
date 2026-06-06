import type { Lang, ResultKey } from './types';
import type { AnswerPathEntry } from './scoring';

const SESSION_KEY = 'altyn.session';

export type SessionData = {
  session_id: string;
  lang: Lang;
  result_type?: ResultKey;
  secondary_result?: ResultKey;
  answer_path: AnswerPathEntry[];
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  landing_path?: string;
  referrer?: string;
  token?: string;       // am_<...>
  completed_at?: string;
  created_at: string;
};

function safeWindow(): Window | null {
  return typeof window === 'undefined' ? null : window;
}

export function loadSession(): SessionData | null {
  const w = safeWindow();
  if (!w) return null;
  try {
    const raw = w.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export function saveSession(s: SessionData): void {
  const w = safeWindow();
  if (!w) return;
  try {
    w.localStorage.setItem(SESSION_KEY, JSON.stringify(s));
  } catch {
    // ignore quota / private mode
  }
}

export function clearSession(): void {
  const w = safeWindow();
  if (!w) return;
  try { w.localStorage.removeItem(SESSION_KEY); } catch { /* noop */ }
}

export function makeSessionId(): string {
  const r = Math.random().toString(36).slice(2, 10);
  return `s_${Date.now().toString(36)}_${r}`;
}
