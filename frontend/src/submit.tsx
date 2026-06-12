import React, { useState } from 'react';
import { Node, Edge } from 'reactflow';
import { ResultModal } from './components/ResultModal.tsx';

interface PipelineResult {
  num_nodes: number;
  num_edges: number;
  is_dag: boolean;
}

interface SubmitButtonProps {
  nodes: Node[];
  edges: Edge[];
}

export const SubmitButton = ({ nodes, edges }: SubmitButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data: PipelineResult = await response.json();
      setResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      const isNetworkError = message.includes('fetch') || message.includes('Failed to fetch');
      setError(
        isNetworkError
          ? 'Cannot reach backend at localhost:8000. Start it with: uvicorn main:app --reload'
          : message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    setError(null);
  };

  return (
    <>
      <div className="submit-btn-container">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="submit-btn"
        >
          {isLoading ? 'Analyzing Graph...' : 'Submit Pipeline Architecture'}
        </button>
      </div>
      <ResultModal
        isOpen={result !== null || error !== null}
        onClose={handleClose}
        result={result}
        error={error}
      />
    </>
  );
};
