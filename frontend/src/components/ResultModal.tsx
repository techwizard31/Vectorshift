import React from 'react';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: { num_nodes: number; num_edges: number; is_dag: boolean } | null;
}

export const ResultModal = ({ isOpen, onClose, result }: ResultModalProps) => {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm flex items-center justify-center z-[9999] animate-fade-in" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-neutral-100 transform transition-all scale-100">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="text-xl">📊</span>
          <h2 className="text-base font-bold text-neutral-800">Pipeline Analysis Metrics</h2>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center text-sm border-b border-neutral-50 pb-2">
            <span className="text-neutral-500 font-medium">Total Graph Nodes</span>
            <span className="bg-neutral-100 text-neutral-800 font-bold px-2.5 py-0.5 rounded-full text-xs">{result.num_nodes}</span>
          </div>
          <div className="flex justify-between items-center text-sm border-b border-neutral-50 pb-2">
            <span className="text-neutral-500 font-medium">Active Graph Connections</span>
            <span className="bg-neutral-100 text-neutral-800 font-bold px-2.5 py-0.5 rounded-full text-xs">{result.num_edges}</span>
          </div>
          <div className={`mt-4 p-3 rounded-xl font-medium text-xs flex items-center gap-2 ${result.is_dag ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
            <span>{result.is_dag ? '🟢' : '🔴'}</span>
            <span>{result.is_dag ? 'Flow Validated: Directed Acyclic Graph (DAG) Verified' : 'Execution Loop Blocked: Pipeline layout is cyclical'}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-neutral-900 hover:bg-neutral-800 text-white py-2.5 rounded-xl font-medium text-xs transition-colors shadow-sm outline-none"
        >
          Return to Canvas
        </button>
      </div>
    </div>
  );
};