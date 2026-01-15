
import React from 'react';
import { ViewMode, User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  viewMode: ViewMode;
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, viewMode, user, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col selection:bg-rose-600 selection:text-white">
      <header className="bg-black/90 backdrop-blur-xl border-b border-rose-900/30 sticky top-0 z-[100]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 md:h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-zinc-950 border border-rose-900/50 rounded-lg md:rounded-xl flex items-center justify-center text-rose-500 font-black font-logo text-[10px] md:text-xs">
              SV
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm md:text-lg font-black font-logo tracking-tighter text-white uppercase leading-none">SUNDO VOICE</h1>
              <p className="text-[7px] md:text-[9px] text-rose-500 font-bold uppercase tracking-[0.2em] mt-0.5 md:mt-1 italic">THE AWAKENING</p>
            </div>
          </div>
          
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
             <div className="crown-container animate-pulse-gold scale-75 md:scale-100">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-amber-500 glow-gold" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.55 18.55 20 18 20H6C5.45 20 5 19.55 5 19V18H19V19Z" />
                </svg>
             </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            {user && (
              <div className="flex items-center gap-3 md:gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">USER</p>
                  <p className="text-xs md:text-sm font-bold text-white max-w-[100px] truncate">{user.name}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 md:px-4 md:py-2 border border-rose-900/30 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black tracking-widest text-rose-500 hover:bg-rose-600 hover:text-white transition-all uppercase"
                >
                  EXIT
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
      <footer className="py-8 md:py-12 text-center border-t border-rose-900/10 bg-black">
        <p className="text-zinc-700 text-[8px] md:text-[9px] font-logo tracking-[0.4em] md:tracking-[0.6em] uppercase px-4">
          ✦ 2026 SUNDO VOICE | THE AWAKENING ✦
        </p>
      </footer>
    </div>
  );
};
