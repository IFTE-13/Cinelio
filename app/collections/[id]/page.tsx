import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Layers } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { CollectionParts } from '@/components/collection/collection-parts';
import { getCollection } from '@/lib/tmdb/client';
import { getBackdropUrl } from '@/lib/tmdb/image';

interface CollectionPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { id } = await params;
  const collection = await getCollection(id);

  if (!collection) {
    return {
      title: 'Collection Not Found — Cinelio',
    };
  }

  const backdropUrl = getBackdropUrl(collection.backdrop_path, 'w1280');

  return {
    title: `${collection.name} — Film Franchise`,
    description: collection.overview || `Explore all movies in the ${collection.name}.`,
    openGraph: {
      title: `${collection.name} — Cinelio`,
      description: collection.overview,
      images: backdropUrl ? [{ url: backdropUrl }] : [],
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { id } = await params;
  const collection = await getCollection(id);

  if (!collection) {
    notFound();
  }

  const backdropUrl = getBackdropUrl(collection.backdrop_path, 'original');

  return (
    <div className="pb-16">
      {/* Backdrop Header */}
      <div className="relative w-full h-[320px] sm:h-[400px] bg-card overflow-hidden">
        {backdropUrl ? (
          <Image
            src={backdropUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-30 dark:opacity-25"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-b from-muted to-background" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end">
          <Container>
            <div className="max-w-3xl pb-8 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>Film Franchise / Collection</span>
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                {collection.name}
              </h1>
              <p className="text-xs sm:text-sm font-mono text-muted-foreground">
                {collection.parts?.length || 0} films in franchise
              </p>
            </div>
          </Container>
        </div>
      </div>

      <Container className="mt-8 space-y-10">
        {/* Overview */}
        {collection.overview && (
          <div className="max-w-3xl space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Franchise Overview
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
              {collection.overview}
            </p>
          </div>
        )}

        {/* Movies in Collection */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground border-b border-border/60 pb-3">
            Chronological Order
          </h2>
          <CollectionParts parts={collection.parts || []} />
        </div>
      </Container>
    </div>
  );
}
