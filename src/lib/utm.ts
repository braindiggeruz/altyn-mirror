// UTM / fbclid capture. Read once on landing; persisted to session storage.
import type { SessionData } from './storage';

const UTM_KEYS = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'] as const;

export function readUtmFromUrl(): Partial<SessionData> {
  if (typeof window === 'undefined') return {};
  const sp = new URLSearchParams(window.location.search);
  const out: Partial<SessionData> = {};
  for (const k of UTM_KEYS) {
    const v = sp.get(k);
    if (v) (out as Record<string, string>)[k] = v;
  }
  const fb = sp.get('fbclid');
  if (fb) out.fbclid = fb;
  return out;
}
