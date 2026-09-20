import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getGenres,
  isTmdbConfigured,
} from '@/lib/tmdb/client';
import { Container } from '@/components/layout/container';
import { FeaturedHero } from '@/components/movie/featured-hero';
import { MovieRow } from '@/components/movie/movie-row';
import { GenreBrowseSection } from '@/components/movie/genre-browse-section';
import { RecentlyViewedRow } from '@/components/movie/recently-viewed-row';
import { Info, Sparkles, Compass, Flame, History } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cinelio — Explore cinema',
  description: 'A thoughtful, vibrant cinema discovery database. Explore trending, acclaimed, and upcoming movies.',
};

export const revalidate = 3600; // Revalidate page every hour

export default async function HomePage() {
  const [trending, popular, topRated, nowPlaying, upcoming, genres] = await Promise.all([
    getTrendingMovies('day', 1),
    getPopularMovies(1),
    getTopRatedMovies(1),
    getNowPlayingMovies(1),
    getUpcomingMovies(1),
    getGenres(),
  ]);

  const hasApiKey = isTmdbConfigured();
  // Select top 5 for the interactive spotlight carousel
  const spotlightMovies = trending.results.slice(0, 5).length > 0
    ? trending.results.slice(0, 5)
    : popular.results.slice(0, 5);

  return (
    <div className="pb-16">
      {/* 1. Full-Screen Edge-to-Edge Spotlight Hero without outer margins/paddings */}
      <FeaturedHero
        movies={spotlightMovies}
        allGenres={genres}
      />

      <Container>
        {/* Subtle API Key Setup notice if running in demo mode */}
        {!hasApiKey && (
          <div className="mt-6 mb-2 flex items-center justify-between gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-900 dark:text-amber-200 shadow-xs">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>
                Exploring in <strong>Curated Cinema Mode</strong>. Add your{' '}
                <code className="rounded bg-amber-500/20 px-1 py-0.5 font-mono text-[11px]">
                  TMDB_API_KEY
                </code>{' '}
                to <code className="font-mono text-[11px]">.env.local</code> to query the live TMDB database.
              </span>
            </div>
          </div>
        )}

        {/* 2. Cinema Pulse & Quick Discovery Strip */}
        <div className="my-8 p-3 sm:p-4 rounded-xl border border-border/70 bg-card/60 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            <span className="font-semibold text-foreground">Archive Pulse:</span>
            <span className="text-muted-foreground">
              {trending.total_results.toLocaleString()} films indexed • High-fidelity metadata & trailers
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/discover"
              className="font-medium text-foreground hover:text-[var(--theme-accent)] transition-colors inline-flex items-center gap-1"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="/moods"
              className="font-medium text-foreground hover:text-[var(--theme-accent)] transition-colors inline-flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Moods</span>
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="/eras"
              className="font-medium text-foreground hover:text-[var(--theme-accent)] transition-colors inline-flex items-center gap-1"
            >
              <History className="w-3.5 h-3.5" />
              <span>Eras</span>
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="/directors"
              className="font-medium text-foreground hover:text-[var(--theme-accent)] transition-colors inline-flex items-center gap-1"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Auteurs</span>
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="/genres"
              className="font-medium text-foreground hover:text-[var(--theme-accent)] transition-colors"
            >
              19 Genres →
            </Link>
          </div>
        </div>

        {/* 3. Trending Movies */}
        <MovieRow
          title="Trending Today"
          subtitle="Films capturing audiences across the globe right now"
          movies={trending.results}
          viewAllHref="/movies?category=trending"
        />

        {/* 4. Popular Releases */}
        <MovieRow
          title="Popular Releases"
          subtitle="Widely watched and discussed contemporary films"
          movies={popular.results}
          viewAllHref="/movies?category=popular"
        />

        {/* 5. Top Rated Movies */}
        <MovieRow
          title="All-Time Classics & Top Rated"
          subtitle="The highest-rated cinematic achievements in film history"
          movies={topRated.results}
          viewAllHref="/movies?category=top_rated"
        />

        {/* 6. Now Playing in Theaters */}
        <MovieRow
          title="Now in Theaters"
          subtitle="Current theatrical engagements and fresh cinema releases"
          movies={nowPlaying.results}
          viewAllHref="/movies?category=now_playing"
        />

        {/* 7. Upcoming Films */}
        <MovieRow
          title="Anticipated & Upcoming"
          subtitle="Highly anticipated cinematic works arriving soon"
          movies={upcoming.results}
          viewAllHref="/movies?category=upcoming"
        />

        {/* 8. Browse by Genre */}
        <GenreBrowseSection genres={genres} />

        {/* 9. Recently Viewed (Client Hydrated) */}
        <RecentlyViewedRow />
      </Container>
    </div>
  );
}