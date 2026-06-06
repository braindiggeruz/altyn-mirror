'use client';
import { LegalShell } from '@/components/LegalShell';

export default function Terms() {
  return (
    <LegalShell title="Условия использования · Foydalanish shartlari" testid="terms-page">
      <p><strong>RU.</strong> Используя ALTYN Mirror, вы соглашаетесь с тем, что этот инструмент создан для целей личной рефлексии и подготовки к личному онлайн-разбору. Это не медицинская, не диагностическая и не психотерапевтическая услуга. Если вам необходима экстренная помощь, обратитесь к специалистам соответствующих служб в вашем регионе.</p>
      <p>Результат, который вы видите, не является ярлыком или выводом о человеке. Это рабочая карта динамики, которая могла откликнуться в ответах. Окончательные решения принимаете вы сами.</p>
      <p>Запись на личный онлайн-разбор и любые денежные расчёты происходят за пределами этого сайта — через Telegram-бот @altyntherapybot и/или операторов, упомянутых в боте. Стоимость и формат указываются на момент записи.</p>
      <p>Мы оставляем за собой право улучшать формулировки, дизайн и логику продукта.</p>
      <hr className="border-gold/15" />
      <p><strong>UZ.</strong> ALTYN Mirror’dan foydalanib, siz ushbu vosita shaxsiy mulohaza va shaxsiy onlayn tahlilga tayyorgarlik uchun yaratilganini tasdiqlaysiz. Bu tibbiy, tashxisiy yoki psixoterapevtik xizmat emas.</p>
      <p>Yozilish va to‘lovlar sayt tashqarisida — Telegram-bot orqali amalga oshiriladi.</p>
    </LegalShell>
  );
}
