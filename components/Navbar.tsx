
import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, SlidersHorizontal, LogIn, Film, Tv, CheckCircle2, Trash2, Info, LayoutGrid, X, Menu } from 'lucide-react';
import { NotificationItem } from '../App';
import { User } from 'firebase/auth';

interface NavbarProps {
  onSearch: (query: string) => void;
  onNavigate: (page: any) => void;
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  user: User | null;
  themeMode: 'dark' | 'light';
  onToggleMobileSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onSearch,
  onNavigate,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onRemove,
  onClearAll,
  user,
  themeMode,
  onToggleMobileSidebar
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userName, setUserName] = useState(() => user?.displayName || 'User');
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      onNavigate('search');
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    setUserName(user?.displayName || 'User');
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) setShowNotifications(false);
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) setShowExplore(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-2xl px-4 py-3 flex items-center justify-between gap-4 ml-0 lg:ml-64 border-b ${themeMode === 'light' ? 'bg-white/90 border-gray-200' : 'bg-[#0f1014]/90 border-white/5'}`}>
      {/* Profile Greeting - Mobile Only */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white"
        >
          <Menu size={20} />
        </button>
        <div onClick={() => onNavigate('settings')}>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1">Hello 👋</p>
          <p className="text-sm font-black text-white leading-none truncate max-w-[100px]">{userName}</p>
        </div>
      </div>

      {/* Categories Desktop Dropdown */}
      <div className="relative hidden lg:block" ref={exploreRef}>
        <div 
          onClick={() => setShowExplore(!showExplore)}
          className={`flex items-center gap-2 border rounded-xl px-4 py-2 cursor-pointer transition-all ${
            showExplore ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-white/5 border-white/5 text-white hover:bg-white/10'
          }`}
        >
          <LayoutGrid size={16} />
          <span className="text-sm font-bold uppercase tracking-widest text-[10px]">Explore</span>
          <ChevronDown size={14} className={showExplore ? 'rotate-180' : ''} />
        </div>
        {showExplore && (
           <div className={`absolute left-0 mt-3 w-56 border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${themeMode === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-[#1a1b1e] border-white/10'}`}>
             <div className="p-2 flex flex-col gap-1">
               <button onClick={() => {onNavigate('movies'); setShowExplore(false);}} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 group transition-all text-left">
                 <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white"><Film size={16} /></div>
                 <div><p className="text-xs font-black uppercase text-white">Movies</p></div>
               </button>
               <button onClick={() => {onNavigate('tv'); setShowExplore(false);}} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 group transition-all text-left">
                 <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white"><Tv size={16} /></div>
                 <div><p className="text-xs font-black uppercase text-white">TV Series</p></div>
               </button>
             </div>
           </div>
        )}
      </div>

      {/* Search Input - Responsive */}
      <div className={`flex-1 transition-all duration-500 ${isSearchOpen ? 'scale-100 opacity-100' : 'lg:opacity-100 lg:scale-100 hidden lg:block'}`}>
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search titles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-2xl py-2 pl-12 pr-12 text-sm focus:outline-none focus:bg-white/10 focus:border-white/20"
          />
          <button type="button" onClick={() => setIsSearchOpen(false)} className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"><X size={18}/></button>
        </form>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-2">
        {!isSearchOpen && (
          <button onClick={() => setIsSearchOpen(true)} className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/5 text-gray-400">
            <Search size={20} />
          </button>
        )}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-xl border transition-all relative ${showNotifications ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-white/5 border-white/5 text-gray-400'}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 flex items-center justify-center text-[10px] font-black text-white px-1 ${themeMode === 'light' ? 'border-white' : 'border-[#0f1014]'}`}>{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className={`absolute right-0 mt-3 w-[320px] sm:w-[380px] border rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${themeMode === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-[#1a1b1e] border-white/10'}`}>
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-black uppercase tracking-widest text-[10px] text-gray-400">Notifications</h3>
                <button onClick={onMarkAllRead} className="text-[9px] font-black uppercase text-emerald-500">Clear All</button>
              </div>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? notifications.map(n => (
                  <div key={n.id} className="p-5 border-b border-white/5 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Info size={18}/></div>
                    <div className="flex-1 min-w-0"><p className="text-xs font-bold text-white truncate">{n.title}</p><p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{n.message}</p></div>
                  </div>
                )) : <p className="p-10 text-center text-xs text-gray-600">No updates</p>}
              </div>
            </div>
          )}
        </div>
        
        <div onClick={() => onNavigate('settings')} className="hidden lg:flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl px-4 py-2 cursor-pointer hover:bg-white/10 transition-all">
           <span className="text-xs font-bold">{userName}</span>
         </div>
      </div>
    </header>
  );
};

export default Navbar;
