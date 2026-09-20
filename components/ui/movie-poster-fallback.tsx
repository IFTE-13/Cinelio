import React from 'react';
import { Film, Clapperboard, Disc3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MoviePosterFallbackProps {
  title: string;
  year?: string;
  variant?: 'card' | 'thumbnail' | 'large' | 'compact';
  className?: string;
}

export function MoviePosterFallback({
  title,
  year,
  variant = 'card',
  className,
}: MoviePosterFallbackProps) {
  // Generate consistent subtle accent hue from title string
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const initials = title
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'FILM';

  // 1. Tiny Thumbnail Variant (e.g. in Command Palette, Search dropdown)
  if (variant === 'thumbnail') {
    return (
      <div
        className={cn(
          'relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-neutral-800 to-neutral-950 text-neutral-400 select-none overflow-hidden border border-white/5',
          className
        )}
      >
        <Film className="w-3.5 h-3.5 opacity-60 text-[var(--theme-accent)]" />
        <span className="text-[9px] font-bold tracking-wider font-mono opacity-80 mt-0.5">
          {initials}
        </span>
      </div>
    );
  }

  // 2. Compact Variant (e.g. Recently viewed row, horizontal strips)
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          'relative w-full h-full flex flex-col justify-between p-2.5 bg-gradient-to-b from-zinc-900 via-neutral-900 to-black text-foreground select-none overflow-hidden border border-white/10 rounded-inherit',
          className
        )}
      >
        {/* Subtle background ambient pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--theme-accent-glow),transparent_75%)] opacity-40 pointer-events-none" />
        <div className="absolute -right-4 -bottom-4 text-white/[0.03] pointer-events-none">
          <Film className="w-24 h-24 stroke-[1]" />
        </div>

        {/* Top bar */}
        <div className="relative z-10 flex items-center justify-between">
          <span className="text-[8px] font-mono tracking-widest uppercase text-muted-foreground/80">
            CINELIO
          </span>
          <Film className="w-3 h-3 text-[var(--theme-accent)] opacity-80" />
        </div>

        {/* Middle initials stamp */}
        <div className="relative z-10 my-auto text-center py-1">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold font-mono tracking-wider text-foreground shadow-xs">
            {initials}
          </div>
        </div>

        {/* Bottom Title */}
        <div className="relative z-10 space-y-0.5">
          <div className="text-[10px] font-semibold text-foreground line-clamp-1 leading-tight">
            {title}
          </div>
          {year && (
            <div className="text-[9px] font-mono text-muted-foreground">
              {year}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. Standard & Large Editorial Sleeve Variant (Card / Detail)
  return (
    <div
      className={cn(
        'relative w-full h-full flex flex-col justify-between p-4 sm:p-5 bg-gradient-to-b from-zinc-900 via-neutral-900 to-black text-foreground select-none overflow-hidden border border-white/10 shadow-inner',
        className
      )}
    >
      {/* Ambient background glow & film watermark */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,var(--theme-accent-glow),transparent_70%)] opacity-50 pointer-events-none" />
      <div className="absolute -right-8 -bottom-8 text-white/[0.04] pointer-events-none select-none">
        <Clapperboard className="w-44 h-44 stroke-[1]" />
      </div>

      {/* Decorative Inset Border Line for Criterion/Archival sleeve vibe */}
      <div className="absolute inset-2 border border-white/[0.08] rounded-lg pointer-events-none" />

      {/* Header Stamp */}
      <div className="relative z-10 flex items-center justify-between pt-1 px-1">
        <div className="flex items-center gap-1.5">
          <span
            style={{ backgroundColor: 'var(--theme-accent)' }}
            className="w-1.5 h-1.5 rounded-full shadow-xs"
          />
          <span className="text-[9px] font-mono tracking-widest uppercase text-muted-foreground font-semibold">
            ARCHIVE REEL
          </span>
        </div>
        <Film className="w-3.5 h-3.5 text-[var(--theme-accent)] opacity-80" />
      </div>

      {/* Centerpiece Emblem: Sleek vinyl/canister seal */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto py-4">
        <div className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 shadow-lg backdrop-blur-xs group-hover:scale-105 transition-transform duration-300">
          <Disc3 className="w-8 h-8 text-[var(--theme-accent)] opacity-85 stroke-[1.5] animate-[spin_20s_linear_infinite]" />
          <span className="absolute text-[11px] font-bold font-mono text-foreground tracking-widest">
            {initials}
          </span>
        </div>
        <span className="mt-2 text-[9px] font-mono tracking-widest uppercase text-muted-foreground/60">
          EDITION NO. {hash % 900 + 100}
        </span>
      </div>

      {/* Footer Typography: Title & Release Year */}
      <div className="relative z-10 pb-1 px-1 space-y-1">
        <div className="text-xs sm:text-sm font-bold tracking-tight text-foreground line-clamp-2 leading-snug">
          {title}
        </div>
        {year && (
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
            <span className="text-[var(--theme-accent)]">•</span>
            <span>{year}</span>
          </div>
        )}
      </div>
    </div>
  );
}
