import React from 'react';
import { Movie } from '@/types/cinema';
import { MovieCard } from './movie-card';
import { Film } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MovieGridProps {
  movies: Movie[];
  className?: string;
  emptyMessage?: string;
  priorityFirst?: number;
}

export function MovieGrid({
  movies,
  className,
  emptyMessage = 'No films match your selection.',
  priorityFirst = 6,
}: MovieGridProps) {
  if (!movies || movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-16 text-center my-8">
        <Film className="h-10 w-10 text-muted-foreground/60 mb-3 stroke-[1.5]" />
        <h3 className="text-base font-semibold text-foreground">No films found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 sm:gap-x-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7',
        className
      )}
    >
      {movies.map((movie, index) => (
        <MovieCard
          key={`${movie.id}-${index}`}
          movie={movie}
          priority={index < priorityFirst}
        />
      ))}
    </div>
  );
}
