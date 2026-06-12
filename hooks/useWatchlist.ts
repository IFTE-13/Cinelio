'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Movie } from '@/types/movie';

const STORAGE_KEY = 'flixo_watchlist';

interface UseWatchlistReturn {
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  toggleWatchlist: (movie: Movie) => void;
  isInWatchlist: (movieId: number) => boolean;
  clearWatchlist: () => void;
  watchlistCount: number;
}

export function useWatchlist(): UseWatchlistReturn {
  const [watchlist, setWatchlist] = useState<Movie[]>(() => {
    if (typeof window === 'undefined') return [];
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to parse watchlist from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch (error) {
      console.error('Failed to save watchlist to localStorage:', error);
    }
  }, [watchlist]);

  const addToWatchlist = useCallback((movie: Movie) => {
    setWatchlist(prev => {
      if (prev.some(m => m.id === movie.id)) return prev;
      return [...prev, movie];
    });
  }, []);

  const removeFromWatchlist = useCallback((movieId: number) => {
    setWatchlist(prev => prev.filter(movie => movie.id !== movieId));
  }, []);

  const toggleWatchlist = useCallback((movie: Movie) => {
    setWatchlist(prev => {
      const exists = prev.some(m => m.id === movie.id);
      if (exists) {
        return prev.filter(m => m.id !== movie.id);
      }
      return [...prev, movie];
    });
  }, []);

  const isInWatchlist = useCallback((movieId: number) => {
    return watchlist.some(movie => movie.id === movieId);
  }, [watchlist]);

  const clearWatchlist = useCallback(() => {
    setWatchlist([]);
  }, []);

  const watchlistCount = useMemo(() => watchlist.length, [watchlist]);

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    isInWatchlist,
    clearWatchlist,
    watchlistCount,
  };
}