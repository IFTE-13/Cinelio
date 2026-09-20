import React from 'react';
import { Film, Clapperboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BackdropFallbackProps {
  title?: string;
  className?: string;
}

export function BackdropFallback({ title, className }: BackdropFallbackProps) {
  return (
    <div
      className={cn(
        'relative w-full h-full min-h-[160px] bg-gradient-to-r from-neutral-950 via-zinc-900 to-neutral-950 overflow-hidden flex items-center justify-center select-none',
        className
      )}
    >
      {/* Background Ambient Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--theme-accent-glow),transparent_65%)] opacity-40 pointer-events-none" />

      {/* Watermark Icon */}
      <div className="absolute -right-12 -bottom-12 text-white/[0.03] pointer-events-none">
        <Film className="w-80 h-80 stroke-[0.8]" />
      </div>

      {/* Center Subtle Cinematic Badge */}
      <div className="relative z-10 flex flex-col items-center gap-2 p-6 text-center">
        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs text-[var(--theme-accent)]">
          <Clapperboard className="w-6 h-6 stroke-[1.5] opacity-80" />
        </div>
        {title && (
          <span className="text-xs sm:text-sm font-semibold text-muted-foreground/80 tracking-wide font-mono uppercase">
            {title}
          </span>
        )}
      </div>
    </div>
  );
}
