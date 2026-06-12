import { useState, useRef, useCallback, useEffect, Suspense, lazy, type DragEvent, type MouseEvent } from 'react';
import ReactFlow, {
  Controls,
  Background,
  type ReactFlowInstance,
  ConnectionLineType,
  type Edge,
} from 'reactflow';
import { MinimapWidget } from '../../components/MinimapWidget';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { NODE_TYPES } from '../../nodes/registry';
import { useCanvasActions, useCanvasState } from '../../hooks/usePipelineStore';
import {
  CANVAS_BACKGROUND,
  DEFAULT_EDGE_OPTIONS,
  DRAG_DATA_FORMAT,
  SNAP_GRID,
} from '../../constants/canvas';
import { SubmitButton } from './SubmitButton';
import 'reactflow/dist/style.css';

const CanvasBackground = lazy(() =>
  import('../../components/CanvasBackground').then((module) => ({
    default: module.CanvasBackground,
  })),
);

export const PipelineCanvas = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [bgFailed, setBgFailed] = useState(false);

  const { nodes, edges } = useCanvasState();
  const { getNodeID, addNode, deleteEdge, onNodesChange, onEdgesChange, onConnect } =
    useCanvasActions();

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const dataStr = event.dataTransfer.getData(DRAG_DATA_FORMAT);

      if (!reactFlowBounds || !reactFlowInstance || !dataStr) return;

      const { nodeType } = JSON.parse(dataStr) as { nodeType?: string };
      if (!nodeType) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const nodeID = getNodeID(nodeType);
      addNode({
        id: nodeID,
        type: nodeType,
        position,
        data: {},
      });
    },
    [reactFlowInstance, getNodeID, addNode],
  );

  const handleEdgeClick = useCallback(
    (_: MouseEvent, edge: Edge) => {
      deleteEdge(edge.id);
    },
    [deleteEdge],
  );

  useEffect(() => {
    const blockDeleteWhileEditing = (event: KeyboardEvent) => {
      if (event.key !== 'Backspace' && event.key !== 'Delete') return;
      const activeElement = document.activeElement;
      if (
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement instanceof HTMLSelectElement ||
        activeElement?.closest('.custom-select')
      ) {
        event.stopPropagation();
      }
    };
    document.addEventListener('keydown', blockDeleteWhileEditing, true);
    return () => document.removeEventListener('keydown', blockDeleteWhileEditing, true);
  }, []);

  return (
    <div className="canvas-container">
      {!bgFailed && (
        <Suspense fallback={null}>
          <ErrorBoundary onError={() => setBgFailed(true)}>
            <CanvasBackground />
          </ErrorBoundary>
        </Suspense>
      )}
      <div className="canvas-vignette" />
      <div ref={reactFlowWrapper} className="reactflow-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onEdgeClick={handleEdgeClick}
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
          }}
          onInit={setReactFlowInstance}
          nodeTypes={NODE_TYPES}
          snapGrid={SNAP_GRID}
          connectionLineType={ConnectionLineType.SmoothStep}
          defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
          proOptions={{ hideAttribution: true }}
          deleteKeyCode={['Backspace', 'Delete']}
          elementsSelectable
        >
          <Background
            color={CANVAS_BACKGROUND.color}
            gap={CANVAS_BACKGROUND.gap}
            size={CANVAS_BACKGROUND.size}
          />
          <Controls showInteractive={false} />
          <MinimapWidget containerRef={reactFlowWrapper} />
        </ReactFlow>
      </div>
      <SubmitButton nodes={nodes} edges={edges} />
    </div>
  );
};
