import type { NodeSchema } from '../../types/nodes';

export const ROUTER_SCHEMA: NodeSchema = {
  title: 'Conditional Router',
  icon: '🔀',
  headerVariant: 'hdr-router',
  fields: [
    { type: 'text', key: 'condition', label: 'Condition Syntax', default: 'input === true' },
  ],
  handles: [
    { id: 'in', type: 'target', position: 'Left' },
    { id: 'true', type: 'source', position: 'Right' },
    { id: 'false', type: 'source', position: 'Right' },
  ],
};

export const DELAY_SCHEMA: NodeSchema = {
  title: 'Delay Timer',
  icon: '⏱',
  headerVariant: 'hdr-delay',
  fields: [
    { type: 'number', key: 'ms', label: 'Wait Interval (ms)', default: 1000, step: 100 },
  ],
  handles: [
    { id: 'in', type: 'target', position: 'Left' },
    { id: 'out', type: 'source', position: 'Right' },
  ],
};
