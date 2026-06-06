'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ui, pick, fmt } from '@/lib/i18n';
import type { Lang } from '@/lib/types';
import { SCENES, TOTAL_SCENES } from '@/lib/scenes';
import type { AnswerPathEntry } from '@/lib/scoring';
import { scoreAnswers } from '@/lib/scoring';
import { getStoredLang } from '@/lib/lang';
import { track } from '@/lib/tracking';
import { loadSession, saveSession, makeSessionId } from '@/lib/storage';
import type { SessionData } from '@/lib/storage';
import { newToken } from '@/lib/token';
import { ProgressRing } from '@/components/ProgressRing';

export default function PlayPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('ru');
  const [step, setStep] = useState(0); // 0..6 (scene index = step+1)
  const [path, setPath] = useState<AnswerPathEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLang(getStoredLang());
  }, []);

  const scene = SCENES[step];
  const progress = useMemo(() => (step) / TOTAL_SCENES, [step]);

  function selectOption(optionId: string, resultKey: AnswerPathEntry['result']) {
    const entry: AnswerPathEntry = { sceneIndex: scene.index, optionId, result: resultKey };
    const newPath = [...path.filter((p) => p.sceneIndex !== scene.index), entry]
      .sort((a, b) => a.sceneIndex - b.sceneIndex);
    setPath(newPath);
    track.answerScene(scene.index, optionId, resultKey);

    if (step + 1 < TOTAL_SCENES) {
      setStep(step + 1);
    } else {
      // Finalize
      track.mirrorCompleted();
      const { primary, secondary } = scoreAnswers(newPath);
      const existing = loadSession();
      const token = existing?.token || newToken();
      const session: SessionData = {
        session_id: existing?.session_id || makeSessionId(),
        lang,
        result_type: primary,
        secondary_result: secondary,
        answer_path: newPath,
        utm_source: existing?.utm_source,
        utm_medium: existing?.utm_medium,
        utm_campaign: existing?.utm_campaign,
        utm_content: existing?.utm_content,
        utm_term: existing?.utm_term,
        fbclid: existing?.fbclid,
        token,
        completed_at: new Date().toISOString(),
        created_at: existing?.created_at || new Date().toISOString(),
      };
      saveSession(session);
      router.push(`/result/${primary}/`);
    }
  }

  function back() {
    if (step === 0) {
      router.push('/');
    } else {
      setStep(step - 1);
    }
  }

  if (!mounted) {
    return <main className="min-h-[100dvh]" />;
  }

  return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      <header className="px-5 pt-5 flex items-center justify-between max-w-[560px] mx-auto">
        <button data-testid="play-back" onClick={back}
          className="text-[13px] text-ivory/60 hover:text-gold transition-colors px-2 py-1">
          ← {pick(ui.flow.back, lang)}
        </button>
        <div className="flex items-center gap-3">
          <span data-testid="scene-counter" className="text-[12px] tracking-[0.22em] uppercase text-gold/80">
            {fmt(pick(ui.flow.sceneOf, lang), { n: scene.index, total: TOTAL_SCENES })}
          </span>
          <ProgressRing progress={(scene.index - 0.5) / TOTAL_SCENES} />
        </div>
      </header>

      <section className="px-5 pt-10 pb-12 max-w-[560px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={scene.index}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <p data-testid="scene-title" className="text-[12px] uppercase tracking-[0.28em] text-gold/75">
              {pick(scene.title, lang)}
            </p>
            <h2 data-testid="scene-question" className="serif mt-4 text-[30px] leading-[1.12] text-ivory" style={{fontWeight: 500}}>
              {pick(scene.question, lang)}
            </h2>
            <p className="mt-3 text-[12.5px] text-ivory/45">{pick(ui.flow.tapHint, lang)}</p>

            <div className="mt-7 flex flex-col gap-3" data-testid="scene-options">
              {scene.options.map((opt, idx) => (
                <motion.button
                  key={opt.id}
                  data-testid={`option-${opt.id}`}
                  onClick={() => selectOption(opt.id, opt.result)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.08 + idx * 0.07 }}
                  whileTap={{ scale: 0.985 }}
                  className="group text-left w-full px-5 py-4 rounded-2xl card card-gold-edge
                             text-ivory/90 hover:text-ivory transition-colors"
                >
                  <span className="text-[16.5px] leading-[1.4]">
                    {pick(opt.text, lang)}
                  </span>
                </motion.button>
              ))}
            </div>

            <p className="mt-8 text-[12px] text-ivory/40">{pick(ui.flow.leave, lang)}</p>
          </motion.div>
        </AnimatePresence>
      </section>

      <footer className="px-5 pb-6 max-w-[560px] mx-auto text-[11.5px] text-ivory/35">
        <Link href="/disclaimer/" className="hover:text-gold transition-colors">{pick(ui.legal.disclaimer, lang)}</Link>
        <span className="mx-2">·</span>
        <span>{pick(ui.legal.nonMedical, lang)}</span>
      </footer>
    </main>
  );
}
