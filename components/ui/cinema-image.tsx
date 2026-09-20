'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { BackdropFallback } from './backdrop-fallback';
import { MoviePosterFallback } from './movie-poster-fallback';
import { cn } from '@/lib/utils';

interface CinemaImageProps extends Omit<ImageProps, 'onError' | 'src' | 'alt'> {
  src?: ImageProps['src'] | null;
  alt?: string;
  fallbackType?: 'backdrop' | 'poster' | 'none';
  fallbackTitle?: string;
  fallbackYear?: string;
  containerClassName?: string;
}

export function CinemaImage({
  src,
  alt = '',
  fallbackType = 'backdrop',
  fallbackTitle,
  fallbackYear,
  className,
  containerClassName,
  sizes,
  fill,
  priority,
  ...rest
}: CinemaImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // If no source or error occurred, render our editorial fallback
  if (!src || hasError) {
    if (fallbackType === 'poster') {
      return (
        <MoviePosterFallback
          title={fallbackTitle || ''}
          year={fallbackYear}
          variant="card"
          className={containerClassName}
        />
      );
    }
    if (fallbackType === 'backdrop') {
      return (
        <BackdropFallback
          title={fallbackTitle}
          className={containerClassName}
        />
      );
    }
    return <div className={cn('w-full h-full bg-muted', containerClassName)} />;
  }

  return (
    <div className={cn('relative w-full h-full overflow-hidden', containerClassName)}>
      <Image
        src={src}
        alt="" // empty alt prevents ugly browser broken image text
        fill={fill}
        sizes={sizes}
        priority={priority}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        {...rest}
      />
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-muted/50 animate-pulse pointer-events-none" />
      )}
    </div>
  );
}
