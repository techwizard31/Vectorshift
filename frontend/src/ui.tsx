import React, { useState, useRef, useCallback, useEffect, Suspense, lazy } from 'react';
import ReactFlow, { Controls, Background, ReactFlowInstance, ConnectionLineType, Edge } from 'reactflow';
import { MinimapWidget } from './components/MinimapWidget.tsx';
import { useStore } from './store.ts';
import { shallow } from 'zustand/shallow';
import { InputNode, OutputNode, LLMNode } from './nodes/SimpleNodes.tsx';
import { TextNode } from './nodes/TextNode.tsx';
import { APIRequestNode, ConditionalRouterNode, JSONParserNode, AuthNode, DelayNode } from './nodes/CustomNodes.tsx';
import { SubmitButton } from './submit.tsx';
import 'reactflow/dist/style.css';

const CanvasBackground = lazy(() =>
  import('./components/CanvasBackground.tsx').then((m) => ({ default: m.CanvasBackground }))
);

const NODE_TYPES = {
  customInput: InputNode,
  customOutput: OutputNode,
  llm: LLMNode,
  text: TextNode,
  apiRequest: APIRequestNode,
  conditionalRouter: ConditionalRouterNode,
  jsonParser: JSONParserNode,
  authNode: AuthNode,
  delayNode: DelayNode,
};

const selector = (state: any) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  deleteEdge: state.deleteEdge,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [bgFailed, setBgFailed] = useState(false);

  const { nodes, edges, getNodeID, addNode, deleteEdge, onNodesChange, onEdgesChange, onConnect } = useStore(selector, shallow);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const dataStr = event.dataTransfer.getData('application/reactflow');

      if (reactFlowBounds && reactFlowInstance && dataStr) {
        const { nodeType } = JSON.parse(dataStr);
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
          data: { id: nodeID, nodeType }
        });
      }
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const handleEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    deleteEdge(edge.id);
  }, [deleteEdge]);

  useEffect(() => {
    const blockDeleteWhileEditing = (e: KeyboardEvent) => {
      if (e.key !== 'Backspace' && e.key !== 'Delete') return;
      const el = document.activeElement;
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        el instanceof HTMLSelectElement ||
        el?.closest('.custom-select')
      ) {
        e.stopPropagation();
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
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
          onInit={setReactFlowInstance}
          nodeTypes={NODE_TYPES}
          snapGrid={[20, 20]}
          connectionLineType={ConnectionLineType.SmoothStep}
          defaultEdgeOptions={{
            type: 'smoothstep',
            style: { stroke: '#3f4145', strokeWidth: 2 },
          }}
          proOptions={{ hideAttribution: true }}
          deleteKeyCode={['Backspace', 'Delete']}
          elementsSelectable
        >
          <Background color="#52525b" gap={22} size={1.8} />
          <Controls showInteractive={false} />
          <MinimapWidget containerRef={reactFlowWrapper} />
        </ReactFlow>
      </div>
      <SubmitButton nodes={nodes} edges={edges} />
    </div>
  );
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
