import React from 'react';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: { num_nodes: number; num_edges: number; is_dag: boolean } | null;
}

export const ResultModal = ({ isOpen, onClose, result }: ResultModalProps) => {
  if (!isOpen || !result) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <span style={{ fontSize: '20px' }}>📊</span>
          <h2 className="modal-title">Pipeline Analysis Metrics</h2>
        </div>
        
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

        <button onClick={onClose} className="modal-close-btn">
          Return to Canvas
        </button>
      </div>
    </div>
  );
};