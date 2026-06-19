import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Modal } from './Modal';

export const StatsModal: React.FC = () => {
  const { statistics, showStats, setShowStats } = useGameStore();

  const winRate = statistics.gamesPlayed > 0
    ? Math.round((statistics.gamesWon / statistics.gamesPlayed) * 100)
    : 0;

  const maxDistribution = Math.max(...statistics.guessDistribution, 1);

  return (
    <Modal
      isOpen={showStats}
      onClose={() => setShowStats(false)}
      title="统计数据"
    >
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {statistics.gamesPlayed}
          </div>
          <div className="text-xs text-gray-400">游戏场次</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {winRate}%
          </div>
          <div className="text-xs text-gray-400">胜率</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {statistics.currentStreak}
          </div>
          <div className="text-xs text-gray-400">当前连胜</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {statistics.maxStreak}
          </div>
          <div className="text-xs text-gray-400">最高连胜</div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-white mb-3">猜测分布</h3>
      <div className="space-y-2">
        {statistics.guessDistribution.map((count, index) => {
          const percentage = (count / maxDistribution) * 100;
          return (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm text-gray-300 w-4">{index + 1}</span>
              <div className="flex-1 h-6 bg-gray-800 rounded overflow-hidden">
                <div
                  className="h-full bg-correct transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: `${percentage}%`, minWidth: count > 0 ? '24px' : '0px' }}
                >
                  <span className="text-xs font-bold text-white">
                    {count}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
