import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { CinemaImage } from '@/components/ui/cinema-image';
import { notFound } from 'next/navigation';
import { getEraById, getAllEras } from '@/lib/tmdb/eras';
import { discoverMovies } from '@/lib/tmdb/client';
import { Container } from '@/components/layout/container';
import { MovieCard } from '@/components/movie/movie-card';
import { getBackdropUrl } from '@/lib/tmdb/image';
import { History, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowLeft, Star, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DiscoverFilters } from '@/types/cinema';

interface EraPageProps {
  params: Promise<{
    era: string;
  }>;
  searchParams: Promise<{
    sortBy?: string;
    page?: string;
  }>;
}

export async function generateStaticParams() {
  return getAllEras().map((era) => ({
    era: era.id,
  }));
}

export async function generateMetadata({ params }: EraPageProps): Promise<Metadata> {
  const { era: eraId } = await params;
  const era = getEraById(eraId);
  if (!era) return { title: 'Era Not Found | Cinelio' };

  return {
    title: `${era.decade}: ${era.name} | Cinelio`,
    description: era.description,
  };
}

export const revalidate = 3600;

export default async function EraDetailPage({ params, searchParams }: EraPageProps) {
  const { era: eraId } = await params;
  const resolvedSearchParams = await searchParams;
  const era = getEraById(eraId);

  if (!era) {
    notFound();
  }

  const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
  const currentSort =
    (resolvedSearchParams.sortBy as DiscoverFilters['sortBy']) || 'vote_average.desc';

  // Discover movies from this decade
  const moviesData = await discoverMovies({
    releaseDateGte: era.releaseDateGte,
    releaseDateLte: era.releaseDateLte,
    sortBy: currentSort,
    minRating: '7.0',
    page: currentPage,
  });

  const allEras = getAllEras();
  const backdrop = getBackdropUrl(era.backdropUrl, 'original');

  return (
    <div className="pb-16 space-y-10">
      {/* Era Cinematic Hero Header */}
      <div className="relative min-h-[380px] w-full overflow-hidden bg-background border-b border-border/80 flex items-center">
        <CinemaImage
          src={backdrop}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover filter brightness-[0.35] blur-[1px]"
          fallbackType="backdrop"
          fallbackTitle={era.name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <Container className="relative z-10 py-12">
          {/* Breadcrumb / Back Link */}
          <div className="mb-4">
            <Link
              href="/eras"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Cinema Eras</span>
            </Link>
          </div>

          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border/80 text-xs font-bold tracking-wider uppercase">
              <span
                style={{ backgroundColor: era.themeColor }}
                className="w-2 h-2 rounded-full"
              />
              <span className="text-foreground">{era.years}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
              {era.name}
            </h1>

            <p className="text-sm sm:text-base font-serif italic text-muted-foreground/90">
              "{era.tagline}"
            </p>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {era.lore}
            </p>

            {/* Key Auteurs & Hallmarks */}
            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <div>
                <span className="font-semibold text-foreground">Defining Directors: </span>
                {era.keyFilmmakers.join(', ')}
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        {/* Era Navigation Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-border/60">
          <span className="text-xs font-semibold text-muted-foreground uppercase shrink-0 mr-2 flex items-center gap-1">
            <History className="w-3.5 h-3.5" />
            <span>Time Machine:</span>
          </span>
          {allEras.map((item) => {
            const isSelected = item.id === era.id;
            return (
              <Link
                key={item.id}
                href={`/eras/${item.id}`}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[var(--theme-accent)] text-primary-foreground shadow-md'
                    : 'bg-secondary/70 text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {item.decade}
              </Link>
            );
          })}
        </div>

        {/* Toolbar Bar: Results count & Sort */}
        <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Acclaimed Films of the {era.decade}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Showing high-rated landmark works released between {era.years}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </span>
            <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-lg border border-border/60 text-xs">
              <Link
                href={`/eras/${era.id}?sortBy=vote_average.desc`}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  currentSort === 'vote_average.desc'
                    ? 'bg-card text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Highest Rated
              </Link>
              <Link
                href={`/eras/${era.id}?sortBy=popularity.desc`}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  currentSort === 'popularity.desc'
                    ? 'bg-card text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Most Popular
              </Link>
              <Link
                href={`/eras/${era.id}?sortBy=primary_release_date.desc`}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  currentSort === 'primary_release_date.desc'
                    ? 'bg-card text-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Chronological
              </Link>
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        {moviesData.results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {moviesData.results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} priority={false} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center rounded-2xl border border-dashed border-border p-8">
            <Film className="w-10 h-10 mx-auto text-muted-foreground/60 mb-3" />
            <p className="text-sm font-semibold text-foreground">No films found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting sorting or exploring another cinema era.
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {moviesData.total_pages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            {currentPage > 1 ? (
              <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
                <Link
                  href={`/eras/${era.id}?page=${currentPage - 1}&sortBy=${currentSort}`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled className="gap-1.5 text-xs opacity-40">
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>
            )}

            <span className="text-xs font-mono font-medium text-muted-foreground">
              Page {currentPage} of {Math.min(moviesData.total_pages, 20)}
            </span>

            {currentPage < moviesData.total_pages ? (
              <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
                <Link
                  href={`/eras/${era.id}?page=${currentPage + 1}&sortBy=${currentSort}`}
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled className="gap-1.5 text-xs opacity-40">
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
