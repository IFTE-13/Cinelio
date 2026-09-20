import { NextRequest, NextResponse } from 'next/server';
import { searchMovies, searchPeople } from '@/lib/tmdb/client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  if (!query.trim()) {
    return NextResponse.json({
      movies: { page: 1, results: [], total_pages: 0, total_results: 0 },
      people: { page: 1, results: [], total_pages: 0, total_results: 0 },
    });
  }

  try {
    const [movies, people] = await Promise.all([
      searchMovies(query, page),
      searchPeople(query, page),
    ]);

    return NextResponse.json({ movies, people });
  } catch (error) {
    console.error('API /api/search error:', error);
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    );
  }
}
