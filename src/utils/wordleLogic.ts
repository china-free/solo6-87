import { CellState, LetterStatus } from '../types';

export function calculateLetterStatus(guess: string, target: string): CellState[] {
  const result: CellState[] = guess.split('').map((letter, index) => ({
    letter,
    status: 'absent' as LetterStatus,
  }));

  const targetLetters = target.split('');
  const targetLetterCounts: Record<string, number> = {};

  for (const letter of targetLetters) {
    targetLetterCounts[letter] = (targetLetterCounts[letter] || 0) + 1;
  }

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === target[i]) {
      result[i].status = 'correct';
      targetLetterCounts[guess[i]]--;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i].status !== 'correct') {
      const letter = guess[i];
      if (targetLetterCounts[letter] && targetLetterCounts[letter] > 0) {
        result[i].status = 'present';
        targetLetterCounts[letter]--;
      }
    }
  }

  return result;
}

export function isValidWord(word: string, validWords: string[]): boolean {
  return validWords.includes(word.toLowerCase());
}

export function mergeKeyStatus(
  currentStatus: Record<string, LetterStatus>,
  newCells: CellState[]
): Record<string, LetterStatus> {
  const updated = { ...currentStatus };

  for (const cell of newCells) {
    const letter = cell.letter;
    const existingStatus = updated[letter];

    if (!existingStatus || existingStatus === 'absent') {
      updated[letter] = cell.status;
    } else if (existingStatus === 'present' && cell.status === 'correct') {
      updated[letter] = cell.status;
    }
  }

  return updated;
}
