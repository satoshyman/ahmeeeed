
import React, { useState, useEffect, useCallback } from 'react';
import MiningPage from './components/MiningPage';
import TasksPage from './components/TasksPage';
import WalletPage from './components/WalletPage';
import ReferralPage from './components/ReferralPage';
import AdminDashboard from './components/AdminDashboard';
import { Page, UserState, WithdrawalRecord, AppSettings } from './types';
import { DEFAULT_SETTINGS } from './constants';

declare global {
  interface Window {
    Telegram: any;
    Adsgram: any;
  }
}

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Mining);
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [authPassword, setAuthPassword] = useState('');

  const [appSettings, setAppSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('doge_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [userState, setUserState] = useState<UserState>(() => {
    const defaultState: UserState = {
      balance: 0,
      miningStartTime: null,
      isMining: false,
      completedTasks: [],
      withdrawalAddress: '',
      referralsCount: 0,
      referralEarnings: 0,
      userId: Math.random().toString(36).substring(2, 9).toUpperCase(),
      username: 'Guest',
      withdrawalHistory: [],
      lastGiftClaimedTime: null,
      referredBy: null
    };
    const saved = localStorage.getItem('doge_user');
    return saved ? JSON.parse(saved) : defaultState;
  });

  useEffect(() => {
    localStorage.setItem('doge_settings', JSON.stringify(appSettings));
    localStorage.setItem('doge_user', JSON.stringify(userState));
  }, [appSettings, userState]);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.backgroundColor = '#020617';
      const tgUser = tg.initDataUnsafe?.user;
      if (tgUser) setUserState(prev => ({ ...prev, username: tgUser.first_name }));
    }
  }, []);

  const handleStartMining = () => setUserState(p => ({ ...p, isMining: true, miningStartTime: Date.now() }));
  
  const handleEndMining = useCallback(() => {
    setUserState(prev => {
      if (!prev.isMining) return prev;
      const reward = appSettings.miningRatePerSession;
      return {
        ...prev,
        isMining: false,
        miningStartTime: null,
        balance: prev.balance + reward
      };
    });
  }, [appSettings.miningRatePerSession]);

  const handleWithdraw = (amount: number, address: string) => {
    const record: WithdrawalRecord = {
      id: Math.random().toString(36).substring(2, 10).toUpperCase(),
      amount,
      address,
      status: 'Processing',
      timestamp: Date.now()
    };
    setUserState(p => ({
      ...p,
      balance: p.balance - amount,
      withdrawalHistory: [record, ...p.withdrawalHistory]
    }));
  };

  const handleClaimGift = () => {
    setUserState(p => ({
      ...p,
      balance: p.balance + appSettings.dailyGiftAmount,
      lastGiftClaimedTime: Date.now()
    }));
  };

  const handleLogoClick = () => {
    setAdminClickCount(p => {
      if (p + 1 === 8) { setShowAdminAuth(true); return 0; }
      return p + 1;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-white font-['Cairo']" dir="rtl">
      <header className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
          <img src="https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=040" className="w-8 h-8" alt="D" />
          <span className="font-black text-lg text-yellow-500 tracking-tighter">DOGE MINER</span>
        </div>
        <div className="bg-slate-800 px-4 py-1.5 rounded-full text-yellow-500 text-sm font-black border border-yellow-500/20">
          {userState.balance.toFixed(4)} <span className="text-[10px]">DOGE</span>
        </div>
      </header>

      {showAdminAuth && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] w-full max-w-sm border border-slate-800 shadow-2xl">
            <h3 className="text-xl font-black text-center mb-6">Admin Panel</h3>
            <input 
              type="password" 
              placeholder="Password" 
              value={authPassword} 
              onChange={(e) => setAuthPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-4 text-center text-xl text-yellow-500 mb-4 outline-none"
            />
            <button 
              onClick={() => { if(authPassword === appSettings.adminPassword) { setCurrentPage(Page.Admin); setShowAdminAuth(false); } }}
              className="w-full py-4 bg-yellow-600 rounded-2xl font-black"
            >
              Login
            </button>
            <button onClick={() => setShowAdminAuth(false)} className="w-full py-2 text-slate-500 text-sm mt-2">Close</button>
          </div>
        </div>
      )}

      <main className="flex-1 px-4 overflow-y-auto pb-24">
        {currentPage === Page.Mining && <MiningPage state={userState} settings={appSettings} onStart={handleStartMining} onEnd={handleEndMining} onClaimGift={handleClaimGift} />}
        {currentPage === Page.Tasks && <TasksPage state={userState} settings={appSettings} onComplete={(id, rew) => setUserState(p => ({...p, balance: p.balance + rew, completedTasks: [...p.completedTasks, id]}))} />}
        {currentPage === Page.Referrals && <ReferralPage state={userState} settings={appSettings} />}
        {currentPage === Page.Wallet && <WalletPage state={userState} settings={appSettings} onUpdateAddress={(a) => setUserState(p => ({...p, withdrawalAddress: a}))} onWithdraw={handleWithdraw} />}
        {currentPage === Page.Admin && <AdminDashboard settings={appSettings} onSaveSettings={setAppSettings} withdrawals={userState.withdrawalHistory} onUpdateWithdrawal={(id, s) => setUserState(p => ({...p, withdrawalHistory: p.withdrawalHistory.map(w => w.id === id ? {...w, status: s} : w)}))} onClose={() => setCurrentPage(Page.Mining)} />}
      </main>

      {currentPage !== Page.Admin && (
        <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex justify-around p-3 z-50">
          <NavBtn active={currentPage === Page.Mining} label="التعدين" icon="⛏️" onClick={() => setCurrentPage(Page.Mining)} />
          <NavBtn active={currentPage === Page.Tasks} label="المهام" icon="📋" onClick={() => setCurrentPage(Page.Tasks)} />
          <NavBtn active={currentPage === Page.Referrals} label="الأصدقاء" icon="👥" onClick={() => setCurrentPage(Page.Referrals)} />
          <NavBtn active={currentPage === Page.Wallet} label="المحفظة" icon="💰" onClick={() => setCurrentPage(Page.Wallet)} />
        </nav>
      )}
    </div>
  );
};

const NavBtn = ({ active, label, icon, onClick }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 flex-1 transition-all ${active ? 'text-yellow-500 scale-110' : 'text-slate-500'}`}>
    <span className="text-xl">{icon}</span>
    <span className="text-[10px] font-black">{label}</span>
  </button>
);

export default App;
