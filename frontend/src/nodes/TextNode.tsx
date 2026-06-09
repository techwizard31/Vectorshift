import React, { useState, useEffect, useMemo } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store.ts';

const MIN_WIDTH = 220;
const MAX_WIDTH = 600;
const MIN_HEIGHT = 90;
const CHAR_WIDTH_ESTIMATE = 8.5;

export const TextNode = ({ id, data }: any) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [text, setText] = useState(data.text || '');
  const [dimensions, setDimensions] = useState({ width: MIN_WIDTH, height: MIN_HEIGHT });

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
    
    const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, longestLine * CHAR_WIDTH_ESTIMATE + 45));
    const newHeight = Math.min(400, Math.max(MIN_HEIGHT, lines.length * 22 + 65));
    
    setDimensions({ width: newWidth, height: newHeight });
    updateNodeField(id, 'text', text);
  }, [text, id, updateNodeField]);

  return (
    <div
      className="base-node"
      style={{
        width: dimensions.width,
        minHeight: dimensions.height,
        transition: 'width 0.15s ease, height 0.15s ease'
      }}
    >
      <div className="node-header hdr-text">
        <span>📝</span>
        <span className="node-title">Dynamic Text Template</span>
      </div>

      <div className="node-body">
        <div className="form-group">
          <label className="form-label">Text Content Prompt</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type variables using {{ param }}"
            className="form-textarea"
            style={{ height: Math.max(50, dimensions.height - 75) }}
          />
        </div>
      </div>

      <Handle type="source" position={Position.Right} id="output" style={{ width: 9, height: 9, backgroundColor: '#6366f1', border: '2px solid #fff' }} />

      {variables.map((varName, idx) => {
        const pct = ((idx + 1) / (variables.length + 1)) * 100;
        const handleId = `${id}-var-${varName}`;
        return (
          <div key={handleId}>
            <Handle
              type="target"
              position={Position.Left}
              id={handleId}
              style={{
                top: `${pct}%`,
                width: 9,
                height: 9,
                backgroundColor: '#3b82f6',
                border: '2px solid #fff'
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: -78,
                top: `${pct}%`,
                transform: 'translateY(-50%)',
                fontSize: 10,
                fontWeight: 600,
                color: '#475569',
                backgroundColor: '#f1f5f9',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid #e2e8f0',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                fontFamily: 'sans-serif'
              }}
            >
              {varName}
            </div>
          </div>
        );
      })}
    </div>
  );
};