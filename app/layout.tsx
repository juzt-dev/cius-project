import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Header, Footer } from '@/components/layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CIUS - Corporate Web Application',
  description: 'Professional enterprise website built with Next.js 15, TypeScript, and TailwindCSS',
  keywords: ['CIUS', 'enterprise', 'business', 'solutions'],
  authors: [{ name: 'CIUS Team' }],
  icons: {
    icon: '/favicon.svg',
    apple: '/logo.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'CIUS - Corporate Web Application',
    description: 'Professional enterprise website',
    type: 'website',
    locale: 'en_US',
    siteName: 'CIUS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CIUS - Corporate Web Application',
    description: 'Professional enterprise website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
