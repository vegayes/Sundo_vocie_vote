
import React, { useState, useMemo } from 'react';
import { SurveyOption, SurveyResponse, RankingData } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminViewProps {
  options: SurveyOption[];
  responses: SurveyResponse[];
  onUpdateOptions: (options: SurveyOption[]) => void;
  onClearResponses: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({ options, responses, onUpdateOptions, onClearResponses }) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'voters' | 'manage'>('stats');
  const [newOptionLabel, setNewOptionLabel] = useState('');

  const statsData: RankingData[] = useMemo(() => {
    const dataMap: Record<string, RankingData> = options.reduce((acc, opt) => {
      acc[opt.id] = {
        optionLabel: opt.label,
        first: 0,
        second: 0,
        third: 0,
        fourth: 0,
        fifth: 0,
        totalPoints: 0
      };
      return acc;
    }, {} as Record<string, RankingData>);

    responses.forEach(res => {
      Object.entries(res.rankings).forEach(([rankStr, optId]) => {
        const rank = parseInt(rankStr);
        const id = optId as string;
        if (dataMap[id]) {
          const points = 6 - rank;
          dataMap[id].totalPoints += points;
          if (rank === 1) dataMap[id].first++;
          else if (rank === 2) dataMap[id].second++;
          else if (rank === 3) dataMap[id].third++;
          else if (rank === 4) dataMap[id].fourth++;
          else if (rank === 5) dataMap[id].fifth++;
        }
      });
    });

    return Object.values(dataMap).sort((a, b) => b.totalPoints - a.totalPoints);
  }, [options, responses]);

  const handleAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOptionLabel.trim()) return;
    const newOption: SurveyOption = {
      id: crypto.randomUUID(),
      label: newOptionLabel.trim()
    };
    onUpdateOptions([...options, newOption]);
    setNewOptionLabel('');
  };

  const handleDeleteOption = (id: string) => {
    if (window.confirm('참가자 정보를 삭제하시겠습니까?')) {
      onUpdateOptions(options.filter(o => o.id !== id));
    }
  };

  return (
    <div className="space-y-8 md:space-y-12 max-w-7xl mx-auto px-4 md:px-6 py-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 md:pb-10 border-b border-rose-900/20">
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-black text-white font-logo tracking-tighter uppercase italic mb-1 md:mb-2">CHART CONTROL</h2>
          <p className="text-rose-500 font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[8px] md:text-[10px]">Real-time Voting Intelligence & Program Management</p>
        </div>
        <div className="flex bg-zinc-950/80 p-1 md:p-1.5 rounded-xl md:rounded-[20px] border border-white/5 mx-auto md:mx-0 overflow-x-auto max-w-full">
          {(['stats', 'voters', 'manage'] as const).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black font-logo tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-rose-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              {tab === 'stats' ? 'CHART' : tab === 'voters' ? 'VOTERS' : 'EDIT'}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'stats' && (
        <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            <div className="glass-premium p-6 md:p-10 rounded-2xl md:rounded-[32px] border-l-4 border-l-rose-600">
              <p className="text-zinc-500 text-[10px] md:text-[11px] font-black font-logo tracking-widest uppercase mb-1 md:mb-2">Total Votes</p>
              <h3 className="text-3xl md:text-5xl font-black text-white font-logo tracking-tighter">{responses.length}</h3>
            </div>
            <div className="glass-premium p-6 md:p-10 rounded-2xl md:rounded-[32px] border-l-4 border-l-amber-500">
              <p className="text-zinc-500 text-[10px] md:text-[11px] font-black font-logo tracking-widest uppercase mb-1 md:mb-2">Candidates</p>
              <h3 className="text-3xl md:text-5xl font-black text-white font-logo tracking-tighter">{options.length}</h3>
            </div>
            <div className="glass-premium p-6 md:p-10 rounded-2xl md:rounded-[32px] flex items-center justify-between group col-span-1 sm:col-span-2 lg:col-span-1">
              <button 
                onClick={onClearResponses}
                className="flex items-center gap-4 text-rose-500 hover:text-rose-400 transition-colors"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-rose-600/10 border border-rose-600/30 group-hover:rotate-12 transition-all">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </div>
                <span className="font-logo font-black text-[10px] md:text-xs tracking-widest">RESET CHART</span>
              </button>
            </div>
          </div>

          <div className="glass-premium p-4 md:p-10 rounded-2xl md:rounded-[40px]">
            <h3 className="text-base md:text-xl font-black text-white font-logo tracking-widest mb-6 md:mb-10 flex items-center gap-3 md:gap-4 uppercase">
              <span className="w-1 md:w-1.5 h-5 md:h-6 bg-rose-600 rounded-full"></span>
              Live Standing Results
            </h3>
            <div className="h-[300px] md:h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statsData} layout="vertical" margin={{ left: 10, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#1a1a1a" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="optionLabel" 
                    type="category" 
                    width={100} 
                    tick={{ fontSize: 10, fill: '#888', fontWeight: 'bold' }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(225,29,72,0.05)'}}
                    contentStyle={{ backgroundColor: '#050505', border: '1px solid #e11d48', borderRadius: '12px', color: '#fff', fontSize: '10px' }}
                  />
                  <Bar dataKey="totalPoints" fill="#e11d48" radius={[0, 8, 8, 0]} name="Power Score" barSize={24}>
                    {statsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#f59e0b' : index < 4 ? '#e11d48' : '#333'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'voters' && (
        <div className="glass-premium rounded-2xl md:rounded-[40px] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="p-6 md:p-10 border-b border-rose-900/10 flex justify-between items-center">
            <h3 className="text-base md:text-xl font-black text-white font-logo tracking-widest uppercase">Participant Tracking</h3>
            <span className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest">Total: {responses.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead className="bg-white/5 text-rose-500 text-[9px] md:text-[11px] font-black font-logo uppercase tracking-widest">
                <tr>
                  <th className="px-6 md:px-10 py-4 md:py-6">Voter Name</th>
                  <th className="px-4 md:px-6 py-4 md:py-6">Employee ID</th>
                  <th className="px-4 md:px-6 py-4 md:py-6">Top Pick (1st)</th>
                  <th className="px-6 md:px-10 py-4 md:py-6 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {responses.slice().reverse().map((res) => (
                  <tr key={res.id} className="hover:bg-rose-500/[0.03] transition-colors group">
                    <td className="px-6 md:px-10 py-4 md:py-6 font-bold text-white text-xs md:text-sm">{res.userName}</td>
                    <td className="px-4 md:px-6 py-4 md:py-6 text-zinc-500 font-mono text-[10px] md:text-xs">{res.userId}</td>
                    <td className="px-4 md:px-6 py-4 md:py-6">
                      <span className="px-2 py-0.5 md:px-3 md:py-1 bg-rose-600/20 text-rose-500 rounded-full text-[9px] md:text-xs font-bold border border-rose-600/30 whitespace-nowrap">
                        {options.find(o => o.id === res.rankings[1])?.label || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 md:px-10 py-4 md:py-6 text-right text-zinc-600 text-[8px] md:text-[10px] font-mono">
                      {new Date(res.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                  </tr>
                ))}
                {responses.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-10 py-16 md:py-20 text-center text-zinc-700 font-bold uppercase tracking-widest text-xs md:text-sm">No votes recorded yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="glass-premium rounded-2xl md:rounded-[40px] p-6 md:p-12 max-w-3xl mx-auto animate-in slide-in-from-bottom-6 duration-700">
          <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10">
            <div className="w-1.5 md:w-2 h-6 md:h-8 bg-rose-600 rounded-full"></div>
            <h3 className="text-lg md:text-2xl font-black text-white font-logo uppercase tracking-widest">Candidate Entry</h3>
          </div>
          
          <form onSubmit={handleAddOption} className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 md:mb-12">
            <input 
              type="text" 
              placeholder="CANDIDATE ALIAS..."
              value={newOptionLabel}
              onChange={(e) => setNewOptionLabel(e.target.value)}
              className="flex-1 px-6 md:px-8 py-3 md:py-5 bg-zinc-950 border border-rose-900/30 rounded-xl md:rounded-[20px] text-white font-bold text-sm focus:ring-2 focus:ring-rose-600 focus:border-rose-600 outline-none transition-all placeholder:text-zinc-700"
            />
            <button 
              type="submit"
              className="px-6 md:px-10 py-3 md:py-5 bg-rose-600 text-white font-logo font-black rounded-xl md:rounded-[20px] shadow-[0_5px_15px_rgba(225,29,72,0.3)] hover:bg-rose-500 transition-all uppercase text-xs md:text-sm"
            >
              Add
            </button>
          </form>

          <div className="space-y-3 md:space-y-4">
            {options.map((option) => (
              <div key={option.id} className="flex items-center justify-between p-4 md:p-6 bg-white/[0.02] rounded-xl md:rounded-[24px] group border border-transparent hover:border-rose-900/30 hover:bg-rose-950/20 transition-all">
                <div className="flex items-center gap-3 md:gap-5">
                  <span className="text-base md:text-xl font-bold text-zinc-400 group-hover:text-white transition-colors">{option.label}</span>
                </div>
                <button 
                  onClick={() => handleDeleteOption(option.id)}
                  className="p-2 md:p-3 text-zinc-700 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg md:rounded-xl transition-all md:opacity-0 md:group-hover:opacity-100"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
