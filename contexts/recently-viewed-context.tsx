'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Movie, MovieDetails, RecentlyViewedMovie } from '@/types/cinema';

const STORAGE_KEY = 'cinelio_recently_viewed';
const MAX_ITEMS = 10;

interface RecentlyViewedContextType {
  recentlyViewed: RecentlyViewedMovie[];
  isLoaded: boolean;
  addRecentlyViewed: (movie: Movie | MovieDetails) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedMovie[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentlyViewed(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load recently viewed movies:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const addRecentlyViewed = useCallback((movie: Movie | MovieDetails) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item.id !== movie.id);
      const newItem: RecentlyViewedMovie = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        viewedAt: Date.now(),
      };
      const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, []);

  const clearRecentlyViewed = useCallback(() => {
    setRecentlyViewed([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewed,
        isLoaded,
        addRecentlyViewed,
        clearRecentlyViewed,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
}
