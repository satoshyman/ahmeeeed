import React, { useState, useMemo } from 'react';
import { AppSettings, WithdrawalRecord, Task } from '../types';

interface AdminDashboardProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  withdrawals: WithdrawalRecord[];
  onUpdateWithdrawal: (id: string, status: WithdrawalRecord['status']) => void;
  onClose: () => void;
}

const MOCK_MEMBERS = [
  { id: 'USER_7712', name: 'Alex Johnson', balance: 4.5201, referrals: 12, joined: '2024-05-01' },
  { id: 'USER_8823', name: 'Sarah Miller', balance: 0.1200, referrals: 2, joined: '2024-05-03' },
  { id: 'USER_9941', name: 'Michael Chen', balance: 12.880, referrals: 145, joined: '2024-04-28' },
  { id: 'USER_1102', name: 'Laila Hassan', balance: 1.0500, referrals: 5, joined: '2024-05-10' },
  { id: 'USER_4456', name: 'Yasin Omar', balance: 0.0000, referrals: 0, joined: '2024-05-15' },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ settings, onSaveSettings, withdrawals, onUpdateWithdrawal, onClose }) => {
  const [activeTab, setActiveTab] = useState<'finance' | 'tasks' | 'withdrawals' | 'members' | 'stats'>('finance');
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSaveAll = () => {
    onSaveSettings(localSettings);
    alert('✅ Settings saved successfully.');
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setLocalSettings(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  };

  const addNewTask = () => {
    const newTask: Task = {
      id: 'task_' + Math.random().toString(36).substring(7),
      title: 'New Ad Task',
      reward: 0.0005,
      type: 'ad'
    };
    setLocalSettings(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  };

  const deleteTask = (id: string) => {
    setLocalSettings(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  };

  const filteredMembers = useMemo(() => {
    return MOCK_MEMBERS.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredWithdrawals = useMemo(() => {
    return withdrawals.filter(w => 
      w.id.includes(searchQuery.toUpperCase()) || 
      w.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [withdrawals, searchQuery]);

  return (
    <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col p-4 overflow-hidden animate-fadeIn font-['Cairo'] text-left" dir="ltr">
      <div className="flex justify-between items-center mb-6 bg-slate-900 p-4 rounded-[2rem] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-black text-white leading-none mb-1">Admin Dashboard</h2>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Master Control Panel</p>
          </div>
        </div>
        <button onClick={onClose} className="p-3 bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all active:scale-90">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
        <TabItem active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} label="Finance" />
        <TabItem active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} label="Tasks" />
        <TabItem active={activeTab === 'withdrawals'} onClick={() => setActiveTab('withdrawals')} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>} label="Withdrawals" />
        <TabItem active={activeTab === 'members'} onClick={() => setActiveTab('members')} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} label="Members" />
        <TabItem active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>} label="Stats" />
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pb-24">
        {activeTab === 'finance' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest px-2">Global Rates & Timing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminInput label="Session Rate (TON)" type="number" value={localSettings.miningRatePerSession} onChange={(v) => setLocalSettings({...localSettings, miningRatePerSession: parseFloat(v)})} />
              <AdminInput label="Session Duration (min)" type="number" value={localSettings.sessionDurationMs / 60000} onChange={(v) => setLocalSettings({...localSettings, sessionDurationMs: parseFloat(v) * 60000})} />
              <AdminInput label="Min Withdrawal (TON)" type="number" value={localSettings.minWithdrawal} onChange={(v) => setLocalSettings({...localSettings, minWithdrawal: parseFloat(v)})} />
              <AdminInput label="Referral Commission (%)" type="number" value={localSettings.referralCommission} onChange={(v) => setLocalSettings({...localSettings, referralCommission: parseFloat(v)})} />
              <AdminInput label="Daily Gift (TON)" type="number" value={localSettings.dailyGiftAmount} onChange={(v) => setLocalSettings({...localSettings, dailyGiftAmount: parseFloat(v)})} />
              <AdminInput label="Adsgram Block ID" type="text" value={localSettings.adsgramBlockId} onChange={(v) => setLocalSettings({...localSettings, adsgramBlockId: v})} />
            </div>
            
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-[2rem] space-y-4">
              <h4 className="text-xs font-black text-blue-400 uppercase tracking-wider">Telegram Admin Notifications</h4>
              <AdminInput label="Bot Token" type="text" value={localSettings.adminBotToken} onChange={(v) => setLocalSettings({...localSettings, adminBotToken: v})} placeholder="12345:ABC-..." />
              <AdminInput label="Admin Chat ID" type="text" value={localSettings.adminChatId} onChange={(v) => setLocalSettings({...localSettings, adminChatId: v})} placeholder="123456789" />
            </div>

            <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-[2rem]">
              <h4 className="text-xs font-black text-red-500 uppercase tracking-wider mb-3">Security</h4>
              <AdminInput label="Admin Dashboard PIN" type="text" value={localSettings.adminPassword || ''} onChange={(v) => setLocalSettings({...localSettings, adminPassword: v})} />
            </div>

            <button onClick={handleSaveAll} className="w-full py-5 bg-blue-600 rounded-[2rem] font-black text-white shadow-xl shadow-blue-500/20 active:scale-95 transition-all mt-4">SAVE CHANGES</button>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Manage Tasks</h3>
              <button onClick={addNewTask} className="px-4 py-2 bg-blue-600 rounded-xl text-xs font-black">+ Add Task</button>
            </div>
            
            <div className="space-y-3">
              {localSettings.tasks.map(task => (
                <div key={task.id} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <input 
                      className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:border-blue-500 outline-none flex-1 mr-4"
                      value={task.title}
                      onChange={(e) => updateTask(task.id, { title: e.target.value })}
                    />
                    <button onClick={() => deleteTask(task.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 px-1 font-bold">Reward (TON)</label>
                      <input 
                        type="number"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-green-400 font-mono"
                        value={task.reward}
                        onChange={(e) => updateTask(task.id, { reward: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 px-1 font-bold">Type</label>
                      <select 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-blue-400 font-bold"
                        value={task.type}
                        onChange={(e) => updateTask(task.id, { type: e.target.value as 'ad' | 'social' })}
                      >
                        <option value="ad">Adsgram Ad</option>
                        <option value="social">Social Link</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleSaveAll} className="w-full py-5 bg-blue-600 rounded-[2rem] font-black text-white shadow-xl shadow-blue-500/20 active:scale-95 transition-all mt-4">UPDATE TASKS</button>
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="relative px-2">
              <input 
                type="text" 
                placeholder="Search by ID or Wallet..."
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-xs focus:border-blue-500 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>

            <div className="space-y-3">
              {filteredWithdrawals.map(w => (
                <div key={w.id} className="bg-slate-900 border border-slate-800 p-5 rounded-[2rem] space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] text-slate-500 font-black uppercase mb-1 block">Ref: {w.id}</span>
                      <p className="text-xl font-black text-white">{w.amount.toFixed(4)} <span className="text-xs font-bold text-slate-500">TON</span></p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black border ${
                      w.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                      w.status === 'Completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                      'bg-red-500/10 text-red-500 border-red-500/20'
                    }`}>
                      {w.status === 'Processing' ? 'Pending' : w.status === 'Completed' ? 'Paid' : 'Rejected'}
                    </div>
                  </div>
                  
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[9px] text-blue-400 break-all">
                    {w.address}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => onUpdateWithdrawal(w.id, 'Completed')}
                      className="py-2.5 rounded-xl bg-green-600/20 text-green-500 text-xs font-black border border-green-500/20 hover:bg-green-600 hover:text-white transition-all"
                    >
                      Confirm Payment
                    </button>
                    <button 
                      onClick={() => onUpdateWithdrawal(w.id, 'Rejected')}
                      className="py-2.5 rounded-xl bg-red-600/20 text-red-500 text-xs font-black border border-red-500/20 hover:bg-red-600 hover:text-white transition-all"
                    >
                      Reject Request
                    </button>
                  </div>
                </div>
              ))}
              {filteredWithdrawals.length === 0 && (
                <div className="text-center py-20 text-slate-600">No requests match your search</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="relative px-2">
              <input 
                type="text" 
                placeholder="Search by name or ID..."
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-xs focus:border-blue-500 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              {filteredMembers.map(m => (
                <div key={m.id} className="bg-slate-900 border border-slate-800 p-5 rounded-[2rem] flex justify-between items-center group hover:border-blue-500/40 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center font-black text-blue-500 border border-slate-700">
                      {m.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-black text-white leading-none mb-1">{m.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono">ID: {m.id}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-green-400">{m.balance.toFixed(2)} TON</p>
                    <p className="text-[9px] text-slate-500 font-bold">{m.referrals} Referrals</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-2 gap-4 px-2">
              <SummaryCard label="Total Users" value="2,482" trend="+15%" />
              <SummaryCard label="Mining Now" value="842" trend="+5%" />
              <SummaryCard label="Total Paid" value="12,450 TON" trend="-2%" />
              <SummaryCard label="Pending Requests" value={withdrawals.filter(w => w.status === 'Processing').length.toString()} trend="Action Required" />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 space-y-6">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <div className="w-2 h-4 bg-blue-500 rounded-full"></div>
                Activity Analysis (24h)
              </h4>
              <StatProgress label="Mining Sessions" current={1420} target={2000} color="bg-blue-500" />
              <StatProgress label="Ads Watched" current={3840} target={5000} color="bg-cyan-400" />
              <StatProgress label="New Registrations" current={45} target={100} color="bg-green-500" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TabItem = ({ active, onClick, label, icon }: { active: boolean, onClick: () => void, label: string, icon: React.ReactNode }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all border whitespace-nowrap ${
      active 
      ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20' 
      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
    }`}
  >
    {icon}
    {label}
  </button>
);

const AdminInput = ({ label, type, value, onChange, placeholder }: { label: string, type: string, value: any, onChange: (v: string) => void, placeholder?: string }) => (
  <div className="space-y-1 bg-slate-950/40 p-3 rounded-2xl border border-slate-800">
    <label className="text-[10px] text-slate-500 px-1 font-black uppercase tracking-widest">{label}</label>
    <input 
      type={type} 
      step="any"
      value={value} 
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent text-sm font-bold text-blue-400 outline-none placeholder:text-slate-700" 
    />
  </div>
);

const SummaryCard = ({ label, value, trend }: { label: string, value: string, trend: string }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-sm relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <svg className="w-12 h-12 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
    </div>
    <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider mb-1">{label}</p>
    <p className="text-xl font-black text-white">{value}</p>
    <p className={`text-[9px] font-black mt-1 ${trend.includes('+') ? 'text-green-500' : 'text-blue-500'}`}>{trend}</p>
  </div>
);

const StatProgress = ({ label, current, target, color }: { label: string, current: number, target: number, color: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-[10px] font-black uppercase">
      <span className="text-slate-400 tracking-wider">{label}</span>
      <span className="text-white">{current} / {target}</span>
    </div>
    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-1000 ease-out`} style={{ width: `${(current/target)*100}%` }}></div>
    </div>
  </div>
);

export default AdminDashboard;