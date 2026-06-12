export interface NodeField {
  type: 'text' | 'number' | 'select';
  key: string;
  label: string;
  default?: string | number;
  step?: number;
  options?: { label: string; value: string }[];
}

export interface NodeHandle {
  id: string;
  type: 'source' | 'target';
  position: 'Left' | 'Right' | 'Top' | 'Bottom';
  label?: string;
}

export interface NodeSchema {
  title: string;
  icon: string;
  headerVariant: string;
  fields?: NodeField[];
  handles: NodeHandle[];
}

export type NodeCategory = 'core' | 'logic' | 'integrations';

export type NodeType =
  | 'customInput'
  | 'customOutput'
  | 'llm'
  | 'text'
  | 'conditionalRouter'
  | 'delayNode'
  | 'apiRequest'
  | 'jsonParser'
  | 'authNode';

export interface NodeData {
  [fieldKey: string]: string | number | undefined;
}
