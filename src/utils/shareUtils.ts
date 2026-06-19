import { GuessResult, LetterStatus } from '../types';

const STATUS_EMOJI: Record<LetterStatus, string> = {
  correct: '🟩',
  present: '🟨',
  absent: '⬜',
  empty: '⬜',
};

export function generateShareText(
  guesses: GuessResult[],
  gameStatus: 'won' | 'lost',
  date: Date = new Date()
): string {
  const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const attempts = gameStatus === 'won' ? guesses.length : 'X';
  
  const lines: string[] = [];
  lines.push(`Wordle ${dateString} ${attempts}/6`);
  lines.push('');

  for (const guess of guesses) {
    const emojiLine = guess.cells.map(cell => STATUS_EMOJI[cell.status]).join('');
    lines.push(emojiLine);
  }

  return lines.join('\n');
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

export function getLanguageName(language: string): string {
  const names: Record<string, string> = {
    en: 'English',
    es: 'Español',
    pinyin: '中文拼音',
  };
  return names[language] || language;
}
