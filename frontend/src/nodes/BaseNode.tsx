import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { useStore } from "../store.ts";
import { CustomSelect } from "../components/CustomSelect.tsx";
import { NodeDeleteButton } from "../components/NodeDeleteButton.tsx";

export interface NodeField {
  type: "text" | "number" | "select";
  key: string;
  label: string;
  default?: any;
  options?: { label: string; value: string }[];
}

export interface NodeHandle {
  id: string;
  type: "source" | "target";
  position: "Left" | "Right" | "Top" | "Bottom";
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

export const BaseNode = memo(
  ({ id, data, schema, children }: BaseNodeProps) => {
    const updateNodeField = useStore((state) => state.updateNodeField);

    const getHandleStyle = (handle: NodeHandle) => {
      const sideHandles = schema.handles.filter(
        (h) => h.position === handle.position,
      );
      const idx = sideHandles.findIndex((h) => h.id === handle.id);
      const pct = ((idx + 1) / (sideHandles.length + 1)) * 100;
      return { top: `${pct}%` };
    };

    return (
      <div className="base-node">
        <div className={`node-accent-stripe ${schema.color}`} />
        <div className={`node-header ${schema.color}`}>
          <span>{schema.icon}</span>
          <span className="node-title">{schema.title}</span>
          <NodeDeleteButton nodeId={id} />
        </div>
        {/* Inputs Layout Frame */}
        <div className="node-body">
          {schema.fields?.map((field) => (
            <div key={field.key} className="form-group">
              <label className="form-label">{field.label}</label>
              {field.type === "select" ? (
                <CustomSelect
                  value={data[field.key] ?? field.default}
                  options={field.options ?? []}
                  onChange={(val) => updateNodeField(id, field.key, val)}
                />
              ) : field.type === "number" ? (
                <div className="form-number-wrap">
                  <input
                    type="number"
                    value={data[field.key] ?? field.default ?? ""}
                    onChange={(e) =>
                      updateNodeField(id, field.key, e.target.value)
                    }
                    className="form-input form-input-number"
                  />
                  <div className="form-number-steppers">
                    <button
                      type="button"
                      className="form-number-step form-number-step--up"
                      aria-label="Increase value"
                      onClick={() => {
                        const step = field.key === "ms" ? 100 : 1;
                        const current = Number(data[field.key] ?? field.default ?? 0);
                        updateNodeField(id, field.key, String(current + step));
                      }}
                    />
                    <button
                      type="button"
                      className="form-number-step form-number-step--down"
                      aria-label="Decrease value"
                      onClick={() => {
                        const step = field.key === "ms" ? 100 : 1;
                        const current = Number(data[field.key] ?? field.default ?? 0);
                        updateNodeField(id, field.key, String(Math.max(0, current - step)));
                      }}
                    />
                  </div>
                </div>
              ) : (
                <input
                  type={field.type}
                  value={data[field.key] ?? field.default ?? ""}
                  onChange={(e) =>
                    updateNodeField(id, field.key, e.target.value)
                  }
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
            style={getHandleStyle(handle)} // Inline background fields removed so stylesheet handles it perfectly
          />
        ))}
      </div>
    );
  },
  (prev, next) => {
    return (
      prev.id === next.id &&
      JSON.stringify(prev.data) === JSON.stringify(next.data)
    );
  },
);

BaseNode.displayName = "BaseNode";
