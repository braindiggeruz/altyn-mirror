import type { Scene } from './types';

export const SCENES: Scene[] = [
  {
    index: 1,
    title: { ru: 'Начало', uz: 'Boshlanish' },
    question: {
      ru: 'Как чаще начинается история?',
      uz: 'Hikoya odatda qanday boshlanadi?',
    },
    options: [
      { id: 's1a', result: 'mayatnik', text: { ru: 'Быстро появляется тепло и интерес', uz: 'Tezda iliqlik va qiziqish paydo bo‘ladi' } },
      { id: 's1b', result: 'tuman',    text: { ru: 'Всё спокойно, но не хватает ясности', uz: 'Hammasi tinch, lekin aniqlik yetishmaydi' } },
      { id: 's1c', result: 'dver',     text: { ru: 'Сначала есть дистанция, потом становится ближе', uz: 'Avval masofa bor, keyin yaqinroq bo‘ladi' } },
      { id: 's1d', result: 'iskra',    text: { ru: 'Сильное начало, а потом темп резко меняется', uz: 'Boshlanishi kuchli, keyin temp keskin o‘zgaradi' } },
    ],
  },
  {
    index: 2,
    title: { ru: 'Первый туман', uz: 'Birinchi tuman' },
    question: { ru: 'Где обычно становится неясно?', uz: 'Odatda qayerda noaniq bo‘ladi?' },
    options: [
      { id: 's2a', result: 'mayatnik',  text: { ru: 'Когда человек то появляется, то исчезает', uz: 'Inson goh paydo bo‘lib, goh yo‘qolganda' } },
      { id: 's2b', result: 'tuman',     text: { ru: 'Когда слов много, а формы мало', uz: 'So‘z ko‘p, lekin shakl kam bo‘lganda' } },
      { id: 's2c', result: 'dogonyayu', text: { ru: 'Когда хочется всё обсудить, но ответа нет', uz: 'Hammasini muhokama qilgingiz keladi, lekin javob yo‘q' } },
      { id: 's2d', result: 'iskra',     text: { ru: 'Когда после яркости наступает пауза', uz: 'Yorqinlikdan keyin pauza kelganda' } },
    ],
  },
  {
    index: 3,
    title: { ru: 'Что удерживает', uz: 'Nima ushlab turadi' },
    question: { ru: 'Что чаще всего не даёт выйти из круга?', uz: 'Aylanadan chiqishga nima ko‘proq xalaqit beradi?' },
    options: [
      { id: 's3a', result: 'mayatnik',  text: { ru: 'Редкие тёплые моменты', uz: 'Kamdan-kam iliq daqiqalar' } },
      { id: 's3b', result: 'tuman',     text: { ru: 'Надежда, что скоро всё станет понятнее', uz: 'Yaqinda hammasi tushunarli bo‘lishiga umid' } },
      { id: 's3c', result: 'dogonyayu', text: { ru: 'Желание наконец получить прямой ответ', uz: 'Nihoyat to‘g‘ridan-to‘g‘ri javob olish istagi' } },
      { id: 's3d', result: 'iskra',     text: { ru: 'Память о том, как красиво всё началось', uz: 'Boshlanish qanchalik chiroyli bo‘lganini eslash' } },
    ],
  },
  {
    index: 4,
    title: { ru: 'Ваше движение', uz: 'Sizning harakatingiz' },
    question: { ru: 'Что обычно хочется сделать в этот момент?', uz: 'Bu daqiqada odatda nima qilgingiz keladi?' },
    options: [
      { id: 's4a', result: 'mayatnik',  text: { ru: 'Подождать, вдруг тепло вернётся', uz: 'Kutib turish, ehtimol iliqlik qaytadi' } },
      { id: 's4b', result: 'tuman',     text: { ru: 'Не давить, но всё равно думать об этом', uz: 'Bosim qilmaslik, lekin baribir o‘ylash' } },
      { id: 's4c', result: 'dogonyayu', text: { ru: 'Написать, уточнить, расставить точки', uz: 'Yozish, aniqlashtirish, nuqta qo‘yish' } },
      { id: 's4d', result: 'dver',      text: { ru: 'Остаться рядом, даже если дверь закрыта', uz: 'Eshik yopiq bo‘lsa ham, yonida qolish' } },
    ],
  },
  {
    index: 5,
    title: { ru: 'Повтор', uz: 'Takror' },
    question: { ru: 'Как круг чаще запускается снова?', uz: 'Aylana qayta qanday boshlanadi?' },
    options: [
      { id: 's5a', result: 'mayatnik',  text: { ru: 'Через новый тёплый эпизод', uz: 'Yangi iliq lahza orqali' } },
      { id: 's5b', result: 'tuman',     text: { ru: 'Через недосказанность', uz: 'Aytilmagan narsalar orqali' } },
      { id: 's5c', result: 'dogonyayu', text: { ru: 'Через попытку всё прояснить', uz: 'Hammasini oydinlashtirish urinishi orqali' } },
      { id: 's5d', result: 'iskra',     text: { ru: 'Через вспышку надежды', uz: 'Umid uchquni orqali' } },
    ],
  },
  {
    index: 6,
    title: { ru: 'Самая сильная точка', uz: 'Eng kuchli nuqta' },
    question: { ru: 'Что больше всего цепляет в этой истории?', uz: 'Bu hikoyada eng ko‘p nima ushlab oladi?' },
    options: [
      { id: 's6a', result: 'mayatnik',  text: { ru: 'Контраст: то близко, то холодно', uz: 'Kontrast: goh yaqin, goh sovuq' } },
      { id: 's6b', result: 'tuman',     text: { ru: 'Неопределённость', uz: 'Noaniqlik' } },
      { id: 's6c', result: 'dogonyayu', text: { ru: 'Невозможность спокойно закрыть вопрос', uz: 'Savolni xotirjam yopa olmaslik' } },
      { id: 's6d', result: 'dver',      text: { ru: 'Ощущение, что важная дверь всё ещё закрыта', uz: 'Muhim eshik hali ham yopiq degan tuyg‘u' } },
    ],
  },
  {
    index: 7,
    title: { ru: 'Что хочется увидеть сейчас', uz: 'Hozir nimani ko‘rishni xohlaysiz' },
    question: { ru: 'Что было бы полезнее всего разложить?', uz: 'Nimani tahlil qilish foydaliroq bo‘lardi?' },
    options: [
      { id: 's7a', result: 'mayatnik',  text: { ru: 'Где именно возвращается круг', uz: 'Aylana aynan qayerda qaytadi' } },
      { id: 's7b', result: 'tuman',     text: { ru: 'Где факты смешиваются с ожиданием', uz: 'Faktlar kutish bilan qayerda aralashadi' } },
      { id: 's7c', result: 'dogonyayu', text: { ru: 'Где контакт превращается в погоню за ясностью', uz: 'Aloqa qayerda aniqlik ortidan quvishga aylanadi' } },
      { id: 's7d', result: 'iskra',     text: { ru: 'Где сила начала не совпадает с реальным движением', uz: 'Boshlanish kuchi haqiqiy harakat bilan qayerda mos kelmaydi' } },
    ],
  },
];

export const TOTAL_SCENES = SCENES.length;
