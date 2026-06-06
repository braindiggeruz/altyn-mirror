'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ui, pick, fmt } from '@/lib/i18n';
import type { Lang, ResultKey } from '@/lib/types';
import { loadSession } from '@/lib/storage';
import { isValidToken } from '@/lib/token';
import { track } from '@/lib/tracking';
import { RESULT_KEYS } from '@/lib/results';

const VALID = new Set<ResultKey>(RESULT_KEYS);

/**
 * Gold chip shown on the homepage if the user has already completed the map
 * (session has token + result_type). Lets them re-enter Telegram in one tap.
 */
export function ReturningChip({ lang }: { lang: Lang }) {
  const [token, setToken] = useState<string>('');
  const [resultType, setResultType] = useState<ResultKey | ''>('');

  useEffect(() => {
    const s = loadSession();
    if (!s) return;
    if (!isValidToken(s.token)) return;
    if (!s.result_type || !VALID.has(s.result_type)) return;
    setToken(s.token);
    setResultType(s.result_type);
  }, []);

  if (!token || !resultType) return null;

  const bot = process.env.NEXT_PUBLIC_TELEGRAM_BOT || 'altyntherapybot';
  const tgHref = `https://t.me/${bot}?start=${token}`;
  const shortToken = token.replace(/^am_/, '').slice(0, 8);

  return (
    <motion.a
      data-testid="returning-chip"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
      href={tgHref}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        track.telegramIntentClicked(resultType, 'returning_chip', true);
        track.telegramOpenAttempt(resultType, true);
      }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                 border border-gold/45 bg-ink-800/60 hover:bg-ink-800/80
                 text-[12.5px] text-gold transition-colors"
      style={{ boxShadow: '0 0 24px -10px rgba(206,160,58,0.55)' }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-gold"
        style={{ boxShadow: '0 0 8px rgba(206,160,58,0.9)' }} />
      <span>{fmt(pick(ui.returningChip.text, lang), { token: shortToken })}</span>
    </motion.a>
  );
}
