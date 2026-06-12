import type { Edge, Node } from 'reactflow';

export interface PipelineResult {
  num_nodes: number;
  num_edges: number;
  is_dag: boolean;
}

export interface PipelinePayload {
  nodes: Node[];
  edges: Edge[];
}
