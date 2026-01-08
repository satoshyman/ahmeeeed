export interface WithdrawalRecord {
  id: string;
  amount: number;
  address: string;
  status: 'Processing' | 'Completed' | 'Rejected';
  timestamp: number;
}

export interface AppSettings {
  miningRatePerSession: number;
  sessionDurationMs: number;
  referralCommission: number;
  minWithdrawal: number;
  dailyGiftAmount: number;
  adsgramBlockId: string;
  adminBotToken: string;
  adminChatId: string;
  tasks: Task[];
  adminPassword?: string;
}

export interface UserState {
  balance: number;
  miningStartTime: number | null;
  isMining: boolean;
  completedTasks: string[];
  withdrawalAddress: string;
  referralsCount: number;
  referralEarnings: number;
  userId: string;
  username: string;
  withdrawalHistory: WithdrawalRecord[];
  lastGiftClaimedTime: number | null;
  referredBy: string | null;
}

export interface Task {
  id: string;
  title: string;
  reward: number;
  type: 'ad' | 'social';
}

export enum Page {
  Mining = 'mining',
  Tasks = 'tasks',
  Referrals = 'referrals',
  Wallet = 'wallet',
  Admin = 'admin'
}