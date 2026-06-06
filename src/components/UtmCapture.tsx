'use client';

import { useEffect } from 'react';
import { readUtmFromUrl, mergeUtm } from '@/lib/utm';
import { loadSession, saveSession, makeSessionId } from '@/lib/storage';
import type { SessionData } from '@/lib/storage';
import { getStoredLang } from '@/lib/lang';

/**
 * Global UTM / fbclid capture.
 * - Reads URL params once per route.
 * - Merges into existing session; never overwrites non-empty UTM with empty.
 * - Mounted in the root layout so it works on /, /play/, /result/[slug]/, /go/telegram/.
 */
export function UtmCapture() {
  useEffect(() => {
    const utm = readUtmFromUrl();
    const existing = loadSession();
    if (!existing) {
      const fresh: SessionData = {
        session_id: makeSessionId(),
        lang: getStoredLang(),
        answer_path: [],
        created_at: new Date().toISOString(),
        ...utm,
      };
      saveSession(fresh);
      return;
    }
    // Skip write entirely if URL had no UTM params (avoid noisy storage churn).
    if (Object.keys(utm).length === 0) return;
    const merged = mergeUtm(existing, utm);
    saveSession(merged);
  }, []);
  return null;
}
