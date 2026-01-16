
import { Movie, MovieDetails, Genre, Season, Episode } from '../types';

const TMDB_API_KEY = "0e7e61dd51f55260b0cfef0723408d03"; // your TMDB key
const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";

export const getImageUrl = (path: string, size: string = 'w500') => {
  if (!path) return 'https://picsum.photos/500/750?grayscale';
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const tmdb = {
  getTrending: async (type: 'all' | 'movie' | 'tv' = 'all'): Promise<Movie[]> => {
    const res = await fetch(`${TMDB_BASE}/trending/${type}/day?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    return data.results;
  },

  getPopular: async (type: 'movie' | 'tv'): Promise<Movie[]> => {
    const res = await fetch(`${TMDB_BASE}/${type}/popular?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    return data.results.map((item: any) => ({ ...item, media_type: type }));
  },

  getTopRated: async (type: 'movie' | 'tv'): Promise<Movie[]> => {
    const res = await fetch(`${TMDB_BASE}/${type}/top_rated?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    return data.results.map((item: any) => ({ ...item, media_type: type }));
  },

  getUpcoming: async (): Promise<Movie[]> => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const res = await fetch(`${TMDB_BASE}/discover/movie?api_key=${TMDB_API_KEY}&primary_release_date.gte=${tomorrowStr}&sort_by=primary_release_date.asc`);
    const data = await res.json();
    return data.results.map((item: any) => ({ ...item, media_type: 'movie' }));
  },

  getNowPlaying: async (): Promise<Movie[]> => {
    const res = await fetch(`${TMDB_BASE}/movie/now_playing?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    return data.results.map((item: any) => ({ ...item, media_type: 'movie' }));
  },

  getOnTheAir: async (): Promise<Movie[]> => {
    const res = await fetch(`${TMDB_BASE}/tv/on_the_air?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    return data.results.map((item: any) => ({ ...item, media_type: 'tv' }));
  },

  getDetails: async (type: 'movie' | 'tv', id: number): Promise<MovieDetails> => {
    const res = await fetch(`${TMDB_BASE}/${type}/${id}?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    return { ...data, media_type: type };
  },

  getSeasonDetails: async (id: number, seasonNumber: number): Promise<{ episodes: Episode[] }> => {
    const res = await fetch(`${TMDB_BASE}/tv/${id}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`);
    return await res.json();
  },

  search: async (query: string): Promise<Movie[]> => {
    const res = await fetch(`${TMDB_BASE}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.results.filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv');
  },

  getGenres: async (type: 'movie' | 'tv'): Promise<Genre[]> => {
    const res = await fetch(`${TMDB_BASE}/genre/${type}/list?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    return data.genres;
  },

  getDiscover: async (type: 'movie' | 'tv', genreId?: number): Promise<Movie[]> => {
    let genreParam = '';
    let langParam = '';
    if (genreId === 16) {
      genreParam = '&with_genres=16';
    } else if (genreId === 1000) {
      genreParam = '&with_genres=16';
      langParam = '&with_original_language=ja';
    } else if (genreId) {
      genreParam = `&with_genres=${genreId}`;
    }
    const res = await fetch(`${TMDB_BASE}/discover/${type}?api_key=${TMDB_API_KEY}${genreParam}${langParam}`);
    const data = await res.json();
    return data.results.map((item: any) => ({ ...item, media_type: type }));
  }
};

// Search movie or TV
export async function searchTMDB(query: string, type: 'movie' | 'tv'): Promise<any[]> {
  const res = await fetch(
    `${TMDB_BASE}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
  );
  return (await res.json()).results;
}

// Embed streaming URLs (player API)
export function getMovieEmbed(id: number): string {
  return `https://api.cinetaro.buzz/movie/${id}/english`;
}

export function getMovieEmbedSub(id: number): string {
  return `https://api.cinetaro.buzz/movie/${id}/english`;
}

export function getMovieEmbedDub(id: number): string {
  return `https://api.cinetaro.buzz/movie/${id}/english`;
}

export function getTVEmbed(id: number, season: number, episode: number): string {
  return `https://api.cinetaro.buzz/tv/${id}/${season}/${episode}/english`;
}

