import React from 'react';
import { useGameStore } from '../store/useGameStore';

export const Message: React.FC = () => {
  const { message } = useGameStore();

  if (!message) return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 animate-fadeIn">
      <div className="bg-white text-gray-900 px-6 py-3 rounded-lg font-bold shadow-lg">
        {message}
      </div>
    </div>
  );
};
