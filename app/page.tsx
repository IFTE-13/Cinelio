'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { MovieCard } from '@/components/movieCard';
import { SearchBar } from '@/components/searchBar';
import { Button } from '@/components/ui/button';
import { Bookmark, TrendingUp, Film } from 'lucide-react';
import { Movie, MovieResponse } from '@/types/movie';
import Link from 'next/link';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';

const categories = [
  { id: 'popular', name: 'Popular', icon: '🔥' },
  { id: 'now_playing', name: 'Now Playing', icon: '📽️' },
  { id: 'top_rated', name: 'Top Rated', icon: '⭐' },
  { id: 'upcoming', name: 'Upcoming', icon: '🗓️' },
];

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [activeCategory, setActiveCategory] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  
  const initialLoadRef = useRef(false);

  const loadMovies = useCallback(async (page = 1, category = activeCategory, isSearching = false) => {
    setLoading(true);
    try {
      const url = isSearching
        ? `/api/movies?query=${encodeURIComponent(searchQuery)}&page=${page}`
        : `/api/movies?category=${category}&page=${page}`;
      
      const response = await fetch(url);
      const data: MovieResponse = await response.json();
      
      if (page === 1) {
        setMovies(data.results);
      } else {
        setMovies(prev => [...prev, ...data.results]);
      }
      setTotalPages(data.total_pages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading movies:', error);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery]);

  // Initial load and category changes
  useEffect(() => {
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMovies(1, activeCategory, false);
  }, [activeCategory, loadMovies]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setSearching(true);
    setSearchLoading(true);
    try {
      const response = await fetch(`/api/movies?query=${encodeURIComponent(query)}&page=1`);
      const data: MovieResponse = await response.json();
      setMovies(data.results);
      setTotalPages(data.total_pages);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearching(false);
    setSearchQuery('');
    setActiveCategory('popular');
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setSearching(false);
    setSearchQuery('');
  };

  const loadMore = () => {
    if (currentPage < totalPages) {
      if (searching) {
        fetch(`/api/movies?query=${encodeURIComponent(searchQuery)}&page=${currentPage + 1}`)
          .then(res => res.json())
          .then(data => {
            setMovies(prev => [...prev, ...data.results]);
            setCurrentPage(prev => prev + 1);
          });
      } else {
        loadMovies(currentPage + 1, activeCategory, false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-gradient">Flixo</span>
            </Link>
            
            <div className="flex items-center gap-3">
              <Link href="/watchlist">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Bookmark className="h-4 w-4" />
                  <span className="hidden sm:inline">Watchlist</span>
                </Button>
              </Link>
              <AnimatedThemeToggler />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary/5 via-background to-background py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Discover <span className="text-gradient">Amazing</span> Movies
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">
              Explore thousands of movies, save your favorites, and never miss a great film
            </p>
            <div className="mx-auto max-w-md">
              <SearchBar onSearch={handleSearch} isLoading={searchLoading} />
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* Category Tabs */}
        {!searching && (
          <div className="mb-8 flex flex-wrap gap-2 border-b">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Search Results Header */}
        {searching && (
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Search Results</h2>
              <p className="text-sm text-muted-foreground">
                Found {movies.length} movies for &quot;{searchQuery}&quot;
              </p>
            </div>
            <Button onClick={clearSearch} variant="outline" size="sm">
              Clear Search
            </Button>
          </div>
        )}

        {/* Movies Grid */}
        {loading && movies.length === 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-2/3 rounded-xl bg-muted" />
                <div className="mt-2 h-4 w-3/4 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : movies.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Film className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No movies found</h3>
            <p className="text-muted-foreground">
              Try searching for something else
            </p>
            {searching && (
              <Button onClick={clearSearch} variant="outline" className="mt-4">
                Browse Categories
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {movies.map((movie) => (
                <Link href={`/movie/${movie.id}`} key={movie.id}>
                  <MovieCard movie={movie} />
                </Link>
              ))}
            </div>

            {currentPage < totalPages && movies.length > 0 && (
              <div className="mt-12 flex justify-center">
                <Button onClick={loadMore} variant="outline" size="lg" className="px-8">
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 Flixo. All data provided by TMDB</p>
        </div>
      </footer>
    </div>
  );
}