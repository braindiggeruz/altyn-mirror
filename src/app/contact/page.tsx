'use client';
import { LegalShell } from '@/components/LegalShell';

export default function Contact() {
  return (
    <LegalShell title="Контакты · Aloqa" testid="contact-page">
      <p><strong>RU.</strong> Связаться с командой ALTYN Mirror проще всего через Telegram-бот <a className="text-gold underline-offset-2 hover:underline" href="https://t.me/altyntherapybot" target="_blank" rel="noopener noreferrer">@altyntherapybot</a>. В боте можно задать вопросы и записаться на личный онлайн-разбор сценария.</p>
      <p>Любые рабочие письма / партнёрские запросы — также через Telegram-бот.</p>
      <hr className="border-gold/15" />
      <p><strong>UZ.</strong> ALTYN Mirror jamoasi bilan bog‘lanish uchun Telegram-bot <a className="text-gold underline-offset-2 hover:underline" href="https://t.me/altyntherapybot" target="_blank" rel="noopener noreferrer">@altyntherapybot</a> orqali murojaat qiling. Bot orqali savol berishingiz va shaxsiy onlayn tahlilga yozilishingiz mumkin.</p>
    </LegalShell>
  );
}
