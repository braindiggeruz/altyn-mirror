'use client';

import { useEffect, useState } from 'react';
import { ui, pick } from '@/lib/i18n';
import type { Lang, ResultKey } from '@/lib/types';
import { track } from '@/lib/tracking';

type Props = {
  lang: Lang;
  telegramHref: string;
  resultType: ResultKey;
  tokenPresent: boolean;
};

/**
 * Sticky bottom Telegram CTA — appears after the user scrolls past the hero,
 * respects safe-area bottom. Closes the gap between scroll-depth and conversion.
 */
export function StickyTelegramCta({ lang, telegramHref, resultType, tokenPresent }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (typeof window === 'undefined') return;
      // Show after passing ~70% of first viewport (after passport begins).
      const threshold = Math.max(420, window.innerHeight * 0.7);
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
      <div className="px-4 pb-3 max-w-[640px] mx-auto">
        <a
          data-testid="sticky-telegram-link"
          href={telegramHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            track.telegramIntentClicked(resultType, 'sticky_cta', tokenPresent);
            track.telegramOpenAttempt(resultType, tokenPresent);
          }}
          className="btn-gold text-[16px] w-full pointer-events-auto shadow-gold"
          style={{ backdropFilter: 'blur(6px)' }}
        >
          {pick(ui.result.stickyCta, lang)}
        </a>
      </div>
    </div>
  );
}
