'use client';

import { MovieCard } from '@/components/movieCard';
import { Button } from '@/components/ui/button';
import { useWatchlist } from '@/hooks/useWatchlist';
import { Trash2, Film } from 'lucide-react';
import Link from 'next/link';

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useWatchlist();

  const clearWatchlist = () => {
    if (confirm('Are you sure you want to clear your watchlist?')) {
      watchlist.forEach(movie => removeFromWatchlist(movie.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Watchlist
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {watchlist.length} movie{watchlist.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          {watchlist.length > 0 && (
            <Button variant="destructive" onClick={clearWatchlist}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {watchlist.length === 0 ? (
          <div className="text-center py-16">
            <Film className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Your watchlist is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Start adding movies you want to watch later!
            </p>
            <Link href="/">
              <Button>Browse Movies</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {watchlist.map((movie) => (
              <div key={movie.id} className="relative group">
                <MovieCard movie={movie} />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFromWatchlist(movie.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}