/**
 * ALTYN Mirror — analytics ingest (Phase 2.3B).
 *
 * Tiny, dependency-free helper that fires 4 backend-only events:
 *   1. mirror_session_started — quiz/StartMirror trigger
 *   2. mirror_completed       — result page MirrorCompleted trigger
 *   3. owner_direct_intent    — same trigger as track.ownerDirectIntentClicked
 *   4. telegram_bot_intent    — same trigger as track.telegramIntentClicked
 *
 * SAFETY (must hold every release):
 *   - This file MUST NOT modify Pixel/CAPI events.
 *   - This file MUST NOT block Telegram opens (sendBeacon / keepalive fetch).
 *   - This file MUST NOT throw into trigger sites — every call is in try/catch.
 *   - This file MUST NOT include PII (no name/phone/email/telegram username).
 *   - Token is server-side only (Cloudflare Pages Function).
 *   - Failures are silent — no toast, no console.error visible to user.
 */

import { loadSession } from './storage';

export type MirrorEventName =
  | 'mirror_session_started'
  | 'mirror_completed'
  | 'owner_direct_intent'
  | 'telegram_bot_intent';

export type MirrorEventInput = {
  event_name: MirrorEventName;
  result_type?: string;
  secondary_result?: string;
  from?: string;
  prepared_message_present?: boolean;
  // Caller MAY pass an event_id to dedupe with browser Pixel; we generate one
  // otherwise. This is just a stable random id per call; backend treats
  // duplicate event_id as a no-op.
  event_id?: string;
};

// A short, URL-safe random id — collision-resistant enough for de-duplication.
function makeEventId(seed: string): string {
  const ts = Date.now().toString(36);
  const rnd = Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 6);
  return `${seed}_${ts}_${rnd}`;
}

function isClient(): boolean {
  return typeof window !== 'undefined';
}

function safePagePath(): string {
  if (!isClient()) return '';
  try { return window.location.pathname || ''; } catch { return ''; }
}

function safeAnswers(s: ReturnType<typeof loadSession>): string | null {
  if (!s || !Array.isArray(s.answer_path) || s.answer_path.length === 0) return null;
  try {
    // Keep payload small. Each entry has scene_index/answer_id/result_key — no PII.
    return JSON.stringify(s.answer_path.slice(0, 20));
  } catch { return null; }
}

/**
 * Fire-and-forget post to /api/mirror-event.
 * Uses sendBeacon (does not delay navigation) when available; falls back to
 * keepalive fetch. Never throws.
 */
export function postMirrorEvent(input: MirrorEventInput): void {
  if (!isClient()) return;
  try {
    const s = loadSession();
    const sessionId = s?.session_id || '';
    if (!sessionId) return; // no session — quiz hasn't started yet, skip silently
    const eventId = input.event_id || makeEventId(input.event_name);
    const amToken = s?.token && /^am_/.test(s.token) ? s.token : (s?.token ? `am_${s.token}` : undefined);
    const payload = {
      event_name: input.event_name,
      event_id: eventId,
      session_id: sessionId,
      am_token: amToken,
      result_type: input.result_type ?? s?.result_type ?? undefined,
      secondary_result: input.secondary_result ?? s?.secondary_result ?? undefined,
      answers: input.event_name === 'mirror_completed' ? safeAnswers(s) : undefined,
      lang: s?.lang,
      source: s?.utm_source ? 'paid' : (s?.referrer ? 'referral' : 'organic'),
      utm_source: s?.utm_source,
      utm_campaign: s?.utm_campaign,
      utm_content: s?.utm_content,
      utm_term: s?.utm_term,
      fbclid_present: !!s?.fbclid,
      page_path: safePagePath(),
      landing_path: s?.landing_path,
      from: input.from,
      prepared_message_present: input.prepared_message_present ?? false,
      timestamp: new Date().toISOString(),
    };

    const body = JSON.stringify(payload);
    let beaconOk = false;
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([body], { type: 'application/json' });
        beaconOk = navigator.sendBeacon('/api/mirror-event', blob);
      }
    } catch { beaconOk = false; }
    if (!beaconOk) {
      try {
        fetch('/api/mirror-event', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body,
          keepalive: true,
          credentials: 'omit',
        }).catch(() => { /* swallow */ });
      } catch { /* swallow */ }
    }
  } catch { /* swallow — analytics MUST NOT break UX */ }
}

/**
 * Sprint 3 — Fire-and-forget POST /api/mirror-session.
 *
 * Writes the denormalized scenario snapshot to Cloudflare KV so the Telegram
 * bot can resolve `/start am_<token>` to a personalised greeting WITHOUT
 * re-running the quiz logic on the bot side. Spec lives in
 * architecture/mirror-session-kv.md.
 *
 * Safety:
 * - Best-effort. Never blocks UX. Never throws. Server is gated by env flag
 *   `MIRROR_SESSION_KV_ENABLED=true`, so this is a no-op until flipped.
 * - No PII. Only scenario data + token + non-identifying utm.
 */
export type MirrorSessionSnapshot = {
  scenario_key: string;
  scenario_title_ru: string;
  scenario_title_uz: string;
  secondary_key?: string;
  secondary_title_ru?: string;
  secondary_title_uz?: string;
  nuance_title_ru?: string;
  nuance_title_uz?: string;
  key_question_ru: string;
  key_question_uz: string;
  what_repeats_ru?: string;
  what_repeats_uz?: string;
  mini_scene_ru?: string;
  mini_scene_uz?: string;
  altyn_line_ru?: string;
  altyn_line_uz?: string;
  prep_question_ru?: string;
  prep_question_uz?: string;
};

export function postMirrorSession(input: MirrorSessionSnapshot): void {
  if (!isClient()) return;
  try {
    const s = loadSession();
    const token = s?.token && /^am_/.test(s.token) ? s.token : (s?.token ? `am_${s.token}` : undefined);
    if (!token) return;
    const payload = {
      ...input,
      am_token: token,
      session_id: s?.session_id,
      lang: s?.lang,
      utm_source: s?.utm_source,
      utm_campaign: s?.utm_campaign,
      utm_content: s?.utm_content,
      utm_term: s?.utm_term,
      timestamp: new Date().toISOString(),
    };
    const body = JSON.stringify(payload);
    let beaconOk = false;
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([body], { type: 'application/json' });
        beaconOk = navigator.sendBeacon('/api/mirror-session', blob);
      }
    } catch { beaconOk = false; }
    if (!beaconOk) {
      try {
        fetch('/api/mirror-session', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body,
          keepalive: true,
          credentials: 'omit',
        }).catch(() => { /* swallow */ });
      } catch { /* swallow */ }
    }
  } catch { /* swallow — Mirror UX must never hang on KV writes */ }
}
