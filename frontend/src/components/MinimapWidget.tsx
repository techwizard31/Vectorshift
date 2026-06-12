import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';
import { MiniMap, Panel } from 'reactflow';
import { MINIMAP_COLORS } from '../constants/canvas';
import {
  MINIMAP_BODY_HEIGHT,
  MINIMAP_BOTTOM_CLEARANCE,
  MINIMAP_CARD_WIDTH,
  MINIMAP_HEADER_HEIGHT,
  MINIMAP_MARGIN,
} from '../constants/layout';

type Corner = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

const CORNER_STYLES: Record<Corner, CSSProperties> = {
  'bottom-right': { right: MINIMAP_MARGIN, bottom: MINIMAP_BOTTOM_CLEARANCE, left: 'auto', top: 'auto' },
  'bottom-left': { left: MINIMAP_MARGIN, bottom: MINIMAP_BOTTOM_CLEARANCE, right: 'auto', top: 'auto' },
  'top-right': { right: MINIMAP_MARGIN, top: MINIMAP_MARGIN, left: 'auto', bottom: 'auto' },
  'top-left': { left: MINIMAP_MARGIN, top: MINIMAP_MARGIN, right: 'auto', bottom: 'auto' },
};

interface MinimapWidgetProps {
  containerRef: RefObject<HTMLDivElement | null>;
}

export const MinimapWidget = ({ containerRef }: MinimapWidgetProps) => {
  const [corner, setCorner] = useState<Corner>('bottom-right');
  const [collapsed, setCollapsed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const dragPosRef = useRef({ x: 0, y: 0 });

  const cardHeight = collapsed ? MINIMAP_HEADER_HEIGHT : MINIMAP_HEADER_HEIGHT + MINIMAP_BODY_HEIGHT;

  const snapToNearestCorner = useCallback(
    (x: number, y: number) => {
      const bounds = containerRef.current?.getBoundingClientRect();
      if (!bounds) return;

      const centerX = x + MINIMAP_CARD_WIDTH / 2;
      const centerY = y + cardHeight / 2;
      const midX = bounds.width / 2;
      const midY = bounds.height / 2;

      if (centerY < midY) {
        setCorner(centerX < midX ? 'top-left' : 'top-right');
      } else {
        setCorner(centerX < midX ? 'bottom-left' : 'bottom-right');
      }
    },
    [containerRef, cardHeight],
  );

  const handleHeaderPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button')) return;

    const bounds = containerRef.current?.getBoundingClientRect();
    const card = (event.currentTarget as HTMLElement).closest('.minimap-card');
    if (!bounds || !card) return;

    const cardRect = card.getBoundingClientRect();
    dragOffset.current = {
      x: event.clientX - cardRect.left,
      y: event.clientY - cardRect.top,
    };

    const startPos = {
      x: cardRect.left - bounds.left,
      y: cardRect.top - bounds.top,
    };
    dragPosRef.current = startPos;
    setDragPos(startPos);
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  useEffect(() => {
    if (!dragging) return;

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = containerRef.current?.getBoundingClientRect();
      if (!bounds) return;

      const maxX = bounds.width - MINIMAP_CARD_WIDTH - MINIMAP_MARGIN;
      const maxY = bounds.height - cardHeight - MINIMAP_MARGIN;

      const x = Math.min(
        Math.max(MINIMAP_MARGIN, event.clientX - bounds.left - dragOffset.current.x),
        maxX,
      );
      const y = Math.min(
        Math.max(MINIMAP_MARGIN, event.clientY - bounds.top - dragOffset.current.y),
        maxY,
      );

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

  const panelStyle: CSSProperties = dragging
    ? { margin: 0, left: dragPos.x, top: dragPos.y, right: 'auto', bottom: 'auto' }
    : { margin: 0, ...CORNER_STYLES[corner] };

  return (
    <Panel position="bottom-right" className="minimap-panel" style={panelStyle}>
      <div
        className={`minimap-card ${collapsed ? 'minimap-card--collapsed' : ''} ${dragging ? 'minimap-card--dragging' : ''}`}
      >
        <div
          className="minimap-header"
          onPointerDown={handleHeaderPointerDown}
          role="toolbar"
          aria-label="Canvas overview controls"
        >
          <span className="minimap-drag-hint" aria-hidden="true">
            ⠿
          </span>
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
              <span className="minimap-collapse-icon" aria-hidden="true">
                ▴
              </span>
            </button>
          </div>
        </div>
        <div className={`minimap-body ${collapsed ? 'minimap-body--collapsed' : ''}`}>
          <div className="minimap-body-inner">
            <MiniMap
              className="canvas-minimap"
              nodeStrokeColor={() => MINIMAP_COLORS.nodeStroke}
              nodeColor={() => MINIMAP_COLORS.nodeFill}
              nodeBorderRadius={6}
              maskColor={MINIMAP_COLORS.maskColor}
              maskStrokeColor={MINIMAP_COLORS.maskStrokeColor}
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
