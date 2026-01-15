
import React, { useState } from 'react';
import { User } from '../types';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [empId, setEmpId] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdminMode) {
      if (adminPass === 'admin123') {
        onLogin({ id: 'admin', name: 'System Admin', role: 'ADMIN' });
      } else {
        alert('관리자 암호가 일치하지 않습니다.');
      }
    } else {
      if (!name || !empId) {
        alert('이름과 사번을 모두 입력해 주세요.');
        return;
      }
      onLogin({ id: empId, name, role: 'USER' });
    }
  };

  return (
    <div className="min-h-[70vh] md:min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="glass-premium w-full max-w-md p-6 md:p-10 rounded-3xl md:rounded-[40px] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-600 to-transparent"></div>
        
        <div className="text-center mb-8 md:mb-10">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-rose-600/10 rounded-2xl md:rounded-3xl border border-rose-600/30 flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-[0_0_30px_rgba(225,29,72,0.2)]">
            <svg className="w-8 h-8 md:w-10 md:h-10 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V11.99H5V6.3L12 3.19V11.99Z" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-black font-logo tracking-tighter uppercase mb-1 md:mb-2">Enter the Stage</h2>
          <p className="text-zinc-600 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">Sundo Voice Authentication</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {!isAdminMode ? (
            <>
              <div>
                <label className="block text-[9px] md:text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1.5 md:mb-2 ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="성함을 입력하세요"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-white text-sm md:text-base focus:border-rose-600 focus:ring-1 focus:ring-rose-600 outline-none transition-all placeholder:text-zinc-700 font-bold"
                />
              </div>
              <div>
                <label className="block text-[9px] md:text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1.5 md:mb-2 ml-1">Employee ID</label>
                <input 
                  type="text" 
                  value={empId}
                  onChange={(e) => setEmpId(e.target.value)}
                  placeholder="사번을 입력하세요"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-white text-sm md:text-base focus:border-rose-600 focus:ring-1 focus:ring-rose-600 outline-none transition-all placeholder:text-zinc-700 font-bold"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-[9px] md:text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1.5 md:mb-2 ml-1">Admin Passkey</label>
              <input 
                type="password" 
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                placeholder="관리자 비밀번호"
                className="w-full bg-zinc-950 border border-rose-900/50 rounded-xl md:rounded-2xl px-5 md:px-6 py-3 md:py-4 text-white text-sm md:text-base focus:border-rose-600 focus:ring-1 focus:ring-rose-600 outline-none transition-all placeholder:text-zinc-700 font-bold"
              />
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-4 md:py-5 bg-rose-600 text-white font-black font-logo tracking-[0.2em] md:tracking-[0.3em] rounded-xl md:rounded-2xl shadow-[0_10px_30px_rgba(225,29,72,0.3)] hover:bg-rose-500 active:scale-[0.98] transition-all uppercase text-xs md:text-sm mt-2 md:mt-4"
          >
            {isAdminMode ? 'Enter Control Room' : 'Enter Selection Phase'}
          </button>
        </form>

        <div className="mt-8 md:mt-10 pt-4 md:pt-6 border-t border-white/5 text-center">
          <button 
            onClick={() => setIsAdminMode(!isAdminMode)}
            className="text-[9px] md:text-[10px] font-bold text-zinc-600 hover:text-rose-500 uppercase tracking-widest transition-colors"
          >
            {isAdminMode ? 'Back to Voting Portal' : 'Administrator Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
