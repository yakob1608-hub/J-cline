
import React from 'react';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import { List } from 'lucide-react';

interface MyListProps {
  movies: Movie[];
  onMovieSelect: (movie: Movie) => void;
  onToggleMyList: (movie: Movie) => void;
}

const MyList: React.FC<MyListProps> = ({ movies, onMovieSelect, onToggleMyList }) => {
  return (
    <div className="min-h-screen bg-[#0f1014] pt-8 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-emerald-600/20 rounded-2xl flex items-center justify-center">
            <List className="text-emerald-500" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white">My Watchlist</h1>
            <p className="text-sm text-gray-500 font-medium">{movies.length} titles saved for later</p>
          </div>
        </div>

        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {movies.map((movie, index) => (
              <MovieCard
                key={`${movie.id}-${movie.media_type}`}
                movie={movie}
                onClick={onMovieSelect}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
            <List size={48} className="text-gray-700 mb-4" />
            <h2 className="text-xl font-bold text-gray-400">Your watchlist is empty</h2>
            <p className="text-sm text-gray-600 max-w-xs mt-2">
              Save movies and TV shows to your list so you can easily find them later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyList;
