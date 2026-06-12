import type { NodeSchema } from '../../types/nodes';

export const API_SCHEMA: NodeSchema = {
  title: 'API Gateway',
  icon: '⚡',
  headerVariant: 'hdr-api',
  fields: [
    {
      type: 'select',
      key: 'method',
      label: 'HTTP Method',
      default: 'POST',
      options: [
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
      ],
    },
    { type: 'text', key: 'url', label: 'Target URL', default: 'https://api.vectorshift.ai/v1' },
  ],
  handles: [
    { id: 'in', type: 'target', position: 'Left' },
    { id: 'out', type: 'source', position: 'Right' },
  ],
};

export const PARSER_SCHEMA: NodeSchema = {
  title: 'JSON Parser',
  icon: '📦',
  headerVariant: 'hdr-parser',
  fields: [
    { type: 'text', key: 'path', label: 'Extraction Path', default: '$.data.payload' },
  ],
  handles: [
    { id: 'raw', type: 'target', position: 'Left' },
    { id: 'parsed', type: 'source', position: 'Right' },
  ],
};

export const AUTH_SCHEMA: NodeSchema = {
  title: 'Bearer Auth',
  icon: '🔐',
  headerVariant: 'hdr-auth',
  fields: [
    { type: 'text', key: 'token', label: 'Secret Token Pass', default: 'ENV_SECRET' },
  ],
  handles: [{ id: 'auth-out', type: 'source', position: 'Right' }],
};
