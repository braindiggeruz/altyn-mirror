'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ui, pick } from '@/lib/i18n';
import type { Lang } from '@/lib/types';
import { getStoredLang } from '@/lib/lang';
import { track } from '@/lib/tracking';
import { loadSession } from '@/lib/storage';
import { isValidToken } from '@/lib/token';

export default function TelegramBridge() {
  const [lang, setLang] = useState<Lang>('ru');
  const [token, setToken] = useState<string>('');
  const [resultType, setResultType] = useState<string>('');

  useEffect(() => {
    setLang(getStoredLang());
    const s = loadSession();
    const sp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const qToken = sp?.get('t') || '';
    const qResult = sp?.get('r') || '';
    const tk = isValidToken(qToken) ? qToken : (s?.token || '');
    const rt = qResult || s?.result_type || '';
    setToken(tk);
    setResultType(rt);

    // Track attempt (token presence boolean only; the actual token is not sent).
    track.telegramOpenAttempt(rt, !!tk);

    /*
     * Lead hook (commented):
     *   Optional fallback Lead event ONLY on this bridge page.
     *   Uncomment if you want Pixel-side Lead attribution as a fallback when
     *   bot/CAPI-side confirmation is not yet wired.
     *
     *   setTimeout(() => {
     *     if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
     *       (window as any).fbq('track', 'Lead', { content_name: 'altyn-mirror-bridge' });
     *     }
     *   }, 3500);
     */
  }, []);

  const bot = process.env.NEXT_PUBLIC_TELEGRAM_BOT || 'altyntherapybot';
  const tgUrl = useMemo(() => `https://t.me/${bot}?start=${token || 'am_no_token'}`, [bot, token]);

  return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      <header className="px-5 pt-5 flex items-center justify-between max-w-[560px] mx-auto">
        <Link href="/" className="serif text-[18px] tracking-[0.08em] text-ivory">
          <span className="text-gold">ALTYN</span> Mirror
        </Link>
      </header>

      <section className="px-5 pt-12 pb-12 max-w-[560px] mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
          className="mx-auto w-[120px] h-[120px] rounded-full mb-7"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #fff5d0, #cea03a 55%, #4b3408 100%)',
            boxShadow: '0 0 80px rgba(206,160,58,0.45), inset 0 0 30px rgba(255,240,200,0.4)',
          }}
        />

        <motion.h1
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="serif text-[30px] leading-[1.1] text-ivory" style={{fontWeight:500}}
          data-testid="bridge-title"
        >
          {pick(ui.bridge.title, lang)}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.25 }}
          className="mt-4 text-[15.5px] text-ivory/80 leading-[1.55]"
          data-testid="bridge-body"
        >
          {pick(ui.bridge.body, lang)}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8 flex flex-col gap-3"
        >
          <a
            data-testid="bridge-open-tg"
            href={tgUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold text-[17px]"
            onClick={() => track.telegramOpenAttempt(resultType, !!token)}
          >
            {pick(ui.bridge.open, lang)}
          </a>
          <p className="text-[12px] text-ivory/45">{pick(ui.bridge.fallback, lang)}</p>
        </motion.div>

        <div className="mt-12 divider-gold" />
        <p className="mt-5 text-[12.5px] text-ivory/45">{pick(ui.bridge.safe, lang)}</p>
      </section>
    </main>
  );
}
