'use client';

import { useEffect } from 'react';
import { readUtmFromUrl, mergeUtm } from '@/lib/utm';
import { loadSession, saveSession, makeSessionId } from '@/lib/storage';
import type { SessionData } from '@/lib/storage';
import { getStoredLang } from '@/lib/lang';
import { replayPendingNotifications } from '@/lib/notify';

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
      const landing = typeof window !== 'undefined' ? window.location.pathname : '';
      const referrer = typeof document !== 'undefined' ? (document.referrer || '') : '';
      const fresh: SessionData = {
        session_id: makeSessionId(),
        lang: getStoredLang(),
        answer_path: [],
        created_at: new Date().toISOString(),
        landing_path: landing,
        referrer,
        ...utm,
      };
      saveSession(fresh);
      // Retry any pending notifications from a previous session that failed.
      void replayPendingNotifications();
      return;
    }
    // Backfill landing/referrer once if they weren't captured before V6.3
    let backfill: Partial<SessionData> | null = null;
    if (!existing.landing_path) backfill = { landing_path: typeof window !== 'undefined' ? window.location.pathname : '' };
    if (existing.referrer == null) {
      backfill = { ...(backfill || {}), referrer: typeof document !== 'undefined' ? (document.referrer || '') : '' };
    }
    // Skip write entirely if URL had no UTM params AND nothing to backfill.
    if (Object.keys(utm).length === 0 && !backfill) {
      void replayPendingNotifications();
      return;
    }
    const merged = mergeUtm(existing, utm);
    if (backfill) Object.assign(merged, backfill);
    saveSession(merged);
    void replayPendingNotifications();
  }, []);
  return null;
}
