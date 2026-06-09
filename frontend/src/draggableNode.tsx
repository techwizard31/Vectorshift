// src/draggableNode.tsx
import React from 'react';

export const DraggableNode = ({ type, label, icon }: { type: string; label: string; icon: string }) => {
  return (
    <div
      onDragStart={(e) => {
        e.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
        e.dataTransfer.effectAllowed = 'move';
      }}
      draggable
      className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-xl cursor-grab hover:shadow-md transition-all active:cursor-grabbing text-xs font-semibold text-neutral-700 select-none"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
};