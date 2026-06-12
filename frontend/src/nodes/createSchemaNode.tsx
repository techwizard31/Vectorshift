import type { NodeProps } from 'reactflow';
import type { NodeSchema, NodeData } from '../types/nodes';
import { BaseNode } from './BaseNode';

export function createSchemaNode(schema: NodeSchema) {
  const SchemaNode = ({ id, data }: NodeProps<NodeData>) => (
    <BaseNode id={id} data={data} schema={schema} />
  );
  SchemaNode.displayName = `SchemaNode(${schema.title})`;
  return SchemaNode;
}
