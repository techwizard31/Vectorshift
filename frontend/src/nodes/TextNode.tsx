import React, { useState, useEffect, useMemo } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store.ts';

const MIN_WIDTH = 220;
const MAX_WIDTH = 600;
const MIN_HEIGHT = 90;
const CHAR_WIDTH_ESTIMATE = 8.5; // Optimized monospace width scalar ratio

export const TextNode = ({ id, data }: any) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [text, setText] = useState(data.text || '');
  const [dimensions, setDimensions] = useState({ width: MIN_WIDTH, height: MIN_HEIGHT });

  // Tokenized extraction logic running safely via memoized text changes
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
    
    // Explicit dynamic width and height tracking
    const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, longestLine * CHAR_WIDTH_ESTIMATE + 45));
    const newHeight = Math.min(400, Math.max(MIN_HEIGHT, lines.length * 22 + 65));
    
    setDimensions({ width: newWidth, height: newHeight });
    updateNodeField(id, 'text', text);
  }, [text, id, updateNodeField]);

  return (
    <div
      className="rounded-xl border shadow-lg bg-white overflow-hidden border-neutral-200"
      style={{
        width: dimensions.width,
        minHeight: dimensions.height,
        fontFamily: 'Inter, sans-serif',
        transition: 'width 0.15s ease, height 0.15s ease' // Premium responsive snap transitions
      }}
    >
      <div className="px-4 py-2.5 flex items-center gap-2 border-b border-neutral-100 bg-indigo-50/50 text-indigo-700">
        <span className="text-base">📝</span>
        <span className="text-sm font-semibold text-neutral-800">Dynamic Text Template</span>
      </div>

      <div className="p-4 flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-500">Text Content Prompt</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type variables using {{ param }}"
          className="w-full text-xs p-2 border border-neutral-200 rounded-md bg-neutral-50 text-neutral-700 outline-none focus:border-indigo-500 resize-none font-mono"
          style={{ height: Math.max(50, dimensions.height - 75) }}
        />
      </div>

      {/* Main Base Output Anchor */}
      <Handle type="source" position={Position.Right} id="output" style={{ width: 9, height: 9, backgroundColor: '#6366f1', border: '2px solid #fff' }} />

      {/* Stable Variables Handle Mapping with Dynamic Left Text Tags */}
      {variables.map((varName, idx) => {
        const pct = ((idx + 1) / (variables.length + 1)) * 100;
        const handleId = `${id}-var-${varName}`; // Connection persistence identifier stability
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
                pointerEvents: 'none'
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