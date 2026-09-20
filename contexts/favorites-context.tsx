'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { FavoriteMovie, Movie, MovieDetails } from '@/types/cinema';

const STORAGE_KEY = 'cinelio_favorites';

interface FavoritesContextType {
  favorites: FavoriteMovie[];
  isLoaded: boolean;
  addFavorite: (movie: Movie | MovieDetails) => void;
  removeFavorite: (id: number) => void;
  toggleFavorite: (movie: Movie | MovieDetails) => void;
  isFavorite: (id: number) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Safe client-side hydration from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load favorites from localStorage:', e);
    } finally {
      setIsLoaded(true);
    }

    // Cross-tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) {
            setFavorites(updated);
          }
        } catch {
          // ignore corrupted cross-tab updates
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const saveFavorites = useCallback((items: FavoriteMovie[]) => {
    setFavorites(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to persist favorites to localStorage:', e);
    }
  }, []);

  const addFavorite = useCallback(
    (movie: Movie | MovieDetails) => {
      setFavorites((prev) => {
        if (prev.some((m) => m.id === movie.id)) return prev;
        const newFavorite: FavoriteMovie = {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          vote_count: movie.vote_count,
          overview: movie.overview,
          genres: movie.genres,
          genre_ids: movie.genre_ids || movie.genres?.map((g) => g.id),
          addedAt: Date.now(),
        };
        const updated = [newFavorite, ...prev];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
    },
    []
  );

  const removeFavorite = useCallback((id: number) => {
    setFavorites((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, []);

  const toggleFavorite = useCallback(
    (movie: Movie | MovieDetails) => {
      setFavorites((prev) => {
        const exists = prev.some((m) => m.id === movie.id);
        let updated: FavoriteMovie[];
        if (exists) {
          updated = prev.filter((m) => m.id !== movie.id);
        } else {
          const newFavorite: FavoriteMovie = {
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            backdrop_path: movie.backdrop_path,
            release_date: movie.release_date,
            vote_average: movie.vote_average,
            vote_count: movie.vote_count,
            overview: movie.overview,
            genres: movie.genres,
            genre_ids: movie.genre_ids || movie.genres?.map((g) => g.id),
            addedAt: Date.now(),
          };
          updated = [newFavorite, ...prev];
        }
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
    },
    []
  );

  const isFavorite = useCallback(
    (id: number) => {
      return favorites.some((m) => m.id === id);
    },
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    saveFavorites([]);
  }, [saveFavorites]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoaded,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
