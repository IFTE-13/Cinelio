'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, Clock, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Movie, Genre } from '@/types/cinema';
import { getBackdropUrl, getYear, formatRuntime } from '@/lib/tmdb/image';
import { RatingBadge } from '@/components/ui/rating-badge';
import { FavoriteButton } from './favorite-button';
import { TrailerModal } from './trailer-modal';
import { Button } from '@/components/ui/button';

interface FeaturedHeroProps {
  movies?: Movie[];
  movie?: Movie;
  allGenres?: Genre[];
}

export function FeaturedHero({
  movies = [],
  movie,
  allGenres = [],
}: FeaturedHeroProps) {
  // Support both array of spotlight movies or single movie
  const spotlightList = movies.length > 0 ? movies.slice(0, 5) : movie ? [movie] : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeMovie = spotlightList[currentIndex] || spotlightList[0];

  // Auto-advance timer (faster snappy rotation)
  useEffect(() => {
    if (spotlightList.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % spotlightList.length);
    }, 4200);

    return () => clearInterval(interval);
  }, [spotlightList.length, isPaused]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % spotlightList.length);
  }, [spotlightList.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + spotlightList.length) % spotlightList.length);
  }, [spotlightList.length]);

  if (!activeMovie) return null;

  const backdropUrl = getBackdropUrl(activeMovie.backdrop_path, 'original');
  const year = getYear(activeMovie.release_date);

  // Match genre IDs to names
  const movieGenres = activeMovie.genres?.length
    ? activeMovie.genres.map((g) => g.name)
    : activeMovie.genre_ids?.map((id) => allGenres.find((g) => g.id === id)?.name).filter(Boolean) || [];

  return (
    <section
      className="relative w-full overflow-hidden bg-card border-b border-border/60"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Full-screen Edge-to-Edge Backdrop with Ken Burns & Snappy Crossfade */}
      <div className="relative h-[calc(100vh-4rem)] min-h-[580px] max-h-[920px] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMovie.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            {backdropUrl ? (
              <Image
                src={backdropUrl}
                alt={activeMovie.title}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center brightness-[0.7] contrast-[1.1] animate-kenburns"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-tr from-card via-muted to-secondary" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Sophisticated Multi-Layered Cinema Gradients */}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-background/95 via-background/50 to-transparent hidden md:block" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/50 pointer-events-none" />

        {/* Foreground Content with generous internal padding */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 md:p-16 lg:p-20 2xl:px-24 2xl:py-20 z-10">
          <div className="max-w-3xl space-y-4">
            {/* Live Cinema Pulse Tag */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium">
              <span
                style={{
                  backgroundColor: 'var(--theme-accent-subtle)',
                  color: 'var(--theme-accent)',
                  borderColor: 'var(--theme-accent)',
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold uppercase tracking-widest text-[11px] border backdrop-blur-md shadow-xs"
              >
                <span className="relative flex h-2 w-2">
                  <span
                    style={{ backgroundColor: 'var(--theme-accent)' }}
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  />
                  <span
                    style={{ backgroundColor: 'var(--theme-accent)' }}
                    className="relative inline-flex rounded-full h-2 w-2"
                  />
                </span>
                Spotlight
              </span>

              <span className="text-muted-foreground/60">•</span>
              <RatingBadge rating={activeMovie.vote_average} size="sm" />
              <span className="text-muted-foreground/60">•</span>
              <span className="text-foreground/90 flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                {year}
              </span>
            </div>

            {/* Title with snappy entrance */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMovie.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="space-y-3"
              >
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.05] drop-shadow-md">
                  {activeMovie.title}
                </h1>

                {/* Genre chips */}
                {movieGenres.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {movieGenres.slice(0, 3).map((name) => (
                      <span
                        key={name}
                        className="inline-block text-xs font-semibold px-3 py-1 rounded-md bg-secondary/80 text-secondary-foreground border border-border/50 backdrop-blur-xs shadow-xs"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Overview */}
                <p className="text-sm sm:text-base text-muted-foreground line-clamp-3 leading-relaxed max-w-2xl">
                  {activeMovie.overview}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button asChild size="lg" className="font-semibold gap-2 shadow-lg hover:scale-102 transition-transform">
                <Link href={`/movies/${activeMovie.id}`}>
                  <span>Explore Title</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <FavoriteButton movie={activeMovie} variant="full" size="lg" />
            </div>
          </div>
        </div>

        {/* Carousel Slide Indicators & Arrow Controls at Bottom-Right */}
        {spotlightList.length > 1 && (
          <div className="absolute bottom-8 right-6 sm:bottom-10 sm:right-10 md:bottom-12 md:right-16 lg:right-20 z-20 flex items-center gap-2.5">
            {/* Previous / Next Arrows */}
            <div className="flex items-center gap-1.5 mr-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous spotlight film"
                className="p-2 rounded-full bg-background/80 hover:bg-background text-foreground border border-border/60 backdrop-blur-md transition-all hover:scale-110 shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next spotlight film"
                className="p-2 rounded-full bg-background/80 hover:bg-background text-foreground border border-border/60 backdrop-blur-md transition-all hover:scale-110 shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Slide Dots / Bars */}
            <div className="flex items-center gap-2 bg-background/70 backdrop-blur-md px-3 py-2 rounded-full border border-border/50 shadow-sm">
              {spotlightList.map((m, idx) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to spotlight film ${idx + 1}: ${m.title}`}
                  className="relative h-2 rounded-full transition-all focus:outline-none"
                  style={{
                    width: currentIndex === idx ? '28px' : '8px',
                    backgroundColor:
                      currentIndex === idx
                        ? 'var(--theme-accent)'
                        : 'rgba(150, 150, 150, 0.4)',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
