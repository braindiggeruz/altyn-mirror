// Meta Pixel + custom event helpers.
// IMPORTANT: Lead is NEVER fired here. Lead is reserved for bot/CAPI confirmation
// (or, optionally, a delayed fallback on /go/telegram — currently OFF).

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

export const track = {
  viewContent(): void {
    fbq('track', 'ViewContent', { content_name: 'ALTYN Mirror Landing' });
  },
  startMirror(): void {
    fbq('trackCustom', 'StartMirror');
  },
  mirrorIntroViewed(): void {
    fbq('trackCustom', 'MirrorIntroViewed');
  },
  liveMapNodeAdded(scene_index: number, result_key: string): void {
    fbq('trackCustom', 'LiveMapNodeAdded', { scene_index, result_key });
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
  resultMapViewed(result_type: string, secondary_result: string): void {
    fbq('trackCustom', 'ResultMapViewed', { result_type, secondary_result });
  },
  saveCardClicked(result_type: string): void {
    fbq('trackCustom', 'SaveCardClicked', { result_type });
  },
  saveCardSuccess(result_type: string): void {
    fbq('trackCustom', 'SaveCardSuccess', { result_type });
  },
  telegramModalOpened(result_type: string): void {
    fbq('trackCustom', 'TelegramModalOpened', { result_type });
  },
  ctaClick(result_type: string): void {
    fbq('trackCustom', 'CTA_Click', { result_type });
  },
  telegramOpenAttempt(result_type: string, token_present: boolean): void {
    fbq('trackCustom', 'TelegramOpenAttempt', { result_type, token_present });
  },

  // === V3 drop-off & engagement events ===
  scenarioPassportViewed(result_type: string): void {
    fbq('trackCustom', 'ScenarioPassportViewed', { result_type });
  },
  sessionPreviewViewed(result_type: string): void {
    fbq('trackCustom', 'SessionPreviewViewed', { result_type });
  },
  telegramIntentClicked(result_type: string, from: string, token_present: boolean): void {
    fbq('trackCustom', 'TelegramIntentClicked', { result_type, from, token_present });
  },
  bridgeViewed(result_type: string, token_present: boolean): void {
    fbq('trackCustom', 'BridgeViewed', { result_type, token_present });
  },

  // === V5 events ===
  meaningBlockViewed(result_type: string): void {
    fbq('trackCustom', 'MeaningBlockViewed', { result_type });
  },
  personalPrepViewed(result_type: string): void {
    fbq('trackCustom', 'PersonalPrepViewed', { result_type });
  },
  personalizedOfferViewed(result_type: string): void {
    fbq('trackCustom', 'PersonalizedOfferViewed', { result_type });
  },

  /**
   * Lead is intentionally NOT fired anywhere in this app.
   * Preferred: Telegram bot receives /start am_<token> → backend → Meta CAPI sends Lead.
   * Fallback (DISABLED) gated by NEXT_PUBLIC_ENABLE_BRIDGE_LEAD flag.
   */
  leadHook_PLACEHOLDER(): void {
    // intentionally empty
  },
};
