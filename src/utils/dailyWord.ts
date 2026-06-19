import { Language, WordData } from '../types';
import { englishWords } from '../data/words-en';
import { spanishWords } from '../data/words-es';
import { pinyinWords } from '../data/words-pinyin';

export function getWordData(language: Language): WordData {
  switch (language) {
    case 'en':
      return englishWords;
    case 'es':
      return spanishWords;
    case 'pinyin':
      return pinyinWords;
    default:
      return englishWords;
  }
}

export function getDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function getDailyWord(language: Language, date: Date = new Date()): string {
  const wordData = getWordData(language);
  const dateString = getDateString(date);
  const hash = hashString(dateString + language);
  const index = hash % wordData.target.length;
  return wordData.target[index];
}

export function isValidGuess(word: string, language: Language): boolean {
  const wordData = getWordData(language);
  return wordData.valid.includes(word.toLowerCase());
}

export function getWordLength(language: Language): number {
  return 5;
}
