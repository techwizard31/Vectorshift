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
    <div className="base-node">
      {/* Node Header */}
      <div className={`node-header ${schema.color}`}>
        <span>{schema.icon}</span>
        <span className="node-title">{schema.title}</span>
      </div>

      {/* Inputs Layout Frame */}
      <div className="node-body">
        {schema.fields?.map((field) => (
          <div key={field.key} className="form-group">
            <label className="form-label">{field.label}</label>
            {field.type === 'select' ? (
              <select
                value={data[field.key] ?? field.default}
                onChange={(e) => updateNodeField(id, field.key, e.target.value)}
                className="form-select"
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
                className="form-input"
              />
            )}
          </div>
        ))}
        {children}
      </div>

      {/* Canvas Wire Hooks */}
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
  return prev.id === next.id && JSON.stringify(prev.data) === JSON.stringify(next.data);
});

BaseNode.displayName = 'BaseNode';