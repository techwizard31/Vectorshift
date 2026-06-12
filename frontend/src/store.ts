import { create } from "zustand";
import { addEdge, applyNodeChanges, applyEdgeChanges, Edge, Node, OnNodesChange, OnEdgesChange, OnConnect, MarkerType } from 'reactflow';

interface StoreState {
  nodes: Node[];
  edges: Edge[];
  nodeIDs: Record<string, number>;
  getNodeID: (type: string) => string;
  addNode: (node: Node) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void; // Explicit delete hook action
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  updateNodeField: (nodeId: string, fieldName: string, fieldValue: any) => void;
}

export const useStore = create<StoreState>((set, get) => ({
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
      nodes: get().nodes.filter((n) => n.id !== nodeId),
      edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
    });
  },
  deleteEdge: (edgeId) => {
    set({ edges: get().edges.filter((e) => e.id !== edgeId) });
  },
  onNodesChange: (changes) => {
    const removedIds = changes
      .filter((change) => change.type === 'remove')
      .map((change) => change.id);

    const nodes = applyNodeChanges(changes, get().nodes);
    const edges =
      removedIds.length > 0
        ? get().edges.filter(
            (e) => !removedIds.includes(e.source) && !removedIds.includes(e.target)
          )
        : get().edges;

    set({ nodes, edges });
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge(
        {
          ...connection,
          type: 'smoothstep',
          animated: true,
          markerEnd: { type: MarkerType.Arrow, height: 20, width: 20, color: '#6366f1' },
          style: { stroke: '#6366f1', strokeWidth: 2 }
        },
        get().edges
      ),
    });
  },
  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: { ...node.data, [fieldName]: fieldValue }
          };
        }
        return node;
      }),
    });
  },
}));