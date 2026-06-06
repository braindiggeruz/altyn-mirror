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
      ru: 'ALTYN Mirror соберёт вашу карту сценария за 60 секунд: где начинается круг, что его удерживает и какой вопрос стоит разложить глубже.',
      uz: 'ALTYN Mirror 60 soniyada stsenariyingiz xaritasini yig‘adi: aylana qayerda boshlanadi, uni nima ushlab turadi va qaysi savolni chuqurroq tahlil qilish kerak.',
    },
    micro: {
      ru: '7 коротких выборов · результат сразу · без оплаты на сайте · это не медицинская услуга',
      uz: '7 ta qisqa tanlov · natija darhol · saytda to‘lov yo‘q · bu tibbiy xizmat emas',
    },
    trust: {
      ru: 'Конфиденциально · без регистрации · переход в Telegram только по желанию',
      uz: 'Maxfiy · ro‘yxatdan o‘tishsiz · Telegram’ga o‘tish faqat xohishingiz bilan',
    },
    cta: { ru: 'Открыть карту сценария', uz: 'Stsenariy xaritasini ochish' },
    note: {
      ru: 'Это инструмент личной рефлексии. ALTYN Mirror — не медицинская услуга и не заменяет помощь специалиста.',
      uz: 'Bu shaxsiy mulohaza vositasi. ALTYN Mirror tibbiy xizmat emas va mutaxassis yordamining o‘rnini bosmaydi.',
    },
  },

  intro: {
    line1: { ru: 'Сейчас зеркало соберёт не оценку, а карту динамики.', uz: 'Hozir oyna baho emas, dinamika xaritasini yig‘adi.' },
    line2: { ru: 'Выберите то, что ближе всего к знакомому сценарию.', uz: 'Sizga eng tanish stsenariyga yaqin variantni tanlang.' },
    cue:   { ru: 'Зеркало открывается…', uz: 'Oyna ochilmoqda…' },
    skip:  { ru: 'Пропустить', uz: 'O‘tkazib yuborish' },
  },

  flow: {
    sceneOf: { ru: 'Сцена {n} из {total}', uz: 'Sahna {n} / {total}' },
    back: { ru: 'Назад', uz: 'Orqaga' },
    tapHint: { ru: 'Выберите вариант, который ближе всего', uz: 'Sizga eng yaqin variantni tanlang' },
    leave: {
      ru: 'Если станет неуютно — можно остановиться в любой момент.',
      uz: 'Noqulay bo‘lsa — istalgan vaqtda to‘xtashingiz mumkin.',
    },
    mapAssembling: { ru: 'Карта собирается… {done} из {total} маркеров отмечены', uz: 'Xarita yig‘ilmoqda… {done}/{total} marker belgilandi' },
  },

  // micro-confirm text after each answer, by result key
  markerCue: {
    mayatnik:  { ru: 'Отмечено: тепло возвращается', uz: 'Belgilandi: iliqlik qaytadi' },
    tuman:     { ru: 'Отмечено: туман ясности', uz: 'Belgilandi: aniqlik tumani' },
    dogonyayu: { ru: 'Отмечено: поиск ответа', uz: 'Belgilandi: javob izlash' },
    iskra:     { ru: 'Отмечено: резкая пауза', uz: 'Belgilandi: keskin pauza' },
    dver:      { ru: 'Отмечено: закрытая дверь', uz: 'Belgilandi: yopiq eshik' },
  },

  // final transition before result
  assembled: {
    line1: { ru: '7 маркеров соединены', uz: '7 marker birlashdi' },
    line2: { ru: 'Сценарий проявился', uz: 'Stsenariy namoyon bo‘ldi' },
    badge: { ru: 'Карта собрана', uz: 'Xarita yig‘ildi' },
  },

  result: {
    eyebrow: { ru: 'Ваша карта сценария', uz: 'Sizning stsenariy xaritangiz' },

    // Premium "scenario map" card above the description
    cardTitle:     { ru: 'Ваша карта сценария', uz: 'Sizning stsenariy xaritangiz' },
    cardPrimary:   { ru: 'Главный сценарий',     uz: 'Asosiy stsenariy' },
    cardSecondary: { ru: 'Второй оттенок',       uz: 'Ikkinchi tus' },
    cardEntry:     { ru: 'Точка входа',          uz: 'Kirish nuqtasi' },
    cardHold:      { ru: 'Точка удержания',      uz: 'Ushlab turish nuqtasi' },
    cardLoop:      { ru: 'Точка повтора',        uz: 'Takror nuqtasi' },
    cardKey:       { ru: 'Главный вопрос',       uz: 'Asosiy savol' },

    markersHeading: { ru: 'В вашей карте выделились 3 маркера', uz: 'Sizning xaritangizda 3 ta marker ajralib turdi' },

    mapHeading: { ru: 'Карта динамики', uz: 'Dinamika xaritasi' },
    nodes: {
      start: { ru: 'Как начинается', uz: 'Qanday boshlanadi' },
      hold:  { ru: 'Что удерживает', uz: 'Nima ushlab turadi' },
      loop:  { ru: 'Где круг повторяется', uz: 'Aylana qayerda takrorlanadi' },
    },
    nuanceBadge: { ru: 'Нюанс', uz: 'Nyuans' },
    keyQuestion: { ru: 'Ключевой вопрос для разбора', uz: 'Tahlil uchun asosiy savol' },

    save:        { ru: 'Сохранить карту как изображение', uz: 'Xaritani rasm sifatida saqlash' },
    saving:      { ru: 'Собираем карту…',                  uz: 'Xarita yig‘ilmoqda…' },
    saved:       { ru: 'Карта сохранена в загрузки',       uz: 'Xarita yuklab olinganlarga saqlandi' },
    saveFail:    { ru: 'Не получилось сохранить — сделайте скриншот карты', uz: 'Saqlab bo‘lmadi — xarita skrinshotini oling' },
    retake:      { ru: 'Пройти заново', uz: 'Qayta o‘tish' },

    offerTitle: { ru: 'Личный онлайн-разбор сценария', uz: 'Stsenariyning shaxsiy onlayn tahlili' },
    offerLine:  { ru: 'Ваш сценарий можно посмотреть глубже на личном онлайн-разборе.', uz: 'Sizning stsenariyingizni shaxsiy onlayn tahlilda chuqurroq ko‘rish mumkin.' },
    offerMeta:  { ru: '60 минут · 10$ · запись через Telegram-бот', uz: '60 daqiqa · 10$ · Telegram-bot orqali yozilish' },
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

  modal: {
    title: { ru: 'Карта готова', uz: 'Xarita tayyor' },
    body:  {
      ru: 'В Telegram откроется ваш результат и следующий шаг: 3 вопроса, которые помогут подготовиться к личному онлайн-разбору.',
      uz: 'Telegram’da natijangiz va keyingi qadam ochiladi: shaxsiy onlayn tahlilga tayyorgarlik uchun 3 ta savol.',
    },
    rowScenario:  { ru: 'Сценарий',         uz: 'Stsenariy' },
    rowNuance:    { ru: 'Оттенок',          uz: 'Tus' },
    rowKey:       { ru: 'Ключевой вопрос',  uz: 'Asosiy savol' },
    primary:      { ru: 'Открыть Telegram с моей картой', uz: 'Telegram’ni xaritam bilan ochish' },
    secondary:    { ru: 'Вернуться к карте', uz: 'Xaritaga qaytish' },
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
    nonMedical: { ru: 'Это не медицинская услуга', uz: 'Bu tibbiy xizmat emas' },
  },

  langSwitcher: {
    label: { ru: 'Язык', uz: 'Til' },
  },

  shareCardDisclaimer: {
    ru: 'Рабочая карта динамики, не ярлык и не вывод о человеке.',
    uz: 'Dinamikaning ishchi xaritasi, yorliq yoki inson haqida xulosa emas.',
  },
} as const;

export type UI = typeof ui;

export function pick(value: { ru: string; uz: string } | undefined, lang: Lang): string {
  if (!value) return '';
  return value[lang] || value.ru;
}

export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_m, k) => String(vars[k] ?? ''));
}
