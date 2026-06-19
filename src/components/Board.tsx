import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Cell } from './Cell';
import { getWordLength } from '../utils/dailyWord';
import { CellState } from '../types';

export const Board: React.FC = () => {
  const { gameState } = useGameStore();
  const wordLength = getWordLength(gameState.language);
  const maxGuesses = 6;

  const getEmptyCells = (): CellState[] => {
    return Array(wordLength).fill(null).map(() => ({
      letter: '',
      status: 'empty' as const,
    }));
  };

  const getCurrentRowCells = (): CellState[] => {
    const cells = getEmptyCells();
    for (let i = 0; i < gameState.currentGuess.length && i < wordLength; i++) {
      cells[i] = {
        letter: gameState.currentGuess[i],
        status: 'empty',
      };
    }
    return cells;
  };

  const renderRows = () => {
    const rows = [];

    for (let rowIndex = 0; rowIndex < maxGuesses; rowIndex++) {
      const isGuessRow = rowIndex < gameState.guesses.length;
      const isCurrentRow = rowIndex === gameState.guesses.length && gameState.gameStatus === 'playing';
      const isLastGuess = rowIndex === gameState.guesses.length - 1;

      let cells: CellState[];
      if (isGuessRow) {
        cells = gameState.guesses[rowIndex].cells;
      } else if (isCurrentRow) {
        cells = getCurrentRowCells();
      } else {
        cells = getEmptyCells();
      }

      rows.push(
        <div
          key={rowIndex}
          className="flex gap-1.5 sm:gap-2 justify-center"
        >
          {cells.map((cell, cellIndex) => (
            <Cell
              key={cellIndex}
              cell={cell}
              isCurrentRow={isCurrentRow}
              isLastGuess={isLastGuess && gameState.gameStatus === 'playing'}
              index={cellIndex}
            />
          ))}
        </div>
      );
    }

    return rows;
  };

  return (
    <div className="flex flex-col gap-1.5 sm:gap-2 py-4">
      {renderRows()}
    </div>
  );
};
