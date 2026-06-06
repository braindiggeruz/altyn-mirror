import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Контакты · Aloqa · ALTYN Mirror',
  robots: { index: false, follow: true },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
