import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="关闭"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};
