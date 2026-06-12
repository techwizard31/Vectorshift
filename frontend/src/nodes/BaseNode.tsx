import { memo, type ReactNode } from 'react';
import { Handle, Position } from 'reactflow';
import { usePipelineStore } from '../store/pipelineStore';
import { CustomSelect } from '../components/CustomSelect';
import { NodeChrome } from '../components/NodeChrome';
import type { NodeData, NodeField, NodeHandle, NodeSchema } from '../types/nodes';
import { getDistributedHandleStyle } from '../utils/handleLayout';

interface BaseNodeProps {
  id: string;
  data: NodeData;
  schema: NodeSchema;
  children?: ReactNode;
}

const positionMap = {
  Left: Position.Left,
  Right: Position.Right,
  Top: Position.Top,
  Bottom: Position.Bottom,
};

function getNumberStep(field: NodeField): number {
  return field.step ?? 1;
}

function getHandleStyle(schema: NodeSchema, handle: NodeHandle) {
  const sideHandles = schema.handles.filter((h) => h.position === handle.position);
  const index = sideHandles.findIndex((h) => h.id === handle.id);
  return getDistributedHandleStyle(index, sideHandles.length);
}

export const BaseNode = memo(
  ({ id, data, schema, children }: BaseNodeProps) => {
    const updateNodeField = usePipelineStore((state) => state.updateNodeField);

    const adjustNumberField = (field: NodeField, direction: 1 | -1) => {
      const step = getNumberStep(field);
      const current = Number(data[field.key] ?? field.default ?? 0);
      const next = direction === 1 ? current + step : Math.max(0, current - step);
      updateNodeField(id, field.key, String(next));
    };

    return (
      <div className="base-node">
        <NodeChrome
          nodeId={id}
          icon={schema.icon}
          title={schema.title}
          headerVariant={schema.headerVariant}
        />
        <div className="node-body">
          {schema.fields?.map((field) => (
            <div key={field.key} className="form-group">
              <label className="form-label">{field.label}</label>
              {field.type === 'select' ? (
                <CustomSelect
                  value={String(data[field.key] ?? field.default ?? '')}
                  options={field.options ?? []}
                  onChange={(value) => updateNodeField(id, field.key, value)}
                />
              ) : field.type === 'number' ? (
                <div className="form-number-wrap">
                  <input
                    type="number"
                    value={data[field.key] ?? field.default ?? ''}
                    onChange={(e) => updateNodeField(id, field.key, e.target.value)}
                    className="form-input form-input-number"
                  />
                  <div className="form-number-steppers">
                    <button
                      type="button"
                      className="form-number-step form-number-step--up"
                      aria-label="Increase value"
                      onClick={() => adjustNumberField(field, 1)}
                    />
                    <button
                      type="button"
                      className="form-number-step form-number-step--down"
                      aria-label="Decrease value"
                      onClick={() => adjustNumberField(field, -1)}
                    />
                  </div>
                </div>
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
        {schema.handles.map((handle) => (
          <Handle
            key={handle.id}
            id={handle.id}
            type={handle.type}
            position={positionMap[handle.position]}
            style={getHandleStyle(schema, handle)}
          />
        ))}
      </div>
    );
  },
  (prev, next) =>
    prev.id === next.id && JSON.stringify(prev.data) === JSON.stringify(next.data),
);

BaseNode.displayName = 'BaseNode';
