import React from 'react';
import { useReactFlow } from 'reactflow';

interface SubmitButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

export const SubmitButton = ({ isLoading, onClick }: SubmitButtonProps) => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[999]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <button
        onClick={onClick}
        disabled={isLoading}
        className={`px-6 py-3 rounded-xl font-semibold text-xs transition-all shadow-md text-white ${
          isLoading 
            ? 'bg-neutral-400 cursor-not-allowed opacity-80' 
            : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 hover:shadow-lg'
        }`}
      >
        {isLoading ? 'Analyzing Graph...' : 'Submit Pipeline Architecture'}
      </button>
    </div>
  );
};