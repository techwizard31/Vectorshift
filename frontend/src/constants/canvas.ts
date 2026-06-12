import { MarkerType } from 'reactflow';

export const DRAG_DATA_FORMAT = 'application/reactflow';

export const SNAP_GRID: [number, number] = [20, 20];

export const CANVAS_BACKGROUND = {
  color: '#52525b',
  gap: 22,
  size: 1.8,
} as const;

export const DEFAULT_EDGE_OPTIONS = {
  type: 'smoothstep' as const,
  style: { stroke: '#3f4145', strokeWidth: 2 },
};

export const CONNECTED_EDGE_STYLE = {
  type: 'smoothstep' as const,
  animated: true,
  markerEnd: {
    type: MarkerType.Arrow,
    height: 20,
    width: 20,
    color: '#6366f1',
  },
  style: { stroke: '#6366f1', strokeWidth: 2 },
};

export const MINIMAP_COLORS = {
  nodeStroke: '#8b5cf6',
  nodeFill: '#27282a',
  maskColor: 'rgba(8, 9, 10, 0.55)',
  maskStrokeColor: 'rgba(139, 92, 246, 0.6)',
} as const;
