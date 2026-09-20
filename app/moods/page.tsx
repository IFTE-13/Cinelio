import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { CinemaImage } from '@/components/ui/cinema-image';
import { CINEMA_MOODS } from '@/lib/tmdb/moods';
import { Container } from '@/components/layout/container';
import { getBackdropUrl } from '@/lib/tmdb/image';
import { Sparkles, ArrowRight, Compass, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Cinema Mood Matcher — Discover by Emotion | Cinelio',
  description:
    'Discover films by how you want to feel tonight. From mind-bending puzzles and neon cyberpunk to bittersweet romances and comforting Ghibli magic.',
};

export default function MoodsPage() {
  return (
    <div className="py-10 space-y-12">
      <Container>
        {/* Header Hero Section */}
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card/70 to-secondary/30 p-8 sm:p-12 shadow-lg">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--theme-accent)]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-accent-subtle)] text-[var(--theme-accent)] text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cinema Mood Matcher</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
              How Do You Want to <br className="hidden sm:inline" />
              <span className="text-[var(--theme-accent)]">Feel Tonight?</span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Don't browse by mundane genres. Choose an emotional wavelength and let Cinelio curate the
              finest cinematic works tailored to your evening's atmosphere.
            </p>
          </div>
        </div>

        {/* Moods Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CINEMA_MOODS.map((mood) => {
            const backdrop = getBackdropUrl(mood.backdropUrl, 'w780');

            return (
              <div
                key={mood.id}
                className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card hover:border-[var(--theme-accent)] transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between"
              >
                {/* Visual Backdrop */}
                <div className="relative h-44 w-full overflow-hidden bg-muted">
                  <CinemaImage
                    src={backdrop}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-75 group-hover:brightness-90"
                    fallbackType="backdrop"
                    fallbackTitle={mood.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

                  {/* Mood Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      style={{
                        backgroundColor: mood.themeColor,
                        color: '#FFFFFF',
                      }}
                      className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-md inline-flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{mood.shortLabel}</span>
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2.5">
                    <h2 className="text-xl font-bold tracking-tight text-foreground group-hover:text-[var(--theme-accent)] transition-colors">
                      {mood.name}
                    </h2>

                    <p className="text-xs font-serif italic text-muted-foreground">
                      "{mood.tagline}"
                    </p>

                    <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                      {mood.description}
                    </p>
                  </div>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {mood.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-medium border border-border/50"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>

                  {/* Action Link */}
                  <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">
                      Min {mood.minRating}+ Critical Score
                    </span>
                    <Button asChild size="sm" className="gap-1.5 font-semibold text-xs h-8">
                      <Link href={`/moods/${mood.id}`}>
                        <span>Enter Vibe</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
}
