import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '../styles/globals.css';
import { Header, Footer } from '@/components/layout';

export const metadata: Metadata = {
  title: {
    default: 'CIUS - Enterprise Solutions',
    template: '%s | CIUS',
  },
  description: 'Professional enterprise website built with Next.js 16, TypeScript, and TailwindCSS',
  keywords: ['CIUS', 'enterprise', 'business', 'solutions'],
  authors: [{ name: 'CIUS Team' }],
  icons: {
    icon: '/favicon.svg',
    apple: '/logo.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'CIUS - Enterprise Solutions',
    description: 'Professional enterprise website',
    type: 'website',
    locale: 'en_US',
    siteName: 'CIUS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CIUS - Enterprise Solutions',
    description: 'Professional enterprise website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      style={{
        ['--font-geist-sans' as string]: GeistSans.style.fontFamily,
        ['--font-geist-mono' as string]: GeistMono.style.fontFamily,
      }}
    >
      <body className="font-sans antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
