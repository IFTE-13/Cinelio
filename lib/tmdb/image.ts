const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export type PosterSize = 'w185' | 'w342' | 'w500' | 'w780' | 'original';
export type BackdropSize = 'w300' | 'w780' | 'w1280' | 'original';
export type ProfileSize = 'w45' | 'w185' | 'h632' | 'original';

export function getTmdbImageUrl(
  path: string | null | undefined,
  size: string = 'w500'
): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${TMDB_IMAGE_BASE}/${size}${cleanPath}`;
}

export function getPosterUrl(
  path: string | null | undefined,
  size: PosterSize = 'w500'
): string | null {
  return getTmdbImageUrl(path, size);
}

export function getBackdropUrl(
  path: string | null | undefined,
  size: BackdropSize = 'w1280'
): string | null {
  return getTmdbImageUrl(path, size);
}

export function getProfileUrl(
  path: string | null | undefined,
  size: ProfileSize = 'w185'
): string | null {
  return getTmdbImageUrl(path, size);
}

export function getYear(dateString?: string | null): string {
  if (!dateString) return '—';
  const year = dateString.split('-')[0];
  return year || '—';
}

export function formatRuntime(minutes?: number | null): string {
  if (!minutes || minutes <= 0) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatCurrency(amount?: number | null): string {
  if (!amount || amount <= 0) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}
