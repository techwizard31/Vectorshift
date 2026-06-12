import { useState } from 'react';
import { motion } from 'motion/react';
import type { Edge, Node } from 'reactflow';
import { ResultModal } from '../../components/ResultModal';
import { BACKEND_START_HINT, PIPELINE_PARSE_URL } from '../../constants/api';
import { SPRING_SNAPPY } from '../../constants/motion';
import type { PipelineResult } from '../../types/pipeline';
import type { NodeData } from '../../types/nodes';

interface SubmitButtonProps {
  nodes: Node<NodeData>[];
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
      const response = await fetch(PIPELINE_PARSE_URL, {
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
      setError(isNetworkError ? BACKEND_START_HINT : message);
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
        <motion.button
          onClick={handleSubmit}
          disabled={isLoading}
          className="submit-btn"
          whileHover={isLoading ? {} : { scale: 1.03 }}
          whileTap={isLoading ? {} : { scale: 0.97 }}
          transition={SPRING_SNAPPY}
        >
          {isLoading && (
            <motion.span
              className="submit-spinner"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
          )}
          {isLoading ? 'Analyzing Graph...' : 'Submit Pipeline'}
        </motion.button>
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
