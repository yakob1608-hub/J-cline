
import React, { useRef, useEffect } from 'react';
import { Movie } from '../types';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SliderProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
  onToggleFavorite?: (movie: Movie) => void;
  favorites?: Movie[];
}

const Slider: React.FC<SliderProps> = ({ title, movies, onMovieClick, onToggleFavorite, favorites }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!movies?.length) return null;

  return (
    <div className="my-4 relative">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase text-white/90">
          {title}
        </h2>
        <div className="hidden md:flex gap-2">
           <button 
            onClick={() => scroll('left')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto no-scrollbar pb-6 px-2 md:snap-x md:snap-mandatory"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {movies.map((movie, index) => (
          <div key={`${movie.id}-${movie.media_type}`} className="md:snap-start flex-none w-[160px] md:w-[220px]">
            <MovieCard
              movie={movie}
              onClick={onMovieClick}
              onFavoriteToggle={onToggleFavorite}
              isFavorited={favorites?.some(f => f.id === movie.id)}
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
