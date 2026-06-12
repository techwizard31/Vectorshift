import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MiniMap, Panel } from 'reactflow';

type Corner = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

const CARD_WIDTH = 240;
const BODY_HEIGHT = 160;
const HEADER_HEIGHT = 44;
const MARGIN = 16;
const BOTTOM_CLEARANCE = 80;

const CORNER_STYLES: Record<Corner, React.CSSProperties> = {
  'bottom-right': { right: MARGIN, bottom: BOTTOM_CLEARANCE, left: 'auto', top: 'auto' },
  'bottom-left': { left: MARGIN, bottom: BOTTOM_CLEARANCE, right: 'auto', top: 'auto' },
  'top-right': { right: MARGIN, top: MARGIN, left: 'auto', bottom: 'auto' },
  'top-left': { left: MARGIN, top: MARGIN, right: 'auto', bottom: 'auto' },
};

interface MinimapWidgetProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const MinimapWidget = ({ containerRef }: MinimapWidgetProps) => {
  const [corner, setCorner] = useState<Corner>('bottom-right');
  const [collapsed, setCollapsed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragPosRef = useRef({ x: 0, y: 0 });

  const cardHeight = collapsed ? HEADER_HEIGHT : HEADER_HEIGHT + BODY_HEIGHT;

  const snapToNearestCorner = useCallback((x: number, y: number) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const centerX = x + CARD_WIDTH / 2;
    const centerY = y + cardHeight / 2;
    const midX = bounds.width / 2;
    const midY = bounds.height / 2;

    if (centerY < midY) {
      setCorner(centerX < midX ? 'top-left' : 'top-right');
    } else {
      setCorner(centerX < midX ? 'bottom-left' : 'bottom-right');
    }
  }, [containerRef, cardHeight]);

  const handleHeaderPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return;

    const bounds = containerRef.current?.getBoundingClientRect();
    const card = (e.currentTarget as HTMLElement).closest('.minimap-card');
    if (!bounds || !card) return;

    const cardRect = card.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - cardRect.left,
      y: e.clientY - cardRect.top,
    };

    const startPos = {
      x: cardRect.left - bounds.left,
      y: cardRect.top - bounds.top,
    };
    dragPosRef.current = startPos;
    setDragPos(startPos);
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  useEffect(() => {
    if (!dragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      const bounds = containerRef.current?.getBoundingClientRect();
      if (!bounds) return;

      const maxX = bounds.width - CARD_WIDTH - MARGIN;
      const maxY = bounds.height - cardHeight - MARGIN;

      const x = Math.min(Math.max(MARGIN, e.clientX - bounds.left - dragOffset.current.x), maxX);
      const y = Math.min(Math.max(MARGIN, e.clientY - bounds.top - dragOffset.current.y), maxY);

      dragPosRef.current = { x, y };
      setDragPos({ x, y });
    };

    const handlePointerUp = () => {
      setDragging(false);
      snapToNearestCorner(dragPosRef.current.x, dragPosRef.current.y);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragging, containerRef, cardHeight, snapToNearestCorner]);

  const panelStyle: React.CSSProperties = dragging
    ? { margin: 0, left: dragPos.x, top: dragPos.y, right: 'auto', bottom: 'auto' }
    : { margin: 0, ...CORNER_STYLES[corner] };

  return (
    <Panel position="bottom-right" className="minimap-panel" style={panelStyle}>
      <div className={`minimap-card ${collapsed ? 'minimap-card--collapsed' : ''} ${dragging ? 'minimap-card--dragging' : ''}`}>
        <div
          className="minimap-header"
          onPointerDown={handleHeaderPointerDown}
          role="toolbar"
          aria-label="Canvas overview controls"
        >
          <span className="minimap-drag-hint" aria-hidden="true">⠿</span>
          <span className="minimap-label">Canvas Overview</span>
          <div className="minimap-header-actions">
            <button
              type="button"
              className="minimap-action-btn"
              title="Reset position"
              aria-label="Reset position to bottom right"
              onClick={() => setCorner('bottom-right')}
            >
              ↺
            </button>
            <button
              type="button"
              className={`minimap-action-btn minimap-collapse-btn ${collapsed ? 'minimap-collapse-btn--collapsed' : ''}`}
              title={collapsed ? 'Expand overview' : 'Collapse overview'}
              aria-label={collapsed ? 'Expand overview' : 'Collapse overview'}
              aria-expanded={!collapsed}
              onClick={() => setCollapsed((prev) => !prev)}
            >
              <span className="minimap-collapse-icon" aria-hidden="true">▴</span>
            </button>
          </div>
        </div>
        <div className={`minimap-body ${collapsed ? 'minimap-body--collapsed' : ''}`}>
          <div className="minimap-body-inner">
            <MiniMap
              className="canvas-minimap"
              nodeStrokeColor={() => '#8b5cf6'}
              nodeColor={() => '#27282a'}
              nodeBorderRadius={6}
              maskColor="rgba(8, 9, 10, 0.55)"
              maskStrokeColor="rgba(139, 92, 246, 0.6)"
              maskStrokeWidth={2}
              pannable
              zoomable
            />
          </div>
        </div>
      </div>
    </Panel>
  );
};
