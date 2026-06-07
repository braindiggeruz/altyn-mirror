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
      ru: 'За пару минут ALTYN Mirror соберёт карту вашего сценария: где он начинается, что его держит и какой вопрос разложить дальше.',
      uz: 'Bir necha daqiqada ALTYN Mirror stsenariyingiz xaritasini yig‘adi: u qayerda boshlanadi, nima ushlab turadi va qaysi savolni keyin tahlil qilish kerak.',
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
      ru: 'Карта № {token} собрана — написать Алтын →',
      uz: 'Xarita № {token} yig‘ilgan — Altyn’ga yozish →',
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
      ru: 'Отправить вопросы Алтын →',
      uz: 'Savollarni Altyn’ga yuborish →',
    },

    // V6 — “Что уже видно по карте”
    whatsVisibleTitle: { ru: 'Что уже видно по карте', uz: 'Xaritada nimalar ko‘rinmoqda' },
    whatsVisibleIntro: {
      ru: 'По вашим ответам карта показывает:',
      uz: 'Javoblaringizga ko‘ra xarita quyidagilarni ko‘rsatadi:',
    },

    // V6 — “Где проверить факты”
    factsTitle: { ru: 'Где проверить факты', uz: 'Faktlarni qayerda tekshirish kerak' },
    factsIntro: {
      ru: 'Перед разбором полезно выписать не всю историю, а три короткие строки:',
      uz: 'Tahlildan oldin butun hikoyani emas, uchta qisqa qator yozish foydali:',
    },
    factsItems: {
      ru: [
        'Что точно произошло?',
        'Что вы предполагаете?',
        'Какой вопрос повторяется внутри?',
      ],
      uz: [
        'Aniq nima sodir bo‘ldi?',
        'Nimani taxmin qilyapsiz?',
        'Ichingizda qaysi savol takrorlanadi?',
      ],
    },

    // V6 — “Что лучше не делать сразу после карты”
    dontDoTitle: { ru: 'Что лучше не делать сразу после карты', uz: 'Xaritadan keyin darhol qilmaslik kerak' },
    dontDoBody: {
      ru: 'Не принимайте резких решений только из результата. Карта — это не ярлык, а способ спокойно увидеть динамику. Если откликнулось, лучше взять один эпизод и разложить его на личном онлайн-разборе.',
      uz: 'Faqat natija asosida keskin qarorlar qabul qilmang. Xarita — bu yorliq emas, bu dinamikani xotirjam ko‘rish usuli. Agar aks-sado bersa, bitta lahzani olib, uni shaxsiy onlayn tahlilda ko‘rib chiqish yaxshi.',
    },

    // V6 — Continuation copy that points at Алтын directly
    continueWithAltyn: {
      ru: 'Если хотите понять, где именно этот сценарий повторился в вашей истории, карта может продолжиться с Алтын в Telegram.',
      uz: 'Bu stsenariy sizning hikoyangizda aynan qayerda takrorlanganini tushunmoqchi bo‘lsangiz, xarita Telegram’da Altyn bilan davom etishi mumkin.',
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

    // V6 — Personalized offer extras
    personalizedOfferNoRetest: {
      ru: 'На разборе вы не будете проходить тест заново. Вы начнёте с уже собранной карты.',
      uz: 'Tahlilda testni qayta o‘tmaysiz. Allaqachon yig‘ilgan xaritadan boshlaysiz.',
    },

    save:        { ru: 'Сохранить карту', uz: 'Xaritani saqlash' },
    saving:      { ru: 'Собираем карту…',                  uz: 'Xarita yig‘ilmoqda…' },
    saved:       { ru: 'Карта сохранена в загрузки',       uz: 'Xarita yuklab olinganlarga saqlandi' },
    saveFail:    { ru: 'Не получилось сохранить — сделайте скриншот карты', uz: 'Saqlab bo‘lmadi — xarita skrinshotini oling' },
    retake:      { ru: 'Пройти заново', uz: 'Qayta o‘tish' },

    // V6 — Primary CTA points at Алтын directly. Secondary keeps bot path alive.
    primaryCta:       { ru: 'Скопировать сообщение и открыть Telegram →', uz: 'Xabarni nusxalab Telegram’ni ochish →' },
    primaryCtaHint: {
      ru: 'Сообщение для Алтын скопируется автоматически — останется вставить и отправить.',
      uz: 'Altyn uchun xabar avtomatik nusxalanadi — joylashtirib yuborish qoladi.',
    },
    secondaryBotCta:  { ru: 'Не готовы писать в личку? Открыть Telegram-бот →', uz: 'Shaxsiy yozishga tayyor emasmisiz? Telegram-botni ochish →' },
    stickyCta:        { ru: 'Скопировать и открыть Telegram →', uz: 'Nusxalab Telegram’ni ochish →' },

    // PR-1 — 3-step instruction shown ABOVE the primary CTA so the user knows
    // exactly what will happen after the click (clipboard + deep-link to Алтын).
    instructionTitle: {
      ru: 'Что произойдёт после клика',
      uz: 'Bosishdan keyin nima bo‘ladi',
    },
    instructionStep1: {
      ru: 'Сообщение для Алтын скопируется автоматически',
      uz: 'Altyn uchun xabar avtomatik nusxalanadi',
    },
    instructionStep2: {
      ru: 'Откроется чат с @Altyn2304',
      uz: '@Altyn2304 bilan chat ochiladi',
    },
    instructionStep3: {
      ru: 'Удерживайте поле ввода → Вставить → Отправить',
      uz: 'Kiritish maydonini bosib turing → Joylashtirish → Yuborish',
    },

    // PR-1 — toast shown for ~2.4s right after the user taps the primary CTA.
    // Pure UI confirmation, no analytics side-effects.
    copyToast: {
      ru: '📋 Сообщение скопировано — вставьте в Telegram',
      uz: '📋 Xabar nusxalandi — Telegram’ga joylashtiring',
    },

    // PR-3 — Soft banner shown inside Instagram / FBAV / FBAN / Line in-app
    // browsers where the t.me deep-link is unreliable. Offers a copy-link
    // fallback so the user can paste the URL into Safari/Chrome.
    igBannerTitle: {
      ru: 'Telegram может не открыться из встроенного браузера',
      uz: 'Telegram ichki brauzerdan ochilmasligi mumkin',
    },
    igBannerBody: {
      ru: 'Откройте страницу в Safari или Chrome — или скопируйте ссылку на Алтын и вставьте в адресную строку.',
      uz: 'Sahifani Safari yoki Chrome’da oching — yoki Altyn havolasini nusxalab manzil satriga joylashtiring.',
    },
    igBannerCopyCta: {
      ru: 'Скопировать ссылку на Алтын',
      uz: 'Altyn havolasini nusxalash',
    },
    igBannerCopiedToast: {
      ru: '🔗 Ссылка скопирована — вставьте в Safari/Chrome',
      uz: '🔗 Havola nusxalandi — Safari/Chrome’ga joylashtiring',
    },

    // V6.1 — On-page copy-ready message block (so the user can copy before tapping the CTA).
    msgTitle: { ru: 'Готовое сообщение для Алтын', uz: 'Altyn uchun tayyor xabar' },
    msgSubtitle: {
      ru: 'Это сообщение мы подставим в буфер обмена, когда вы нажмёте кнопку. Можно скопировать заранее.',
      uz: 'Bu xabar tugmani bosganingizda almashish buferiga joylashtiriladi. Oldindan ham nusxalashingiz mumkin.',
    },
    msgCopy:    { ru: 'Скопировать сообщение', uz: 'Xabarni nusxalash' },
    msgCopied:  { ru: 'Сообщение скопировано', uz: 'Xabar nusxalandi' },
    msgCopyFail:{ ru: 'Не удалось скопировать. Выделите текст и скопируйте вручную.', uz: 'Nusxalab bo‘lmadi. Matnni belgilang va qo‘lda nusxalang.' },

    // V6.1 — Inline fallback if Telegram didn't open
    tgNotOpened: {
      ru: 'Если Telegram не открылся — нажмите ещё раз или скопируйте ссылку.',
      uz: 'Telegram ochilmadi — qayta bosing yoki havolani nusxalang.',
    },
    copyOwnerLink: { ru: 'Скопировать ссылку на Алтын', uz: 'Altyn havolasini nusxalash' },
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

    // V6 — Owner direct bridge
    titleOwner: { ru: 'Карта готова — можно написать Алтын', uz: 'Xarita tayyor — Altyn’ga yozsa bo‘ladi' },
    bodyOwner: {
      ru: 'Вы переходите в Telegram с уже собранной картой. Скопируйте короткое сообщение ниже или просто напишите Алтын, что хотите разобрать карту.',
      uz: 'Yig‘ilgan xarita bilan Telegram’ga o‘tasiz. Quyidagi qisqa xabarni nusxalang yoki Altyn’ga xaritani tahlil qilmoqchi ekanligingizni yozing.',
    },
    messageHeading: { ru: 'Готовое сообщение для копирования', uz: 'Nusxa olish uchun tayyor xabar' },
    messageTemplate: {
      ru: 'Здравствуйте, Алтын. Я прошла ALTYN Mirror. Моя карта: «{scenario}», оттенок: «{secondary}». Главный вопрос: «{keyQuestion}». Хочу узнать про личный онлайн-разбор 60 минут за 10$.',
      uz: 'Assalomu alaykum, Altyn. Men ALTYN Mirror’dan o‘tdim. Mening xaritam: «{scenario}», tus: «{secondary}». Asosiy savol: «{keyQuestion}». Shaxsiy 60 daqiqalik 10$ onlayn tahlil haqida bilmoqchiman.',
    },
    primaryOwner: { ru: 'Написать Алтын в Telegram →', uz: 'Altyn’ga Telegram’da yozish →' },
    copyMessage:  { ru: 'Скопировать сообщение', uz: 'Xabarni nusxalash' },
    copiedMessage:{ ru: 'Сообщение скопировано', uz: 'Xabar nusxalandi' },
    openBotInstead: { ru: 'Открыть Telegram-бот вместо этого', uz: 'Buning o‘rniga Telegram-botni ochish' },

    // V5/legacy — Personal bot bridge (kept as fallback)
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
    copyLink:     { ru: 'Скопировать ссылку на Алтын', uz: 'Altyn havolasini nusxalash' },
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
