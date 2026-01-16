
import React from 'react';
import { Movie } from '../types';
import { getImageUrl } from '../services/tmdb';
import { Star, Play, Heart } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onClick: (movie: Movie) => void;
  onFavoriteToggle?: (movie: Movie) => void;
  isFavorited?: boolean;
  index?: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick, onFavoriteToggle, isFavorited, index = 0 }) => {
  const title = movie.title || movie.name;
  const rating = movie.vote_average.toFixed(1);
  const year = (movie.release_date || movie.first_air_date || '').split('-')[0];

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(movie);
    }
  };

  return (
    <div
      className={`relative flex flex-col group cursor-pointer transition-all duration-300 animate-in slide-in-from-bottom duration-500 md:animate-none`}
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => onClick(movie)}
    >
      <div className="aspect-[2/3] rounded-[2rem] overflow-hidden relative shadow-lg border border-white/5 bg-[#1a1b1e]">
        <img
          src={getImageUrl(movie.poster_path, 'w500')}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        
        {/* Permanent Favorite Button */}
        <button 
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 z-20 p-2 rounded-xl backdrop-blur-md border transition-all duration-300 ${
            isFavorited 
              ? 'bg-emerald-600 border-emerald-500 shadow-lg shadow-emerald-600/40' 
              : 'bg-black/40 border-white/10 text-white'
          }`}
        >
          <Heart size={14} className={isFavorited ? 'fill-white text-white' : 'text-white'} />
        </button>

        {/* Permanent Bottom Info Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-12 pb-4 px-4">
          <div className="flex items-end justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-black text-white truncate uppercase tracking-tight leading-tight mb-1">
                {title}
              </h3>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <span>{year}</span>
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                <div className="flex items-center gap-0.5">
                  <Star size={10} className="text-emerald-500 fill-emerald-500" />
                  <span className="text-emerald-500">{rating}</span>
                </div>
              </div>
            </div>
            
            {/* Integrated Play Button */}
            <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-600/30 flex-none">
              <Play size={16} className="text-white fill-white ml-0.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
