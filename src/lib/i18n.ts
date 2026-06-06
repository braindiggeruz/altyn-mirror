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

  markerCue: {
    mayatnik:  { ru: 'Отмечено: тепло возвращается', uz: 'Belgilandi: iliqlik qaytadi' },
    tuman:     { ru: 'Отмечено: туман ясности', uz: 'Belgilandi: aniqlik tumani' },
    dogonyayu: { ru: 'Отмечено: поиск ответа', uz: 'Belgilandi: javob izlash' },
    iskra:     { ru: 'Отмечено: резкая пауза', uz: 'Belgilandi: keskin pauza' },
    dver:      { ru: 'Отмечено: закрытая дверь', uz: 'Belgilandi: yopiq eshik' },
  },

  assembled: {
    line1: { ru: '7 маркеров соединены', uz: '7 marker birlashdi' },
    line2: { ru: 'Сценарий проявился', uz: 'Stsenariy namoyon bo‘ldi' },
    badge: { ru: 'Карта собрана', uz: 'Xarita yig‘ildi' },
  },

  result: {
    eyebrow: { ru: 'Ваша карта сценария', uz: 'Sizning stsenariy xaritangiz' },

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

    // V3 — Scenario Passport
    passportEyebrow:  { ru: 'Сценарный паспорт', uz: 'Stsenariy pasporti' },
    passportSerial:   { ru: 'Карта № {token} · {date}', uz: 'Xarita № {token} · {date}' },
    bringHeading:     { ru: 'Что взять на личный разбор', uz: 'Shaxsiy tahlilga olib borish kerak' },
    firstStepHeading: { ru: 'Первый спокойный шаг', uz: 'Birinchi xotirjam qadam' },
    passportStamp:    { ru: 'Только для личной рефлексии', uz: 'Faqat shaxsiy mulohaza uchun' },

    // V3 — Persuasive session preview
    sessionTitle: { ru: 'Что будет на личном онлайн-разборе', uz: 'Shaxsiy onlayn tahlilda nima bo‘ladi' },
    sessionSteps: {
      ru: [
        { t: '1 · Сверим карту', d: 'Посмотрим вашу карту сценария вместе и уточним, что в ней откликнулось.' },
        { t: '2 · Разложим узел', d: 'Разделим факты и ожидания в самой сильной точке — без оценок и ярлыков.' },
        { t: '3 · Один шаг', d: 'Сформулируем первый спокойный шаг, который реально подходит вам сейчас.' },
      ],
      uz: [
        { t: '1 · Xaritani tekshiramiz', d: 'Stsenariy xaritangizni birgalikda ko‘rib, nima aks etganini aniqlaymiz.' },
        { t: '2 · Tugunni yechamiz', d: 'Eng kuchli nuqtada faktlar va kutishlarni — bahosiz, yorliqsiz ajratamiz.' },
        { t: '3 · Bitta qadam', d: 'Sizga hozir aynan mos keladigan birinchi xotirjam qadamni tuzamiz.' },
      ],
    },

    // V3 — Reassurance chips
    reassureTitle: { ru: 'Бережно и спокойно', uz: 'Ehtiyot bilan va xotirjam' },
    reassureChips: {
      ru: [
        '60 минут онлайн',
        'без оплаты на сайте',
        'конфиденциально',
        'без давления',
        'это не медицинская услуга',
      ],
      uz: [
        '60 daqiqa onlayn',
        'saytda to‘lov yo‘q',
        'maxfiy',
        'bosimsiz',
        'bu tibbiy xizmat emas',
      ],
    },

    // V3 — Continuation promise above CTA
    continuation: {
      ru: 'В Telegram вы не начнёте заново — карта продолжится отсюда.',
      uz: 'Telegram’da qaytadan boshlamaysiz — xarita shu yerdan davom etadi.',
    },

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
    primaryCta: { ru: 'Открыть Telegram и продолжить карту', uz: 'Telegram’ni ochib, xaritani davom ettirish' },
  },

  modal: {
    title: { ru: 'Карта готова', uz: 'Xarita tayyor' },
    body:  {
      ru: 'В Telegram вы не начнёте заново — карта продолжится отсюда. Откроются 3 коротких вопроса и, по желанию, запись на личный онлайн-разбор.',
      uz: 'Telegram’da qaytadan boshlamaysiz — xarita shu yerdan davom etadi. 3 ta qisqa savol va, xohishingiz bilan, shaxsiy onlayn tahlilga yozilish ochiladi.',
    },
    rowScenario:  { ru: 'Сценарий',         uz: 'Stsenariy' },
    rowNuance:    { ru: 'Оттенок',          uz: 'Tus' },
    rowKey:       { ru: 'Ключевой вопрос',  uz: 'Asosiy savol' },
    primary:      { ru: 'Открыть Telegram с моей картой', uz: 'Telegram’ni xaritam bilan ochish' },
    secondary:    { ru: 'Вернуться к карте', uz: 'Xaritaga qaytish' },
  },

  bridge: {
    eyebrow:      { ru: 'Карта собрана', uz: 'Xarita yig‘ildi' },
    titlePersonal:{ ru: 'Ваша карта продолжится в Telegram', uz: 'Xaritangiz Telegram’da davom etadi' },
    titleGeneric: { ru: 'Открываем Telegram-бот ALTYN', uz: 'ALTYN Telegram-bot ochilmoqda' },
    promise: {
      ru: 'Вы не начнёте заново. Бот узнает вашу карту по номеру и продолжит шаги отсюда.',
      uz: 'Qaytadan boshlamaysiz. Bot xaritangizni raqami bo‘yicha taniydi va shu yerdan davom etadi.',
    },
    genericBody: {
      ru: 'Если вы переходите впервые — лучше сначала собрать карту: это займёт около минуты.',
      uz: 'Birinchi marta o‘tayotgan bo‘lsangiz — avval xaritani yig‘ib oling: bu bir daqiqa vaqt oladi.',
    },
    stepsHeading: { ru: 'Что произойдёт после нажатия', uz: 'Bosishdan keyin nima bo‘ladi' },
    steps: {
      ru: [
        'Откроется @altyntherapybot',
        'Бот увидит номер вашей карты',
        '3 коротких вопроса · по желанию — запись на разбор',
      ],
      uz: [
        '@altyntherapybot ochiladi',
        'Bot xaritangiz raqamini ko‘radi',
        '3 ta qisqa savol · xohishga ko‘ra — tahlilga yozilish',
      ],
    },
    cardLabel:     { ru: 'Карта № {token}', uz: 'Xarita № {token}' },
    rowScenario:   { ru: 'Сценарий',        uz: 'Stsenariy' },
    rowNuance:     { ru: 'Оттенок',         uz: 'Tus' },
    rowKey:        { ru: 'Ключевой вопрос', uz: 'Asosiy savol' },
    open:          { ru: 'Открыть Telegram', uz: 'Telegram’ni ochish' },
    openFirst:     { ru: 'Сначала собрать карту', uz: 'Avval xaritani yig‘ish' },
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
