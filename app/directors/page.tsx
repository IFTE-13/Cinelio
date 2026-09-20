import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CURATED_DIRECTORS } from '@/lib/tmdb/directors';
import { Container } from '@/components/layout/container';
import { getBackdropUrl } from '@/lib/tmdb/image';
import { CinemaImage } from '@/components/ui/cinema-image';
import { Clapperboard, ArrowRight, Quote, Sparkles, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Auteur & Visionary Directors — Hallmarks & Filmographies | Cinelio',
  description:
    'Celebrate the visionary filmmakers who shaped cinema history. Explore signature motifs, trademarks, and filmographies of Christopher Nolan, Denis Villeneuve, Quentin Tarantino, Martin Scorsese, and more.',
};

export default function DirectorsPage() {
  return (
    <div className="py-10 space-y-12">
      <Container>
        {/* Header Hero Section */}
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-card via-card/70 to-secondary/30 p-8 sm:p-12 shadow-lg">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--theme-accent)]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--theme-accent-subtle)] text-[var(--theme-accent)] text-xs font-semibold tracking-wide uppercase">
              <Clapperboard className="w-3.5 h-3.5" />
              <span>Auteur Showcase</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
              The Visionaries Behind <br className="hidden sm:inline" />
              <span className="text-[var(--theme-accent)]">Cinematic History</span>
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              In cinema, true auteurs leave an unmistakable signature across every frame. Discover the
              obsessions, visual trademarks, and defining masterpieces of the world's most influential directors.
            </p>
          </div>
        </div>

        {/* Directors Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {CURATED_DIRECTORS.map((director) => {
            const backdrop = getBackdropUrl(director.backdropPath, 'w780');

            return (
              <div
                key={director.id}
                className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card hover:border-[var(--theme-accent)] transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between"
              >
                {/* Backdrop with gradient mask */}
                <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-muted">
                  <CinemaImage
                    src={backdrop}
                    fallbackType="backdrop"
                    fallbackTitle={director.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-70 group-hover:brightness-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

                  {/* Nationality & Era Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-md bg-background/80 backdrop-blur-md text-foreground border border-border/70 inline-flex items-center gap-1.5">
                      <Film className="w-3 h-3 text-[var(--theme-accent)]" />
                      <span>{director.nationality} • Born {director.birthYear}</span>
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-[var(--theme-accent)] transition-colors">
                      {director.name}
                    </h2>

                    <p className="text-xs text-[var(--theme-accent)] font-medium">
                      {director.tagline}
                    </p>

                    {/* Quote */}
                    <div className="relative pl-4 border-l-2 border-[var(--theme-accent)]/60 my-2">
                      <p className="text-xs font-serif italic text-muted-foreground leading-relaxed">
                        "{director.quote}"
                      </p>
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                      {director.signatureStyle}
                    </p>
                  </div>

                  {/* Hallmarks */}
                  <div className="space-y-2.5">
                    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Signature Trademarks:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {director.hallmarks.map((mark) => (
                        <span
                          key={mark}
                          className="text-[11px] px-2.5 py-0.5 rounded-md bg-secondary text-secondary-foreground font-medium border border-border/50"
                        >
                          {mark}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Defining Works */}
                  <div className="pt-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Key Masterpieces: </span>
                    {director.keyMasterpieces.join(', ')}
                  </div>

                  {/* Action Link */}
                  <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Full filmography & crew credits
                    </span>
                    <Button asChild size="sm" className="gap-1.5 font-semibold text-xs">
                      <Link href={`/people/${director.id}`}>
                        <span>Explore Filmography</span>
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
