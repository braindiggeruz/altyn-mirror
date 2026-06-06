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

/** Merge new UTM/fbclid values onto existing session WITHOUT clobbering with empty. */
export function mergeUtm(existing: SessionData, incoming: Partial<SessionData>): SessionData {
  const merged: SessionData = { ...existing };
  const target = merged as unknown as Record<string, string | undefined>;
  const src = incoming as unknown as Record<string, string | undefined>;
  for (const k of [...UTM_KEYS, 'fbclid'] as const) {
    const v = src[k];
    if (v && typeof v === 'string' && v.length > 0) {
      target[k] = v;
    }
  }
  return merged;
}
