'use client';

import { forwardRef } from 'react';
import type { Lang } from '@/lib/types';

type Props = {
  title: string;
  keyQuestion: string;
  lang: Lang;
};

export const ShareCard = forwardRef<HTMLDivElement, Props>(function ShareCard({ title, keyQuestion, lang }, ref) {
  const safe = lang === 'uz'
    ? 'Bu tibbiy xizmat emas. Bu shaxsiy mulohaza vositasi.'
    : 'Это не медицинская услуга. Это инструмент личной рефлексии.';
  const brand = 'ALTYN Mirror';
  const tagline = lang === 'uz' ? 'Takrorlanuvchi stsenariy xaritasi' : 'Карта повторяющегося сценария';

  return (
    <div
      ref={ref}
      style={{
        width: 1080, height: 1080,
        background: 'radial-gradient(900px 600px at 50% -10%, rgba(206,160,58,0.18), transparent 60%), radial-gradient(700px 500px at 100% 110%, rgba(94,24,34,0.30), transparent 60%), #070708',
        color: '#f4ecd8',
        padding: 88,
        boxSizing: 'border-box',
        fontFamily: 'Manrope, Cormorant Garamond, serif',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 999,
          background: 'radial-gradient(circle at 30% 30%, #fff5d0, #cea03a 55%, #4b3408 100%)',
          boxShadow: '0 0 38px rgba(206,160,58,0.5)',
        }} />
        <div style={{ fontSize: 26, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          <span style={{ color: '#cea03a' }}>ALTYN</span> <span style={{ color: '#f4ecd8' }}>Mirror</span>
        </div>
      </div>

      <div>
        <p style={{ fontSize: 22, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(206,160,58,0.85)', margin: 0 }}>
          {tagline}
        </p>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif', fontWeight: 500,
          fontSize: 108, lineHeight: 1.02, margin: '24px 0 0', color: '#f4ecd8',
        }}>
          {title}
        </h1>
        <p style={{
          fontFamily: 'Cormorant Garamond, serif', fontWeight: 500,
          fontSize: 44, lineHeight: 1.2, color: 'rgba(244,236,216,0.92)', marginTop: 36, fontStyle: 'italic',
        }}>
          “{keyQuestion}”
        </p>
      </div>

      <div>
        <div style={{ height: 1, width: '100%', background: 'linear-gradient(90deg, transparent, rgba(206,160,58,0.55), transparent)' }} />
        <p style={{ fontSize: 22, marginTop: 22, color: 'rgba(244,236,216,0.55)' }}>{safe}</p>
        <p style={{ fontSize: 22, marginTop: 6, color: 'rgba(206,160,58,0.9)' }}>{brand} · altyn-mirror.pages.dev</p>
      </div>
    </div>
  );
});
