import React from 'react';
import { LetterStatus } from '../types';

interface KeyProps {
  value: string;
  status?: LetterStatus;
  onClick: () => void;
  isSpecial?: boolean;
}

const statusClasses: Record<string, string> = {
  correct: 'bg-correct text-white',
  present: 'bg-present text-white',
  absent: 'bg-absent text-white',
  empty: 'bg-gray-500 hover:bg-gray-400 text-white',
};

export const Key: React.FC<KeyProps> = ({
  value,
  status = 'empty',
  onClick,
  isSpecial = false,
}) => {
  const displayText = value === 'BACKSPACE' ? '←' : value === 'ENTER' ? 'ENTER' : value.toUpperCase();

  return (
    <button
      onClick={onClick}
      className={`
        h-14 sm:h-16 px-2 sm:px-4 rounded font-bold text-sm sm:text-base
        transition-all duration-150 active:scale-95
        ${isSpecial ? 'text-xs sm:text-sm px-1 sm:px-3' : ''}
        ${statusClasses[status]}
      `}
      style={{ minWidth: isSpecial ? '64px' : '32px' }}
    >
      {displayText}
    </button>
  );
};
