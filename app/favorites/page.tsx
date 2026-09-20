'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Heart,
  Trash2,
  ArrowUpDown,
  Filter,
  Film,
  Compass,
  Clock,
  Star,
  BarChart3,
  Layers,
  History,
  Sparkles,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { MovieCard } from '@/components/movie/movie-card';
import { useFavorites } from '@/contexts/favorites-context';
import { Button } from '@/components/ui/button';
import { Movie } from '@/types/cinema';
import { RatingBadge } from '@/components/ui/rating-badge';

export default function FavoritesPage() {
  const { favorites, isLoaded, clearFavorites } = useFavorites();
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'date' | 'title'>('recent');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedDecade, setSelectedDecade] = useState<string>('all');
  const [showInsights, setShowInsights] = useState(true);

  // Extract all unique genres present across the user's favorites
  const availableGenres = useMemo(() => {
    const map = new Map<number, { name: string; count: number }>();
    favorites.forEach((fav) => {
      if (fav.genres) {
        fav.genres.forEach((g) => {
          const current = map.get(g.id) || { name: g.name, count: 0 };
          map.set(g.id, { name: g.name, count: current.count + 1 });
        });
      }
    });
    return Array.from(map.entries())
      .map(([id, data]) => ({ id, name: data.name, count: data.count }))
      .sort((a, b) => b.count - a.count);
  }, [favorites]);

  // Analytics: Total estimated watchtime, average score, decades
  const analytics = useMemo(() => {
    if (favorites.length === 0) return null;

    // Estimated watchtime: 124 minutes avg
    const totalMinutes = favorites.length * 124;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    // Average rating
    const validRatings = favorites.filter((f) => f.vote_average > 0);
    const avgScore =
      validRatings.length > 0
        ? (validRatings.reduce((sum, f) => sum + f.vote_average, 0) / validRatings.length).toFixed(1)
        : '0.0';

    // Decades calculation
    const decadeCounts: Record<string, number> = {
      '1970s': 0,
      '1980s': 0,
      '1990s': 0,
      '2000s': 0,
      '2010s': 0,
      '2020s': 0,
      'Classic': 0,
    };

    favorites.forEach((f) => {
      const year = parseInt((f.release_date || '').split('-')[0], 10);
      if (year >= 2020) decadeCounts['2020s']++;
      else if (year >= 2010) decadeCounts['2010s']++;
      else if (year >= 2000) decadeCounts['2000s']++;
      else if (year >= 1990) decadeCounts['1990s']++;
      else if (year >= 1980) decadeCounts['1980s']++;
      else if (year >= 1970) decadeCounts['1970s']++;
      else if (year > 1900) decadeCounts['Classic']++;
    });

    const activeDecades = Object.entries(decadeCounts)
      .filter(([_, count]) => count > 0)
      .sort((a, b) => b[1] - a[1]);

    return {
      hours,
      minutes,
      avgScore,
      activeDecades,
      topGenres: availableGenres.slice(0, 4),
    };
  }, [favorites, availableGenres]);

  // Filter and sort favorites
  const processedFavorites = useMemo(() => {
    let result = [...favorites];

    // Filter by genre
    if (selectedGenre !== 'all') {
      const gId = parseInt(selectedGenre, 10);
      result = result.filter(
        (m) =>
          m.genre_ids?.includes(gId) ||
          m.genres?.some((g) => g.id === gId)
      );
    }

    // Filter by decade
    if (selectedDecade !== 'all') {
      result = result.filter((m) => {
        const year = parseInt((m.release_date || '').split('-')[0], 10);
        if (selectedDecade === '2020s') return year >= 2020;
        if (selectedDecade === '2010s') return year >= 2010 && year < 2020;
        if (selectedDecade === '2000s') return year >= 2000 && year < 2010;
        if (selectedDecade === '1990s') return year >= 1990 && year < 2000;
        if (selectedDecade === '1980s') return year >= 1980 && year < 1990;
        if (selectedDecade === '1970s') return year >= 1970 && year < 1980;
        return true;
      });
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.vote_average - a.vote_average);
        break;
      case 'date':
        result.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'recent':
      default:
        result.sort((a, b) => b.addedAt - a.addedAt);
        break;
    }

    return result;
  }, [favorites, selectedGenre, selectedDecade, sortBy]);

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all saved favorites from this browser?')) {
      clearFavorites();
    }
  };

  if (!isLoaded) {
    return (
      <div className="py-16">
        <Container>
          <div className="space-y-4 max-w-sm">
            <div className="h-8 w-40 rounded bg-muted animate-pulse" />
            <div className="h-4 w-64 rounded bg-muted/80 animate-pulse" />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 space-y-8">
      <Container>
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-500 dark:text-red-400">
              <Heart className="w-4 h-4 fill-current" />
              <span>Personal Watchlist & Archive</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-1">
              Saved Favorites
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Saved locally on this device. Zero accounts, trackers, or cookies.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {favorites.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInsights(!showInsights)}
                  className="text-xs gap-1.5"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                  <span>{showInsights ? 'Hide Insights' : 'Cinephile Insights'}</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="text-xs text-muted-foreground hover:text-red-600 gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </Button>
              </>
            )}
          </div>
        </div>

        {favorites.length === 0 ? (
          /* Informative Empty State */
          <div className="max-w-md mx-auto my-16 p-8 rounded-2xl border border-dashed border-border text-center space-y-4 bg-card/50">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
              <Heart className="w-6 h-6 stroke-[1.5]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">
                No saved favorites yet
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Your favorites are preserved locally on this device. Save cinema titles while exploring any film page, catalog listing, or mood to curate your personal archive.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap justify-center gap-2">
              <Button asChild className="gap-2 font-medium">
                <Link href="/discover">
                  <Compass className="w-4 h-4" />
                  <span>Discover Films</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2 font-medium">
                <Link href="/moods">
                  <Sparkles className="w-4 h-4 text-[var(--theme-accent)]" />
                  <span>Explore Moods</span>
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 1. Cinephile Insights Dashboard */}
            {showInsights && analytics && (
              <div className="p-6 rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card/80 to-secondary/30 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[var(--theme-accent)]" />
                    <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">
                      Cinephile Insights & Taste Metrics
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    {favorites.length} film{favorites.length > 1 ? 's' : ''} in archive
                  </span>
                </div>

                {/* Stat Badges Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Watchtime */}
                  <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/50">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                      <Clock className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                      <span>Est. Watchtime</span>
                    </div>
                    <div className="mt-2 text-xl font-bold tracking-tight text-foreground font-mono">
                      {analytics.hours}h {analytics.minutes}m
                    </div>
                  </div>

                  {/* Average Score */}
                  <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/50">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>Taste Quality</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xl font-bold tracking-tight text-foreground font-mono">
                        {analytics.avgScore}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--theme-accent-subtle)] text-[var(--theme-accent)] font-semibold">
                        {Number(analytics.avgScore) >= 8.0 ? 'Elite' : Number(analytics.avgScore) >= 7.5 ? 'Auteur' : 'Eclectic'}
                      </span>
                    </div>
                  </div>

                  {/* Top Genre */}
                  <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/50">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                      <Layers className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                      <span>Primary Affinity</span>
                    </div>
                    <div className="mt-2 text-sm sm:text-base font-bold tracking-tight text-foreground truncate">
                      {analytics.topGenres[0]?.name || 'Varied'}
                    </div>
                  </div>

                  {/* Leading Era */}
                  <div className="p-3.5 rounded-xl bg-secondary/50 border border-border/50">
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium">
                      <History className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
                      <span>Favorite Era</span>
                    </div>
                    <div className="mt-2 text-sm sm:text-base font-bold tracking-tight text-foreground">
                      {analytics.activeDecades[0] ? `${analytics.activeDecades[0][0]}` : 'Contemporary'}
                    </div>
                  </div>
                </div>

                {/* Genre & Decades Progress Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Genres Bar */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Top Genre Breakdown
                    </div>
                    <div className="space-y-1.5">
                      {analytics.topGenres.map((g) => {
                        const pct = Math.round((g.count / favorites.length) * 100);
                        return (
                          <div key={g.id} className="space-y-0.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-foreground font-medium">{g.name}</span>
                              <span className="text-muted-foreground font-mono text-[11px]">
                                {g.count} ({pct}%)
                              </span>
                            </div>
                            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                              <div
                                style={{ width: `${pct}%`, backgroundColor: 'var(--theme-accent)' }}
                                className="h-full rounded-full transition-all duration-500"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Decades Distribution */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Cinema Decades Distribution
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {analytics.activeDecades.map(([decade, count]) => {
                        const isSelected = selectedDecade === decade;
                        return (
                          <button
                            key={decade}
                            onClick={() => setSelectedDecade(isSelected ? 'all' : decade)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-2 ${
                              isSelected
                                ? 'bg-[var(--theme-accent)] text-primary-foreground border-[var(--theme-accent)] shadow-xs'
                                : 'bg-secondary/70 text-muted-foreground hover:text-foreground border-border/60 hover:bg-secondary'
                            }`}
                          >
                            <span>{decade}</span>
                            <span className="text-[10px] font-mono px-1 rounded bg-black/10 dark:bg-white/10 font-bold">
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Sorting & In-Place Filtering Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-xl border border-border/70 bg-card text-xs">
              <div className="flex flex-wrap items-center gap-3">
                {/* Genre Filter */}
                {availableGenres.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground font-medium">Genre:</span>
                    <select
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)}
                      className="rounded-md border border-input bg-background px-2.5 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-ring text-xs"
                    >
                      <option value="all">All Genres ({favorites.length})</option>
                      {availableGenres.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name} ({g.count})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Decade Filter */}
                <div className="flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground font-medium">Era:</span>
                  <select
                    value={selectedDecade}
                    onChange={(e) => setSelectedDecade(e.target.value)}
                    className="rounded-md border border-input bg-background px-2.5 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-ring text-xs"
                  >
                    <option value="all">All Eras</option>
                    <option value="2020s">2020s Contemporary</option>
                    <option value="2010s">2010s Prestige</option>
                    <option value="2000s">2000s Millennium</option>
                    <option value="1990s">1990s Indie</option>
                    <option value="1980s">1980s Neon</option>
                    <option value="1970s">1970s New Hollywood</option>
                  </select>
                </div>

                {/* Sort By */}
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground font-medium">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="rounded-md border border-input bg-background px-2.5 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-ring text-xs"
                  >
                    <option value="recent">Recently Added</option>
                    <option value="rating">Highest Rated</option>
                    <option value="date">Release Date</option>
                    <option value="title">Title (A-Z)</option>
                  </select>
                </div>
              </div>

              <div className="text-xs font-mono text-muted-foreground">
                Showing {processedFavorites.length} of {favorites.length}
              </div>
            </div>

            {/* 3. Movie Cards Grid */}
            {processedFavorites.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 sm:gap-x-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {processedFavorites.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie as unknown as Movie}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center rounded-xl border border-dashed border-border p-8">
                <Film className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-semibold text-foreground">No favorites match this filter</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try clearing the genre or era filter to view your full watchlist.
                </p>
                <div className="mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedGenre('all');
                      setSelectedDecade('all');
                    }}
                    className="text-xs"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
