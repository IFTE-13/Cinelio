import { NextRequest, NextResponse } from 'next/server';
import {
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
  getTrendingMovies,
} from '@/lib/tmdb/client';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category') || 'popular';
  const page = parseInt(searchParams.get('page') || '1', 10);

  try {
    let data;
    switch (category) {
      case 'trending':
        data = await getTrendingMovies('day', page);
        break;
      case 'top_rated':
        data = await getTopRatedMovies(page);
        break;
      case 'now_playing':
        data = await getNowPlayingMovies(page);
        break;
      case 'upcoming':
        data = await getUpcomingMovies(page);
        break;
      case 'popular':
      default:
        data = await getPopularMovies(page);
        break;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('API /api/movies error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}