
import React from 'react';
import { Home, LayoutGrid, Compass, List, User } from 'lucide-react';

interface BottomNavProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activePage, onNavigate }) => {
  const items = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'movies', icon: LayoutGrid, label: 'Categories' },
    { id: 'explore_menu', icon: Compass, label: 'Explore' },
    { id: 'mylist', icon: List, label: 'Watchlist' },
    { id: 'settings', icon: User, label: 'Profile' },
  ];

  return (
    <div className="lg:hidden fixed bottom-6 inset-x-6 z-50">
      <div className="bg-[#1a1b1e]/90 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] p-1 flex items-center justify-between shadow-2xl shadow-black/50">
        {items.map((item) => {
          const isActive = activePage === item.id || (item.id === 'movies' && activePage === 'tv');
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center gap-0.5 flex-1 relative py-1 group"
            >
              <div className={`p-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-emerald-600 text-white scale-110 shadow-lg shadow-emerald-600/40' : 'text-gray-500 group-active:scale-90'}`}>
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest transition-opacity duration-300 ${isActive ? 'opacity-100 text-white' : 'opacity-0 h-0 overflow-hidden'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -top-1 w-1 h-1 bg-emerald-500 rounded-full blur-[1px]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
