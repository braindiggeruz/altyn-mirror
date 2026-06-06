'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getStoredLang } from '@/lib/lang';
import type { Lang } from '@/lib/types';

export function LegalShell({ title, children, testid }: { title: string; children: React.ReactNode; testid?: string }) {
  const [lang, setLang] = useState<Lang>('ru');
  useEffect(() => setLang(getStoredLang()), []);
  return (
    <main className="relative min-h-[100dvh] overflow-hidden" data-testid={testid}>
      <header className="px-5 pt-5 flex items-center justify-between max-w-[680px] mx-auto">
        <Link href="/" className="serif text-[18px] tracking-[0.08em] text-ivory">
          <span className="text-gold">ALTYN</span> Mirror
        </Link>
        <Link href="/" className="text-[12px] text-ivory/55 hover:text-gold transition-colors">
          {lang === 'uz' ? 'Bosh sahifa' : 'На главную'}
        </Link>
      </header>
      <article className="px-5 pt-8 pb-12 max-w-[680px] mx-auto prose-altyn">
        <h1 className="serif text-[34px] leading-[1.08] text-ivory" style={{fontWeight:500}}>{title}</h1>
        <div className="mt-6 text-[15px] text-ivory/85 leading-[1.65] space-y-4">
          {children}
        </div>
      </article>
      <footer className="px-5 pb-8 max-w-[680px] mx-auto flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-ivory/45">
        <Link href="/privacy/" className="hover:text-gold transition-colors">Privacy</Link>
        <Link href="/terms/" className="hover:text-gold transition-colors">Terms</Link>
        <Link href="/disclaimer/" className="hover:text-gold transition-colors">Disclaimer</Link>
        <Link href="/contact/" className="hover:text-gold transition-colors">Contact</Link>
      </footer>
    </main>
  );
}
