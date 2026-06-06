'use client';
import { LegalShell } from '@/components/LegalShell';

export default function Privacy() {
  return (
    <LegalShell title="Конфиденциальность · Maxfiylik" testid="privacy-page">
      <p><strong>RU.</strong> ALTYN Mirror — это инструмент личной рефлексии и подготовки к личному онлайн-разбору. Это не медицинская услуга, не диагностика и не лечение.</p>
      <p>Какие данные могут сохраняться локально в вашем браузере (localStorage): идентификатор сессии, выбранный язык, путь ответов, тип результата, метки кампаний (UTM, fbclid) и токен, который используется только для связи вашего результата с Telegram-ботом ALTYN.</p>
      <p>Эти данные хранятся в вашем устройстве. Если вы не нажимаете на CTA-кнопку перехода в Telegram, никаких данных мы не передаём третьим сторонам. Переход в Telegram — добровольный шаг, осуществляется по вашему явному действию.</p>
      <p>Мы используем Meta Pixel для агрегированной статистики посещений и оптимизации рекламы. Pixel может устанавливать cookie. На главной странице событие &laquo;Lead&raquo; не срабатывает.</p>
      <p>На сайте нет приёма платежей. Запись на личный онлайн-разбор и оплата происходят через Telegram-бот.</p>
      <p>Вы можете очистить локальные данные в любой момент через настройки браузера.</p>
      <hr className="border-gold/15" />
      <p><strong>UZ.</strong> ALTYN Mirror — bu shaxsiy mulohaza va shaxsiy onlayn tahlilga tayyorgarlik vositasi. Bu tibbiy xizmat, tashxis yoki davolanish emas.</p>
      <p>Brauzeringizda mahalliy ravishda saqlanishi mumkin bo‘lgan ma’lumotlar: sessiya identifikatori, til, javoblar yo‘li, natija turi, kampaniya teglari (UTM, fbclid) va natijangizni ALTYN Telegram-bot bilan bog‘lash uchun token. Ushbu ma’lumotlar qurilmangizda saqlanadi.</p>
      <p>Saytda to‘lov qabul qilinmaydi. Yozilish va to‘lov Telegram-bot orqali amalga oshiriladi.</p>
    </LegalShell>
  );
}
