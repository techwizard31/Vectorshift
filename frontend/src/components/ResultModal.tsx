import React from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface PipelineResult {
  num_nodes: number;
  num_edges: number;
  is_dag: boolean;
}

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: PipelineResult | null;
  error?: string | null;
}

const metricVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.25, ease: 'easeOut' },
  }),
};

export const ResultModal = ({ isOpen, onClose, result, error }: ResultModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <span className="modal-icon">{error ? '⚠️' : '📊'}</span>
              <h2 className="modal-title">
                {error ? 'Submission Failed' : 'Pipeline Analysis'}
              </h2>
            </div>

            {error ? (
              <div className="modal-error-box">
                <p className="modal-error-text">{error}</p>
              </div>
            ) : result ? (
              <div className="modal-metrics-stack">
                <motion.div
                  className="metric-card"
                  custom={0}
                  variants={metricVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <span className="metric-label">Total Nodes</span>
                  <span className="metric-badge">{result.num_nodes}</span>
                </motion.div>
                <motion.div
                  className="metric-card"
                  custom={1}
                  variants={metricVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <span className="metric-label">Connections</span>
                  <span className="metric-badge">{result.num_edges}</span>
                </motion.div>

                <motion.div
                  className={`status-box ${result.is_dag ? 'status-success dag-badge-pulse' : 'status-error'}`}
                  custom={2}
                  variants={metricVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <span>{result.is_dag ? '✓' : '✕'}</span>
                  <span>
                    {result.is_dag
                      ? 'Valid DAG — no cycles detected in pipeline graph'
                      : 'Cycle detected — pipeline contains a loop'}
                  </span>
                </motion.div>
              </div>
            ) : null}

            <button onClick={onClose} className="modal-close-btn">
              Return to Canvas
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
