'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ui, pick, fmt } from '@/lib/i18n';
import type { Lang, ResultKey } from '@/lib/types';
import { loadSession } from '@/lib/storage';
import { isValidToken } from '@/lib/token';
import { RESULT_KEYS, RESULTS } from '@/lib/results';
import { OWNER_URL, openOwnerDirect } from '@/lib/openOwner';

const VALID = new Set<ResultKey>(RESULT_KEYS);

/**
 * V6.1 — Returning chip on the homepage. One click: fire tracking + notify +
 * clipboard, then anchor href opens @Altyn2304 directly.
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
  const data = RESULTS[resultType];
  const secondaryData = secondary ? RESULTS[secondary] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
    >
      <a
        data-testid="returning-chip"
        href={OWNER_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          openOwnerDirect({
            resultType,
            secondaryResult: secondary || '',
            tokenPresent: true,
            tokenShort: shortToken,
            scenarioTitle: pick(data.title, lang),
            secondaryTitle: secondaryData ? pick(secondaryData.title, lang) : '',
            keyQuestion: pick(data.keyQuestion, lang),
            from: 'returning_chip',
            lang,
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
      </a>
    </motion.div>
  );
}
