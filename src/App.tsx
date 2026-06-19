import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { Keyboard } from './components/Keyboard';
import { StatsModal } from './components/StatsModal';
import { HelpModal } from './components/HelpModal';
import { GameOverModal } from './components/GameOverModal';
import { Message } from './components/Message';
import { useGameStore } from './store/useGameStore';

const App: React.FC = () => {
  const { gameState } = useGameStore();

  useEffect(() => {
    document.title = 'Wordle - 猜词游戏';
  }, []);

  return (
    <div className="min-h-screen bg-[#121213] text-white flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-between px-4 py-4">
        <Board />
        <Keyboard />
      </main>

      <StatsModal />
      <HelpModal />
      <GameOverModal />
      <Message />

      <footer className="text-center py-4 text-xs text-gray-500">
        <p>
          今天的单词 · {gameState.targetWord.length}个字母
        </p>
      </footer>
    </div>
  );
};

export default App;
