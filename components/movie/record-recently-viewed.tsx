'use client';

import { useEffect } from 'react';
import { useRecentlyViewed } from '@/contexts/recently-viewed-context';
import { MovieDetails } from '@/types/cinema';

export function RecordRecentlyViewed({ movie }: { movie: MovieDetails }) {
  const { addRecentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    if (movie && movie.id) {
      addRecentlyViewed(movie);
    }
  }, [movie, addRecentlyViewed]);

  return null;
}
