import { create } from 'zustand';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  type Edge,
  type Node,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
} from 'reactflow';
import { CONNECTED_EDGE_STYLE } from '../constants/canvas';
import type { NodeData } from '../types/nodes';
import { filterEdgesForRemovedNodes } from './edgeCleanup';

interface PipelineStoreState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  nodeIDs: Record<string, number>;
  getNodeID: (type: string) => string;
  addNode: (node: Node<NodeData>) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  updateNodeField: (nodeId: string, fieldName: string, fieldValue: string | number) => void;
}

export const usePipelineStore = create<PipelineStoreState>((set, get) => ({
  nodes: [],
  edges: [],
  nodeIDs: {},
  getNodeID: (type) => {
    const newIDs = { ...get().nodeIDs };
    if (newIDs[type] === undefined) {
      newIDs[type] = 0;
    }
    newIDs[type] += 1;
    set({ nodeIDs: newIDs });
    return `${type}-${newIDs[type]}`;
  },
  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },
  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: filterEdgesForRemovedNodes(get().edges, [nodeId]),
    });
  },
  deleteEdge: (edgeId) => {
    set({ edges: get().edges.filter((edge) => edge.id !== edgeId) });
  },
  onNodesChange: (changes) => {
    const removedIds = changes
      .filter((change) => change.type === 'remove')
      .map((change) => change.id);

    set({
      nodes: applyNodeChanges(changes, get().nodes),
      edges: filterEdgesForRemovedNodes(get().edges, removedIds),
    });
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge({ ...connection, ...CONNECTED_EDGE_STYLE }, get().edges),
    });
  },
  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, [fieldName]: fieldValue } }
          : node,
      ),
    });
  },
}));
