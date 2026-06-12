'use client';

import { Button } from '@/components/ui/button';

const categories = [
  { id: 'popular', name: '🔥 Popular' },
  { id: 'now_playing', name: '📽️ Now Playing' },
  { id: 'top_rated', name: '⭐ Top Rated' },
  { id: 'upcoming', name: '🗓️ Upcoming' },
];

interface CategoryButtonsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryButtons({ activeCategory, onCategoryChange }: CategoryButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? 'default' : 'outline'}
          onClick={() => onCategoryChange(category.id)}
          className="transition-all"
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}