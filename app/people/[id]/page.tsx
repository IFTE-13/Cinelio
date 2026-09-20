import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { User, ExternalLink, Calendar, MapPin, Film } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { MovieRow } from '@/components/movie/movie-row';
import { FilmographyList } from '@/components/person/filmography-list';
import { getPersonDetails, getPersonCredits } from '@/lib/tmdb/client';
import { getProfileUrl } from '@/lib/tmdb/image';
import { Movie } from '@/types/cinema';
import { Button } from '@/components/ui/button';

interface PersonPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PersonPageProps): Promise<Metadata> {
  const { id } = await params;
  const person = await getPersonDetails(id);

  if (!person) {
    return {
      title: 'Person Not Found — Cinelio',
    };
  }

  const profileUrl = getProfileUrl(person.profile_path, 'h632');

  return {
    title: `${person.name} — Filmography & Biography`,
    description:
      person.biography?.slice(0, 160) ||
      `Explore films, biography, and full career credits for ${person.name}.`,
    openGraph: {
      title: `${person.name} — Cinelio`,
      description: person.biography?.slice(0, 160),
      images: profileUrl ? [{ url: profileUrl }] : [],
    },
  };
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = await params;
  const [person, credits] = await Promise.all([
    getPersonDetails(id),
    getPersonCredits(id),
  ]);

  if (!person) {
    notFound();
  }

  const profileUrl = getProfileUrl(person.profile_path, 'h632');

  // Known for: top credits sorted by popularity or vote_count
  const allCredits = [...(credits.cast || []), ...(credits.crew || [])];
  // Deduplicate by ID
  const uniqueKnownForMap = new Map<number, Movie>();
  allCredits.forEach((c) => {
    if (!uniqueKnownForMap.has(c.id)) {
      uniqueKnownForMap.set(c.id, {
        id: c.id,
        title: c.title,
        overview: c.overview,
        poster_path: c.poster_path,
        backdrop_path: c.backdrop_path,
        vote_average: c.vote_average,
        vote_count: c.vote_count,
        release_date: c.release_date,
      });
    }
  });

  const knownForMovies = Array.from(uniqueKnownForMap.values())
    .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
    .slice(0, 8);

  return (
    <div className="py-10 sm:py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Portrait & Personal Info (4 cols) */}
          <div className="md:col-span-4 lg:col-span-4 space-y-6">
            <div className="relative aspect-[3/4] w-full max-w-[280px] mx-auto md:max-w-none rounded-xl overflow-hidden shadow-md border border-border/80 bg-muted">
              {profileUrl ? (
                <Image
                  src={profileUrl}
                  alt={person.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 280px, 350px"
                  className="object-cover object-top"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-neutral-900 to-black text-foreground border border-white/10 p-6">
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                    <span className="text-2xl font-bold font-mono tracking-widest text-[var(--theme-accent)]">
                      {person.name
                        .split(' ')
                        .filter(Boolean)
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    {person.known_for_department || 'Artist Profile'}
                  </span>
                </div>
              )}
            </div>

            {/* Facts Box */}
            <div className="rounded-xl border border-border/70 bg-card p-5 space-y-3.5 text-xs">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-foreground border-b border-border/60 pb-2">
                Personal Info
              </h3>

              <div>
                <span className="text-muted-foreground block">Known For</span>
                <span className="font-medium text-foreground">
                  {person.known_for_department || 'Acting'}
                </span>
              </div>

              {person.birthday && (
                <div>
                  <span className="text-muted-foreground block">Born</span>
                  <span className="font-medium text-foreground flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    {person.birthday}
                  </span>
                </div>
              )}

              {person.place_of_birth && (
                <div>
                  <span className="text-muted-foreground block">Birthplace</span>
                  <span className="font-medium text-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="line-clamp-1">{person.place_of_birth}</span>
                  </span>
                </div>
              )}

              {person.imdb_id && (
                <div className="pt-2 border-t border-border/40">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto text-xs text-muted-foreground hover:text-foreground gap-1"
                  >
                    <a
                      href={`https://www.imdb.com/name/${person.imdb_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span>IMDb Profile</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Name, Biography, Known For & Full Filmography (8 cols) */}
          <div className="md:col-span-8 lg:col-span-8 space-y-8">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                {person.name}
              </h1>
              <p className="text-sm font-mono text-muted-foreground mt-1">
                {person.known_for_department}
              </p>
            </div>

            {/* Biography */}
            <div className="space-y-2">
              <h2 className="text-base font-semibold uppercase tracking-wider text-foreground">
                Biography
              </h2>
              <div className="text-sm sm:text-base leading-relaxed text-muted-foreground max-w-2xl space-y-4">
                {person.biography ? (
                  person.biography.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))
                ) : (
                  <p>No biography currently archived for this person.</p>
                )}
              </div>
            </div>

            {/* Known For Row */}
            {knownForMovies.length > 0 && (
              <div className="pt-4 border-t border-border/60">
                <MovieRow
                  title="Notable Works"
                  subtitle={`Prominent titles featuring ${person.name}`}
                  movies={knownForMovies}
                />
              </div>
            )}

            {/* Complete Filmography Table */}
            <div className="pt-4 border-t border-border/60 space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Filmography
              </h2>
              <FilmographyList
                castCredits={credits.cast || []}
                crewCredits={credits.crew || []}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
