import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'default' | 'narrow' | 'wide' | 'full';
}

export function Container({
  children,
  className,
  size = 'default',
  ...props
}: ContainerProps) {
  // Screen-filling fluid width instead of restrictive centering
  const sizeClasses = {
    narrow: 'max-w-5xl mx-auto',
    default: 'w-full',
    wide: 'w-full',
    full: 'w-full',
  };

  return (
    <div
      className={cn(
        'w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
