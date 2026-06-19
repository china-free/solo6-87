import React from 'react';
import { CellState } from '../types';

interface CellProps {
  cell: CellState;
  isCurrentRow: boolean;
  isLastGuess: boolean;
  index: number;
}

const statusClasses: Record<string, string> = {
  correct: 'bg-correct border-correct text-white',
  present: 'bg-present border-present text-white',
  absent: 'bg-absent border-absent text-white',
  empty: 'bg-transparent border-gray-500 text-white',
};

const statusFlipDelay = [0, 100, 200, 300, 400];

export const Cell: React.FC<CellProps> = ({
  cell,
  isCurrentRow,
  isLastGuess,
  index,
}) => {
  const hasLetter = cell.letter !== '';
  const isFilled = cell.status !== 'empty';

  return (
    <div
      className={`
        w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center
        border-2 font-bold text-2xl sm:text-3xl uppercase
        transition-all duration-300
        ${isFilled ? statusClasses[cell.status] : statusClasses.empty}
        ${hasLetter && !isFilled && isCurrentRow ? 'border-gray-300 scale-105' : ''}
        ${isLastGuess && isFilled ? 'animate-flip' : ''}
      `}
      style={{
        animationDelay: isLastGuess && isFilled ? `${statusFlipDelay[index]}ms` : '0ms',
      }}
    >
      {cell.letter}
    </div>
  );
};
