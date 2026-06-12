'use client';

import { Card } from "@/components/ui/card";
import { Movie } from "@/types/movie";
import Image from "next/image";
import { Star } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const year = movie.release_date?.split('-')[0];
  const rating = movie.vote_average?.toFixed(1);

  return (
    <Card className="group relative overflow-hidden rounded-xl border-0 bg-card transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="relative aspect-2/3 overflow-hidden">
        {movie.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-linear-to-br from-gray-800 to-gray-900">
            <span className="text-sm text-gray-400">No image</span>
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 backdrop-blur-sm">
          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
          <span className="text-xs font-semibold text-white">{rating || 'N/A'}</span>
        </div>
        
        {/* Year Badge */}
        <div className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2 py-1 backdrop-blur-sm">
          <span className="text-xs text-white">{year || 'N/A'}</span>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="line-clamp-1 text-sm font-semibold tracking-tight">
          {movie.title}
        </h3>
      </div>
    </Card>
  );
}