import type { ResultData, ResultKey } from './types';

export const RESULT_KEYS: ResultKey[] = ['mayatnik', 'tuman', 'dogonyayu', 'iskra', 'dver'];

export const RESULTS: Record<ResultKey, ResultData> = {
  mayatnik: {
    key: 'mayatnik',
    title: { ru: 'Маятник тепла', uz: 'Iliqlik mayatnigi' },
    description: {
      ru: 'В ответах чаще проявился сценарий «Маятник тепла». Здесь круг держится не на ровности, а на моментах, когда тепло возвращается и снова включает надежду. Важно посмотреть, где внимание начинает заменять ясность.',
      uz: 'Javoblarda ko‘proq «Iliqlik mayatnigi» stsenariysi namoyon bo‘ldi. Bu yerda aylana tekislik emas, balki iliqlik qaytib, umidni yana yoqib yuboradigan lahzalarga tayanadi. Diqqat aniqlikni qayerda almashtira boshlashini ko‘rib chiqish muhim.',
    },
    map: {
      start: { ru: 'через тепло и быстрое сближение', uz: 'iliqlik va tez yaqinlashish orqali' },
      hold:  { ru: 'редкие моменты возвращения', uz: 'qaytishning kam uchraydigan lahzalari' },
      loop:  { ru: 'когда тёплый эпизод снова запускает круг', uz: 'iliq lahza yana aylanani ishga tushirganda' },
    },
    keyQuestion: {
      ru: 'Где именно редкое тепло становится сильнее фактов?',
      uz: 'Kamdan-kam iliqlik aynan qayerda faktlardan kuchliroq bo‘ladi?',
    },
    cta: { ru: 'Разложить маятник в Telegram', uz: 'Mayatnikni Telegram’da tahlil qilish' },
  },
  tuman: {
    key: 'tuman',
    title: { ru: 'Туман без ясности', uz: 'Aniqliksiz tuman' },
    description: {
      ru: 'В ответах чаще проявился сценарий «Туман без ясности». Здесь напряжение рождается не из резкого конфликта, а из неопределённости. Связь как будто есть, но опоры у неё мало.',
      uz: 'Javoblarda ko‘proq «Aniqliksiz tuman» stsenariysi namoyon bo‘ldi. Bu yerda taranglik keskin to‘qnashuvdan emas, noaniqlikdan tug‘iladi. Aloqa go‘yo bor, lekin uning tayanchi kam.',
    },
    map: {
      start: { ru: 'спокойно, но без полной формы', uz: 'tinch, lekin to‘liq shaklsiz' },
      hold:  { ru: 'надежда, что скоро станет понятнее', uz: 'tez orada tushunarli bo‘lishiga umid' },
      loop:  { ru: 'когда факты смешиваются с ожиданием', uz: 'faktlar kutish bilan aralashganda' },
    },
    keyQuestion: {
      ru: 'Где заканчиваются факты и начинается ожидание?',
      uz: 'Faktlar qayerda tugaydi va kutish qayerda boshlanadi?',
    },
    cta: { ru: 'Разложить туман в Telegram', uz: 'Tumanni Telegram’da tahlil qilish' },
  },
  dogonyayu: {
    key: 'dogonyayu',
    title: { ru: 'Догоняю ответ', uz: 'Javob ortidan quvaman' },
    description: {
      ru: 'В ответах чаще проявился сценарий «Догоняю ответ». Когда история становится неясной, появляется желание быстро вернуть определённость. Круг может держаться на попытке получить ясность там, где её пока не дают.',
      uz: 'Javoblarda ko‘proq «Javob ortidan quvaman» stsenariysi namoyon bo‘ldi. Hikoya noaniq bo‘lganda, tezda aniqlikni qaytarish istagi paydo bo‘ladi. Aylana hali aniqlik berilmagan joyda uni olishga urinishga tayanishi mumkin.',
    },
    map: {
      start: { ru: 'через желание понять, что происходит', uz: 'nima sodir bo‘layotganini tushunish istagi orqali' },
      hold:  { ru: 'потребность в прямом ответе', uz: 'to‘g‘ridan-to‘g‘ri javobga ehtiyoj' },
      loop:  { ru: 'когда контакт превращается в попытку всё прояснить', uz: 'aloqa hammasini oydinlashtirish urinishiga aylanganda' },
    },
    keyQuestion: {
      ru: 'Где контакт превращается в погоню за ответом?',
      uz: 'Aloqa qayerda javob ortidan quvishga aylanadi?',
    },
    cta: { ru: 'Открыть личный маршрут', uz: 'Shaxsiy yo‘lni ochish' },
  },
  iskra: {
    key: 'iskra',
    title: { ru: 'Искра и пауза', uz: 'Uchqun va pauza' },
    description: {
      ru: 'В ответах чаще проявился сценарий «Искра и пауза». В начале много энергии, но затем темп меняется слишком резко. Круг может держаться на памяти о старте, а не на устойчивом движении дальше.',
      uz: 'Javoblarda ko‘proq «Uchqun va pauza» stsenariysi namoyon bo‘ldi. Boshida energiya ko‘p, lekin keyin temp juda keskin o‘zgaradi. Aylana barqaror harakatga emas, balki boshlanish xotirasiga tayanishi mumkin.',
    },
    map: {
      start: { ru: 'ярко, быстро, с сильным ощущением возможности', uz: 'yorqin, tez, kuchli imkoniyat tuyg‘usi bilan' },
      hold:  { ru: 'память о красивом начале', uz: 'chiroyli boshlanish xotirasi' },
      loop:  { ru: 'когда после вспышки наступает пауза', uz: 'chaqnashdan keyin pauza kelganda' },
    },
    keyQuestion: {
      ru: 'Что именно в начале стало внутренней точкой возврата?',
      uz: 'Boshlanishda aynan nima ichki qaytish nuqtasiga aylandi?',
    },
    cta: { ru: 'Посмотреть сценарий глубже', uz: 'Stsenariyni chuqurroq ko‘rish' },
  },
  dver: {
    key: 'dver',
    title: { ru: 'Закрытая дверь', uz: 'Yopiq eshik' },
    description: {
      ru: 'В ответах чаще проявился сценарий «Закрытая дверь». Здесь может быть ощущение присутствия без настоящей ясности: человек рядом фрагментами, но важная часть истории остаётся закрытой.',
      uz: 'Javoblarda ko‘proq «Yopiq eshik» stsenariysi namoyon bo‘ldi. Bu yerda haqiqiy aniqliksiz mavjudlik tuyg‘usi bo‘lishi mumkin: inson parchalarda yonda, lekin hikoyaning muhim qismi yopiq qoladi.',
    },
    map: {
      start: { ru: 'через дистанцию и частичное сближение', uz: 'masofa va qisman yaqinlashish orqali' },
      hold:  { ru: 'ощущение, что дверь ещё может открыться', uz: 'eshik hali ochilishi mumkin degan tuyg‘u' },
      loop:  { ru: 'когда близость остаётся фрагментами', uz: 'yaqinlik parchalarda qolganda' },
    },
    keyQuestion: {
      ru: 'Где вы ждёте входа туда, где дверь пока не открывают?',
      uz: 'Eshik hali ochilmagan joyga kirishni qayerda kutyapsiz?',
    },
    cta: { ru: 'Разложить сценарий с Алтын', uz: 'Stsenariyni ALTYN bilan tahlil qilish' },
  },
};

export const RESULT_DISCLAIMER = {
  ru: 'Это не ярлык и не вывод о человеке. Это рабочая карта динамики, которая могла откликнуться в ответах.',
  uz: 'Bu yorliq ham, inson haqida xulosa ham emas. Bu javoblarda aks etishi mumkin bo‘lgan dinamika ishchi xaritasi.',
};
