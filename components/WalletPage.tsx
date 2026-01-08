
import React, { useState } from 'react';
import { UserState, AppSettings } from '../types';

interface WalletPageProps {
  state: UserState;
  settings: AppSettings;
  onUpdateAddress: (address: string) => void;
  onWithdraw: (amount: number, address: string) => void;
}

const WalletPage: React.FC<WalletPageProps> = ({ state, settings, onUpdateAddress, onWithdraw }) => {
  const [addr, setAddr] = useState(state.withdrawalAddress);
  const [val, setVal] = useState('');
  const fee = 2.0; // ثابت للدوج

  const handleWithdraw = () => {
    const amount = parseFloat(val);
    if (!addr || addr.length < 10) return alert('العنوان غير صحيح');
    if (isNaN(amount) || amount < settings.minWithdrawal) return alert(`الحد الأدنى ${settings.minWithdrawal} DOGE`);
    if (amount + fee > state.balance) return alert('رصيدك غير كافٍ');
    
    onWithdraw(amount, addr);
    setVal('');
  };

  return (
    <div className="flex flex-col gap-6 py-4 animate-fadeIn" dir="rtl">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <p className="text-xs font-black text-white/70 uppercase mb-2">الرصيد الكلي</p>
        <div className="flex items-baseline gap-2 relative z-10">
          <h2 className="text-5xl font-black text-white font-mono">{state.balance.toFixed(2)}</h2>
          <span className="text-xl font-bold text-white/50">DOGE</span>
        </div>
      </div>

      {/* Withdrawal Form */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] space-y-6">
        <h3 className="font-black text-sm text-yellow-500">طلب سحب جديد</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 mr-2 font-black">عنوان محفظة Dogecoin</label>
            <input 
              type="text" 
              value={addr} 
              onChange={(e) => { setAddr(e.target.value); onUpdateAddress(e.target.value); }}
              placeholder="D... العنوان"
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-5 text-yellow-500 font-mono text-xs outline-none focus:border-yellow-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-slate-500 mr-2 font-black">المبلغ المراد سحبه</label>
            <div className="relative">
              <input 
                type="number" 
                value={val} 
                onChange={(e) => setVal(e.target.value)}
                placeholder={`الأدنى ${settings.minWithdrawal}`}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-5 text-white font-mono text-lg outline-none focus:border-yellow-600"
              />
              <button 
                onClick={() => setVal((state.balance - fee).toFixed(2))}
                className="absolute left-3 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-yellow-600/20 text-yellow-500 text-[10px] font-black rounded-xl border border-yellow-500/20"
              >
                الكل
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 space-y-2 text-[10px] font-bold">
           <div className="flex justify-between text-slate-500"><span>رسوم الشبكة:</span><span className="text-orange-500">{fee} DOGE</span></div>
           <div className="flex justify-between text-white border-t border-slate-800 pt-2"><span>الإجمالي المخصوم:</span><span>{(parseFloat(val || '0') + fee).toFixed(2)} DOGE</span></div>
        </div>

        <button 
          onClick={handleWithdraw}
          className="w-full py-4 bg-yellow-600 text-white font-black text-lg rounded-2xl shadow-lg active:scale-95 transition-all"
        >
          تأكيد طلب السحب
        </button>
      </div>

      {/* History */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem]">
        <h3 className="font-black text-sm mb-4">سجل العمليات</h3>
        {state.withdrawalHistory.length === 0 ? (
          <p className="text-center py-10 text-slate-600 text-xs font-bold">لا توجد عمليات سحب سابقة</p>
        ) : (
          <div className="space-y-3">
            {state.withdrawalHistory.map(w => (
              <div key={w.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="font-black text-white">{w.amount} DOGE</p>
                  <p className="text-[8px] text-slate-600 truncate w-32 font-mono" dir="ltr">{w.address}</p>
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${w.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                  {w.status === 'Processing' ? 'قيد المراجعة' : 'مكتمل'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;
