// PR-3 — Detects Meta / Line in-app browsers where t.me deep-links can fail
// silently. Used by IgBrowserBanner to surface a "copy link, open in Safari/
// Chrome" fallback before the user clicks the primary CTA.
//
// Detection is conservative — only well-known webview UA fingerprints. False
// positives (showing the banner unnecessarily) are far less costly than false
// negatives (user gets stuck in IG WebView with no fallback).
//
// IMPORTANT: this helper is pure UI. It does NOT fire any analytics by itself.
// The banner component fires `trackCustom('IGBrowserDetected')` on mount —
// trackCustom only, no value/currency, no CAPI. Cannot pollute Meta optimization.

export type InAppBrowserKind =
  | 'instagram'
  | 'facebook'
  | 'line'
  | 'wechat'
  | null;

export function detectInAppBrowser(ua?: string): InAppBrowserKind {
  const s = (ua ?? (typeof navigator !== 'undefined' ? navigator.userAgent : '')) || '';
  if (/Instagram/i.test(s)) return 'instagram';
  if (/FBAN|FBAV|FB_IAB/i.test(s)) return 'facebook';
  if (/Line\//i.test(s)) return 'line';
  if (/MicroMessenger/i.test(s)) return 'wechat';
  return null;
}

export function isInAppBrowser(ua?: string): boolean {
  return detectInAppBrowser(ua) !== null;
}
