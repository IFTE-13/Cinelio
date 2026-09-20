import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Clock,
  Calendar,
  ExternalLink,
  DollarSign,
  Globe,
  Film,
  Layers,
  Award,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { RatingBadge } from '@/components/ui/rating-badge';
import { FavoriteButton } from '@/components/movie/favorite-button';
import { TrailerModal } from '@/components/movie/trailer-modal';
import { PersonCard } from '@/components/person/person-card';
import { MovieRow } from '@/components/movie/movie-row';
import { RecordRecentlyViewed } from '@/components/movie/record-recently-viewed';
import { CinemaImage } from '@/components/ui/cinema-image';
import { MoviePosterFallback } from '@/components/ui/movie-poster-fallback';
import { BackdropFallback } from '@/components/ui/backdrop-fallback';
import { getMovieDetails } from '@/lib/tmdb/client';
import {
  getBackdropUrl,
  getPosterUrl,
  getYear,
  formatRuntime,
  formatCurrency,
} from '@/lib/tmdb/image';
import { Button } from '@/components/ui/button';

interface MovieDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: MovieDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const movie = await getMovieDetails(id);

  if (!movie) {
    return {
      title: 'Film Not Found — Cinelio',
    };
  }

  const year = getYear(movie.release_date);
  const posterUrl = getPosterUrl(movie.poster_path, 'w780');

  return {
    title: `${movie.title} (${year})`,
    description: movie.overview || `Discover details, cast, crew, and ratings for ${movie.title}.`,
    openGraph: {
      title: `${movie.title} (${year}) — Cinelio`,
      description: movie.overview,
      images: posterUrl ? [{ url: posterUrl }] : [],
    },
  };
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const { id } = await params;
  const movie = await getMovieDetails(id);

  if (!movie) {
    notFound();
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'original');
  const posterUrl = getPosterUrl(movie.poster_path, 'w780');
  const year = getYear(movie.release_date);

  // Separate key crew members
  const directors = movie.credits?.crew.filter((c) => c.job === 'Director') || [];
  const writers =
    movie.credits?.crew.filter((c) => ['Screenplay', 'Writer'].includes(c.job)) || [];
  const cinematographers =
    movie.credits?.crew.filter((c) => ['Director of Photography', 'Cinematography'].includes(c.job)) || [];
  const composers =
    movie.credits?.crew.filter((c) => ['Original Music Composer', 'Music'].includes(c.job)) || [];

  const topCast = movie.credits?.cast?.slice(0, 10) || [];

  return (
    <article className="pb-16">
      {/* Side effect: record recently viewed movie */}
      <RecordRecentlyViewed movie={movie} />

      {/* Cinematic Backdrop Header Banner */}
      <div className="relative w-full h-[380px] sm:h-[480px] md:h-[540px] lg:h-[580px] bg-card overflow-hidden">
        <CinemaImage
          src={backdropUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-40 dark:opacity-30 filter contrast-105"
          fallbackType="backdrop"
          fallbackTitle={movie.title}
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
      </div>

      {/* Main Content Area overlapping backdrop */}
      <Container className="-mt-48 sm:-mt-60 md:-mt-68 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Poster & Key Facts (4 cols) */}
          <div className="md:col-span-4 lg:col-span-4 space-y-6">
            {/* Poster Card */}
            <div className="relative aspect-[2/3] w-full max-w-[320px] mx-auto md:max-w-none rounded-xl overflow-hidden shadow-xl border border-border/80 bg-muted">
              <CinemaImage
                src={posterUrl}
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 320px, 380px"
                className="object-cover"
                fallbackType="poster"
                fallbackTitle={movie.title}
                fallbackYear={year}
              />
            </div>

            {/* Quick Actions for mobile/desktop */}
            <div className="flex flex-col gap-2.5 max-w-[320px] mx-auto md:max-w-none">
              <FavoriteButton movie={movie} variant="full" className="w-full justify-center" />
              {movie.videos?.results && (
                <TrailerModal
                  videos={movie.videos.results}
                  movieTitle={movie.title}
                />
              )}
              {movie.imdb_id && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground gap-1.5 w-full justify-center"
                >
                  <a
                    href={`https://www.imdb.com/title/${movie.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>View on IMDb</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </Button>
              )}
            </div>

            {/* Key Facts Box */}
            <div className="rounded-xl border border-border/70 bg-card p-5 space-y-4 text-xs">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground border-b border-border/60 pb-2">
                Key Details
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-muted-foreground block">Release Status</span>
                  <span className="font-medium text-foreground">{movie.status || 'Released'}</span>
                </div>

                <div>
                  <span className="text-muted-foreground block">Release Date</span>
                  <span className="font-medium text-foreground">{movie.release_date || '—'}</span>
                </div>

                <div>
                  <span className="text-muted-foreground block">Language</span>
                  <span className="font-medium text-foreground uppercase">
                    {movie.original_language || 'EN'}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block">Runtime</span>
                  <span className="font-medium text-foreground">
                    {formatRuntime(movie.runtime)}
                  </span>
                </div>

                {movie.budget > 0 && (
                  <div>
                    <span className="text-muted-foreground block">Budget</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(movie.budget)}
                    </span>
                  </div>
                )}

                {movie.revenue > 0 && (
                  <div>
                    <span className="text-muted-foreground block">Revenue</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(movie.revenue)}
                    </span>
                  </div>
                )}
              </div>

              {movie.production_companies && movie.production_companies.length > 0 && (
                <div className="pt-2 border-t border-border/40">
                  <span className="text-muted-foreground block mb-1">Production</span>
                  <p className="font-medium text-foreground line-clamp-2">
                    {movie.production_companies.map((c) => c.name).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Title, Tagline, Story, Cast, Crew (8 cols) */}
          <div className="md:col-span-8 lg:col-span-8 space-y-8">
            {/* Header / Title block */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                <RatingBadge
                  rating={movie.vote_average}
                  votes={movie.vote_count}
                  size="md"
                />
                <span className="text-muted-foreground">•</span>
                <span className="font-mono text-muted-foreground">{year}</span>
                {movie.runtime > 0 && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {formatRuntime(movie.runtime)}
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="text-base sm:text-lg italic text-muted-foreground font-serif">
                  "{movie.tagline}"
                </p>
              )}

              {/* Genres chips */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {movie.genres.map((g) => (
                    <Link
                      key={g.id}
                      href={`/genres/${g.id}`}
                      className="px-3 py-1 rounded-full text-xs font-medium border border-border/80 bg-secondary/60 hover:bg-secondary transition-colors text-foreground"
                    >
                      {g.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Synopsis / Overview */}
            <div className="space-y-2">
              <h2 className="text-base font-semibold uppercase tracking-wider text-foreground">
                Overview
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-3xl">
                {movie.overview || 'No synopsis provided for this film.'}
              </p>
            </div>

            {/* Key Creative Crew */}
            {(directors.length > 0 || writers.length > 0 || cinematographers.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-y border-border/60 py-5">
                {directors.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground block font-medium">
                      Director
                    </span>
                    <div className="font-semibold text-sm text-foreground mt-0.5">
                      {directors.map((d, i) => (
                        <Link
                          key={d.id || i}
                          href={`/people/${d.id}`}
                          className="hover:underline hover:text-primary block"
                        >
                          {d.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {writers.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground block font-medium">
                      Writing & Screenplay
                    </span>
                    <div className="font-semibold text-sm text-foreground mt-0.5">
                      {writers.slice(0, 2).map((w, i) => (
                        <Link
                          key={w.id || i}
                          href={`/people/${w.id}`}
                          className="hover:underline hover:text-primary block"
                        >
                          {w.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {cinematographers.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground block font-medium">
                      Cinematography
                    </span>
                    <div className="font-semibold text-sm text-foreground mt-0.5">
                      {cinematographers.slice(0, 1).map((c, i) => (
                        <Link
                          key={c.id || i}
                          href={`/people/${c.id}`}
                          className="hover:underline hover:text-primary block"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cast Section */}
            {topCast.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    Principal Cast
                  </h2>
                  <span className="text-xs text-muted-foreground font-mono">
                    {movie.credits?.cast.length} credited
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {topCast.map((actor) => (
                    <PersonCard key={actor.id} person={actor} />
                  ))}
                </div>
              </div>
            )}

            {/* Franchise Collection Card */}
            {movie.belongs_to_collection && (
              <div className="rounded-xl border border-border/80 bg-card p-5 sm:p-6 space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  <span>Part of Franchise</span>
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {movie.belongs_to_collection.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Explore chronological sequels, prequels, and companion films in this cinematic universe.
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="shrink-0 font-medium">
                    <Link href={`/collections/${movie.belongs_to_collection.id}`}>
                      View Collection →
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Movies */}
        {movie.similar?.results && movie.similar.results.length > 0 && (
          <div className="mt-16">
            <MovieRow
              title="Similar Films"
              subtitle="Films sharing thematic motifs, stylistic approach, or genre roots"
              movies={movie.similar.results}
            />
          </div>
        )}

        {/* Recommendations */}
        {movie.recommendations?.results && movie.recommendations.results.length > 0 && (
          <div className="mt-6">
            <MovieRow
              title="Recommended for You"
              subtitle="Viewers who explored this title also appreciated"
              movies={movie.recommendations.results}
            />
          </div>
        )}
      </Container>
    </article>
  );
}
