export type LetterStatus = 'correct' | 'present' | 'absent' | 'empty';

export type Language = 'en' | 'es' | 'pinyin';

export interface CellState {
  letter: string;
  status: LetterStatus;
}

export interface GuessResult {
  cells: CellState[];
}

export type GameStatus = 'playing' | 'won' | 'lost';

export interface GameState {
  targetWord: string;
  currentGuess: string;
  guesses: GuessResult[];
  gameStatus: GameStatus;
  language: Language;
  keyStatus: Record<string, LetterStatus>;
  date: string;
}

export interface Statistics {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: number[];
  lastPlayDate: string;
}

export interface WordData {
  target: string[];
  valid: string[];
}
