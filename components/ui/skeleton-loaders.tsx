import React from 'react';
import { cn } from '@/lib/utils';

export function MovieCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col space-y-2.5', className)}>
      <div className="aspect-[2/3] w-full rounded-md bg-muted/70 animate-pulse border border-border/40" />
      <div className="space-y-1.5 px-0.5">
        <div className="h-4 w-4/5 rounded bg-muted animate-pulse" />
        <div className="flex items-center justify-between">
          <div className="h-3 w-12 rounded bg-muted/80 animate-pulse" />
          <div className="h-3 w-8 rounded bg-muted/80 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function MovieGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function MovieRowSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-6 w-40 rounded bg-muted animate-pulse" />
        <div className="h-4 w-16 rounded bg-muted animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[520px] rounded-lg bg-muted/50 border border-border/40 animate-pulse overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent p-6 sm:p-12 flex flex-col justify-end">
        <div className="max-w-2xl space-y-4">
          <div className="h-5 w-28 rounded bg-muted" />
          <div className="h-10 sm:h-12 w-3/4 rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted/80" />
          <div className="h-4 w-2/3 rounded bg-muted/80" />
          <div className="flex gap-3 pt-2">
            <div className="h-10 w-32 rounded bg-muted" />
            <div className="h-10 w-32 rounded bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MovieDetailsSkeleton() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="w-full h-[400px] rounded-lg bg-muted/60" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="aspect-[2/3] w-full rounded-md bg-muted" />
        <div className="md:col-span-2 space-y-6">
          <div className="h-10 w-2/3 rounded bg-muted" />
          <div className="h-5 w-1/3 rounded bg-muted" />
          <div className="h-24 w-full rounded bg-muted" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="h-14 rounded bg-muted" />
            <div className="h-14 rounded bg-muted" />
            <div className="h-14 rounded bg-muted" />
            <div className="h-14 rounded bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}
