'use client';

import { useEffect, useState } from 'react';
import { ui, pick } from '@/lib/i18n';
import type { Lang, ResultKey } from '@/lib/types';

type Props = {
  lang: Lang;
  /** Direct Telegram URL (e.g. https://t.me/Altyn2304) — used as anchor href so
   *  the browser follows the deep link in the same user gesture. */
  ownerUrl: string;
  resultType: ResultKey;
  secondaryResult?: ResultKey | '';
  tokenPresent: boolean;
  /** Fires Pixel + clipboard + notify side effects synchronously. */
  onClick: () => void;
};

/**
 * V6.1 — One-click sticky bottom CTA: fires tracking + clipboard + notify in
 * the click handler, then lets the native `<a target="_blank">` open Алтын.
 */
export function StickyTelegramCta({
  lang,
  ownerUrl,
  tokenPresent,
  onClick,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (typeof window === 'undefined') return;
      // PR-1: sticky CTA appears earlier so it's visible right after Passport,
      // not only after the user has scrolled through Meaning/Facts/Don't-do.
      const threshold = Math.max(260, window.innerHeight * 0.4);
      setVisible(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      data-testid="sticky-telegram-cta"
      className={
        'fixed inset-x-0 bottom-0 z-40 pointer-events-none ' +
        'transition-all duration-300 ease-out ' +
        (visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0')
      }
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 12px)' }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[140px] pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(7,7,8,0) 0%, rgba(7,7,8,0.78) 55%, rgba(7,7,8,0.95) 100%)',
        }}
      />
      <div className="relative px-4 pb-3 max-w-[640px] mx-auto">
        <a
          data-testid="sticky-telegram-link"
          href={ownerUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          aria-disabled={!tokenPresent && undefined}
          className="btn-gold text-[16px] w-full pointer-events-auto shadow-gold"
          style={{ backdropFilter: 'blur(6px)' }}
        >
          {pick(ui.result.stickyCta, lang)}
        </a>
      </div>
    </div>
  );
}
