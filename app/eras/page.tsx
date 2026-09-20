import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { CinemaImage } from '@/components/ui/cinema-image';
import { CINEMA_ERAS } from '@/lib/tmdb/eras';
import { Container } from '@/components/layout/container';
import { getBackdropUrl } from '@/lib/tmdb/image';
import { History, ArrowRight, Sparkles, Film, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Cinema Eras — Decades Time Machine | Cinelio',
  description:
    'Travel through 50+ years of cinema history. From 1970s New Hollywood to 1980s Neon blockbusters, 1990s Indie revolution, and contemporary 2020s visions.',
};

export default function ErasPage() {
  return (
    <div className="py-10 space-y-12">
      <Container>
        {/* Header Hero Section */}
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card/70 to-secondary/30 p-8 sm:p-12 shadow-lg">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--theme-accent)]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-accent-subtle)] text-[var(--theme-accent)] text-xs font-semibold tracking-wide uppercase">
              <History className="w-3.5 h-3.5" />
              <span>Decades Time Machine</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
              Journey Through the <br className="hidden sm:inline" />
              <span className="text-[var(--theme-accent)]">Golden Eras of Film</span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Cinema evolves in monumental waves. Choose an era to step back in time, explore defining
              masterpieces, legendary directors, and the cultural movements that reshaped storytelling forever.
            </p>
          </div>
        </div>

        {/* Eras Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {CINEMA_ERAS.map((era) => {
            const backdrop = getBackdropUrl(era.backdropUrl, 'w780');

            return (
              <div
                key={era.id}
                className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card hover:border-[var(--theme-accent)] transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between"
              >
                {/* Visual Backdrop with gradient mask */}
                <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-muted">
                  <CinemaImage
                    src={backdrop}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-75 group-hover:brightness-90"
                    fallbackType="backdrop"
                    fallbackTitle={era.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

                  {/* Decade Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span
                      style={{
                        backgroundColor: era.themeColor,
                        color: '#FFFFFF',
                      }}
                      className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-md inline-flex items-center gap-1.5"
                    >
                      <Film className="w-3 h-3" />
                      <span>{era.years}</span>
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <h2 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-[var(--theme-accent)] transition-colors">
                        {era.name}
                      </h2>
                    </div>

                    <p className="text-xs font-serif italic text-muted-foreground">
                      "{era.tagline}"
                    </p>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                      {era.description}
                    </p>
                  </div>

                  {/* Hallmarks Tags */}
                  <div className="space-y-3 pt-2">
                    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Hallmarks:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {era.hallmarks.map((mark) => (
                        <span
                          key={mark}
                          className="text-[11px] px-2.5 py-0.5 rounded-md bg-secondary text-secondary-foreground font-medium border border-border/50"
                        >
                          {mark}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Filmmakers */}
                  <div className="pt-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Key Auteurs: </span>
                    {era.keyFilmmakers.join(', ')}
                  </div>

                  {/* Action Link */}
                  <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Explore archive & ratings
                    </span>
                    <Button asChild size="sm" className="gap-1.5 font-semibold text-xs">
                      <Link href={`/eras/${era.id}`}>
                        <span>Step into {era.decade}</span>
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
