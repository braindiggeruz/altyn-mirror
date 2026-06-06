'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ui, pick } from '@/lib/i18n';
import type { Lang, ResultKey } from '@/lib/types';

type Props = {
  lang: Lang;
  /** Pre-built `/go/telegram?target=owner&...` href (also encodes from=sticky_cta). */
  ownerHref: string;
  resultType: ResultKey;
  /** Optional — kept for analytics symmetry (Pixel payload is built by caller). */
  secondaryResult?: ResultKey | '';
  tokenPresent: boolean;
  /** Fires before navigation: Pixel OwnerDirectIntentClicked + notify owner_direct_intent. */
  onClick: () => void;
};

/**
 * V6 — Sticky bottom CTA that takes the user directly to Алтын via the owner
 * tracking bridge. Appears after the user scrolls past the first viewport.
 * Always-visible "Сохранить карту" sits inside the page; this CTA is the
 * primary conversion path on every result.
 */
export function StickyTelegramCta({
  lang,
  ownerHref,
  tokenPresent,
  onClick,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (typeof window === 'undefined') return;
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
      {/* Soft fade behind the CTA so it doesn't sit on top of body text */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[140px] pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(7,7,8,0) 0%, rgba(7,7,8,0.78) 55%, rgba(7,7,8,0.95) 100%)',
        }}
      />
      <div className="relative px-4 pb-3 max-w-[640px] mx-auto">
        <Link
          data-testid="sticky-telegram-link"
          href={ownerHref}
          onClick={onClick}
          aria-disabled={!tokenPresent && undefined}
          className="btn-gold text-[16px] w-full pointer-events-auto shadow-gold"
          style={{ backdropFilter: 'blur(6px)' }}
        >
          {pick(ui.result.stickyCta, lang)}
        </Link>
      </div>
    </div>
  );
}
