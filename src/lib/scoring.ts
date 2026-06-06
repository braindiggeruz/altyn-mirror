import { SCENES } from './scenes';
import { RESULT_KEYS } from './results';
import type { ResultKey } from './types';

export type AnswerPathEntry = {
  sceneIndex: number;  // 1..7
  optionId: string;    // e.g. 's1a'
  result: ResultKey;
};

export type ScoreResult = {
  primary: ResultKey;
  secondary: ResultKey;
  scores: Record<ResultKey, number>;
};

/**
 * Deterministic scoring with tie-breakers:
 *   highest score wins; on tie -> scene 7 answer's result, then scene 6, then scene 4.
 * Secondary = next highest distinct result. If all answers map to one type, secondary = primary.
 */
export function scoreAnswers(path: AnswerPathEntry[]): ScoreResult {
  const scores: Record<ResultKey, number> = {
    mayatnik: 0, tuman: 0, dogonyayu: 0, iskra: 0, dver: 0,
  };
  for (const a of path) scores[a.result] += 1;

  const tieScenePriority = [7, 6, 4];
  const byScene: Record<number, ResultKey | undefined> = {};
  for (const a of path) byScene[a.sceneIndex] = a.result;

  const sorted = (Object.entries(scores) as [ResultKey, number][])
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      // tie: prefer the result chosen in tie-breaker scenes
      for (const sIdx of tieScenePriority) {
        const sceneChoice = byScene[sIdx];
        if (sceneChoice === a[0] && sceneChoice !== b[0]) return -1;
        if (sceneChoice === b[0] && sceneChoice !== a[0]) return 1;
      }
      // final stable fallback by canonical order
      return RESULT_KEYS.indexOf(a[0]) - RESULT_KEYS.indexOf(b[0]);
    });

  const primary = sorted[0][0];
  const secondary = (sorted.find(([k, v]) => k !== primary && v > 0)?.[0]) ?? primary;
  return { primary, secondary, scores };
}

export function validateAnswerPath(path: AnswerPathEntry[]): boolean {
  if (path.length !== SCENES.length) return false;
  const seen = new Set<number>();
  for (const a of path) {
    if (a.sceneIndex < 1 || a.sceneIndex > SCENES.length) return false;
    if (seen.has(a.sceneIndex)) return false;
    seen.add(a.sceneIndex);
    const scene = SCENES[a.sceneIndex - 1];
    if (!scene.options.find((o) => o.id === a.optionId && o.result === a.result)) return false;
  }
  return true;
}
