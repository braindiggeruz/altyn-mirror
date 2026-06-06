'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ui, pick, fmt } from '@/lib/i18n';
import type { Lang, ResultKey } from '@/lib/types';
import { SCENES, TOTAL_SCENES } from '@/lib/scenes';
import type { AnswerPathEntry } from '@/lib/scoring';
import { scoreAnswers } from '@/lib/scoring';
import { getStoredLang } from '@/lib/lang';
import { track } from '@/lib/tracking';
import { notify } from '@/lib/notify';
import { loadSession, saveSession, makeSessionId } from '@/lib/storage';
import type { SessionData } from '@/lib/storage';
import { newToken } from '@/lib/token';
import { ProgressRing } from '@/components/ProgressRing';
import { LiveMapPreview } from '@/components/LiveMapPreview';
import { MirrorIntro } from '@/components/MirrorIntro';
import { MapAssembled } from '@/components/MapAssembled';
import { RESULTS } from '@/lib/results';

type Phase = 'intro' | 'scene' | 'assembled';

export default function PlayPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('ru');
  const [mounted, setMounted] = useState(false);

  const [phase, setPhase] = useState<Phase>('intro');
  const [step, setStep] = useState(0);                    // 0..6
  const [path, setPath] = useState<AnswerPathEntry[]>([]);
  const [picked, setPicked] = useState<string | null>(null); // selected option id (lock during transition)
  const [cue, setCue] = useState<string | null>(null);       // micro-confirm text after answer

  useEffect(() => {
    setMounted(true);
    setLang(getStoredLang());
    track.mirrorIntroViewed();
  }, []);

  const scene = SCENES[step];
  const ringProgress = useMemo(() => phase === 'scene' ? (scene.index - 0.5) / TOTAL_SCENES : 0, [phase, scene.index]);

  function goToScene() {
    setPhase('scene');
    // V6 — notify the leads group once per session that the map has started.
    // Ensure session id exists so throttling can pin to it.
    let existing = loadSession();
    if (!existing) {
      existing = {
        session_id: makeSessionId(),
        lang,
        answer_path: [],
        created_at: new Date().toISOString(),
        token: newToken(),
      };
      saveSession(existing);
    }
    notify('quiz_started', { page: '/play' });
  }

  function selectOption(optionId: string, resultKey: ResultKey) {
    if (picked) return;
    setPicked(optionId);

    // micro-confirm cue from markerCue copy
    const cueText = pick(ui.markerCue[resultKey], lang);
    setCue(cueText);
    track.liveMapNodeAdded(scene.index, resultKey);

    const entry: AnswerPathEntry = { sceneIndex: scene.index, optionId, result: resultKey };
    const newPath = [...path.filter((p) => p.sceneIndex !== scene.index), entry]
      .sort((a, b) => a.sceneIndex - b.sceneIndex);
    setPath(newPath);
    track.answerScene(scene.index, optionId, resultKey);

    // After 700ms, advance
    window.setTimeout(() => {
      setPicked(null);
      setCue(null);
      if (step + 1 < TOTAL_SCENES) {
        setStep(step + 1);
      } else {
        finalize(newPath);
      }
    }, 720);
  }

  function finalize(finalPath: AnswerPathEntry[]) {
    track.mirrorCompleted();
    const { primary, secondary } = scoreAnswers(finalPath);
    const existing = loadSession();
    const token = existing?.token || newToken();
    const session: SessionData = {
      session_id: existing?.session_id || makeSessionId(),
      lang,
      result_type: primary,
      secondary_result: secondary,
      answer_path: finalPath,
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

    // V6 — notify leads group that the map is complete (also fired on
    // /result mount as a safety net; both throttled to once per session).
    const primaryData = RESULTS[primary];
    const secondaryData = secondary && secondary !== primary ? RESULTS[secondary] : null;
    notify('quiz_completed', {
      scenario: pick(primaryData.title, lang),
      secondary: secondaryData ? pick(secondaryData.title, lang) : '',
      key_question: pick(primaryData.keyQuestion, lang),
      token_short: token.replace(/^am_/, '').slice(0, 10),
      page: '/play',
    });

    // V4: ~900ms cinematic beat (prefers-reduced-motion shortens inside MapAssembled).
    setPhase('assembled');
    const reduce = typeof window !== 'undefined'
      && window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(() => router.push(`/result/${primary}/`), reduce ? 260 : 900);
  }

  function back() {
    if (phase === 'intro') { router.push('/'); return; }
    if (step === 0) { router.push('/'); return; }
    setStep(step - 1);
    setPath(path.filter((p) => p.sceneIndex !== scene.index));
  }

  if (!mounted) return <main className="min-h-[100dvh]" />;

  if (phase === 'assembled') return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      <MapAssembled lang={lang} />
    </main>
  );

  if (phase === 'intro') return (
    <main className="relative min-h-[100dvh] overflow-hidden pb-safe">
      <header className="px-5 pt-5 flex items-center justify-between max-w-[560px] mx-auto">
        <button data-testid="play-back" onClick={() => router.push('/')}
          className="text-[13px] text-ivory/60 hover:text-gold transition-colors px-2 py-1">
          ← {pick(ui.flow.back, lang)}
        </button>
      </header>
      <MirrorIntro lang={lang} onSkip={goToScene} />
    </main>
  );

  const doneCount = path.length;

  return (
    <main className="relative min-h-[100dvh] overflow-hidden pb-safe">
      <header className="px-5 pt-5 flex items-center justify-between max-w-[560px] mx-auto">
        <button data-testid="play-back" onClick={back}
          className="text-[13px] text-ivory/60 hover:text-gold transition-colors px-2 py-1">
          ← {pick(ui.flow.back, lang)}
        </button>
        <div className="flex items-center gap-3">
          <span data-testid="scene-counter" className="text-[12px] tracking-[0.22em] uppercase text-gold/80">
            {fmt(pick(ui.flow.sceneOf, lang), { n: scene.index, total: TOTAL_SCENES })}
          </span>
          <ProgressRing progress={ringProgress} />
        </div>
      </header>

      {/* Live map preview area */}
      <div className="px-5 mt-4 max-w-[560px] mx-auto flex flex-col items-center" data-testid="live-map">
        <LiveMapPreview
          filled={path.map(p => ({ result: p.result, sceneIndex: p.sceneIndex }))}
          total={TOTAL_SCENES}
          lastResult={path[path.length - 1]?.result}
        />
        <div className="mt-2 h-[18px] text-[12px] text-ivory/55 text-center" aria-live="polite" data-testid="live-map-status">
          <AnimatePresence mode="wait">
            {cue ? (
              <motion.span key="cue"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="text-gold/90"
                data-testid="live-map-cue"
              >{cue}</motion.span>
            ) : (
              <motion.span key="prog"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}>
                {fmt(pick(ui.flow.mapAssembling, lang), { done: doneCount, total: TOTAL_SCENES })}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <section className="px-5 pt-7 pb-12 max-w-[560px] mx-auto">
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
            <p data-testid="scene-subtitle" className="serif mt-3 text-[18px] leading-[1.3] text-ivory/75 italic">
              {pick(scene.subtitle, lang)}
            </p>
            <h2 data-testid="scene-question" className="serif mt-3 text-[28px] leading-[1.15] text-ivory" style={{fontWeight: 500}}>
              {pick(scene.question, lang)}
            </h2>
            <p className="mt-2 text-[12px] text-ivory/45">{pick(ui.flow.tapHint, lang)}</p>

            <div className="mt-6 flex flex-col gap-3" data-testid="scene-options">
              {scene.options.map((opt, idx) => {
                const isPicked = picked === opt.id;
                const isOtherDim = picked && picked !== opt.id;
                return (
                  <motion.button
                    key={opt.id}
                    data-testid={`option-${opt.id}`}
                    disabled={!!picked}
                    onClick={() => selectOption(opt.id, opt.result)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                      opacity: isOtherDim ? 0.25 : 1,
                      y: 0,
                      scale: isPicked ? 1.02 : 1,
                    }}
                    transition={{ duration: 0.4, delay: 0.06 + idx * 0.07 }}
                    whileTap={{ scale: 0.985 }}
                    className={
                      'group text-left w-full px-5 py-4 rounded-2xl card card-gold-edge ' +
                      'text-ivory/90 hover:text-ivory transition-colors ' +
                      (isPicked ? 'shadow-gold ring-1 ring-gold/60' : '')
                    }
                    style={isPicked ? { background: 'linear-gradient(180deg, rgba(206,160,58,0.18), rgba(206,160,58,0.05))' } : undefined}
                  >
                    <span className="text-[16.5px] leading-[1.4]">
                      {pick(opt.text, lang)}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <p className="mt-7 text-[12px] text-ivory/40">{pick(ui.flow.leave, lang)}</p>
          </motion.div>
        </AnimatePresence>
      </section>

      <footer className="px-5 pb-8 pb-safe-extra max-w-[560px] mx-auto text-[11.5px] text-ivory/35">
        <Link href="/disclaimer/" className="hover:text-gold transition-colors">{pick(ui.legal.disclaimer, lang)}</Link>
        <span className="mx-2">·</span>
        <span>{pick(ui.legal.nonMedical, lang)}</span>
      </footer>
    </main>
  );
}
