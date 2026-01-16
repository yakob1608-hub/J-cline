
import React, { useState, useEffect } from 'react';
import { tmdb } from '../services/tmdb';
import { Movie, Genre } from '../types';
import Hero from '../components/Hero';
import Slider from '../components/Slider';
import MovieCard from '../components/MovieCard';
import { Play, Clock, ChevronRight, ChevronLeft } from 'lucide-react';

interface HomeProps {
  onMovieSelect: (movie: Movie) => void;
  onToggleFavorite: (movie: Movie) => void;
  onToggleMyList: (movie: Movie) => void;
  favorites: Movie[];
  myList: Movie[];
  watchHistory: Array<{movie: Movie, progress: number, timestamp: number}>;
  onNavigate: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({
  onMovieSelect,
  onToggleFavorite,
  onToggleMyList,
  favorites,
  myList,
  watchHistory,
  onNavigate
}) => {
  const [trendingAll, setTrendingAll] = useState<Movie[]>([]);
  const [recommended, setRecommended] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [genreMovies, setGenreMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [tr, rec, trt, pop, np, g] = await Promise.all([
          tmdb.getTrending('all'),
          tmdb.getDiscover('movie'),
          tmdb.getTopRated('movie'),
          tmdb.getPopular('movie'),
          tmdb.getNowPlaying(),
          tmdb.getGenres('movie')
        ]);
        setTrendingAll(tr);
        setRecommended(rec);
        setTopRated(trt);
        setPopular(pop);
        setNowPlaying(np);
        setGenres(g);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  useEffect(() => {
    const fetchByGenre = async () => {
      if (selectedGenre) {
        setFiltering(true);
        try {
          const data = await tmdb.getDiscover('movie', selectedGenre);
          setGenreMovies(data);
        } catch (e) {
          console.error(e);
        } finally {
          setFiltering(false);
        }
      }
    };
    fetchByGenre();
  }, [selectedGenre]);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const continueWatching = watchHistory.filter(h => h.progress > 0 && h.progress < 100).slice(0, 7);

  return (
    <div className="px-6 pb-20 flex flex-col gap-10">
      {/* 1. Category Pills Scroll */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-2">
           <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
             Categories
           </h2>
           <button onClick={() => onNavigate('movies')} className="text-[9px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1 hover:text-emerald-500 transition-colors">
             See All <ChevronRight size={10} />
           </button>
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 px-1" id="categories-scroll">
            <button
              onClick={() => setSelectedGenre(null)}
              className={`px-7 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${!selectedGenre ? 'bg-emerald-600 text-white border-emerald-500 shadow-xl shadow-emerald-600/20' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedGenre(1000)}
              className={`px-7 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${selectedGenre === 1000 ? 'bg-emerald-600 text-white border-emerald-500 shadow-xl shadow-emerald-600/20' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
            >
              Anime
            </button>
            {genres.slice(0, 10).map(genre => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`px-7 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${selectedGenre === genre.id ? 'bg-emerald-600 text-white border-emerald-500 shadow-xl shadow-emerald-600/20' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
              >
                {genre.name}
              </button>
            ))}
          </div>
          {genres.length > 5 && (
            <>
              <button
                onClick={() => {
                  const container = document.getElementById('categories-scroll');
                  if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full shadow-lg transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => {
                  const container = document.getElementById('categories-scroll');
                  if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full shadow-lg transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      {!selectedGenre ? (
        <>
          {/* 2. Featured Banner */}
          {trendingAll.length > 0 && (
            <div className="lg:block hidden">
              <Hero 
                movies={trendingAll} 
                onPlay={onMovieSelect} 
                onToggleMyList={onToggleMyList}
                myList={myList}
              />
            </div>
          )}

          {/* Mobile Featured - Horizontal Slider */}
          <div className="lg:hidden">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 px-2">
                <Play size={16} className="text-emerald-500" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                  Featured
                </h2>
              </div>
              <div className="relative">
                <div className="flex overflow-x-auto no-scrollbar gap-6 px-1 pb-4 snap-x snap-mandatory" style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}>
                  {trendingAll.slice(0, 5).map((movie, index) => (
                    <div
                      key={movie.id}
                      onClick={() => onMovieSelect(movie)}
                      className="flex-none w-[280px] relative aspect-[2/3] rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 group snap-start"
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt={movie.title || movie.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                      <div className="absolute bottom-10 left-8 right-8 text-center">
                        <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-4">{movie.title || movie.name}</h2>
                        <button className="px-6 py-2 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl">Watch Now</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Continue Watching (Moved here to be after the Featured Card) */}
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 px-2">
              <Clock size={16} className="text-emerald-500" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                Continue Watching
              </h2>
            </div>
            <div className="relative">
              <div className="flex overflow-x-auto no-scrollbar gap-6 px-1 pb-4" id="continue-watching">
                {continueWatching.map((item) => (
                  <div
                    key={item.movie.id}
                    onClick={() => onMovieSelect(item.movie)}
                    className="flex-none w-[280px] group relative rounded-[2rem] overflow-hidden aspect-video bg-white/5 cursor-pointer border border-white/5 hover:border-white/10 transition-all shadow-xl"
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.movie.backdrop_path}`}
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                      alt={item.movie.title || item.movie.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-emerald-600 p-4 rounded-full shadow-2xl">
                        <Play size={20} className="fill-white text-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-5 left-6 right-6">
                      <p className="text-[11px] font-black truncate text-white uppercase tracking-tight leading-none">{item.movie.title || item.movie.name}</p>
                      <div className="w-full h-0.5 bg-white/10 rounded-full overflow-hidden mt-3">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${item.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {continueWatching.length > 3 && (
                <>
                  <button
                    onClick={() => {
                      const container = document.getElementById('continue-watching');
                      if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
                    }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => {
                      const container = document.getElementById('continue-watching');
                      if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full shadow-lg transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 4. Horizontal Sections */}
          <div className="flex flex-col gap-10">
            <Slider
              title="Trending Now"
              movies={trendingAll.slice(1)}
              onMovieClick={onMovieSelect}
              onToggleFavorite={onToggleFavorite}
              favorites={favorites}
              enableAutoScroll={false}
            />

            <Slider
              title="Latest Releases"
              movies={nowPlaying}
              onMovieClick={onMovieSelect}
              onToggleFavorite={onToggleFavorite}
              favorites={favorites}
              enableAutoScroll={false}
            />

            <Slider
              title="popular section"
              movies={popular}
              onMovieClick={onMovieSelect}
              onToggleFavorite={onToggleFavorite}
              favorites={favorites}
              enableAutoScroll={false}
            />
          </div>
        </>
      ) : (
        <div className="mt-4">
          {filtering ? (
             <div className="h-[40vh] flex items-center justify-center">
               <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
             </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10">
              {genreMovies.map((movie) => (
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
      )}
    </div>
  );
};

export default Home;
