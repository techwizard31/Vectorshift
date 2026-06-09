import React from 'react';
import { DraggableNode } from './draggableNode.tsx';

export const PipelineToolbar = () => {
  return (
    <div className="pipeline-toolbar">
      <div className="toolbar-brand">
        <span style={{ fontSize: '20px' }}>🧬</span>
        <span className="brand-text">Orchestration Nodes</span>
      </div>
      <div className="toolbar-palette">
        <DraggableNode type="customInput" label="Input" icon="📥" />
        <DraggableNode type="llm" label="LLM Core" icon="🧠" />
        <DraggableNode type="customOutput" label="Output" icon="📤" />
        <DraggableNode type="text" label="Text Area" icon="📝" />
        <DraggableNode type="apiRequest" label="API Gateway" icon="⚡" />
        <DraggableNode type="conditionalRouter" label="Router" icon="🔀" />
        <DraggableNode type="jsonParser" label="JSON Schema" icon="📦" />
        <DraggableNode type="authNode" label="Bearer Auth" icon="🔐" />
        <DraggableNode type="delayNode" label="Delay Clock" icon="⏱" />
      </div>
    </div>
  );
};