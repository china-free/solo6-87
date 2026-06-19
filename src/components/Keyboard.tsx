import React, { useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';
import { Key } from './Key';
import { getWordData } from '../utils/dailyWord';

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['ENTER', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'BACKSPACE'],
];

const KEYBOARD_ROWS_ES = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ñ'],
  ['ENTER', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'BACKSPACE'],
];

export const Keyboard: React.FC = () => {
  const {
    gameState,
    addLetter,
    removeLetter,
    submitGuess,
  } = useGameStore();

  const keyboardRows = gameState.language === 'es' ? KEYBOARD_ROWS_ES : KEYBOARD_ROWS;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const key = e.key.toLowerCase();
      const wordData = getWordData(gameState.language);
      const allLetters = keyboardRows.flat().map(k => k.toLowerCase());

      if (key === 'enter') {
        e.preventDefault();
        submitGuess();
      } else if (key === 'backspace' || key === 'delete') {
        e.preventDefault();
        removeLetter();
      } else if (/^[a-zñ]$/.test(key) && allLetters.includes(key)) {
        e.preventDefault();
        addLetter(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.language, addLetter, removeLetter, submitGuess]);

  const handleKeyClick = (value: string) => {
    if (value === 'ENTER') {
      submitGuess();
    } else if (value === 'BACKSPACE') {
      removeLetter();
    } else {
      addLetter(value);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 sm:gap-2 px-2 py-4">
      {keyboardRows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex justify-center gap-1 sm:gap-1.5"
        >
          {row.map((keyValue) => (
            <Key
              key={keyValue}
              value={keyValue}
              status={gameState.keyStatus[keyValue.toLowerCase()]}
              onClick={() => handleKeyClick(keyValue)}
              isSpecial={keyValue === 'ENTER' || keyValue === 'BACKSPACE'}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
