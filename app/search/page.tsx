'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Search as SearchIcon, X, Loader2, User, Film, Clock } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { MovieGrid } from '@/components/movie/movie-grid';
import { PersonCard } from '@/components/person/person-card';
import { useRecentSearches } from '@/hooks/use-recent-searches';
import { useDebounce } from '@/hooks/use-debounce';
import { Movie, PersonDetails } from '@/types/cinema';
import { Button } from '@/components/ui/button';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { searches, isLoaded: searchesLoaded, addSearch, removeSearch, clearSearches } = useRecentSearches();

  const [movies, setMovies] = useState<Movie[]>([]);
  const [people, setPeople] = useState<PersonDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'movies' | 'people'>('all');
  const [searchedOnce, setSearchedOnce] = useState(false);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setMovies([]);
      setPeople([]);
      setLoading(false);
      return;
    }

    let isCancelled = false;
    setLoading(true);
    setSearchedOnce(true);

    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery.trim())}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled) {
          setMovies(data.movies?.results || []);
          setPeople(data.people?.results || []);
          setLoading(false);
          // Add to local recent searches if results exist
          if (data.movies?.results?.length || data.people?.results?.length) {
            addSearch(debouncedQuery.trim());
          }
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error(err);
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, addSearch]);

  const handleSelectRecent = (term: string) => {
    setQuery(term);
  };

  const handleClear = () => {
    setQuery('');
    setMovies([]);
    setPeople([]);
    setSearchedOnce(false);
  };

  const totalResults = movies.length + people.length;

  return (
    <div className="py-8 sm:py-12">
      <Container>
        {/* Search Bar Input Container */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Search Cinema
            </h1>
            <p className="text-sm text-muted-foreground">
              Find films, directors, actors, and creators across the archive
            </p>
          </div>

          {/* Input Box */}
          <div className="relative flex items-center">
            <SearchIcon className="absolute left-4 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, filmmaker, actor, or keyword..."
              autoFocus
              className="w-full h-12 pl-12 pr-12 rounded-xl border border-border/80 bg-card text-foreground placeholder:text-muted-foreground/70 text-base focus:outline-none focus:ring-2 focus:ring-ring focus:border-border transition-all shadow-xs"
            />
            {loading && (
              <Loader2 className="absolute right-4 w-5 h-5 text-muted-foreground animate-spin" />
            )}
            {!loading && query && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-4 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary focus:outline-none"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Recent Searches Tags (only if query is empty and history exists) */}
          {!query && searchesLoaded && searches.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  Recent Searches
                </span>
                <button
                  type="button"
                  onClick={clearSearches}
                  className="hover:text-foreground transition-colors"
                >
                  Clear all
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {searches.map((s) => (
                  <div
                    key={s.timestamp}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/60 bg-secondary/50 text-xs text-foreground hover:bg-secondary transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectRecent(s.query)}
                      className="hover:underline focus:outline-none"
                    >
                      {s.query}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSearch(s.query)}
                      className="text-muted-foreground hover:text-foreground p-0.5"
                      aria-label={`Remove ${s.query} from recent searches`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Summary & Filter Tabs */}
          {debouncedQuery.trim() && !loading && (
            <div className="flex items-center justify-between border-b border-border pb-3 pt-4">
              <div className="text-xs text-muted-foreground font-mono">
                {totalResults} {totalResults === 1 ? 'match' : 'matches'} for "{debouncedQuery}"
              </div>

              <div className="flex gap-1">
                <Button
                  variant={activeTab === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('all')}
                  className="h-7 text-xs rounded-full"
                >
                  All ({totalResults})
                </Button>
                {movies.length > 0 && (
                  <Button
                    variant={activeTab === 'movies' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('movies')}
                    className="h-7 text-xs rounded-full gap-1"
                  >
                    <Film className="w-3 h-3" />
                    <span>Movies ({movies.length})</span>
                  </Button>
                )}
                {people.length > 0 && (
                  <Button
                    variant={activeTab === 'people' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('people')}
                    className="h-7 text-xs rounded-full gap-1"
                  >
                    <User className="w-3 h-3" />
                    <span>People ({people.length})</span>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Area */}
        <div className="mt-8">
          {/* People Section */}
          {(activeTab === 'all' || activeTab === 'people') && people.length > 0 && (
            <div className="mb-10 space-y-3">
              <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>Cast & Filmmakers</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {people.map((person) => (
                  <PersonCard key={person.id} person={person} />
                ))}
              </div>
            </div>
          )}

          {/* Movies Section */}
          {(activeTab === 'all' || activeTab === 'movies') && movies.length > 0 && (
            <div className="space-y-3">
              {activeTab === 'all' && people.length > 0 && (
                <h2 className="text-lg font-semibold tracking-tight text-foreground flex items-center gap-2">
                  <Film className="w-4 h-4 text-muted-foreground" />
                  <span>Films</span>
                </h2>
              )}
              <MovieGrid movies={movies} />
            </div>
          )}

          {/* Empty State */}
          {debouncedQuery.trim() && !loading && totalResults === 0 && (
            <div className="py-16 text-center space-y-3">
              <Film className="w-10 h-10 text-muted-foreground/60 mx-auto stroke-[1.5]" />
              <h3 className="text-base font-semibold text-foreground">
                No results for "{debouncedQuery}"
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Check your spelling, or try searching for another title, director, or actor.
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
