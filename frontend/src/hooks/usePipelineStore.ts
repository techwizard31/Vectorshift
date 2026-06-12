import { shallow } from 'zustand/shallow';
import { usePipelineStore } from '../store/pipelineStore';

const canvasStateSelector = (state: ReturnType<typeof usePipelineStore.getState>) => ({
  nodes: state.nodes,
  edges: state.edges,
});

const canvasActionsSelector = (state: ReturnType<typeof usePipelineStore.getState>) => ({
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  deleteEdge: state.deleteEdge,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const useCanvasState = () => usePipelineStore(canvasStateSelector, shallow);

export const useCanvasActions = () => usePipelineStore(canvasActionsSelector, shallow);
