
import React, { useState } from 'react';
import { UserState, AppSettings } from '../types';

const ReferralPage: React.FC<{state: UserState, settings: AppSettings}> = ({ state, settings }) => {
  const [copied, setCopied] = useState(false);
  const link = `https://t.me/share/url?url=https://t.me/your_bot?start=${state.userId}&text=DOGE_MINER`;

  const copy = () => {
    navigator.clipboard.writeText(`https://t.me/your_bot?start=${state.userId}`);
    setCopied(true); setTimeout(()=>setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6 py-6 animate-fadeIn">
      <div className="bg-yellow-600 rounded-[2.5rem] p-8 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-white/70 text-xs font-black uppercase mb-1">عمولة الإحالة</p>
          <h2 className="text-5xl font-black text-white">{settings.referralCommission}%</h2>
          <p className="text-white/60 text-[10px] font-bold mt-2">تربحها من كل جلسة تعدين يقوم بها أصدقاؤك</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#242424] p-4 rounded-3xl text-center border border-[#333]">
          <p className="text-xl">🔗</p>
          <p className="text-[10px] font-black mt-1">شارك</p>
        </div>
        <div className="bg-[#242424] p-4 rounded-3xl text-center border border-[#333]">
          <p className="text-xl">⛏️</p>
          <p className="text-[10px] font-black mt-1">عدن</p>
        </div>
        <div className="bg-[#242424] p-4 rounded-3xl text-center border border-[#333]">
          <p className="text-xl">💎</p>
          <p className="text-[10px] font-black mt-1">اربح</p>
        </div>
      </div>

      <div className="bg-[#242424] p-6 rounded-[2.5rem] border border-[#333] space-y-4">
        <p className="text-xs font-black text-slate-400">رابط الدعوة الخاص بك</p>
        <input readOnly value={`https://t.me/your_bot?start=${state.userId}`} className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl py-3 px-4 text-[10px] text-yellow-500 font-mono text-left" dir="ltr" />
        <div className="flex gap-2">
           <button onClick={()=>window.open(link)} className="flex-1 py-4 bg-yellow-600 rounded-2xl font-black text-sm">دعوة أصدقاء</button>
           <button onClick={copy} className="px-6 py-4 bg-[#333] rounded-2xl font-black text-sm">{copied ? '✅' : 'نسخ'}</button>
        </div>
      </div>

      <div className="bg-[#242424] p-6 rounded-[2.5rem] border border-[#333] flex justify-around text-center">
         <div><p className="text-slate-500 text-[10px] font-black">إجمالي الأصدقاء</p><p className="text-2xl font-black">{state.referralsCount}</p></div>
         <div className="w-[1px] bg-[#333]"></div>
         <div><p className="text-slate-500 text-[10px] font-black">أرباحي منهم</p><p className="text-2xl font-black text-green-500">{state.referralEarnings.toFixed(2)}</p></div>
      </div>
    </div>
  );
};

export default ReferralPage;
