'use client';

import type { Lang } from '@/lib/types';

export function LangSwitcher({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  const Btn = ({ value, label }: { value: Lang; label: string }) => (
    <button
      type="button"
      data-testid={`lang-${value}`}
      aria-pressed={lang === value}
      onClick={() => onChange(value)}
      className={
        'px-2.5 py-1 text-[11px] tracking-[0.18em] uppercase rounded-full transition-colors ' +
        (lang === value
          ? 'text-ink-950 bg-gold-200 border border-gold/40 shadow-gold'
          : 'text-ivory/55 hover:text-gold border border-transparent')
      }
    >
      {label}
    </button>
  );
  return (
    <div className="inline-flex items-center gap-1" role="group" aria-label="Language switcher">
      <Btn value="ru" label="RU" />
      <Btn value="uz" label="UZ" />
    </div>
  );
}
