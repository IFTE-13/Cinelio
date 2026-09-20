'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  label: string;
}

interface CatalogCategoryTabsProps {
  categories: Category[];
  activeCategory: string;
}

export function CatalogCategoryTabs({
  categories,
  activeCategory,
}: CatalogCategoryTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-border/80 pb-3">
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;

        return (
          <Link
            key={cat.id}
            href={`/movies?category=${cat.id}&page=1`}
            className={cn(
              'relative rounded-full px-4 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="catalogActiveTab"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                style={{
                  backgroundColor: 'var(--theme-accent)',
                  boxShadow: '0 2px 10px var(--theme-accent-subtle)',
                }}
                className="absolute inset-0 rounded-full"
              />
            )}
            <span className={cn('relative z-10 transition-colors', isActive ? 'text-white' : '')}>
              {cat.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
