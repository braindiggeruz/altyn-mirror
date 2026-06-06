// Meta Pixel + custom event helpers.
// IMPORTANT: We DO NOT fire `Lead` on homepage PageView.
// Lead is reserved for /go/telegram fallback or later backend/bot confirmation.

type FbqFn = ((...args: unknown[]) => void) & { queue?: unknown[]; callMethod?: unknown };

declare global {
  interface Window {
    fbq?: FbqFn;
    _fbq?: FbqFn;
  }
}

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '2475663283169925';

function fbq(...args: unknown[]): void {
  if (typeof window === 'undefined') return;
  if (typeof window.fbq === 'function') {
    (window.fbq as FbqFn)(...args);
  }
}

export const META_PIXEL_ID = PIXEL_ID;

// Standard events (no Lead on homepage)
export const track = {
  viewContent(): void {
    fbq('track', 'ViewContent', { content_name: 'ALTYN Mirror Landing' });
  },
  startMirror(): void {
    fbq('trackCustom', 'StartMirror');
  },
  answerScene(scene_index: number, answer_id: string, result_key: string): void {
    fbq('trackCustom', 'AnswerScene', { scene_index, answer_id, result_key });
  },
  mirrorCompleted(): void {
    fbq('trackCustom', 'MirrorCompleted');
  },
  resultViewed(result_type: string, secondary_result: string): void {
    fbq('trackCustom', 'ResultViewed', { result_type, secondary_result });
  },
  ctaClick(result_type: string): void {
    fbq('trackCustom', 'CTA_Click', { result_type });
  },
  telegramOpenAttempt(result_type: string, token_present: boolean): void {
    fbq('trackCustom', 'TelegramOpenAttempt', { result_type, token_present });
  },

  /**
   * Lead is intentionally NOT fired anywhere on the funnel by default.
   * Hook this up only on /go/telegram as a delayed fallback, or — preferred —
   * have the Telegram bot/backend confirm the lead via CAPI (Conversions API).
   *
   *   Example fallback (commented out — uncomment + tune timing if needed):
   *     setTimeout(() => fbq('track', 'Lead', { content_name: 'altyn-mirror' }), 4000);
   */
  leadHook_PLACEHOLDER(): void {
    // intentionally empty
  },
};
