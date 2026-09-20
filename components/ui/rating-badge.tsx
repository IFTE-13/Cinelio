import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingBadgeProps {
  rating: number;
  votes?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
}

export function RatingBadge({
  rating,
  votes,
  size = 'md',
  className,
  showIcon = true,
}: RatingBadgeProps) {
  const formattedRating = Number(rating || 0).toFixed(1);

  const sizeClasses = {
    sm: 'text-xs gap-1 py-0.5 px-1.5',
    md: 'text-sm gap-1.5 py-1 px-2.5',
    lg: 'text-base gap-2 py-1.5 px-3.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md font-medium tracking-tight bg-secondary/80 border border-border/60 text-foreground tabular-nums',
        sizeClasses[size],
        className
      )}
    >
      {showIcon && (
        <Star
          style={{ color: 'var(--theme-accent)', fill: 'var(--theme-accent)' }}
          className={cn(
            'transition-colors shrink-0',
            iconSizes[size]
          )}
        />
      )}
      <span className="font-semibold">{formattedRating}</span>
      {votes !== undefined && votes > 0 && size !== 'sm' && (
        <span className="text-xs text-muted-foreground font-normal">
          ({votes > 1000 ? `${(votes / 1000).toFixed(1)}k` : votes})
        </span>
      )}
    </div>
  );
}
