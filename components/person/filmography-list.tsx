import React from 'react';
import Link from 'next/link';
import { PersonCastCredit, PersonCrewCredit } from '@/types/cinema';
import { getYear } from '@/lib/tmdb/image';
import { RatingBadge } from '@/components/ui/rating-badge';

interface FilmographyListProps {
  castCredits: PersonCastCredit[];
  crewCredits: PersonCrewCredit[];
}

export function FilmographyList({ castCredits, crewCredits }: FilmographyListProps) {
  // Sort by release date descending
  const sortedCast = [...castCredits].sort((a, b) => {
    const yearA = a.release_date || '0000';
    const yearB = b.release_date || '0000';
    return yearB.localeCompare(yearA);
  });

  const sortedCrew = [...crewCredits].sort((a, b) => {
    const yearA = a.release_date || '0000';
    const yearB = b.release_date || '0000';
    return yearB.localeCompare(yearA);
  });

  return (
    <div className="space-y-10">
      {/* Acting Credits */}
      {sortedCast.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold tracking-tight text-foreground border-b border-border/80 pb-2">
            Acting ({sortedCast.length})
          </h3>
          <div className="divide-y divide-border/40">
            {sortedCast.map((credit, idx) => (
              <div
                key={`${credit.id}-${credit.credit_id || idx}`}
                className="py-3 flex items-center justify-between gap-4 hover:bg-secondary/40 px-2 rounded-md transition-colors"
              >
                <div className="flex items-baseline gap-4 min-w-0">
                  <span className="text-xs font-mono text-muted-foreground w-12 shrink-0">
                    {getYear(credit.release_date)}
                  </span>
                  <div className="min-w-0">
                    <Link
                      href={`/movies/${credit.id}`}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {credit.title}
                    </Link>
                    {credit.character && (
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        as {credit.character}
                      </span>
                    )}
                  </div>
                </div>

                {credit.vote_average > 0 && (
                  <RatingBadge rating={credit.vote_average} size="sm" className="shrink-0" />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Crew Credits */}
      {sortedCrew.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold tracking-tight text-foreground border-b border-border/80 pb-2">
            Production & Directing ({sortedCrew.length})
          </h3>
          <div className="divide-y divide-border/40">
            {sortedCrew.map((credit, idx) => (
              <div
                key={`${credit.id}-${credit.credit_id || idx}`}
                className="py-3 flex items-center justify-between gap-4 hover:bg-secondary/40 px-2 rounded-md transition-colors"
              >
                <div className="flex items-baseline gap-4 min-w-0">
                  <span className="text-xs font-mono text-muted-foreground w-12 shrink-0">
                    {getYear(credit.release_date)}
                  </span>
                  <div className="min-w-0">
                    <Link
                      href={`/movies/${credit.id}`}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {credit.title}
                    </Link>
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {credit.job}
                    </span>
                  </div>
                </div>

                {credit.vote_average > 0 && (
                  <RatingBadge rating={credit.vote_average} size="sm" className="shrink-0" />
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
