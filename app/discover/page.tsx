import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { MovieGrid } from '@/components/movie/movie-grid';
import { DiscoverFilterBar } from '@/components/discover/discover-filter-bar';
import { discoverMovies, getGenres } from '@/lib/tmdb/client';
import { DiscoverFilters } from '@/types/cinema';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Discover Cinema — Cinelio',
  description: 'Filter and discover films by genre, release year, minimum rating, and language.',
};

interface DiscoverPageProps {
  searchParams: Promise<{
    genreId?: string;
    year?: string;
    minRating?: string;
    language?: string;
    sortBy?: string;
    page?: string;
  }>;
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const resolved = await searchParams;
  const page = Math.max(1, parseInt(resolved.page || '1', 10));

  const activeFilters: DiscoverFilters = {
    genreId: resolved.genreId,
    year: resolved.year,
    minRating: resolved.minRating,
    language: resolved.language,
    sortBy: (resolved.sortBy as DiscoverFilters['sortBy']) || 'popularity.desc',
    page,
  };

  const [genres, moviesData] = await Promise.all([
    getGenres(),
    discoverMovies(activeFilters),
  ]);

  const movies = moviesData.results || [];
  const totalPages = Math.min(moviesData.total_pages || 1, 500);

  // Construct pagination query string preserving filters
  const buildPageUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    if (activeFilters.genreId) params.set('genreId', activeFilters.genreId);
    if (activeFilters.year) params.set('year', activeFilters.year);
    if (activeFilters.minRating) params.set('minRating', activeFilters.minRating);
    if (activeFilters.language) params.set('language', activeFilters.language);
    if (activeFilters.sortBy) params.set('sortBy', activeFilters.sortBy);
    params.set('page', String(targetPage));
    return `/discover?${params.toString()}`;
  };

  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Discover Cinema
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Refine through genres, historical periods, critical acclaim, and languages
          </p>
        </div>

        {/* Filter Bar */}
        <DiscoverFilterBar genres={genres} activeFilters={activeFilters} />

        {/* Results Count */}
        <div className="mb-4 text-xs font-mono text-muted-foreground">
          Showing {movies.length} {movies.length === 1 ? 'film' : 'films'}
          {moviesData.total_results > 0 && ` (${moviesData.total_results.toLocaleString()} total)`}
        </div>

        {/* Grid */}
        <MovieGrid
          movies={movies}
          emptyMessage="No films matched your filter combination. Try loosening rating or year parameters."
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-3">
            <Button
              asChild={page > 1}
              variant="outline"
              size="sm"
              disabled={page <= 1}
              className="gap-1.5 font-medium"
            >
              {page > 1 ? (
                <Link href={buildPageUrl(page - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Link>
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </>
              )}
            </Button>

            <span className="text-xs sm:text-sm font-medium text-muted-foreground px-2">
              Page <span className="text-foreground font-semibold">{page}</span> of{' '}
              <span className="text-foreground font-semibold">{totalPages}</span>
            </span>

            <Button
              asChild={page < totalPages}
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              className="gap-1.5 font-medium"
            >
              {page < totalPages ? (
                <Link href={buildPageUrl(page + 1)}>
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}
