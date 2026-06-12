import { NodeDeleteButton } from './NodeDeleteButton';

interface NodeChromeProps {
  nodeId: string;
  icon: string;
  title: string;
  headerVariant: string;
}

export const NodeChrome = ({ nodeId, icon, title, headerVariant }: NodeChromeProps) => (
  <div className={`node-header ${headerVariant}`}>
    <span>{icon}</span>
    <span className="node-title">{title}</span>
    <NodeDeleteButton nodeId={nodeId} />
  </div>
);
