import type { Metadata } from 'next';
import { Inter, Manrope, Instrument_Serif } from 'next/font/google';
import { GeistMono } from 'geist/font/mono';
import '../styles/globals.css';
import { Header, Footer } from '@/components/layout';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ScrollProgress } from '@/components/common/ScrollProgress';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

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
      className={`${inter.variable} ${manrope.variable} ${instrumentSerif.variable} ${GeistMono.variable}`}
      style={{
        ['--font-inter' as string]: inter.style.fontFamily,
        ['--font-manrope' as string]: manrope.style.fontFamily,
        ['--font-instrument-serif' as string]: instrumentSerif.style.fontFamily,
        ['--font-geist-mono' as string]: GeistMono.style.fontFamily,
      }}
    >
      <body className="font-sans antialiased bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ScrollProgress />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
