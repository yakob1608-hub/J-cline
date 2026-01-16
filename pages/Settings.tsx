
import React, { useState, useEffect } from 'react';
import { User as FirebaseUser, updateProfile } from 'firebase/auth';
import {
  Settings, Bell, User, LogOut, Film,
  Tv, LogIn, Palette, Trash2, Eye, Database, Save
} from 'lucide-react';

interface SettingsPageProps {
  onSignOut: () => void;
  user: FirebaseUser | null;
  themeMode: 'dark' | 'light';
  onThemeModeChange: (mode: 'dark' | 'light') => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onSignOut, user, themeMode, onThemeModeChange }) => {
  // --- Account State ---
  const [userName, setUserName] = useState(() => user?.displayName || '');
  const [userEmail, setUserEmail] = useState(() => user?.email || 'user@example.com');
  const [savingName, setSavingName] = useState(false);
  const [isNameChanged, setIsNameChanged] = useState(false);


  // --- Notification State ---
  const [movieNotif, setMovieNotif] = useState(() => JSON.parse(localStorage.getItem('jc_notif_movie') ?? 'true'));
  const [episodeNotif, setEpisodeNotif] = useState(() => JSON.parse(localStorage.getItem('jc_notif_episode') ?? 'true'));
  const [securityNotif, setSecurityNotif] = useState(() => JSON.parse(localStorage.getItem('jc_notif_security') ?? 'true'));

  // --- Appearance State ---
  // Removed theme and language



  // Effect to persist changes and apply global theme
  useEffect(() => {
    // Note: User name and email are handled by Firebase Auth
    localStorage.setItem('jc_notif_movie', JSON.stringify(movieNotif));
    localStorage.setItem('jc_notif_episode', JSON.stringify(episodeNotif));
    localStorage.setItem('jc_notif_security', JSON.stringify(securityNotif));
  }, [
    movieNotif, episodeNotif, securityNotif
  ]);

  const handleSaveName = async () => {
    if (!user) return;
    setSavingName(true);
    try {
      await updateProfile(user, { displayName: userName });
      setIsNameChanged(false);
      // Optionally, you can add a success message or toast here
    } catch (error) {
      console.error('Error updating profile:', error);
      // Optionally, handle error (e.g., show error message)
    } finally {
      setSavingName(false);
    }
  };

  const handleClearCache = () => {
    if (confirm('Are you sure? This will reset all your preferences and clear your watch list.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const Toggle = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
    <button 
      onClick={onToggle}
      className={`w-12 h-6 rounded-full transition-all relative ${active ? 'bg-emerald-600 shadow-lg shadow-emerald-600/30' : 'bg-white/10'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'right-1' : 'left-1'}`} />
    </button>
  );

  return (
    <div className={`min-h-screen pt-8 px-6 pb-32 ${themeMode === 'light' ? 'bg-white' : 'bg-[#0f1014]'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-emerald-600/20 rounded-2xl flex items-center justify-center">
            <Settings className="text-emerald-500" size={24} />
          </div>
          <div>
            <h1 className={`text-3xl font-black uppercase tracking-tight ${themeMode === 'light' ? 'text-black' : 'text-white'}`}>System Settings</h1>
            <p className={`text-sm font-medium ${themeMode === 'light' ? 'text-gray-600' : 'text-gray-500'}`}>Fine-tune your J-cline experience</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          
          {/* 1. Account Profile */}
          <div className={`rounded-[2rem] p-8 backdrop-blur-sm ${themeMode === 'light' ? 'bg-gray-100 border border-gray-300' : 'bg-white/5 border-white/5'}`}>
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                <div className="flex items-center gap-4 w-full">
                   <input
                     type="text"
                     value={userName}
                     onChange={(e) => {
                       setUserName(e.target.value);
                       setIsNameChanged(e.target.value !== (user?.displayName || ''));
                     }}
                     placeholder="Enter your name"
                     className={`bg-transparent text-2xl font-black uppercase tracking-tight outline-none flex-1 cursor-text focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2 py-1 ${themeMode === 'light' ? 'text-black' : 'text-white'}`}
                   />
                   {isNameChanged && (
                     <button
                       onClick={handleSaveName}
                       disabled={savingName}
                       className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                     >
                       {savingName ? 'Saving...' : 'Save Name'}
                     </button>
                   )}
                </div>
                <div className="text-right">
                   <p className={`text-[10px] font-black uppercase mb-1 ${themeMode === 'light' ? 'text-gray-600' : 'text-gray-500'}`}>Account ID</p>
                   <p className={`text-xs font-mono ${themeMode === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>JC-88291-XL</p>
                </div>
             </div>

            <div className="grid gap-4">
               <div className={`flex flex-col gap-1.5 px-4 py-3 rounded-2xl border ${themeMode === 'light' ? 'bg-gray-200 border-gray-300' : 'bg-black/20 border-white/5'}`}>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${themeMode === 'light' ? 'text-gray-600' : 'text-gray-500'}`}>Email Address</span>
                  <input
                    type="email"
                    value={userEmail}
                    readOnly
                    className={`bg-transparent text-sm font-bold outline-none cursor-default ${themeMode === 'light' ? 'text-black' : 'text-white'}`}
                  />
               </div>
            </div>
          </div>

          {/* 2. Appearance & Themes */}
          <div className={`rounded-[2rem] p-8 backdrop-blur-sm ${themeMode === 'light' ? 'bg-gray-100 border border-gray-300' : 'bg-white/5 border-white/5'}`}>
            <div className="flex items-center gap-3 mb-6">
              <Palette size={18} className="text-emerald-500" />
              <h3 className={`text-xs font-black uppercase tracking-widest ${themeMode === 'light' ? 'text-gray-600' : 'text-gray-500'}`}>Appearance</h3>
            </div>
            
            <div className="grid gap-4">
              <div className={`flex items-center justify-between p-4 rounded-2xl border ${themeMode === 'light' ? 'bg-gray-200 border-gray-300' : 'bg-black/20 border-white/5'}`}>
                <div>
                  <p className={`text-sm font-bold ${themeMode === 'light' ? 'text-black' : 'text-white'}`}>Appearance Mode</p>
                  <p className={`text-[10px] uppercase tracking-tight ${themeMode === 'light' ? 'text-gray-600' : 'text-gray-500'}`}>Switch between dark and light themes</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onThemeModeChange('dark')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all border ${themeMode === 'dark' ? 'bg-emerald-600 text-white border-emerald-600' : themeMode === 'light' ? 'bg-gray-200 text-gray-600 border-gray-300 hover:bg-gray-300' : 'bg-white/10 text-gray-400 hover:text-white border-transparent'}`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => onThemeModeChange('light')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all border ${themeMode === 'light' ? 'bg-emerald-600 text-white border-emerald-600' : themeMode === 'dark' ? 'bg-white/10 text-gray-400 hover:text-white border-transparent' : 'bg-white/10 text-gray-400 hover:text-white border-transparent'}`}
                  >
                    Light
                  </button>
                </div>
              </div>

            </div>
          </div>


          {/* 4. Notification Center */}
          <div className={`rounded-[2rem] p-8 backdrop-blur-sm ${themeMode === 'light' ? 'bg-gray-100 border border-gray-300' : 'bg-white/5 border-white/5'}`}>
            <div className="flex items-center gap-3 mb-6">
              <Bell size={18} className="text-emerald-500" />
              <h3 className={`text-xs font-black uppercase tracking-widest ${themeMode === 'light' ? 'text-gray-600' : 'text-gray-500'}`}>Notifications</h3>
            </div>
            
            <div className="grid gap-4">
              <div className={`flex items-center justify-between p-4 rounded-2xl border ${themeMode === 'light' ? 'bg-gray-200 border-gray-300' : 'bg-black/20 border-white/5'}`}>
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-amber-500/10 rounded-xl"><LogIn size={20} className="text-amber-500" /></div>
                  <p className={`text-sm font-bold ${themeMode === 'light' ? 'text-black' : 'text-white'}`}>Security & Login Alerts</p>
                </div>
                <Toggle active={securityNotif} onToggle={() => setSecurityNotif(!securityNotif)} />
              </div>

              <div className={`flex items-center justify-between p-4 rounded-2xl border ${themeMode === 'light' ? 'bg-gray-200 border-gray-300' : 'bg-black/20 border-white/5'}`}>
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-emerald-500/10 rounded-xl"><Film size={20} className="text-emerald-500" /></div>
                  <p className={`text-sm font-bold ${themeMode === 'light' ? 'text-black' : 'text-white'}`}>New Movie Releases</p>
                </div>
                <Toggle active={movieNotif} onToggle={() => setMovieNotif(!movieNotif)} />
              </div>

              <div className={`flex items-center justify-between p-4 rounded-2xl border ${themeMode === 'light' ? 'bg-gray-200 border-gray-300' : 'bg-black/20 border-white/5'}`}>
                <div className="flex items-center gap-4">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl"><Tv size={20} className="text-blue-500" /></div>
                  <p className={`text-sm font-bold ${themeMode === 'light' ? 'text-black' : 'text-white'}`}>TV Series Updates</p>
                </div>
                <Toggle active={episodeNotif} onToggle={() => setEpisodeNotif(!episodeNotif)} />
              </div>
            </div>
          </div>


          {/* 7. Data Management */}
          <div className={`rounded-[2rem] p-8 backdrop-blur-sm ${themeMode === 'light' ? 'bg-gray-100 border border-gray-300' : 'bg-white/5 border-white/5'}`}>
            <div className="flex items-center gap-3 mb-6">
              <Database size={18} className="text-red-500" />
              <h3 className={`text-xs font-black uppercase tracking-widest ${themeMode === 'light' ? 'text-gray-600' : 'text-gray-500'}`}>Data Management</h3>
            </div>
            
            <div className="grid gap-4">
              <div className={`flex flex-col md:flex-row items-center justify-between p-4 rounded-2xl border gap-4 ${themeMode === 'light' ? 'bg-red-100 border-red-200' : 'bg-red-500/5 border-red-500/10'}`}>
                <div>
                  <p className="text-sm font-bold text-red-500">Clear Application Cache</p>
                  <p className={`text-[10px] uppercase ${themeMode === 'light' ? 'text-gray-600' : 'text-gray-500'}`}>Wipes all locally stored data and reset preferences</p>
                </div>
                <button
                  onClick={handleClearCache}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${themeMode === 'light' ? 'bg-red-100 text-red-600 border border-red-300 hover:bg-red-200' : 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white'}`}
                >
                  Wipe Everything
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={onSignOut}
            className={`flex items-center justify-center gap-3 w-full p-5 rounded-[2rem] transition-all font-black uppercase text-xs tracking-[0.2em] ${themeMode === 'light' ? 'bg-gray-200 hover:bg-red-100 text-gray-600 hover:text-red-600 border border-gray-300 hover:border-red-300' : 'bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-500 border border-white/5 hover:border-red-500/20'}`}
          >
            <LogOut size={16} /> Sign Out
          </button>

          <p className={`text-center text-[9px] font-bold uppercase tracking-[0.3em] mt-4 ${themeMode === 'light' ? 'text-gray-800' : 'text-gray-700'}`}>
            J-cline Client v4.2.0-stable • Build 8821
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
