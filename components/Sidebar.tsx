
import React from 'react';
import { Home, Heart, Calendar, TrendingUp, Settings, List, History } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: any) => void;
  themeMode: 'dark' | 'light';
  isOpen: boolean;
  onClose: () => void;
}

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
    <circle cx="50" cy="45" r="35" fill="#3D7D4F" />
    <circle cx="50" cy="45" r="5" fill="white" />
    <circle cx="50" cy="23" r="8" fill="white" />
    <circle cx="71" cy="38" r="8" fill="white" />
    <circle cx="63" cy="62" r="8" fill="white" />
    <circle cx="37" cy="62" r="8" fill="white" />
    <circle cx="29" cy="38" r="8" fill="white" />
    <path 
      d="M40 75C40 75 55 85 80 85C95 85 100 80 100 80V74C100 74 90 80 80 80C60 80 40 72 40 72Z" 
      fill="#3D7D4F" 
    />
  </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ activePage, onNavigate, themeMode, isOpen, onClose }) => {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'favorites', icon: Heart, label: 'Favorites' },
    { id: 'mylist', icon: List, label: 'My List' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'upcoming', icon: Calendar, label: 'Coming soon' },
    { id: 'trending', icon: TrendingUp, label: 'Trending' },
  ];

  const secondaryItems = [
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed left-0 top-0 h-screen w-64 border-r p-6 flex flex-col gap-8 z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${themeMode === 'light' ? 'bg-white border-gray-200' : 'bg-[#0f1014] border-white/5'}`}>
      <div className="flex items-center gap-3 px-2 cursor-pointer group" onClick={() => onNavigate('home')}>
        <div className="transition-transform duration-500 group-hover:rotate-12">
          <Logo />
        </div>
        <span className="text-2xl font-extrabold tracking-tight">J-cline</span>
      </div>

      <nav className="flex flex-col gap-2 overflow-y-auto no-scrollbar pr-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onNavigate(item.id);
              onClose(); // Close sidebar on mobile after navigation
            }}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activePage === item.id
                ? themeMode === 'light'
                  ? 'bg-gray-100 text-black shadow-xl'
                  : 'bg-white/10 text-white shadow-xl shadow-black/20'
                : themeMode === 'light'
                  ? 'text-gray-600 hover:text-black hover:bg-gray-100'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon size={20} className={
              activePage === item.id
                ? themeMode === 'light' ? 'text-black' : 'text-white'
                : themeMode === 'light' ? 'text-gray-600 group-hover:text-black' : 'text-gray-500 group-hover:text-white'
            } />
            <span className="font-semibold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <nav className="flex flex-col gap-2 mt-auto pb-4">
        <div className="h-px bg-white/5 mx-4 mb-6" />
        {secondaryItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onNavigate(item.id);
              onClose(); // Close sidebar on mobile after navigation
            }}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activePage === item.id
                ? themeMode === 'light'
                  ? 'bg-gray-100 text-black shadow-xl'
                  : 'bg-white/10 text-white shadow-xl shadow-black/20'
                : themeMode === 'light'
                  ? 'text-gray-600 hover:text-black hover:bg-gray-100'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon size={20} className={
              activePage === item.id
                ? themeMode === 'light' ? 'text-black' : 'text-white'
                : themeMode === 'light' ? 'text-gray-600 group-hover:text-black' : 'text-gray-500 group-hover:text-white'
            } />
            <span className="font-semibold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
    </>
  );
};

export default Sidebar;
