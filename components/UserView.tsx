
import React, { useState } from 'react';
import { SurveyOption } from '../types';

interface UserViewProps {
  options: SurveyOption[];
  onSubmit: (rankings: Record<number, string>) => void;
}

const UserView: React.FC<UserViewProps> = ({ options, onSubmit }) => {
  const [rankings, setRankings] = useState<Record<number, string>>({});
  const ranks = [1, 2, 3, 4, 5];

  const handleSelect = (rank: number, optionId: string) => {
    setRankings(prev => ({
      ...prev,
      [rank]: optionId
    }));
  };

  const isOptionSelectedElsewhere = (optionId: string, currentRank: number) => {
    return Object.entries(rankings).some(([rank, id]) => parseInt(rank) !== currentRank && id === optionId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(rankings).length < 5) {
      alert('1위부터 5위까지 모든 참가자를 선택해 주세요.');
      return;
    }
    onSubmit(rankings);
    setRankings({});
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="py-16 text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/5 text-rose-500 text-[11px] font-bold uppercase tracking-[0.4em]">
          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
          Official Selection Phase
        </div>
        <h2 className="text-6xl font-black text-white mb-6 font-logo tracking-tighter uppercase italic">
          The Awakening
        </h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
          복면 뒤에 숨겨진 진정한 가치를 찾아라.<br/>
          <span className="text-white font-bold">사자보이즈</span>의 목소리로 증명될 최고의 5인을 선정하세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12 pb-24">
        <div className="glass-dark rounded-[40px] shadow-2xl overflow-hidden border border-rose-900/30">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-rose-900/20">
                  <th className="px-10 py-10 font-black text-rose-500 font-logo text-sm uppercase tracking-[0.3em] sticky left-0 bg-zinc-950/95 z-10 w-80">
                    VOICE CANDIDATES
                  </th>
                  {ranks.map(r => (
                    <th key={r} className="px-6 py-10 font-black text-center font-logo text-sm">
                      <div className={`text-xs mb-1 ${r === 1 ? 'text-amber-400' : 'text-zinc-500'}`}>{r === 1 ? 'GOLD' : 'RANK'}</div>
                      <div className={`text-2xl ${r === 1 ? 'text-amber-400 glow-text' : 'text-white'}`}>{r}위</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {options.map((option) => (
                  <tr key={option.id} className="border-b border-rose-900/10 hover:bg-rose-500/[0.03] transition-all group">
                    <td className="px-10 py-8 font-bold text-lg text-zinc-300 sticky left-0 bg-zinc-950/95 group-hover:text-white z-10 border-r border-rose-900/10">
                      <div className="flex items-center gap-4">
                        <div className="w-1 h-8 bg-rose-600 rounded-full scale-y-0 group-hover:scale-y-100 transition-transform origin-center"></div>
                        {option.label}
                      </div>
                    </td>
                    {ranks.map(rank => {
                      const isDisabled = isOptionSelectedElsewhere(option.id, rank);
                      const isSelected = rankings[rank] === option.id;

                      return (
                        <td key={`${option.id}-${rank}`} className="px-6 py-8 text-center">
                          <label className={`
                            relative flex items-center justify-center w-12 h-12 mx-auto cursor-pointer rounded-2xl border-2 transition-all duration-500
                            ${isSelected 
                              ? rank === 1 
                                ? 'border-amber-400 bg-amber-400 text-black shadow-[0_0_30px_rgba(251,191,36,0.5)] scale-110' 
                                : 'border-rose-600 bg-rose-600 text-white shadow-[0_0_25px_rgba(225,29,72,0.5)] scale-110' 
                              : 'border-zinc-800 hover:border-rose-500/50 hover:scale-105'}
                            ${isDisabled ? 'opacity-5 cursor-not-allowed filter grayscale' : ''}
                          `}>
                            <input
                              type="radio"
                              name={`rank-${rank}`}
                              value={option.id}
                              checked={isSelected}
                              disabled={isDisabled}
                              onChange={() => handleSelect(rank, option.id)}
                              className="sr-only"
                            />
                            {isSelected ? (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span className="text-xs font-black text-zinc-700 font-logo">{rank}</span>
                            )}
                          </label>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
             <span className="w-8 h-[1px] bg-zinc-800"></span>
             중복 선택 불가 · 1~5위 필수 지정
             <span className="w-8 h-[1px] bg-zinc-800"></span>
          </div>
          <button
            type="submit"
            className="group relative px-20 py-6 bg-transparent font-logo tracking-[0.5em] font-black text-white uppercase overflow-hidden rounded-[24px]"
          >
            <div className="absolute inset-0 bg-rose-600 transition-all duration-500 group-hover:bg-rose-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <span className="relative z-10 flex items-center gap-4 text-xl">
              SUBMIT VOTES
              <svg className="w-6 h-6 animate-bounce-x" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7M5 12h16" /></svg>
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserView;
