'use client';
import { LegalShell } from '@/components/LegalShell';

export default function Disclaimer() {
  return (
    <LegalShell title="Оговорка · Ogohlantirish" testid="disclaimer-page">
      <p data-testid="disclaimer-core" className="text-ivory/95">
        <strong>RU.</strong> ALTYN Mirror is not a medical, diagnostic, psychotherapy, emergency, or treatment service.
        It is a self-reflection and personal review preparation tool.
      </p>
      <p>ALTYN Mirror — это инструмент личной рефлексии и подготовки к личному онлайн-разбору. Это не медицинская услуга, не диагностика и не лечение. Если вы переживаете острое состояние или вам нужна срочная помощь, обратитесь к специалистам соответствующих служб в вашем регионе.</p>
      <p>Карта сценария — это рабочая визуализация динамики, которая могла откликнуться в ответах. Это не ярлык и не вывод о человеке.</p>
      <hr className="border-gold/15" />
      <p><strong>UZ.</strong> ALTYN Mirror tibbiy, tashxis, psixoterapevtik, favqulodda yoki davolash xizmati emas. Bu shaxsiy mulohaza va shaxsiy onlayn tahlilga tayyorgarlik vositasi.</p>
    </LegalShell>
  );
}
