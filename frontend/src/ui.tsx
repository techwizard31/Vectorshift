import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap, ReactFlowInstance, ConnectionLineType } from 'reactflow';
import { useStore } from './store.ts';
import { shallow } from 'zustand/shallow';
import { InputNode, OutputNode, LLMNode } from './nodes/SimpleNodes.tsx';
import { TextNode } from './nodes/TextNode.tsx';
import { APIRequestNode, ConditionalRouterNode, JSONParserNode, AuthNode, DelayNode } from './nodes/CustomNodes.tsx';
import { SubmitButton } from './submit.tsx';
import { ResultModal } from './components/ResultModal.tsx';
// @ts-expect-error Vite handles CSS side-effect imports.
import 'reactflow/dist/style.css';

// CRITICAL: Pre-registered nodeTypes defined out-of-component scope to prevent infinite layout unmount flashes
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
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalData, setModalData] = useState<any>(null);

  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } = useStore(selector, shallow);

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
    <div className="relative w-full h-[calc(100vh-80px)] bg-neutral-50">
      <div ref={reactFlowWrapper} className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
          onInit={setReactFlowInstance}
          nodeTypes={NODE_TYPES}
          snapGrid={[20, 20]}
          connectionLineType={ConnectionLineType.SmoothStep}
        >
          <Background color="#cbd5e1" gap={20} size={1} />
          <Controls />
          <MiniMap nodeStrokeColor={() => '#6366f1'} nodeColor={() => '#f8fafc'} />
        </ReactFlow>
      </div>
      <SubmitButton isLoading={isLoading} onClick={handlePipelineSubmit} />
      <ResultModal isOpen={modalData !== null} onClose={() => setModalData(null)} result={modalData} />
    </div>
  );
};