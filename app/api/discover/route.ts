import { NextRequest, NextResponse } from 'next/server';
import { discoverMovies } from '@/lib/tmdb/client';
import { DiscoverFilters } from '@/types/cinema';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const filters: DiscoverFilters = {
    genreId: searchParams.get('genreId') || undefined,
    year: searchParams.get('year') || undefined,
    releaseDateGte: searchParams.get('releaseDateGte') || undefined,
    releaseDateLte: searchParams.get('releaseDateLte') || undefined,
    minRating: searchParams.get('minRating') || undefined,
    language: searchParams.get('language') || undefined,
    sortBy: (searchParams.get('sortBy') as DiscoverFilters['sortBy']) || 'popularity.desc',
    page: parseInt(searchParams.get('page') || '1', 10),
  };

  try {
    const data = await discoverMovies(filters);
    return NextResponse.json(data);
  } catch (error) {
    console.error('API /api/discover error:', error);
    return NextResponse.json(
      { error: 'Failed to discover movies' },
      { status: 500 }
    );
  }
}
