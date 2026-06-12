import React from 'react';

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

export const ResultModal = ({ isOpen, onClose, result, error }: ResultModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <span className="modal-icon">{error ? '⚠️' : '📊'}</span>
          <h2 className="modal-title">
            {error ? 'Submission Failed' : 'Pipeline Analysis Metrics'}
          </h2>
        </div>

        {error ? (
          <div className="modal-error-box">
            <p className="modal-error-text">{error}</p>
          </div>
        ) : result ? (
          <div className="modal-metrics-stack">
            <div className="metric-row">
              <span className="metric-label">Total Graph Nodes</span>
              <span className="metric-badge">{result.num_nodes}</span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Active Graph Connections</span>
              <span className="metric-badge">{result.num_edges}</span>
            </div>

            <div className={`status-box ${result.is_dag ? 'status-success' : 'status-error'}`}>
              <span>{result.is_dag ? '🟢' : '🔴'}</span>
              <span>
                {result.is_dag
                  ? 'Flow Validated: Directed Acyclic Graph (DAG) Verified'
                  : 'Execution Loop Blocked: Pipeline layout is cyclical'}
              </span>
            </div>
          </div>
        ) : null}

        <button onClick={onClose} className="modal-close-btn">
          Return to Canvas
        </button>
      </div>
    </div>
  );
};
