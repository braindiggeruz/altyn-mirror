import type { Lang } from './types';

const KEY = 'altyn.lang';

export function getStoredLang(): Lang {
  if (typeof window === 'undefined') return 'ru';
  const v = window.localStorage.getItem(KEY);
  return v === 'uz' ? 'uz' : 'ru';
}

export function setStoredLang(lang: Lang): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, lang);
}
