import React from 'react';

interface SubmitButtonProps {
  isLoading: boolean;
  onClick: () => void;
}

export const SubmitButton = ({ isLoading, onClick }: SubmitButtonProps) => {
  return (
    <div className="submit-btn-container">
      <button
        onClick={onClick}
        disabled={isLoading}
        className="submit-btn"
      >
        {isLoading ? 'Analyzing Graph...' : 'Submit Pipeline Architecture'}
      </button>
    </div>
  );
};