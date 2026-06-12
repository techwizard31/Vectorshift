import { usePipelineStore } from '../store/pipelineStore';

interface NodeDeleteButtonProps {
  nodeId: string;
}

export const NodeDeleteButton = ({ nodeId }: NodeDeleteButtonProps) => {
  const deleteNode = usePipelineStore((state) => state.deleteNode);

  return (
    <button
      type="button"
      className="node-delete-btn"
      aria-label="Delete node"
      title="Delete node"
      onClick={(event) => {
        event.stopPropagation();
        deleteNode(nodeId);
      }}
    >
      ✕
    </button>
  );
};
