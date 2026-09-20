import React from 'react';
import Link from 'next/link';
import { Container } from './container';

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/30 py-12 transition-colors">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Editorial Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold tracking-tight text-foreground">
                Cinelio
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md leading-relaxed">
              A modern cinema database and discovery catalog. Designed for cinephiles and curious viewers exploring the craft, history, and voices of world cinema.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Explore
            </h4>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>
                <Link href="/discover" className="hover:text-foreground transition-colors">
                  Discover Films
                </Link>
              </li>
              <li>
                <Link href="/movies" className="hover:text-foreground transition-colors">
                  Movie Catalog
                </Link>
              </li>
              <li>
                <Link href="/genres" className="hover:text-foreground transition-colors">
                  Genres Directory
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="hover:text-foreground transition-colors">
                  Saved Favorites
                </Link>
              </li>
            </ul>
          </div>

          {/* Data & Attribution */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Data & Attribution
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Movie metadata and images provided by{' '}
              <a
                href="https://www.themoviedb.org"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
              >
                TMDB
              </a>
              .
            </p>
            <p className="text-[11px] text-muted-foreground/80">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Cinelio. All rights reserved.</p>
          <p className="text-[11px] text-muted-foreground/70">
            Cinelio does not host, stream, or distribute media files.
          </p>
        </div>
      </Container>
    </footer>
  );
}
