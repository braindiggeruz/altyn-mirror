import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { META_PIXEL_ID } from '@/lib/tracking';

const serif = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-serif',
});

const sans = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-sans',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://altyn-mirror.pages.dev';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'ALTYN Mirror — Карта повторяющегося сценария',
  description: 'Откройте карту сценария отношений за 60 секунд. Бережно, конфиденциально, онлайн.',
  applicationName: 'ALTYN Mirror',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'ALTYN Mirror',
    title: 'ALTYN Mirror — Карта повторяющегося сценария',
    description: 'Откройте карту сценария отношений за 60 секунд. Бережно, конфиденциально, онлайн.',
    url: SITE_URL,
    images: [{ url: '/og.svg', width: 1200, height: 630, alt: 'ALTYN Mirror' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ALTYN Mirror — Карта повторяющегося сценария',
    description: 'Откройте карту сценария отношений за 60 секунд.',
    images: ['/og.svg'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#070708',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${serif.variable} ${sans.variable}`}>
      <body>
        {/* Meta Pixel — base init only. PageView is fired manually per-page (no Lead on homepage). */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
          n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
          document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt="" />
        </noscript>

        <div className="grain" aria-hidden="true" />
        <div className="vignette" aria-hidden="true" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
