
import React, { useState, useEffect } from 'react';
import { tmdb } from '../services/tmdb';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import { TrendingUp } from 'lucide-react';

interface TrendingProps {
  onMovieSelect: (movie: Movie) => void;
  onToggleFavorite: (movie: Movie) => void;
  favorites: Movie[];
}

const Trending: React.FC<TrendingProps> = ({ onMovieSelect, onToggleFavorite, favorites }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [type, setType] = useState<'all' | 'movie' | 'tv'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const data = await tmdb.getTrending(type);
        setMovies(data);
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, [type]);

  return (
    <div className="min-h-screen bg-[#0f1014] pt-8 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-600/20 rounded-2xl flex items-center justify-center">
              <TrendingUp className="text-emerald-500" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight">Trending Now</h1>
              <p className="text-sm text-gray-500 font-medium">Most popular content across the globe today</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5">
            {[
              { id: 'all', label: 'All' },
              { id: 'movie', label: 'Movies' },
              { id: 'tv', label: 'TV Shows' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setType(tab.id as any)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  type === tab.id ? 'bg-white text-black shadow-lg shadow-white/10' : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-white/5 rounded-3xl animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {movies.map((movie, index) => (
              <MovieCard
                key={`${movie.id}-${movie.media_type}`}
                movie={movie}
                onClick={onMovieSelect}
                onFavoriteToggle={onToggleFavorite}
                isFavorited={favorites.some(f => f.id === movie.id)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trending;
