import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Конфиденциальность · Maxfiylik · ALTYN Mirror',
  robots: { index: false, follow: true },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
