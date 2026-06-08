'use client';

/**
 * AltynCard — Trust bridge to Altyn.
 *
 * Sprint 4 of the conversion audit. Single biggest multiplier on
 * RealDM/OwnerIntent. Used in two places:
 *   1) Landing (page.tsx) — under the hero, before the orbit.
 *   2) Result page — directly ABOVE the primary CTA cluster, so the woman
 *      sees a real human face + first-person voice BEFORE she taps the
 *      button that opens Telegram.
 *
 * Photo: looks for /altyn.jpg in /public. If missing, falls back gracefully
 * to a gold initial avatar. The card never breaks when the photo is absent.
 *
 * No tracking side effects. Pure presentational.
 */

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { ui, pick } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

type Props = {
  lang: Lang;
  /** Optional one-line first-person quote tailored to the specific scenario. */
  scenarioLine?: string;
  /** Compact = smaller padding & no review. Used on landing. */
  compact?: boolean;
  /** Override photo path (default /altyn.jpg → fallback initials). */
  photoSrc?: string;
};

export function AltynCard({ lang, scenarioLine, compact = false, photoSrc = '/altyn.jpg' }: Props) {
  const [photoOk, setPhotoOk] = useState(true);
  const chips = lang === 'uz' ? ui.altyn.chips.uz : ui.altyn.chips.ru;
  const promise = scenarioLine || pick(ui.altyn.promise, lang);

  return (
    <motion.aside
      data-testid="altyn-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className={
        'mt-7 rounded-2xl border border-gold/25 bg-ink-900/60 ' +
        (compact ? 'p-4' : 'p-4 sm:p-5')
      }
    >
      <div className="flex items-start gap-3.5">
        <div
          aria-hidden
          className="shrink-0 w-[56px] h-[56px] rounded-full ring-1 ring-gold/40 bg-ink-800 overflow-hidden flex items-center justify-center"
          data-testid="altyn-card-photo"
        >
          {photoOk ? (
            // Static-export friendly. unoptimized via next.config.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoSrc}
              alt="Altyn"
              width={56}
              height={56}
              onError={() => setPhotoOk(false)}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="serif text-gold text-[22px] leading-none select-none">А</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10.5px] uppercase tracking-[0.22em] text-gold/70">
            {pick(ui.altyn.eyebrow, lang)}
          </p>
          <p className="serif mt-1 text-[18px] leading-[1.2] text-ivory">
            {pick(ui.altyn.name, lang)}
          </p>
          <p className="mt-0.5 text-[12.5px] leading-[1.45] text-ivory/70">
            {pick(ui.altyn.role, lang)}
          </p>
          <p className="text-[12px] leading-[1.45] text-ivory/55">
            {pick(ui.altyn.location, lang)}
          </p>
        </div>
      </div>

      <p className="mt-3.5 serif italic text-[14.5px] leading-[1.5] text-ivory/90">
        {promise}
      </p>

      {!compact && (
        <>
          <div className="mt-3.5 flex flex-wrap gap-x-2.5 gap-y-1.5">
            {chips.map((c) => (
              <span
                key={c}
                className="text-[11.5px] text-gold/80 leading-none px-2 py-1 rounded-full border border-gold/20 bg-ink-800/60"
              >
                ✓ {c}
              </span>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gold/15">
            <p className="text-[13px] leading-[1.5] text-ivory/75 italic">
              {pick(ui.altyn.review, lang)}
            </p>
            <p className="mt-1 text-[11.5px] text-ivory/50">
              {pick(ui.altyn.reviewAuthor, lang)}
            </p>
          </div>
        </>
      )}
    </motion.aside>
  );
}
