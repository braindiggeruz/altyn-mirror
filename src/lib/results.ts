import type { ResultData, ResultKey } from './types';

export const RESULT_KEYS: ResultKey[] = ['mayatnik', 'tuman', 'dogonyayu', 'iskra', 'dver'];

export const RESULTS: Record<ResultKey, ResultData> = {
  mayatnik: {
    key: 'mayatnik',
    title: { ru: 'Маятник тепла', uz: 'Iliqlik mayatnigi' },
    // Sprint 2 — one-line insight with pain, surfaces above passport.
    insight: {
      ru: 'Вы помните три минуты тепла громче, чем три недели тишины. Поэтому круг не разрывается.',
      uz: 'Siz uch daqiqalik iliqlikni uch haftalik sukunatdan baland eslaysiz. Shuning uchun aylana uzilmaydi.',
    },
    // Sprint 2 — mini-scene "как это в жизни" — concrete 3–4-line scene that
    // delivers the moment-of-recognition before the passport table.
    miniScene: {
      ru: 'Он не пишет три дня. Вы решаете: «всё, хватит». На четвёртый день — короткое «как ты?». И вы помните не три дня тишины, а это «как ты?». И отвечаете.',
      uz: 'U uch kun yozmaydi. Siz "yetar, tamom" deysiz. To‘rtinchi kuni — qisqa "qalaysan?". Va siz uch kunlik sukunatni emas, mana shu "qalaysan?"ni eslaysiz. Va javob qaytarasiz.',
    },
    description: {
      ru: 'В ответах чаще проявился сценарий «Маятник тепла». Здесь круг держится не на ровности, а на моментах, когда тепло возвращается и снова включает надежду. Важно посмотреть, где внимание начинает заменять ясность.',
      uz: 'Javoblarda ko‘proq «Iliqlik mayatnigi» stsenariysi namoyon bo‘ldi. Bu yerda aylana tekislik emas, balki iliqlik qaytib, umidni yana yoqib yuboradigan lahzalarga tayanadi.',
    },
    map: {
      start: { ru: 'через тепло и быстрое сближение', uz: 'iliqlik va tez yaqinlashish orqali' },
      hold:  { ru: 'редкие моменты возвращения', uz: 'qaytishning kam uchraydigan lahzalari' },
      loop:  { ru: 'когда тёплый эпизод снова запускает круг', uz: 'iliq lahza yana aylanani ishga tushirganda' },
    },
    markers: {
      ru: [
        'Тепло возвращается волнами',
        'Редкие моменты становятся сильными',
        'Круг запускается через надежду',
      ],
      uz: [
        'Iliqlik to‘lqinlar bilan qaytadi',
        'Kamdan-kam lahzalar kuchli bo‘ladi',
        'Aylana umid orqali ishga tushadi',
      ],
    },
    keyQuestion: {
      ru: 'Где именно редкое тепло становится сильнее фактов?',
      uz: 'Kamdan-kam iliqlik aynan qayerda faktlardan kuchliroq bo‘ladi?',
    },
    cta: { ru: 'Разложить маятник в Telegram', uz: 'Mayatnikni Telegram’da tahlil qilish' },
    bring: {
      ru: [
        'Один эпизод, после которого надежда вернулась сильнее всего',
        'Какие факты в эти моменты остались в стороне',
        'Что хотелось услышать в самой тёплой точке',
      ],
      uz: [
        'Umid eng kuchli qaytgan bitta lahza',
        'Bu lahzalarda qaysi faktlar chetda qoldi',
        'Eng iliq nuqtada nimani eshitish istagi bo‘lgani',
      ],
    },
    firstStep: {
      ru: 'Отделить редкий тёплый эпизод от общей картины — посмотреть на него отдельно, без круга вокруг.',
      uz: 'Kamdan-kam iliq lahzani umumiy manzaradan ajratish — uni atrofidagi aylanasiz alohida ko‘rish.',
    },
    prepQuestions: {
      ru: [
        'Когда тепло возвращалось последний раз — что именно тогда было сказано или сделано?',
        'Какой факт о текущем состоянии вы уже знаете, но откладываете назвать словами?',
        'Что в карте «Маятник тепла» откликнулось сильнее всего?',
      ],
      uz: [
        'Iliqlik oxirgi marta qaytganida — aynan nima aytildi yoki qilindi?',
        'Hozirgi holat haqida qaysi faktni allaqachon bilasiz, lekin so‘z bilan aytishni keyinga qoldiryapsiz?',
        '«Iliqlik mayatnigi» xaritasida nima eng kuchli aks-sado berdi?',
      ],
    },
    sessionPlan: {
      ru: [
        { time: '1 · 10 мин', text: 'Возьмём один эпизод тёплого возвращения. Без оценок.' },
        { time: '2 · 35 мин', text: 'Найдём точку, где надежда обогнала факты. И слово, которым это можно назвать.' },
        { time: '3 · 15 мин', text: 'Сформулируем один шаг, который не запускает круг снова.' },
      ],
      uz: [
        { time: '1 · 10 daq.', text: 'Bitta iliq qaytish lahzasini olamiz. Bahosiz.' },
        { time: '2 · 35 daq.', text: 'Umid faktlardan o‘zib ketgan nuqtani topamiz. Va uni nomlash mumkin bo‘lgan so‘zni.' },
        { time: '3 · 15 daq.', text: 'Aylanani qayta yoqmaydigan bitta qadamni tuzamiz.' },
      ],
    },
    whatsVisible: {
      ru: [
        'круг начинается с тёплого, быстрого сближения;',
        'внимание удерживают редкие моменты, когда тепло возвращается;',
        'повтор запускается через новый тёплый эпизод, после которого снова появляется надежда.',
      ],
      uz: [
        'aylana iliq, tez yaqinlashishdan boshlanadi;',
        'e’tiborni iliqlik qaytadigan kamdan-kam lahzalar ushlab turadi;',
        'takror yangi iliq lahza orqali ishga tushadi, undan keyin yana umid paydo bo‘ladi.',
      ],
    },
  },
  tuman: {
    key: 'tuman',
    title: { ru: 'Туман без ясности', uz: 'Aniqliksiz tuman' },
    insight: {
      ru: 'Вы не ищете его. Вы ищете определение того, что между вами происходит — и не можете его получить.',
      uz: 'Siz uni qidirmaysiz. Siz orangizda nima sodir bo‘layotganining ta‘rifini qidirasiz — va uni ololmayapsiz.',
    },
    miniScene: {
      ru: 'Он отвечает. Через 6 часов. Одной строкой. Вы перечитываете эту строку. Открываете чат пять раз за день. Не пишете. Думаете, было ли в его «ок» точка.',
      uz: 'U javob beradi. 6 soatdan keyin. Bir qatorda. Siz bu qatorni qayta o‘qiysiz. Kuniga besh marta chatni ochasiz. Yozmaysiz. Uning "ok"da nuqta bormidi — o‘ylaysiz.',
    },
    description: {
      ru: 'В ответах чаще проявился сценарий «Туман без ясности». Здесь напряжение рождается не из резкого конфликта, а из неопределённости. Связь как будто есть, но опоры у неё мало.',
      uz: 'Javoblarda ko‘proq «Aniqliksiz tuman» stsenariysi namoyon bo‘ldi. Bu yerda taranglik keskin to‘qnashuvdan emas, noaniqlikdan tug‘iladi.',
    },
    map: {
      start: { ru: 'спокойно, но без полной формы', uz: 'tinch, lekin to‘liq shaklsiz' },
      hold:  { ru: 'надежда, что скоро станет понятнее', uz: 'tez orada tushunarli bo‘lishiga umid' },
      loop:  { ru: 'когда факты смешиваются с ожиданием', uz: 'faktlar kutish bilan aralashganda' },
    },
    markers: {
      ru: [
        'Связь есть, но формы мало',
        'Ожидание смешивается с фактами',
        'Неопределённость держит внимание',
      ],
      uz: [
        'Aloqa bor, lekin shakl kam',
        'Kutish faktlar bilan aralashadi',
        'Noaniqlik e’tiborni ushlab turadi',
      ],
    },
    keyQuestion: {
      ru: 'Где заканчиваются факты и начинается ожидание?',
      uz: 'Faktlar qayerda tugaydi va kutish qayerda boshlanadi?',
    },
    cta: { ru: 'Разложить туман в Telegram', uz: 'Tumanni Telegram’da tahlil qilish' },
    bring: {
      ru: [
        'Три факта, которые точно есть, без дорисовки',
        'Один эпизод, где особенно не хватало формы',
        'Какое именно ожидание чаще всего сливается с реальностью',
      ],
      uz: [
        'Aniq mavjud uchta fakt, qo‘shimcha tasavvursiz',
        'Shakl yetishmagan bitta lahza',
        'Reallik bilan eng ko‘p aralashadigan kutish',
      ],
    },
    firstStep: {
      ru: 'На один лист — три факта, рядом — три ожидания. Не оценивая, просто разделить.',
      uz: 'Bitta varaqqa — uchta fakt, yonida — uchta kutish. Bahosiz, oddiy ajratish.',
    },
    prepQuestions: {
      ru: [
        'Что вы достоверно знаете о текущей точке отношений — без догадок?',
        'Где именно вы заменяете факт ожиданием — приведите один пример?',
        'Какая часть «Тумана» в вашей истории особенно густая?',
      ],
      uz: [
        'Munosabatlarning hozirgi nuqtasi haqida nimani aniq bilasiz — taxminlarsiz?',
        'Aynan qayerda faktni kutish bilan almashtiryapsiz — bitta misol keltiring?',
        '«Tuman»ning sizning hikoyangizdagi qaysi qismi ayniqsa qalin?',
      ],
    },
    sessionPlan: {
      ru: [
        { time: '1 · 10 мин', text: 'Разделим то, что вы точно знаете, и то, что предполагаете.' },
        { time: '2 · 35 мин', text: 'Найдём, где ожидание стало восприниматься как факт. И обратно.' },
        { time: '3 · 15 мин', text: 'Сформулируем один шаг, который вернёт ясность в одну конкретную точку.' },
      ],
      uz: [
        { time: '1 · 10 daq.', text: 'Aniq bilganlaringizni va taxmin qilganlaringizni ajratamiz.' },
        { time: '2 · 35 daq.', text: 'Kutish fakt sifatida qabul qilingan joyni topamiz. Va aksincha.' },
        { time: '3 · 15 daq.', text: 'Bir aniq nuqtaga aniqlikni qaytaradigan bitta qadamni tuzamiz.' },
      ],
    },
    whatsVisible: {
      ru: [
        'круг начинается спокойно, но без полной ясности;',
        'внимание удерживает ожидание, что скоро станет понятнее;',
        'повтор запускается там, где факты смешиваются с ожиданием.',
      ],
      uz: [
        'aylana tinch boshlanadi, lekin to‘liq aniqliksiz;',
        'e’tiborni tez orada tushunarli bo‘ladi degan kutish ushlab turadi;',
        'takror faktlar kutish bilan aralashgan joyda ishga tushadi.',
      ],
    },
  },
  dogonyayu: {
    key: 'dogonyayu',
    title: { ru: 'Догоняю ответ', uz: 'Javob ortidan quvaman' },
    insight: {
      ru: 'Вы хотите ясности — но не от себя, а от него. Даже когда уже почти знаете ответ.',
      uz: 'Siz aniqlikni xohlaysiz — lekin o‘zingizdan emas, undan. Javobni deyarli bilsangiz ham.',
    },
    miniScene: {
      ru: 'Вы пишете длинное искреннее сообщение. Удаляете половину. Отправляете. Кладёте телефон. Ходите по комнате. Перечитываете отправленное. Через час злитесь, что написали первой.',
      uz: 'Siz uzun, samimiy xabar yozasiz. Yarmini o‘chirasiz. Yuborasiz. Telefonni qo‘yasiz. Xona bo‘ylab yurasiz. Yuborilganini qayta o‘qiysiz. Bir soatdan keyin birinchi yozganingiz uchun jahlingiz chiqadi.',
    },
    description: {
      ru: 'В ответах чаще проявился сценарий «Догоняю ответ». Когда история становится неясной, появляется желание быстро вернуть определённость. Круг может держаться на попытке получить ясность там, где её пока не дают.',
      uz: 'Javoblarda ko‘proq «Javob ortidan quvaman» stsenariysi namoyon bo‘ldi. Hikoya noaniq bo‘lganda, tezda aniqlikni qaytarish istagi paydo bo‘ladi.',
    },
    map: {
      start: { ru: 'через желание понять, что происходит', uz: 'nima sodir bo‘layotganini tushunish istagi orqali' },
      hold:  { ru: 'потребность в прямом ответе', uz: 'to‘g‘ridan-to‘g‘ri javobga ehtiyoj' },
      loop:  { ru: 'когда контакт превращается в попытку всё прояснить', uz: 'aloqa hammasini oydinlashtirish urinishiga aylanganda' },
    },
    markers: {
      ru: [
        'Хочется расставить точки',
        'Контакт превращается в поиск ясности',
        'Ответ становится центром истории',
      ],
      uz: [
        'Nuqta qo‘yish istagi paydo bo‘ladi',
        'Aloqa aniqlik izlashga aylanadi',
        'Javob hikoyaning markaziga aylanadi',
      ],
    },
    keyQuestion: {
      ru: 'Где контакт превращается в погоню за ответом?',
      uz: 'Aloqa qayerda javob ortidan quvishga aylanadi?',
    },
    cta: { ru: 'Открыть личный маршрут', uz: 'Shaxsiy yo‘lni ochish' },
    bring: {
      ru: [
        'Вопрос, который чаще всего хочется задать',
        'Эпизод, где попытка прояснить запустила новый круг',
        'Что должно появиться, чтобы вопрос можно было оставить',
      ],
      uz: [
        'Eng ko‘p bermoqchi bo‘lgan savol',
        'Aniqlashtirish urinishi yangi aylanani boshlagan lahza',
        'Savolni qoldirish uchun nima paydo bo‘lishi kerak',
      ],
    },
    firstStep: {
      ru: 'Дать одному вопросу 24 часа тишины — и посмотреть, что меняется внутри, без ответа.',
      uz: 'Bitta savolga 24 soat sukunat berish — javobsiz, ichda nima o‘zgarishini kuzatish.',
    },
    prepQuestions: {
      ru: [
        'Какой вопрос вы задаёте чаще всего — себе или партнёру?',
        'Что должно появиться, чтобы вы могли оставить этот вопрос на 24 часа?',
        'Где «погоня за ответом» сильнее всего обгоняет реальный контакт?',
      ],
      uz: [
        'Qaysi savolni o‘zingizga yoki sherigingizga eng ko‘p berasiz?',
        'Bu savolni 24 soatga qoldirish uchun nima paydo bo‘lishi kerak?',
        '«Javob ortidan quvish» haqiqiy aloqani eng kuchli qaerda ortda qoldiradi?',
      ],
    },
    sessionPlan: {
      ru: [
        { time: '1 · 10 мин', text: 'Возьмём один вопрос, который возвращается чаще всего.' },
        { time: '2 · 35 мин', text: 'Разложим, где контакт превращается в поиск ответа.' },
        { time: '3 · 15 мин', text: 'Сформулируем один шаг, который не требует немедленного ответа.' },
      ],
      uz: [
        { time: '1 · 10 daq.', text: 'Eng ko‘p qaytadigan bitta savolni olamiz.' },
        { time: '2 · 35 daq.', text: 'Aloqa javob izlashga aylangan joyni tahlil qilamiz.' },
        { time: '3 · 15 daq.', text: 'Zudlik bilan javob talab qilmaydigan bitta qadamni tuzamiz.' },
      ],
    },
    whatsVisible: {
      ru: [
        'круг начинается с желания быстро понять, что происходит;',
        'внимание удерживает потребность услышать прямой ответ;',
        'повтор запускается, когда контакт превращается в попытку всё прояснить.',
      ],
      uz: [
        'aylana nima sodir bo‘layotganini tez tushunish istagidan boshlanadi;',
        'e’tiborni to‘g‘ridan-to‘g‘ri javob eshitish ehtiyoji ushlab turadi;',
        'takror aloqa hammasini oydinlashtirish urinishiga aylanganda ishga tushadi.',
      ],
    },
  },
  iskra: {
    key: 'iskra',
    title: { ru: 'Искра и пауза', uz: 'Uchqun va pauza' },
    insight: {
      ru: 'Вы держитесь не за него. Вы держитесь за ту версию себя, которой были в начале с ним.',
      uz: 'Siz unga emas — u bilan boshida bo‘lgan o‘zingizning o‘sha versiyangizga yopishyapsiz.',
    },
    miniScene: {
      ru: 'Первые две недели — будто фильм. Потом он «занят». Потом «устал». Потом один вечер — снова как тогда. Вы думаете: «вот, вернулось». А назавтра снова занят. И вы цепляетесь не за него — а за тот вечер.',
      uz: 'Birinchi ikki hafta — go‘yo kino. Keyin u "band". Keyin "charchagan". Keyin bir oqshom — yana o‘sha paytdagidek. Siz "mana, qaytdi" deysiz. Ertasi kuni esa yana band. Va siz unga emas — o‘sha oqshomga yopishasiz.',
    },
    description: {
      ru: 'В ответах чаще проявился сценарий «Искра и пауза». В начале много энергии, но затем темп меняется слишком резко. Круг может держаться на памяти о старте, а не на устойчивом движении дальше.',
      uz: 'Javoblarda ko‘proq «Uchqun va pauza» stsenariysi namoyon bo‘ldi. Boshida energiya ko‘p, lekin keyin temp juda keskin o‘zgaradi.',
    },
    map: {
      start: { ru: 'ярко, быстро, с сильным ощущением возможности', uz: 'yorqin, tez, kuchli imkoniyat tuyg‘usi bilan' },
      hold:  { ru: 'память о красивом начале', uz: 'chiroyli boshlanish xotirasi' },
      loop:  { ru: 'когда после вспышки наступает пауза', uz: 'chaqnashdan keyin pauza kelganda' },
    },
    markers: {
      ru: [
        'Много энергии в начале',
        'Резкое изменение темпа',
        'Память о старте сильнее текущих фактов',
      ],
      uz: [
        'Boshida energiya ko‘p',
        'Temp keskin o‘zgaradi',
        'Boshlanish xotirasi joriy faktlardan kuchliroq',
      ],
    },
    keyQuestion: {
      ru: 'Что именно в начале стало внутренней точкой возврата?',
      uz: 'Boshlanishda aynan nima ichki qaytish nuqtasiga aylandi?',
    },
    cta: { ru: 'Посмотреть сценарий глубже', uz: 'Stsenariyni chuqurroq ko‘rish' },
    bring: {
      ru: [
        'Картина того самого яркого начала — без редактуры',
        'Момент, когда темп резко изменился',
        'Что сейчас держит память о старте сильнее текущего',
      ],
      uz: [
        'O‘sha yorqin boshlanishning manzarasi — tahrirsiz',
        'Temp keskin o‘zgargan lahza',
        'Joriy holatdan ko‘ra boshlanish xotirasini ushlab turuvchi narsa',
      ],
    },
    firstStep: {
      ru: 'Описать начало одним абзацем — и рядом фактами зафиксировать, что есть прямо сейчас.',
      uz: 'Boshlanishni bitta xat bilan tasvirlash — va yonida hozir bor faktlarni qayd etish.',
    },
    prepQuestions: {
      ru: [
        'Какой эпизод начала вы возвращаете в памяти чаще остальных?',
        'Когда именно темп изменился — есть ли конкретная точка?',
        'Что сейчас сильнее: воспоминание о начале или текущие факты?',
      ],
      uz: [
        'Boshlanishning qaysi lahzasini eng ko‘p xotiraga qaytarasiz?',
        'Temp aynan qachon o‘zgardi — aniq nuqta bormi?',
        'Hozir nima kuchliroq: boshlanish xotirasi yoki joriy faktlar?',
      ],
    },
    sessionPlan: {
      ru: [
        { time: '1 · 10 мин', text: 'Возьмём один яркий эпизод начала.' },
        { time: '2 · 35 мин', text: 'Найдём точку, где темп изменился и воспоминание стало сильнее текущих фактов.' },
        { time: '3 · 15 мин', text: 'Сформулируем один шаг, который проверяет реальность сейчас, а не только начало.' },
      ],
      uz: [
        { time: '1 · 10 daq.', text: 'Boshlanishning bitta yorqin lahzasini olamiz.' },
        { time: '2 · 35 daq.', text: 'Temp o‘zgargan va xotira joriy faktlardan kuchliroq bo‘lgan nuqtani topamiz.' },
        { time: '3 · 15 daq.', text: 'Faqat boshlanish emas, hozirgi reallikni tekshiradigan bitta qadamni tuzamiz.' },
      ],
    },
    whatsVisible: {
      ru: [
        'круг начинается ярко и быстро, с сильным ощущением возможности;',
        'внимание удерживает память о красивом начале;',
        'повтор запускается через вспышку надежды, что всё может стать как тогда.',
      ],
      uz: [
        'aylana yorqin va tez, kuchli imkoniyat tuyg‘usi bilan boshlanadi;',
        'e’tiborni chiroyli boshlanish xotirasi ushlab turadi;',
        'takror hammasi yana o‘shanday bo‘ladi degan umid uchquni orqali ishga tushadi.',
      ],
    },
  },
  dver: {
    key: 'dver',
    title: { ru: 'Закрытая дверь', uz: 'Yopiq eshik' },
    insight: {
      ru: 'Вы стоите у двери, которую он не открывает — и не уходите, потому что иногда из-под двери слышен голос.',
      uz: 'U ochmayotgan eshik oldida turibsiz — va ketmayapsiz, chunki ba‘zan eshik ostidan ovoz eshitiladi.',
    },
    miniScene: {
      ru: 'Вы знаете его расписание, работу, привычки. Но не знаете, что он чувствует к вам. На прямой вопрос — улыбка, шутка, тёплый жест. Не ответ. И вы остаётесь.',
      uz: 'Siz uning jadvalini, ishini, odatlarini bilasiz. Lekin u sizga nima his qilishini bilmaysiz. To‘g‘ridan-to‘g‘ri savolga — tabassum, hazil, iliq imo-ishora. Javob emas. Va siz qolasiz.',
    },
    description: {
      ru: 'В ответах чаще проявился сценарий «Закрытая дверь». Здесь может быть ощущение присутствия без настоящей ясности: человек рядом фрагментами, но важная часть истории остаётся закрытой.',
      uz: 'Javoblarda ko‘proq «Yopiq eshik» stsenariysi namoyon bo‘ldi. Bu yerda haqiqiy aniqliksiz mavjudlik tuyg‘usi bo‘lishi mumkin.',
    },
    map: {
      start: { ru: 'через дистанцию и частичное сближение', uz: 'masofa va qisman yaqinlashish orqali' },
      hold:  { ru: 'ощущение, что дверь ещё может открыться', uz: 'eshik hali ochilishi mumkin degan tuyg‘u' },
      loop:  { ru: 'когда близость остаётся фрагментами', uz: 'yaqinlik parchalarda qolganda' },
    },
    markers: {
      ru: [
        'Есть фрагменты близости',
        'Важная часть остаётся закрытой',
        'Ожидание входа держит сценарий',
      ],
      uz: [
        'Yaqinlikning parchalari bor',
        'Muhim qism yopiq qoladi',
        'Kirishni kutish stsenariyni ushlab turadi',
      ],
    },
    keyQuestion: {
      ru: 'Где вы ждёте входа туда, где дверь пока не открывают?',
      uz: 'Eshik hali ochilmagan joyga kirishni qayerda kutyapsiz?',
    },
    cta: { ru: 'Разложить сценарий с Алтын', uz: 'Stsenariyni ALTYN bilan tahlil qilish' },
    bring: {
      ru: [
        'Один пример, где близость пришла фрагментом',
        'Дверь, к которой возвращаешься чаще всего',
        'Что должно появиться, чтобы перестать ждать у этой двери',
      ],
      uz: [
        'Yaqinlik parcha sifatida kelgan bitta misol',
        'Eng ko‘p qaytadigan eshik',
        'Bu eshik oldida kutishni to‘xtatish uchun nima kerak',
      ],
    },
    firstStep: {
      ru: 'Назвать одну дверь, у которой больше не нужно стоять, — и записать это себе одной строкой.',
      uz: 'Endi turish shart bo‘lmagan bitta eshikni nomlash — va buni o‘zingizga bitta qatorda yozish.',
    },
    prepQuestions: {
      ru: [
        'Какая дверь, у которой вы стоите дольше всего?',
        'Какие фрагменты близости вы уже точно получаете, а каких ждёте?',
        'Что должно появиться, чтобы перестать ждать у этой двери?',
      ],
      uz: [
        'Eng uzoq vaqt turgan eshigingiz qaysi?',
        'Yaqinlikning qaysi parchalarini aniq olyapsiz, qaysilarini kutyapsiz?',
        'Bu eshik oldida kutishni to‘xtatish uchun nima paydo bo‘lishi kerak?',
      ],
    },
    sessionPlan: {
      ru: [
        { time: '1 · 10 мин', text: 'Возьмём один фрагмент близости, который держит внимание.' },
        { time: '2 · 35 мин', text: 'Разделим, что действительно открыто, а что остаётся за закрытой дверью.' },
        { time: '3 · 15 мин', text: 'Сформулируем один шаг, который сохраняет ясность без ожидания у двери.' },
      ],
      uz: [
        { time: '1 · 10 daq.', text: 'E’tiborni ushlab turadigan bitta yaqinlik parchasini olamiz.' },
        { time: '2 · 35 daq.', text: 'Haqiqatan ochiq bo‘lgan va yopiq eshik ortida qolgan narsalarni ajratamiz.' },
        { time: '3 · 15 daq.', text: 'Eshik oldida kutmasdan aniqlikni saqlaydigan bitta qadamni tuzamiz.' },
      ],
    },
    whatsVisible: {
      ru: [
        'круг начинается с дистанции и частичного сближения;',
        'внимание удерживает ощущение, что дверь ещё может открыться;',
        'повтор запускается там, где близость остаётся фрагментами, а важная часть закрыта.',
      ],
      uz: [
        'aylana masofa va qisman yaqinlashishdan boshlanadi;',
        'e’tiborni eshik hali ochilishi mumkin degan tuyg‘u ushlab turadi;',
        'takror yaqinlik parchalarda qolgan, muhim qism yopiq joyda ishga tushadi.',
      ],
    },
  },
};

export const RESULT_DISCLAIMER = {
  ru: 'Это не ярлык и не вывод о человеке. Это рабочая карта динамики, которая могла откликнуться в ответах.',
  uz: 'Bu yorliq ham, inson haqida xulosa ham emas. Bu javoblarda aks etishi mumkin bo‘lgan dinamika ishchi xaritasi.',
};
