import React, { useState } from 'react';
import { UserState, AppSettings } from '../types';

interface TasksPageProps {
  state: UserState;
  settings: AppSettings;
  onComplete: (taskId: string, reward: number) => void;
}

const TasksPage: React.FC<TasksPageProps> = ({ state, settings, onComplete }) => {
  const [loadingTask, setLoadingTask] = useState<string | null>(null);

  const showAd = async (): Promise<boolean> => {
    if (!(window as any).Adsgram) return true;
    try {
      const AdController = (window as any).Adsgram.init({ blockId: settings.adsgramBlockId });
      const result = await AdController.show();
      return result.done === true;
    } catch (e) {
      console.error("Task Ad failed:", e);
      return false;
    }
  };

  const simulateTask = async (id: string, reward: number, type: 'ad' | 'social') => {
    if (state.completedTasks.includes(id)) return;
    
    setLoadingTask(id);
    
    let success = false;
    if (type === 'ad') {
      success = await showAd();
    } else {
      await new Promise(resolve => setTimeout(resolve, 3000));
      success = true;
    }

    if (success) {
      onComplete(id, reward);
    } else {
      alert("Task could not be completed.");
    }
    
    setLoadingTask(null);
  };

  return (
    <div className="flex flex-col gap-6 py-4 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Daily Tasks</h2>
        <p className="text-slate-400 text-sm mt-1">Complete tasks to earn TON</p>
      </div>

      <div className="space-y-4">
        {settings.tasks.map(task => {
          const isCompleted = state.completedTasks.includes(task.id);
          const isLoading = loadingTask === task.id;

          return (
            <div key={task.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex justify-between items-center group hover:border-blue-500/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isCompleted ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-100">{task.title}</h4>
                  <p className="text-xs text-green-400 font-mono">+{task.reward.toFixed(8)} TON</p>
                </div>
              </div>

              <button
                disabled={isCompleted || !!loadingTask}
                onClick={() => simulateTask(task.id, task.reward, task.type)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  isCompleted 
                    ? 'bg-slate-800 text-slate-500 cursor-default' 
                    : isLoading
                      ? 'bg-slate-700 text-slate-400 cursor-wait'
                      : 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-105 active:scale-95'
                }`}
              >
                {isCompleted ? 'Done' : isLoading ? 'Viewing...' : 'Start'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-900/20 border border-blue-800/50 p-4 rounded-2xl text-center text-sm text-blue-300">
        Tasks are refreshed periodically. Make sure to complete them all!
      </div>
    </div>
  );
};

export default TasksPage;