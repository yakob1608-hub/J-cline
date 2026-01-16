
import React, { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './services/firebase';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Details from './pages/Details';
import Search from './pages/Search';
import Browse from './pages/Browse';
import Favorites from './pages/Favorites';
import MyList from './pages/MyList';
import History from './pages/History';
import Upcoming from './pages/Upcoming';
import Trending from './pages/Trending';
import SettingsPage from './pages/Settings';
import Welcome from './pages/Welcome';
import Login from './components/Login';
import Signup from './components/Signup';
import { Movie } from './types';
import { tmdb } from './services/tmdb';

export interface NotificationItem {
  id: string;
  type: 'security' | 'movie' | 'episode' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  timestamp: number;
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

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isUpcomingSelection, setIsUpcomingSelection] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Theme state
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() =>
    (localStorage.getItem('jc_theme_mode') as 'dark' | 'light') || 'dark'
  );

  // Storage hooks
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [myList, setMyList] = useState<Movie[]>([]);
  const [watchHistory, setWatchHistory] = useState<Array<{movie: Movie, progress: number, timestamp: number}>>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [lastNotificationCheck, setLastNotificationCheck] = useState<number>(Date.now());

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);


  // Theme effect
  useEffect(() => {
    localStorage.setItem('jc_theme_mode', themeMode);
    if (themeMode === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [themeMode]);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Fetch user data from Firestore and localStorage
  useEffect(() => {
    if (user) {
      // Load from localStorage first
      const localFavorites = JSON.parse(localStorage.getItem('jcline-favorites') || '[]');
      const localMyList = JSON.parse(localStorage.getItem('jcline-mylist') || '[]');
      const localHistory = JSON.parse(localStorage.getItem('jcline-history') || '[]');
      setFavorites(localFavorites);
      setMyList(localMyList);
      setWatchHistory(localHistory);

      const fetchUserData = async () => {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFavorites(data.favorites || []);
          setMyList(data.myList || []);
          setWatchHistory(data.history || []);
          setNotifications(data.notifications || []);
          setLastNotificationCheck(data.lastNotificationCheck || Date.now());
          // Update localStorage
          localStorage.setItem('jcline-favorites', JSON.stringify(data.favorites || []));
          localStorage.setItem('jcline-mylist', JSON.stringify(data.myList || []));
          localStorage.setItem('jcline-history', JSON.stringify(data.history || []));
        } else {
          // Initialize with defaults
          const defaultNotifications = [{
            id: '1',
            type: 'movie' as const,
            title: 'Welcome to J-cline',
            message: 'Start exploring our premium 4K library today.',
            time: 'Just now',
            isRead: false,
            timestamp: Date.now()
          }];
          const now = Date.now();
          const initialCheck = now - 30 * 24 * 60 * 60 * 1000; // 30 days ago
          await setDoc(doc(db, 'users', user.uid), {
            favorites: localFavorites,
            myList: localMyList,
            history: localHistory,
            notifications: defaultNotifications,
            lastNotificationCheck: initialCheck
          });
          setLastNotificationCheck(initialCheck);
          setNotifications(defaultNotifications);
        }
      };
      fetchUserData().then(() => {
        if (user) checkForNewContent();
      });
    } else {
      // Load from localStorage if not logged in
      const localFavorites = JSON.parse(localStorage.getItem('jcline-favorites') || '[]');
      const localMyList = JSON.parse(localStorage.getItem('jcline-mylist') || '[]');
      const localHistory = JSON.parse(localStorage.getItem('jcline-history') || '[]');
      setFavorites(localFavorites);
      setMyList(localMyList);
      setWatchHistory(localHistory);
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const addNotification = useCallback((type: NotificationItem['type'], title: string, message: string) => {
    const newNotif: NotificationItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title,
      message,
      time: 'Just now',
      isRead: false,
      timestamp: Date.now()
    };
    setNotifications(prev => {
      const newNotifs = [newNotif, ...prev];
      updateDoc(doc(db, 'users', user!.uid), { notifications: newNotifs });
      return newNotifs;
    });
  }, [user]);

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const newNotifs = prev.map(n => n.id === id ? { ...n, isRead: true } : n);
      updateDoc(doc(db, 'users', user!.uid), { notifications: newNotifs });
      return newNotifs;
    });
  };

  const markAllRead = () => {
    setNotifications(prev => {
      const newNotifs = prev.map(n => ({ ...n, isRead: true }));
      updateDoc(doc(db, 'users', user!.uid), { notifications: newNotifs });
      return newNotifs;
    });
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => {
      const newNotifs = prev.filter(n => n.id !== id);
      updateDoc(doc(db, 'users', user!.uid), { notifications: newNotifs });
      return newNotifs;
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    updateDoc(doc(db, 'users', user!.uid), { notifications: [] });
  };

  const checkForNewContent = useCallback(async () => {
    if (!user) return;
    try {
      const now = Date.now();
      const lastCheck = lastNotificationCheck;

      // Get notification preferences
      const movieNotif = JSON.parse(localStorage.getItem('jc_notif_movie') ?? 'true');
      const episodeNotif = JSON.parse(localStorage.getItem('jc_notif_episode') ?? 'true');

      // Check for new movies
      if (movieNotif) {
        // Use mock data since TMDB API key may be invalid
        const mockMovies = [
          { id: 1, title: "Dune: Part Two", release_date: "2025-03-01" },
          { id: 2, title: "Ghostbusters: Frozen Empire", release_date: "2025-03-22" },
          { id: 3, title: "Kung Fu Panda 4", release_date: "2025-03-08" },
          { id: 4, title: "The Fall Guy", release_date: "2025-05-03" },
        ];
        const newMovies = mockMovies; // await tmdb.getNowPlaying();
        const recentMovies = newMovies.filter(movie => {
          if (!movie.release_date) return false;
          const releaseTime = new Date(movie.release_date).getTime();
          return releaseTime > lastCheck && releaseTime <= now;
        });

        recentMovies.slice(0, 3).forEach(movie => {
          addNotification('movie', 'New Movie Released', `"${movie.title}" is now available to watch.`);
        });
      }

      // Check for new TV episodes
      if (episodeNotif) {
        // Use mock data
        const mockShows = [
          { id: 1, name: "The Mandalorian", last_air_date: "2025-04-19" },
          { id: 2, name: "Stranger Things", last_air_date: "2025-07-04" },
          { id: 3, name: "The Boys", last_air_date: "2025-07-18" },
        ];
        const onAirShows = mockShows; // await tmdb.getOnTheAir();
        const recentShows = onAirShows.filter(show => {
          if (!show.last_air_date) return false;
          const airTime = new Date(show.last_air_date).getTime();
          return airTime > lastCheck && airTime <= now;
        });

        recentShows.slice(0, 3).forEach(show => {
          addNotification('episode', 'New Episodes Available', `New episodes of "${show.name}" are now streaming.`);
        });
      }

      // Update last check
      setLastNotificationCheck(now);
      updateDoc(doc(db, 'users', user.uid), { lastNotificationCheck: now });
    } catch (error) {
      console.error('Error checking for new content:', error);
    }
  }, [user, lastNotificationCheck, addNotification]);

  const toggleFavorite = (movie: Movie) => {
    setFavorites(prev => {
      const isFavorited = prev.some(f => f.id === movie.id);
      if (isFavorited) {
        addNotification('system', 'Removed from Library', `"${movie.title || movie.name}" removed.`);
        const newFavs = prev.filter(f => f.id !== movie.id);
        if (user) updateDoc(doc(db, 'users', user.uid), { favorites: newFavs });
        localStorage.setItem('jcline-favorites', JSON.stringify(newFavs));
        return newFavs;
      } else {
        addNotification('system', 'Added to Library', `"${movie.title || movie.name}" is now in your favorites.`);
        const newFavs = [...prev, movie];
        if (user) updateDoc(doc(db, 'users', user.uid), { favorites: newFavs });
        localStorage.setItem('jcline-favorites', JSON.stringify(newFavs));
        return newFavs;
      }
    });
  };

  const toggleMyList = (movie: Movie) => {
    setMyList(prev => {
      const isInList = prev.some(m => m.id === movie.id);
      if (isInList) {
        addNotification('system', 'Watchlist Updated', `"${movie.title || movie.name}" removed from your list.`);
        const newList = prev.filter(m => m.id !== movie.id);
        if (user) updateDoc(doc(db, 'users', user.uid), { myList: newList });
        localStorage.setItem('jcline-mylist', JSON.stringify(newList));
        return newList;
      } else {
        addNotification('system', 'Watchlist Updated', `"${movie.title || movie.name}" added to your list.`);
        const newList = [...prev, movie];
        if (user) updateDoc(doc(db, 'users', user.uid), { myList: newList });
        localStorage.setItem('jcline-mylist', JSON.stringify(newList));
        return newList;
      }
    });
  };


  const clearHistory = () => {
    setWatchHistory([]);
    if (user) updateDoc(doc(db, 'users', user.uid), { history: [] });
    localStorage.setItem('jcline-history', JSON.stringify([]));
    addNotification('system', 'History Cleared', 'Your watch history has been wiped.');
  };

  const updateWatchProgress = (movieId: number, progress: number) => {
    setWatchHistory(prev => {
      const newHistory = prev.map(h => h.movie.id === movieId ? { ...h, progress } : h);
      if (user) updateDoc(doc(db, 'users', user.uid), { history: newHistory });
      localStorage.setItem('jcline-history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleMovieSelect = (movie: Movie, isUpcoming: boolean = false) => {
    setSelectedMovie(movie);
    setIsUpcomingSelection(isUpcoming);

    if (!isUpcoming) {
      setWatchHistory(prev => {
        const filtered = prev.filter(h => h.movie.id !== movie.id);
        const existing = prev.find(h => h.movie.id === movie.id);
        const progress = existing ? existing.progress : 0;
        const newHistory = [{ movie, progress, timestamp: Date.now() }, ...filtered].slice(0, 50);
        updateDoc(doc(db, 'users', user!.uid), { history: newHistory });
        return newHistory;
      });
    }
  };

  const handleNavigate = (page: string) => {
    if (page === 'explore_menu') {
      setCurrentPage(prev => prev === 'movies' ? 'tv' : 'movies');
    } else {
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user) {
    return (
      <>
        <Welcome onLogin={() => setShowLogin(true)} onSignup={() => setShowSignup(true)} />
        {showLogin && <Login onClose={() => setShowLogin(false)} onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true); }} />}
        {showSignup && <Signup onClose={() => setShowSignup(false)} onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }} />}
      </>
    );
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden pb-24 lg:pb-0" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Sidebar
        activePage={currentPage}
        onNavigate={handleNavigate}
        themeMode={themeMode}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onSearch={setSearchQuery}
          onNavigate={handleNavigate}
          notifications={notifications}
          onMarkRead={markAsRead}
          onMarkAllRead={markAllRead}
          onRemove={removeNotification}
          onClearAll={clearAllNotifications}
          user={user}
          themeMode={themeMode}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        />
        
        <main className="flex-1 transition-all ml-0 lg:ml-64 py-4">
          {currentPage === 'home' && (
            <Home
              onMovieSelect={(m) => handleMovieSelect(m, false)}
              onToggleFavorite={toggleFavorite}
              onToggleMyList={toggleMyList}
              favorites={favorites}
              myList={myList}
              watchHistory={watchHistory}
              onNavigate={handleNavigate}
            />
          )}
          
          {currentPage === 'movies' && (
            <Browse 
              type="movie" 
              onMovieSelect={(m) => handleMovieSelect(m, false)} 
              onToggleFavorite={toggleFavorite}
              favorites={favorites}
            />
          )}

          {currentPage === 'tv' && (
            <Browse 
              type="tv" 
              onMovieSelect={(m) => handleMovieSelect(m, false)} 
              onToggleFavorite={toggleFavorite}
              favorites={favorites}
            />
          )}

          {currentPage === 'search' && (
            <Search 
              query={searchQuery} 
              onMovieSelect={(m) => handleMovieSelect(m, false)} 
              onToggleFavorite={toggleFavorite}
              favorites={favorites}
            />
          )}

          {currentPage === 'favorites' && (
            <Favorites 
              movies={favorites} 
              onMovieSelect={(m) => handleMovieSelect(m, false)}
              onToggleFavorite={toggleFavorite}
            />
          )}

          {currentPage === 'mylist' && (
            <MyList 
              movies={myList} 
              onMovieSelect={(m) => handleMovieSelect(m, false)}
              onToggleMyList={toggleMyList}
            />
          )}

          {currentPage === 'history' && (
            <History
              history={watchHistory}
              onMovieSelect={(m) => handleMovieSelect(m, false)}
              onClearHistory={clearHistory}
            />
          )}

          {currentPage === 'upcoming' && (
            <Upcoming
              onMovieSelect={(m) => handleMovieSelect(m, true)}
              onToggleFavorite={toggleFavorite}
              favorites={favorites}
              themeMode={themeMode}
            />
          )}

          {currentPage === 'trending' && (
            <Trending
              onMovieSelect={(m) => handleMovieSelect(m, false)}
              onToggleFavorite={toggleFavorite}
              favorites={favorites}
            />
          )}


          {currentPage === 'settings' && (
            <SettingsPage
              onSignOut={handleSignOut}
              user={user}
              themeMode={themeMode}
              onThemeModeChange={setThemeMode}
            />
          )}
        </main>

        <footer className={`ml-0 lg:ml-64 py-8 px-6 text-center md:text-left mb-20 lg:mb-0 relative overflow-hidden ${themeMode === 'light' ? 'bg-gray-100 border-t border-gray-200' : ''}`} style={themeMode === 'dark' ? { background: 'linear-gradient(135deg, rgba(16, 17, 19, 0.95) 0%, rgba(31, 33, 37, 0.95) 100%)', backdropFilter: 'blur(20px)' } : {}}>
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8">
                <Logo />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-widest leading-none bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Powered by J-cline Engine</span>
                <p className="text-[10px] mt-0.5 leading-none text-gray-500">© 2024 J-cline Streaming.</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="flex gap-4">
                <span className="text-xs cursor-pointer transition-all duration-300 hover:text-emerald-400 hover:scale-105" style={{ color: 'var(--text-secondary)' }} onClick={() => setShowPrivacy(true)}>Privacy</span>
                <span className="text-xs cursor-pointer transition-all duration-300 hover:text-emerald-400 hover:scale-105" style={{ color: 'var(--text-secondary)' }} onClick={() => handleNavigate('settings')}>Settings</span>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-500/30 transition-colors">
                  <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </div>
                <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-500/30 transition-colors">
                  <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
                </div>
                <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-emerald-500/30 transition-colors">
                  <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.75.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.747-1.378 0 0-.599 2.282-.744 2.84-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/></svg>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Details Overlay - Restored to Overlay Mode */}
      {selectedMovie && (
        <Details
          movie={selectedMovie}
          isUpcoming={isUpcomingSelection}
          onClose={() => setSelectedMovie(null)}
          onToggleFavorite={toggleFavorite}
          onToggleMyList={toggleMyList}
          onUpdateProgress={updateWatchProgress}
          isFavorited={favorites.some(f => f.id === selectedMovie.id)}
          isInMyList={myList.some(m => m.id === selectedMovie.id)}
          currentProgress={watchHistory.find(h => h.movie.id === selectedMovie.id)?.progress || 0}
        />
      )}

      <BottomNav activePage={currentPage} onNavigate={handleNavigate} />

      {/* Privacy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-primary)] p-8 rounded-2xl w-full max-w-2xl relative border border-[var(--border-color)] max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => setShowPrivacy(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-400 transition-colors"
            >
              ✕
            </button>
            <h2 className="text-2xl font-black uppercase text-white mb-6">Privacy Policy</h2>
            <div className="text-gray-300 space-y-4 text-sm leading-relaxed">
              <p>
                <strong>J-cline Streaming Privacy Policy</strong>
              </p>
              <p>
                This Privacy Policy describes how J-cline Streaming ("we," "us," or "our") collects, uses, and protects your information when you use our streaming service.
              </p>
              <h3 className="text-lg font-bold text-white mt-6">Information We Collect</h3>
              <p>
                We collect information you provide directly to us, such as when you create an account, update your profile, or contact us for support. This may include your name, email address, and preferences.
              </p>
              <h3 className="text-lg font-bold text-white mt-6">How We Use Your Information</h3>
              <p>
                We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and communicate with you about products, services, and promotional offers.
              </p>
              <h3 className="text-lg font-bold text-white mt-6">Information Sharing</h3>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
              </p>
              <h3 className="text-lg font-bold text-white mt-6">Data Security</h3>
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              <h3 className="text-lg font-bold text-white mt-6">Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@j-cline.com.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
