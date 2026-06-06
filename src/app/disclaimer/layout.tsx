import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Оговорка · Ogohlantirish · ALTYN Mirror',
  robots: { index: false, follow: true },
};

export default function DisclaimerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
