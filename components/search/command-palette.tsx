'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Dices,
  Compass,
  History,
  Layers,
  Heart,
  Film,
  User,
  X,
  Clock,
  ArrowRight,
  Sparkles,
  Clapperboard,
} from 'lucide-react';
import { Movie, PersonDetails, RecentSearch } from '@/types/cinema';
import { CINEMA_ERAS } from '@/lib/tmdb/eras';
import { CINEMA_MOODS } from '@/lib/tmdb/moods';
import { getPosterUrl, getProfileUrl, getYear } from '@/lib/tmdb/image';
import { RatingBadge } from '@/components/ui/rating-badge';
import { MoviePosterFallback } from '@/components/ui/movie-poster-fallback';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRoulette?: () => void;
}

export function CommandPalette({ isOpen, onClose, onOpenRoulette }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [people, setPeople] = useState<PersonDetails[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cinelio_recent_searches');
        if (stored) {
          setRecentSearches(JSON.parse(stored).slice(0, 5));
        }
      } catch {}
    }
  }, [isOpen]);

  // Focus input on open & lock scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setMovies([]);
      setPeople([]);
      setSelectedIndex(0);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Debounced live search
  useEffect(() => {
    if (!query.trim()) {
      setMovies([]);
      setPeople([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setMovies(data.movies?.results?.slice(0, 5) || []);
          setPeople(data.people?.results?.slice(0, 3) || []);
        }
      } catch (err) {
        console.error('Command palette search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Matching Eras based on query
  const matchedEras = query.trim()
    ? CINEMA_ERAS.filter(
        (era) =>
          era.decade.toLowerCase().includes(query.toLowerCase()) ||
          era.name.toLowerCase().includes(query.toLowerCase()) ||
          era.hallmarks.some((h) => h.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  // Matching Moods based on query
  const matchedMoods = query.trim()
    ? CINEMA_MOODS.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.shortLabel.toLowerCase().includes(query.toLowerCase()) ||
          m.tagline.toLowerCase().includes(query.toLowerCase()) ||
          m.keywords.some((k) => k.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  // Static Quick Actions
  const quickActions = [
    {
      id: 'action-roulette',
      title: 'Surprise Me with Cinema Roulette',
      subtitle: 'Spin the reels for a curated film recommendation',
      icon: Dices,
      perform: () => {
        onClose();
        if (onOpenRoulette) onOpenRoulette();
      },
    },
    {
      id: 'action-moods',
      title: 'Cinema Mood Matcher',
      subtitle: 'Discover films by emotion (Mind-Bending, Neon Noir, Comfort)',
      icon: Sparkles,
      perform: () => {
        onClose();
        router.push('/moods');
      },
    },
    {
      id: 'action-directors',
      title: 'Auteur & Visionary Directors',
      subtitle: 'Explore trademarks and works of Nolan, Scorsese, Miyazaki',
      icon: Clapperboard,
      perform: () => {
        onClose();
        router.push('/directors');
      },
    },
    {
      id: 'action-eras',
      title: 'Decades Time Machine',
      subtitle: 'Explore 1970s to 2020s cinema movements',
      icon: History,
      perform: () => {
        onClose();
        router.push('/eras');
      },
    },
    {
      id: 'action-discover',
      title: 'Discover & Filter Catalog',
      subtitle: 'Filter by genre, year, minimum score, and language',
      icon: Compass,
      perform: () => {
        onClose();
        router.push('/discover');
      },
    },
    {
      id: 'action-genres',
      title: 'Browse All Genres',
      subtitle: 'Action, Sci-Fi, Drama, Noir, and all 19 categories',
      icon: Layers,
      perform: () => {
        onClose();
        router.push('/genres');
      },
    },
    {
      id: 'action-favorites',
      title: 'My Saved Favorites & Analytics',
      subtitle: 'Your personal bookmarked watchlist and taste metrics',
      icon: Heart,
      perform: () => {
        onClose();
        router.push('/favorites');
      },
    },
  ];

  // Save query to recent searches
  const saveSearch = (term: string) => {
    try {
      const existing = recentSearches.filter((s) => s.query.toLowerCase() !== term.toLowerCase());
      const updated = [{ query: term, timestamp: Date.now() }, ...existing].slice(0, 10);
      localStorage.setItem('cinelio_recent_searches', JSON.stringify(updated));
    } catch {}
  };

  const handleSelectMovie = (movie: Movie) => {
    saveSearch(movie.title);
    onClose();
    router.push(`/movies/${movie.id}`);
  };

  const handleSelectPerson = (person: PersonDetails) => {
    saveSearch(person.name);
    onClose();
    router.push(`/people/${person.id}`);
  };

  const handleSelectEra = (eraId: string) => {
    onClose();
    router.push(`/eras/${eraId}`);
  };

  const handleSelectSearchTerm = (term: string) => {
    saveSearch(term);
    onClose();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-background/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{ duration: 0.15 }}
        className="relative w-full max-w-2xl bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/80 bg-secondary/20">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
              if (e.key === 'Enter' && query.trim()) {
                handleSelectSearchTerm(query.trim());
              }
            }}
            placeholder="Type a film, director, actor, decade (e.g., '1980s', 'Nolan', 'Dune')..."
            className="w-full bg-transparent text-sm sm:text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Scrollable Results Area */}
        <div className="overflow-y-auto p-3 space-y-4 text-xs">
          {/* If searching and loading */}
          {isLoading && (
            <div className="py-6 text-center text-muted-foreground flex items-center justify-center gap-2">
              <span
                style={{ color: 'var(--theme-accent)' }}
                className="animate-spin inline-block"
              >
                <Film className="w-4 h-4" />
              </span>
              <span>Scanning cinematic catalog...</span>
            </div>
          )}

          {/* Matched Eras */}
          {matchedEras.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                <span>Cinema Eras & Decades</span>
              </div>
              <div className="space-y-1 mt-1">
                {matchedEras.map((era) => (
                  <button
                    key={era.id}
                    onClick={() => handleSelectEra(era.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary/70 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        style={{ backgroundColor: era.themeColor }}
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                      />
                      <div>
                        <div className="font-semibold text-foreground group-hover:text-[var(--theme-accent)] transition-colors">
                          {era.decade}: {era.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {era.years} • {era.tagline}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Moods */}
          {matchedMoods.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cinema Moods & Atmospheres</span>
              </div>
              <div className="space-y-1 mt-1">
                {matchedMoods.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => {
                      onClose();
                      router.push(`/moods/${mood.id}`);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary/70 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        style={{ backgroundColor: mood.themeColor }}
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                      />
                      <div>
                        <div className="font-semibold text-foreground group-hover:text-[var(--theme-accent)] transition-colors">
                          {mood.name}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {mood.tagline}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Movie Results */}
          {movies.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" />
                <span>Films</span>
              </div>
              <div className="space-y-1 mt-1">
                {movies.map((movie) => {
                  const poster = getPosterUrl(movie.poster_path, 'w185');
                  return (
                    <button
                      key={movie.id}
                      onClick={() => handleSelectMovie(movie)}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-secondary/70 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-9 h-12 rounded bg-muted shrink-0 overflow-hidden border border-border/60">
                          {poster ? (
                            <Image
                              src={poster}
                              alt={movie.title}
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          ) : (
                            <MoviePosterFallback title={movie.title} variant="thumbnail" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-foreground truncate group-hover:text-[var(--theme-accent)] transition-colors">
                            {movie.title}
                          </div>
                          <div className="text-[11px] text-muted-foreground font-mono">
                            {getYear(movie.release_date)}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 pl-3">
                        {movie.vote_average > 0 && (
                          <RatingBadge rating={movie.vote_average} size="sm" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* People Results */}
          {people.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>Filmmakers & Actors</span>
              </div>
              <div className="space-y-1 mt-1">
                {people.map((person) => {
                  const profile = getProfileUrl(person.profile_path, 'w185');
                  return (
                    <button
                      key={person.id}
                      onClick={() => handleSelectPerson(person)}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-secondary/70 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full bg-muted shrink-0 overflow-hidden border border-border/60 flex items-center justify-center">
                          {profile ? (
                            <Image
                              src={profile}
                              alt={person.name}
                              fill
                              sizes="32px"
                              className="object-cover"
                            />
                          ) : (
                            <User className="w-4 h-4 text-muted-foreground/70" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground group-hover:text-[var(--theme-accent)] transition-colors">
                            {person.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {person.known_for_department || 'Film'}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full Search Action when Query entered */}
          {query.trim() && (
            <div className="pt-2 border-t border-border/60">
              <button
                onClick={() => handleSelectSearchTerm(query.trim())}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-left"
              >
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <Search className="w-4 h-4 text-[var(--theme-accent)]" />
                  <span>
                    Search full archive for &quot;<strong>{query}</strong>&quot;
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          )}

          {/* If No Query: Show Quick Actions & Recent Searches */}
          {!query.trim() && (
            <>
              {recentSearches.length > 0 && (
                <div>
                  <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Recent Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 p-2">
                    {recentSearches.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectSearchTerm(s.query)}
                        className="px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground hover:bg-[var(--theme-accent-subtle)] hover:text-[var(--theme-accent)] transition-colors text-xs font-medium border border-border/60"
                      >
                        {s.query}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Quick Navigation & Cinema Tools
                </div>
                <div className="space-y-1 mt-1">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={action.perform}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary/70 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-secondary text-[var(--theme-accent)] group-hover:bg-[var(--theme-accent-subtle)] transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground group-hover:text-[var(--theme-accent)] transition-colors">
                              {action.title}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {action.subtitle}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="px-4 py-2 border-t border-border/60 bg-secondary/30 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 rounded bg-muted border border-border">↵</kbd> Select
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-muted border border-border">ESC</kbd> Close
            </span>
          </div>
          <span className="hidden sm:inline text-muted-foreground/70">
            Cinelio Universal Discovery
          </span>
        </div>
      </motion.div>
    </div>
  );
}
