
import React from 'react';
import { ViewMode } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, viewMode, setViewMode }) => {
  return (
    <div className="min-h-screen flex flex-col selection:bg-rose-600 selection:text-white">
      <header className="bg-black/60 backdrop-blur-xl border-b border-rose-900/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(225,29,72,0.6)] animate-pulse">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black font-logo tracking-tighter text-white uppercase leading-none">SUNDO VOICE</h1>
              <p className="text-[10px] text-rose-500 font-bold uppercase tracking-[0.4em] mt-1">The Awakening : 사자보이즈</p>
            </div>
          </div>
          
          <nav className="flex bg-zinc-900 border border-white/5 p-1.5 rounded-2xl">
            <button
              onClick={() => setViewMode('USER')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-widest transition-all duration-500 ${
                viewMode === 'USER' 
                ? 'bg-rose-600 text-white shadow-[0_0_25px_rgba(225,29,72,0.5)]' 
                : 'text-zinc-500 hover:text-rose-400'
              }`}
            >
              VOTING STAGE
            </button>
            <button
              onClick={() => setViewMode('ADMIN')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-widest transition-all duration-500 ${
                viewMode === 'ADMIN' 
                ? 'bg-rose-600 text-white shadow-[0_0_25px_rgba(225,29,72,0.5)]' 
                : 'text-zinc-500 hover:text-rose-400'
              }`}
            >
              CHART CONTROL
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="py-12 text-center border-t border-rose-900/20 bg-black">
        <div className="flex justify-center items-center gap-3 mb-4">
           <span className="w-8 h-[1px] bg-rose-900"></span>
           <div className="text-rose-600">✦</div>
           <span className="w-8 h-[1px] bg-rose-900"></span>
        </div>
        <p className="text-zinc-600 text-[10px] font-logo tracking-[0.5em] uppercase">
          2026 SUNDO VOICE &copy; BY SUNDOSOFT
        </p>
      </footer>
    </div>
  );
};
