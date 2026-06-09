import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap, ReactFlowInstance, ConnectionLineType, Edge } from 'reactflow';
import { useStore } from './store.ts';
import { shallow } from 'zustand/shallow';
import { InputNode, OutputNode, LLMNode } from './nodes/SimpleNodes.tsx';
import { TextNode } from './nodes/TextNode.tsx';
import { APIRequestNode, ConditionalRouterNode, JSONParserNode, AuthNode, DelayNode } from './nodes/CustomNodes.tsx';
import { SubmitButton } from './submit.tsx';
import { ResultModal } from './components/ResultModal.tsx';
import 'reactflow/dist/style.css';

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
  deleteEdge: state.deleteEdge, // Injected connection line deletion property
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalData, setModalData] = useState<any>(null);

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

  // Directly handle click events on lines to delete them from the workspace canvas
  const handleEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    deleteEdge(edge.id);
  }, [deleteEdge]);

  const handlePipelineSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      setModalData(result);
    } catch (err) {
      console.error('Submission pipeline execution error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="canvas-container">
      <div ref={reactFlowWrapper} className="reactflow-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onEdgeClick={handleEdgeClick} // Listens for click connections to clear lines instantly
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
          onInit={setReactFlowInstance}
          nodeTypes={NODE_TYPES}
          snapGrid={[20, 20]}
          connectionLineType={ConnectionLineType.SmoothStep}
        >
          {/* Background dot matrix colors adapted to deep dark theme backgrounds */}
          <Background color="#334155" gap={20} size={1.5} />
          <Controls />
          <MiniMap nodeStrokeColor={() => '#6366f1'} nodeColor={() => '#111827'} maskColor="rgba(0,0,0,0.4)" />
        </ReactFlow>
      </div>
      <SubmitButton isLoading={isLoading} onClick={handlePipelineSubmit} />
      <ResultModal isOpen={modalData !== null} onClose={() => setModalData(null)} result={modalData} />
    </div>
  );
};