import type { ComponentType } from 'react';
import type { NodeProps } from 'reactflow';
import type { NodeCategory, NodeSchema, NodeType, NodeData } from '../types/nodes';
import { createSchemaNode } from './createSchemaNode';
import { TextNode } from './TextNode';
import { INPUT_SCHEMA, OUTPUT_SCHEMA, LLM_SCHEMA, TEXT_SCHEMA } from './schemas/core';
import { ROUTER_SCHEMA, DELAY_SCHEMA } from './schemas/logic';
import { API_SCHEMA, PARSER_SCHEMA, AUTH_SCHEMA } from './schemas/integrations';

export interface NodeDefinition {
  type: NodeType;
  category: NodeCategory;
  schema: NodeSchema;
  component: ComponentType<NodeProps<NodeData>>;
}

export const NODE_DEFINITIONS: NodeDefinition[] = [
  { type: 'customInput', category: 'core', schema: INPUT_SCHEMA, component: createSchemaNode(INPUT_SCHEMA) },
  { type: 'llm', category: 'core', schema: LLM_SCHEMA, component: createSchemaNode(LLM_SCHEMA) },
  { type: 'customOutput', category: 'core', schema: OUTPUT_SCHEMA, component: createSchemaNode(OUTPUT_SCHEMA) },
  { type: 'text', category: 'core', schema: TEXT_SCHEMA, component: TextNode },
  { type: 'conditionalRouter', category: 'logic', schema: ROUTER_SCHEMA, component: createSchemaNode(ROUTER_SCHEMA) },
  { type: 'delayNode', category: 'logic', schema: DELAY_SCHEMA, component: createSchemaNode(DELAY_SCHEMA) },
  { type: 'apiRequest', category: 'integrations', schema: API_SCHEMA, component: createSchemaNode(API_SCHEMA) },
  { type: 'jsonParser', category: 'integrations', schema: PARSER_SCHEMA, component: createSchemaNode(PARSER_SCHEMA) },
  { type: 'authNode', category: 'integrations', schema: AUTH_SCHEMA, component: createSchemaNode(AUTH_SCHEMA) },
];

export const NODE_TYPES = Object.fromEntries(
  NODE_DEFINITIONS.map((def) => [def.type, def.component]),
) as Record<NodeType, ComponentType<NodeProps<NodeData>>>;

const CATEGORY_LABELS: Record<NodeCategory, string> = {
  core: 'Core',
  logic: 'Logic',
  integrations: 'Integrations',
};

export const TOOLBAR_SECTIONS = (Object.keys(CATEGORY_LABELS) as NodeCategory[]).map((category) => ({
  title: CATEGORY_LABELS[category],
  nodes: NODE_DEFINITIONS.filter((def) => def.category === category).map((def) => ({
    type: def.type,
    label: def.schema.title,
    icon: def.schema.icon,
  })),
}));

export function getNodeDefinition(type: string): NodeDefinition | undefined {
  return NODE_DEFINITIONS.find((def) => def.type === type);
}
