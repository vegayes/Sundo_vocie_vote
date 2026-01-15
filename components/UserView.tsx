
import React, { useState, useEffect } from 'react';
import { SurveyOption } from '../types';

interface UserViewProps {
  options: SurveyOption[];
  onSubmit: (rankings: Record<number, string>) => void;
}

const UserView: React.FC<UserViewProps> = ({ options, onSubmit }) => {
  // rankings: { 1: 'option-id', 2: 'option-id', ... }
  const [rankings, setRankings] = useState<Record<number, string>>({});
  const [activeRank, setActiveRank] = useState<number>(1);
  const ranks = [1, 2, 3, 4, 5];

  // 자동으로 다음 빈 슬롯을 활성화
  useEffect(() => {
    const nextEmptyRank = ranks.find(r => !rankings[r]);
    if (nextEmptyRank) {
      setActiveRank(nextEmptyRank);
    }
  }, [rankings]);

  const handleOptionClick = (optionId: string) => {
    // 이미 다른 순위에 선택된 경우 제거 (토글)
    const existingRank = Object.entries(rankings).find(([_, id]) => id === optionId);
    if (existingRank) {
      const newRankings = { ...rankings };
      delete newRankings[parseInt(existingRank[0])];
      setRankings(newRankings);
      return;
    }

    // 현재 활성화된 순위에 할당
    setRankings(prev => ({
      ...prev,
      [activeRank]: optionId
    }));
  };

  const removeRank = (rank: number) => {
    const newRankings = { ...rankings };
    delete newRankings[rank];
    setRankings(newRankings);
    setActiveRank(rank);
  };

  const isComplete = Object.keys(rankings).length === 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) {
      alert('1위부터 5위까지 모든 멤버를 각성시켜 주세요.');
      return;
    }
    onSubmit(rankings);
    setRankings({});
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-32">
      {/* 1. 상단 스테이지: 선택된 랭킹 슬롯 (모바일에서도 한눈에 확인 가능) */}
      <div className="sticky top-20 z-40 py-6 mb-8">
        <div className="glass-premium rounded-[32px] p-4 md:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-rose-600/30">
          <div className="flex justify-between items-center gap-2 md:gap-4 overflow-x-auto pb-2 no-scrollbar">
            {ranks.map(rank => {
              const selectedOptionId = rankings[rank];
              const option = options.find(o => o.id === selectedOptionId);
              const isActive = activeRank === rank;

              return (
                <button
                  key={rank}
                  type="button"
                  onClick={() => selectedOptionId ? removeRank(rank) : setActiveRank(rank)}
                  className={`
                    relative flex-shrink-0 flex flex-col items-center justify-center 
                    w-16 h-24 md:w-28 md:h-36 rounded-2xl border-2 transition-all duration-500
                    ${selectedOptionId 
                      ? rank === 1 ? 'border-amber-500 bg-amber-500/10' : 'border-rose-600 bg-rose-600/10' 
                      : isActive ? 'border-white bg-white/5 animate-pulse' : 'border-zinc-800 bg-black'}
                  `}
                >
                  <div className={`text-[10px] md:text-xs font-black font-logo mb-1 ${rank === 1 ? 'text-amber-500' : 'text-zinc-500'}`}>
                    {rank === 1 ? 'CROWN' : `${rank}위`}
                  </div>
                  
                  {option ? (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                      <div className={`w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-1 md:mb-2 ${rank === 1 ? 'bg-amber-500' : 'bg-rose-600'}`}>
                        {rank === 1 ? (
                          <svg className="w-5 h-5 md:w-8 md:h-8 text-black" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.55 18.55 20 18 20H6C5.45 20 5 19.55 5 19V18H19V19Z" />
                          </svg>
                        ) : (
                          <span className="text-white font-black text-xs md:text-sm">{rank}</span>
                        )}
                      </div>
                      <span className="text-[9px] md:text-[11px] font-bold text-white text-center px-1 leading-tight truncate w-full">
                        {option.label}
                      </span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 md:w-10 md:h-10 border-2 border-dashed border-zinc-800 rounded-full flex items-center justify-center">
                      <span className="text-zinc-800 text-lg md:text-2xl font-black">+</span>
                    </div>
                  )}

                  {selectedOptionId && (
                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-zinc-900 rounded-full flex items-center justify-center text-[10px] text-white hover:bg-rose-600">
                      ✕
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. 하단 리스트: 참가자 선택 그리드 */}
      <div className="space-y-6">
        <div className="text-center space-y-2 mb-8">
          <p className="text-rose-500 text-[10px] font-black tracking-[0.3em] uppercase">Selection Pool</p>
          <h3 className="text-xl md:text-2xl font-black text-white font-logo italic">AWAKEN YOUR CANDIDATE</h3>
          <p className="text-zinc-500 text-xs">순위를 누르고 아래의 후보자를 선택하여 팀을 완성하세요.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {options.map((option) => {
            const selectedInRank = Object.entries(rankings).find(([_, id]) => id === option.id);
            const isSelected = !!selectedInRank;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionClick(option.id)}
                className={`
                  relative group p-4 md:p-6 rounded-2xl border-2 text-left transition-all duration-300
                  ${isSelected 
                    ? 'border-rose-600 bg-rose-600/20 shadow-[0_0_20px_rgba(225,29,72,0.3)]' 
                    : 'border-zinc-900 bg-zinc-950/50 hover:border-rose-900 hover:bg-zinc-900'}
                `}
              >
                <div className="flex flex-col gap-2 md:gap-3">
                  <div className={`
                    w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center transition-colors
                    ${isSelected ? 'bg-rose-600 text-white' : 'bg-zinc-900 text-zinc-600 group-hover:bg-zinc-800'}
                  `}>
                    {isSelected ? (
                      <span className="font-black text-xs md:text-sm">{selectedInRank[0]}위</span>
                    ) : (
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                  </div>
                  <div className="font-bold text-sm md:text-base text-zinc-300 group-hover:text-white truncate">
                    {option.label}
                  </div>
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 animate-pulse">
                     <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. 제출 섹션 */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-50">
        <div className="max-w-md mx-auto">
          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className={`
              w-full py-4 md:py-6 rounded-2xl font-black font-logo tracking-[0.3em] uppercase text-sm md:text-base transition-all duration-500
              ${isComplete 
                ? 'bg-rose-600 text-white shadow-[0_10px_40px_rgba(225,29,72,0.5)] scale-100 opacity-100' 
                : 'bg-zinc-900 text-zinc-600 scale-95 opacity-50 cursor-not-allowed'}
            `}
          >
            {isComplete ? 'FINAL SUBMIT' : `${5 - Object.keys(rankings).length} MORE REQUIRED`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserView;
