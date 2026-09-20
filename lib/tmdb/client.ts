import {
  Movie,
  MovieDetails,
  CollectionDetails,
  PersonDetails,
  PersonCredits,
  Genre,
  PaginatedResponse,
  DiscoverFilters,
  Credits,
  Video,
} from '@/types/cinema';
import {
  FALLBACK_MOVIES,
  FALLBACK_GENRES,
  FALLBACK_MOVIE_DETAILS,
  FALLBACK_COLLECTION,
  FALLBACK_PERSON,
  FALLBACK_PERSON_CREDITS,
} from './fallback-data';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function getApiKey(): string | null {
  return process.env.TMDB_API_KEY?.trim() || null;
}

export function isTmdbConfigured(): boolean {
  return Boolean(getApiKey());
}

async function tmdbFetch<T>(
  endpoint: string,
  searchParams: Record<string, string | number | undefined> = {},
  revalidateSeconds: number = 3600
): Promise<T | null> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('language', 'en-US');

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: revalidateSeconds },
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`TMDB API request failed [${response.status}]: ${endpoint}`);
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`TMDB API Network Error on ${endpoint}:`, error);
    return null;
  }
}

// 1. Trending Movies
export async function getTrendingMovies(
  timeWindow: 'day' | 'week' = 'day',
  page: number = 1
): Promise<PaginatedResponse<Movie>> {
  const data = await tmdbFetch<PaginatedResponse<Movie>>(
    `/trending/movie/${timeWindow}`,
    { page },
    1800
  );

  if (data && data.results?.length > 0) {
    return data;
  }

  return {
    page,
    results: FALLBACK_MOVIES,
    total_pages: 1,
    total_results: FALLBACK_MOVIES.length,
  };
}

// 2. Popular Movies
export async function getPopularMovies(page: number = 1): Promise<PaginatedResponse<Movie>> {
  const data = await tmdbFetch<PaginatedResponse<Movie>>(
    '/movie/popular',
    { page },
    3600
  );

  if (data && data.results?.length > 0) {
    return data;
  }

  return {
    page,
    results: FALLBACK_MOVIES,
    total_pages: 1,
    total_results: FALLBACK_MOVIES.length,
  };
}

// 3. Top Rated Movies
export async function getTopRatedMovies(page: number = 1): Promise<PaginatedResponse<Movie>> {
  const data = await tmdbFetch<PaginatedResponse<Movie>>(
    '/movie/top_rated',
    { page },
    3600
  );

  if (data && data.results?.length > 0) {
    return data;
  }

  // Sort fallback by vote_average
  const sorted = [...FALLBACK_MOVIES].sort((a, b) => b.vote_average - a.vote_average);
  return {
    page,
    results: sorted,
    total_pages: 1,
    total_results: sorted.length,
  };
}

// 4. Now Playing Movies
export async function getNowPlayingMovies(page: number = 1): Promise<PaginatedResponse<Movie>> {
  const data = await tmdbFetch<PaginatedResponse<Movie>>(
    '/movie/now_playing',
    { page },
    1800
  );

  if (data && data.results?.length > 0) {
    return data;
  }

  return {
    page,
    results: FALLBACK_MOVIES.slice(0, 6),
    total_pages: 1,
    total_results: 6,
  };
}

// 5. Upcoming Movies
export async function getUpcomingMovies(page: number = 1): Promise<PaginatedResponse<Movie>> {
  const data = await tmdbFetch<PaginatedResponse<Movie>>(
    '/movie/upcoming',
    { page },
    3600
  );

  if (data && data.results?.length > 0) {
    return data;
  }

  return {
    page,
    results: FALLBACK_MOVIES.slice(1, 7),
    total_pages: 1,
    total_results: 6,
  };
}

// 6. Movie Details
export async function getMovieDetails(
  id: number | string
): Promise<MovieDetails | null> {
  const numId = Number(id);
  const data = await tmdbFetch<MovieDetails>(
    `/movie/${id}`,
    { append_to_response: 'credits,videos,similar,recommendations' },
    3600
  );

  if (data && data.id) {
    return data;
  }

  if (FALLBACK_MOVIE_DETAILS[numId]) {
    return FALLBACK_MOVIE_DETAILS[numId];
  }

  const foundInList = FALLBACK_MOVIES.find((m) => m.id === numId);
  if (foundInList) {
    return {
      ...foundInList,
      runtime: 145,
      status: 'Released',
      budget: 150000000,
      revenue: 650000000,
      imdb_id: 'tt0000000',
      genres: FALLBACK_GENRES.filter((g) => foundInList.genre_ids?.includes(g.id)),
      belongs_to_collection: null,
      production_companies: [],
      spoken_languages: [{ english_name: 'English', iso_639_1: 'en', name: 'English' }],
      credits: { cast: [], crew: [] },
      videos: { results: [] },
      similar: { page: 1, results: FALLBACK_MOVIES.slice(0, 4), total_pages: 1, total_results: 4 },
      recommendations: { page: 1, results: FALLBACK_MOVIES.slice(2, 6), total_pages: 1, total_results: 4 },
    };
  }

  return FALLBACK_MOVIE_DETAILS[872585] || null;
}

// 7. Movie Credits
export async function getMovieCredits(id: number | string): Promise<Credits> {
  const data = await tmdbFetch<Credits>(`/movie/${id}/credits`, {}, 3600);
  if (data && data.cast) {
    return data;
  }
  const details = await getMovieDetails(id);
  return details?.credits || { cast: [], crew: [] };
}

// 8. Movie Videos / Trailers
export async function getMovieVideos(id: number | string): Promise<Video[]> {
  const data = await tmdbFetch<{ results: Video[] }>(`/movie/${id}/videos`, {}, 3600);
  if (data && data.results) {
    return data.results;
  }
  const details = await getMovieDetails(id);
  return details?.videos?.results || [];
}

// 9. Similar Movies
export async function getSimilarMovies(
  id: number | string,
  page: number = 1
): Promise<PaginatedResponse<Movie>> {
  const data = await tmdbFetch<PaginatedResponse<Movie>>(
    `/movie/${id}/similar`,
    { page },
    3600
  );
  if (data && data.results?.length > 0) {
    return data;
  }
  return {
    page: 1,
    results: FALLBACK_MOVIES.slice(0, 6),
    total_pages: 1,
    total_results: 6,
  };
}

// 10. Movie Recommendations
export async function getMovieRecommendations(
  id: number | string,
  page: number = 1
): Promise<PaginatedResponse<Movie>> {
  const data = await tmdbFetch<PaginatedResponse<Movie>>(
    `/movie/${id}/recommendations`,
    { page },
    3600
  );
  if (data && data.results?.length > 0) {
    return data;
  }
  return {
    page: 1,
    results: FALLBACK_MOVIES.slice(2, 8),
    total_pages: 1,
    total_results: 6,
  };
}

// 11. Collection Details
export async function getCollection(id: number | string): Promise<CollectionDetails | null> {
  const numId = Number(id);
  const data = await tmdbFetch<CollectionDetails>(`/collection/${id}`, {}, 86400);
  if (data && data.id) {
    return data;
  }
  if (FALLBACK_COLLECTION.id === numId) {
    return FALLBACK_COLLECTION;
  }
  return FALLBACK_COLLECTION;
}

// 12. Discover Movies
export async function discoverMovies(
  filters: DiscoverFilters = {}
): Promise<PaginatedResponse<Movie>> {
  const params: Record<string, string | number | undefined> = {
    page: filters.page || 1,
    sort_by: filters.sortBy || 'popularity.desc',
    include_adult: 'false',
    include_video: 'false',
  };

  if (filters.genreId) {
    params['with_genres'] = filters.genreId;
  }
  if (filters.year) {
    params['primary_release_year'] = filters.year;
  }
  if (filters.releaseDateGte) {
    params['primary_release_date.gte'] = filters.releaseDateGte;
  }
  if (filters.releaseDateLte) {
    params['primary_release_date.lte'] = filters.releaseDateLte;
  }
  if (filters.minRating) {
    params['vote_average.gte'] = filters.minRating;
    params['vote_count.gte'] = 50;
  }
  if (filters.language) {
    params['with_original_language'] = filters.language;
  }

  const data = await tmdbFetch<PaginatedResponse<Movie>>('/discover/movie', params, 1800);

  if (data && data.results) {
    return data;
  }

  // Filter fallback data client-side for offline testing
  let filtered = [...FALLBACK_MOVIES];
  if (filters.genreId) {
    const gId = Number(filters.genreId);
    filtered = filtered.filter((m) => m.genre_ids?.includes(gId));
  }
  if (filters.minRating) {
    const min = Number(filters.minRating);
    filtered = filtered.filter((m) => m.vote_average >= min);
  }
  if (filters.year) {
    filtered = filtered.filter((m) => m.release_date.startsWith(filters.year!));
  }
  if (filters.releaseDateGte) {
    filtered = filtered.filter((m) => m.release_date >= filters.releaseDateGte!);
  }
  if (filters.releaseDateLte) {
    filtered = filtered.filter((m) => m.release_date <= filters.releaseDateLte!);
  }

  return {
    page: filters.page || 1,
    results: filtered,
    total_pages: 1,
    total_results: filtered.length,
  };
}

// 13. Search Movies
export async function searchMovies(
  query: string,
  page: number = 1
): Promise<PaginatedResponse<Movie>> {
  if (!query || !query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }

  const data = await tmdbFetch<PaginatedResponse<Movie>>(
    '/search/movie',
    { query: query.trim(), page, include_adult: 'false' },
    600
  );

  if (data && data.results) {
    return data;
  }

  const q = query.toLowerCase().trim();
  const matched = FALLBACK_MOVIES.filter(
    (m) =>
      m.title.toLowerCase().includes(q) ||
      m.overview.toLowerCase().includes(q) ||
      m.original_title?.toLowerCase().includes(q)
  );

  return {
    page: 1,
    results: matched,
    total_pages: 1,
    total_results: matched.length,
  };
}

// 14. Search People
export async function searchPeople(
  query: string,
  page: number = 1
): Promise<PaginatedResponse<PersonDetails>> {
  if (!query || !query.trim()) {
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }

  const data = await tmdbFetch<PaginatedResponse<PersonDetails>>(
    '/search/person',
    { query: query.trim(), page, include_adult: 'false' },
    600
  );

  if (data && data.results) {
    return data;
  }

  const q = query.toLowerCase().trim();
  const matches = FALLBACK_PERSON.name.toLowerCase().includes(q) ? [FALLBACK_PERSON] : [];

  return {
    page: 1,
    results: matches,
    total_pages: 1,
    total_results: matches.length,
  };
}

// 15. Person Details
export async function getPersonDetails(id: number | string): Promise<PersonDetails | null> {
  const numId = Number(id);
  const data = await tmdbFetch<PersonDetails>(`/person/${id}`, {}, 86400);

  if (data && data.id) {
    return data;
  }

  if (FALLBACK_PERSON.id === numId) {
    return FALLBACK_PERSON;
  }

  return FALLBACK_PERSON;
}

// 16. Person Credits
export async function getPersonCredits(id: number | string): Promise<PersonCredits> {
  const numId = Number(id);
  const data = await tmdbFetch<PersonCredits>(`/person/${id}/movie_credits`, {}, 86400);

  if (data && (data.cast || data.crew)) {
    return {
      id: data.id || numId,
      cast: data.cast || [],
      crew: data.crew || [],
    };
  }

  if (FALLBACK_PERSON_CREDITS.id === numId) {
    return FALLBACK_PERSON_CREDITS;
  }

  return FALLBACK_PERSON_CREDITS;
}

// 17. Genre Lists
export async function getGenres(): Promise<Genre[]> {
  const data = await tmdbFetch<{ genres: Genre[] }>('/genre/movie/list', {}, 86400);

  if (data && data.genres?.length > 0) {
    return data.genres;
  }

  return FALLBACK_GENRES;
}
