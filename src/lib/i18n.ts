import type { Lang } from './types';

export const DEFAULT_LANG: Lang = 'ru';

export const ui = {
  brand: { ru: 'ALTYN Mirror', uz: 'ALTYN Mirror' },
  tagline: { ru: 'Карта повторяющегося сценария', uz: 'Takrorlanuvchi stsenariy xaritasi' },

  hero: {
    eyebrow: { ru: 'Бережно · конфиденциально · онлайн', uz: 'Ehtiyot bilan · maxfiy · onlayn' },
    headline: {
      ru: 'Отношения снова идут по кругу?',
      uz: 'Munosabatlar yana aylanada ketyaptimi?',
    },
    sub: {
      ru: 'Откройте карту повторяющегося сценария за 60 секунд.',
      uz: 'Takrorlanuvchi stsenariy xaritasini 60 soniyada oching.',
    },
    micro: {
      ru: '7 коротких выборов · результат сразу · без оплаты на сайте · это не медицинская услуга',
      uz: '7 ta qisqa tanlov · natija darhol · saytda to‘lov yo‘q · bu tibbiy xizmat emas',
    },
    cta: { ru: 'Открыть карту сценария', uz: 'Stsenariy xaritasini ochish' },
    note: {
      ru: 'Это инструмент личной рефлексии. ALTYN Mirror — не медицинская услуга и не заменяет помощь специалиста.',
      uz: 'Bu shaxsiy mulohaza vositasi. ALTYN Mirror tibbiy xizmat emas va mutaxassis yordamining o‘rnini bosmaydi.',
    },
  },

  flow: {
    sceneOf: { ru: 'Сцена {n} из {total}', uz: 'Sahna {n} / {total}' },
    back: { ru: 'Назад', uz: 'Orqaga' },
    tapHint: { ru: 'Выберите вариант, который ближе всего', uz: 'Sizga eng yaqin variantni tanlang' },
    leave: {
      ru: 'Если станет неуютно — можно остановиться в любой момент.',
      uz: 'Noqulay bo‘lsa — istalgan vaqtda to‘xtashingiz mumkin.',
    },
  },

  result: {
    eyebrow: { ru: 'Ваша карта сценария', uz: 'Sizning stsenariy xaritangiz' },
    mapHeading: { ru: 'Карта динамики', uz: 'Dinamika xaritasi' },
    nodes: {
      start: { ru: 'Как начинается', uz: 'Qanday boshlanadi' },
      hold:  { ru: 'Что удерживает', uz: 'Nima ushlab turadi' },
      loop:  { ru: 'Где круг повторяется', uz: 'Aylana qayerda takrorlanadi' },
    },
    nuanceBadge: { ru: 'Нюанс', uz: 'Nyuans' },
    nuancePrefix: { ru: 'А также элементы сценария:', uz: 'Shuningdek, stsenariy elementlari:' },
    keyQuestion: { ru: 'Ключевой вопрос для разбора', uz: 'Tahlil uchun asosiy savol' },
    save: { ru: 'Сохранить карту', uz: 'Xaritani saqlash' },
    saved: { ru: 'Карта сохранена', uz: 'Xarita saqlandi' },
    saving: { ru: 'Сохранение…', uz: 'Saqlanmoqda…' },
    saveFail: { ru: 'Не получилось сохранить. Попробуйте ещё раз.', uz: 'Saqlab bo‘lmadi. Qayta urinib ko‘ring.' },
    retake: { ru: 'Пройти заново', uz: 'Qayta o‘tish' },

    offerTitle: { ru: 'Личный онлайн-разбор сценария', uz: 'Stsenariyning shaxsiy onlayn tahlili' },
    offerLine: { ru: 'Ваш сценарий можно посмотреть глубже на личном онлайн-разборе.', uz: 'Sizning stsenariyingizni shaxsiy onlayn tahlilda chuqurroq ko‘rish mumkin.' },
    offerMeta: { ru: '60 минут · 10$ · запись через Telegram-бот', uz: '60 daqiqa · 10$ · Telegram-bot orqali yozilish' },
    offerBullets: {
      ru: [
        'разложить, где именно запускается круг',
        'отделить факты от ожиданий',
        'увидеть первый спокойный шаг без давления',
      ],
      uz: [
        'aylana aynan qayerda boshlanishini tahlil qilish',
        'faktlarni kutishlardan ajratish',
        'bosimsiz birinchi xotirjam qadamni ko‘rish',
      ],
    },
    primaryCta: { ru: 'Открыть Telegram и сохранить результат', uz: 'Telegram’ni ochish va natijani saqlash' },
  },

  bridge: {
    title: { ru: 'Открываем Telegram-бот ALTYN', uz: 'ALTYN Telegram-bot ochilmoqda' },
    body: {
      ru: 'В Telegram сохранится ваша карта сценария и откроется следующий шаг.',
      uz: 'Telegram’da stsenariy xaritangiz saqlanadi va keyingi qadam ochiladi.',
    },
    open: { ru: 'Открыть Telegram', uz: 'Telegram’ni ochish' },
    fallback: {
      ru: 'Если Telegram не открылся — нажмите ещё раз или откройте ссылку вручную.',
      uz: 'Telegram ochilmasa — qayta bosing yoki havolani qo‘lda oching.',
    },
    safe: {
      ru: 'Это не медицинская услуга. Бережно и конфиденциально.',
      uz: 'Bu tibbiy xizmat emas. Ehtiyot bilan va maxfiy.',
    },
  },

  legal: {
    privacy: { ru: 'Конфиденциальность', uz: 'Maxfiylik' },
    terms:   { ru: 'Условия', uz: 'Shartlar' },
    contact: { ru: 'Контакты', uz: 'Aloqa' },
    disclaimer: { ru: 'Оговорка', uz: 'Ogohlantirish' },
    nonMedical: {
      ru: 'Это не медицинская услуга',
      uz: 'Bu tibbiy xizmat emas',
    },
  },

  langSwitcher: {
    label: { ru: 'Язык', uz: 'Til' },
  },
} as const;

export type UI = typeof ui;

export function t<T extends Record<string, { ru: string; uz: string }>>(
  obj: T, key: keyof T, lang: Lang
): string {
  return obj[key][lang] || obj[key].ru;
}

export function pick(value: { ru: string; uz: string } | undefined, lang: Lang): string {
  if (!value) return '';
  return value[lang] || value.ru;
}

export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_m, k) => String(vars[k] ?? ''));
}
