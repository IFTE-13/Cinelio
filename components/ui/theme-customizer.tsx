'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Palette, Sun, Moon, Laptop, Check } from 'lucide-react';
import { useThemeAccent, THEME_OPTIONS, AccentTheme } from '@/contexts/theme-accent-context';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ThemeCustomizer() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { accentTheme, setAccentTheme, isLoaded } = useThemeAccent();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const currentOption = THEME_OPTIONS.find((t) => t.id === accentTheme) || THEME_OPTIONS[0];

  return (
    <div className="relative" ref={popoverRef}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 px-2.5 gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        aria-label="Customize appearance and cinema theme"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5">
          <span
            className="w-3.5 h-3.5 rounded-full border border-border/60 shadow-xs transition-colors shrink-0"
            style={{ backgroundColor: currentOption.color }}
          />
          <span className="text-xs font-medium hidden lg:inline">Theme</span>
        </div>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-72 rounded-xl border border-border/80 bg-popover/95 backdrop-blur-xl p-4 shadow-2xl z-50 space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-foreground" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                  Appearance
                </h4>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase whitespace-nowrap">
                {currentOption.name}
              </span>
            </div>

            {/* Mode Selector (Light, Dark, System) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Display Mode
              </label>
              <div className="grid grid-cols-3 gap-1 bg-secondary/60 p-1 rounded-lg border border-border/40">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={cn(
                    'flex items-center justify-center gap-1 py-1 px-2 rounded-md text-xs font-medium transition-colors',
                    theme === 'light'
                      ? 'bg-background text-foreground shadow-xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={cn(
                    'flex items-center justify-center gap-1 py-1 px-2 rounded-md text-xs font-medium transition-colors',
                    theme === 'dark'
                      ? 'bg-background text-foreground shadow-xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('system')}
                  className={cn(
                    'flex items-center justify-center gap-1 py-1 px-2 rounded-md text-xs font-medium transition-colors',
                    theme === 'system'
                      ? 'bg-background text-foreground shadow-xs font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Auto</span>
                </button>
              </div>
            </div>

            {/* Cinema Color Themes */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Cinema Accent Theme
              </label>
              <div className="space-y-1">
                {THEME_OPTIONS.map((opt) => {
                  const isSelected = accentTheme === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAccentTheme(opt.id)}
                      className={cn(
                        'w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors text-left',
                        isSelected
                          ? 'bg-secondary text-foreground font-semibold'
                          : 'hover:bg-secondary/60 text-muted-foreground hover:text-foreground'
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-xs shrink-0"
                          style={{ backgroundColor: opt.color }}
                        />
                        <span className="whitespace-nowrap">{opt.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-foreground shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
