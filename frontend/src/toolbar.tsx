import React, { useState } from 'react';
import { DraggableNode } from './draggableNode.tsx';

const CORE_NODES = [
  { type: 'customInput', label: 'Input Trigger', icon: '📥' },
  { type: 'llm', label: 'LLM Engine', icon: '🧠' },
  { type: 'customOutput', label: 'Output Response', icon: '📤' },
  { type: 'text', label: 'Text Template', icon: '📝' },
];

const LOGIC_NODES = [
  { type: 'conditionalRouter', label: 'Conditional Router', icon: '🔀' },
  { type: 'delayNode', label: 'Delay Timer', icon: '⏱' },
];

const INTEGRATION_NODES = [
  { type: 'apiRequest', label: 'API Gateway', icon: '⚡' },
  { type: 'jsonParser', label: 'JSON Parser', icon: '📦' },
  { type: 'authNode', label: 'Bearer Auth', icon: '🔐' },
];

export const PipelineToolbar = () => {
  const [isOpen, setIsOpen] = useState(true);
  let itemIndex = 0;

  const renderSection = (title: string, nodes: typeof CORE_NODES) => (
    <div className="sidebar-section">
      <div className="sidebar-section-title">{title}</div>
      <div className="sidebar-items">
        {nodes.map((node) => {
          const idx = itemIndex++;
          return (
            <DraggableNode
              key={node.type}
              type={node.type}
              label={node.label}
              icon={node.icon}
              index={idx}
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : 'sidebar--collapsed'}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">⚡</div>
        <div className="sidebar-brand-text">
          <span className="brand-title">VectorShift</span>
          <span className="brand-subtitle">Pipeline Studio</span>
        </div>
        <button
          type="button"
          className="sidebar-toggle"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? '‹' : '›'}
        </button>
      </div>
      <div className="sidebar-scroll">
        {renderSection('Core', CORE_NODES)}
        {renderSection('Logic', LOGIC_NODES)}
        {renderSection('Integrations', INTEGRATION_NODES)}
      </div>
    </aside>
  );
};
