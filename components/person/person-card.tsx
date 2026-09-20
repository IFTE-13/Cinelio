'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User } from 'lucide-react';
import { getProfileUrl } from '@/lib/tmdb/image';
import { CastMember } from '@/types/cinema';
import { cn } from '@/lib/utils';

interface PersonCardProps {
  person: CastMember | { id: number; name: string; character?: string; job?: string; profile_path: string | null };
  className?: string;
}

export function PersonCard({ person, className }: PersonCardProps) {
  const [imageError, setImageError] = useState(false);
  const profileUrl = getProfileUrl(person.profile_path, 'h632');
  const role = 'character' in person ? person.character : 'job' in person ? person.job : null;

  return (
    <Link
      href={`/people/${person.id}`}
      className={cn(
        'group flex flex-col items-center text-center p-2.5 rounded-lg transition-colors hover:bg-secondary/60 focus-visible:ring-2 focus-visible:ring-ring focus:outline-none',
        className
      )}
    >
      {/* Profile Image */}
      <div className="relative aspect-square w-24 sm:w-28 rounded-full overflow-hidden bg-muted border border-border/60 mb-2.5 group-hover:border-border transition-colors">
        {profileUrl && !imageError ? (
          <Image
            src={profileUrl}
            alt={person.name}
            fill
            sizes="112px"
            className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-950 text-foreground border border-white/10">
            <span className="text-sm font-bold font-mono tracking-wider text-[var(--theme-accent)]">
              {person.name
                .split(' ')
                .filter(Boolean)
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </span>
          </div>
        )}
      </div>

      {/* Person Name */}
      <span className="text-xs sm:text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
        {person.name}
      </span>

      {/* Role / Character */}
      {role && (
        <span className="text-[11px] sm:text-xs text-muted-foreground line-clamp-1 mt-0.5">
          {role}
        </span>
      )}
    </Link>
  );
}
