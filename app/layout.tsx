import type { Metadata } from 'next';
import { Inter, Manrope, Instrument_Serif } from 'next/font/google';
import { GeistMono } from 'geist/font/mono';
import '../styles/globals.css';
import { Header, Footer } from '@/components/layout';
import { ScrollProgress } from '@/components/common/ScrollProgress';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { LenisProvider } from '@/components/providers/lenis-provider';

// Inter font as fallback for PP Neutral
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
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
      className={`${inter.variable} ${manrope.variable} ${instrumentSerif.variable} ${GeistMono.variable} dark`}
    >
      <body
        className="font-sans antialiased bg-background text-foreground"
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'dark';
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  const resolvedTheme = theme === 'system' ? systemTheme : theme;
                  const html = document.documentElement;
                  html.classList.add(resolvedTheme);
                  html.style.colorScheme = resolvedTheme;
                } catch (e) {
                  const html = document.documentElement;
                  html.classList.add('dark');
                  html.style.colorScheme = 'dark';
                }
              })();
            `,
          }}
        />
        <LenisProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <ScrollProgress />
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </ThemeProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
