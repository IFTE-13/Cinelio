'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { Genre, DiscoverFilters } from '@/types/cinema';
import { Button } from '@/components/ui/button';

interface DiscoverFilterBarProps {
  genres: Genre[];
  activeFilters: DiscoverFilters;
}

type SortOption = 'popularity.desc' | 'vote_average.desc' | 'primary_release_date.desc' | 'title.asc';

export function DiscoverFilterBar({
  genres,
  activeFilters,
}: DiscoverFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Local state for filters
  const [genreId, setGenreId] = useState(activeFilters.genreId || '');
  const [year, setYear] = useState(activeFilters.year || '');
  const [minRating, setMinRating] = useState(activeFilters.minRating || '');
  const [sortBy, setSortBy] = useState<SortOption>((activeFilters.sortBy as SortOption) || 'popularity.desc');
  const [language, setLanguage] = useState(activeFilters.language || '');

  const applyFilters = (overrides?: Partial<DiscoverFilters>) => {
    const params = new URLSearchParams();
    const g = overrides?.genreId !== undefined ? overrides.genreId : genreId;
    const y = overrides?.year !== undefined ? overrides.year : year;
    const r = overrides?.minRating !== undefined ? overrides.minRating : minRating;
    const s = overrides?.sortBy !== undefined ? overrides.sortBy : sortBy;
    const l = overrides?.language !== undefined ? overrides.language : language;

    if (g) params.set('genreId', g);
    if (y) params.set('year', y);
    if (r) params.set('minRating', r);
    if (s && s !== 'popularity.desc') params.set('sortBy', s);
    if (l) params.set('language', l);
    params.set('page', '1');

    router.push(`/discover?${params.toString()}`);
    setMobileFilterOpen(false);
  };

  const resetFilters = () => {
    setGenreId('');
    setYear('');
    setMinRating('');
    setSortBy('popularity.desc');
    setLanguage('');
    router.push('/discover');
    setMobileFilterOpen(false);
  };

  const hasActiveFilters = Boolean(genreId || year || minRating || (sortBy && sortBy !== 'popularity.desc') || language);

  const yearsList = [
    '2026', '2025', '2024', '2023', '2022', '2021', '2020',
    '2019', '2015', '2010', '2000', '1990', '1980', '1970'
  ];

  const ratingOptions = [
    { value: '', label: 'Any Rating' },
    { value: '7', label: '7.0+ (Good)' },
    { value: '8', label: '8.0+ (Excellent)' },
    { value: '8.5', label: '8.5+ (Masterpiece)' },
  ];

  const sortOptions = [
    { value: 'popularity.desc', label: 'Most Popular' },
    { value: 'vote_average.desc', label: 'Highest Rated' },
    { value: 'primary_release_date.desc', label: 'Newest First' },
    { value: 'title.asc', label: 'Title (A-Z)' },
  ];

  const languageOptions = [
    { value: '', label: 'All Languages' },
    { value: 'en', label: 'English' },
    { value: 'ja', label: 'Japanese' },
    { value: 'fr', label: 'French' },
    { value: 'ko', label: 'Korean' },
    { value: 'es', label: 'Spanish' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
  ];

  return (
    <div className="space-y-4 mb-8">
      {/* Top Filter Bar for Desktop */}
      <div className="hidden lg:flex items-center justify-between gap-4 p-4 rounded-xl border border-border/80 bg-card">
        {/* Genre Select */}
        <div className="flex-1 min-w-[150px]">
          <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
            Genre
          </label>
          <select
            value={genreId}
            onChange={(e) => {
              setGenreId(e.target.value);
              applyFilters({ genreId: e.target.value });
            }}
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Release Year */}
        <div className="w-[120px]">
          <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
            Year
          </label>
          <select
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              applyFilters({ year: e.target.value });
            }}
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">Any Year</option>
            {yearsList.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Minimum Rating */}
        <div className="w-[150px]">
          <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
            Min Score
          </label>
          <select
            value={minRating}
            onChange={(e) => {
              setMinRating(e.target.value);
              applyFilters({ minRating: e.target.value });
            }}
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {ratingOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Language */}
        <div className="w-[130px]">
          <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              applyFilters({ language: e.target.value });
            }}
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {languageOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div className="w-[160px]">
          <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
            Sort Order
          </label>
          <select
            value={sortBy}
            onChange={(e) => {
              const val = (e.target.value as SortOption) || 'popularity.desc';
              setSortBy(val);
              applyFilters({ sortBy: val });
            }}
            className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <div className="pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-xs text-muted-foreground hover:text-foreground h-8 gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Trigger Button */}
      <div className="lg:hidden flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileFilterOpen(true)}
          className="gap-2 font-medium"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filter & Sort Films</span>
          {hasActiveFilters && (
            <span
              style={{ backgroundColor: 'var(--theme-accent)' }}
              className="w-2 h-2 rounded-full transition-colors"
            />
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-xs text-muted-foreground"
          >
            Reset all
          </Button>
        )}
      </div>

      {/* Mobile Drawer / Dialog */}
      {mobileFilterOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm p-0 sm:p-4"
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            className="w-full sm:max-w-lg bg-card border border-border rounded-t-2xl sm:rounded-xl shadow-2xl p-6 space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters & Ordering</span>
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setMobileFilterOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Form Fields for Mobile */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Genre
                </label>
                <select
                  value={genreId}
                  onChange={(e) => setGenreId(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2 text-sm text-foreground"
                >
                  <option value="">All Genres</option>
                  {genres.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Release Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2 text-sm text-foreground"
                >
                  <option value="">Any Year</option>
                  {yearsList.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Minimum Score
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2 text-sm text-foreground"
                >
                  {ratingOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-md border border-input bg-background p-2 text-sm text-foreground"
                >
                  {languageOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                  Sort Order
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy((e.target.value as SortOption) || 'popularity.desc')}
                  className="w-full rounded-md border border-input bg-background p-2 text-sm text-foreground"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-border">
              <Button
                variant="outline"
                className="flex-1"
                onClick={resetFilters}
              >
                Reset
              </Button>
              <Button
                className="flex-1 font-semibold"
                onClick={() => applyFilters()}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
