'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Play, Calendar, Star } from 'lucide-react';
import { Movie, MovieDetails } from '@/types/cinema';
import { getBackdropUrl, getPosterUrl, getYear, formatRuntime } from '@/lib/tmdb/image';
import { RatingBadge } from '@/components/ui/rating-badge';
import { FavoriteButton } from './favorite-button';
import { TrailerModal } from './trailer-modal';
import { Button } from '@/components/ui/button';
import { BackdropFallback } from '@/components/ui/backdrop-fallback';

interface QuickViewModalProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickViewModal({ movie, isOpen, onClose }: QuickViewModalProps) {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);

    fetch(`/api/movies/${movie.id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data) {
          setDetails(data);
        }
      })
      .catch((e) => console.error('Failed to load quick-view details:', e))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, movie.id]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const activeData = details || movie;
  const backdropUrl = getBackdropUrl(activeData.backdrop_path, 'w1280');
  const posterUrl = getPosterUrl(activeData.poster_path, 'w500');
  const year = getYear(activeData.release_date);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3.5 right-3.5 z-20 p-2 rounded-full bg-background/70 hover:bg-background text-foreground backdrop-blur-md border border-border/40 shadow-xs transition-colors"
              aria-label="Close preview"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Backdrop Header */}
            <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-muted">
              {backdropUrl ? (
                <Image
                  src={backdropUrl}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 700px"
                  className="object-cover object-center"
                />
              ) : (
                <BackdropFallback title={activeData.title} />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-card via-card/50 to-transparent" />

              {/* Floating rating badge */}
              {activeData.vote_average > 0 && (
                <div className="absolute bottom-3 left-4 z-10">
                  <RatingBadge rating={activeData.vote_average} size="md" />
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {activeData.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 font-mono">
                    <span>{year}</span>
                    {details && details.runtime > 0 && (
                      <>
                        <span>•</span>
                        <span>{formatRuntime(details.runtime)}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Favorite toggle */}
                <div className="shrink-0 pt-1 sm:pt-0">
                  <FavoriteButton movie={activeData} variant="full" size="sm" />
                </div>
              </div>

              {/* Synopsis */}
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-4">
                {activeData.overview || 'No synopsis available.'}
              </p>

              {/* Genres */}
              {details?.genres && details.genres.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {details.genres.map((g) => (
                    <span
                      key={g.id}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-secondary text-secondary-foreground border border-border/50"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border/60">
                <div>
                  {details?.videos?.results && (
                    <TrailerModal
                      videos={details.videos.results}
                      movieTitle={activeData.title}
                    />
                  )}
                </div>

                <Button asChild size="sm" className="gap-1.5 font-semibold">
                  <Link href={`/movies/${activeData.id}`} onClick={onClose}>
                    <span>Full Details Page</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
