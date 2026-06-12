import { Fragment, useState, useEffect, useMemo } from 'react';
import type { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';
import { usePipelineStore } from '../store/pipelineStore';
import { NodeChrome } from '../components/NodeChrome';
import { TEXT_SCHEMA } from './schemas/core';
import type { NodeData } from '../types/nodes';
import {
  TEXT_NODE_CHAR_WIDTH_ESTIMATE,
  TEXT_NODE_HORIZONTAL_PADDING,
  TEXT_NODE_MAX_WIDTH,
  TEXT_NODE_MIN_ROWS,
  TEXT_NODE_MIN_WIDTH,
} from '../constants/layout';
import { getDistributedHandleStyle } from '../utils/handleLayout';

const VARIABLE_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

export const TextNode = ({ id, data }: NodeProps<NodeData>) => {
  const updateNodeField = usePipelineStore((state) => state.updateNodeField);
  const [text, setText] = useState(String(data.text ?? ''));
  const [width, setWidth] = useState(TEXT_NODE_MIN_WIDTH);
  const [rowCount, setRowCount] = useState(TEXT_NODE_MIN_ROWS);

  const variables = useMemo(() => {
    const matches: string[] = [];
    let match: RegExpExecArray | null;
    const regex = new RegExp(VARIABLE_REGEX.source, VARIABLE_REGEX.flags);
    while ((match = regex.exec(text)) !== null) {
      if (!matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }
    return matches;
  }, [text]);

  useEffect(() => {
    const lines = text.split('\n');
    const longestLine = Math.max(...lines.map((line) => line.length), 0);
    const nextWidth = Math.min(
      TEXT_NODE_MAX_WIDTH,
      Math.max(TEXT_NODE_MIN_WIDTH, longestLine * TEXT_NODE_CHAR_WIDTH_ESTIMATE + TEXT_NODE_HORIZONTAL_PADDING),
    );
    setWidth(nextWidth);
    setRowCount(Math.max(lines.length, TEXT_NODE_MIN_ROWS));
    updateNodeField(id, 'text', text);
  }, [text, id, updateNodeField]);

  return (
    <div className="base-node text-node-elastic" style={{ width }}>
      <NodeChrome
        nodeId={id}
        icon={TEXT_SCHEMA.icon}
        title={TEXT_SCHEMA.title}
        headerVariant={TEXT_SCHEMA.headerVariant}
      />
      <div className="node-body">
        <div className="form-group">
          <label className="form-label">Text Content Prompt</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type variables using {{ param }}"
            className="form-textarea text-node-textarea"
            rows={rowCount}
          />
        </div>
      </div>

      <Handle type="source" position={Position.Right} id="output" />

      {variables.map((varName, index) => {
        const handleId = `${id}-var-${varName}`;
        const handleStyle = getDistributedHandleStyle(index, variables.length);
        return (
          <Fragment key={handleId}>
            <Handle
              type="target"
              position={Position.Left}
              id={handleId}
              style={handleStyle}
            />
            <div className="text-node-var-label" style={handleStyle}>
              {varName}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};
