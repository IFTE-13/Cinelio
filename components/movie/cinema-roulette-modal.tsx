'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, Sparkles, X, RotateCcw, ArrowRight, Play, Calendar, Star, Film } from 'lucide-react';
import { Movie, Genre, MovieDetails } from '@/types/cinema';
import { getPosterUrl, getYear, formatRuntime } from '@/lib/tmdb/image';
import { RatingBadge } from '@/components/ui/rating-badge';
import { FavoriteButton } from '@/components/movie/favorite-button';
import { TrailerModal } from '@/components/movie/trailer-modal';
import { Button } from '@/components/ui/button';
import { MoviePosterFallback } from '@/components/ui/movie-poster-fallback';
import { FALLBACK_MOVIES } from '@/lib/tmdb/fallback-data';

interface CinemaRouletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  genres?: Genre[];
}

export function CinemaRouletteModal({
  isOpen,
  onClose,
  genres = [],
}: CinemaRouletteModalProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [minRating, setMinRating] = useState<string>('7.5');
  const [isSpinning, setIsSpinning] = useState(false);
  const [pickedMovie, setPickedMovie] = useState<Movie | null>(null);
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Auto-spin once on open if no movie picked yet
      if (!pickedMovie) {
        spinReel();
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const spinReel = async () => {
    setIsSpinning(true);
    setMovieDetails(null);

    // Simulated reel spin delay for anticipation
    await new Promise((r) => setTimeout(r, 600));

    try {
      const params = new URLSearchParams();
      if (selectedGenre) params.set('genreId', selectedGenre);
      if (minRating) params.set('minRating', minRating);
      // Pick random page from top results
      const randomPage = Math.floor(Math.random() * 3) + 1;
      params.set('page', String(randomPage));
      params.set('sortBy', 'popularity.desc');

      const res = await fetch(`/api/discover?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const results: Movie[] = data.results || [];
        if (results.length > 0) {
          const randomIdx = Math.floor(Math.random() * results.length);
          const chosen = results[randomIdx];
          setPickedMovie(chosen);

          // Fetch full details for trailer
          fetch(`/api/movies/${chosen.id}`)
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => d && setMovieDetails(d))
            .catch(() => {});
        } else {
          fallbackPick();
        }
      } else {
        fallbackPick();
      }
    } catch {
      fallbackPick();
    } finally {
      setIsSpinning(false);
    }
  };

  const fallbackPick = () => {
    let pool = [...FALLBACK_MOVIES];
    if (minRating) {
      const min = Number(minRating);
      pool = pool.filter((m) => m.vote_average >= min);
    }
    if (selectedGenre) {
      const gId = Number(selectedGenre);
      const filtered = pool.filter((m) => m.genre_ids?.includes(gId));
      if (filtered.length > 0) pool = filtered;
    }
    const chosen = pool[Math.floor(Math.random() * pool.length)] || FALLBACK_MOVIES[0];
    setPickedMovie(chosen);
  };

  if (!isOpen) return null;

  const posterUrl = pickedMovie ? getPosterUrl(pickedMovie.poster_path, 'w500') : null;
  const year = pickedMovie ? getYear(pickedMovie.release_date) : '';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/70 bg-secondary/30">
          <div className="flex items-center gap-2">
            <span
              style={{
                backgroundColor: 'var(--theme-accent-subtle)',
                color: 'var(--theme-accent)',
              }}
              className="p-1.5 rounded-lg"
            >
              <Dices className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-base text-foreground leading-none">
                Cinema Roulette
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Can't decide what to watch? Let the film reels choose for you.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Controls Bar */}
        <div className="px-6 py-3 border-b border-border/50 bg-secondary/15 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Genre Select */}
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground font-medium">Genre:</span>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="rounded-md border border-input bg-background px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-ring text-xs"
              >
                <option value="">Any Genre</option>
                {genres.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Rating */}
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground font-medium">Min Score:</span>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="rounded-md border border-input bg-background px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-ring text-xs"
              >
                <option value="">Any Score</option>
                <option value="7.0">7.0+ (Good)</option>
                <option value="7.5">7.5+ (Critically Acclaimed)</option>
                <option value="8.0">8.0+ (Masterpiece)</option>
              </select>
            </div>
          </div>

          {/* Spin Reel Button */}
          <Button
            size="sm"
            onClick={spinReel}
            disabled={isSpinning}
            className="gap-1.5 text-xs font-semibold"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? 'Spinning...' : 'Spin Again'}</span>
          </Button>
        </div>

        {/* Picked Film Result Area */}
        <div className="p-6">
          {isSpinning ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-3">
              <div
                style={{ color: 'var(--theme-accent)' }}
                className="animate-spin text-4xl"
              >
                <Film className="w-10 h-10 stroke-[1.5]" />
              </div>
              <p className="text-sm font-medium text-muted-foreground animate-pulse">
                Rolling the cinematic archives...
              </p>
            </div>
          ) : pickedMovie ? (
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Poster */}
              <div className="relative aspect-[2/3] w-36 sm:w-44 shrink-0 rounded-xl overflow-hidden border border-border/80 bg-muted shadow-md mx-auto sm:mx-0">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={pickedMovie.title}
                    fill
                    sizes="180px"
                    className="object-cover"
                  />
                ) : (
                  <MoviePosterFallback
                    title={pickedMovie.title}
                    year={year}
                    variant="card"
                  />
                )}
                {pickedMovie.vote_average > 0 && (
                  <div className="absolute bottom-2 left-2 z-10">
                    <RatingBadge rating={pickedMovie.vote_average} size="sm" />
                  </div>
                )}
              </div>

              {/* Info & Actions */}
              <div className="flex flex-col justify-between flex-1 min-w-0 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <span>{year}</span>
                    {movieDetails?.runtime && movieDetails.runtime > 0 && (
                      <>
                        <span>•</span>
                        <span>{formatRuntime(movieDetails.runtime)}</span>
                      </>
                    )}
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight text-foreground line-clamp-2 leading-tight">
                    {pickedMovie.title}
                  </h2>

                  {movieDetails?.tagline && (
                    <p className="text-xs italic text-muted-foreground font-serif">
                      "{movieDetails.tagline}"
                    </p>
                  )}

                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-4 leading-relaxed pt-1">
                    {pickedMovie.overview}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FavoriteButton movie={movieDetails || pickedMovie} variant="full" size="sm" />
                    {movieDetails?.videos?.results && (
                      <TrailerModal
                        videos={movieDetails.videos.results}
                        movieTitle={pickedMovie.title}
                      />
                    )}
                  </div>

                  <Button asChild size="sm" className="gap-1.5 font-semibold">
                    <Link href={`/movies/${pickedMovie.id}`} onClick={onClose}>
                      <span>Explore Film</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
