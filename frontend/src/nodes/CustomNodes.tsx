import React from 'react';
import { BaseNode, NodeSchema } from './BaseNode.tsx';

const API_SCHEMA: NodeSchema = {
  title: 'API Request Gateway',
  icon: '⚡',
  color: 'bg-blue-50/50 text-blue-700',
  fields: [
    { type: 'select', key: 'method', label: 'HTTP Method', default: 'POST', options: [{ label: 'GET', value: 'GET' }, { label: 'POST', value: 'POST' }] },
    { type: 'text', key: 'url', label: 'Target URL', default: 'https://api.vectorshift.ai/v1' }
  ],
  handles: [{ id: 'in', type: 'target', position: 'Left' }, { id: 'out', type: 'source', position: 'Right' }]
};

const ROUTER_SCHEMA: NodeSchema = {
  title: 'Conditional Router',
  icon: '🔀',
  color: 'bg-amber-50/50 text-amber-700',
  fields: [{ type: 'text', key: 'condition', label: 'Condition Syntax', default: 'input === true' }],
  handles: [{ id: 'in', type: 'target', position: 'Left' }, { id: 'true', type: 'source', position: 'Right' }, { id: 'false', type: 'source', position: 'Right' }]
};

const PARSER_SCHEMA: NodeSchema = {
  title: 'JSON Schema Parser',
  icon: '📦',
  color: 'bg-cyan-50/50 text-cyan-700',
  fields: [{ type: 'text', key: 'path', label: 'Extraction Path', default: '$.data.payload' }],
  handles: [{ id: 'raw', type: 'target', position: 'Left' }, { id: 'parsed', type: 'source', position: 'Right' }]
};

const AUTH_SCHEMA: NodeSchema = {
  title: 'Bearer Token Auth',
  icon: '🔐',
  color: 'bg-slate-50/50 text-slate-700',
  fields: [{ type: 'text', key: 'token', label: 'Secret Token Pass', default: 'ENV_SECRET' }],
  handles: [{ id: 'auth-out', type: 'source', position: 'Right' }]
};

const DELAY_SCHEMA: NodeSchema = {
  title: 'Delay Timer Execution',
  icon: '⏱',
  color: 'bg-orange-50/50 text-orange-700',
  fields: [{ type: 'number', key: 'ms', label: 'Wait Interval (ms)', default: 1000 }],
  handles: [{ id: 'in', type: 'target', position: 'Left' }, { id: 'out', type: 'source', position: 'Right' }]
};

export const APIRequestNode = ({ id, data }: any) => <BaseNode id={id} data={data} schema={API_SCHEMA} />;
export const ConditionalRouterNode = ({ id, data }: any) => <BaseNode id={id} data={data} schema={ROUTER_SCHEMA} />;
export const JSONParserNode = ({ id, data }: any) => <BaseNode id={id} data={data} schema={PARSER_SCHEMA} />;
export const AuthNode = ({ id, data }: any) => <BaseNode id={id} data={data} schema={AUTH_SCHEMA} />;
export const DelayNode = ({ id, data }: any) => <BaseNode id={id} data={data} schema={DELAY_SCHEMA} />;