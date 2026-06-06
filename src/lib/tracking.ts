// Meta Pixel + custom event helpers.
// IMPORTANT: Lead is NEVER fired here. All events are trackCustom.
// No PII (no name, no phone, no telegram username) ever sent.

import { loadSession } from './storage';

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

type IntentFrom =
  | 'result_primary'
  | 'sticky_cta'
  | 'prep_block'
  | 'bridge_owner'
  | 'bot_secondary'
  | 'bridge_bot'
  | 'returning_chip'
  | 'result_modal_primary'
  | string;

function sessionContext(): {
  utm_source: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  fbclid_present: boolean;
  lang: string;
  session_id: string;
  landing_path: string;
} {
  const s = loadSession();
  return {
    utm_source: s?.utm_source || '',
    utm_campaign: s?.utm_campaign || '',
    utm_content: s?.utm_content || '',
    utm_term: s?.utm_term || '',
    fbclid_present: !!s?.fbclid,
    lang: s?.lang || 'ru',
    session_id: s?.session_id || '',
    landing_path: s?.landing_path || '',
  };
}

function currentPagePath(): string {
  return typeof window !== 'undefined' ? window.location.pathname : '';
}

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

  // === V6 events ===
  /** Click-through to Алтын direct DM (@Altyn2304). */
  ownerDirectIntentClicked(args: {
    result_type: string;
    secondary_result: string;
    token_present: boolean;
    from: IntentFrom;
  }): void {
    const ctx = sessionContext();
    // Pixel custom event — never `Lead`. value/currency tag the in-funnel
    // intent so Meta can optimise on it as a Custom Conversion later.
    fbq('trackCustom', 'OwnerDirectIntentClicked', {
      content_name: 'altyn_mirror_owner_direct',
      content_category: 'telegram_owner_intent',
      value: 10,
      currency: 'USD',
      result_type: args.result_type,
      secondary_result: args.secondary_result,
      token_present: args.token_present,
      from: args.from,
      page_path: currentPagePath(),
      ...ctx,
    });
  },
  /** Click-through to bot fallback (@altyntherapybot). */
  telegramIntentClicked(args: {
    result_type: string;
    secondary_result: string;
    token_present: boolean;
    from: IntentFrom;
  }): void {
    const ctx = sessionContext();
    fbq('trackCustom', 'TelegramIntentClicked', {
      result_type: args.result_type,
      secondary_result: args.secondary_result,
      token_present: args.token_present,
      from: args.from,
      utm_source: ctx.utm_source,
      utm_campaign: ctx.utm_campaign,
    });
  },
  bridgeViewed(args: {
    result_type: string;
    token_present: boolean;
    target: 'owner' | 'bot';
  }): void {
    fbq('trackCustom', 'BridgeViewed', {
      result_type: args.result_type,
      token_present: args.token_present,
      target: args.target,
    });
  },

  /**
   * Lead is intentionally NOT fired anywhere in this app.
   * Preferred: Telegram bot receives /start am_<token> → backend → Meta CAPI sends Lead.
   */
  leadHook_PLACEHOLDER(): void {
    // intentionally empty
  },
};
