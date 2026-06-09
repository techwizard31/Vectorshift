import React from 'react';

export const DraggableNode = ({ type, label, icon }: { type: string; label: string; icon: string }) => {
  return (
    <div
      onDragStart={(e) => {
        e.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
        e.dataTransfer.effectAllowed = 'move';
      }}
      draggable
      className="draggable-node"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
};