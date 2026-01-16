
import React, { useState, useEffect } from 'react';
import { Movie, MovieDetails, Episode } from '../types';
import { tmdb, getImageUrl, getMovieEmbed, getMovieEmbedSub, getMovieEmbedDub, getTVEmbed } from '../services/tmdb';
import { Play, Star, Heart, ArrowLeft, Bookmark, X, ChevronDown, Clock, Globe } from 'lucide-react';

interface DetailsProps {
  movie: Movie;
  onClose: () => void;
  onToggleFavorite: (movie: Movie) => void;
  onToggleMyList: (movie: Movie) => void;
  onUpdateProgress: (movieId: number, progress: number) => void;
  isFavorited: boolean;
  isInMyList: boolean;
  currentProgress: number;
  isUpcoming?: boolean;
}

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
    <circle cx="50" cy="45" r="35" fill="#10b981" />
    <circle cx="50" cy="45" r="5" fill="white" />
    <circle cx="50" cy="23" r="8" fill="white" />
    <circle cx="71" cy="38" r="8" fill="white" />
    <circle cx="63" cy="62" r="8" fill="white" />
    <circle cx="37" cy="62" r="8" fill="white" />
    <circle cx="29" cy="38" r="8" fill="white" />
    <path 
      d="M40 75C40 75 55 85 80 85C95 85 100 80 100 80V74C100 74 90 80 80 80C60 80 40 72 40 72Z" 
      fill="#10b981" 
    />
  </svg>
);

const Details: React.FC<DetailsProps> = ({
  movie,
  onClose,
  onToggleFavorite,
  onToggleMyList,
  onUpdateProgress,
  isFavorited,
  isInMyList,
  currentProgress,
  isUpcoming = false
}) => {
  const [details, setDetails] = useState<MovieDetails | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [showPlayer, setShowPlayer] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [progress, setProgress] = useState(currentProgress);
  const [audioType, setAudioType] = useState<'english' | 'sub' | 'dub'>('sub');
  const [server, setServer] = useState<'hd-1' | 'hd-2'>('hd-1');

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Load local rating
    const savedRate = localStorage.getItem(`jcline-user-rate-${movie.id}`);
    if (savedRate) setUserRating(parseInt(savedRate));
    setProgress(currentProgress);

    const fetchDetails = async () => {
      try {
        const data = await tmdb.getDetails(movie.media_type, movie.id);
        setDetails(data);
        if (movie.media_type === 'tv' && !isUpcoming) {
          const seasonData = await tmdb.getSeasonDetails(movie.id, 1);
          setEpisodes(seasonData.episodes);
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };
    fetchDetails();
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [movie, isUpcoming, currentProgress]);

  useEffect(() => {
    const fetchSeason = async () => {
      if (movie.media_type === 'tv' && currentSeason > 0 && !isUpcoming) {
        try {
          const seasonData = await tmdb.getSeasonDetails(movie.id, currentSeason);
          setEpisodes(seasonData.episodes);
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchSeason();
  }, [currentSeason, movie.id, movie.media_type, isUpcoming]);

  useEffect(() => {
    if (showPlayer && progress === 0) {
      const newProgress = 30;
      setProgress(newProgress);
      onUpdateProgress(movie.id, newProgress);
    }

    // On mobile, make video fullscreen
    if (showPlayer && window.innerWidth < 768) {
      const playerContainer = document.getElementById('video-player-container');
      if (playerContainer && playerContainer.requestFullscreen) {
        playerContainer.requestFullscreen().catch(err => console.log(err));
      }
    }
  }, [showPlayer, progress, movie.id, onUpdateProgress]);


  const handleRate = (rating: number) => {
    setUserRating(rating);
    localStorage.setItem(`jcline-user-rate-${movie.id}`, rating.toString());
  };

  const embedUrl = movie.isAnime && (movie as any).anilist_id
    ? `https://apicinetaro.falex43350.workers.dev/anime/${(movie as any).anilist_id}/${audioType}/${server}/`
    : (movie.media_type === 'movie'
        ? getMovieEmbed(movie.id)
        : getTVEmbed(movie.id, currentSeason, currentEpisode));

  return (
    <div className="fixed inset-0 z-[60] bg-[#0f1014] animate-in fade-in duration-500 overflow-y-auto custom-scrollbar">
      {/* Background Backdrop blurred */}
      <div className="absolute top-0 left-0 w-full h-[80vh] overflow-hidden -z-10">
        <img
          src={getImageUrl(details?.backdrop_path, 'original')}
          className="w-full h-full object-cover blur-3xl opacity-30 scale-110"
          alt="backdrop"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 pb-40">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-2xl font-black uppercase tracking-tight text-white">J-CLINE</span>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Main Content Info */}
        <div className="flex flex-col lg:flex-row gap-12 items-start mb-16">
          {/* Poster Card */}
          <div className="w-full max-w-[320px] aspect-[2/3] rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_rgba(0,0,0,0.6)] border border-white/10 flex-none group relative">
            <img
              src={getImageUrl(details?.poster_path, 'w500')}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              alt={details?.title}
            />
            {movie.media_type === 'tv' && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full px-6 text-center">
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 py-2 rounded-2xl">
                  <span className="text-[14px] font-black uppercase text-white tracking-widest">{details?.name}</span>
                </div>
              </div>
            )}
          </div>

          {/* Text Info */}
          <div className="flex-1">
            <h1 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-tight mb-2">
              {details?.title || details?.name}
              {movie.media_type === 'tv' && details?.number_of_seasons && (
                <span className="text-emerald-500 ml-4">: S{currentSeason} E{currentEpisode}</span>
              )}
            </h1>
            
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">
              {movie.media_type === 'tv' ? 'Series' : 'Movie'}
            </p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-emerald-500">{details?.vote_average?.toFixed(1)}</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} className={s <= Math.round((details?.vote_average || 0) / 2) ? 'text-emerald-500 fill-emerald-500' : 'text-gray-700'} />
                  ))}
                </div>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
                <span className="text-[10px] font-black text-emerald-500">9.5/10 IMDb</span>
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <Clock size={12} />
                {details?.runtime ? `${details.runtime} Minutes` : `${details?.number_of_episodes || 0} Episodes`}
                <span>-</span>
                <Globe size={12} />
                USA
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {details?.genres?.map(g => (
                <span key={g.id} className="px-5 py-2 bg-white/5 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-emerald-600 hover:text-white transition-colors cursor-default">
                  {g.name}
                </span>
              ))}
            </div>

            <p className="text-sm lg:text-base leading-relaxed text-gray-400 font-medium max-w-2xl mb-12">
              {details?.overview}
            </p>

            {/* Action Button Bar */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setShowPlayer(true)}
                className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-emerald-600/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
              >
                Play <Play size={18} className="fill-white" />
              </button>
              {movie.isAnime && (movie as any).anilist_id && (
                <>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-1">
                    <button
                      onClick={() => setAudioType('sub')}
                      className={`px-4 py-2 rounded-xl font-black uppercase text-xs tracking-[0.2em] transition-all ${audioType === 'sub' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      Sub
                    </button>
                    <button
                      onClick={() => setAudioType('dub')}
                      className={`px-4 py-2 rounded-xl font-black uppercase text-xs tracking-[0.2em] transition-all ${audioType === 'dub' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      Dub
                    </button>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-1">
                    <button
                      onClick={() => setServer('hd-1')}
                      className={`px-4 py-2 rounded-xl font-black uppercase text-xs tracking-[0.2em] transition-all ${server === 'hd-1' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      HD-1
                    </button>
                    <button
                      onClick={() => setServer('hd-2')}
                      className={`px-4 py-2 rounded-xl font-black uppercase text-xs tracking-[0.2em] transition-all ${server === 'hd-2' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
                    >
                      HD-2
                    </button>
                  </div>
                </>
              )}
              <button
                onClick={() => onToggleMyList(movie)}
                className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase text-xs tracking-[0.2em] text-white hover:bg-white/10 transition-all flex items-center gap-3"
              >
                {isInMyList ? 'In My List' : 'Add to My List'} <Bookmark size={18} className={isInMyList ? 'fill-white' : ''} />
              </button>
              <div className="bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Your rate</span>
                <div className="flex gap-1 items-center">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star 
                      key={i} 
                      size={18} 
                      className={`cursor-pointer transition-all hover:scale-110 active:scale-90 ${i <= userRating ? 'text-emerald-500 fill-emerald-500' : 'text-gray-700 hover:text-emerald-500/50'}`}
                      onClick={() => handleRate(i)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Player Section */}
        {showPlayer && (
          <div id="video-player-container" className="mb-24 w-full aspect-video rounded-[3rem] overflow-hidden bg-black border border-white/10 shadow-3xl animate-in slide-in-from-bottom-8 duration-700">
            <iframe src={embedUrl} className="w-full h-full border-0" allowFullScreen title="Watch" sandbox="allow-scripts allow-same-origin allow-presentation" />
          </div>
        )}

        {/* Seasons & Episodes List - Series Specific */}
        {movie.media_type === 'tv' && !isUpcoming && (
          <div className="animate-in fade-in duration-700 mt-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center">
                  <Play size={20} className="text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Episodes & Seasons</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Season {currentSeason} List</p>
                </div>
              </div>

              {/* Season Selection Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                {Array.from({ length: details?.number_of_seasons || 1 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSeason(i + 1)}
                    className={`flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${currentSeason === i + 1 ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/20' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
                  >
                    Season {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Episode Grid */}
            <div className="grid gap-4">
              {episodes.map((episode) => (
                <div 
                  key={episode.id}
                  onClick={() => {
                    setCurrentEpisode(episode.episode_number);
                    setShowPlayer(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`group flex items-center gap-6 p-4 rounded-[2rem] border transition-all cursor-pointer ${currentEpisode === episode.episode_number ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/[0.07]'}`}
                >
                  <div className="w-48 aspect-video rounded-2xl overflow-hidden flex-none relative">
                    <img 
                      src={getImageUrl(episode.still_path, 'w500')} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      alt={episode.name} 
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Play size={16} className="text-white fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-black text-white uppercase tracking-tight">
                        <span className="text-emerald-500 mr-2">E{episode.episode_number}:</span>
                        {episode.name}
                      </h4>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{episode.air_date?.split('-')[0]}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed">
                      {episode.overview || "No description available for this episode."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Details;
