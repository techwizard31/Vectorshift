// src/toolbar.tsx
import React from 'react';
import { DraggableNode } from './draggableNode.tsx';

export const PipelineToolbar = () => {
  return (
    <div className="w-full h-20 bg-neutral-900 border-b border-neutral-800 flex items-center px-6 gap-6 overflow-x-auto z-[999]" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="flex items-center gap-2 border-r border-neutral-700 pr-6">
        <span className="text-xl">🧬</span>
        <span className="text-xs font-bold text-white tracking-wider uppercase">Orchestration Nodes</span>
      </div>
      <div className="flex items-center gap-3">
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