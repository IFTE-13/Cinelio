import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Movie } from '@/types/cinema';
import { getPosterUrl, getYear } from '@/lib/tmdb/image';
import { RatingBadge } from '@/components/ui/rating-badge';
import { FavoriteButton } from '@/components/movie/favorite-button';
import { MoviePosterFallback } from '@/components/ui/movie-poster-fallback';

interface CollectionPartsProps {
  parts: Movie[];
}

export function CollectionParts({ parts }: CollectionPartsProps) {
  // Sort chronological
  const sortedParts = [...parts].sort((a, b) => {
    const dA = a.release_date || '9999';
    const dB = b.release_date || '9999';
    return dA.localeCompare(dB);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sortedParts.map((movie, index) => {
        const posterUrl = getPosterUrl(movie.poster_path, 'w500');
        const year = getYear(movie.release_date);

        return (
          <div
            key={movie.id}
            className="group relative flex gap-4 p-3 rounded-lg border border-border/60 bg-card hover:border-border transition-colors"
          >
            {/* Poster */}
            <div className="relative aspect-[2/3] w-20 sm:w-24 shrink-0 overflow-hidden rounded-md bg-muted">
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt={movie.title}
                  fill
                  sizes="96px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <MoviePosterFallback
                  title={movie.title}
                  year={getYear(movie.release_date)}
                  variant="compact"
                />
              )}
            </div>

            {/* Information */}
            <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">
                    Part {index + 1} • {year}
                  </span>
                  {movie.vote_average > 0 && (
                    <RatingBadge rating={movie.vote_average} size="sm" />
                  )}
                </div>

                <Link
                  href={`/movies/${movie.id}`}
                  className="text-base font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1"
                >
                  {movie.title}
                </Link>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {movie.overview}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link
                  href={`/movies/${movie.id}`}
                  className="text-xs font-medium text-foreground hover:underline"
                >
                  View Details →
                </Link>
                <FavoriteButton movie={movie} variant="card-icon" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
