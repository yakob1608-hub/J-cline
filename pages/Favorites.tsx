
import React from 'react';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import { Heart } from 'lucide-react';

interface FavoritesProps {
  movies: Movie[];
  onMovieSelect: (movie: Movie) => void;
  onToggleFavorite: (movie: Movie) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ movies, onMovieSelect, onToggleFavorite }) => {
  return (
    <div className="min-h-screen bg-[#0f1014] pt-8 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-emerald-600/20 rounded-2xl flex items-center justify-center">
            <Heart className="text-emerald-500 fill-emerald-500" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">Your Favorites</h1>
            <p className="text-sm text-gray-500 font-medium">{movies.length} titles saved to your library</p>
          </div>
        </div>

        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {movies.map((movie) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                onClick={onMovieSelect}
                onFavoriteToggle={onToggleFavorite}
                isFavorited={true}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
            <Heart size={48} className="text-gray-700 mb-4" />
            <h2 className="text-xl font-bold text-gray-400">Your library is empty</h2>
            <p className="text-sm text-gray-600 max-w-xs mt-2">
              Start adding your favorite movies and TV shows to see them here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
