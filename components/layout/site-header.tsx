'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Menu,
  X,
  Heart,
  Film,
  Compass,
  Clapperboard,
  Layers,
  History,
  Dices,
  Sparkles,
  Users,
} from 'lucide-react';
import { Container } from './container';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ThemeCustomizer } from '@/components/ui/theme-customizer';
import { CommandPalette } from '@/components/search/command-palette';
import { CinemaRouletteModal } from '@/components/movie/cinema-roulette-modal';
import { useFavorites } from '@/contexts/favorites-context';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [rouletteOpen, setRouletteOpen] = useState(false);
  const { favorites, isLoaded } = useFavorites();

  const navLinks = [
    { label: 'Discover', href: '/discover', icon: Compass },
    { label: 'Moods', href: '/moods', icon: Sparkles },
    { label: 'Eras', href: '/eras', icon: History },
    { label: 'Directors', href: '/directors', icon: Users },
    { label: 'Genres', href: '/genres', icon: Layers },
    { label: 'Favorites', href: '/favorites', icon: Heart, badge: isLoaded ? favorites.length : 0 },
  ];

  // Global hotkey listener: Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur-md transition-colors">
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Typographic Brand Wordmark */}
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                onClick={closeMobileMenu}
              >
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    Cinelio
                  </span>
                  <span
                    style={{ backgroundColor: 'var(--theme-accent)' }}
                    className="h-1.5 w-1.5 rounded-full transition-colors"
                  />
                </div>
                <span className="text-[10px] font-medium tracking-wider uppercase text-muted-foreground -mt-1 hidden sm:inline">
                  Explore cinema
                </span>
              </Link>

              {/* Desktop Navigation Links */}
              <nav className="hidden md:flex items-center gap-1 pl-4" aria-label="Main Navigation">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'px-3 py-1.5 text-sm font-medium rounded-md transition-colors relative flex items-center gap-1.5',
                        isActive
                          ? 'text-foreground font-semibold bg-secondary/80'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                      )}
                    >
                      <span>{link.label}</span>
                      {link.badge !== undefined && link.badge > 0 && (
                        <span
                          style={{
                            backgroundColor: 'var(--theme-accent-subtle)',
                            color: 'var(--theme-accent)',
                          }}
                          className="text-[11px] font-mono px-1.5 py-0.2 rounded-full font-semibold transition-colors"
                        >
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Action Cluster */}
            <div className="flex items-center gap-2">
              {/* Surprise Me / Cinema Roulette Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRouletteOpen(true)}
                className="gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/70 h-9 px-2.5 rounded-md"
                title="Surprise Me (Cinema Roulette)"
              >
                <Dices className="w-4 h-4 text-[var(--theme-accent)]" />
                <span className="hidden lg:inline font-medium">Surprise Me</span>
              </Button>

              {/* Universal Command Palette Trigger */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCommandPaletteOpen(true)}
                className="gap-2 text-muted-foreground hover:text-foreground h-9 px-3 rounded-md bg-secondary/30 border-border/70 hover:border-border"
                aria-label="Open command palette search"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="text-xs hidden sm:inline text-muted-foreground font-normal">
                  Search cinema...
                </span>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                  ⌘K
                </kbd>
              </Button>

              {/* Theme Customizer with Cinema Accent Palettes */}
              <ThemeCustomizer />

              {/* Quick Theme Toggle */}
              <ThemeToggle />

              {/* Mobile Menu Trigger */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-9 w-9 text-muted-foreground hover:text-foreground"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </Container>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-background px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={cn(
                    'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-secondary text-foreground font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-secondary text-foreground font-semibold border border-border">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-border flex items-center justify-between px-3">
              <button
                onClick={() => {
                  closeMobileMenu();
                  setRouletteOpen(true);
                }}
                className="flex items-center gap-2 text-xs font-medium text-foreground py-1"
              >
                <Dices className="w-4 h-4 text-[var(--theme-accent)]" />
                <span>Spin Cinema Roulette</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Command Palette & Cinema Roulette Modals */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenRoulette={() => setRouletteOpen(true)}
      />

      <CinemaRouletteModal
        isOpen={rouletteOpen}
        onClose={() => setRouletteOpen(false)}
      />
    </>
  );
}
