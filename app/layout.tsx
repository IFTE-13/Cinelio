import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeAccentProvider } from '@/contexts/theme-accent-context';
import { FavoritesProvider } from '@/contexts/favorites-context';
import { RecentlyViewedProvider } from '@/contexts/recently-viewed-context';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Cinelio — Explore cinema',
    template: '%s | Cinelio',
  },
  description:
    'A modern cinema database and discovery catalog. Explore trending films, critical ratings, cast filmographies, and cinema collections.',
  keywords: ['cinema', 'movies', 'film database', 'directors', 'actors', 'film discovery', 'Cinelio'],
  authors: [{ name: 'Cinelio' }],
  openGraph: {
    title: 'Cinelio — Explore cinema',
    description: 'A modern cinema database and discovery catalog.',
    type: 'website',
    siteName: 'Cinelio',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(inter.variable, 'font-sans antialiased')}>
      <body className="min-h-screen flex flex-col bg-background text-foreground selection:bg-amber-500/20">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeAccentProvider>
            <FavoritesProvider>
              <RecentlyViewedProvider>
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </RecentlyViewedProvider>
            </FavoritesProvider>
          </ThemeAccentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}