import type { Scene } from './types';

// V6 — Rewrite. Questions stay deterministic and Meta-safe, but speak in
// concrete, lived-in language. Each option preserves its mapping to one of the
// 5 result types. UZ is best-effort.
export const SCENES: Scene[] = [
  {
    index: 1,
    title: { ru: 'Начало', uz: 'Boshlanish' },
    subtitle: {
      ru: 'Вспомните, с чего обычно начинается знакомый круг.',
      uz: 'Tanish aylana odatda nimadan boshlanishini eslang.',
    },
    question: { ru: 'Как чаще начинается история?', uz: 'Hikoya odatda qanday boshlanadi?' },
    options: [
      { id: 's1a', result: 'mayatnik', text: { ru: 'Сначала много тепла, внимания и интереса', uz: 'Avval ko‘p iliqlik, e’tibor va qiziqish' } },
      { id: 's1b', result: 'tuman',    text: { ru: 'Всё спокойно, но с самого начала не хватает ясности', uz: 'Hammasi tinch, lekin boshidanoq aniqlik yetishmaydi' } },
      { id: 's1c', result: 'dver',     text: { ru: 'Человек будто рядом, но до конца не открывается', uz: 'Inson yonida, lekin oxirigacha ochilmaydi' } },
      { id: 's1d', result: 'iskra',    text: { ru: 'Старт яркий, быстрый, а потом темп резко меняется', uz: 'Boshlanish yorqin, tez, keyin temp keskin o‘zgaradi' } },
    ],
  },
  {
    index: 2,
    title: { ru: 'Первый сигнал', uz: 'Birinchi signal' },
    subtitle: {
      ru: 'Обычно круг заметен не сразу — сначала появляется один знакомый сигнал.',
      uz: 'Aylana odatda darhol sezilmaydi — avval bitta tanish signal paydo bo‘ladi.',
    },
    question: { ru: 'Что первым начинает сбивать вас с ясности?', uz: 'Sizni aniqlikdan nima birinchi bo‘lib chiqaradi?' },
    options: [
      { id: 's2a', result: 'mayatnik',  text: { ru: 'Сегодня тепло, завтра снова дистанция', uz: 'Bugun iliq, ertaga yana masofa' } },
      { id: 's2b', result: 'tuman',     text: { ru: 'Слова есть, но по действиям всё непонятно', uz: 'So‘z bor, lekin harakatlardan hech narsa tushunarli emas' } },
      { id: 's2c', result: 'dogonyayu', text: { ru: 'Хочется прямо спросить, что между вами происходит', uz: 'Orangizda nima bo‘layotganini to‘g‘ridan-to‘g‘ri so‘rash istagi' } },
      { id: 's2d', result: 'iskra',     text: { ru: 'После сильного начала человек как будто остывает', uz: 'Kuchli boshlanishdan keyin inson go‘yo soviydi' } },
    ],
  },
  {
    index: 3,
    title: { ru: 'Ваше движение', uz: 'Sizning harakatingiz' },
    subtitle: {
      ru: 'Важно увидеть не только другого человека, но и то, куда начинает двигаться ваше внимание.',
      uz: 'Faqat boshqa odamni emas, sizning e’tiboringiz qayoqqa harakat qila boshlashini ham ko‘rish muhim.',
    },
    question: { ru: 'Что вы чаще делаете, когда ясности становится меньше?', uz: 'Aniqlik kamayganda nima qilasiz?' },
    options: [
      { id: 's3a', result: 'mayatnik',  text: { ru: 'Жду, что снова появится тот самый тёплый момент', uz: 'O‘sha iliq lahza yana qaytishini kutaman' } },
      { id: 's3b', result: 'tuman',     text: { ru: 'Пытаюсь не делать выводов, но всё равно прокручиваю ситуацию', uz: 'Xulosa qilmaslikka harakat qilaman, lekin baribir vaziyatni o‘ylayman' } },
      { id: 's3c', result: 'dogonyayu', text: { ru: 'Хочется написать, уточнить или добиться прямого ответа', uz: 'Yozish, aniqlashtirish yoki to‘g‘ridan-to‘g‘ri javob olish istagi' } },
      { id: 's3d', result: 'dver',      text: { ru: 'Остаюсь рядом, хотя чувствую, что важная часть закрыта', uz: 'Muhim qism yopiq ekanini his qilsam ham, yonida qolaman' } },
    ],
  },
  {
    index: 4,
    title: { ru: 'Что удерживает', uz: 'Nima ushlab turadi' },
    subtitle: {
      ru: 'Круг держится не всей историей, а тем, что особенно трудно отпустить.',
      uz: 'Aylana butun hikoyaga emas, qo‘yib yuborish ayniqsa qiyin bo‘lgan narsaga tayanadi.',
    },
    question: { ru: 'Что чаще всего не даёт спокойно выйти из этого круга?', uz: 'Aylanadan xotirjam chiqishga nima xalaqit beradi?' },
    options: [
      { id: 's4a', result: 'mayatnik',  text: { ru: 'Редкие тёплые моменты, после которых снова появляется надежда', uz: 'Kamdan-kam iliq daqiqalar, ulardan keyin yana umid paydo bo‘ladi' } },
      { id: 's4b', result: 'tuman',     text: { ru: 'Мысль, что скоро всё станет понятнее', uz: 'Yaqinda hammasi tushunarli bo‘ladi degan fikr' } },
      { id: 's4c', result: 'dogonyayu', text: { ru: 'Желание наконец услышать честный ответ', uz: 'Nihoyat halol javob eshitish istagi' } },
      { id: 's4d', result: 'iskra',     text: { ru: 'Память о том, как красиво всё начиналось', uz: 'Boshlanish qanchalik chiroyli bo‘lganini eslash' } },
    ],
  },
  {
    index: 5,
    title: { ru: 'Повтор', uz: 'Takror' },
    subtitle: {
      ru: 'Повтор обычно запускается не с нуля — его включает знакомый сигнал.',
      uz: 'Takror odatda noldan boshlanmaydi — uni tanish signal ishga tushiradi.',
    },
    question: { ru: 'Как этот круг чаще запускается снова?', uz: 'Bu aylana qayta qanday ishga tushadi?' },
    options: [
      { id: 's5a', result: 'mayatnik',  text: { ru: 'Через новое сообщение, внимание или тёплый жест', uz: 'Yangi xabar, e’tibor yoki iliq imo-ishora orqali' } },
      { id: 's5b', result: 'tuman',     text: { ru: 'Через недосказанность, где снова хочется додумать', uz: 'Yana o‘ylab topish istagi paydo bo‘ladigan aytilmaganlik orqali' } },
      { id: 's5c', result: 'dogonyayu', text: { ru: 'Через попытку всё объяснить и расставить точки', uz: 'Hammasini tushuntirish va nuqta qo‘yish urinishi orqali' } },
      { id: 's5d', result: 'iskra',     text: { ru: 'Через вспышку надежды, что всё может стать как в начале', uz: 'Hammasi yana boshidagidek bo‘ladi degan umid uchquni orqali' } },
    ],
  },
  {
    index: 6,
    title: { ru: 'Самая большая неясность', uz: 'Eng katta noaniqlik' },
    subtitle: {
      ru: 'Один вопрос обычно держит сильнее остальных.',
      uz: 'Bitta savol odatda boshqalardan kuchliroq ushlab turadi.',
    },
    question: { ru: 'Где вам больше всего хочется ясности?', uz: 'Sizga eng ko‘p qayerda aniqlik kerak?' },
    options: [
      { id: 's6a', result: 'mayatnik',  text: { ru: 'Почему тепло появляется, но не становится устойчивым', uz: 'Nima uchun iliqlik paydo bo‘ladi, lekin barqaror bo‘lmaydi' } },
      { id: 's6b', result: 'tuman',     text: { ru: 'Что здесь факт, а что только ожидание', uz: 'Bu yerda nima fakt, nima esa faqat kutish' } },
      { id: 's6c', result: 'dogonyayu', text: { ru: 'Почему прямой ответ так трудно получить', uz: 'Nima uchun to‘g‘ridan-to‘g‘ri javobni olish shunchalik qiyin' } },
      { id: 's6d', result: 'dver',      text: { ru: 'Почему человек остаётся рядом, но не открывается полностью', uz: 'Nima uchun inson yonida qoladi, lekin to‘liq ochilmaydi' } },
    ],
  },
  {
    index: 7,
    title: { ru: 'Точка разбора', uz: 'Tahlil nuqtasi' },
    subtitle: {
      ru: 'Последний маркер показывает, с чего лучше начать личный разбор.',
      uz: 'Oxirgi marker shaxsiy tahlilni nimadan boshlash kerakligini ko‘rsatadi.',
    },
    question: { ru: 'Что вы бы хотели разложить глубже с Алтын?', uz: 'Altyn bilan chuqurroq nimani tahlil qilmoqchisiz?' },
    options: [
      { id: 's7a', result: 'mayatnik',  text: { ru: 'Почему редкое тепло так сильно возвращает меня в круг', uz: 'Nima uchun kamdan-kam iliqlik meni aylana ichiga shunchalik kuchli qaytaradi' } },
      { id: 's7b', result: 'tuman',     text: { ru: 'Где заканчиваются факты и начинается ожидание', uz: 'Faktlar qayerda tugaydi va kutish qayerda boshlanadi' } },
      { id: 's7c', result: 'dogonyayu', text: { ru: 'Как перестать гоняться за ответом и увидеть реальную картину', uz: 'Javob ortidan quvishni to‘xtatib, haqiqiy manzarani qanday ko‘rish' } },
      { id: 's7d', result: 'dver',      text: { ru: 'Что делать, когда дверь вроде рядом, но не открывается', uz: 'Eshik go‘yo yonida, lekin ochilmasa nima qilish kerak' } },
    ],
  },
];

export const TOTAL_SCENES = SCENES.length;
