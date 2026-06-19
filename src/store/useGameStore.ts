import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
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
  refreshDailyIfNeeded: () => void;
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
    date: getDateString(),
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

const loadLanguage = (): Language => {
  const stored = localStorage.getItem('wordle_language');
  if (stored && ['en', 'es', 'pinyin'].includes(stored)) {
    return stored as Language;
  }
  return 'en';
};

const saveLanguage = (language: Language) => {
  localStorage.setItem('wordle_language', language);
};

interface PersistedState {
  gameState: GameState;
  statistics: Statistics;
}

const createDateValidatedStorage = () => {
  return {
    getItem: (name: string) => {
      const str = localStorage.getItem(name);
      if (!str) return null;

      try {
        const persisted = JSON.parse(str) as { state: PersistedState; version: number };
        const state = persisted.state;
        const today = getDateString();

        if (state.gameState && state.gameState.date !== today) {
          const language = state.gameState.language || 'en';
          return {
            ...persisted,
            state: {
              gameState: getInitialGameState(language),
              statistics: state.statistics,
            },
          };
        }

        return persisted;
      } catch {
        return null;
      }
    },
    setItem: (name: string, value: unknown) => {
      localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name: string) => {
      localStorage.removeItem(name);
    },
  };
};

const initialLanguage = loadLanguage();

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      gameState: getInitialGameState(initialLanguage),
      statistics: getInitialStatistics(),
      message: '',
      showStats: false,
      showHelp: false,
      showGameOver: false,
      isAnimating: false,

      refreshDailyIfNeeded: () => {
        const { gameState } = get();
        const today = getDateString();

        if (gameState.date !== today) {
          const newState = getInitialGameState(gameState.language);
          set({
            gameState: newState,
            showGameOver: false,
            isAnimating: false,
          });
        }
      },

      setLanguage: (language: Language) => {
        saveLanguage(language);
        const { refreshDailyIfNeeded } = get();
        refreshDailyIfNeeded();

        const { gameState } = get();
        if (gameState.language !== language) {
          const newState = getInitialGameState(language);
          set({
            gameState: newState,
            showGameOver: false,
          });
        }
      },

      addLetter: (letter: string) => {
        const { isAnimating, refreshDailyIfNeeded } = get();
        refreshDailyIfNeeded();

        const currentState = get().gameState;
        if (isAnimating || currentState.gameStatus !== 'playing') return;

        const wordLength = getWordLength(currentState.language);
        if (currentState.currentGuess.length < wordLength) {
          set({
            gameState: {
              ...currentState,
              currentGuess: currentState.currentGuess + letter.toLowerCase(),
            },
          });
        }
      },

      removeLetter: () => {
        const { isAnimating, refreshDailyIfNeeded } = get();
        refreshDailyIfNeeded();

        const currentState = get().gameState;
        if (isAnimating || currentState.gameStatus !== 'playing') return;

        if (currentState.currentGuess.length > 0) {
          set({
            gameState: {
              ...currentState,
              currentGuess: currentState.currentGuess.slice(0, -1),
            },
          });
        }
      },

      submitGuess: () => {
        const { statistics, isAnimating, setMessage, refreshDailyIfNeeded } = get();
        refreshDailyIfNeeded();

        const { gameState } = get();
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
        }, 1500);
      },

      setShowStats: (show: boolean) => set({ showStats: show }),
      setShowHelp: (show: boolean) => set({ showHelp: show }),
      setShowGameOver: (show: boolean) => set({ showGameOver: show }),

      resetGame: () => {
        const { gameState } = get();
        const newState = getInitialGameState(gameState.language);
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
      storage: createDateValidatedStorage() as any,
      partialize: (state) =>
        ({
          gameState: state.gameState,
          statistics: state.statistics,
        }) as any,
    }
  )
);
