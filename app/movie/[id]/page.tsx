'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookmarkPlus, BookmarkCheck, Clock, Calendar, Users, Award } from 'lucide-react';
import { useWatchlist } from '@/hooks/useWatchlist';
import { MovieDetails } from '@/types/movie';

export default function MoviePage() {
  const params = useParams();
  const router = useRouter();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`/api/movies/${params.id}`);
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error('Error fetching movie:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Movie not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const inWatchlist = isInWatchlist(movie.id);
  const trailer = movie.videos?.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
  const year = movie.release_date?.split('-')[0];
  const hours = Math.floor(movie.runtime / 60);
  const minutes = movie.runtime % 60;
  const ratingPercentage = Math.round(movie.vote_average * 10);

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2 bg-background/80 backdrop-blur-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden">
        {movie.backdrop_path ? (
          <>
            <Image
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-background" />
        )}
        
        {/* Floating Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container mx-auto">
            <div className="max-w-3xl">
              <h1 className="mb-2 text-3xl font-bold md:text-5xl">
                {movie.title}
                <span className="ml-2 text-2xl text-muted-foreground md:text-3xl">
                  ({year})
                </span>
              </h1>
              
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="relative inline-flex items-center justify-center">
                    <svg className="h-12 w-12 -rotate-90 transform">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        className="text-muted"
                        strokeDasharray="125.6"
                        strokeDashoffset="125.6"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        className="text-primary"
                        strokeDasharray="125.6"
                        strokeDashoffset={125.6 - (125.6 * ratingPercentage) / 100}
                      />
                    </svg>
                    <span className="absolute text-xs font-bold">
                      {ratingPercentage}%
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold">User Score</div>
                    <div className="text-xs text-muted-foreground">
                      {movie.vote_count.toLocaleString()} votes
                    </div>
                  </div>
                </div>
                
                {movie.runtime > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{hours}h {minutes}m</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(movie.release_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {movie.genres?.slice(0, 4).map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Left Column - Poster & Actions */}
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <div className="overflow-hidden rounded-2xl shadow-xl">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    width={500}
                    height={750}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="aspect-[2/3] bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No poster</span>
                  </div>
                )}
              </div>
              
              <Button
                onClick={() => inWatchlist ? removeFromWatchlist(movie.id) : addToWatchlist(movie)}
                className="mt-4 w-full gap-2"
                size="lg"
                variant={inWatchlist ? "default" : "outline"}
              >
                {inWatchlist ? (
                  <>
                    <BookmarkCheck className="h-4 w-4" />
                    In Watchlist
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="h-4 w-4" />
                    Add to Watchlist
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="md:col-span-2">
            {/* Overview */}
            <div className="mb-8">
              <h2 className="mb-3 text-2xl font-semibold">Overview</h2>
              <p className="leading-relaxed text-muted-foreground">
                {movie.overview || 'No overview available.'}
              </p>
            </div>

            {/* Top Cast */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Top Cast
                </h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {movie.credits.cast.slice(0, 8).map((actor) => (
                    <div key={actor.id} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                        {actor.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-sm font-medium">{actor.name}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          as {actor.character}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trailer */}
            {trailer && (
              <div>
                <h2 className="mb-4 text-2xl font-semibold flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Trailer
                </h2>
                <div className="aspect-video overflow-hidden rounded-2xl">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title={`${movie.title} Trailer`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-2xl"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}