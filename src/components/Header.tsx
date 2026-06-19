import React, { useState } from 'react';
import { BarChart3, HelpCircle, Share2, Globe } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { Language } from '../types';
import { getLanguageName } from '../utils/shareUtils';
import { generateShareText, copyToClipboard } from '../utils/shareUtils';

export const Header: React.FC = () => {
  const {
    gameState,
    statistics,
    setShowStats,
    setShowHelp,
    setLanguage,
    setMessage,
  } = useGameStore();

  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages: Language[] = ['en', 'es', 'pinyin'];

  const handleShare = async () => {
    if (gameState.gameStatus === 'playing') {
      setMessage('游戏结束后才能分享');
      return;
    }

    const shareText = generateShareText(
      gameState.guesses,
      gameState.gameStatus as 'won' | 'lost'
    );

    const success = await copyToClipboard(shareText);
    if (success) {
      setMessage('结果已复制到剪贴板');
    } else {
      setMessage('复制失败，请手动复制');
    }
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setShowLangMenu(false);
  };

  return (
    <header className="w-full border-b border-gray-700 py-3 px-4">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <button
          onClick={() => setShowHelp(true)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="帮助"
        >
          <HelpCircle className="w-6 h-6 text-gray-300" />
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowStats(true)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="统计"
          >
            <BarChart3 className="w-6 h-6 text-gray-300" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-1"
              aria-label="切换语言"
            >
              <Globe className="w-5 h-5 text-gray-300" />
              <span className="text-sm text-gray-300">
                {getLanguageName(gameState.language)}
              </span>
            </button>

            {showLangMenu && (
              <div className="absolute top-full right-0 mt-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-50 min-w-[140px]">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-700 transition-colors ${
                      gameState.language === lang ? 'bg-gray-700 text-white' : 'text-gray-300'
                    }`}
                  >
                    {getLanguageName(lang)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleShare}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="分享"
          >
            <Share2 className="w-6 h-6 text-gray-300" />
          </button>
        </div>
      </div>

      <div className="text-center mt-2">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-widest text-white">
          WORDLE
        </h1>
      </div>
    </header>
  );
};
