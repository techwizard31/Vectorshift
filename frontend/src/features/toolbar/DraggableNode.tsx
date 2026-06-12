import { type DragEvent } from 'react';
import { motion } from 'motion/react';
import { DRAG_DATA_FORMAT } from '../../constants/canvas';
import { STAGGER_ITEM } from '../../constants/motion';
import type { NodeType } from '../../types/nodes';

interface DraggableNodeProps {
  type: NodeType;
  label: string;
  icon: string;
  index: number;
}

export const DraggableNode = ({ type, label, icon, index }: DraggableNodeProps) => {
  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData(DRAG_DATA_FORMAT, JSON.stringify({ nodeType: type }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * STAGGER_ITEM.delayMultiplier,
        duration: STAGGER_ITEM.duration,
        ease: STAGGER_ITEM.ease,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div draggable title={label} onDragStart={handleDragStart} className="draggable-node">
        <span className="draggable-node-icon">{icon}</span>
        <span className="draggable-node-label">{label}</span>
      </div>
    </motion.div>
  );
};
