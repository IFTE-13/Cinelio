import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { MovieGrid } from '@/components/movie/movie-grid';
import { discoverMovies, getGenres } from '@/lib/tmdb/client';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';

interface GenreDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    page?: string;
    sortBy?: 'popularity.desc' | 'vote_average.desc' | 'primary_release_date.desc' | 'title.asc';
  }>;
}

export async function generateMetadata({
  params,
}: GenreDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const genres = await getGenres();
  const genre = genres.find((g) => String(g.id) === id);

  if (!genre) {
    return {
      title: 'Genre Not Found — Cinelio',
    };
  }

  return {
    title: `${genre.name} Films — Cinelio`,
    description: `Discover the top rated and popular ${genre.name} films in the Cinelio cinema catalog.`,
  };
}

export default async function GenreDetailPage({
  params,
  searchParams,
}: GenreDetailPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const page = Math.max(1, parseInt(resolvedSearchParams.page || '1', 10));
  const sortBy = resolvedSearchParams.sortBy || 'popularity.desc';

  const [genres, moviesData] = await Promise.all([
    getGenres(),
    discoverMovies({
      genreId: id,
      page,
      sortBy,
    }),
  ]);

  const genre = genres.find((g) => String(g.id) === id);
  if (!genre) {
    notFound();
  }

  const movies = moviesData.results || [];
  const totalPages = Math.min(moviesData.total_pages || 1, 500);

  const sortOptions = [
    { value: 'popularity.desc', label: 'Most Popular' },
    { value: 'vote_average.desc', label: 'Highest Rated' },
    { value: 'primary_release_date.desc', label: 'Newest First' },
    { value: 'title.asc', label: 'Title (A-Z)' },
  ];

  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-border/80 pb-6">
          <div className="space-y-1">
            <Link
              href="/genres"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Genres</span>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {genre.name} Cinema
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {moviesData.total_results.toLocaleString()} titles cataloged in this classification
            </p>
          </div>

          {/* Sort Switcher */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted-foreground">Sort:</span>
            <div className="flex flex-wrap gap-1">
              {sortOptions.map((opt) => (
                <Button
                  key={opt.value}
                  asChild
                  variant={sortBy === opt.value ? 'secondary' : 'ghost'}
                  size="sm"
                  className="text-xs h-7 px-2.5 rounded-full"
                >
                  <Link href={`/genres/${id}?sortBy=${opt.value}&page=1`}>
                    {opt.label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        <MovieGrid movies={movies} />

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
                <Link href={`/genres/${id}?sortBy=${sortBy}&page=${page - 1}`}>
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
                <Link href={`/genres/${id}?sortBy=${sortBy}&page=${page + 1}`}>
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
