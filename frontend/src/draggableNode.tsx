import React from 'react';
import { motion } from 'motion/react';

interface DraggableNodeProps {
  type: string;
  label: string;
  icon: string;
  index?: number;
}

export const DraggableNode = ({ type, label, icon, index = 0 }: DraggableNodeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      draggable
      title={label}
      onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
        e.dataTransfer.effectAllowed = 'move';
      }}
      className="draggable-node"
    >
      <span className="draggable-node-icon">{icon}</span>
      <span className="draggable-node-label">{label}</span>
    </motion.div>
  );
};
