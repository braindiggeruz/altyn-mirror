import type { Lang } from './types';

export const DEFAULT_LANG: Lang = 'ru';

export const ui = {
  brand: { ru: 'ALTYN Mirror', uz: 'ALTYN Mirror' },
  tagline: { ru: 'Карта повторяющегося сценария', uz: 'Takrorlanuvchi stsenariy xaritasi' },

  hero: {
    eyebrow: { ru: 'Бережно · конфиденциально', uz: 'Ehtiyot bilan · maxfiy' },
    headline: {
      ru: 'Отношения снова идут по кругу?',
      uz: 'Munosabatlar yana aylanada ketyaptimi?',
    },
    sub: {
      ru: 'За 60 секунд ALTYN Mirror соберёт карту вашего сценария: где он начинается, что его держит и какой вопрос разложить дальше.',
      uz: '60 soniyada ALTYN Mirror stsenariyingiz xaritasini yig‘adi: u qayerda boshlanadi, nima ushlab turadi va qaysi savolni keyin tahlil qilish kerak.',
    },
    micro: {
      ru: '7 коротких выборов · результат сразу · без оплаты на сайте',
      uz: '7 ta qisqa tanlov · natija darhol · saytda to‘lov yo‘q',
    },
    trust: {
      ru: 'Конфиденциально · переход в Telegram только по вашему желанию · это не медицинская услуга',
      uz: 'Maxfiy · Telegram’ga o‘tish faqat xohishingiz bilan · bu tibbiy xizmat emas',
    },
    cta: { ru: 'Открыть карту сценария', uz: 'Stsenariy xaritasini ochish' },
    note: {
      ru: 'Это инструмент личной рефлексии. ALTYN Mirror — не медицинская услуга и не заменяет помощь специалиста.',
      uz: 'Bu shaxsiy mulohaza vositasi. ALTYN Mirror tibbiy xizmat emas va mutaxassis yordamining o‘rnini bosmaydi.',
    },
  },

  returningChip: {
    text: {
      ru: 'Карта № {token} собрана — продолжить в Telegram →',
      uz: 'Xarita № {token} yig‘ilgan — Telegram’da davom etish →',
    },
  },

  intro: {
    line1: { ru: 'Сейчас зеркало соберёт не оценку, а карту динамики.', uz: 'Hozir oyna baho emas, dinamika xaritasini yig‘adi.' },
    line2: { ru: 'Выберите то, что ближе всего к знакомому сценарию.', uz: 'Sizga eng tanish stsenariyga yaqin variantni tanlang.' },
    cue:   { ru: 'Зеркало открывается…', uz: 'Oyna ochilmoqda…' },
    enter: { ru: 'Войти в зеркало', uz: 'Oynaga kirish' },
    skip:  { ru: 'пропустить ритуал', uz: 'marosimni o‘tkazib yuborish' },
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

    // V5: assembled chip
    assembledBy7: {
      ru: 'Карта собрана по 7 маркерам · {date}',
      uz: 'Xarita 7 marker bo‘yicha yig‘ildi · {date}',
    },

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
    passportStamp:    { ru: 'Только для личной рефлексии', uz: 'Faqat shaxsiy mulohaza uchun' },

    // V5 — “Это значит / Это не значит”
    meaningTitle:  { ru: 'Что это значит и что это не значит', uz: 'Bu nimani bildiradi va nimani bildirmaydi' },
    meaningIsHeading: { ru: 'Это значит', uz: 'Bu shuni bildiradi' },
    meaningIsItems: {
      ru: [
        'ваши ответы сложились в эту динамику',
        'карта показывает, где замыкается круг',
        'виден один вопрос, который можно разложить дальше',
      ],
      uz: [
        'javoblaringiz shu dinamikani shakllantirdi',
        'xarita aylana qayerda yopilishini ko‘rsatadi',
        'keyin tahlil qilish mumkin bo‘lgan bitta savol ko‘rinadi',
      ],
    },
    meaningIsNotHeading: { ru: 'Это не значит', uz: 'Bu shuni bildirmaydi' },
    meaningIsNotItems: {
      ru: [
        'это не ярлык',
        'это не вывод о вас как о человеке',
        'это не призыв принимать срочные решения',
        'это не медицинская услуга',
      ],
      uz: [
        'bu yorliq emas',
        'bu siz haqingizda xulosa emas',
        'bu shoshilinch qaror qabul qilishga chaqiriq emas',
        'bu tibbiy xizmat emas',
      ],
    },

    // V5 — Personal prep block
    prepTitle:    { ru: 'Что взять на разбор', uz: 'Tahlilga olib borish kerak' },
    prepSubtitle: {
      ru: 'Три вопроса, с которых можно начать личный онлайн-разбор.',
      uz: 'Shaxsiy onlayn tahlilni boshlash mumkin bo‘lgan uchta savol.',
    },
    prepCta: {
      ru: 'Забрать эти вопросы в Telegram →',
      uz: 'Bu savollarni Telegram’ga olib o‘tish →',
    },

    // V5 — First calm step (separate block)
    firstStepHeading: { ru: 'Первый спокойный шаг', uz: 'Birinchi xotirjam qadam' },

    // V5 — Personalized offer block
    personalizedOfferTitle: {
      ru: 'Что будет на разборе по «{scenario}»',
      uz: '«{scenario}» bo‘yicha tahlilda nima bo‘ladi',
    },
    personalizedOfferFooter: {
      ru: '60 минут онлайн · 10$ · без оплаты на сайте',
      uz: '60 daqiqa onlayn · 10$ · saytda to‘lov yo‘q',
    },
    personalizedOfferBooking: {
      ru: 'Запись через Telegram-бот @altyntherapybot',
      uz: 'Yozilish @altyntherapybot Telegram-bot orqali',
    },
    personalizedOfferPayment: {
      ru: 'Оплата принимается после разбора — Click, Payme или удобный перевод. Это не медицинская услуга.',
      uz: 'To‘lov tahlildan keyin qabul qilinadi — Click, Payme yoki qulay o‘tkazma. Bu tibbiy xizmat emas.',
    },

    // V3 — Reassurance chips
    reassureTitle: { ru: 'Бережно и спокойно', uz: 'Ehtiyot bilan va xotirjam' },
    reassureChips: {
      ru: [
        '60 минут онлайн',
        '10$',
        'без оплаты на сайте',
        'запись через Telegram',
        'конфиденциально',
        'без давления',
      ],
      uz: [
        '60 daqiqa onlayn',
        '10$',
        'saytda to‘lov yo‘q',
        'Telegram orqali yozilish',
        'maxfiy',
        'bosimsiz',
      ],
    },

    // V5 — Continuation promise (token-aware)
    continuationTokened: {
      ru: 'В Telegram вы не начнёте заново — карта № {token} продолжится отсюда.',
      uz: 'Telegram’da qaytadan boshlamaysiz — xarita № {token} shu yerdan davom etadi.',
    },
    continuation: {
      ru: 'В Telegram вы не начнёте заново — карта продолжится отсюда.',
      uz: 'Telegram’da qaytadan boshlamaysiz — xarita shu yerdan davom etadi.',
    },

    save:        { ru: 'Сохранить карту', uz: 'Xaritani saqlash' },
    saving:      { ru: 'Собираем карту…',                  uz: 'Xarita yig‘ilmoqda…' },
    saved:       { ru: 'Карта сохранена в загрузки',       uz: 'Xarita yuklab olinganlarga saqlandi' },
    saveFail:    { ru: 'Не получилось сохранить — сделайте скриншот карты', uz: 'Saqlab bo‘lmadi — xarita skrinshotini oling' },
    retake:      { ru: 'Пройти заново', uz: 'Qayta o‘tish' },

    primaryCta: { ru: 'Продолжить карту в Telegram →', uz: 'Telegram’da xaritani davom ettirish →' },
    stickyCta:  { ru: 'Продолжить в Telegram →', uz: 'Telegram’da davom etish →' },
  },

  modal: {
    title: { ru: 'Карта готова', uz: 'Xarita tayyor' },
    body:  {
      ru: 'Вы переходите в Telegram с собранной картой — она продолжится с того места, где вы сейчас. Никаких повторов.',
      uz: 'Yig‘ilgan xarita bilan Telegram’ga o‘tasiz — u hozirgi joyingizdan davom etadi. Hech qanday takror yo‘q.',
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
      ru: 'Вы переходите в Telegram с собранной картой — она продолжится с того места, где вы сейчас. Никаких повторов.',
      uz: 'Yig‘ilgan xarita bilan Telegram’ga o‘tasiz — u hozirgi joyingizdan davom etadi. Hech qanday takror yo‘q.',
    },
    genericBody: {
      ru: 'Если вы переходите впервые — лучше сначала собрать карту: это займёт около минуты.',
      uz: 'Birinchi marta o‘tayotgan bo‘lsangiz — avval xaritani yig‘ib oling: bu bir daqiqa vaqt oladi.',
    },
    stepsHeading: { ru: 'Что произойдёт после нажатия', uz: 'Bosishdan keyin nima bo‘ladi' },
    steps: {
      ru: [
        'Откроется @altyntherapybot',
        'Вы продолжите с того места, где сейчас',
        '3 коротких вопроса · по желанию — запись на разбор',
      ],
      uz: [
        '@altyntherapybot ochiladi',
        'Hozirgi joyingizdan davom etasiz',
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
    notOpened:    { ru: 'Не открылось?', uz: 'Ochilmadimi?' },
    copyLink:     { ru: 'Скопировать ссылку на бот', uz: 'Bot havolasini nusxalash' },
    copyOk:       { ru: 'Ссылка скопирована', uz: 'Havola nusxalandi' },
    copyFail:     { ru: 'Не удалось скопировать. Нажмите и удерживайте ссылку, чтобы скопировать вручную.', uz: 'Nusxalab bo‘lmadi. Havolani bosib turing va qo‘lda nusxalang.' },
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
