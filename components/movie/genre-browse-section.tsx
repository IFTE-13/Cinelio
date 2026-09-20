import React from 'react';
import Link from 'next/link';
import { Genre } from '@/types/cinema';
import { ArrowRight } from 'lucide-react';

interface GenreBrowseSectionProps {
  genres: Genre[];
}

export function GenreBrowseSection({ genres }: GenreBrowseSectionProps) {
  return (
    <section className="space-y-4 my-12 border-t border-border/50 pt-10">
      <div className="flex items-end justify-between px-1">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Browse by Genre
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Discover cinema across distinct cinematic styles and traditions
          </p>
        </div>

        <Link
          href="/genres"
          className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
        >
          <span>All genres</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {genres.slice(0, 12).map((genre) => (
          <Link
            key={genre.id}
            href={`/genres/${genre.id}`}
            className="group flex flex-col justify-between p-3.5 rounded-lg border border-border/60 bg-card hover:border-foreground/30 hover:bg-secondary/40 transition-all focus-visible:ring-2 focus-visible:ring-ring focus:outline-none"
          >
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {genre.name}
            </span>
            <span className="text-[11px] text-muted-foreground mt-2 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Explore →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
