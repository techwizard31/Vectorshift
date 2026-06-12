import React from 'react';
import { useStore } from '../store.ts';

interface NodeDeleteButtonProps {
  nodeId: string;
}

export const NodeDeleteButton = ({ nodeId }: NodeDeleteButtonProps) => {
  const deleteNode = useStore((state) => state.deleteNode);

  return (
    <button
      type="button"
      className="node-delete-btn"
      aria-label="Delete node"
      title="Delete node"
      onClick={(e) => {
        e.stopPropagation();
        deleteNode(nodeId);
      }}
    >
      ✕
    </button>
  );
};
