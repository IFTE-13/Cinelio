'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Film, Eye } from 'lucide-react';
import { Movie } from '@/types/cinema';
import { getPosterUrl, getYear } from '@/lib/tmdb/image';
import { RatingBadge } from '@/components/ui/rating-badge';
import { FavoriteButton } from './favorite-button';
import { QuickViewModal } from './quick-view-modal';
import { MoviePosterFallback } from '@/components/ui/movie-poster-fallback';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  priority?: boolean;
  className?: string;
  showOverview?: boolean;
}

export function MovieCard({
  movie,
  priority = false,
  className,
}: MovieCardProps) {
  const [imageError, setImageError] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const posterUrl = getPosterUrl(movie.poster_path, 'w500');
  const year = getYear(movie.release_date);

  return (
    <>
      <div
        className={cn(
          'group relative flex flex-col rounded-xl transition-colors duration-200',
          className
        )}
      >
        {/* Poster Media Box with clean theme-accent border and zero cropped rings */}
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-muted border border-border/70 group-hover:border-[var(--theme-accent)] group-focus-within:border-[var(--theme-accent)] transition-all duration-200 group-hover:shadow-[0_8px_24px_var(--theme-accent-subtle)]">
          {posterUrl && !imageError ? (
            <Image
              src={posterUrl}
              alt={movie.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1536px) 20vw, 15vw"
              className="object-cover transition-opacity duration-300 group-hover:opacity-95"
              priority={priority}
              onError={() => setImageError(true)}
            />
          ) : (
            <MoviePosterFallback title={movie.title} year={year} variant="card" />
          )}

          {/* Subtle dark vignette on hover */}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

          {/* Top-Right Favorite Button */}
          <div className="absolute top-2 right-2 z-10">
            <FavoriteButton movie={movie} variant="card-icon" />
          </div>

          {/* Center Quick View Preview Button on hover */}
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuickViewOpen(true);
              }}
              style={{
                borderColor: 'var(--theme-accent)',
                boxShadow: '0 4px 14px var(--theme-accent-subtle)',
              }}
              className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/95 text-foreground font-semibold text-xs border hover:bg-background transition-all"
              aria-label={`Quick view ${movie.title}`}
            >
              <Eye className="w-3.5 h-3.5" style={{ color: 'var(--theme-accent)' }} />
              <span>Preview</span>
            </button>
          </div>

          {/* Rating overlay badge at bottom-left */}
          {movie.vote_average > 0 && (
            <div className="absolute bottom-2.5 left-2.5 z-10">
              <RatingBadge
                rating={movie.vote_average}
                size="sm"
                className="bg-background/90 backdrop-blur-md border-border/60 shadow-xs"
              />
            </div>
          )}

          {/* Full Card Link overlay */}
          <Link
            href={`/movies/${movie.id}`}
            className="absolute inset-0 z-0 focus:outline-none"
            aria-label={`View details for ${movie.title}`}
          >
            <span className="sr-only">View {movie.title}</span>
          </Link>
        </div>

        {/* Editorial Meta */}
        <div className="pt-2.5 px-0.5 flex flex-col space-y-0.5">
          <Link
            href={`/movies/${movie.id}`}
            className="font-medium text-sm text-foreground line-clamp-1 transition-colors group-hover:text-[var(--theme-accent)] focus:outline-none"
          >
            {movie.title}
          </Link>
          <div className="flex items-center text-xs text-muted-foreground font-mono">
            <span>{year}</span>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        movie={movie}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
