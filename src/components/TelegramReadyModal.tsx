'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ui, pick } from '@/lib/i18n';
import type { Lang } from '@/lib/types';

export function TelegramReadyModal({
  open, lang, scenario, nuance, keyQuestion, telegramHref, onClose, onConfirm,
}: {
  open: boolean;
  lang: Lang;
  scenario: string;
  nuance?: string;
  keyQuestion: string;
  telegramHref: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          data-testid="tg-modal-root"
        >
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            data-testid="tg-modal-backdrop"
          />
          <motion.div
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full sm:max-w-[460px] mx-3 mb-3 sm:mb-0 card card-gold-edge p-6
                       pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
            role="dialog" aria-modal="true"
            data-testid="tg-modal"
          >
            <p className="text-[11px] uppercase tracking-[0.28em] text-gold/80">{pick(ui.assembled.badge, lang)}</p>
            <h3 className="serif mt-2 text-[26px] leading-[1.15] text-ivory" style={{fontWeight:500}} data-testid="tg-modal-title">
              {pick(ui.modal.title, lang)}
            </h3>
            <p className="mt-3 text-[14.5px] text-ivory/80 leading-[1.55]">{pick(ui.modal.body, lang)}</p>

            <div className="mt-5 space-y-2.5 text-[14px]">
              <Row label={pick(ui.modal.rowScenario, lang)} value={scenario} testid="tg-modal-scenario" />
              {nuance && <Row label={pick(ui.modal.rowNuance, lang)} value={nuance} testid="tg-modal-nuance" />}
              <Row label={pick(ui.modal.rowKey, lang)} value={`“${keyQuestion}”`} testid="tg-modal-key" italic />
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <a
                href={telegramHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onConfirm}
                className="btn-gold text-[16px] w-full"
                data-testid="tg-modal-primary"
              >
                {pick(ui.modal.primary, lang)}
              </a>
              <button onClick={onClose} className="btn-ghost text-[14px] w-full" data-testid="tg-modal-secondary">
                {pick(ui.modal.secondary, lang)}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value, testid, italic }: { label: string; value: string; testid: string; italic?: boolean }) {
  return (
    <div className="flex gap-3 items-start" data-testid={testid}>
      <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-gold/80 shrink-0" />
      <div className="flex-1">
        <span className="text-[11px] uppercase tracking-[0.18em] text-gold/70">{label}</span>
        <p className={'text-ivory/95 leading-[1.45] ' + (italic ? 'serif text-[17px] italic mt-0.5' : 'mt-0.5')}>{value}</p>
      </div>
    </div>
  );
}
