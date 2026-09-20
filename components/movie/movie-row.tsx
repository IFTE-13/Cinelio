'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Movie } from '@/types/cinema';
import { MovieCard } from './movie-card';
import { Button } from '@/components/ui/button';

interface MovieRowProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  viewAllHref?: string;
}

export function MovieRow({
  title,
  subtitle,
  movies,
  viewAllHref,
}: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-4 my-12"
    >
      {/* Header */}
      <div className="flex items-end justify-between px-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <span>{title}</span>
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors mr-2 group"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}

          {/* Desktop Arrow Nav with glow and hover animation */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              type="button"
              className="h-8 w-8 rounded-full border border-border/70 bg-card hover:bg-secondary flex items-center justify-center text-foreground hover:scale-105 hover:border-foreground/30 transition-all shadow-xs"
              onClick={() => scroll('left')}
              aria-label={`Scroll ${title} left`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="h-8 w-8 rounded-full border border-border/70 bg-card hover:bg-secondary flex items-center justify-center text-foreground hover:scale-105 hover:border-foreground/30 transition-all shadow-xs"
              onClick={() => scroll('right')}
              aria-label={`Scroll ${title} right`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel with cards */}
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-1 scroll-smooth no-scrollbar snap-x snap-mandatory"
      >
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className="flex-none w-[160px] sm:w-[190px] md:w-[210px] snap-start"
          >
            <MovieCard movie={movie} priority={index < 3} />
          </div>
        ))}
      </div>
    </motion.section>
  );
}
