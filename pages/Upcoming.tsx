
import React, { useState, useEffect } from 'react';
import { tmdb } from '../services/tmdb';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import { Calendar } from 'lucide-react';

interface UpcomingProps {
  onMovieSelect: (movie: Movie) => void;
  onToggleFavorite: (movie: Movie) => void;
  favorites: Movie[];
  themeMode: 'dark' | 'light';
}

const Upcoming: React.FC<UpcomingProps> = ({ onMovieSelect, onToggleFavorite, favorites, themeMode }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      setLoading(true);
      try {
        const data = await tmdb.getUpcoming();

        // Filter for movies that are NOT released yet
        const today = new Date().toISOString().split('T')[0];

        const upcomingMovies = data.filter(movie => {
          if (!movie.release_date) return false;
          return movie.release_date > today;
        });

        // Sort by release date (closest first)
        upcomingMovies.sort((a, b) => (a.release_date || '').localeCompare(b.release_date || ''));

        setMovies(upcomingMovies);
      } catch (error) {
        console.error("Error fetching upcoming movies:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  return (
    <div className={`min-h-screen pt-8 px-6 pb-20 ${themeMode === 'light' ? 'bg-white' : 'bg-[#0f1014]'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center">
            <Calendar className="text-amber-500" size={20} />
          </div>
          <div>
            <h1 className={`text-2xl font-black uppercase tracking-tight ${themeMode === 'light' ? 'text-black' : ''}`}>Coming Soon</h1>
            <p className={`text-xs font-medium ${themeMode === 'light' ? 'text-gray-600' : 'text-gray-500'}`}>Unreleased titles arriving soon to J-cline</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`aspect-[2/3] rounded-3xl animate-pulse border ${themeMode === 'light' ? 'bg-gray-200 border-gray-300' : 'bg-white/5 border-white/5'}`} />
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {movies.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onClick={onMovieSelect}
                onFavoriteToggle={onToggleFavorite}
                isFavorited={favorites.some(f => f.id === movie.id)}
              />
            ))}
          </div>
        ) : (
          <div className={`flex flex-col items-center justify-center py-32 text-center rounded-3xl border border-dashed ${themeMode === 'light' ? 'bg-gray-100 border-gray-300' : 'bg-white/5 border-white/10'}`}>
            <Calendar size={48} className={`mb-4 ${themeMode === 'light' ? 'text-gray-800' : 'text-gray-700'}`} />
            <h2 className={`text-xl font-bold ${themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>No unreleased titles found</h2>
            <p className={`text-sm max-w-xs mt-2 ${themeMode === 'light' ? 'text-gray-700' : 'text-gray-600'}`}>
              Check back later for new announcements and upcoming blockbuster releases.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upcoming;
