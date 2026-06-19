import React, { useState, useEffect } from 'react';
import { Share2 } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { Modal } from './Modal';
import { generateShareText, copyToClipboard } from '../utils/shareUtils';

export const GameOverModal: React.FC = () => {
  const {
    gameState,
    showGameOver,
    setShowGameOver,
    setMessage,
  } = useGameStore();

  const [countdown, setCountdown] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (showGameOver && gameState.gameStatus === 'won') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const updateCountdown = () => {
        const now = new Date();
        const diff = tomorrow.getTime() - now.getTime();
        
        if (diff <= 0) {
          setCountdown(0);
          return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        setCountdown(diff);
      };
      
      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [showGameOver, gameState.gameStatus]);

  const formatCountdown = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleShare = async () => {
    const shareText = generateShareText(
      gameState.guesses,
      gameState.gameStatus as 'won' | 'lost'
    );

    const success = await copyToClipboard(shareText);
    if (success) {
      setCopied(true);
      setMessage('结果已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } else {
      setMessage('复制失败，请手动复制');
    }
  };

  if (gameState.gameStatus === 'playing') return null;

  const isWon = gameState.gameStatus === 'won';

  return (
    <Modal
      isOpen={showGameOver}
      onClose={() => setShowGameOver(false)}
      title={isWon ? '🎉 恭喜获胜！' : '😢 游戏结束'}
    >
      <div className="text-center">
        <div className="mb-4">
          <p className="text-gray-300 mb-2">正确答案是</p>
          <p className="text-3xl font-bold uppercase tracking-widest text-correct">
            {gameState.targetWord}
          </p>
        </div>

        {isWon && (
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-1">下次挑战</p>
            <p className="text-2xl font-mono text-white">
              {formatCountdown(countdown)}
            </p>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-400 mb-2">你的成绩</p>
          <p className="text-xl font-bold text-white">
            {isWon
              ? `第 ${gameState.guesses.length} 次猜中！`
              : `已用完所有机会`}
          </p>
        </div>

        <button
          onClick={handleShare}
          className="w-full py-3 px-4 bg-correct hover:bg-correct/90 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Share2 className="w-5 h-5" />
          {copied ? '已复制！' : '分享结果'}
        </button>
      </div>
    </Modal>
  );
};
