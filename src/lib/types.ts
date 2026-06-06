export type Lang = 'ru' | 'uz';
export type ResultKey = 'mayatnik' | 'tuman' | 'dogonyayu' | 'iskra' | 'dver';

export type AnswerOption = {
  id: string;            // unique per scene, e.g. 's1a'
  text: { ru: string; uz: string };
  result: ResultKey;
};

export type Scene = {
  index: number;         // 1..7
  title: { ru: string; uz: string };
  subtitle: { ru: string; uz: string };
  question: { ru: string; uz: string };
  options: AnswerOption[];
};

export type ResultMap = {
  start: { ru: string; uz: string };
  hold:  { ru: string; uz: string };
  loop:  { ru: string; uz: string };
};

export type SessionPlanStep = {
  time: string;
  text: string;
};

export type ResultData = {
  key: ResultKey;
  title: { ru: string; uz: string };
  description: { ru: string; uz: string };
  map: ResultMap;
  markers: { ru: string[]; uz: string[] };
  keyQuestion: { ru: string; uz: string };
  cta: { ru: string; uz: string };
  // V3: Scenario Passport additions
  bring:     { ru: string[]; uz: string[] };
  firstStep: { ru: string; uz: string };
  // V5: per-scenario prep questions + session plan
  prepQuestions: { ru: string[]; uz: string[] };
  sessionPlan:   { ru: SessionPlanStep[]; uz: SessionPlanStep[] };
};
