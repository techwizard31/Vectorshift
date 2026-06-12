import type { Edge } from 'reactflow';

export function filterEdgesForRemovedNodes(edges: Edge[], removedNodeIds: string[]): Edge[] {
  if (removedNodeIds.length === 0) return edges;
  return edges.filter(
    (edge) => !removedNodeIds.includes(edge.source) && !removedNodeIds.includes(edge.target),
  );
}
