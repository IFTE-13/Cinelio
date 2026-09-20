'use client';

import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Video } from '@/types/cinema';

interface TrailerModalProps {
  videos?: Video[];
  movieTitle: string;
}

export function TrailerModal({ videos = [], movieTitle }: TrailerModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Find the official trailer or first trailer/teaser
  const trailer =
    videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube' && v.official) ||
    videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube') ||
    videos.find((v) => v.site === 'YouTube');

  if (!trailer) {
    return null;
  }

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="gap-2 font-medium"
      >
        <Play className="w-4 h-4 fill-current" />
        <span>Watch Trailer</span>
      </Button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${movieTitle} Trailer`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="font-semibold text-sm sm:text-base truncate text-foreground pr-4">
                {movieTitle} — {trailer.name}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setIsOpen(false)}
                aria-label="Close trailer"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Video Container (16:9 ratio, no autoplay) */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0&rel=0`}
                title={`${movieTitle} Official Trailer`}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
