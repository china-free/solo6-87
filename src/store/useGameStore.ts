import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  GameState,
  Statistics,
  Language,
  LetterStatus,
  GuessResult,
} from '../types';
import {
  getDailyWord,
  getDateString,
  isValidGuess,
  getWordLength,
} from '../utils/dailyWord';
import {
  calculateLetterStatus,
  mergeKeyStatus,
} from '../utils/wordleLogic';

interface GameStore {
  gameState: GameState;
  statistics: Statistics;
  message: string;
  showStats: boolean;
  showHelp: boolean;
  showGameOver: boolean;
  isAnimating: boolean;

  setLanguage: (language: Language) => void;
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  submitGuess: () => void;
  setShowStats: (show: boolean) => void;
  setShowHelp: (show: boolean) => void;
  setShowGameOver: (show: boolean) => void;
  resetGame: () => void;
  setMessage: (message: string, duration?: number) => void;
  clearMessage: () => void;
}

const getInitialGameState = (language: Language): GameState => {
  const targetWord = getDailyWord(language);
  return {
    targetWord,
    currentGuess: '',
    guesses: [],
    gameStatus: 'playing',
    language,
    keyStatus: {},
  };
};

const getInitialStatistics = (): Statistics => ({
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: [0, 0, 0, 0, 0, 0],
  lastPlayDate: '',
});

const today = getDateString();

const loadGameState = (language: Language): GameState => {
  const stored = localStorage.getItem(`wordle_game_${today}_${language}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return getInitialGameState(language);
    }
  }
  return getInitialGameState(language);
};

const savedLanguage = (localStorage.getItem('wordle_language') as Language) || 'en';
const initialGameState = loadGameState(savedLanguage);
const initialStats = (() => {
  const stored = localStorage.getItem('wordle_stats');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return getInitialStatistics();
    }
  }
  return getInitialStatistics();
})();

const saveGameState = (state: GameState) => {
  localStorage.setItem(
    `wordle_game_${getDateString()}_${state.language}`,
    JSON.stringify(state)
  );
};

const saveStatistics = (stats: Statistics) => {
  localStorage.setItem('wordle_stats', JSON.stringify(stats));
};

const saveLanguage = (language: Language) => {
  localStorage.setItem('wordle_language', language);
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      gameState: initialGameState,
      statistics: initialStats,
      message: '',
      showStats: false,
      showHelp: false,
      showGameOver: false,
      isAnimating: false,

      setLanguage: (language: Language) => {
        saveLanguage(language);
        const newState = loadGameState(language);
        set({
          gameState: newState,
          showGameOver: newState.gameStatus !== 'playing',
        });
      },

      addLetter: (letter: string) => {
        const { gameState, isAnimating } = get();
        if (isAnimating || gameState.gameStatus !== 'playing') return;

        const wordLength = getWordLength(gameState.language);
        if (gameState.currentGuess.length < wordLength) {
          const newState = {
            ...gameState,
            currentGuess: gameState.currentGuess + letter.toLowerCase(),
          };
          saveGameState(newState);
          set({ gameState: newState });
        }
      },

      removeLetter: () => {
        const { gameState, isAnimating } = get();
        if (isAnimating || gameState.gameStatus !== 'playing') return;

        if (gameState.currentGuess.length > 0) {
          const newState = {
            ...gameState,
            currentGuess: gameState.currentGuess.slice(0, -1),
          };
          saveGameState(newState);
          set({ gameState: newState });
        }
      },

      submitGuess: () => {
        const { gameState, statistics, isAnimating, setMessage } = get();
        if (isAnimating || gameState.gameStatus !== 'playing') return;

        const wordLength = getWordLength(gameState.language);
        if (gameState.currentGuess.length !== wordLength) {
          setMessage('单词长度不足');
          return;
        }

        if (!isValidGuess(gameState.currentGuess, gameState.language)) {
          setMessage('单词不在词库中');
          return;
        }

        set({ isAnimating: true });

        const cells = calculateLetterStatus(
          gameState.currentGuess,
          gameState.targetWord
        );
        const newGuess: GuessResult = { cells };
        const newGuesses = [...gameState.guesses, newGuess];
        const newKeyStatus = mergeKeyStatus(gameState.keyStatus, cells);

        const isWin = gameState.currentGuess.toLowerCase() === gameState.targetWord.toLowerCase();
        const isLose = !isWin && newGuesses.length >= 6;

        let newStatus: GameState['gameStatus'] = 'playing';
        if (isWin) newStatus = 'won';
        if (isLose) newStatus = 'lost';

        const newState: GameState = {
          ...gameState,
          guesses: newGuesses,
          currentGuess: '',
          gameStatus: newStatus,
          keyStatus: newKeyStatus,
        };

        setTimeout(() => {
          if (newStatus !== 'playing') {
            const today = getDateString();
            const newStats = { ...statistics };
            const lastDate = statistics.lastPlayDate;

            if (lastDate !== today) {
              newStats.gamesPlayed++;
              if (newStatus === 'won') {
                newStats.gamesWon++;
                newStats.currentStreak++;
                if (newStats.currentStreak > newStats.maxStreak) {
                  newStats.maxStreak = newStats.currentStreak;
                }
                const guessIndex = newGuesses.length - 1;
                if (guessIndex >= 0 && guessIndex < 6) {
                  newStats.guessDistribution[guessIndex]++;
                }
              } else {
                newStats.currentStreak = 0;
              }
              newStats.lastPlayDate = today;
              saveStatistics(newStats);
              set({ statistics: newStats });
            }

            set({
              gameState: newState,
              isAnimating: false,
              showGameOver: true,
            });
          } else {
            set({ gameState: newState, isAnimating: false });
          }
          saveGameState(newState);
        }, 1500);
      },

      setShowStats: (show: boolean) => set({ showStats: show }),
      setShowHelp: (show: boolean) => set({ showHelp: show }),
      setShowGameOver: (show: boolean) => set({ showGameOver: show }),

      resetGame: () => {
        const { gameState } = get();
        const newState = getInitialGameState(gameState.language);
        saveGameState(newState);
        set({
          gameState: newState,
          showGameOver: false,
          isAnimating: false,
        });
      },

      setMessage: (message: string, duration = 2000) => {
        set({ message });
        if (duration > 0) {
          setTimeout(() => {
            set({ message: '' });
          }, duration);
        }
      },

      clearMessage: () => set({ message: '' }),
    }),
    {
      name: 'wordle-store',
      partialize: (state) => ({
        gameState: state.gameState,
        statistics: state.statistics,
      }),
    }
  )
);
