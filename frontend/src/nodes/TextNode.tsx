import React, { useState, useEffect, useMemo } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store.ts';
import { NodeDeleteButton } from '../components/NodeDeleteButton.tsx';

const MIN_WIDTH = 220;
const MAX_WIDTH = 600;
const CHAR_WIDTH_ESTIMATE = 8.5;

export const TextNode = ({ id, data }: any) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [text, setText] = useState(data.text || '');
  const [dimensions, setDimensions] = useState({ width: MIN_WIDTH, height: 2 });

  const variables = useMemo(() => {
    const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
    const matches: string[] = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      if (!matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }
    return matches;
  }, [text]);

  useEffect(() => {
    const lines = text.split('\n');
    const longestLine = Math.max(...lines.map((l: string) => l.length), 0);

    const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, longestLine * CHAR_WIDTH_ESTIMATE + 52));
    const lineCount = Math.max(lines.length, 2);

    setDimensions({ width: newWidth, height: lineCount });
    updateNodeField(id, 'text', text);
  }, [text, id, updateNodeField]);

  const lineCount = dimensions.height;

  return (
    <div
      className="base-node text-node-elastic"
      style={{ width: dimensions.width }}
    >
      <div className="node-accent-stripe hdr-text" />
      <div className="node-header hdr-text">
        <span>📝</span>
        <span className="node-title">Dynamic Text Template</span>
        <NodeDeleteButton nodeId={id} />
      </div>

      <div className="node-body">
        <div className="form-group">
          <label className="form-label">Text Content Prompt</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type variables using {{ param }}"
            className="form-textarea text-node-textarea"
            rows={lineCount}
          />
        </div>
      </div>

      <Handle type="source" position={Position.Right} id="output" />

      {variables.map((varName, idx) => {
        const pct = ((idx + 1) / (variables.length + 1)) * 100;
        const handleId = `${id}-var-${varName}`;
        return (
          <React.Fragment key={handleId}>
            <Handle
              type="target"
              position={Position.Left}
              id={handleId}
              style={{ top: `${pct}%` }}
            />
            <div
              className="text-node-var-label"
              style={{ top: `${pct}%` }}
            >
              {varName}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
