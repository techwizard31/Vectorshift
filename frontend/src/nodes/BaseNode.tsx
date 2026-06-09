import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store.ts';

export interface NodeField {
  type: 'text' | 'number' | 'select';
  key: string;
  label: string;
  default?: any;
  options?: { label: string; value: string }[];
}

export interface NodeHandle {
  id: string;
  type: 'source' | 'target';
  position: 'Left' | 'Right' | 'Top' | 'Bottom';
  label?: string;
}

export interface NodeSchema {
  title: string;
  icon: string;
  color: string;
  fields?: NodeField[];
  handles: NodeHandle[];
}

interface BaseNodeProps {
  id: string;
  data: any;
  schema: NodeSchema;
  children?: React.ReactNode;
}

const positionMap = {
  Left: Position.Left,
  Right: Position.Right,
  Top: Position.Top,
  Bottom: Position.Bottom,
};

export const BaseNode = memo(({ id, data, schema, children }: BaseNodeProps) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const getHandleStyle = (handle: NodeHandle) => {
    const sideHandles = schema.handles.filter((h) => h.position === handle.position);
    const idx = sideHandles.findIndex((h) => h.id === handle.id);
    const pct = ((idx + 1) / (sideHandles.length + 1)) * 100;
    return { top: `${pct}%` };
  };

  return (
    <div className={`rounded-xl border shadow-lg bg-white overflow-hidden border-neutral-200 transition-shadow hover:shadow-xl`} style={{ width: 240, fontFamily: 'Inter, sans-serif' }}>
      {/* Node Header */}
      <div className={`px-4 py-2.5 flex items-center gap-2 border-b border-neutral-100 ${schema.color}`}>
        <span className="text-base">{schema.icon}</span>
        <span className="text-sm font-semibold text-neutral-800">{schema.title}</span>
      </div>

      {/* Inputs / Fields Layout */}
      <div className="p-4 space-y-3 bg-white">
        {schema.fields?.map((field) => (
          <div key={field.key} className="flex flex-col gap-1">
            <label className="text-xs font-medium text-neutral-500">{field.label}</label>
            {field.type === 'select' ? (
              <select
                value={data[field.key] ?? field.default}
                onChange={(e) => updateNodeField(id, field.key, e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 rounded-md bg-neutral-50 text-neutral-700 outline-none focus:border-indigo-500"
              >
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                value={data[field.key] ?? field.default ?? ''}
                onChange={(e) => updateNodeField(id, field.key, e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-neutral-200 rounded-md bg-neutral-50 text-neutral-700 outline-none focus:border-indigo-500"
              />
            )}
          </div>
        ))}
        {children}
      </div>

      {/* Dynamic Render Canvas Connection Points */}
      {schema.handles.map((handle) => (
        <Handle
          key={handle.id}
          id={handle.id}
          type={handle.type}
          position={positionMap[handle.position]}
          style={{
            ...getHandleStyle(handle),
            width: 9,
            height: 9,
            backgroundColor: handle.type === 'source' ? '#6366f1' : '#3b82f6',
            border: '2px solid #fff',
          }}
        />
      ))}
    </div>
  );
}, (prev, next) => {
  // Optimization: Strict deep comparator block overrides panning/zoom re-renders completely
  return prev.id === next.id && JSON.stringify(prev.data) === JSON.stringify(next.data);
});

BaseNode.displayName = 'BaseNode';