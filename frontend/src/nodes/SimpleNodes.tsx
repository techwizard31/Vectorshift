import React from 'react';
import { BaseNode, NodeSchema } from './BaseNode.tsx';

const INPUT_SCHEMA: NodeSchema = {
  title: 'Input Trigger',
  icon: '📥',
  color: 'hdr-input', // Targets direct plain CSS color layouts
  fields: [
    { type: 'text', key: 'inputName', label: 'Field Name', default: 'input_1' },
    { type: 'select', key: 'inputType', label: 'Data Type', default: 'Text', options: [{ label: 'Text', value: 'Text' }, { label: 'File', value: 'File' }] }
  ],
  handles: [{ id: 'output', type: 'source', position: 'Right' }]
};

const OUTPUT_SCHEMA: NodeSchema = {
  title: 'Output Response',
  icon: '📤',
  color: 'hdr-output',
  fields: [
    { type: 'text', key: 'outputName', label: 'Output Name', default: 'response_data' },
    { type: 'select', key: 'outputType', label: 'Format Type', default: 'JSON', options: [{ label: 'JSON', value: 'JSON' }, { label: 'Plain Text', value: 'Plain Text' }] }
  ],
  handles: [{ id: 'input', type: 'target', position: 'Left' }]
};

const LLM_SCHEMA: NodeSchema = {
  title: 'LLM Engine',
  icon: '🧠',
  color: 'hdr-llm',
  fields: [
    { type: 'select', key: 'model', label: 'Model Core', default: 'gpt-4o', options: [{ label: 'GPT-4o', value: 'gpt-4o' }, { label: 'Llama-3-70B', value: 'llama3' }] }
  ],
  handles: [
    { id: 'system', type: 'target', position: 'Left' },
    { id: 'prompt', type: 'target', position: 'Left' },
    { id: 'response', type: 'source', position: 'Right' }
  ]
};

export const InputNode = ({ id, data }: any) => <BaseNode id={id} data={data} schema={INPUT_SCHEMA} />;
export const OutputNode = ({ id, data }: any) => <BaseNode id={id} data={data} schema={OUTPUT_SCHEMA} />;
export const LLMNode = ({ id, data }: any) => <BaseNode id={id} data={data} schema={LLM_SCHEMA} />;