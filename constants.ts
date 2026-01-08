
export const DEFAULT_SETTINGS = {
  miningRatePerSession: 5.0, // الربح لكل جلسة بالدوج
  sessionDurationMs: 4 * 60 * 60 * 1000, // 4 ساعات
  referralCommission: 10, // 10%
  minWithdrawal: 100.0, // الحد الأدنى 100 دوج
  dailyGiftAmount: 1.0,
  adsgramBlockId: '3946',
  adminBotToken: '',
  adminChatId: '',
  adminPassword: '123',
  tasks: [
    { id: 't1', title: 'Follow Doge on X', reward: 2.0, type: 'social' },
    { id: 't2', title: 'Watch Reward Video', reward: 1.5, type: 'ad' }
  ]
};

export const DAY_IN_MS = 24 * 60 * 60 * 1000;
