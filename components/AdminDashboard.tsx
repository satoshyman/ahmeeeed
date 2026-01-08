
import React, { useState, useMemo } from 'react';
import { AppSettings, WithdrawalRecord, Task } from '../types';

interface AdminDashboardProps {
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  withdrawals: WithdrawalRecord[];
  onUpdateWithdrawal: (id: string, status: WithdrawalRecord['status']) => void;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ settings, onSaveSettings, withdrawals, onUpdateWithdrawal, onClose }) => {
  const [activeTab, setActiveTab] = useState<'finance' | 'tasks' | 'withdrawals' | 'stats'>('finance');
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSaveAll = () => {
    onSaveSettings(localSettings);
    alert('✅ تم حفظ الإعدادات بنجاح');
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
      title: 'مهمة إعلان جديدة',
      reward: 1.0,
      type: 'ad'
    };
    setLocalSettings(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  };

  const deleteTask = (id: string) => {
    setLocalSettings(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  };

  const filteredWithdrawals = useMemo(() => {
    return withdrawals.filter(w => 
      w.id.includes(searchQuery.toUpperCase()) || 
      w.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [withdrawals, searchQuery]);

  return (
    <div className="fixed inset-0 bg-slate-950 z-[200] flex flex-col p-4 overflow-hidden animate-fadeIn" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-slate-900 p-4 rounded-[2rem] border border-slate-800 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><circle cx="12" cy="12" r="3" /></svg>
          </div>
          <div>
            <h2 className="text-xl font-black text-white leading-none mb-1">لوحة التحكم</h2>
            <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest">إدارة النظام المركزية</p>
          </div>
        </div>
        <button onClick={onClose} className="p-3 bg-slate-800 rounded-2xl text-slate-400 active:scale-90 transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar pb-2">
        <TabItem active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} label="المالية" />
        <TabItem active={activeTab === 'tasks'} onClick={() => setActiveTab('tasks')} label="المهام" />
        <TabItem active={activeTab === 'withdrawals'} onClick={() => setActiveTab('withdrawals')} label="السحوبات" />
        <TabItem active={activeTab === 'stats'} onClick={() => setActiveTab('stats')} label="الإحصائيات" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-24 px-1">
        {activeTab === 'finance' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">معدلات الأرباح والتوقيت</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminInput label="ربح الجلسة (DOGE)" type="number" value={localSettings.miningRatePerSession} onChange={(v) => setLocalSettings({...localSettings, miningRatePerSession: parseFloat(v)})} />
              <AdminInput label="مدة الجلسة (دقائق)" type="number" value={localSettings.sessionDurationMs / 60000} onChange={(v) => setLocalSettings({...localSettings, sessionDurationMs: parseFloat(v) * 60000})} />
              <AdminInput label="الحد الأدنى للسحب (DOGE)" type="number" value={localSettings.minWithdrawal} onChange={(v) => setLocalSettings({...localSettings, minWithdrawal: parseFloat(v)})} />
              <AdminInput label="عمولة الإحالة (%)" type="number" value={localSettings.referralCommission} onChange={(v) => setLocalSettings({...localSettings, referralCommission: parseFloat(v)})} />
              <AdminInput label="الهدية اليومية (DOGE)" type="number" value={localSettings.dailyGiftAmount} onChange={(v) => setLocalSettings({...localSettings, dailyGiftAmount: parseFloat(v)})} />
              <AdminInput label="معرف إعلانات Adsgram" type="text" value={localSettings.adsgramBlockId} onChange={(v) => setLocalSettings({...localSettings, adsgramBlockId: v})} />
            </div>
            
            <div className="bg-red-500/5 border border-red-500/20 p-5 rounded-[2rem] mt-4">
              <h4 className="text-xs font-black text-red-500 uppercase mb-3 tracking-wider">الأمان</h4>
              <AdminInput label="رمز دخول لوحة الإدارة" type="text" value={localSettings.adminPassword || ''} onChange={(v) => setLocalSettings({...localSettings, adminPassword: v})} />
            </div>

            <button onClick={handleSaveAll} className="w-full py-5 bg-yellow-600 rounded-[2rem] font-black text-white shadow-xl shadow-yellow-600/20 active:scale-95 transition-all mt-4">حفظ كافة التغييرات</button>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xs font-black text-slate-500 uppercase">إدارة المهام</h3>
              <button onClick={addNewTask} className="px-4 py-2 bg-yellow-600 rounded-xl text-xs font-black">+ مهمة جديدة</button>
            </div>
            
            <div className="space-y-3">
              {localSettings.tasks.map(task => (
                <div key={task.id} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center">
                    <input className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white flex-1 ml-4" value={task.title} onChange={(e) => updateTask(task.id, { title: e.target.value })} />
                    <button onClick={() => deleteTask(task.id)} className="p-2 text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <AdminInput label="الجائزة (DOGE)" type="number" value={task.reward} onChange={(v) => updateTask(task.id, { reward: parseFloat(v) })} />
                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col">
                      <label className="text-[10px] text-slate-500 font-black mb-1">النوع</label>
                      <select className="bg-transparent text-yellow-500 font-bold outline-none text-xs" value={task.type} onChange={(e) => updateTask(task.id, { type: e.target.value as 'ad' | 'social' })}>
                        <option value="ad">إعلان Adsgram</option>
                        <option value="social">رابط خارجي</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleSaveAll} className="w-full py-5 bg-yellow-600 rounded-[2rem] font-black text-white active:scale-95 transition-all">تحديث المهام</button>
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <div className="space-y-4 animate-fadeIn">
            <input type="text" placeholder="ابحث عن محفظة أو معرف..." className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 text-sm focus:border-yellow-500 outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <div className="space-y-3">
              {filteredWithdrawals.map(w => (
                <div key={w.id} className="bg-slate-900 border border-slate-800 p-5 rounded-[2rem] space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[8px] text-slate-500 font-black">ID: {w.id}</span>
                      <p className="text-xl font-black text-white">{w.amount} <span className="text-xs text-yellow-500">DOGE</span></p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black ${w.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-500' : w.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{w.status}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[9px] text-blue-400 break-all" dir="ltr">{w.address}</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => onUpdateWithdrawal(w.id, 'Completed')} className="py-2.5 rounded-xl bg-green-600 text-white text-xs font-black">تأكيد الدفع</button>
                    <button onClick={() => onUpdateWithdrawal(w.id, 'Rejected')} className="py-2.5 rounded-xl bg-red-600 text-white text-xs font-black">رفض</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4 animate-fadeIn text-center py-10">
            <h3 className="text-slate-500 font-black">إحصائيات النظام</h3>
            <p className="text-xs text-slate-600">سيتم عرض بيانات النمو هنا قريباً...</p>
          </div>
        )}
      </div>
    </div>
  );
};

const TabItem = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
  <button onClick={onClick} className={`px-6 py-3 rounded-2xl text-xs font-black transition-all border whitespace-nowrap ${active ? 'bg-yellow-600 text-white border-yellow-500 shadow-lg' : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'}`}>
    {label}
  </button>
);

const AdminInput = ({ label, type, value, onChange }: { label: string, type: string, value: any, onChange: (v: string) => void }) => (
  <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-800">
    <label className="text-[10px] text-slate-500 font-black block mb-1">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent text-sm font-bold text-yellow-500 outline-none" />
  </div>
);

export default AdminDashboard;
