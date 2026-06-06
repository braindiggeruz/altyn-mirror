'use client';

import { forwardRef } from 'react';
import type { Lang } from '@/lib/types';
import { ui, pick } from '@/lib/i18n';

type Props = {
  title: string;
  secondary?: string;
  markers: string[];
  keyQuestion: string;
  lang: Lang;
};

export const ShareCard = forwardRef<HTMLDivElement, Props>(function ShareCard(
  { title, secondary, markers, keyQuestion, lang }, ref
) {
  const tagline = lang === 'uz' ? 'Takrorlanuvchi stsenariy xaritasi' : 'Карта повторяющегося сценария';
  const nuanceLbl = lang === 'uz' ? 'Tus' : 'Оттенок';
  const markersLbl = lang === 'uz' ? '3 marker' : '3 маркера';
  const keyLbl = lang === 'uz' ? 'Asosiy savol' : 'Ключевой вопрос';
  const disclaimer = pick(ui.shareCardDisclaimer, lang);

  return (
    <div
      ref={ref}
      style={{
        width: 1080, height: 1080,
        background:
          'radial-gradient(900px 600px at 50% -10%, rgba(206,160,58,0.22), transparent 60%), ' +
          'radial-gradient(720px 500px at 100% 110%, rgba(94,24,34,0.30), transparent 60%), #070708',
        color: '#f4ecd8',
        padding: 80,
        boxSizing: 'border-box',
        fontFamily: 'Manrope, Cormorant Garamond, serif',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 999,
          background: 'radial-gradient(circle at 30% 30%, #fff5d0, #cea03a 55%, #4b3408 100%)',
          boxShadow: '0 0 38px rgba(206,160,58,0.5)',
        }} />
        <div style={{ fontSize: 24, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          <span style={{ color: '#cea03a' }}>ALTYN</span> <span style={{ color: '#f4ecd8' }}>Mirror</span>
        </div>
      </div>

      {/* Body */}
      <div>
        <p style={{ fontSize: 18, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(206,160,58,0.85)', margin: 0 }}>
          {tagline}
        </p>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif', fontWeight: 500,
          fontSize: 96, lineHeight: 1.02, margin: '18px 0 0', color: '#f4ecd8',
        }}>
          {title}
        </h1>

        {secondary && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            marginTop: 18, padding: '8px 16px', borderRadius: 999,
            border: '1px solid rgba(206,160,58,0.45)', background: 'rgba(20,20,25,0.55)',
          }}>
            <span style={{ fontSize: 14, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(206,160,58,0.8)' }}>
              {nuanceLbl}
            </span>
            <span style={{ fontSize: 18, color: '#f4ecd8' }}>{secondary}</span>
          </div>
        )}

        {/* 3 markers */}
        <div style={{ marginTop: 36 }}>
          <p style={{ fontSize: 16, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(206,160,58,0.85)', margin: 0 }}>
            {markersLbl}
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0' }}>
            {markers.slice(0, 3).map((m, i) => (
              <li key={i} style={{
                display: 'flex', gap: 14, alignItems: 'flex-start', marginTop: i === 0 ? 0 : 12,
                fontSize: 26, color: '#f4ecd8', lineHeight: 1.32,
              }}>
                <span style={{
                  marginTop: 14, width: 10, height: 10, borderRadius: 999,
                  background: '#cea03a', boxShadow: '0 0 12px rgba(206,160,58,0.75)', flexShrink: 0,
                }} />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Key question */}
        <div style={{ marginTop: 40 }}>
          <p style={{ fontSize: 16, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(206,160,58,0.8)', margin: 0 }}>
            {keyLbl}
          </p>
          <p style={{
            fontFamily: 'Cormorant Garamond, serif', fontWeight: 500, fontStyle: 'italic',
            fontSize: 40, lineHeight: 1.18, color: 'rgba(244,236,216,0.95)', marginTop: 10,
          }}>
            “{keyQuestion}”
          </p>
        </div>
      </div>

      {/* Footer */}
      <div>
        <div style={{ height: 1, width: '100%', background: 'linear-gradient(90deg, transparent, rgba(206,160,58,0.55), transparent)' }} />
        <p style={{ fontSize: 20, marginTop: 18, color: 'rgba(244,236,216,0.6)' }}>{disclaimer}</p>
        <p style={{ fontSize: 20, marginTop: 6, color: 'rgba(206,160,58,0.92)' }}>ALTYN Mirror · altyn-mirror.pages.dev</p>
      </div>
    </div>
  );
});
