'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Trash2 } from 'lucide-react';
import { useRecentlyViewed } from '@/contexts/recently-viewed-context';
import { getPosterUrl, getYear } from '@/lib/tmdb/image';
import { RatingBadge } from '@/components/ui/rating-badge';
import { Button } from '@/components/ui/button';
import { MoviePosterFallback } from '@/components/ui/movie-poster-fallback';

export function RecentlyViewedRow() {
  const { recentlyViewed, isLoaded, clearRecentlyViewed } = useRecentlyViewed();

  if (!isLoaded || recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4 my-10 border-t border-border/50 pt-8">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Recently Viewed
          </h2>
          <span className="text-xs text-muted-foreground font-mono">
            ({recentlyViewed.length})
          </span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={clearRecentlyViewed}
          className="text-xs text-muted-foreground hover:text-foreground gap-1.5 h-8"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear history</span>
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-3 pt-1 no-scrollbar">
        {recentlyViewed.map((movie) => {
          const posterUrl = getPosterUrl(movie.poster_path, 'w342');
          return (
            <Link
              key={movie.id}
              href={`/movies/${movie.id}`}
              className="group flex-none w-[130px] sm:w-[150px] space-y-1.5 focus:outline-none"
            >
              <div className="relative aspect-[2/3] w-full rounded-md overflow-hidden bg-muted border border-border/50 group-hover:border-border transition-colors">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={movie.title}
                    fill
                    sizes="150px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <MoviePosterFallback
                    title={movie.title}
                    year={getYear(movie.release_date)}
                    variant="compact"
                  />
                )}
                {movie.vote_average > 0 && (
                  <div className="absolute bottom-1.5 left-1.5">
                    <RatingBadge rating={movie.vote_average} size="sm" />
                  </div>
                )}
              </div>
              <div className="px-0.5">
                <p className="text-xs font-medium text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {movie.title}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {getYear(movie.release_date)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
