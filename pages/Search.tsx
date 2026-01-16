
import React, { useState, useEffect } from 'react';
import { tmdb } from '../services/tmdb';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';

interface SearchProps {
  query: string;
  onMovieSelect: (movie: Movie) => void;
  onToggleFavorite: (movie: Movie) => void;
  favorites: Movie[];
}

const Search: React.FC<SearchProps> = ({ query, onMovieSelect, onToggleFavorite, favorites }) => {
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const data = await tmdb.search(query);
        setResults(data);
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSearch();
  }, [query]);

  return (
    <div className="min-h-screen bg-[#0f1014] pt-8 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-2 mb-10">
          <h1 className="text-3xl font-black uppercase tracking-tight">
            Results for <span className="text-emerald-500">"{query}"</span>
          </h1>
          <p className="text-sm font-medium text-gray-500">Found {results.length} titles in our database</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-white/5 rounded-3xl animate-pulse border border-white/5" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10 animate-in fade-in duration-500">
            {results.map((movie) => (
              <MovieCard 
                key={`${movie.id}-${movie.media_type}`} 
                movie={movie} 
                onClick={onMovieSelect}
                onFavoriteToggle={onToggleFavorite}
                isFavorited={favorites.some(f => f.id === movie.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">?</span>
             </div>
             <h2 className="text-xl font-bold text-gray-400">No titles found</h2>
             <p className="text-sm text-gray-600 max-w-xs mt-2">
                We couldn't find any movies or TV shows matching "{query}". Try a different term.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
