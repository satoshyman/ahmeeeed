
import React, { useState, useEffect } from 'react';
import { UserState, AppSettings } from '../types';

interface MiningPageProps {
  state: UserState;
  settings: AppSettings;
  onStart: () => void;
  onEnd: () => void;
  onClaimGift: () => void;
}

const MiningPage: React.FC<MiningPageProps> = ({ state, settings, onStart, onEnd, onClaimGift }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [curEarnings, setCurEarnings] = useState(0);
  const [giftTime, setGiftTime] = useState(0);

  useEffect(() => {
    let interval: any;
    if (state.isMining && state.miningStartTime) {
      interval = setInterval(() => {
        const elapsed = Date.now() - state.miningStartTime!;
        const rem = settings.sessionDurationMs - elapsed;
        if (rem <= 0) {
          onEnd();
          setTimeLeft(0);
        } else {
          setTimeLeft(rem);
          setCurEarnings((elapsed / settings.sessionDurationMs) * settings.miningRatePerSession);
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [state.isMining, state.miningStartTime, settings]);

  useEffect(() => {
    const itv = setInterval(() => {
      const rem = 86400000 - (Date.now() - (state.lastGiftClaimedTime || 0));
      setGiftTime(rem > 0 ? rem : 0);
    }, 1000);
    return () => clearInterval(itv);
  }, [state.lastGiftClaimedTime]);

  const formatTime = (ms: number) => {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = state.isMining ? ((settings.sessionDurationMs - timeLeft) / settings.sessionDurationMs) * 100 : 0;

  return (
    <div className="flex flex-col items-center gap-6 py-4 animate-fadeIn" dir="rtl">
      {/* Gift Box Section */}
      <div className="w-full flex justify-between items-center bg-slate-900/50 p-4 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-yellow-500/10 rounded-2xl text-yellow-500">🎁</div>
          <div>
            <p className="text-[10px] font-black text-slate-500">الهدية اليومية</p>
            <p className="text-sm font-black text-white">+{settings.dailyGiftAmount} DOGE</p>
          </div>
        </div>
        <button 
          onClick={onClaimGift}
          disabled={giftTime > 0}
          className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${giftTime > 0 ? 'bg-slate-800 text-slate-500' : 'bg-yellow-600 text-white animate-pulse'}`}
        >
          {giftTime > 0 ? formatTime(giftTime) : 'استلام'}
        </button>
      </div>

      {/* Main Mining Circle */}
      <div className="relative w-72 h-72 flex items-center justify-center">
        <svg className="absolute inset-0 transform -rotate-90 w-full h-full">
          <circle cx="50%" cy="50%" r="45%" fill="transparent" stroke="#1e293b" strokeWidth="12" />
          <circle 
            cx="50%" cy="50%" r="45%" 
            fill="transparent" stroke="#eab308" strokeWidth="14" 
            strokeDasharray="100 100" strokeDashoffset={100 - progress}
            pathLength="100" strokeLinecap="round" className="transition-all duration-1000"
          />
        </svg>

        {state.isMining && (
          <div className="absolute inset-0 rounded-full border-2 border-yellow-500/20 animate-ping"></div>
        )}

        <div className={`relative w-52 h-52 rounded-full bg-slate-950 border-4 flex flex-col items-center justify-center transition-all ${state.isMining ? 'border-yellow-500 shadow-[0_0_40px_rgba(234,179,8,0.2)]' : 'border-slate-800'}`}>
          <img src="https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=040" className={`w-24 h-24 mb-2 ${state.isMining ? 'animate-bounce' : 'grayscale opacity-20'}`} alt="DOGE" />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{state.isMining ? 'تعدين نشط' : 'متوقف'}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="w-full grid grid-cols-2 gap-4">
        <div className="bg-slate-900 p-5 rounded-[2rem] border border-slate-800 flex flex-col items-center">
          <span className="text-[10px] font-black text-slate-500 mb-1">أرباح الجلسة</span>
          <p className="text-xl font-black text-white font-mono">{curEarnings.toFixed(4)}</p>
          <span className="text-[8px] text-yellow-500">DOGE</span>
        </div>
        <div className="bg-slate-900 p-5 rounded-[2rem] border border-slate-800 flex flex-col items-center">
          <span className="text-[10px] font-black text-slate-500 mb-1">الوقت المتبقي</span>
          <p className="text-xl font-black text-white font-mono">{formatTime(state.isMining ? timeLeft : settings.sessionDurationMs)}</p>
          <span className="text-[8px] text-blue-500">LIVE</span>
        </div>
      </div>

      <button 
        onClick={onStart} 
        disabled={state.isMining}
        className={`w-full py-5 rounded-[2rem] text-lg font-black shadow-xl transition-all ${state.isMining ? 'bg-slate-800 text-slate-500' : 'bg-yellow-600 text-white active:scale-95 shadow-yellow-600/20'}`}
      >
        {state.isMining ? 'جاري التعدين السحابي...' : 'ابدأ جلسة التعدين'}
      </button>
    </div>
  );
};

export default MiningPage;
