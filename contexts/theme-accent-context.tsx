'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type AccentTheme = 'amber' | 'crimson' | 'cyan' | 'emerald' | 'violet';

export interface ThemeOption {
  id: AccentTheme;
  name: string;
  color: string;
  hoverColor: string;
  badgeBg: string;
  glow: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'amber',
    name: 'Cinema Gold',
    color: '#f59e0b',
    hoverColor: '#d97706',
    badgeBg: 'rgba(245, 158, 11, 0.16)',
    glow: 'rgba(245, 158, 11, 0.22)',
  },
  {
    id: 'crimson',
    name: 'Velvet Red',
    color: '#ef4444',
    hoverColor: '#dc2626',
    badgeBg: 'rgba(239, 68, 68, 0.16)',
    glow: 'rgba(239, 68, 68, 0.22)',
  },
  {
    id: 'cyan',
    name: 'Neon Noir',
    color: '#06b6d4',
    hoverColor: '#0891b2',
    badgeBg: 'rgba(6, 182, 212, 0.16)',
    glow: 'rgba(6, 182, 212, 0.22)',
  },
  {
    id: 'emerald',
    name: 'Emerald Cinema',
    color: '#10b981',
    hoverColor: '#059669',
    badgeBg: 'rgba(16, 185, 129, 0.16)',
    glow: 'rgba(16, 185, 129, 0.22)',
  },
  {
    id: 'violet',
    name: 'Amethyst Arthouse',
    color: '#a855f7',
    hoverColor: '#9333ea',
    badgeBg: 'rgba(168, 85, 247, 0.16)',
    glow: 'rgba(168, 85, 247, 0.22)',
  },
];

const STORAGE_KEY = 'cinelio_accent_theme';

interface ThemeAccentContextType {
  accentTheme: AccentTheme;
  setAccentTheme: (theme: AccentTheme) => void;
  isLoaded: boolean;
  currentOption: ThemeOption;
}

const ThemeAccentContext = createContext<ThemeAccentContextType | undefined>(undefined);

function applyThemeVariables(opt: ThemeOption) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.setAttribute('data-theme-accent', opt.id);
  root.style.setProperty('--theme-accent', opt.color);
  root.style.setProperty('--theme-accent-hover', opt.hoverColor);
  root.style.setProperty('--theme-accent-subtle', opt.badgeBg);
  root.style.setProperty('--theme-accent-glow', opt.glow);
  root.style.setProperty('--primary', opt.color);
  root.style.setProperty('--primary-foreground', '#ffffff');
  root.style.setProperty('--ring', opt.color);
}

export function ThemeAccentProvider({ children }: { children: React.ReactNode }) {
  const [accentTheme, setAccentThemeState] = useState<AccentTheme>('amber');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as AccentTheme | null;
      const validTheme = saved && ['amber', 'crimson', 'cyan', 'emerald', 'violet'].includes(saved)
        ? saved
        : 'amber';

      setAccentThemeState(validTheme);
      const opt = THEME_OPTIONS.find((t) => t.id === validTheme) || THEME_OPTIONS[0];
      applyThemeVariables(opt);
    } catch {
      applyThemeVariables(THEME_OPTIONS[0]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const setAccentTheme = useCallback((theme: AccentTheme) => {
    setAccentThemeState(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      console.error(e);
    }
    const opt = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];
    applyThemeVariables(opt);
  }, []);

  const currentOption =
    THEME_OPTIONS.find((t) => t.id === accentTheme) || THEME_OPTIONS[0];

  return (
    <ThemeAccentContext.Provider
      value={{
        accentTheme,
        setAccentTheme,
        isLoaded,
        currentOption,
      }}
    >
      {children}
    </ThemeAccentContext.Provider>
  );
}

export function useThemeAccent() {
  const context = useContext(ThemeAccentContext);
  if (!context) {
    throw new Error('useThemeAccent must be used within a ThemeAccentProvider');
  }
  return context;
}
