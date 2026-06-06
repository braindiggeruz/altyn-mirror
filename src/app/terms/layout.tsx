import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Условия · Shartlar · ALTYN Mirror',
  robots: { index: false, follow: true },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
