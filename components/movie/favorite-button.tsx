'use client';

import React from 'react';
import { Bookmark, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavorites } from '@/contexts/favorites-context';
import { Movie, MovieDetails } from '@/types/cinema';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FavoriteButtonProps {
  movie: Movie | MovieDetails;
  variant?: 'card-icon' | 'badge' | 'full';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function FavoriteButton({
  movie,
  variant = 'card-icon',
  className,
  size = 'md',
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites();
  const favorited = isLoaded ? isFavorite(movie.id) : false;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  if (variant === 'card-icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={favorited ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
        className={cn(
          'relative p-2 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'bg-background/80 hover:bg-background text-foreground/80 hover:text-foreground backdrop-blur-sm border border-border/40 shadow-xs',
          favorited && 'text-red-500 hover:text-red-600 dark:text-red-400 bg-background',
          className
        )}
      >
        <motion.div
          whileTap={{ scale: 0.8 }}
          transition={{ duration: 0.15 }}
          className="flex items-center justify-center"
        >
          <Heart
            className={cn(
              'w-4 h-4 transition-colors',
              favorited ? 'fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400' : 'stroke-current'
            )}
          />
        </motion.div>
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant={favorited ? 'secondary' : 'outline'}
      size={size === 'sm' ? 'sm' : 'default'}
      onClick={handleClick}
      className={cn(
        'group font-medium transition-all gap-2',
        favorited && 'border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10',
        className
      )}
      aria-label={favorited ? 'Saved in Favorites' : 'Save to Favorites'}
    >
      <motion.div
        whileTap={{ scale: 0.8 }}
        transition={{ duration: 0.15 }}
        className="flex items-center justify-center"
      >
        <Heart
          className={cn(
            'w-4 h-4 transition-colors',
            favorited
              ? 'fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400'
              : 'stroke-current text-muted-foreground group-hover:text-foreground'
          )}
        />
      </motion.div>
      <span>{favorited ? 'In Favorites' : 'Add to Favorites'}</span>
    </Button>
  );
}
