'use client';

import { useState, useEffect, useCallback } from 'react';
import { RecentSearch } from '@/types/cinema';

const STORAGE_KEY = 'cinelio_recent_searches';
const MAX_SEARCHES = 8;

export function useRecentSearches() {
  const [searches, setSearches] = useState<RecentSearch[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSearches(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load recent searches:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const addSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setSearches((prev) => {
      const filtered = prev.filter((s) => s.query.toLowerCase() !== trimmed.toLowerCase());
      const updated: RecentSearch[] = [{ query: trimmed, timestamp: Date.now() }, ...filtered].slice(
        0,
        MAX_SEARCHES
      );
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, []);

  const removeSearch = useCallback((query: string) => {
    setSearches((prev) => {
      const updated = prev.filter((s) => s.query.toLowerCase() !== query.toLowerCase());
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, []);

  const clearSearches = useCallback(() => {
    setSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return {
    searches,
    isLoaded,
    addSearch,
    removeSearch,
    clearSearches,
  };
}
