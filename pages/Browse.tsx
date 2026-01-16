
import React, { useState, useEffect } from 'react';
import { tmdb } from '../services/tmdb';
import { Movie, Genre } from '../types';
import MovieCard from '../components/MovieCard';
import { Filter } from 'lucide-react';

interface BrowseProps {
  type: 'movie' | 'tv';
  onMovieSelect: (movie: Movie) => void;
  onToggleFavorite: (movie: Movie) => void;
  favorites: Movie[];
}

const Browse: React.FC<BrowseProps> = ({ type, onMovieSelect, onToggleFavorite, favorites }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      try {
        const [m, g] = await Promise.all([
          tmdb.getDiscover(type, selectedGenre || undefined),
          tmdb.getGenres(type)
        ]);
        setMovies(m);
        setGenres(g);
      } catch (error) {
        console.error("Error loading browse data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, [type, selectedGenre]);

  return (
    <div className="min-h-screen bg-[#0f1014] pt-8 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter">
            {type === 'movie' ? 'Movies' : 'TV Shows'}
          </h1>
          
          <div className="flex items-center gap-3 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
            <div className="flex-none flex items-center gap-2 text-gray-500 mr-2 border-r border-white/10 pr-6">
              <Filter size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Filter By</span>
            </div>
            <button
              onClick={() => setSelectedGenre(null)}
              className={`flex-none px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${!selectedGenre ? 'bg-white text-black border-white shadow-xl shadow-white/5' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
            >
              All
            </button>
            {genres.map(genre => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`flex-none px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${selectedGenre === genre.id ? 'bg-white text-black border-white shadow-xl shadow-white/5' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'}`}
              >
                {genre.name}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10 animate-in fade-in duration-500">
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
        )}
      </div>
    </div>
  );
};

export default Browse;
