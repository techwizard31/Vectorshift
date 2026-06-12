import { useMemo, useState } from 'react';
import { TOOLBAR_SECTIONS } from '../../nodes/registry';
import { DraggableNode } from './DraggableNode';

function buildSectionsWithIndices() {
  let itemIndex = 0;
  return TOOLBAR_SECTIONS.map((section) => ({
    title: section.title,
    nodes: section.nodes.map((node) => {
      const index = itemIndex;
      itemIndex += 1;
      return { ...node, index };
    }),
  }));
}

export const PipelineToolbar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const sections = useMemo(() => buildSectionsWithIndices(), []);

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
        {sections.map((section) => (
          <div key={section.title} className="sidebar-section">
            <div className="sidebar-section-title">{section.title}</div>
            <div className="sidebar-items">
              {section.nodes.map((node) => (
                <DraggableNode
                  key={node.type}
                  type={node.type}
                  label={node.label}
                  icon={node.icon}
                  index={node.index}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};
