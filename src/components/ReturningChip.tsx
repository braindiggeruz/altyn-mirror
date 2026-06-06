'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ui, pick, fmt } from '@/lib/i18n';
import type { Lang, ResultKey } from '@/lib/types';
import { loadSession } from '@/lib/storage';
import { isValidToken } from '@/lib/token';
import { track } from '@/lib/tracking';
import { notify } from '@/lib/notify';
import { RESULT_KEYS, RESULTS } from '@/lib/results';

const VALID = new Set<ResultKey>(RESULT_KEYS);

/**
 * Gold chip shown on the homepage if the user has already completed the map.
 * V6: leads directly to Алтын via the owner bridge — not to the bot.
 */
export function ReturningChip({ lang }: { lang: Lang }) {
  const [token, setToken] = useState<string>('');
  const [resultType, setResultType] = useState<ResultKey | ''>('');
  const [secondary, setSecondary] = useState<ResultKey | ''>('');

  useEffect(() => {
    const s = loadSession();
    if (!s) return;
    if (!isValidToken(s.token)) return;
    if (!s.result_type || !VALID.has(s.result_type)) return;
    setToken(s.token);
    setResultType(s.result_type);
    if (s.secondary_result && VALID.has(s.secondary_result) && s.secondary_result !== s.result_type) {
      setSecondary(s.secondary_result);
    }
  }, []);

  if (!token || !resultType) return null;

  const shortToken = token.replace(/^am_/, '').slice(0, 8);
  const ownerHref = `/go/telegram/?target=owner&t=${encodeURIComponent(token)}&r=${resultType}&from=returning_chip`;
  const data = RESULTS[resultType];
  const secondaryData = secondary ? RESULTS[secondary] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
    >
      <Link
        data-testid="returning-chip"
        href={ownerHref}
        onClick={() => {
          track.ownerDirectIntentClicked({
            result_type: resultType,
            secondary_result: secondary || '',
            token_present: true,
            from: 'returning_chip',
          });
          notify('owner_direct_intent', {
            scenario: pick(data.title, lang),
            secondary: secondaryData ? pick(secondaryData.title, lang) : '',
            key_question: pick(data.keyQuestion, lang),
            token_short: shortToken,
            from: 'returning_chip',
            page: '/',
          });
        }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                   border border-gold/45 bg-ink-800/60 hover:bg-ink-800/80
                   text-[12.5px] text-gold transition-colors"
        style={{ boxShadow: '0 0 24px -10px rgba(206,160,58,0.55)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-gold"
          style={{ boxShadow: '0 0 8px rgba(206,160,58,0.9)' }} />
        <span>{fmt(pick(ui.returningChip.text, lang), { token: shortToken })}</span>
      </Link>
    </motion.div>
  );
}
