'use client';

import { useEffect, useState } from 'react';
import { detectInAppBrowser, type InAppBrowserKind } from '@/lib/uaDetect';
import { pick, ui } from '@/lib/i18n';
import type { Lang } from '@/lib/types';
import { track } from '@/lib/tracking';
import { OWNER_URL, openOwnerDirect, type OwnerDirectFrom } from '@/lib/openOwner';

/**
 * PR-3 — Inline soft banner shown ONLY inside Instagram / Facebook / Line in-app
 * webviews where the t.me deep-link is unreliable. Offers a copy-link fallback
 * that the user can paste into Safari/Chrome.
 *
 * ANALYTICS DESIGN:
 *   - On detect (mount): fires `trackCustom('IGBrowserDetected')` ONCE.
 *     Custom event, NO value, NO currency, NO CAPI. Cannot pollute the
 *     `Contact` Custom Conversion or value-based optimization.
 *   - On copy-link click: invokes `openOwnerDirect({ from: 'ig_browser_copy',
 *     copyTarget: 'url' })`. This is treated as a REAL owner-direct intent —
 *     `OwnerDirectIntentClicked` + `Contact` (browser Pixel + CAPI) + Telegram
 *     notify all fire, using the SAME event_id schema as the main CTA so
 *     dedup with CAPI is preserved.
 *   - `ig_browser_copy` is whitelisted in `contactAllowed` inside openOwner.ts.
 *
 * Banner DOES NOT replace the primary CTA — it's a complement. The user can
 * still tap "Скопировать сообщение и открыть Telegram" if they want the
 * deep-link path. Banner appears above the primary CTA cluster.
 */
export default function IgBrowserBanner(props: {
  lang: Lang;
  resultType: string;
  secondaryResult: string;
  tokenPresent: boolean;
  tokenShort: string;
  scenarioTitle: string;
  secondaryTitle: string;
  keyQuestion: string;
}): JSX.Element | null {
  const [kind, setKind] = useState<InAppBrowserKind>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // SSR safe — detect only after mount
    const k = detectInAppBrowser();
    if (!k) return;
    setKind(k);
    // Fire once per page load. Note: still per-visit, not per-session-wide,
    // but Meta de-duplicates by content fingerprint at the campaign level.
    track.igBrowserDetected({ browser: k });
    // No CAPI mirror by design.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!kind) return null;

  function onCopy(): void {
    const from: OwnerDirectFrom = 'ig_browser_copy';
    openOwnerDirect({
      resultType: props.resultType,
      secondaryResult: props.secondaryResult,
      tokenPresent: props.tokenPresent,
      tokenShort: props.tokenShort,
      scenarioTitle: props.scenarioTitle,
      secondaryTitle: props.secondaryTitle,
      keyQuestion: props.keyQuestion,
      from,
      lang: props.lang,
      copyTarget: 'url', // copy OWNER_URL, not the prepared message
    });

    // Best-effort secondary clipboard write (defensive — openOwnerDirect already does it)
    if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(OWNER_URL).catch(() => { /* swallow */ });
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2800);
  }

  return (
    <div
      data-testid="ig-browser-banner"
      role="note"
      className="mt-5 rounded-2xl border border-bordo-500/40 bg-bordo-900/30 px-4 py-3"
    >
      <p className="text-[11.5px] uppercase tracking-[0.18em] text-bordo-300 mb-1.5">
        {pick(ui.result.igBannerTitle, props.lang)}
      </p>
      <p className="text-[13px] text-ivory/85 leading-[1.5]">
        {pick(ui.result.igBannerBody, props.lang)}
      </p>
      <div className="mt-3 flex items-center gap-3 flex-wrap">
        <button
          data-testid="ig-browser-copy-cta"
          type="button"
          onClick={onCopy}
          className="btn-ghost text-[13px] py-2 px-3.5 border-bordo-400/40"
        >
          {pick(ui.result.igBannerCopyCta, props.lang)}
        </button>
        {copied && (
          <span
            data-testid="ig-browser-copy-toast"
            className="text-[12.5px] text-gold/90"
          >
            {pick(ui.result.igBannerCopiedToast, props.lang)}
          </span>
        )}
      </div>
    </div>
  );
}
