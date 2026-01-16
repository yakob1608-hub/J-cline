
import React from 'react';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import { History as HistoryIcon, Trash2 } from 'lucide-react';

interface HistoryProps {
  history: Array<{movie: Movie, progress: number, timestamp: number}>;
  onMovieSelect: (movie: Movie) => void;
  onClearHistory: () => void;
}

const History: React.FC<HistoryProps> = ({ history, onMovieSelect, onClearHistory }) => {
  return (
    <div className="min-h-screen bg-[#0f1014] pt-8 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-600/20 rounded-2xl flex items-center justify-center">
              <HistoryIcon className="text-emerald-500" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-white">Watch History</h1>
              <p className="text-sm text-gray-500 font-medium">Your recently viewed titles</p>
            </div>
          </div>
          
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-all font-black uppercase text-[10px] tracking-widest border border-red-500/10"
            >
              <Trash2 size={14} /> Clear History
            </button>
          )}
        </div>

        {history.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {history.map((item) => (
              <MovieCard
                key={`${item.movie.id}-${item.movie.media_type}`}
                movie={item.movie}
                onClick={onMovieSelect}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
            <HistoryIcon size={48} className="text-gray-700 mb-4" />
            <h2 className="text-xl font-bold text-gray-400">No history found</h2>
            <p className="text-sm text-gray-600 max-w-xs mt-2">
              Movies and TV shows you watch will appear here for quick access.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
