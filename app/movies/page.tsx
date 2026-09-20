import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { MovieGrid } from '@/components/movie/movie-grid';
import { CatalogCategoryTabs } from '@/components/movie/catalog-category-tabs';
import { Button } from '@/components/ui/button';
import {
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getTrendingMovies,
} from '@/lib/tmdb/client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Movie Catalog — Cinelio',
  description: 'Browse popular, top-rated, now playing, and upcoming films in the Cinelio catalog.',
};

interface MoviesPageProps {
  searchParams: Promise<{
    category?: string;
    page?: string;
  }>;
}

export default async function MoviesPage({ searchParams }: MoviesPageProps) {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category || 'popular';
  const page = Math.max(1, parseInt(resolvedParams.page || '1', 10));

  const categories = [
    { id: 'popular', label: 'Popular' },
    { id: 'top_rated', label: 'Top Rated' },
    { id: 'now_playing', label: 'In Theaters' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'trending', label: 'Trending' },
  ];

  let data;
  switch (category) {
    case 'top_rated':
      data = await getTopRatedMovies(page);
      break;
    case 'now_playing':
      data = await getNowPlayingMovies(page);
      break;
    case 'upcoming':
      data = await getUpcomingMovies(page);
      break;
    case 'trending':
      data = await getTrendingMovies('week', page);
      break;
    case 'popular':
    default:
      data = await getPopularMovies(page);
      break;
  }

  const movies = data.results || [];
  const totalPages = Math.min(data.total_pages || 1, 500);

  const categoryTitles: Record<string, { title: string; desc: string }> = {
    popular: {
      title: 'Popular Cinema',
      desc: 'Most viewed and discussed films currently capturing attention',
    },
    top_rated: {
      title: 'Top Rated Films',
      desc: 'The highest-acclaimed cinematic works ranked by global filmgoers',
    },
    now_playing: {
      title: 'Now in Theaters',
      desc: 'Films actively playing on screens worldwide',
    },
    upcoming: {
      title: 'Upcoming Releases',
      desc: 'Anticipated productions scheduled for cinematic release',
    },
    trending: {
      title: 'Trending This Week',
      desc: 'Films with the strongest surge in viewership and interest',
    },
  };

  const currentInfo = categoryTitles[category] || categoryTitles.popular;

  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* Page Header */}
        <div className="space-y-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {currentInfo.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {currentInfo.desc}
            </p>
          </div>

          {/* Animated Category Tabs */}
          <CatalogCategoryTabs
            categories={categories}
            activeCategory={category}
          />
        </div>

        {/* Movie Grid */}
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
                <Link href={`/movies?category=${category}&page=${page - 1}`}>
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

            <span className="text-xs sm:text-sm font-medium text-muted-foreground px-2 font-mono">
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
                <Link href={`/movies?category=${category}&page=${page + 1}`}>
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
