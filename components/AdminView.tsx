
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
  const [activeTab, setActiveTab] = useState<'stats' | 'manage'>('stats');
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
    <div className="space-y-12 max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-rose-900/20">
        <div>
          <h2 className="text-4xl font-black text-white font-logo tracking-tighter uppercase italic mb-2">CHART CONTROL</h2>
          <p className="text-rose-500 font-bold uppercase tracking-[0.3em] text-[10px]">Real-time Voting Intelligence & Program Management</p>
        </div>
        <div className="flex bg-zinc-900/50 p-1.5 rounded-[20px] border border-white/5">
          <button 
            onClick={() => setActiveTab('stats')}
            className={`px-8 py-3 rounded-xl text-xs font-black font-logo tracking-widest transition-all ${activeTab === 'stats' ? 'bg-rose-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            CHART DATA
          </button>
          <button 
            onClick={() => setActiveTab('manage')}
            className={`px-8 py-3 rounded-xl text-xs font-black font-logo tracking-widest transition-all ${activeTab === 'manage' ? 'bg-rose-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            CANDIDATES
          </button>
        </div>
      </div>

      {activeTab === 'stats' ? (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-dark p-10 rounded-[32px] border-l-4 border-l-rose-600">
              <p className="text-zinc-500 text-[11px] font-black font-logo tracking-widest uppercase mb-2">Total Votes</p>
              <h3 className="text-5xl font-black text-white font-logo tracking-tighter">{responses.length}</h3>
            </div>
            <div className="glass-dark p-10 rounded-[32px] border-l-4 border-l-amber-500">
              <p className="text-zinc-500 text-[11px] font-black font-logo tracking-widest uppercase mb-2">Candidates</p>
              <h3 className="text-5xl font-black text-white font-logo tracking-tighter">{options.length}</h3>
            </div>
            <div className="glass-dark p-10 rounded-[32px] border-l-4 border-l-zinc-700 flex items-center justify-between group">
              <div>
                <p className="text-zinc-500 text-[11px] font-black font-logo tracking-widest uppercase mb-2">System Status</p>
                <h3 className="text-2xl font-black text-emerald-500 font-logo tracking-tighter uppercase">ACTIVE</h3>
              </div>
              <button 
                onClick={onClearResponses}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-zinc-800 text-zinc-500 hover:bg-rose-600 hover:text-white transition-all group-hover:rotate-12"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>

          <div className="glass-dark p-10 rounded-[40px] shadow-2xl">
            <h3 className="text-xl font-black text-white font-logo tracking-widest mb-10 flex items-center gap-4 uppercase">
              <span className="w-1.5 h-6 bg-rose-600 rounded-full"></span>
              Main Chart Standings
            </h3>
            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statsData} layout="vertical" margin={{ left: 60, right: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#1a1a1a" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="optionLabel" 
                    type="category" 
                    width={140} 
                    tick={{ fontSize: 13, fill: '#888', fontWeight: 'bold' }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(225,29,72,0.05)'}}
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #e11d48', borderRadius: '16px', color: '#fff' }}
                  />
                  <Bar dataKey="totalPoints" fill="#e11d48" radius={[0, 12, 12, 0]} name="Power Score" barSize={36}>
                    {statsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#e11d48' : index < 4 ? '#9f1239' : '#333'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-dark rounded-[40px] overflow-hidden">
             <div className="p-10 border-b border-rose-900/10">
                <h3 className="text-xl font-black text-white font-logo tracking-widest uppercase">Detailed Distribution</h3>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead className="bg-white/5 text-rose-500 text-[11px] font-black font-logo uppercase tracking-widest">
                   <tr>
                     <th className="px-10 py-6">Candidate Voice</th>
                     <th className="px-6 py-6 text-center">1st</th>
                     <th className="px-6 py-6 text-center">2nd</th>
                     <th className="px-6 py-6 text-center">3rd</th>
                     <th className="px-6 py-6 text-center">4th</th>
                     <th className="px-6 py-6 text-center">5th</th>
                     <th className="px-10 py-6 text-center bg-rose-600/10">Score</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {statsData.map((item, idx) => (
                     <tr key={idx} className="hover:bg-rose-500/[0.03] transition-colors group">
                       <td className="px-10 py-6 font-bold text-zinc-300 group-hover:text-white transition-colors">
                         {idx + 1}. {item.optionLabel}
                         {idx < 4 && <span className="ml-3 text-[10px] bg-rose-600/20 text-rose-500 px-2 py-0.5 rounded font-black tracking-widest uppercase">Awakened</span>}
                       </td>
                       <td className="px-6 py-6 text-center text-zinc-500 font-bold">{item.first}</td>
                       <td className="px-6 py-6 text-center text-zinc-500 font-bold">{item.second}</td>
                       <td className="px-6 py-6 text-center text-zinc-500 font-bold">{item.third}</td>
                       <td className="px-6 py-6 text-center text-zinc-500 font-bold">{item.fourth}</td>
                       <td className="px-6 py-6 text-center text-zinc-500 font-bold">{item.fifth}</td>
                       <td className="px-10 py-6 text-center font-black bg-rose-600/5 text-rose-600 font-logo">{item.totalPoints}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      ) : (
        <div className="glass-dark rounded-[40px] p-12 max-w-3xl mx-auto animate-in slide-in-from-bottom-6 duration-700">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-2 h-8 bg-rose-600 rounded-full"></div>
            <h3 className="text-2xl font-black text-white font-logo uppercase tracking-widest">Candidate Registration</h3>
          </div>
          
          <form onSubmit={handleAddOption} className="flex gap-4 mb-12">
            <input 
              type="text" 
              placeholder="ENTER CANDIDATE NAME/ALIAS..."
              value={newOptionLabel}
              onChange={(e) => setNewOptionLabel(e.target.value)}
              className="flex-1 px-8 py-5 bg-black border border-rose-900/30 rounded-[20px] text-white font-bold focus:ring-2 focus:ring-rose-600 focus:border-rose-600 outline-none transition-all placeholder:text-zinc-700"
            />
            <button 
              type="submit"
              className="px-10 py-5 bg-rose-600 text-white font-logo font-black rounded-[20px] shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:bg-rose-500 transition-all uppercase text-sm"
            >
              Add
            </button>
          </form>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-2 mb-6">
              <h4 className="text-[11px] font-black font-logo text-zinc-500 uppercase tracking-[0.3em]">Registered Participants ({options.length})</h4>
              <div className="h-[1px] flex-1 bg-rose-900/20 mx-6"></div>
            </div>
            {options.map((option) => (
              <div key={option.id} className="flex items-center justify-between p-6 bg-white/[0.02] rounded-[24px] group border border-transparent hover:border-rose-900/30 hover:bg-rose-950/20 transition-all">
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-700 font-black font-logo text-xs group-hover:text-rose-500 transition-colors">
                    VOX
                  </div>
                  <span className="text-xl font-bold text-zinc-400 group-hover:text-white transition-colors">{option.label}</span>
                </div>
                <button 
                  onClick={() => handleDeleteOption(option.id)}
                  className="p-3 text-zinc-700 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
