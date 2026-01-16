
import React, { useState, useEffect, useCallback } from 'react';
import { Movie } from '../types';
import { getImageUrl } from '../services/tmdb';
import { Play, Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroProps {
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onToggleMyList?: (movie: Movie) => void;
  myList?: Movie[];
}

const Hero: React.FC<HeroProps> = ({ movies, onPlay, onToggleMyList, myList = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const featuredMovies = movies.slice(0, 6);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % featuredMovies.length);
  }, [featuredMovies.length]);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  if (!featuredMovies.length) return null;

  const currentMovie = featuredMovies[activeIndex];
  const title = currentMovie.title || currentMovie.name;
  const year = (currentMovie.release_date || currentMovie.first_air_date || '').split('-')[0];
  const isInMyList = myList.some(m => m.id === currentMovie.id);

  return (
    <div 
      className="relative w-full aspect-[21/9] rounded-[2.5rem] overflow-hidden group shadow-2xl bg-[#0f1014]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute inset-0 w-full h-full">
        {featuredMovies.map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform ${
              index === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'
            }`}
          >
            <img
              src={getImageUrl(movie.backdrop_path, 'original')}
              alt={movie.title || movie.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f1014]/80 via-[#0f1014]/20 to-transparent" />
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 flex justify-between z-20">
        <button 
          onClick={(e) => { e.stopPropagation(); prevSlide(); }}
          className="w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-emerald-600 hover:border-emerald-500 transition-all active:scale-90"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); nextSlide(); }}
          className="w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-emerald-600 hover:border-emerald-500 transition-all active:scale-90"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 z-10">
        <div className="transition-all duration-700 transform translate-y-0 opacity-100" key={currentMovie.id}>
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 bg-emerald-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20">
              Featured
            </span>
            {['4K Ultra HD', 'Dolby Vision', year].map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white/80 border border-white/10 uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>

          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase leading-none max-w-2xl drop-shadow-2xl">
            {title}
          </h2>
          
          <p className="text-gray-300 text-sm md:text-base font-medium max-w-xl line-clamp-2 mb-8 drop-shadow-md">
            {currentMovie.overview}
          </p>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => onPlay(currentMovie)}
              className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-xl active:scale-95"
            >
              <Play size={18} className="fill-current" /> Play Now
            </button>
            <button 
              onClick={() => onToggleMyList?.(currentMovie)}
              className={`flex items-center gap-3 px-8 py-4 backdrop-blur-md border rounded-2xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 ${
                isInMyList ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
              }`}
            >
              {isInMyList ? <Check size={18} /> : <Plus size={18} />} My List
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-12 flex items-center gap-3 z-20">
        {featuredMovies.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className="group relative h-1 transition-all duration-300 outline-none"
            style={{ width: idx === activeIndex ? '40px' : '12px' }}
          >
            <div className={`absolute inset-0 rounded-full transition-all duration-300 ${idx === activeIndex ? 'bg-emerald-500' : 'bg-white/20 group-hover:bg-white/40'}`} />
            {idx === activeIndex && !isPaused && (
              <div className="absolute inset-0 bg-white/40 rounded-full animate-[progress_4s_linear]" style={{ transformOrigin: 'left' }} />
            )}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes progress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
};

export default Hero;
