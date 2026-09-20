export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  popularity?: number;
  adult?: boolean;
  genre_ids?: number[];
  genres?: Genre[];
  original_language?: string;
}

export interface CastMember {
  id: number;
  name: string;
  original_name?: string;
  character: string;
  profile_path: string | null;
  order: number;
  cast_id?: number;
  credit_id?: string;
  popularity?: number;
}

export interface CrewMember {
  id: number;
  name: string;
  original_name?: string;
  job: string;
  department: string;
  profile_path: string | null;
  credit_id?: string;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  size?: number;
  type: string;
  official?: boolean;
  published_at?: string;
}

export interface CollectionSummary {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface MovieDetails extends Movie {
  tagline?: string;
  runtime: number;
  status: string;
  budget: number;
  revenue: number;
  imdb_id?: string | null;
  homepage?: string | null;
  genres: Genre[];
  belongs_to_collection: CollectionSummary | null;
  production_companies: ProductionCompany[];
  spoken_languages: SpokenLanguage[];
  credits?: Credits;
  videos?: {
    results: Video[];
  };
  similar?: {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
  };
  recommendations?: {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
  };
}

export interface CollectionDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  parts: Movie[];
}

export interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  gender: number;
  known_for_department: string;
  place_of_birth: string | null;
  profile_path: string | null;
  popularity: number;
  imdb_id?: string | null;
  homepage?: string | null;
}

export interface PersonCastCredit {
  id: number;
  title: string;
  character: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  overview: string;
  credit_id: string;
  genre_ids?: number[];
}

export interface PersonCrewCredit {
  id: number;
  title: string;
  job: string;
  department: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  overview: string;
  credit_id: string;
  genre_ids?: number[];
}

export interface PersonCredits {
  id: number;
  cast: PersonCastCredit[];
  crew: PersonCrewCredit[];
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface DiscoverFilters {
  genreId?: string;
  year?: string;
  releaseDateGte?: string;
  releaseDateLte?: string;
  minRating?: string;
  language?: string;
  sortBy?: 'popularity.desc' | 'vote_average.desc' | 'primary_release_date.desc' | 'title.asc';
  page?: number;
}

export interface FavoriteMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  genres?: Genre[];
  genre_ids?: number[];
  addedAt: number;
}

export interface RecentlyViewedMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  viewedAt: number;
}

export interface RecentSearch {
  query: string;
  timestamp: number;
}
