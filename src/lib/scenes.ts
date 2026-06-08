import type { Scene } from './types';

// Quiz V2 (Conversion Audit §7) — subtitles rewritten in inner-voice tone.
// Each subtitle is a 1-line monologue the user could be saying to herself,
// not an academic "вспомните, с чего..." instruction. Question lines made
// more intimate. Options keep their result mapping unchanged.
export const SCENES: Scene[] = [
  {
    index: 1,
    title: { ru: 'Начало', uz: 'Boshlanish' },
    subtitle: {
      ru: 'Каждый новый круг начинается похоже. Замечали?',
      uz: 'Har bir yangi aylana bir xil boshlanadi. Sezganmisiz?',
    },
    question: { ru: 'Как обычно начинается эта история?', uz: 'Bu hikoya odatda qanday boshlanadi?' },
    options: [
      { id: 's1a', result: 'mayatnik', text: { ru: 'Сразу много внимания — как будто вы тот самый человек', uz: 'Darrov ko‘p e’tibor — go‘yo siz o‘sha odamsiz' } },
      { id: 's1b', result: 'tuman',    text: { ru: 'Тихо, ровно, но с какой-то недосказанностью', uz: 'Tinch, tekis, lekin nimadir aytilmagandek' } },
      { id: 's1c', result: 'dver',     text: { ru: 'Тёплая дистанция — будто близко, но и не совсем', uz: 'Iliq masofa — yaqin, lekin to‘liq emas' } },
      { id: 's1d', result: 'iskra',    text: { ru: 'Как фильм — быстро, ярко, на одном дыхании', uz: 'Kino kabi — tez, yorqin, bir nafasda' } },
    ],
  },
  {
    index: 2,
    title: { ru: 'Первый сбой', uz: 'Birinchi uzilish' },
    subtitle: {
      ru: 'Что-то одно — и ясность уже не та.',
      uz: 'Bir nimadir — va aniqlik allaqachon boshqacha.',
    },
    question: { ru: 'Что первым выбивает вас из спокойствия?', uz: 'Sizni xotirjamlikdan birinchi bo‘lib nima chiqaradi?' },
    options: [
      { id: 's2a', result: 'mayatnik',  text: { ru: 'Сегодня — близко. Завтра — словно другой человек', uz: 'Bugun — yaqin. Ertaga — go‘yo boshqa odam' } },
      { id: 's2b', result: 'tuman',     text: { ru: 'Слова есть, но по поступкам ничего не понятно', uz: 'So‘zlar bor, lekin harakatlardan hech narsa tushunarli emas' } },
      { id: 's2c', result: 'dogonyayu', text: { ru: 'Хочется задать прямой вопрос — но что-то останавливает', uz: 'To‘g‘ridan-to‘g‘ri savol berish istagi — lekin nimadir to‘xtatadi' } },
      { id: 's2d', result: 'iskra',     text: { ru: 'После яркого старта вдруг становится тише', uz: 'Yorqin boshlanishdan keyin to‘satdan jimroq bo‘ladi' } },
    ],
  },
  {
    index: 3,
    title: { ru: 'Ваше движение', uz: 'Sizning harakatingiz' },
    subtitle: {
      ru: 'И вы что-то делаете — ещё до того как заметили это.',
      uz: 'Va siz allaqachon nimadir qilyapsiz — sezishingizdan oldin.',
    },
    question: { ru: 'Что вы чаще всего делаете в этот момент?', uz: 'Bu lahzada ko‘pincha nima qilasiz?' },
    options: [
      { id: 's3a', result: 'mayatnik',  text: { ru: 'Жду одной тёплой секунды — и оживаю', uz: 'Bir iliq soniyani kutaman — va jonlanaman' } },
      { id: 's3b', result: 'tuman',     text: { ru: 'Прокручиваю переписку, ищу подсказку', uz: 'Yozishmalarni qayta o‘qiyman, ishorat izlayman' } },
      { id: 's3c', result: 'dogonyayu', text: { ru: 'Пишу длинное сообщение — потом стираю половину', uz: 'Uzun xabar yozaman — keyin yarmini o‘chiraman' } },
      { id: 's3d', result: 'dver',      text: { ru: 'Остаюсь рядом, хотя слышу: что-то закрыто', uz: 'Nimadir yopiq ekanini eshitsam ham, yonida qolaman' } },
    ],
  },
  {
    index: 4,
    title: { ru: 'Что удерживает', uz: 'Nima ushlab turadi' },
    subtitle: {
      ru: 'Один маленький момент держит весь круг.',
      uz: 'Bitta kichkina lahza butun aylanani ushlab turadi.',
    },
    question: { ru: 'Что чаще всего не даёт спокойно отойти?', uz: 'Xotirjam chetga chiqishga nima xalaqit beradi?' },
    options: [
      { id: 's4a', result: 'mayatnik',  text: { ru: 'Та одна тёплая фраза, после которой снова надеешься', uz: 'O‘sha bitta iliq jumla — undan keyin yana umid qilasan' } },
      { id: 's4b', result: 'tuman',     text: { ru: 'Чувство, что вот-вот всё прояснится', uz: 'Mana-mana hammasi oydinlashadi degan tuyg‘u' } },
      { id: 's4c', result: 'dogonyayu', text: { ru: 'Один невысказанный вопрос внутри', uz: 'Ichimdagi bitta aytilmagan savol' } },
      { id: 's4d', result: 'iskra',     text: { ru: 'Память о начале — там было по-другому', uz: 'Boshlanish xotirasi — u yerda boshqacha edi' } },
    ],
  },
  {
    index: 5,
    title: { ru: 'Повтор', uz: 'Takror' },
    subtitle: {
      ru: 'Круг включается не с нуля — что-то его запускает заново.',
      uz: 'Aylana noldan emas — nimadir uni qaytadan ishga tushiradi.',
    },
    question: { ru: 'Что обычно запускает круг снова?', uz: 'Aylanani odatda nima qaytadan ishga tushiradi?' },
    options: [
      { id: 's5a', result: 'mayatnik',  text: { ru: 'Одно его сообщение — и я снова в начале', uz: 'Uning bitta xabari — va men yana boshda' } },
      { id: 's5b', result: 'tuman',     text: { ru: 'Недосказанность — и я начинаю додумывать', uz: 'Aytilmaganlik — va men o‘ylab topa boshlayman' } },
      { id: 's5c', result: 'dogonyayu', text: { ru: 'Желание объяснить и расставить точки', uz: 'Tushuntirib, nuqta qo‘yish istagi' } },
      { id: 's5d', result: 'iskra',     text: { ru: 'Воспоминание, что когда-то было «так»', uz: 'Bir paytlar «shunday» bo‘lgani haqidagi xotira' } },
    ],
  },
  {
    index: 6,
    title: { ru: 'Самая большая неясность', uz: 'Eng katta noaniqlik' },
    subtitle: {
      ru: 'Один вопрос держит сильнее остальных.',
      uz: 'Bitta savol boshqalardan kuchliroq ushlab turadi.',
    },
    question: { ru: 'Чего вам сейчас не хватает больше всего?', uz: 'Hozir sizga eng ko‘p nima yetishmaydi?' },
    options: [
      { id: 's6a', result: 'mayatnik',  text: { ru: 'Понять, почему тёплое не остаётся', uz: 'Iliqlik nima uchun qolmasligini tushunish' } },
      { id: 's6b', result: 'tuman',     text: { ru: 'Отделить факты от того, что я придумала', uz: 'Faktlarni o‘zim o‘ylab topgan narsalardan ajratish' } },
      { id: 's6c', result: 'dogonyayu', text: { ru: 'Получить один прямой ответ', uz: 'Bitta to‘g‘ridan-to‘g‘ri javob olish' } },
      { id: 's6d', result: 'dver',      text: { ru: 'Понять, почему дверь не открывается до конца', uz: 'Eshik nima uchun to‘liq ochilmasligini tushunish' } },
    ],
  },
  {
    index: 7,
    title: { ru: 'Точка разбора', uz: 'Tahlil nuqtasi' },
    subtitle: {
      ru: 'Один маркер — и можно остановиться, не запуская круг ещё раз.',
      uz: 'Bitta marker — va aylanani yana boshlamasdan to‘xtab qolish mumkin.',
    },
    question: { ru: 'С чего вы бы начали разговор о своём круге?', uz: 'Aylanangiz haqidagi suhbatni nimadan boshlagan bo‘lardingiz?' },
    options: [
      { id: 's7a', result: 'mayatnik',  text: { ru: 'С момента, когда одна тёплая секунда обогнала всё остальное', uz: 'Bir iliq soniya hammasidan kuchli bo‘lgan lahzadan' } },
      { id: 's7b', result: 'tuman',     text: { ru: 'С границы между «было» и «я надумала»', uz: '«Bo‘lgan» va «men o‘ylab topgan» o‘rtasidagi chegaradan' } },
      { id: 's7c', result: 'dogonyayu', text: { ru: 'С вопроса, который я задаю в голове каждый день', uz: 'Har kuni boshimda beradigan savoldan' } },
      { id: 's7d', result: 'dver',      text: { ru: 'С двери, у которой я слишком давно стою', uz: 'Juda uzoq turgan eshigimdan' } },
    ],
  },
];

export const TOTAL_SCENES = SCENES.length;
